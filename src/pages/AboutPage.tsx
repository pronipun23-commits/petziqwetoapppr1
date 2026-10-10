import { useEffect, useRef, useState } from 'react';
import {
  PawPrint,
  Compass,
  BookOpen,
  Stethoscope,
  Heart,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Mail,
  Sprout,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [nipunVisible, setNipunVisible] = useState(false);
  const nipunRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setNipunVisible(true);
        });
      },
      { threshold: 0.2 },
    );
    if (nipunRef.current) observer.observe(nipunRef.current);
    return () => observer.disconnect();
  }, []);
  const values = [
    {
      icon: ShieldCheck,
      title: 'Educational first',
      body: 'Every guide and problem topic is clearly labeled as educational, with veterinarian disclaimers where it matters.',
    },
    {
      icon: Compass,
      title: 'Structured discovery',
      body: 'Fourteen categories and detailed breed profiles make exploration feel intentional, not random.',
    },
    {
      icon: Sparkles,
      title: 'Built to scale',
      body: 'The data architecture supports thousands of additional breeds without changing the app structure.',
    },
    {
      icon: Heart,
      title: 'Personal library',
      body: 'Favorites and recently viewed persist locally, so your research follows you across sessions.',
    },
  ];

  return (
    <div className="container-px pt-12 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-850/60 p-10 sm:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="chip">
            <PawPrint className="h-3.5 w-3.5 text-brand-300" />
            About Petziq
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-ink-50 text-balance sm:text-5xl">
            A premium explorer for people who care about animals.
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-200">
            Petziq brings breed discovery, care guidance, and educational
            problem solving into one beautifully crafted experience. It is
            designed to feel like a commercial product — fast, considered, and
            a pleasure to use.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => onNavigate('/explore')} className="btn-primary">
              Explore breeds
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => onNavigate('/care')} className="btn-ghost">
              Care guides
            </button>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="mt-16">
        <SectionHeader
          eyebrow="What Petziq does"
          title="Four pillars, one experience"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Compass, title: 'Breed Explorer', body: 'Detailed profiles across 14 categories.' },
            { icon: BookOpen, title: 'Care Guides', body: 'Vet-informed husbandry fundamentals.' },
            { icon: Stethoscope, title: 'Problem Solver', body: 'Educational triage with disclaimers.' },
            { icon: Heart, title: 'Favorites', body: 'Local-first library and history.' },
          ].map((f) => (
            <div key={f.title} className="card-surface p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500/10 text-brand-300">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-ink-50">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mt-16">
        <SectionHeader eyebrow="Principles" title="How Petziq is built" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="card-surface flex gap-4 p-6">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-brand-300">
                <v.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-ink-50">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">{v.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet Nipun */}
      <section ref={nipunRef} className="mt-16">
        <div
          className={`grid items-center gap-8 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-brand-50 via-brand-100/60 to-accent-50/40 p-8 sm:p-12 lg:grid-cols-2 transition-all duration-1000 ${
            nipunVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-2">
              <Sprout className="h-4 w-4 text-brand-300" />
              <span className="eyebrow">About</span>
            </div>
            <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink-50 sm:text-3xl">
              Meet the person behind Petziq
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-200">
              Hi! I'm Nipun. I built Petziq to help people learn, care, and grow
              with their pets and plants. Whether you're a first-time pet parent
              or a seasoned plant enthusiast, Petziq brings everything you need
              into one friendly, beautiful space.
            </p>
            <p className="mt-3 text-base leading-relaxed text-ink-300">
              From detailed breed guides and care checklists to personal pet
              profiles, plant tracking, and gentle reminders — every feature is
              designed to make caring for your living companions easier and more
              enjoyable.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => onNavigate('/explore')} className="btn-primary">
                Start exploring
                <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => onNavigate('/blog')} className="btn-ghost">
                Read the blog
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-500/20 to-accent-500/10 blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/[0.08] shadow-soft">
                <img
                  src="/petziq-founder-photo.png"
                  alt="Nipun Menon"
                  className="h-full w-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mt-16">
        <div className="rounded-3xl border border-accent-500/20 bg-accent-500/5 p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink-50">
            Veterinarian disclaimer
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-200">
            Petziq provides general educational information about pet breeds,
            care, and common concerns. It is not a substitute for professional
            veterinary advice, diagnosis, or treatment. Always seek the guidance
            of a qualified veterinarian with any questions about a medical
            condition or care plan. Never disregard professional veterinary
            advice because of something you read here.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="mt-16">
        <div className="rounded-3xl border border-white/[0.08] bg-ink-850/60 p-8 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink-50">
            Contact Petziq
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-ink-200">
            Questions, support, feedback, or business inquiries — the Petziq
            Team is happy to help. Reach out and we'll get back to you.
          </p>
          <div className="mt-6 flex flex-col gap-1">
            <p className="font-medium text-ink-100">Petziq Team</p>
            <a
              href="mailto:petziq.team@gmail.com"
              className="inline-flex items-center gap-2 text-lg font-medium text-brand-300 transition hover:text-brand-500"
            >
              <Mail className="h-5 w-5" />
              petziq.team@gmail.com
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <h2 className="font-display text-2xl font-semibold text-ink-50 sm:text-3xl">
          Start exploring
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-300">
          Dive into detailed breed profiles or find guidance for the pet you
          already love.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => onNavigate('/explore')} className="btn-primary">
            Explore breeds
          </button>
          <button onClick={() => onNavigate('/categories')} className="btn-ghost">
            Categories
          </button>
        </div>
      </section>
    </div>
  );
}
