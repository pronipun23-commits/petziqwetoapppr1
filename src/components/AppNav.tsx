import {
  Home, PawPrint, Sprout, Trophy, Bell,
  Heart, User, LogOut, Menu, X, Search,
  BookOpen, Compass, Apple, Tag, HelpCircle, Mail, Shield, Sparkles,
  Camera, MessageCircle, AlertTriangle, Settings,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { SearchBar } from './SearchBar';
import { Logo } from './Logo';

interface AppNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenAccountModal?: () => void;
}

const NAV_ITEMS = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'My Pets', path: '/my-pets', icon: PawPrint },
  { label: 'Scrapbook', path: '/scrapbook', icon: Camera },
  { label: 'Smart Tags', path: '/smart-tags', icon: Tag },
  { label: 'Lost Pet Radar', path: '/lost-pet', icon: AlertTriangle },
  { label: 'Community', path: '/community', icon: MessageCircle },
  { label: 'My Plants', path: '/my-plants', icon: Sprout },
  { label: 'Explore', path: '/explore', icon: Compass },
  { label: 'Reminders', path: '/reminders', icon: Bell },
  { label: 'Care Guides', path: '/care', icon: BookOpen },
  { label: 'Favorites', path: '/favorites', icon: Heart },
  { label: 'Progress', path: '/progress', icon: Trophy },
  { label: 'Admin', path: '/admin', icon: Shield },
];

const MOBILE_NAV = [
  { label: 'Home', path: '/dashboard', icon: Home },
  { label: 'Pets', path: '/my-pets', icon: PawPrint },
  { label: 'Scrapbook', path: '/scrapbook', icon: Camera },
  { label: 'Lounge', path: '/community', icon: MessageCircle },
  { label: 'Tags', path: '/smart-tags', icon: Tag },
  { label: 'More', path: '#more', icon: Menu },
];

export function AppNav({ currentPath, onNavigate }: AppNavProps) {
  const { profile, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  // Admin functionality is not exposed in navigation to non-admin accounts.
  const navItems = NAV_ITEMS.filter((item) => item.path !== '/admin' || isAdmin);
  const [moreOpen, setMoreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    if (moreOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [moreOpen]);

  const isActive = (path: string) =>
    path === '/dashboard'
      ? currentPath === '/' || currentPath === '/dashboard'
      : currentPath.startsWith(path);

  const firstName = profile?.full_name?.split(' ')[0] ?? 'User';

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-white/[0.08] glass lg:flex">
        <div className="flex h-16 items-center gap-2.5 px-5">
          <Logo size={36} withWordmark />
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive(item.path)
                  ? 'bg-brand-500/15 text-brand-500 ring-1 ring-brand-500/20'
                  : 'text-ink-300 hover:bg-white/[0.06] hover:text-ink-50'
              }`}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" style={{ width: 18, height: 18 }} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile section */}
        <div className="border-t border-white/[0.08] p-3">
          <button
            onClick={() => onNavigate('/about')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50"
          >
            <User className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            About
          </button>
          <button
            onClick={onOpenAccountModal}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/10 hover:text-emerald-200"
          >
            <Settings className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            Customize Account
          </button>
          <button
            onClick={() => onNavigate('/contact')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50"
          >
            <Mail className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            Contact
          </button>
          <button
            onClick={() => onNavigate('/help')}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50"
          >
            <HelpCircle className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            Help Center
          </button>
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-300 transition hover:bg-white/[0.06] hover:text-ink-50"
          >
            <LogOut className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
            Sign Out
          </button>
          <div
            onClick={onOpenAccountModal}
            className="mt-2 flex items-center gap-3 rounded-xl bg-white/[0.05] px-3 py-2.5 cursor-pointer hover:bg-white/[0.08] transition"
            title="Click to customize account"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-xs font-bold text-white">
              {firstName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-ink-50">{profile?.full_name ?? 'User'}</p>
              <p className="truncate text-[10px] text-ink-400">{profile?.pet_name ? `${profile.pet_name}'s human` : 'Pet owner'}</p>
            </div>
            <Settings className="h-3.5 w-3.5 text-ink-400" />
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-white/[0.08] bg-ink-900/80 px-4 backdrop-blur-xl lg:hidden">
        <button
          onClick={() => onNavigate('/dashboard')}
          className="flex items-center gap-2"
          aria-label="Petziq home"
        >
          <Logo size={32} withWordmark />
        </button>

        <div className="flex items-center gap-2">
          {/* Docked AI Assistant Button */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('toggle-petziq-ai'))}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1.5 text-emerald-200 transition hover:bg-emerald-500/25"
            aria-label="Petziq AI Assistant"
          >
            <Sparkles className="h-4 w-4 text-emerald-300 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-white">AI</span>
          </button>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] text-ink-200 transition hover:bg-white/[0.06]"
            aria-label="Search"
          >
            <Search className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
          </button>
          <button
            onClick={() => onNavigate('/reminders')}
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] text-ink-200 transition hover:bg-white/[0.06]"
            aria-label="Reminders"
          >
            <Bell className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
          </button>
          <button
            onClick={() => setMoreOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/[0.08] text-ink-200 transition hover:bg-white/[0.06]"
            aria-label="More menu"
          >
            <User className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />
          </button>
        </div>
      </header>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink-950/90 backdrop-blur-xl px-4 pt-4 lg:hidden" onClick={() => setSearchOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-ink-50">Search</span>
              <button onClick={() => setSearchOpen(false)} className="rounded-full p-2 text-ink-300 hover:text-ink-50">
                <X className="h-5 w-5" />
              </button>
            </div>
            <SearchBar onNavigate={(p) => { onNavigate(p); setSearchOpen(false); }} />
          </div>
        </div>
      )}

      {/* Mobile "More" sheet */}
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-50 glass-light lg:hidden" onClick={() => setMoreOpen(false)} />
          <div
            ref={moreRef}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl border-t border-white/[0.08] bg-ink-850/95 p-5 pb-8 shadow-soft backdrop-blur-xl lg:hidden animate-fade-up"
          >
            <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" />
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-sm font-bold text-white">
                {firstName.charAt(0).toUpperCase()}
              </span>
              <div>
                <p className="font-semibold text-ink-50">{profile?.full_name ?? 'User'}</p>
                <p className="text-xs text-ink-400">{profile?.pet_name ? `${profile.pet_name}'s human` : 'Pet owner'}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {navItems.filter((item) => !MOBILE_NAV.some((m) => m.path === item.path)).map((item) => (
                <button
                  key={item.path}
                  onClick={() => { onNavigate(item.path); setMoreOpen(false); }}
                  className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] p-3 text-ink-200 transition hover:bg-white/[0.06]"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => { if (onOpenAccountModal) onOpenAccountModal(); setMoreOpen(false); }}
                className="flex flex-col items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-300 transition hover:bg-emerald-500/20"
              >
                <Settings className="h-5 w-5" />
                <span className="text-xs font-medium">Account</span>
              </button>
              <button
                onClick={() => { onNavigate('/about'); setMoreOpen(false); }}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] p-3 text-ink-200 transition hover:bg-white/[0.06]"
              >
                <User className="h-5 w-5" />
                <span className="text-xs font-medium">About</span>
              </button>
              <button
                onClick={signOut}
                className="flex flex-col items-center gap-2 rounded-xl border border-red-500/20 p-3 text-red-600 transition hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-xs font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/[0.08] glass px-1 py-1 backdrop-blur-xl lg:hidden">
        {MOBILE_NAV.map((item) => {
          const active = isActive(item.path) && item.path !== '#more';
          if (item.path === '#more') {
            return (
              <button
                key="more"
                onClick={() => setMoreOpen(true)}
                className="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-ink-300 transition hover:text-ink-50"
                aria-label="More"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">More</span>
              </button>
            );
          }
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 transition ${
                active ? 'text-brand-300' : 'text-ink-300 hover:text-ink-50'
              }`}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
