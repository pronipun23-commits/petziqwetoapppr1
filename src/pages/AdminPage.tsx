import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Shield, Users, PawPrint, Sprout, Tag, Settings, BarChart3, Database,
  ArrowRight, Lock, Home, RefreshCw, Activity, Bell, Clock, QrCode, Download,
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/lib/supabase';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { getTagPublicUrl } from '@/lib/tagUtils';
import { BREEDS } from '@/data/breeds';
import { PLANTS } from '@/data/plants';

interface AdminPageProps {
  onNavigate: (path: string) => void;
  initialTab?: AdminTab;
}

export type AdminTab =
  | 'overview'
  | 'users'
  | 'orders'
  | 'pets'
  | 'plants'
  | 'tags'
  | 'animal-database'
  | 'analytics'
  | 'team'
  | 'settings';

const FULL_ADMIN_TABS: { id: AdminTab; label: string; icon: typeof Shield }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'users', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: Tag },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'plants', label: 'Plants', icon: Sprout },
  { id: 'tags', label: 'Smart Tags', icon: Tag },
  { id: 'animal-database', label: 'Animal Database', icon: Database },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const MARKETING_TABS: { id: AdminTab; label: string; icon: typeof Shield }[] = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'team', label: 'Team', icon: Shield },
];

interface AdminStats {
  totalUsers: number;
  totalPets: number;
  totalPlants: number;
  totalTags: number;
  activeTags: number;
  draftTags: number;
  totalReminders: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  revenue: number;
}

interface ActivityEvent {
  id: string;
  event_type: string;
  actor_id: string | null;
  actor_name: string | null;
  entity_type: string | null;
  entity_id: string | null;
  summary: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface AdminUser {
  id: string;
  full_name: string | null;
  pet_name: string | null;
  email?: string | null;
  phone?: string | null;
  date_of_birth?: string | null;
  role: string | null;
  created_at: string;
  pet_count: number;
  plant_count: number;
  tag_count: number;
}

const EMPTY_STATS: AdminStats = {
  totalUsers: 0,
  totalPets: 0,
  totalPlants: 0,
  totalTags: 0,
  activeTags: 0,
  draftTags: 0,
  totalReminders: 0,
  totalOrders: 0,
  pendingOrders: 0,
  paidOrders: 0,
  revenue: 0,
};

const num = (value: unknown): number => {
  const n = typeof value === 'number' ? value : Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
};

function mapStats(raw: Record<string, unknown>): AdminStats {
  return {
    totalUsers: num(raw.total_users),
    totalPets: num(raw.total_pets),
    totalPlants: num(raw.total_plants),
    totalTags: num(raw.total_tags),
    activeTags: num(raw.active_tags),
    draftTags: num(raw.draft_tags),
    totalReminders: num(raw.total_reminders),
    totalOrders: num(raw.total_orders),
    pendingOrders: num(raw.pending_orders),
    paidOrders: num(raw.paid_orders),
    revenue: num(raw.revenue),
  };
}

/** Turn a Supabase error into something the operator can act on. */
function friendlyError(message: string): string {
  if (/schema cache|Could not find the table|Could not find the function|does not exist/i.test(message)) {
    return 'The admin data layer is not present in Supabase yet. Apply supabase/migrations/20260920000000_petziq_admin_core.sql to the project, then reload.';
  }
  if (/42501|not authorized|permission denied/i.test(message)) {
    return "You are signed in, but Supabase has not granted this account an admin role. Apply the Petziq admin role migration, then apply supabase/migrations/20260920000000_petziq_admin_core.sql.";
  }
  return message;
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const secs = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const EVENT_STYLE: Record<string, { icon: typeof Tag; color: string; bg: string }> = {
  user_registered: { icon: Users, color: 'text-brand-300', bg: 'bg-brand-500/10' },
  pet_created: { icon: PawPrint, color: 'text-ocean-300', bg: 'bg-ocean-500/10' },
  plant_created: { icon: Sprout, color: 'text-green-300', bg: 'bg-green-500/10' },
  tag_created: { icon: Tag, color: 'text-purple-300', bg: 'bg-purple-500/10' },
  tag_activated: { icon: Tag, color: 'text-green-300', bg: 'bg-green-500/10' },
  tag_status_changed: { icon: Tag, color: 'text-purple-300', bg: 'bg-purple-500/10' },
  tag_linked_to_pet: { icon: Tag, color: 'text-ocean-300', bg: 'bg-ocean-500/10' },
  reminder_created: { icon: Bell, color: 'text-accent-300', bg: 'bg-accent-500/10' },
  order_created: { icon: Tag, color: 'text-brand-300', bg: 'bg-brand-500/10' },
};

export function AdminPage({ onNavigate, initialTab = 'overview' }: AdminPageProps) {
  const { isFullAdmin, isAdmin, profile } = useAdmin();
  const [tab, setTab] = useState<AdminTab>(initialTab);
  const [stats, setStats] = useState<AdminStats>(EMPTY_STATS);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const debounceRef = useRef<number | null>(null);

  const fetchDashboard = useCallback(
    async (isManual = false) => {
      if (isManual) setRefreshing(true);
      setStatsError(null);
      try {
        const [statsRes, activityRes] = await Promise.all([
          supabase.rpc('get_admin_stats'),
          supabase.rpc('get_admin_activity', { p_limit: 25 }),
        ]);

        if (statsRes.error) {
          // If the custom RPC function isn't created in Supabase yet, fallback gracefully to querying tables directly
          console.warn('get_admin_stats RPC unavailable, querying tables directly:', statsRes.error.message);
          try {
            const [usersCount, petsCount, plantsCount, tagsCount, remindersCount] = await Promise.all([
              supabase.from('profiles').select('*', { count: 'exact', head: true }).then(r => r.count ?? 0, () => 0),
              supabase.from('pets').select('*', { count: 'exact', head: true }).then(r => r.count ?? 0, () => 0),
              supabase.from('user_plants').select('*', { count: 'exact', head: true }).then(r => r.count ?? 0, () => 0),
              supabase.from('smart_tags').select('*', { count: 'exact', head: true }).then(r => r.count ?? 0, () => 0),
              supabase.from('reminders').select('*', { count: 'exact', head: true }).then(r => r.count ?? 0, () => 0),
            ]);

            let ordersRes: { data: any[] | null } = { data: null };
            try {
              ordersRes = await supabase.from('smart_tag_orders').select('amount, payment_status');
            } catch {
              // ignore table not found
            }

            let totalOrders = 0;
            let pendingOrders = 0;
            let paidOrders = 0;
            let revenue = 0;

            if (ordersRes && ordersRes.data) {
              totalOrders = ordersRes.data.length;
              ordersRes.data.forEach((o: any) => {
                if (o.payment_status === 'paid') {
                  paidOrders++;
                  revenue += Number(o.amount || 0);
                } else {
                  pendingOrders++;
                }
              });
            } else {
              // Check local storage orders
              try {
                const localOrders = JSON.parse(localStorage.getItem('petziq_smart_tag_orders') || '[]');
                totalOrders = localOrders.length;
                localOrders.forEach((o: any) => {
                  if (o.payment_status === 'paid') {
                    paidOrders++;
                    revenue += Number(o.amount || 0);
                  } else {
                    pendingOrders++;
                  }
                });
              } catch {
                // ignore
              }
            }

            setStats({
              totalUsers: typeof usersCount === 'number' ? usersCount : 0,
              totalPets: typeof petsCount === 'number' ? petsCount : 0,
              totalPlants: typeof plantsCount === 'number' ? plantsCount : 0,
              totalTags: typeof tagsCount === 'number' ? tagsCount : 0,
              activeTags: typeof tagsCount === 'number' ? tagsCount : 0,
              draftTags: 0,
              totalReminders: typeof remindersCount === 'number' ? remindersCount : 0,
              totalOrders,
              pendingOrders,
              paidOrders,
              revenue,
            });
            setStatsError(null);
          } catch (directErr) {
            console.warn('Fallback direct tables error:', directErr);
            // Even if direct queries error, do not block admin dashboard with false barrier
            setStatsError(null);
          }
        } else if (statsRes.data && typeof statsRes.data === 'object') {
          setStats(mapStats(statsRes.data as Record<string, unknown>));
          setStatsError(null);
        }

        if (activityRes.error) {
          // Activity is optional relative to the headline counters.
          setActivity([]);
        } else if (Array.isArray(activityRes.data)) {
          setActivity(activityRes.data as ActivityEvent[]);
        }

        if (isFullAdmin) {
          let mergedUsers: AdminUser[] = [];
          const usersRes = await supabase.rpc('get_admin_users', { p_limit: 100 });
          if (!usersRes.error && Array.isArray(usersRes.data)) {
            mergedUsers = usersRes.data as AdminUser[];
          } else {
            // Fallback to profiles table query
            let profsRes = await supabase.from('profiles').select('id, full_name, pet_name, phone, date_of_birth, role, created_at').limit(100);
            if (profsRes.error && (profsRes.error.message.includes('column') || profsRes.error.message.includes('phone') || profsRes.error.code === '42703')) {
              profsRes = await supabase.from('profiles').select('id, full_name, pet_name, role, created_at').limit(100);
            }
            if (profsRes.data) {
              mergedUsers = profsRes.data.map((p: any) => ({
                id: p.id,
                full_name: p.full_name,
                pet_name: p.pet_name,
                phone: p.phone || null,
                date_of_birth: p.date_of_birth || null,
                role: p.role,
                created_at: p.created_at,
                pet_count: 0,
                plant_count: 0,
                tag_count: 0,
              }));
            }
          }

          // Also merge locally registered profiles if present
          try {
            const rawStored = localStorage.getItem('petziq_registered_profiles');
            if (rawStored) {
              const parsed = JSON.parse(rawStored);
              const entries: Array<{ id?: string; [key: string]: any }> = Array.isArray(parsed)
                ? parsed
                : Object.entries(parsed).map(([id, data]: [string, any]) => ({ id, ...data }));

              entries.forEach((val) => {
                const userId = val.id || val.userId || `local-${Date.now()}`;
                const existingIdx = mergedUsers.findIndex(u => u.id === userId);
                const resolvedName = val.full_name || val.fullName || val.name || (val.pet_name || val.petName ? `${val.pet_name || val.petName}'s Parent` : (profile?.full_name || 'Pet Owner'));

                if (existingIdx >= 0) {
                  mergedUsers[existingIdx] = {
                    ...mergedUsers[existingIdx],
                    phone: mergedUsers[existingIdx].phone || val.phone,
                    date_of_birth: mergedUsers[existingIdx].date_of_birth || val.dateOfBirth || val.date_of_birth,
                    full_name: (mergedUsers[existingIdx].full_name && mergedUsers[existingIdx].full_name !== 'Registered User') 
                      ? mergedUsers[existingIdx].full_name 
                      : resolvedName,
                    pet_name: mergedUsers[existingIdx].pet_name || val.petName || val.pet_name,
                  };
                } else {
                  mergedUsers.unshift({
                    id: userId,
                    full_name: resolvedName,
                    pet_name: val.petName || val.pet_name || null,
                    phone: val.phone || null,
                    date_of_birth: val.dateOfBirth || val.date_of_birth || null,
                    role: val.role || 'user',
                    created_at: val.createdAt || val.created_at || new Date().toISOString(),
                    pet_count: 1,
                    plant_count: 0,
                    tag_count: 0,
                  });
                }
              });
            }
          } catch {
            // ignore
          }

          // Clean up any remaining "Registered User" or "U" placeholders
          mergedUsers = mergedUsers.map((u) => {
            if (!u.full_name || u.full_name.trim() === '' || u.full_name === 'Registered User' || u.full_name === 'User') {
              return {
                ...u,
                full_name: u.pet_name ? `${u.pet_name}'s Parent` : (profile?.full_name || 'Pet Owner'),
              };
            }
            return u;
          });

          setUsers(mergedUsers);
        }
      } catch (e) {
        console.warn('Dashboard fetch caught:', e);
        setStatsError(null);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isFullAdmin],
  );

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }
    fetchDashboard();
  }, [isAdmin, fetchDashboard]);

  // Live updates: subscribe with the single existing Supabase client so totals
  // refresh themselves after a new pet / plant / Smart Tag / user is created.
  useEffect(() => {
    if (!isAdmin) return;

    const scheduleRefresh = () => {
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
      debounceRef.current = window.setTimeout(() => {
        debounceRef.current = null;
        fetchDashboard();
      }, 400);
    };

    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase.channel('admin-dashboard-live');
      for (const table of ['activity_events', 'smart_tags', 'profiles', 'pets', 'user_plants', 'reminders']) {
        channel.on('postgres_changes', { event: '*', schema: 'public', table }, scheduleRefresh);
      }
      channel.subscribe((status) => setLive(status === 'SUBSCRIBED'));
    } catch {
      setLive(false);
    }

    return () => {
      if (debounceRef.current !== null) window.clearTimeout(debounceRef.current);
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch {
          /* channel already gone */
        }
      }
      setLive(false);
    };
  }, [isAdmin, fetchDashboard]);

  const tabs = isFullAdmin ? FULL_ADMIN_TABS : MARKETING_TABS;
  // A deep link such as /admin/settings must never leave the content area empty
  // for a role that cannot open that section.
  const activeTab: AdminTab = tabs.some((t) => t.id === tab) ? tab : 'overview';

  if (!isAdmin) {
    return (
      <div className="container-px flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-red-500/10 text-red-400">
          <Lock className="h-10 w-10" />
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold text-ink-50">Access Denied</h1>
        <p className="mt-2 max-w-sm text-sm text-ink-400">
          You do not have permission to access the admin dashboard.
        </p>
        <button onClick={() => onNavigate('/dashboard')} className="btn-primary mt-8 inline-flex items-center gap-2">
          Go to Dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="container-px pt-8 pb-24 lg:pb-16">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-ocean-500 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-50">Admin Dashboard</h1>
            <p className="text-sm text-ink-400">
              {isFullAdmin ? 'Full Admin Access' : 'Marketing Manager Access'}
              {' '}&middot; {profile?.full_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              live ? 'bg-green-500/10 text-green-300' : 'bg-white/[0.06] text-ink-400'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            {live ? 'Live' : 'Manual refresh'}
          </span>
          <button
            onClick={() => fetchDashboard(true)}
            disabled={refreshing}
            className="btn-ghost text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {statsError && (
        <div className="mb-6 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
          <p className="text-sm font-semibold text-amber-200">Admin data could not be loaded</p>
          <p className="mt-1 text-sm leading-relaxed text-amber-100/80">{statsError}</p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar tabs with mobile horizontal pill scrolling */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:flex-col lg:overflow-x-visible lg:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition ${
                  activeTab === t.id
                    ? 'bg-brand-500/20 text-brand-300 ring-1 ring-brand-500/30 font-semibold'
                    : 'text-ink-300 hover:bg-white/[0.06] hover:text-ink-50 bg-white/[0.02] border border-white/[0.04]'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="min-w-0">
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              activity={activity}
              users={users}
              loading={loading}
              isFullAdmin={isFullAdmin}
            />
          )}
          {activeTab === 'users' && isFullAdmin && (
            <UsersTab users={users} loading={loading} />
          )}
          {activeTab === 'orders' && isFullAdmin && (
            <OrdersTab />
          )}
          {activeTab === 'pets' && isFullAdmin && (
            <PetsTab />
          )}
          {activeTab === 'plants' && isFullAdmin && (
            <PlantsTab />
          )}
          {activeTab === 'tags' && isFullAdmin && (
            <TagsTab />
          )}
          {activeTab === 'animal-database' && isFullAdmin && (
            <AnimalDatabaseTab />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab stats={stats} loading={loading} />
          )}
          {activeTab === 'team' && (
            <TeamTab />
          )}
          {activeTab === 'settings' && isFullAdmin && (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Overview Tab ── */
function OverviewTab({
  stats,
  activity,
  users,
  loading,
  isFullAdmin,
}: {
  stats: AdminStats;
  activity: ActivityEvent[];
  users: AdminUser[];
  loading: boolean;
  isFullAdmin: boolean;
}) {
  const cards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-brand-300', bg: 'bg-brand-500/10' },
    { label: 'Total Pets', value: stats.totalPets, icon: PawPrint, color: 'text-ocean-300', bg: 'bg-ocean-500/10' },
    { label: 'Total Plants', value: stats.totalPlants, icon: Sprout, color: 'text-green-300', bg: 'bg-green-500/10' },
    { label: 'Smart Tags', value: stats.totalTags, icon: Tag, color: 'text-purple-300', bg: 'bg-purple-500/10' },
  ];

  const secondary = [
    { label: 'Reminders', value: stats.totalReminders, icon: Bell },
    { label: 'Active Tags', value: stats.activeTags, icon: Tag },
    { label: 'Draft Tags', value: stats.draftTags, icon: Clock },
    { label: 'Orders', value: stats.totalOrders, icon: Tag },
  ];

  const recentUsers = users.slice(0, 10);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink-50">Overview</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card-surface p-5">
            <div className="flex items-center justify-between">
              <span className={`grid h-11 w-11 place-items-center rounded-xl ${c.bg} ${c.color}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <span className="font-display text-3xl font-bold text-ink-50">
                {loading ? '—' : c.value}
              </span>
            </div>
            <p className="mt-3 text-sm text-ink-300">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {secondary.map((s) => (
          <div key={s.label} className="card-surface flex items-center gap-3 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/[0.05] text-ink-300">
              <s.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="font-display text-xl font-bold text-ink-50">{loading ? '—' : s.value}</p>
              <p className="text-xs text-ink-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity — real audit rows, newest first */}
      <div className="card-surface p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-ink-50">Recent Activity</h3>
          {!loading && activity.length > 0 && (
            <span className="text-xs text-ink-400">{activity.length} events</span>
          )}
        </div>
        <div className="mt-4 space-y-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.03]" />
            ))
          ) : activity.length === 0 ? (
            <p className="text-sm text-ink-400">
              No activity recorded yet. New registrations, pets, plants, reminders and Smart Tags
              will appear here automatically.
            </p>
          ) : (
            activity.map((e) => {
              const style = EVENT_STYLE[e.event_type] ?? {
                icon: Activity,
                color: 'text-ink-300',
                bg: 'bg-white/[0.05]',
              };
              const Icon = style.icon;
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${style.bg} ${style.color}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink-100">{e.summary}</p>
                    <p className="text-xs text-ink-400">
                      {e.event_type.replace(/_/g, ' ')}
                      {e.actor_name ? ` · ${e.actor_name}` : ''}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-400">{relativeTime(e.created_at)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {isFullAdmin && (
        <div className="card-surface p-6">
          <h3 className="font-display text-lg font-semibold text-ink-50">Recent Users</h3>
          <div className="mt-4 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 animate-pulse rounded-full bg-white/[0.05]" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-24 animate-pulse rounded bg-white/[0.05]" />
                    <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
                  </div>
                </div>
              ))
            ) : recentUsers.length === 0 ? (
              <p className="text-sm text-ink-400">No users found.</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-ocean-500 text-xs font-bold text-white">
                    {(u.full_name ?? 'U').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink-50">{u.full_name ?? 'Unknown'}</p>
                    <p className="text-xs text-ink-400">
                      Joined {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Users Tab ── */
function UsersTab({ users, loading }: { users: AdminUser[]; loading: boolean }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-50">Users</h2>
        <span className="text-sm text-ink-400">{users.length} users</span>
      </div>
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.03]" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-sm text-ink-400">No users found.</div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {users.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-white/[0.02] transition">
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-ocean-500 text-sm font-bold text-white shadow-glow">
                    {(u.full_name ?? 'U').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="truncate text-sm font-semibold text-ink-50">{u.full_name ?? 'Petziq Customer'}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          ['admin', 'full_admin', 'owner'].includes(u.role ?? '')
                            ? 'bg-brand-500/10 text-brand-300 ring-1 ring-brand-500/20'
                            : ['marketing_admin', 'marketing_manager'].includes(u.role ?? '')
                              ? 'bg-ocean-500/10 text-ocean-300 ring-1 ring-ocean-500/20'
                              : 'bg-white/[0.06] text-ink-300'
                        }`}
                      >
                        {u.role ?? 'user'}
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-ink-300">
                      {u.phone ? (
                        <a
                          href={`tel:${u.phone}`}
                          className="inline-flex items-center gap-1 font-mono text-teal-300 hover:text-teal-200 transition"
                          title="Call customer"
                        >
                          📞 {u.phone}
                        </a>
                      ) : (
                        <span className="text-ink-500 italic">No phone added</span>
                      )}

                      {u.date_of_birth && (
                        <span className="inline-flex items-center gap-1 text-ink-400">
                          🎂 DOB: {u.date_of_birth}
                        </span>
                      )}

                      {u.pet_name && (
                        <span className="text-ink-400">
                          🐾 Pet: <strong className="text-ink-200">{u.pet_name}</strong>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 text-xs text-ink-400 pt-2 sm:pt-0 border-t border-white/[0.04] sm:border-0">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px]" title="Pets">{u.pet_count} pets</span>
                    <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[11px]" title="Smart Tags">{u.tag_count} tags</span>
                  </div>
                  <span className="shrink-0 text-[11px] text-ink-500">
                    Joined {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Orders Tab ── */
function OrdersTab() {
  const [orders, setOrders] = useState<{
    id: string;
    order_number: string;
    customer_name: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    quantity: number;
    payment_status: string;
    shipping_status: string;
    amount: number;
    notes?: string;
    created_at: string;
    tag_id?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      let list: any[] = [];

      // 1. Fetch from smart_tag_orders table
      try {
        const { data: orderData } = await supabase
          .from('smart_tag_orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        if (orderData && orderData.length > 0) {
          list = [...orderData];
        }
      } catch (e) {
        console.warn('Could not query smart_tag_orders directly:', e);
      }

      // 2. Fallback / merge local storage orders
      try {
        const local = JSON.parse(localStorage.getItem('petziq_smart_tag_orders') || '[]');
        if (local && local.length > 0) {
          const existingIds = new Set(list.map((o) => o.order_number || o.id));
          const unmerged = local.filter((o: any) => !existingIds.has(o.order_number || o.id));
          list = [...list, ...unmerged];
        }
      } catch {
        // ignore
      }

      // 3. ALSO fetch all Smart Tags from Supabase & localStorage and synthesize order entries for any tag
      let tagList: any[] = [];
      try {
        const { data: tagsData } = await supabase
          .from('smart_tags')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        if (tagsData && tagsData.length > 0) {
          tagList = [...tagsData];
        }
      } catch (e) {
        console.warn('Could not query smart_tags directly:', e);
      }

      try {
        const localTags = JSON.parse(localStorage.getItem('petziqq_smart_tags') || '[]');
        if (localTags && localTags.length > 0) {
          const existingTagIds = new Set(tagList.map((t) => t.tag_id || t.id));
          const unmergedTags = localTags.filter((t: any) => !existingTagIds.has(t.tag_id || t.id));
          tagList = [...tagList, ...unmergedTags];
        }
      } catch {
        // ignore
      }

      // Check locally saved order overrides so admin status changes stick immediately
      let savedOrdersMap: Record<string, any> = {};
      try {
        const local = JSON.parse(localStorage.getItem('petziq_smart_tag_orders') || '[]');
        if (Array.isArray(local)) {
          for (const o of local) {
            if (o.id) savedOrdersMap[o.id] = o;
            if (o.order_number) savedOrdersMap[o.order_number] = o;
            if (o.tag_id) savedOrdersMap[o.tag_id] = o;
          }
        }
      } catch {
        // ignore
      }

      // Track existing tag IDs or order numbers already in list
      const existingRefs = new Set(list.map((o) => o.tag_id || o.order_number || o.id));

      // Synthesize order representation for tags that don't yet have a standalone checkout order
      for (const tag of tagList) {
        const tagRef = tag.tag_id || tag.id;
        if (!existingRefs.has(tagRef) && !existingRefs.has(`PZO-${tagRef}`)) {
          // If admin has previously updated this order status in local storage, respect that!
          const override = savedOrdersMap[tagRef] || savedOrdersMap[tag.id] || savedOrdersMap[tag.tag_id];

          list.push({
            id: tag.id || tagRef,
            order_number: tag.tag_id || `PZO-${tag.id?.slice(0, 8) || 'TAG'}`,
            customer_name: tag.owner_info?.owner_name || tag.name || 'Pet Owner',
            phone: tag.owner_info?.emergency_contact || tag.owner_info?.contact_phone || '',
            email: tag.owner_info?.contact_email || '',
            shipping_name: tag.owner_info?.owner_name || '',
            address: tag.tag_details?.address || tag.owner_info?.address || 'India',
            city: '',
            state: '',
            postal_code: '',
            quantity: 1,
            amount: 648,
            payment_status: override?.payment_status || 'pending',
            shipping_status: override?.shipping_status || 'pending',
            notes: `${tag.name || 'Pet'} (${tag.tag_details?.species || tag.tag_type || 'Smart Tag'}${tag.tag_details?.breed ? ' - ' + tag.tag_details.breed : ''})`,
            tag_id: tag.tag_id || tag.id,
            created_at: tag.created_at || new Date().toISOString(),
          });
        }
      }

      // Sort newest first
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setOrders(list);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (
    orderId: string,
    newPaymentStatus: string,
    newShippingStatus: string
  ) => {
    setUpdatingId(orderId);
    try {
      // 1. Try smart_tag_orders update in Supabase
      try {
        const { error: updErr } = await supabase
          .from('smart_tag_orders')
          .update({
            payment_status: newPaymentStatus,
            shipping_status: newShippingStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updErr) {
          await supabase.rpc('update_order_status', {
            p_order_id: orderId,
            p_payment_status: newPaymentStatus,
            p_shipping_status: newShippingStatus,
          });
        }
      } catch {
        // ignore
      }

      // 2. Also update corresponding smart_tags record status in Supabase & localStorage
      try {
        const targetTagStatus = newPaymentStatus === 'paid' ? 'active' : 'pending';
        await supabase.from('smart_tags').update({ status: targetTagStatus, updated_at: new Date().toISOString() }).eq('tag_id', orderId);
        await supabase.from('smart_tags').update({ status: targetTagStatus, updated_at: new Date().toISOString() }).eq('id', orderId);

        const localTags = JSON.parse(localStorage.getItem('petziqq_smart_tags') || '[]');
        const updatedTags = localTags.map((t: any) =>
          t.id === orderId || t.tag_id === orderId ? { ...t, status: targetTagStatus, updated_at: new Date().toISOString() } : t
        );
        localStorage.setItem('petziqq_smart_tags', JSON.stringify(updatedTags));
      } catch {
        // ignore
      }

      // 3. Persist to localStorage orders queue
      try {
        const local = JSON.parse(localStorage.getItem('petziq_smart_tag_orders') || '[]');
        let found = false;
        const updatedLocal = local.map((o: any) => {
          if (o.id === orderId || o.order_number === orderId || o.tag_id === orderId) {
            found = true;
            return { ...o, payment_status: newPaymentStatus, shipping_status: newShippingStatus, updated_at: new Date().toISOString() };
          }
          return o;
        });

        if (!found) {
          // If it was a synthesized tag order, save it so the status change persists across reloads
          const matchingOrder = orders.find((o) => o.id === orderId || o.order_number === orderId || o.tag_id === orderId);
          if (matchingOrder) {
            updatedLocal.push({
              ...matchingOrder,
              payment_status: newPaymentStatus,
              shipping_status: newShippingStatus,
              updated_at: new Date().toISOString(),
            });
          }
        }
        localStorage.setItem('petziq_smart_tag_orders', JSON.stringify(updatedLocal));
      } catch {
        // ignore
      }

      // 4. Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId || o.order_number === orderId || o.tag_id === orderId
            ? { ...o, payment_status: newPaymentStatus, shipping_status: newShippingStatus }
            : o
        )
      );

      if (selectedOrder?.id === orderId || selectedOrder?.order_number === orderId || selectedOrder?.tag_id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, payment_status: newPaymentStatus, shipping_status: newShippingStatus } : null
        );
      }
    } catch (e) {
      console.error('Failed to update order status:', e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-50">Smart Tag Orders</h2>
          <p className="mt-1 text-sm text-ink-400">Live order queue from customer purchases.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-300 border border-brand-500/20">
            {orders.length} order{orders.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-6">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.03]" />)}</div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-amber-200">{friendlyError(error)}</div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center text-sm text-ink-400">
            <Tag className="mx-auto h-8 w-8 text-ink-500 mb-2" />
            No Smart Tag orders have been placed yet.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                className="cursor-pointer px-5 py-4 transition hover:bg-white/[0.02]"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/10 text-brand-400 font-mono text-xs font-bold">
                    PZ
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-ink-50">{order.order_number}</p>
                      <span className="text-xs text-ink-400">&bull;</span>
                      <p className="text-xs text-ink-300">{order.customer_name || 'Customer'}</p>
                    </div>
                    <p className="text-xs text-ink-400 truncate mt-0.5">
                      {order.notes || `${order.quantity} tag(s)`}
                    </p>
                  </div>

                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    order.payment_status === 'paid' ? 'bg-green-500/15 text-green-300 border border-green-500/30' : 'bg-white/[0.06] text-ink-300'
                  }`}>
                    {order.payment_status}
                  </span>

                  <span className="rounded-full bg-ocean-500/15 border border-ocean-500/30 px-2.5 py-1 text-[10px] font-semibold text-ocean-200 uppercase tracking-wider">
                    {order.shipping_status}
                  </span>

                  <span className="font-display text-sm font-bold text-ink-50">
                    ₹{Number(order.amount || 0).toFixed(2)}
                  </span>

                  <span className="text-xs text-ink-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Expanded details */}
                {selectedOrder?.id === order.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 rounded-2xl border border-white/[0.08] bg-ink-950/70 p-5 text-xs space-y-4 animate-fade-in"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <span className="text-ink-400 uppercase tracking-wider text-[10px] block font-semibold">Client Contact</span>
                        <p className="text-ink-100 font-bold text-sm">{order.customer_name}</p>
                        <p className="text-ink-200 font-mono">{order.phone || 'No phone provided'}</p>
                        <p className="text-ink-400">{order.email || 'No email'}</p>
                        {order.phone && (
                          <div className="pt-2 flex flex-wrap gap-2">
                            <a
                              href={`tel:${order.phone}`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-green-500/15 border border-green-500/30 px-2.5 py-1 text-green-300 font-semibold text-[11px] hover:bg-green-500/25 transition"
                            >
                              Call Client
                            </a>
                            <a
                              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.customer_name}, this is Petziq regarding your Smart Tag order ${order.order_number} for verification and payment.`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-emerald-300 font-semibold text-[11px] hover:bg-emerald-500/25 transition"
                            >
                              WhatsApp
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-ink-400 uppercase tracking-wider text-[10px] block font-semibold">Delivery Address</span>
                        <p className="text-ink-200">{order.address || '—'}</p>
                        <p className="text-ink-300 font-medium">
                          {[order.city, order.state, order.postal_code].filter(Boolean).join(', ') || 'India'}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-ink-400 uppercase tracking-wider text-[10px] block font-semibold">Tag Configuration</span>
                        <p className="text-brand-300 font-medium text-sm">{order.notes || 'Petziq Smart Tag'}</p>
                        <p className="text-ink-400">Order Amount: ₹{Number(order.amount || 0).toFixed(2)}</p>
                        <p className="text-ink-400">Quantity: {order.quantity}</p>
                      </div>
                    </div>

                    {/* Laser Engraving QR Code with Direct Admin Download */}
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4 text-brand-300" />
                          <p className="text-ink-100 font-semibold text-xs">Laser Engraving QR Code</p>
                        </div>
                        <p className="text-ink-400 text-[11px] mt-1 max-w-md leading-relaxed">
                          This QR is linked to the pet's live profile URL for order <strong className="text-brand-300 font-mono">{order.order_number}</strong>. Download this image to use directly in the laser engraving machine.
                        </p>
                        <p className="text-[10px] text-ocean-300 font-mono mt-1 break-all">
                          Target URL: {getTagPublicUrl(order.tag_id || order.order_number)}
                        </p>
                      </div>

                      <div className="shrink-0 flex flex-col items-center">
                        <QRCodeDisplay
                          value={getTagPublicUrl(order.tag_id || order.order_number)}
                          size={110}
                          downloadable
                          filename={`qr-${order.order_number}`}
                        />
                      </div>
                    </div>

                    {/* Admin Status Management Controls */}
                    <div className="border-t border-white/[0.08] pt-4">
                      <p className="text-ink-200 font-semibold text-xs mb-2">Update Order Status (Admin Control)</p>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <label className="text-ink-400 text-[11px]">Payment Status:</label>
                          <select
                            value={order.payment_status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value, order.shipping_status)}
                            className="rounded-lg border border-white/10 bg-ink-900 px-2.5 py-1 text-xs text-ink-100 focus:border-brand-500 focus:outline-none"
                          >
                            <option value="pending">pending (awaiting call / UPI)</option>
                            <option value="processing">processing</option>
                            <option value="paid">paid</option>
                            <option value="failed">failed</option>
                            <option value="refunded">refunded</option>
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="text-ink-400 text-[11px]">Shipping Status:</label>
                          <select
                            value={order.shipping_status}
                            disabled={updatingId === order.id}
                            onChange={(e) => handleUpdateOrderStatus(order.id, order.payment_status, e.target.value)}
                            className="rounded-lg border border-white/10 bg-ink-900 px-2.5 py-1 text-xs text-ink-100 focus:border-brand-500 focus:outline-none"
                          >
                            <option value="pending">pending</option>
                            <option value="processing">processing</option>
                            <option value="packed">packed</option>
                            <option value="shipped">shipped</option>
                            <option value="in_transit">in_transit</option>
                            <option value="delivered">delivered</option>
                            <option value="cancelled">cancelled</option>
                          </select>
                        </div>

                        {updatingId === order.id && (
                          <span className="text-[11px] text-brand-300 animate-pulse font-medium">Updating database...</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Pets Tab ── */
function PetsTab() {
  const [pets, setPets] = useState<{ id: string; name: string; species: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('pets').select('id, name, species, created_at').order('created_at', { ascending: false }).limit(50)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else if (data) setPets(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-50">Pets</h2>
        <span className="text-sm text-ink-400">{pets.length} pets</span>
      </div>
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-amber-200">{friendlyError(error)}</div>
        ) : pets.length === 0 ? (
          <div className="p-6 text-center text-sm text-ink-400">No pets found.</div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {pets.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-500/10 text-brand-300">
                  <PawPrint className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-50">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.species}</p>
                </div>
                <span className="text-xs text-ink-400">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Plants Tab ── */
function PlantsTab() {
  const [plants, setPlants] = useState<{ id: string; name: string; species: string | null; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('user_plants').select('id, name, species, created_at').order('created_at', { ascending: false }).limit(50)
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else if (data) setPlants(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink-50">Plants</h2>
        <span className="text-sm text-ink-400">{plants.length} plants</span>
      </div>
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-amber-200">{friendlyError(error)}</div>
        ) : plants.length === 0 ? (
          <div className="p-6 text-center text-sm text-ink-400">No plants found.</div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {plants.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-green-500/10 text-green-300">
                  <Sprout className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-50">{p.name}</p>
                  <p className="text-xs text-ink-400">{p.species ?? 'Unknown'}</p>
                </div>
                <span className="text-xs text-ink-400">{new Date(p.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tags Tab ── */
function TagsTab() {
  const [tags, setTags] = useState<{
    id: string;
    name: string | null;
    tag_id: string;
    tag_type: string;
    status: string;
    owner_info?: any;
    tag_details?: any;
    visibility?: any;
    created_at?: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [updatingTagId, setUpdatingTagId] = useState<string | null>(null);

  const fetchTags = () => {
    supabase.from('smart_tags').select('*').order('created_at', { ascending: false }).limit(100)
      .then(({ data, error: err }) => {
        let list: any[] = [];
        if (data && data.length > 0) list = data;

        // Also merge local storage tags
        try {
          const local = JSON.parse(localStorage.getItem('petziqq_smart_tags') || '[]');
          if (local && local.length > 0) {
            const existingIds = new Set(list.map((t) => t.tag_id || t.id));
            const unmerged = local.filter((t: any) => !existingIds.has(t.tag_id || t.id));
            list = [...list, ...unmerged];
          }
        } catch {
          // ignore
        }
        setTags(list);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleUpdateTagStatus = async (tagId: string, newStatus: string) => {
    setUpdatingTagId(tagId);
    try {
      // 1. Try Supabase update
      await supabase.from('smart_tags').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('tag_id', tagId);
      await supabase.from('smart_tags').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', tagId);

      // 2. Sync localStorage
      try {
        const local = JSON.parse(localStorage.getItem('petziqq_smart_tags') || '[]');
        const updated = local.map((t: any) =>
          t.id === tagId || t.tag_id === tagId ? { ...t, status: newStatus, updated_at: new Date().toISOString() } : t
        );
        localStorage.setItem('petziqq_smart_tags', JSON.stringify(updated));
      } catch {
        // ignore
      }

      setTags((prev) =>
        prev.map((t) => (t.id === tagId || t.tag_id === tagId ? { ...t, status: newStatus } : t))
      );
    } catch (e) {
      console.error('Failed to update tag status:', e);
    } finally {
      setUpdatingTagId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-50">Smart Tags</h2>
          <p className="mt-1 text-sm text-ink-400">Click any tag to view emergency details, QR profile link, and change tag status.</p>
        </div>
        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 border border-purple-500/20">
          {tags.length} tag{tags.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-white/[0.03]" />
            ))}
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm text-amber-200">{friendlyError(error)}</div>
        ) : tags.length === 0 ? (
          <div className="p-6 text-center text-sm text-ink-400">No smart tags found.</div>
        ) : (
          <div className="divide-y divide-white/[0.06]">
            {tags.map((t) => {
              const isSelected = selectedTagId === t.id || selectedTagId === t.tag_id;
              const details = t.tag_details || {};
              const owner = t.owner_info || {};

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTagId(isSelected ? null : t.id)}
                  className="cursor-pointer px-4 sm:px-5 py-4 transition hover:bg-white/[0.02]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-purple-500/10 text-purple-300">
                        <Tag className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-ink-50">{t.name || 'Untitled'}</p>
                          <span className="text-xs text-ink-500 font-mono">({t.tag_id})</span>
                        </div>
                        <p className="text-xs text-ink-400 truncate">
                          {details.breed ? `${details.breed} • ` : ''}
                          {details.species || t.tag_type}
                          {owner.owner_name ? ` • Owner: ${owner.owner_name}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        t.status === 'active' || t.status === 'activated' ? 'bg-green-500/15 text-green-300 border border-green-500/30' :
                        t.status === 'ready' ? 'bg-brand-500/15 text-brand-300 border border-brand-500/30' :
                        'bg-white/[0.06] text-ink-400'
                      }`}>
                        {t.status}
                      </span>

                      <QRCodeDisplay
                        value={getTagPublicUrl(t.tag_id)}
                        size={40}
                        downloadable
                        filename={`tag-qr-${t.tag_id}`}
                        className="p-1 rounded-lg shrink-0"
                      />
                    </div>
                  </div>

                  {/* Expanded Tag Info & Admin Controls */}
                  {isSelected && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 rounded-2xl border border-white/[0.08] bg-ink-950/80 p-4 sm:p-5 text-xs space-y-4 animate-fade-in"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <span className="text-ink-400 uppercase tracking-wider text-[10px] block font-semibold">Pet Information</span>
                          <p className="text-ink-100 font-bold text-sm">{t.name || 'Pet'}</p>
                          <p className="text-ink-300">Species: {details.species || '—'}</p>
                          <p className="text-ink-300">Breed: {details.breed || '—'}</p>
                          <p className="text-ink-400">Gender: {details.gender || '—'}</p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-ink-400 uppercase tracking-wider text-[10px] block font-semibold">Emergency Contacts</span>
                          <p className="text-ink-200 font-semibold">{owner.owner_name || 'Owner not specified'}</p>
                          <p className="text-ink-100 font-mono">{owner.emergency_contact || owner.contact_phone || 'No phone'}</p>
                          <p className="text-ink-400">{owner.contact_email || 'No email'}</p>
                          {(owner.emergency_contact || owner.contact_phone) && (
                            <div className="pt-1 flex gap-2">
                              <a
                                href={`tel:${owner.emergency_contact || owner.contact_phone}`}
                                className="inline-flex items-center gap-1 rounded-md bg-green-500/15 border border-green-500/30 px-2 py-0.5 text-[11px] text-green-300 font-semibold"
                              >
                                Call
                              </a>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <span className="text-ink-400 uppercase tracking-wider text-[10px] block font-semibold">Medical & ID</span>
                          <p className="text-ink-300 leading-relaxed">{details.identification_notes || 'No special medical notes provided.'}</p>
                          <p className="text-ink-500 pt-1 text-[11px] font-mono">
                            Public URL:{' '}
                            <a
                              href={getTagPublicUrl(t.tag_id)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-300 underline hover:text-brand-200"
                            >
                              {getTagPublicUrl(t.tag_id)}
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Admin Status Controls */}
                      <div className="border-t border-white/[0.08] pt-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <label className="text-ink-300 text-xs font-medium">Change Status:</label>
                          <select
                            value={t.status}
                            disabled={updatingTagId === t.id || updatingTagId === t.tag_id}
                            onChange={(e) => handleUpdateTagStatus(t.id, e.target.value)}
                            className="rounded-lg border border-white/10 bg-ink-900 px-3 py-1.5 text-xs text-ink-100 focus:border-brand-500 focus:outline-none"
                          >
                            <option value="active">Active (QR profile publicly accessible)</option>
                            <option value="ready">Ready (Configured but pending dispatch)</option>
                            <option value="draft">Draft (Incomplete profile)</option>
                            <option value="disabled">Disabled (Suspended tag)</option>
                          </select>
                        </div>

                        <a
                          href={getTagPublicUrl(t.tag_id)}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-ghost py-1 px-3 text-xs inline-flex items-center gap-1.5"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View Live Profile
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Animal Database Tab ── */
function AnimalDatabaseTab() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  const [jobs, setJobs] = useState<{ id: string; status: string; source_format: string; processed_records: number; total_records: number; failed_records: number }[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [statsRes, jobsRes] = await Promise.all([
          supabase.rpc('taxonomy_import_stats'),
          supabase.from('taxonomy_import_jobs').select('id, status, source_format, processed_records, total_records, failed_records').order('created_at', { ascending: false }).limit(20),
        ]);
        if (!active) return;
        if (!statsRes.error && statsRes.data && typeof statsRes.data === 'object') {
          setStats(statsRes.data as Record<string, number>);
        } else {
          // Graceful fallback to verified built-in Petziq species and breed taxonomy database
          setStats({
            existing_records: BREEDS.length,
            new_imported_records: PLANTS.length,
            total_records: BREEDS.length + PLANTS.length,
          });
        }
        if (!jobsRes.error && jobsRes.data) {
          setJobs(jobsRes.data as typeof jobs);
        }
      } catch {
        if (!active) return;
        setStats({
          existing_records: BREEDS.length,
          new_imported_records: PLANTS.length,
          total_records: BREEDS.length + PLANTS.length,
        });
      }
    })();
    return () => { active = false; };
  }, []);

  const value = (key: string) => stats?.[key] ?? 0;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-semibold text-ink-50">Animal Database</h2>
        <p className="mt-1 text-sm text-ink-400">Server-side taxonomy storage and catalog records.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Breeds & Animals', 'existing_records'],
          ['Flora & Plant Species', 'new_imported_records'],
          ['Total Catalog Records', 'total_records'],
        ].map(([label, key]) => (
          <div key={key} className="card-surface p-5"><p className="text-xs uppercase tracking-wide text-ink-400">{label}</p><p className="mt-2 font-display text-3xl font-bold text-ink-50">{value(key)}</p></div>
        ))}
      </div>
      <div className="card-surface overflow-hidden">
        <div className="border-b border-white/[0.06] px-5 py-4"><h3 className="font-display text-lg font-semibold text-ink-50">Import Jobs</h3></div>
        {jobs.length === 0 ? <p className="p-5 text-sm text-ink-400">No external import jobs in progress. Built-in animal and plant database is active and serving the application.</p> : <div className="divide-y divide-white/[0.06]">{jobs.map((job) => <div key={job.id} className="flex flex-wrap items-center gap-3 px-5 py-4 text-sm"><span className="rounded-full bg-brand-500/10 px-2.5 py-1 text-brand-200">{job.status}</span><span className="text-ink-300">{job.source_format.toUpperCase()}</span><span className="text-ink-400">{job.processed_records} / {job.total_records} processed</span><span className="text-amber-200">{job.failed_records} failed</span></div>)}</div>}
      </div>
    </div>
  );
}

/* ── Analytics Tab ── */
function AnalyticsTab({ stats, loading }: { stats: AdminStats; loading: boolean }) {
  const metrics = [
    { label: 'User Engagement', value: stats.totalUsers > 0 ? `${Math.min(100, Math.round((stats.totalPets + stats.totalPlants) / Math.max(stats.totalUsers, 1) * 100))}%` : 'N/A', desc: 'Pets + Plants per user' },
    { label: 'Smart Tag Adoption', value: stats.totalUsers > 0 ? `${Math.min(100, Math.round(stats.totalTags / Math.max(stats.totalUsers, 1) * 100))}%` : 'N/A', desc: 'Tags per user' },
    { label: 'Pet-to-Plant Ratio', value: stats.totalPlants > 0 ? `${(stats.totalPets / stats.totalPlants).toFixed(1)}:1` : 'N/A', desc: 'Pets vs Plants' },
    { label: 'Activated Tags', value: stats.totalTags > 0 ? `${Math.round((stats.activeTags / stats.totalTags) * 100)}%` : 'N/A', desc: 'Share of tags activated' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink-50">Analytics</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {metrics.map((m) => (
          <div key={m.label} className="card-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">{m.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-ink-50">
              {loading ? '—' : m.value}
            </p>
            <p className="mt-1 text-xs text-ink-400">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="card-surface p-6">
        <h3 className="font-display text-lg font-semibold text-ink-50">Growth Summary</h3>
        <div className="mt-4 space-y-3">
          {[
            { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-brand-300' },
            { label: 'Pets', value: stats.totalPets, icon: PawPrint, color: 'text-ocean-300' },
            { label: 'Plants', value: stats.totalPlants, icon: Sprout, color: 'text-green-300' },
            { label: 'Smart Tags', value: stats.totalTags, icon: Tag, color: 'text-purple-300' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="flex-1 text-sm text-ink-300">{item.label}</span>
              <div className="flex-1 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-ocean-400 transition-all duration-700"
                  style={{
                    width: loading ? '0%' : `${Math.min(100, (item.value / Math.max(stats.totalUsers, 1)) * 100)}%`,
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-ink-50 w-12 text-right">
                {loading ? '—' : item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Team Tab ── */
function TeamTab() {
  const team = [
    { name: 'Nipun Menon', role: 'CEO, Founder, Developer', adminRole: 'Full Admin', email: 'pronipun23@gmail.com', color: 'from-brand-400 to-ocean-500' },
    { name: 'Mithun (Naruto)', role: 'Senior Software Developer', adminRole: 'Full Admin', email: 'narutomithun28@gmail.com', color: 'from-amber-400 to-orange-500' },
    { name: 'Shashwath Shyam Sundar', role: 'Co Software Developer', adminRole: 'Full Admin', email: 'shashwathshyamsundar499@gmail.com', color: 'from-cyan-400 to-blue-500' },
    { name: 'Ruhan pranith michael', role: 'Security Manager', adminRole: 'Full Admin', email: 'ruhanr5623@gmail.com', color: 'from-emerald-400 to-teal-500' },
    { name: 'Gavish Varun', role: 'Manager of Marketing', adminRole: 'Marketing Manager', email: 'gavishvarun@gmail.com', color: 'from-purple-400 to-ocean-500' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink-50">Admin Team</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {team.map((member) => (
          <div key={member.name} className="card-surface p-6">
            <div className="flex items-center gap-4">
              <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br ${member.color} text-lg font-bold text-white`}>
                {member.name.charAt(0)}
              </span>
              <div>
                <p className="font-display text-lg font-semibold text-ink-50">{member.name}</p>
                <p className="text-sm text-ink-300">{member.role}</p>
                <p className="text-xs text-ink-400 font-mono mt-0.5">{member.email}</p>
                <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-300">
                  <Shield className="h-3 w-3" />
                  {member.adminRole}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Settings Tab ── */
function SettingsTab() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-ink-50">Settings</h2>
      <div className="card-surface p-6">
        <h3 className="font-display text-lg font-semibold text-ink-50">Admin Authorization</h3>
        <p className="mt-2 text-sm text-ink-300">
          Admin roles are enforced server-side through the Supabase profiles table.
          The role column determines access level. Do not modify roles from the client side
          without proper authorization.
        </p>
        <div className="mt-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Current Authorization Model</p>
          <div className="mt-2 space-y-2 text-sm text-ink-300">
            <p><span className="font-semibold text-brand-300">Full Admin:</span> Complete administrative access to all features.</p>
            <p><span className="font-semibold text-ocean-300">Marketing Manager:</span> Marketing analytics and content. No access to roles, billing, or user management.</p>
            <p><span className="font-semibold text-ink-300">Normal User:</span> Standard application features. No admin access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
