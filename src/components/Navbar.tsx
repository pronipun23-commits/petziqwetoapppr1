import { useEffect, useRef, useState } from 'react';
import { Heart, Menu, PawPrint, X, LogOut, UserCircle, LayoutDashboard, Trophy, Sparkles } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { Logo } from './Logo';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  currentPath: string;
  favoritesCount: number;
  onNavigate: (path: string) => void;
}

const LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Explore', path: '/explore' },
  { label: 'Plants', path: '/plants' },
  { label: 'Smart Tags', path: '/smart-tags' },
  { label: 'Blog', path: '/blog' },
  { label: 'About', path: '/about' },
];

export function Navbar({ currentPath, favoritesCount, onNavigate }: NavbarProps) {
  const { profile, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [userMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [currentPath]);

  const isActive = (path: string) =>
    path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/[0.08] glass'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container-px">
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 transition hover:opacity-90"
            aria-label="Petziq home"
          >
            <Logo size={36} withWordmark />
          </button>

          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'text-ink-50'
                    : 'text-ink-300 hover:text-ink-50'
                }`}
              >
                {isActive(link.path) && (
                  <span className="absolute inset-0 -z-10 rounded-full bg-white/[0.05] ring-1 ring-ink-700/10" />
                )}
                {link.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden w-64 md:block">
              <SearchBar onNavigate={onNavigate} />
            </div>
            <button
              onClick={() => onNavigate('/favorites')}
              className={`relative rounded-full border border-white/[0.08] p-2.5 transition hover:bg-white/[0.06] ${
                isActive('/favorites') ? 'text-accent-500' : 'text-ink-200'
              }`}
              aria-label="Favorites"
            >
              <Heart
                className={`h-4 w-4 ${isActive('/favorites') ? 'fill-accent-500' : ''}`}
              />
              {favoritesCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-white/[0.08] py-1.5 pl-1.5 pr-3 text-sm text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                aria-label="Account menu"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-xs font-bold text-white">
                  {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                </span>
                <span className="hidden max-w-20 truncate font-medium sm:block">
                  {profile?.full_name?.split(' ')[0] ?? 'User'}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/[0.08] glass p-2 animate-scale-in">
                  <div className="flex items-center gap-3 rounded-xl px-3 py-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-sm font-bold text-white">
                      {profile?.full_name?.charAt(0).toUpperCase() ?? 'U'}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink-50">
                        {profile?.full_name ?? 'User'}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs text-ink-300">
                        <UserCircle className="h-3 w-3" />
                        {profile?.pet_name ? `${profile.pet_name}\u2019s human` : 'Pet owner'}
                      </p>
                    </div>
                  </div>
                  <div className="my-1 h-px bg-white/[0.05]" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/dashboard');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    My Petziq
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/favorites');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                  >
                    <Heart className="h-4 w-4" />
                    Favorites
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/progress');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                  >
                    <Trophy className="h-4 w-4" />
                    Progress
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/my-pets');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                  >
                    <PawPrint className="h-4 w-4" />
                    My Pets
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onNavigate('/care');
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                  >
                    <UserCircle className="h-4 w-4" />
                    Care Guides
                  </button>
                  <div className="my-1 h-px bg-white/[0.05]" />
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-200 transition hover:bg-white/[0.06] hover:text-ink-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Docked AI Assistant Button on Public Header */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-petziq-ai'))}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-brand-500/20 via-teal-500/20 to-ocean-500/20 px-2.5 py-1.5 text-cyan-200 transition hover:bg-cyan-500/25 lg:hidden"
              aria-label="Petziq AI Assistant"
            >
              <Sparkles className="h-4 w-4 text-cyan-300 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-white">AI</span>
            </button>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full border border-white/[0.08] p-2.5 text-ink-200 transition hover:bg-white/[0.06] lg:hidden"
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Apple-grade Fullscreen Mobile Menu Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 top-16 z-50 flex flex-col bg-ink-950/95 backdrop-blur-2xl p-6 lg:hidden animate-fade-in overflow-y-auto pb-24">
            <div className="mb-6">
              <SearchBar onNavigate={(p) => { setMobileOpen(false); onNavigate(p); }} />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">
                  Main Navigation
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {LINKS.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => { setMobileOpen(false); onNavigate(link.path); }}
                      className={`flex items-center justify-between rounded-2xl px-5 py-3.5 text-base font-medium transition ${
                        isActive(link.path)
                          ? 'bg-brand-500/15 text-brand-300 ring-1 ring-brand-400/30 font-semibold'
                          : 'text-ink-200 hover:bg-white/[0.05] hover:text-ink-50'
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-ink-500 text-xs">→</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 mb-3">
                  Quick Actions & Care
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <button onClick={() => { setMobileOpen(false); onNavigate('/dashboard'); }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left text-sm font-medium text-ink-200 transition hover:bg-white/[0.06]">🐾 My Petziq</button>
                  <button onClick={() => { setMobileOpen(false); onNavigate('/smart-tags'); }} className="rounded-xl border border-brand-500/20 bg-brand-500/10 p-3 text-left text-sm font-semibold text-brand-300 transition hover:bg-brand-500/15">🏷️ Smart Tags</button>
                  <button onClick={() => { setMobileOpen(false); onNavigate('/favorites'); }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left text-sm font-medium text-ink-200 transition hover:bg-white/[0.06]">❤️ Favorites</button>
                  <button onClick={() => { setMobileOpen(false); onNavigate('/food'); }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left text-sm font-medium text-ink-200 transition hover:bg-white/[0.06]">🥗 Food Guide</button>
                  <button onClick={() => { setMobileOpen(false); onNavigate('/care'); }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left text-sm font-medium text-ink-200 transition hover:bg-white/[0.06]">📖 Care Guides</button>
                  <button onClick={() => { setMobileOpen(false); onNavigate('/problems'); }} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left text-sm font-medium text-ink-200 transition hover:bg-white/[0.06]">⚡ Problem Solver</button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-ink-400">
                <a href="tel:+919876543210" className="text-teal-300 hover:underline">📞 +91 98765 43210</a>
                <a href="mailto:petziq.team@gmail.com" className="text-brand-300 hover:underline">✉️ Email Support</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
