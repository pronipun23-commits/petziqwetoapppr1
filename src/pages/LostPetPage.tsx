import { useState, useEffect } from 'react';
import {
  MapPin, AlertTriangle, Phone, Mail, Clock, Search, ShieldCheck,
  CheckCircle2, ArrowRight, Eye, Navigation, Bell, ExternalLink
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSmartTags } from '@/hooks/useSmartTags';

interface LostPetPageProps {
  onNavigate: (path: string) => void;
}

export interface LostScanRecord {
  id: string;
  tag_id: string;
  pet_name: string;
  scanned_at: string;
  location_name?: string;
  lat?: number;
  lng?: number;
  finder_name?: string;
  finder_phone?: string;
  finder_message?: string;
  status: 'reported' | 'investigating' | 'resolved';
}

export function LostPetPage({ onNavigate }: LostPetPageProps) {
  const { session } = useAuth();
  const { tags } = useSmartTags();
  const [activeTab, setActiveTab] = useState<'scans' | 'my_tags'>('scans');
  const [scanRecords, setScanRecords] = useState<LostScanRecord[]>([]);

  // Load recorded scans and finder messages
  useEffect(() => {
    try {
      const scansRaw = localStorage.getItem('petziq_tag_scans') || '[]';
      const finderRaw = localStorage.getItem('petziq_finder_messages') || '[]';
      const scans = JSON.parse(scansRaw);
      const messages = JSON.parse(finderRaw);

      const merged: LostScanRecord[] = [];

      // Add finder messages as high-priority reports
      messages.forEach((m: any, idx: number) => {
        merged.push({
          id: `finder-${idx}`,
          tag_id: m.tag_id || 'PZ-TAG',
          pet_name: m.pet_name || 'Lost Pet',
          scanned_at: m.sent_at || new Date().toISOString(),
          location_name: m.finder_location || 'GPS Location Attached',
          finder_name: m.finder_name,
          finder_phone: m.finder_phone,
          finder_message: m.message,
          status: 'reported',
        });
      });

      // Add scan telemetry
      scans.forEach((s: any, idx: number) => {
        if (!merged.some((m) => m.tag_id === s.tag_id && m.scanned_at === s.scanned_at)) {
          merged.push({
            id: `scan-${idx}`,
            tag_id: s.tag_id || 'PZ-TAG',
            pet_name: s.pet_name || 'Pet',
            scanned_at: s.scanned_at || new Date().toISOString(),
            location_name: 'QR Tag Scanned by Mobile Device',
            status: 'reported',
          });
        }
      });

      // Clean out historical demo records
      const realMerged = merged.filter((m) => m.id !== 'demo-1' && m.finder_name !== 'Rohan Sharma');
      setScanRecords(realMerged);
    } catch {
      // ignore
    }
  }, [tags]);

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16 min-h-screen">
      {/* Tablet & Responsive Optimized Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/25 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-300">
            <AlertTriangle className="h-4 w-4" />
            Live Lost Pet & Scan Radar
          </div>
          <h1 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-ink-50">
            Lost Pet Recovery & Telemetry
          </h1>
          <p className="mt-2 text-sm text-ink-300 max-w-2xl leading-relaxed">
            Real-time telemetry showing whenever and wherever your Petziq Smart Tag is scanned. Review finder contact details, sighting locations, and safety notifications immediately.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/smart-tags')}
            className="btn-secondary text-xs"
          >
            Manage Tags
          </button>
          <button
            onClick={() => onNavigate('/find-pet')}
            className="btn-primary text-xs bg-emerald-400 hover:bg-emerald-300 text-ink-950 font-bold"
          >
            Find a Pet QR
          </button>
        </div>
      </div>

      {/* Tablet Optimized Metric Cards (2x2 on tablet, 4x1 on desktop) */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Total Scans</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/15 text-blue-400">
              <Eye className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-ink-50 mt-3">{scanRecords.length}</p>
          <p className="text-[11px] text-ink-400 mt-1">Smart tag interactions recorded</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Finder Reports</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
              <Phone className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-ink-50 mt-3">
            {scanRecords.filter((s) => s.finder_phone).length}
          </p>
          <p className="text-[11px] text-ink-400 mt-1">Direct finder alerts received</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Locations Logged</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/15 text-purple-400">
              <MapPin className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-ink-50 mt-3">
            {scanRecords.filter((s) => s.location_name).length}
          </p>
          <p className="text-[11px] text-ink-400 mt-1">GPS & street sightings logged</p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-400">Recovery Status</span>
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl font-bold text-emerald-400 mt-3">Active</p>
          <p className="text-[11px] text-ink-400 mt-1">Laser QR tag protection live</p>
        </div>
      </div>

      {/* Scan and Location Feed */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-ink-50 font-display">Recent Tag Scans & Finder Details</h2>
          <span className="text-xs text-ink-400">Real-time telemetry</span>
        </div>

        {scanRecords.length === 0 ? (
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-ink-400 mx-auto mb-3">
              <Eye className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-ink-100">No tag scans reported yet</p>
            <p className="text-xs text-ink-400 mt-1">Whenever anyone scans your Petziq Smart Tag QR code, their location and contact message will be displayed here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scanRecords.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-white/[0.01] p-5 sm:p-6 transition hover:border-emerald-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-base font-bold text-ink-50">
                          {item.pet_name}
                        </h3>
                        <span className="font-mono text-xs text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20">
                          {item.tag_id}
                        </span>
                        <span className="rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold uppercase">
                          Scan Verified
                        </span>
                      </div>

                      <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-200">
                        <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="font-medium text-white">{item.location_name}</span>
                      </p>

                      {item.finder_message && (
                        <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/30 p-3 text-xs text-ink-200">
                          <p className="text-[10px] uppercase font-bold text-ink-400 tracking-wider">Finder Note:</p>
                          <p className="mt-1 italic">&ldquo;{item.finder_message}&rdquo;</p>
                        </div>
                      )}

                      {item.finder_phone && (
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                          <span className="text-ink-400">Finder: <strong className="text-white">{item.finder_name}</strong></span>
                          <a
                            href={`tel:${item.finder_phone}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 transition"
                          >
                            <Phone className="h-3 w-3" />
                            Call Finder: {item.finder_phone}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0 flex sm:flex-col justify-between sm:justify-start items-center sm:items-end text-xs text-ink-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(item.scanned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[10px] text-ink-500 sm:mt-1">
                      {new Date(item.scanned_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
