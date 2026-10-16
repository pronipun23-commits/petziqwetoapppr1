import { useRef, useEffect, useState } from 'react';
import {
  PawPrint,
  ArrowRight,
  Sprout,
  Bell,
  Heart,
  Sparkles,
  CheckCircle2,
  LogIn,
  UserPlus,
  Clock,
  Zap,
  Shield,
  Globe,
  Scan,
  Tag,
} from 'lucide-react';
import { BREEDS } from '@/data/breeds';
import { PLANTS } from '@/data/plants';
import { PLANT_CATEGORY_MAP } from '@/data/plants/types';
import { BLOG_POSTS } from '@/data/blog';
import { TagProductPreview } from '@/components/TagProductPreview';
import { InteractivePetDashboardDemo } from '@/components/InteractivePetDashboardDemo';
import { PetTag3DViewer } from '@/components/PetTag3DViewer';

interface LandingPageProps {
  onNavigate: (path: string) => void;
  onLogin: () => void;
  onSignUp: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  pets: 'border-brand-500/30 bg-brand-500/10 text-brand-300',
  plants: 'border-brand-400/30 bg-brand-400/10 text-brand-500',
  care: 'border-accent-500/30 bg-accent-500/10 text-accent-400',
  general: 'border-white/[0.08] bg-white/[0.05] text-ink-200',
};

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function ScrollRevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, visible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

export function LandingPage({ onNavigate, onLogin, onSignUp }: LandingPageProps) {
  const featuredPets = BREEDS.slice(0, 4);
  const featuredPlants = PLANTS.slice(0, 4);
  const blogPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div className="relative">
      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] glass">
        <div className="container-px">
          <div className="flex h-16 items-center justify-between">
            <button onClick={() => onNavigate('/')} className="flex items-center gap-2.5 transition hover:opacity-90">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-white shadow-glow">
                <PawPrint className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-ink-50">
                Petziq
              </span>
            </button>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => onNavigate('/blog')}
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-300 transition hover:text-ink-50 sm:inline-flex"
              >
                Blog
              </button>
              <button
                onClick={() => onNavigate('/explore')}
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-ink-300 transition hover:text-ink-50 sm:inline-flex"
              >
                Explore
              </button>
              <button onClick={onLogin} className="btn-subtle">
                Log In
              </button>
              <button onClick={onSignUp} className="btn-primary">
                Sign Up
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section — Award-Winning Editorial Design */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28">
        {/* Subtle ambient lighting without fake overlays */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand-500/12 via-ocean-500/8 to-transparent blur-[120px]" />
          <div className="absolute top-0 right-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
        </div>

        <div className="container-px">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Typography & Action */}
            <div className="text-center lg:col-span-7 lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/25 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-300">
                <Tag className="h-3.5 w-3.5" />
                <span>Petziq Ecosystem &middot; Smart Tag Hardware &amp; Digital Care</span>
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-tight text-ink-50 sm:text-6xl lg:text-6xl lg:leading-[1.12]">
                A smarter voice for the pets you love most.
              </h1>

              <p className="mt-6 text-base leading-relaxed text-ink-300 sm:text-lg max-w-xl mx-auto lg:mx-0">
                Petziq unites laser-engraved Smart Tag hardware with real-time care intelligence, vet-reviewed breed encyclopedias, and instant emergency QR profiles.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => onNavigate('/smart-tags')}
                  className="btn-primary text-base shadow-glow-blue transition-transform hover:scale-[1.02]"
                >
                  <Tag className="h-4 w-4" />
                  Order Smart Tag (₹599)
                </button>
                <button
                  onClick={() => onNavigate('/explore')}
                  className="btn-ghost text-base inline-flex items-center gap-2"
                >
                  <PawPrint className="h-4 w-4" />
                  Explore {BREEDS.length} Breeds
                </button>
              </div>

              {/* Real Value Pillars */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-8 text-left">
                <div>
                  <p className="font-display text-2xl font-bold text-ink-50">{BREEDS.length}</p>
                  <p className="text-xs text-ink-400 mt-0.5">Pet Breeds Catalogued</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-ink-50">{PLANTS.length}</p>
                  <p className="text-xs text-ink-400 mt-0.5">Safe Plant Guides</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-brand-300">Instant</p>
                  <p className="text-xs text-ink-400 mt-0.5">Emergency QR Profiles</p>
                </div>
              </div>
            </div>

            {/* Right Column: Real Photorealistic Tag Hardware & Live Profile Card */}
            <div className="relative mx-auto w-full max-w-md lg:col-span-5">
              <div className="relative rounded-3xl border border-white/[0.10] bg-gradient-to-b from-ink-850/90 to-ink-900/95 p-5 sm:p-8 shadow-2xl glass">
                <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/15 text-brand-300">
                      <Shield className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-ink-50">Petziq Smart Tag</p>
                      <p className="text-[10px] text-brand-300 font-mono">PZ-VERIFIED</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2 py-0.5 text-[10px] font-semibold text-green-300">
                    Live Active QR
                  </span>
                </div>

                {/* Real 3D Physical Hardware with Smooth Parallax Scrolling */}
                <div className="py-2 flex items-center justify-center relative overflow-hidden">
                  <PetTag3DViewer className="w-full max-w-[240px] sm:max-w-[290px] lg:max-w-[320px]" />
                </div>

                {/* Interactive Action Bar */}
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between text-ink-200">
                    <span className="font-medium">Direct Scan Protection</span>
                    <span className="text-brand-300 font-semibold">Immediate</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-ink-400">
                    When anyone scans your tag, they are redirected to your pet's secure profile with emergency contact options.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => onNavigate('/smart-tags')}
                      className="btn-subtle w-full justify-center text-xs"
                    >
                      Customize shape, color &amp; name &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Capability Strip */}
      <ScrollRevealSection className="container-px">
        <div className="flex flex-wrap items-center justify-center gap-3 py-6 border-y border-white/[0.06]">
          {[
            { icon: Shield, label: 'Owner-controlled privacy settings' },
            { icon: Zap, label: 'Instant QR routing with no app download needed' },
            { icon: Globe, label: 'Husbandry guides & toxic plant alerts' },
            { icon: Scan, label: 'Durable laser-engraved acrylic hardware' },
          ].map((badge) => (
            <div
              key={badge.label}
              className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-xs text-ink-300"
            >
              <badge.icon className="h-3.5 w-3.5 text-brand-400" />
              {badge.label}
            </div>
          ))}
        </div>
      </ScrollRevealSection>

      {/* Three pillars with 3D glass depth */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Three companions, one app</p>
            <h2 className="mt-3 section-title text-balance text-gradient">
              Everything you care for, organized beautifully
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-300">
              Whether you have a dog, a monstera, or a whole zoo at home, Petziq
              keeps the knowledge and schedules you need in one calm, friendly place.
            </p>
          </div>
        </ScrollRevealSection>

        <div className="mt-10 grid gap-4 lg:grid-cols-3" style={{ perspective: '1200px' }}>
          {/* Pets */}
          <ScrollRevealSection delay={0}>
            <button
              onClick={() => onNavigate('/explore')}
              className="group glass-depth card-3d relative overflow-hidden p-6 text-left transition-all w-full"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-500/10 blur-2xl transition group-hover:bg-brand-500/20" />
              <div className="relative depth-layer-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-500/15 text-brand-300">
                    <PawPrint className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-50">
                      Pets
                    </h3>
                    <p className="text-xs text-brand-300">Explore 330 pet breeds</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-300">
                  Deep, structured profiles for dogs, cats, birds, reptiles, small
                  mammals, and exotic pets. Compare temperament, care needs, and
                  find the right companion for your lifestyle.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                  Browse pets
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          </ScrollRevealSection>

          {/* Plants */}
          <ScrollRevealSection delay={60}>
            <button
              onClick={() => onNavigate('/plants')}
              className="group glass-depth card-3d relative overflow-hidden p-6 text-left transition-all w-full"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-400/10 blur-2xl transition group-hover:bg-brand-400/20" />
              <div className="relative depth-layer-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-400/15 text-brand-300">
                    <Sprout className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-50">
                      Plants
                    </h3>
                    <p className="text-xs text-brand-300">99 species profiles</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-300">
                  From hardy succulents to statement fiddle leaf figs. Learn
                  sunlight, watering, soil, and temperature needs for every plant,
                  with care tips and difficulty ratings.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                  Browse plants
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          </ScrollRevealSection>

          {/* Reminders */}
          <ScrollRevealSection delay={120}>
            <button
              onClick={() => onNavigate('/reminders')}
              className="group glass-depth card-3d relative overflow-hidden p-6 text-left transition-all w-full"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent-500/10 blur-2xl transition group-hover:bg-accent-500/20" />
              <div className="relative depth-layer-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-500/15 text-accent-400">
                    <Bell className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-semibold text-ink-50">
                      Reminders
                    </h3>
                    <p className="text-xs text-accent-400">Never miss care</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-300">
                  Set one-time or repeating reminders for watering, feeding, vet
                  appointments, and custom tasks. A clean dashboard shows what is
                  due today, upcoming, and completed.
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-accent-400">
                  Set reminders
                  <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </button>
          </ScrollRevealSection>
        </div>
      </section>

      {/* Pets preview with enhanced depth */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Pets</p>
              <h2 className="mt-3 section-title">Meet the animals</h2>
            </div>
            <button
              onClick={() => onNavigate('/explore')}
              className="btn-subtle hidden sm:inline-flex"
            >
              View all pets
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </ScrollRevealSection>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ perspective: '1000px' }}>
          {featuredPets.map((b, i) => (
            <ScrollRevealSection key={b.id} delay={i * 60}>
              <button
                onClick={() => onNavigate(`/breed/${b.id}`)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] card-3d w-full"
              >
                <img
                  src={b.image}
                  alt={b.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 text-left depth-layer-1">
                  <div className="text-xs text-white/80">{b.origin}</div>
                  <div className="font-display text-sm font-semibold text-white">
                    {b.name}
                  </div>
                </div>
              </button>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* Plants preview with enhanced depth */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Plants</p>
              <h2 className="mt-3 section-title">Meet the plants</h2>
            </div>
            <button
              onClick={() => onNavigate('/plants')}
              className="btn-subtle hidden sm:inline-flex"
            >
              View all plants
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </ScrollRevealSection>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4" style={{ perspective: '1000px' }}>
          {featuredPlants.map((p, i) => (
            <ScrollRevealSection key={p.id} delay={i * 60}>
              <button
                onClick={() => onNavigate(`/plants/${p.id}`)}
                className="group relative aspect-square overflow-hidden rounded-2xl border border-white/[0.08] card-3d w-full"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 text-left depth-layer-1">
                  <div className="text-xs text-white/80">{PLANT_CATEGORY_MAP[p.category[0]]?.name ?? p.environment}</div>
                  <div className="font-display text-sm font-semibold text-white">
                    {p.name}
                  </div>
                </div>
              </button>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* Interactive 3D Pet Dashboard Experience: Bruno */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="mx-auto max-w-2xl text-center mb-10">
            <p className="eyebrow">The Petziq Experience</p>
            <h2 className="mt-3 section-title text-balance text-gradient">
              Here’s what your pet’s dashboard actually looks like
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-300">
              Interactive live demo: Switch between Bruno’s medical records, vaccination passports, daily meal rations, active reminders, and scannable collar tag.
            </p>
          </div>
        </ScrollRevealSection>

        <ScrollRevealSection delay={40}>
          <InteractivePetDashboardDemo
            onExploreSmartTag={() => onNavigate('/smart-tags')}
            onExploreCare={() => onNavigate('/care')}
          />
        </ScrollRevealSection>
      </section>

      {/* Smart Tag product story */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-cyan-300/15 surface-highlight p-8 sm:p-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="eyebrow">Petziq Smart Tag</p>
              <h2 className="mt-3 section-title text-balance">A calmer way to stay connected.</h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-300">
                Create a private, scannable profile for the companion who matters most. Smart Tags bring essential care and contact details together without adding noise to your day.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('/smart-tags')} className="btn-primary">
                  <Tag className="h-4 w-4" />
                  Explore Smart Tags
                </button>
                <button onClick={() => onNavigate('/about')} className="btn-ghost">How it works</button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div className="absolute inset-8 rounded-full bg-cyan-300/15 blur-3xl" />
              <div className="relative mx-auto grid aspect-square max-w-[260px] place-items-center rounded-full border border-cyan-200/25 bg-gradient-to-br from-white/[0.14] via-ocean-500/10 to-iris-500/10 shadow-glow-blue">
                <div className="grid h-32 w-32 place-items-center rounded-[2rem] border border-white/20 bg-ink-900/70 shadow-card-hover">
                  <Scan className="h-14 w-14 text-cyan-200" />
                </div>
                <span className="absolute bottom-8 rounded-full border border-white/10 bg-ink-950/70 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-cyan-200">PZ-000001</span>
              </div>
            </div>
          </div>
        </ScrollRevealSection>
      </section>

      {/* Blog teaser with glass depth */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Blog</p>
              <h2 className="mt-3 section-title">Care guides & stories</h2>
              <p className="mt-2 text-sm text-ink-400">
                Practical, vet-informed articles — free to read, no account needed.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/blog')}
              className="btn-subtle hidden sm:inline-flex"
            >
              All articles
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </ScrollRevealSection>
        <div className="mt-8 grid gap-5 sm:grid-cols-3" style={{ perspective: '1000px' }}>
          {blogPosts.map((post, i) => (
            <ScrollRevealSection key={post.id} delay={i * 60}>
              <button
                onClick={() => onNavigate(`/blog/${post.id}`)}
                className="group glass-depth card-3d overflow-hidden text-left w-full"
              >
                <div className="relative aspect-video overflow-hidden bg-ink-900">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className={`absolute left-3 top-3 chip border text-xs backdrop-blur-sm ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS.general}`}>
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                </div>
                <div className="p-5 depth-layer-1">
                  <div className="flex items-center gap-3 text-xs text-ink-400">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readTime}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink-50">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-300">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-300">
                    Read more
                    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </button>
            </ScrollRevealSection>
          ))}
        </div>
        <div className="mt-6 text-center sm:hidden">
          <button onClick={() => onNavigate('/blog')} className="btn-ghost text-sm">
            All articles
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* What you can do - 3D feature cards */}
      <section className="container-px mt-24 section-glow">
        <ScrollRevealSection>
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">What you can do</p>
            <h2 className="mt-3 section-title text-balance text-gradient">
              Built for keepers, by keepers
            </h2>
          </div>
        </ScrollRevealSection>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: '1200px' }}>
          {[
            {
              icon: PawPrint,
              title: 'Explore pets',
              body: 'Browse 330 pet breeds across 14 categories with detailed care and temperament info.',
            },
            {
              icon: Sprout,
              title: 'Learn about plants',
              body: 'Discover sunlight, watering, and soil needs for popular houseplants and garden plants.',
            },
            {
              icon: Bell,
              title: 'Set reminders',
              body: 'Create one-time or repeating reminders for watering, feeding, and vet appointments.',
            },
            {
              icon: Heart,
              title: 'Save favorites',
              body: 'Star the breeds and plants you love and revisit them anytime in your collection.',
            },
          ].map((f, i) => (
            <ScrollRevealSection key={f.title} delay={i * 60}>
              <div className="glass-depth card-3d p-6 h-full">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-300 transition group-hover:bg-brand-500/20 depth-layer-2">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-ink-50 depth-layer-1">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300 depth-layer-1">{f.body}</p>
              </div>
            </ScrollRevealSection>
          ))}
        </div>
      </section>

      {/* CTA with glass depth */}
      <section className="container-px mt-24">
        <ScrollRevealSection>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-brand-50/10 via-brand-100/5 to-accent-50/5 p-10 sm:p-14 glass-depth" style={{ perspective: '800px' }}>
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-500/15 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="relative max-w-2xl depth-layer-2">
              <h2 className="font-display text-2xl font-semibold text-ink-50 sm:text-3xl text-balance">
                Ready to care smarter?
              </h2>
              <p className="mt-3 text-base text-ink-300">
                Create a free account to save favorites, set reminders, and build
                your personal care dashboard. Browsing is always free — no account
                needed to explore.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={onSignUp} className="btn-primary">
                  <UserPlus className="h-4 w-4" />
                  Create free account
                </button>
                <button onClick={onLogin} className="btn-ghost">
                  <LogIn className="h-4 w-4" />
                  Log In
                </button>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-400">
                {['No credit card required', 'Free to browse', 'Privacy-first'].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollRevealSection>
      </section>

      {/* Footer */}
      <footer className="mt-24 border-t border-white/[0.08] bg-ink-950/60">
        <div className="container-px py-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand-400 via-teal-400 to-ocean-400 text-white">
                <PawPrint className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <span className="font-display text-base font-semibold text-ink-50">
                Petziq
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-400">
              <button onClick={() => onNavigate('/plus')} className="font-semibold text-brand-300 transition hover:text-brand-200">Petziq Plus</button>
              <button onClick={() => onNavigate('/blog')} className="transition hover:text-ink-50">Blog</button>
              <button onClick={() => onNavigate('/explore')} className="transition hover:text-ink-50">Explore Pets</button>
              <button onClick={() => onNavigate('/plants')} className="transition hover:text-ink-50">Explore Plants</button>
              <button onClick={() => onNavigate('/about')} className="transition hover:text-ink-50">About</button>
              <button onClick={() => onNavigate('/contact')} className="transition hover:text-ink-50">Contact</button>
              <button onClick={() => onNavigate('/help')} className="transition hover:text-ink-50">Support</button>
            </div>
            <p className="text-xs text-ink-400">
              © {new Date().getFullYear()} Petziq. Created by Nipun Menon. Educational guidance only.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
