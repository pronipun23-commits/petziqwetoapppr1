import { useState, useEffect } from 'react';
import {
  PawPrint,
  Sprout,
  ArrowRight,
  Shield,
  Bell,
  Heart,
  Droplet,
  Sun,
  Activity,
  CheckCircle2,
  Sparkles,
  Zap,
  Tag,
  Clock,
  Scan,
  AlertTriangle,
  ChevronRight,
  Layers,
  ThermometerSun
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { AntigravityHero } from '@/components/AntigravityHero';
import { MobileAppShowcase } from '@/components/MobileAppShowcase';
import { BREEDS } from '@/data/breeds';
import { PLANTS } from '@/data/plants';
import { BLOG_POSTS } from '@/data/blog';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onLogin: () => void;
  onSignUp: () => void;
}

export function LandingPage({ onNavigate, onLogin, onSignUp }: LandingPageProps) {
  // Global Smart Switcher state ("Pet Mode" vs "Plant Mode")
  const [activeMode, setActiveMode] = useState<'pets' | 'plants'>('pets');

  // Floating Header dynamic shrink & glassmorphic opacity state on scroll
  const [isScrolled, setIsScrolled] = useState(false);

  // Subscription billing toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-ink-950 text-ink-100 selection:bg-brand-400/30 selection:text-white">
      {/* =========================================================================
          1. GLOBAL FLOATING NAVIGATION & SMART SWITCHER (Apple x Google Hybrid)
          ========================================================================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? 'py-2.5 bg-ink-950/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="container-px flex items-center justify-between gap-4">
          {/* Logo with Brand Wordmark */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.02] focus:outline-none"
            aria-label="Petziq Home"
          >
            <Logo size={36} withWordmark />
          </button>

          {/* Central Smart Switcher Toggle: Pet Mode <-> Plant Mode */}
          <div className="hidden md:flex items-center rounded-full border border-white/[0.12] bg-ink-900/80 p-1 backdrop-blur-xl shadow-inner">
            <button
              onClick={() => setActiveMode('pets')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeMode === 'pets'
                  ? 'bg-gradient-to-r from-amber-500/20 to-brand-500/20 text-white border border-white/20 shadow-sm'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <PawPrint className="h-3.5 w-3.5 text-amber-300" />
              Pet Ecosystem
            </button>
            <button
              onClick={() => setActiveMode('plants')}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                activeMode === 'plants'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-white border border-white/20 shadow-sm'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              <Sprout className="h-3.5 w-3.5 text-emerald-300" />
              Plant Sanctuary
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('/blog')}
              className="hidden lg:inline-flex text-xs font-semibold text-ink-300 hover:text-white px-3 py-1.5 transition"
            >
              Journal
            </button>
            <button
              onClick={() => onNavigate('/smart-tags')}
              className="hidden sm:inline-flex text-xs font-semibold text-ink-300 hover:text-white px-3 py-1.5 transition"
            >
              Smart Tags
            </button>
            <button
              onClick={onLogin}
              className="btn-ghost text-xs px-4 py-2 border border-white/[0.12] hover:bg-white/[0.06]"
            >
              Sign In
            </button>
            <button
              onClick={onSignUp}
              className="btn-primary text-xs px-4 py-2 shadow-glow hover:scale-[1.02]"
            >
              Join Companion
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. 250vh HERO SECTION & 3D PARALLAX CANVAS (The Hook)
          ========================================================================= */}
      <AntigravityHero
        onNavigate={onNavigate}
        onOrderTag={() => onNavigate('/smart-tags')}
      />

      {/* =========================================================================
          3. RESPONSIVE BENTO GRID WITH SPRING PHYSICS & HOVER GLOWS
          ========================================================================= */}
      <section className="container-px mt-28 relative z-20">
        <div className="mx-auto max-w-2xl text-center mb-14">
          <span className="eyebrow text-brand-300">Biophilic Cyber-Minimalism</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Designed for living things.
          </h2>
          <p className="mt-3 text-base text-ink-300 leading-relaxed">
            A cohesive hardware and software ecosystem bridging biometric pet profiles, clinical medication schedules, and botanical moisture telemetry.
          </p>
        </div>

        {/* Bento Grid layout: 3-column desktop -> 2-column tablet -> 1-column mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Bento Card 1: 330 Pet Breeds Deep Intelligence (Span 2 col on Desktop) */}
          <div className="group lg:col-span-2 relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 via-ink-900/90 to-ink-950 p-7 sm:p-9 glass transition-all duration-500 hover:-translate-y-1 hover:border-amber-400/40 hover:shadow-[0_0_35px_rgba(245,158,11,0.18)]">
            <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-amber-500/15 blur-3xl transition group-hover:bg-amber-500/25 pointer-events-none" />
            <div className="flex items-center gap-2.5 text-xs font-semibold text-amber-300 uppercase tracking-widest">
              <PawPrint className="h-4 w-4 text-amber-400" />
              <span>Taxonomic Database</span>
            </div>
            <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white">
              330 Verified Pet Breed Encyclopedias
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
              Structured temperaments, genetic predispositions, exercise quotients, and coat maintenance schedules across dogs, cats, reptiles, and exotic species.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {['14 Categorical Taxonomy', 'Lifespan & Energy Metrics', 'Nutritional Restrictions'].map((pill) => (
                <span key={pill} className="rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-xs text-amber-200">
                  {pill}
                </span>
              ))}
            </div>
            <button
              onClick={() => onNavigate('/explore')}
              className="mt-8 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 group-hover:text-amber-200 transition"
            >
              Explore 330 Breeds <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bento Card 2: Botanical 99 Plant Hydration Guard */}
          <div className="group relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/20 via-ink-900/90 to-ink-950 p-7 glass transition-all duration-500 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-[0_0_35px_rgba(16,185,129,0.2)]">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl transition group-hover:bg-emerald-500/30 pointer-events-none" />
            <div className="flex items-center gap-2.5 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              <Sprout className="h-4 w-4" />
              <span>Flora Sanctuary</span>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              99 Safe Botanical Guides
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Photoperiod lux ranges, soil moisture thresholds, and pet toxicity filters across succulents, monsteras, and ficus trees.
            </p>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-200">
                <Droplet className="h-4 w-4 text-cyan-400 animate-pulse" />
                <span>Hydration Telemetry</span>
              </div>
              <span className="font-mono text-emerald-400 font-bold">Optimal</span>
            </div>
            <button
              onClick={() => onNavigate('/plants')}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 group-hover:text-emerald-200 transition"
            >
              Browse Plants <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bento Card 3: Instant Emergency Finder Tag */}
          <div className="group relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-cyan-950/20 via-ink-900/90 to-ink-950 p-7 glass transition-all duration-500 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(6,182,212,0.2)]">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-cyan-500/15 blur-3xl transition group-hover:bg-cyan-500/25 pointer-events-none" />
            <div className="flex items-center gap-2.5 text-xs font-semibold text-cyan-300 uppercase tracking-widest">
              <Shield className="h-4 w-4" />
              <span>Smart Hardware</span>
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              Instant Collar QR Routing
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-300">
              Laser-engraved aerospace acrylic tags that connect lost pets with owners in seconds without any app download needed by finders.
            </p>
            <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs">
              <span className="text-cyan-300/80 font-mono">PZ-HARDWARE</span>
              <span className="text-emerald-400 font-semibold">100% Waterproof</span>
            </div>
            <button
              onClick={() => onNavigate('/smart-tags')}
              className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 group-hover:text-cyan-200 transition"
            >
              Order Hardware <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
            </button>
          </div>

          {/* Bento Card 4: Clinical Triage & Care Schedules (Span 2 col on Desktop) */}
          <div className="group lg:col-span-2 relative overflow-hidden rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-950/20 via-ink-900/90 to-ink-950 p-7 sm:p-9 glass transition-all duration-500 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_0_35px_rgba(139,92,246,0.18)]">
            <div className="absolute top-0 right-0 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl transition group-hover:bg-violet-500/25 pointer-events-none" />
            <div className="flex items-center gap-2.5 text-xs font-semibold text-violet-300 uppercase tracking-widest">
              <Activity className="h-4 w-4 text-violet-400" />
              <span>Preventative Husbandry</span>
            </div>
            <h3 className="mt-4 font-display text-2xl sm:text-3xl font-bold text-white">
              Symptom Triage & Active Care Checklists
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-300">
              Educational behavioral solvers and synchronized daily checklists for meal portions, joint supplements, flea medication, and vet booster milestones.
            </p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3 text-xs">
                <span className="text-violet-300 text-[11px]">Vaccines</span>
                <p className="font-bold text-white mt-0.5">Automated Sync</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs">
                <span className="text-amber-300 text-[11px]">Toxicity Guard</span>
                <p className="font-bold text-white mt-0.5">Instant Alert</p>
              </div>
              <div className="col-span-2 sm:col-span-1 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs">
                <span className="text-emerald-300 text-[11px]">Reminders</span>
                <p className="font-bold text-white mt-0.5">Push & Calendar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. HIGH-FIDELITY MOBILE APP OS SHOWCASE (Apple Health x Material You)
          ========================================================================= */}
      <MobileAppShowcase />

      {/* =========================================================================
          5. PREMIUM SUBSCRIPTION EXPERIENCE (Apple Frictionless Conversion)
          ========================================================================= */}
      <section className="container-px mt-36 relative z-20">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="eyebrow text-brand-300">Membership Tiers</span>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Choose your care tier
          </h2>
          <p className="mt-3 text-base text-ink-300 leading-relaxed">
            Essential encyclopedia access is forever free. Upgrade for automated medical passports, smart telemetry, and custom laser-engraved collar tags.
          </p>

          {/* Monthly vs Yearly Billing Switcher */}
          <div className="mt-8 inline-flex items-center rounded-full border border-white/[0.12] bg-ink-900/80 p-1 backdrop-blur-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                billingCycle === 'monthly'
                  ? 'bg-white text-ink-950 shadow-md font-bold'
                  : 'text-ink-400 hover:text-ink-100'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition ${
                billingCycle === 'yearly'
                  ? 'bg-white text-ink-950 shadow-md font-bold'
                  : 'text-ink-400 hover:text-ink-100'
              }`}
            >
              <span>Annual</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                Save 25%
              </span>
            </button>
          </div>
        </div>

        {/* Comparison Tier Cards: Free Explorer vs Companion Pro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Tier 1: Free Explorer */}
          <div className="rounded-3xl border border-white/[0.12] bg-gradient-to-b from-ink-900/90 to-ink-950/95 p-8 flex flex-col justify-between glass">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Essential Explorer</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-white">Free</span>
                <span className="text-xs text-ink-400">/ forever</span>
              </div>
              <p className="mt-3 text-sm text-ink-300 leading-relaxed">
                Complete unrestricted access to all pet breed and plant care guides.
              </p>

              <div className="mt-8 space-y-3 border-t border-white/[0.08] pt-6 text-xs text-ink-200">
                {[
                  '330 Detailed Pet Breed Guides',
                  '99 Safe Botanical Care Profiles',
                  'Basic Household Toxicity Search',
                  'Community Care Articles & Journal',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-ink-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onSignUp}
              className="mt-8 btn-ghost w-full justify-center py-3 text-xs font-semibold"
            >
              Start Free Browsing
            </button>
          </div>

          {/* Tier 2: Companion Pro (Highlighted Hero Card with Radiant Gradient Border & Glow) */}
          <div className="relative rounded-3xl border-2 border-emerald-400/50 bg-gradient-to-b from-emerald-950/30 via-ink-900/90 to-ink-950 p-8 flex flex-col justify-between glass shadow-[0_0_50px_rgba(16,185,129,0.2)]">
            <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 right-8 rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 p-[1px] shadow-lg">
              <span className="block rounded-full bg-ink-950 px-3.5 py-1 text-[11px] font-bold text-white">
                ★ Most Popular
              </span>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Companion Pro Ecosystem</span>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-teal-300">
                  {billingCycle === 'yearly' ? '₹149' : '₹199'}
                </span>
                <span className="text-xs text-ink-400">/ month</span>
              </div>
              <p className="mt-3 text-sm text-ink-300 leading-relaxed">
                Full digital medical history, automated booster alerts, and synchronized collar tags.
              </p>

              <div className="mt-8 space-y-3 border-t border-emerald-500/20 pt-6 text-xs text-ink-100">
                {[
                  'All 330 Breeds + 99 Plant Guides Included',
                  'Smart Collar Tag (Laser Acrylic) Included',
                  'Instant Scannable Emergency Finder QR',
                  'Vaccine Passport & Automated Due Date Alerts',
                  'Daily Medication & Feeding Interactive Checklists',
                  'Unlimited Photo & Activity History Storage',
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span className="font-medium text-ink-100">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('/smart-tags')}
              className="mt-8 btn-primary w-full justify-center py-3.5 text-xs font-bold bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-ink-950 shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:scale-[1.02]"
            >
              Get Companion Pro + Free Collar Tag &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FOOTER & COMPLIANCE ARCHITECTURE
          ========================================================================= */}
      <footer className="mt-36 border-t border-white/[0.08] bg-ink-950/80 py-12">
        <div className="container-px flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-ink-400">
          <div className="flex items-center gap-3">
            <Logo size={28} withWordmark />
            <span className="text-ink-600">|</span>
            <span>Educational companion & hardware ecosystem</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs">
            <button onClick={() => onNavigate('/explore')} className="hover:text-white transition">330 Breeds</button>
            <button onClick={() => onNavigate('/plants')} className="hover:text-white transition">99 Plants</button>
            <button onClick={() => onNavigate('/smart-tags')} className="hover:text-white transition">Collar Tags</button>
            <button onClick={() => onNavigate('/care')} className="hover:text-white transition">Care Guides</button>
            <button onClick={() => onNavigate('/about')} className="hover:text-white transition">About</button>
            <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition">Privacy Policy</button>
          </div>

          <p>© {new Date().getFullYear()} Petziq. Crafted with precision for pets & plants.</p>
        </div>
      </footer>
    </div>
  );
}
