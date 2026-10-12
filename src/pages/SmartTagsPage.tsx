import { useState, useEffect } from 'react';
import {
  Tag, QrCode, Shield, ShieldCheck, Sparkles, ArrowRight, Bell, Plus,
  PawPrint, Sprout, Trash2, Pencil, Copy, CheckCircle2,
  Clock, ExternalLink, Bone, Heart, Square, Check, Crown, Package,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { useSmartTags, type SmartTag, type TagStatus } from '@/hooks/useSmartTags';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import {
  TagProductPreview,
  TAG_SHAPES,
  TAG_COLORS,
  type TagShape,
  type TagColor,
} from '@/components/TagProductPreview';
import { getTagPublicUrl } from '@/lib/tagUtils';
import { ShowcasePosterArt } from '@/components/ShowcasePosterArt';
import { PlusSection } from '@/components/PlusSection';
import { BuySmartTagModal } from '@/components/BuySmartTagModal';
import { OrderTrackerModal } from '@/components/OrderTrackerModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

/**
 * Petziq Smart Tag product showcase artwork. The attached marketing image is
 * served from `public/petziq-smart-tag-showcase.png`; the older poster paths
 * remain as fallbacks, and if no asset file exists a faithful self-rendered
 * recreation of the poster (ShowcasePosterArt) is displayed instead.
 */
const SHOWCASE_SOURCES = [
  '/petziq-smart-tag-showcase.png',
  '/petziq-smart-tag-poster.jpeg',
  '/petziq smart tag poster.jpeg',
];

const FULL_ADMIN_SECTIONS = [
  'Dashboard', 'Users', 'Pets', 'Plants', 'Smart Tags', 'Analytics', 'Settings',
];

const MARKETING_ADMIN_SECTIONS = ['Dashboard', 'Analytics', 'Team'];

interface SmartTagsPageProps {
  onNavigate: (path: string) => void;
  onRequireAuth: (label: string, action?: () => void) => boolean;
}

const STATUS_CONFIG: Record<TagStatus, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  draft: { label: 'Draft', color: 'text-ink-300', bg: 'bg-white/[0.06]', icon: Clock },
  ready: { label: 'Ready', color: 'text-brand-300', bg: 'bg-brand-500/10', icon: CheckCircle2 },
  coming_soon: { label: 'Coming Soon', color: 'text-ocean-300', bg: 'bg-ocean-500/10', icon: Tag },
  active: { label: 'Active', color: 'text-green-300', bg: 'bg-green-500/10', icon: CheckCircle2 },
};

const FEATURES = [
  {
    icon: QrCode,
    title: 'Unique QR Code',
    description: 'Every Smart Tag has a unique QR code linking to your pet or plant profile.',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Only you decide what information is visible when someone scans your tag.',
  },
  {
    icon: Bell,
    title: 'Instant Identification',
    description: 'If your pet goes missing, anyone who finds them can scan the tag instantly.',
  },
  {
    icon: Sparkles,
    title: 'Premium Build',
    description: 'Round acrylic tag, 35mm diameter, 3mm thick, with a durable keyring hole.',
  },
];

const STEPS = [
  { num: '01', title: 'Create', description: 'Set up your Smart Tag details and customize visibility.' },
  { num: '02', title: 'Preview', description: 'See how your tag and public profile will look.' },
  { num: '03', title: 'Purchase', description: 'Order your physical Petziq Smart Tag (coming soon).' },
  { num: '04', title: 'Protected', description: 'Your pet or plant profile is accessible via QR scan.' },
];

const TAG_PRICE = 599;
const SHIPPING_FEE = 49;

/**
 * Each visitor sees a unique, clearly-labelled preview tag ID so the live demo
 * QR is never ambiguous and never claims a real owned tag. The QR engraved on a
 * customer's actual tag is generated from their real tag ID at creation time.
 */
function makePreviewTagId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return `PZ-DEMO-${id}`;
}

const TAG_COLOR_SWATCHES: Record<TagColor, string> = {
  black: '#0b0f14',
  blue: '#2563eb',
  pink: '#ec4899',
  silver: 'linear-gradient(135deg,#f8fafc,#94a3b8)',
  gold: 'linear-gradient(135deg,#fde68a,#d97706)',
};

export function SmartTagsPage({ onNavigate, onRequireAuth }: SmartTagsPageProps) {
  const { session } = useAuth();
  const { isFullAdmin, isMarketingAdmin, isAdmin } = useAdmin();
  const { tags, loading, error, deleteTag } = useSmartTags();
  const [qrPreviewTag, setQrPreviewTag] = useState<SmartTag | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [posterIndex, setPosterIndex] = useState(0);

  // Tag customizer state — drives the live product preview only.
  const [petName, setPetName] = useState('');
  const [shape, setShape] = useState<TagShape>('round');
  const [color, setColor] = useState<TagColor>('black');
  const [side, setSide] = useState<'front' | 'back'>('front');
  // Unique per visitor/page-load so the demo QR encodes a distinct URL.
  const [previewTagId] = useState(makePreviewTagId);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [trackingOrderNum, setTrackingOrderNum] = useState<string>('');

  const handleBuyClick = () => {
    setIsBuyModalOpen(true);
  };

  const handleOpenTracker = (orderNum?: string) => {
    setTrackingOrderNum(orderNum || '');
    setIsTrackerOpen(true);
  };

  const adminStatusText = !session
    ? 'Sign in to check whether your account has admin access.'
    : isAdmin
      ? 'Your account has admin access.'
      : 'Your account does not currently have admin access.';

  const handleCreate = () => {
    if (session) {
      onNavigate('/smart-tags/create');
    } else {
      onRequireAuth('Smart Tags', () => onNavigate('/smart-tags/create'));
    }
  };

  const handleDelete = async (tag: SmartTag) => {
    if (!confirm(`Delete "${tag.name || tag.tag_id}"? This cannot be undone.`)) return;
    await deleteTag(tag.id);
  };

  const copyTagId = (tagId: string) => {
    navigator.clipboard.writeText(getTagPublicUrl(tagId)).catch(() => {});
    setCopiedId(tagId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const [userOrders, setUserOrders] = useState<{
    id: string;
    order_number: string;
    payment_status: string;
    shipping_status: string;
    amount: number;
    notes?: string;
    created_at: string;
  }[]>([]);

  const fetchUserOrders = async () => {
    let list: any[] = [];
    if (session && isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('smart_tag_orders')
          .select('id, order_number, payment_status, shipping_status, amount, notes, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        if (data && data.length > 0) list = data;
      } catch {
        // Fallback
      }
    }
    // Also include local storage orders
    try {
      const local = JSON.parse(localStorage.getItem('petziq_smart_tag_orders') || '[]');
      if (local && local.length > 0) {
        const existingNums = new Set(list.map((o) => o.order_number));
        const unmerged = local.filter((o: any) => !existingNums.has(o.order_number));
        list = [...list, ...unmerged];
      }
    } catch {
      // ignore
    }
    setUserOrders(list);
  };

  useEffect(() => {
    fetchUserOrders();
  }, [session]);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      <button
        onClick={() => onNavigate('/dashboard')}
        className="mb-6 text-sm text-ink-300 transition hover:text-ink-50"
      >
        Back to Home
      </button>

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] glass p-8 sm:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-ocean-500/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/20 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
            <Tag className="h-3.5 w-3.5" />
            Petziq Smart Tag
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-ink-50 sm:text-4xl lg:text-5xl">
            Next-Gen Smart Tags for Your Pets
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-200 sm:text-lg">
            Give your furry companion a voice. Every tag includes custom engraving, laser-cut durable acrylic, and an instant-scan QR code linking directly to your pet's life-saving emergency profile.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId('design-tag')}
              className="btn-primary inline-flex items-center gap-2 shadow-glow-blue"
            >
              <Sparkles className="h-4 w-4" />
              Customize & Buy Tag
            </button>
            <button
              onClick={() => handleOpenTracker()}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Package className="h-4 w-4 text-brand-300" />
              Track Order
            </button>
            <button onClick={handleCreate} className="btn-ghost inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Tag Profile
            </button>
          </div>
        </div>
      </section>

      {/* Product options — Standard Smart Tag vs Petziq Plus subscription */}
      <section className="mt-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="chip mx-auto">
            <Sparkles className="h-3.5 w-3.5 text-brand-300" />
            Two ways to protect your pets
          </span>
          <h2 className="section-title mt-4">Choose what fits your family</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-300 sm:text-base">
            A physical Smart Tag you customise and buy once — or a Petziq Plus
            subscription for the full care experience. Separate options,
            clearly priced.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Option 1 — Standard Smart Tag (one-time product) */}
          <div className="card-surface flex flex-col p-7 sm:p-8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5 text-brand-300" />
                <h3 className="font-display text-xl font-bold text-ink-50">Standard Smart Tag</h3>
              </div>
              <span className="rounded-full border border-white/[0.10] bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-300">
                One-time purchase
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-2">
              <span className="font-display text-4xl font-extrabold text-ink-50">₹{TAG_PRICE}</span>
              <span className="text-sm text-ink-400">one-time</span>
            </div>
            <p className="mt-1.5 text-[11px] text-ink-500">
              A physical tag you buy once — not a subscription.
            </p>

            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                'Physical Petziq Smart Tag shipped to you',
                "Customise shape, colour and your pet's name",
                'Live 3D product preview before you order',
                "Unique QR code linking to your pet's profile",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-ink-200">
                  <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-brand-500/15 text-brand-300">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => scrollToId('design-tag')}
              className="btn-primary mt-8 w-full justify-center"
            >
              Design your tag
              <ArrowRight className="h-4 w-4" />
            </button>
            <p className="mt-2.5 text-center text-[11px] text-ink-500">
              ₹{TAG_PRICE} is a one-time Smart Tag purchase — no subscription, no
              recurring charges. Online payments open soon.
            </p>
          </div>

          {/* Option 2 — Petziq Plus (subscription service plan) */}
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-brand-400/30 bg-gradient-to-b from-brand-500/[0.10] via-ink-850/60 to-ink-900/70 p-[1px] shadow-glow-blue">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1px)] bg-ink-900/40 p-7 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-brand-300" />
                  <h3 className="font-display text-xl font-bold text-ink-50">Petziq Plus</h3>
                </div>
                <span className="rounded-full border border-brand-400/30 bg-brand-500/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-brand-200">
                  Subscription · Coming soon
                </span>
              </div>

              <div className="mt-5 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold text-ink-50">₹—</span>
                <span className="text-sm text-ink-400">/ month</span>
              </div>
              <p className="mt-1.5 text-[11px] text-ink-500">
                Service plan pricing not finalized yet.
              </p>

              <ul className="mt-6 space-y-2.5 text-sm">
                {[
                  'Unlimited pets and plants',
                  'Advanced reminders and care schedules',
                  'Increased Petziq AI usage with care suggestions',
                  'History tracking, insights and enhanced Smart Tag management',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-ink-100">
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-teal-500/20 text-teal-300">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => scrollToId('petziq-plus')}
                className="btn-primary mt-8 w-full justify-center"
              >
                See the full Plus comparison
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="mt-2.5 text-center text-[11px] text-ink-500">
                A Petziq service plan — separate from the ₹{TAG_PRICE} Smart Tag.
                No payment is collected yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User's tags */}
      {session && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-50">Your Smart Tags</h2>
              <p className="mt-1 text-sm text-ink-400">
                {tags.length === 0
                  ? 'No tags created yet. Start by creating your first Smart Tag.'
                  : `${tags.length} tag${tags.length === 1 ? '' : 's'} configured`}
              </p>
            </div>
            {tags.length > 0 && (
              <button onClick={handleCreate} className="btn-primary text-sm">
                <Plus className="h-4 w-4" />
                New Tag
              </button>
            )}
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
              <p className="text-sm font-semibold text-amber-200">Smart Tags could not be loaded</p>
              <p className="mt-1 text-sm leading-relaxed text-amber-100/80">{error}</p>
            </div>
          )}

          {loading && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card-surface p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 animate-pulse rounded-full bg-white/[0.05]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />
                      <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && tags.length === 0 && (
            <div className="mt-6 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/[0.08] bg-ink-850/40 px-6 py-16 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.05] text-ink-300">
                <Tag className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink-50">No Smart Tags yet</h3>
              <p className="mt-2 max-w-md text-sm text-ink-400">
                Create your first Smart Tag to prepare a profile for your pet or plant.
              </p>
              <button onClick={handleCreate} className="btn-primary mt-6">
                <Plus className="h-4 w-4" />
                Create Smart Tag
              </button>
            </div>
          )}

          {!loading && tags.length > 0 && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tags.map((tag) => {
                // Tags activated through the admin lifecycle can carry states the
                // creator flow never produces; fall back instead of crashing.
                const status = STATUS_CONFIG[tag.status] ?? STATUS_CONFIG.draft;
                const StatusIcon = status.icon;
                return (
                  <div
                    key={tag.id}
                    className="card-surface group overflow-hidden transition hover:border-white/[0.10]"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-300">
                            {tag.tag_type === 'pet' ? (
                              <PawPrint className="h-5 w-5" />
                            ) : (
                              <Sprout className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display text-sm font-semibold text-ink-50 truncate">
                              {tag.name || 'Untitled Tag'}
                            </p>
                            <p className="font-mono text-xs text-ink-400">{tag.tag_id}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${status.color} ${status.bg}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          onClick={() => onNavigate(`/smart-tags/edit/${tag.id}`)}
                          className="btn-ghost flex-1 text-xs"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setQrPreviewTag(qrPreviewTag?.id === tag.id ? null : tag)}
                          className="btn-ghost text-xs"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => copyTagId(tag.tag_id)}
                          className="btn-ghost text-xs"
                        >
                          {copiedId === tag.tag_id ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-300" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onNavigate(`/tag/${tag.tag_id}`)}
                          className="btn-ghost text-xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tag)}
                          className="rounded-xl border border-red-500/20 p-2 text-red-500 transition hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* QR Preview */}
                    {qrPreviewTag?.id === tag.id && (
                      <div className="border-t border-white/[0.06] px-5 py-4">
                        <div className="flex items-center justify-center">
                          <QRCodeDisplay value={getTagPublicUrl(tag.tag_id)} size={100} className="rounded-xl" />
                        </div>
                        <p className="mt-2 text-center text-[10px] text-ink-400">
                          Scan to view public profile
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* User Smart Tag Orders status */}
          {userOrders.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-brand-300" />
                  <h3 className="font-display text-lg font-semibold text-ink-50">Your Tag Orders & Tracking</h3>
                </div>
                <span className="text-xs text-ink-400">
                  {userOrders.length} order{userOrders.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {userOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => handleOpenTracker(ord.order_number)}
                    className="card-surface p-4 flex flex-col justify-between space-y-3 cursor-pointer transition hover:border-brand-500/40 hover:bg-white/[0.04] group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-mono text-xs font-bold text-ink-50 group-hover:text-brand-300 transition">{ord.order_number}</p>
                          <span className="text-[10px] text-brand-400 group-hover:translate-x-0.5 transition">→</span>
                        </div>
                        <p className="text-[11px] text-ink-300 line-clamp-1 mt-0.5">{ord.notes || 'Smart Tag'}</p>
                      </div>
                      <span className="font-display text-sm font-bold text-brand-300">₹{ord.amount}</span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-white/[0.06] text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-400">Payment:</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          ord.payment_status === 'paid'
                            ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {ord.payment_status === 'pending' ? 'Pending (Call in progress)' : ord.payment_status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-ink-400">Shipping:</span>
                        <span className="rounded-full bg-ocean-500/15 border border-ocean-500/30 px-2 py-0.5 text-[10px] font-semibold text-ocean-200 uppercase">
                          {ord.shipping_status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-ink-400 pt-1">
                        <span>Ordered:</span>
                        <span className="text-brand-300 underline underline-offset-2">Click to view full tracker</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Design Your Smart Tag — customization + live product preview */}
      <section id="design-tag" className="mt-10 scroll-mt-24">
        <div className="card-surface overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-2 text-center">
            <span className="chip mx-auto">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Customise Your Tag
            </span>
            <h2 className="section-title mt-4">Design your Petziq Smart Tag</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink-300">
              Choose a shape and colour, add your pet's name, and watch the real
              tag update instantly. The QR shown is the one engraved on your tag.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
            {/* Customization controls — first in DOM so they lead on mobile */}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="tag-pet-name"
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-300"
                >
                  Pet name
                </label>
                <input
                  id="tag-pet-name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value.slice(0, 14))}
                  placeholder="e.g. Pogo"
                  className="input-field"
                />
                <p className="mt-1 text-[11px] text-ink-500">
                  Up to 14 characters, exactly as it will appear on the tag.
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">Shape</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {TAG_SHAPES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setShape(s.id)}
                      aria-pressed={shape === s.id}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-xs font-semibold transition ${
                        shape === s.id
                          ? 'border-brand-500/50 bg-brand-500/10 text-brand-300 shadow-glow-blue'
                          : 'border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/[0.15]'
                      }`}
                    >
                      <span
                        className={`h-5 w-5 ${
                          shape === s.id ? 'text-brand-300' : 'text-ink-400'
                        }`}
                      >
                        {s.id === 'round' && <span className="block h-5 w-5 rounded-full bg-current" />}
                        {s.id === 'bone' && <Bone className="h-5 w-5" fill="currentColor" strokeWidth={0} />}
                        {s.id === 'heart' && <Heart className="h-5 w-5" fill="currentColor" strokeWidth={0} />}
                        {s.id === 'rectangle' && <Square className="h-5 w-5 rounded-[4px]" fill="currentColor" strokeWidth={0} />}
                      </span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-300">Colour</p>
                <div className="flex flex-wrap gap-2">
                  {TAG_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setColor(c.id)}
                      aria-label={c.label}
                      aria-pressed={color === c.id}
                      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        color === c.id
                          ? 'border-brand-500/50 bg-brand-500/10 text-brand-300'
                          : 'border-white/[0.08] bg-white/[0.02] text-ink-300 hover:border-white/[0.15]'
                      }`}
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-white/20"
                        style={{ background: TAG_COLOR_SWATCHES[c.id] }}
                      />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live preview — large, updates instantly on every selection */}
            <div className="order-first flex flex-col rounded-3xl border border-white/[0.08] bg-gradient-to-b from-ink-850/80 to-ink-900/60 p-6 lg:order-none">
              <div className="flex items-center justify-center" style={{ perspective: '1200px' }}>
                <div
                  className="relative transition-transform duration-500"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: side === 'back' ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <div style={{ backfaceVisibility: 'hidden' }}>
                    <TagProductPreview
                      petName={petName}
                      tagId={previewTagId}
                      shape={shape}
                      color={color}
                      side="front"
                    />
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <TagProductPreview
                      petName={petName}
                      tagId={previewTagId}
                      shape={shape}
                      color={color}
                      side="back"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {(['front', 'back'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSide(s)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
                      side === s
                        ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-500/30'
                        : 'text-ink-400 hover:bg-white/[0.05] hover:text-ink-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-3 py-1.5 text-xs font-semibold text-brand-300">
                  <Clock className="h-3.5 w-3.5" />
                  ₹{TAG_PRICE} · Launch price
                </span>
                <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300">
                  15% OFF Launch Discount
                </span>
              </div>
              <p className="mt-3 text-center text-[11px] text-ink-500">
                Live preview · QR is generated from your tag ID at purchase
              </p>
            </div>
          </div>

          {/* Order summary + purchase path */}
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Pet name</p>
                <p className="mt-0.5 font-display font-bold text-ink-50">{petName.trim() || 'Not set'}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Shape</p>
                <p className="mt-0.5 font-display font-bold capitalize text-ink-50">
                  {TAG_SHAPES.find((s) => s.id === shape)?.label}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Colour</p>
                <p className="mt-0.5 font-display font-bold text-ink-50">
                  {TAG_COLORS.find((c) => c.id === color)?.label}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  Original Price
                </p>
                <p className="mt-0.5 font-display text-sm line-through text-ink-400">₹705</p>
                <p className="font-display text-2xl font-bold text-ink-50">₹{TAG_PRICE}</p>
                <p className="text-[11px] font-semibold text-amber-300">15% OFF Applied</p>
              </div>
            </div>

            <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4 text-xs text-ink-300">
              <div className="flex items-center justify-between">
                <span>Special Offer</span>
                <span className="font-semibold text-amber-300">15% Discount Applied</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery & Handling Fee</span>
                <span className="font-semibold text-ink-100">₹{SHIPPING_FEE}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-200">Total</span>
                <span className="font-display text-base font-bold text-ink-50">₹{TAG_PRICE + SHIPPING_FEE}</span>
              </div>
              <p className="pt-1 text-[11px] text-ink-500">
                One-time Smart Tag purchase — not a subscription.
              </p>
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleBuyClick}
                className="btn-primary w-full max-w-md justify-center shadow-glow-blue transition-all duration-300 hover:scale-[1.02]"
              >
                <Tag className="h-4 w-4" />
                Buy Smart Tag Now — ₹{TAG_PRICE + SHIPPING_FEE}
              </button>
              <p className="text-center text-[11px] text-ink-400">
                ₹{TAG_PRICE} (15% OFF) + ₹{SHIPPING_FEE} Delivery. QR is generated instantly with your pet's details!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Buy Smart Tag Order Modal */}
      <BuySmartTagModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        petName={petName}
        shape={shape}
        color={color}
        price={TAG_PRICE + SHIPPING_FEE}
        shippingFee={SHIPPING_FEE}
        tagPrice={TAG_PRICE}
        userId={session?.user?.id}
        userEmail={session?.user?.email}
        onOrderSuccess={(order) => {
          fetchUserOrders();
          setTrackingOrderNum(order.orderNumber);
        }}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialOrderNumber={trackingOrderNum}
        userId={session?.user?.id}
        userEmail={session?.user?.email}
        onNavigate={onNavigate}
      />

      {/* Tag Visual */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="card-surface flex flex-col items-center justify-center p-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-brand-500/15 blur-2xl" />
            <div className="relative grid h-48 w-48 place-items-center rounded-full border-4 border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 shadow-soft">
              <div className="text-center">
                <div className="mx-auto mb-2 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-400 to-ocean-500">
                  <QrCode className="h-8 w-8 text-white" />
                </div>
                <p className="font-display text-sm font-bold text-ink-50">PETZIQ</p>
                <p className="mt-1 text-xs text-ink-400">PZ-000001</p>
              </div>
            </div>
            <div className="absolute -right-2 top-8 h-6 w-6 rounded-full border-2 border-ink-700 bg-ink-850" />
          </div>
          <p className="mt-8 text-center text-sm text-ink-300">
            Round acrylic tag — 35mm diameter, 3mm thick with keyring hole
          </p>
        </div>

        <div className="card-surface p-8">
          <h2 className="font-display text-xl font-semibold text-ink-50">How It Works</h2>
          <div className="mt-6 space-y-5">
            {STEPS.map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/10 text-sm font-bold text-brand-400">
                  {step.num}
                </span>
                <div>
                  <h3 className="font-semibold text-ink-50">{step.title}</h3>
                  <p className="mt-0.5 text-sm text-ink-400">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uploaded High-Res Smart Tag Shapes & Real Photos */}
      <section className="mt-10">
        <div className="card-surface p-6 sm:p-8 lg:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="chip mx-auto">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" />
              Real Product Gallery
            </span>
            <h2 className="section-title mt-4">Precision Laser-Engraved Plates</h2>
            <p className="text-sm text-ink-300 mt-2">
              Every shape comes in multiple lustrous metallic shades. Anodized scratch-resistant coating with deep fiber laser engraving that never fades.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Round Tag', file: '/smart-tag-round.png', shape: 'round', desc: 'Classic 35mm circular disc' },
              { name: 'Bone Tag', file: '/smart-tag-bone.png', shape: 'bone', desc: 'Playful dog bone silhouette' },
              { name: 'Heart Tag', file: '/smart-tag-heart.png', shape: 'heart', desc: 'Heart shape for cats & small dogs' },
              { name: 'Square Tag', file: '/smart-tag-square.png', shape: 'rectangle', desc: 'Modern geometric rounded square' },
            ].map((item) => (
              <div
                key={item.name}
                onClick={() => {
                  setShape(item.shape as TagShape);
                  scrollToId('design-tag');
                }}
                className={`group cursor-pointer rounded-2xl border p-4 text-center transition hover:scale-[1.02] ${
                  shape === item.shape
                    ? 'border-brand-500/50 bg-brand-500/10 shadow-glow-blue'
                    : 'border-white/[0.08] bg-white/[0.02] hover:border-white/20'
                }`}
              >
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-ink-950/60 mb-3 flex items-center justify-center p-2">
                  <img
                    src={item.file}
                    alt={item.name}
                    className="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-semibold text-sm text-ink-50">{item.name}</h4>
                <p className="text-[11px] text-ink-400 mt-0.5">{item.desc}</p>
                <button
                  type="button"
                  className="mt-2.5 text-xs text-brand-300 font-medium group-hover:underline inline-flex items-center gap-1"
                >
                  Select this shape →
                </button>
              </div>
            ))}
          </div>

          {/* Lifestyle Banner */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <img
              src="/smart-tag-lifestyle-banner.png"
              alt="Petziq Smart Tag on Pet Collar"
              className="w-full h-auto max-h-[360px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-transparent flex items-end p-6 sm:p-8">
              <div>
                <span className="rounded-full bg-brand-500/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                  Field Tested & Water-Ready
                </span>
                <h3 className="text-lg sm:text-2xl font-bold text-white mt-2">
                  Built to withstand runs, muddy trails, and swimming.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="mt-10">
        <div className="card-surface p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="chip">
                <Sparkles className="h-3.5 w-3.5 text-brand-300" />
                Verified Owners
              </span>
              <h2 className="section-title mt-3">What Pet Parents Say</h2>
              <p className="text-sm text-ink-300 mt-1">Real feedback from verified Petziq Smart Tag owners</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {'★★★★★'.split('').map((star, i) => (
                  <span key={i} className="text-base">{star}</span>
                ))}
              </div>
              <span className="text-sm font-bold text-ink-50">4.9 / 5</span>
              <span className="text-xs text-ink-400">(148+ tags delivered)</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: 'Ananya Sharma',
                pet: 'Golden Retriever "Simba"',
                shape: 'Bone Shape (Gold)',
                rating: 5,
                date: '2 weeks ago',
                comment: 'The laser engraving is razor sharp and looks super luxurious! Tested the QR code with my iPhone camera and my pet profile loaded in less than a second. Total peace of mind.',
              },
              {
                name: 'Rahul Mukherjee',
                pet: 'Beagle "Rocky"',
                shape: 'Round Shape (Black)',
                rating: 5,
                date: '1 month ago',
                comment: 'Rocky is an escape artist. Last Sunday he sprinted out the gate, and a neighbor two lanes over scanned his Petziq tag and called my phone before I even finished searching the block!',
              },
              {
                name: 'Pooja Venkatesh',
                pet: 'Persian Cat "Bella"',
                shape: 'Heart Shape (Pink)',
                rating: 5,
                date: '3 weeks ago',
                comment: 'Extremely lightweight, does not bother Bella at all. The pink metallic finish matches her collar perfectly and the QR is clear and crisp.',
              },
            ].map((rev) => (
              <div key={rev.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex text-amber-400">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <span className="text-ink-400 text-[11px]">{rev.date}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-ink-200 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-ink-50">{rev.name}</p>
                    <p className="text-[11px] text-teal-300 font-medium">{rev.pet}</p>
                  </div>
                  <span className="text-[10px] rounded-full bg-white/[0.05] px-2.5 py-1 text-ink-400">
                    {rev.shape}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product showcase artwork */}
      <section className="mt-10">
        <div className="card-surface overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip mx-auto">
              <Tag className="h-3.5 w-3.5 text-brand-300" />
              Petziq Smart Tag
            </span>
            <h2 className="section-title mt-5">A safer tomorrow for your pets</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-300 sm:text-base">
              One small tag. One scan. A smarter way to stay connected with your pet.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
                ₹{TAG_PRICE} · Launch price
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                15% OFF Launch Discount
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] shadow-card">
              {posterIndex < SHOWCASE_SOURCES.length ? (
                <img
                  src={SHOWCASE_SOURCES[posterIndex]}
                  alt="Petziq Smart Tag product showcase"
                  loading="lazy"
                  decoding="async"
                  onError={() => setPosterIndex((i) => i + 1)}
                  className="block h-auto w-full object-contain"
                />
              ) : (
                <ShowcasePosterArt petName={petName.trim() || 'Pogo'} tagId={previewTagId} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Petziq Plus — subscription option, separate from the ₹399 tag */}
      <section id="petziq-plus" className="mt-14 scroll-mt-24 border-t border-white/[0.06] pt-14">
        <PlusSection onNavigate={onNavigate} onRequireAuth={onRequireAuth} embedded />
      </section>

      {/* Admin Access */}
      <section className="mt-10">
        <div className="card-surface p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
                isAdmin ? 'bg-brand-500/10 text-brand-300' : 'bg-white/[0.05] text-ink-300'
              }`}
            >
              <Shield className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-semibold text-ink-50">Admin Access</h2>
              <p className="mt-1 text-sm text-ink-400">
                Petziq administration is available only to authorized team members.
              </p>

              <div
                className={`mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                  isAdmin ? 'bg-brand-500/10 text-brand-300' : 'bg-white/[0.06] text-ink-300'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {adminStatusText}
              </div>

              {isAdmin && (
                <>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
                    {isFullAdmin ? 'Full Admin' : isMarketingAdmin ? 'Marketing Admin' : 'Admin'}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(isFullAdmin ? FULL_ADMIN_SECTIONS : MARKETING_ADMIN_SECTIONS).map((section) => (
                      <span
                        key={section}
                        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-ink-300"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => onNavigate('/admin')}
                    className="btn-primary mt-5 inline-flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Open Admin Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {!isAdmin && !session && (
                <button
                  onClick={() => onRequireAuth('Admin Access')}
                  className="btn-ghost mt-5 inline-flex items-center gap-2 text-sm"
                >
                  Sign in to continue
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink-50">Why Petziq Smart Tag</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-surface group p-6 transition hover:border-brand-500/20">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-500/10 text-brand-400 transition group-hover:scale-110">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-ink-50">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-10 overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-brand-500/10 to-ocean-500/5 p-8 text-center sm:p-12">
        <h2 className="font-display text-2xl font-bold text-ink-50">Ready to protect your companion?</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-300">
          Create your Smart Tag now and have your profile ready when physical tags launch.
        </p>
        <button onClick={handleCreate} className="btn-primary mx-auto mt-6 inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Smart Tag
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>
    </div>
  );
}
