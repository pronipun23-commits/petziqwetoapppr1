import { useState, useEffect } from 'react';
import {
  Tag, QrCode, PawPrint, ArrowRight, Shield, AlertCircle, Sprout,
  Phone, Mail, User, Send, CheckCircle2, AlertTriangle, MapPin, Loader2, Sparkles
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { SmartTag } from '@/hooks/useSmartTags';

interface TagProfilePageProps {
  tagId: string;
  onNavigate: (path: string) => void;
}

const STORAGE_KEY = 'petziqq_smart_tags';

/** Lifecycle states in which a tag's public profile is live. */
const LIVE_STATUSES: string[] = ['active', 'activated'];

export function TagProfilePage({ tagId, onNavigate }: TagProfilePageProps) {
  const { session } = useAuth();
  const [tag, setTag] = useState<SmartTag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lost & Found states
  const [isLost, setIsLost] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Contact Owner modal states
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [finderName, setFinderName] = useState('');
  const [finderPhone, setFinderPhone] = useState('');
  const [finderMessage, setFinderMessage] = useState('');
  const [finderLocation, setFinderLocation] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [contactError, setContactError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTag() {
      try {
        let loadedTag: SmartTag | null = null;

        // 1. Try public RPC
        const { data: rpcData, error: rpcErr } = await supabase.rpc('get_public_tag_info', {
          p_tag_id: tagId,
        });

        if (!rpcErr && rpcData && typeof rpcData === 'object') {
          const info = rpcData as Record<string, unknown>;
          if (info.found) {
            loadedTag = {
              id: (info.id as string) ?? tagId,
              user_id: (info.user_id as string) ?? '',
              tag_id: (info.tag_id as string) ?? tagId,
              tag_type: (info.tag_type as SmartTag['tag_type']) ?? 'pet',
              name: (info.name as string) ?? (info.pet_name as string) ?? 'Petziq Smart Tag',
              status: (info.status as SmartTag['status']) ?? (info.activated ? 'active' : 'coming_soon'),
              pet_id: null,
              plant_id: null,
              tag_details: (info.tag_details as Record<string, unknown>) ?? {},
              visibility: (info.visibility as Record<string, boolean>) ?? {},
              owner_info: (info.owner_info as Record<string, string>) ?? {},
              photo_url: (info.photo_url as string) ?? null,
              created_at: (info.created_at as string) ?? new Date().toISOString(),
              updated_at: (info.updated_at as string) ?? new Date().toISOString(),
            } as SmartTag;
          }
        }

        // 2. Direct database query
        if (!loadedTag) {
          const { data, error: selErr } = await supabase
            .from('smart_tags')
            .select('*')
            .eq('tag_id', tagId)
            .maybeSingle();

          if (!selErr && data) {
            loadedTag = data as SmartTag;
          }
        }

        // 3. Fallback: local storage
        if (!loadedTag) {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
              const localTags: SmartTag[] = JSON.parse(raw);
              const found = localTags.find((t) => t.tag_id === tagId);
              if (found) loadedTag = found;
            }
          } catch {
            // ignore
          }
        }

        if (loadedTag) {
          setTag(loadedTag);
          const details = (loadedTag.tag_details ?? {}) as Record<string, any>;
          setIsLost(Boolean(details.is_lost));

          // Log scan event notification for the owner
          logScanEvent(loadedTag);
        } else {
          setError('Tag not found');
        }
      } catch {
        setError('Could not load tag information');
      } finally {
        setLoading(false);
      }
    }

    fetchTag();
  }, [tagId]);

  // Log scan event with geolocation so owner is notified with real location
  const logScanEvent = async (scannedTag: SmartTag) => {
    try {
      const recordScan = (coords?: { latitude: number; longitude: number }) => {
        const scanEvent = {
          tag_id: scannedTag.tag_id,
          pet_name: scannedTag.name,
          scanned_at: new Date().toISOString(),
          user_agent: navigator.userAgent,
          location_name: coords
            ? `GPS: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
            : 'QR Tag Scanned by Mobile Device',
          lat: coords?.latitude,
          lng: coords?.longitude,
        };

        const rawScans = localStorage.getItem('petziq_tag_scans') || '[]';
        const scans = JSON.parse(rawScans);
        scans.unshift(scanEvent);
        localStorage.setItem('petziq_tag_scans', JSON.stringify(scans.slice(0, 50)));

        supabase.from('activity_events').insert({
          event_type: 'tag_scanned',
          description: `Smart Tag for ${scannedTag.name} (${scannedTag.tag_id}) was scanned.`,
          metadata: scanEvent,
        }).then(() => {}, () => {});
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => recordScan({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
          () => recordScan(),
          { timeout: 5000, maximumAge: 60000 }
        );
      } else {
        recordScan();
      }
    } catch {
      // ignore
    }
  };

  const isOwner = Boolean(session && tag && tag.user_id && tag.user_id === session.user?.id);

  // Toggle Lost/Found Status
  const handleToggleLost = async () => {
    if (!tag) return;
    setUpdatingStatus(true);
    const newLostState = !isLost;

    try {
      const currentDetails = (tag.tag_details ?? {}) as Record<string, any>;
      const updatedDetails = {
        ...currentDetails,
        is_lost: newLostState,
        status_updated_at: new Date().toISOString(),
      };

      // Update database
      await supabase
        .from('smart_tags')
        .update({ tag_details: updatedDetails })
        .eq('id', tag.id);

      // Update local storage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const list: SmartTag[] = JSON.parse(raw);
          const updated = list.map((t) => (t.id === tag.id ? { ...t, tag_details: updatedDetails } : t));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
      } catch {
        // ignore
      }

      setIsLost(newLostState);
      setTag((prev) => prev ? { ...prev, tag_details: updatedDetails } : prev);
    } catch (err: any) {
      console.warn('Failed to update lost status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Submit Finder Message to Owner
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!finderPhone.trim() && !finderMessage.trim()) {
      setContactError('Please provide your contact phone or a message.');
      return;
    }

    setSendingMessage(true);
    try {
      const messagePayload = {
        tag_id: tag?.tag_id,
        pet_name: tag?.name,
        finder_name: finderName.trim() || 'Anonymous Finder',
        finder_phone: finderPhone.trim(),
        finder_location: finderLocation.trim(),
        message: finderMessage.trim(),
        sent_at: new Date().toISOString(),
      };

      // 1. Save to localStorage notifications
      const existing = JSON.parse(localStorage.getItem('petziq_finder_messages') || '[]');
      existing.unshift(messagePayload);
      localStorage.setItem('petziq_finder_messages', JSON.stringify(existing));

      // 2. Insert into Supabase activity/messages if possible
      await supabase.from('activity_events').insert({
        event_type: 'finder_message',
        description: `Finder message received for ${tag?.name} (${tag?.tag_id})`,
        metadata: messagePayload,
      });

      setMessageSent(true);
      setTimeout(() => {
        setContactModalOpen(false);
        setMessageSent(false);
        setFinderPhone('');
        setFinderMessage('');
        setFinderLocation('');
      }, 3000);
    } catch {
      setContactError('Failed to dispatch message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-500/10 text-brand-400 animate-pulse">
            <QrCode className="h-8 w-8" />
          </div>
          <p className="text-sm text-ink-400">Loading tag information...</p>
        </div>
      </div>
    );
  }

  if (error || !tag) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-red-500/10 text-red-400">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-50">Tag Not Found</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-400">
          We couldn&apos;t find a Petziq Smart Tag with ID &quot;{tagId}&quot;.
        </p>
        <div className="mt-8 flex gap-3">
          <button onClick={() => onNavigate('/find-pet')} className="btn-secondary text-xs">
            Find Another Pet
          </button>
          <button onClick={() => onNavigate('/')} className="btn-primary text-xs inline-flex items-center gap-2">
            Go to Petziq
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!LIVE_STATUSES.includes(String(tag.status))) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-brand-500/10 text-brand-400">
          <Tag className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-50">
          This Petziq Smart Tag hasn&apos;t been activated yet
        </h1>
        <p className="mt-3 max-w-md text-sm text-ink-300">
          Tag ID: <span className="font-mono font-semibold text-brand-300">{tag.tag_id}</span>
        </p>
        <p className="mt-4 max-w-md text-sm text-ink-400">
          If you&apos;re the owner, log in to your Petziq account and activate this tag from Smart Tags.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button onClick={() => onNavigate('/')} className="btn-primary inline-flex items-center gap-2">
            Go to Petziq
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const details = (tag.tag_details ?? {}) as Record<string, string>;
  const vis = (tag.visibility ?? {}) as Record<string, boolean>;
  const owner = (tag.owner_info ?? {}) as Record<string, string>;

  const petCareFields = [
    { key: 'identification_notes', visKey: 'show_identification_notes', label: 'Identification / Microchip', icon: Tag },
    { key: 'food_info', visKey: 'show_food_info', label: 'Diet & Allergies', icon: null },
    { key: 'general_care', visKey: 'show_general_care', label: 'Critical Care & Medical Instructions', icon: null },
    { key: 'behavior_info', visKey: 'show_behavior_info', label: 'Temperament & Behavior', icon: null },
    { key: 'exercise_info', visKey: 'show_exercise_info', label: 'Exercise', icon: null },
    { key: 'grooming_info', visKey: 'show_grooming_info', label: 'Grooming', icon: null },
  ];

  const plantCareFields = [
    { key: 'watering_info', visKey: 'show_watering_info', label: 'Watering' },
    { key: 'sunlight_info', visKey: 'show_sunlight_info', label: 'Sunlight' },
    { key: 'soil_info', visKey: 'show_soil_info', label: 'Soil' },
    { key: 'fertilizer_info', visKey: 'show_fertilizer_info', label: 'Fertilizer' },
    { key: 'temperature_info', visKey: 'show_temperature_info', label: 'Temperature' },
    { key: 'plant_care_notes', visKey: 'show_plant_care_notes', label: 'General Care' },
  ];

  const careFields = tag.tag_type === 'pet' ? petCareFields : plantCareFields;

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <div className="mx-auto max-w-lg">
        {/* Lost / Found Status Banner */}
        {tag.tag_type === 'pet' && (
          <div className="mb-6">
            {isLost ? (
              <div className="rounded-2xl border-2 border-red-500/50 bg-red-500/15 p-4 text-left shadow-lg animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-red-500 text-white font-bold">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-red-200">
                      LOST PET ALERT: {tag.name} IS MISSING!
                    </h2>
                    <p className="text-xs text-red-300/90 mt-1 leading-relaxed">
                      This pet has been reported lost by their family. If you have found {tag.name}, please contact the owner immediately below.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setContactModalOpen(true)}
                    className="btn-primary flex-1 justify-center py-2.5 text-xs bg-red-500 hover:bg-red-400 text-white font-bold"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    Contact Owner Now
                  </button>
                  {isOwner && (
                    <button
                      onClick={handleToggleLost}
                      disabled={updatingStatus}
                      className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-xs font-semibold text-white hover:bg-black/60 transition"
                    >
                      {updatingStatus ? 'Updating...' : 'Mark as Found'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold text-emerald-300">
                    Safe & Protected Companion
                  </span>
                </div>
                {isOwner && (
                  <button
                    onClick={handleToggleLost}
                    disabled={updatingStatus}
                    className="text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-2 transition"
                  >
                    {updatingStatus ? 'Updating...' : 'Report as Missing'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tag header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <Tag className="h-3.5 w-3.5" />
            Petziq Smart Tag Profile
          </div>
          <p className="mt-2 font-mono text-xs text-ink-400">ID: {tag.tag_id}</p>
        </div>

        {/* Pet/Plant profile card */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-white/[0.08] glass shadow-soft">
          <div className="aspect-[4/3] overflow-hidden bg-ink-900 relative">
            {tag.photo_url ? (
              <img src={tag.photo_url} alt={tag.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink-400">
                {tag.tag_type === 'pet' ? <PawPrint className="h-16 w-16" /> : <Sprout className="h-16 w-16" />}
              </div>
            )}
            {isLost && (
              <span className="absolute top-3 left-3 rounded-lg bg-red-600 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                Missing
              </span>
            )}
          </div>

          <div className="p-6 text-center">
            <h1 className="font-display text-2xl font-bold text-ink-50">{tag.name}</h1>
            {tag.tag_type === 'pet' && (
              <p className="mt-2 text-sm text-ink-300">
                {details.species || 'Pet'}
                {details.breed ? ` · ${details.breed}` : ''}
                {details.gender ? ` · ${details.gender}` : ''}
              </p>
            )}
            {tag.tag_type === 'plant' && (
              <p className="mt-2 text-sm text-ink-300">
                {details.species || 'Botanical'}
                {details.plant_type ? ` · ${details.plant_type}` : ''}
              </p>
            )}

            {/* Quick Contact Finder CTA */}
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="btn-primary w-full justify-center py-3 text-xs uppercase tracking-wider font-bold shadow-glow-blue"
              >
                <Send className="h-4 w-4 mr-1.5" />
                Contact Owner (Privacy Protected)
              </button>
              <p className="mt-2 text-[11px] text-ink-400">
                Send a direct message or share your phone number with the verified owner.
              </p>
            </div>
          </div>
        </div>

        {/* Care & Medical information */}
        {careFields.some((f) => vis[f.visKey] && details[f.key]) && (
          <div className="mt-6 space-y-3">
            <h2 className="font-display text-lg font-semibold text-ink-50">
              {tag.tag_type === 'pet' ? 'Care & Safety Information' : 'Plant Care'}
            </h2>
            {careFields
              .filter((f) => vis[f.visKey] && details[f.key])
              .map((f) => (
                <div key={f.key} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-300">{f.label}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-200">{details[f.key]}</p>
                </div>
              ))}
          </div>
        )}

        {/* Owner / Emergency contact (if approved public by owner) */}
        {(vis.show_owner_name && owner.owner_name) ||
         (vis.show_emergency_contact && owner.emergency_contact) ||
         (vis.show_contact_phone && owner.contact_phone) ||
         (vis.show_contact_email && owner.contact_email) ? (
          <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <h2 className="font-display text-lg font-semibold text-ink-50">Emergency Contact Numbers</h2>
            <div className="mt-3 space-y-2.5">
              {vis.show_owner_name && owner.owner_name && (
                <div className="flex items-center gap-2 text-sm text-ink-200">
                  <User className="h-4 w-4 text-brand-400" />
                  <span className="font-medium text-ink-100">{owner.owner_name}</span>
                </div>
              )}
              {vis.show_contact_phone && owner.contact_phone && (
                <a
                  href={`tel:${owner.contact_phone}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition text-sm text-ink-100 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-400" />
                    {owner.contact_phone}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Call Now</span>
                </a>
              )}
              {vis.show_emergency_contact && owner.emergency_contact && (
                <a
                  href={`tel:${owner.emergency_contact}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition text-sm text-ink-100 font-mono"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-emerald-400" />
                    {owner.emergency_contact}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Emergency Call</span>
                </a>
              )}
              {vis.show_contact_email && owner.contact_email && (
                <a
                  href={`mailto:${owner.contact_email}`}
                  className="flex items-center gap-2 text-sm text-ink-300 hover:text-ink-100 pt-1"
                >
                  <Mail className="h-4 w-4 text-brand-400" />
                  {owner.contact_email}
                </a>
              )}
            </div>
          </div>
        ) : null}

        {/* Safety note */}
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <Shield className="h-5 w-5 shrink-0 text-brand-400" />
          <p className="text-xs leading-relaxed text-ink-400">
            This profile shows only owner-approved public information. Private home details are never exposed on Petziq Smart Tag profiles.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-4 text-xs text-ink-400">
          <button onClick={() => onNavigate('/find-pet')} className="hover:text-ink-200 transition">
            Scan Another Tag
          </button>
          <span>·</span>
          <button onClick={() => onNavigate('/')} className="hover:text-ink-200 transition">
            Visit Petziq Home
          </button>
        </div>
      </div>

      {/* Privacy-Protected "Contact Owner" Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6 sm:p-7 text-ink-50 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/20 text-emerald-300">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink-50">Notify {tag.name}&apos;s Owner</h3>
                <p className="text-xs text-ink-400">The owner will receive your message and location.</p>
              </div>
            </div>

            {messageSent ? (
              <div className="rounded-xl border border-green-500/30 bg-green-500/15 p-4 text-center text-green-300 my-4">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <p className="text-sm font-bold">Message sent to the owner!</p>
                <p className="text-xs text-green-400/80 mt-1">
                  Thank you for helping reunite {tag.name} with their family.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={finderName}
                    onChange={(e) => setFinderName(e.target.value)}
                    placeholder="e.g. Rahul"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                    Your Phone Number (Recommended)
                  </label>
                  <input
                    type="tel"
                    value={finderPhone}
                    onChange={(e) => setFinderPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="input-field text-sm font-mono"
                    required
                  />
                  <p className="text-[11px] text-ink-500 mt-1">So the owner can call or text you directly.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1 flex items-center justify-between">
                    <span>Current Location / Sighting Spot</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (pos) => setFinderLocation(`GPS: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`),
                            () => alert('Please enable location permission or type your landmark.')
                          );
                        }
                      }}
                      className="text-emerald-400 hover:text-emerald-300 text-[10px] lowercase tracking-normal flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3" /> auto-detect GPS
                    </button>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
                    <input
                      type="text"
                      value={finderLocation}
                      onChange={(e) => setFinderLocation(e.target.value)}
                      placeholder="e.g. Central Park near fountain or auto-detect"
                      className="input-field text-sm pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-300 mb-1">
                    Message to Owner
                  </label>
                  <textarea
                    rows={3}
                    value={finderMessage}
                    onChange={(e) => setFinderMessage(e.target.value)}
                    placeholder={`Hi! I found ${tag.name} safe with me...`}
                    className="input-field text-sm resize-none"
                  />
                </div>

                {contactError && (
                  <p className="text-xs text-red-300 bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                    {contactError}
                  </p>
                )}

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                    className="btn-ghost flex-1 justify-center py-2.5 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingMessage}
                    className="btn-primary flex-1 justify-center py-2.5 text-xs bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold"
                  >
                    {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Alert'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

