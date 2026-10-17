import { useState } from 'react';
import {
  PawPrint,
  Sprout,
  Activity,
  Droplet,
  Sun,
  Shield,
  Heart,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  Battery,
  Wifi,
  Bell
} from 'lucide-react';

export function MobileAppShowcase() {
  const [activeTab, setActiveTab] = useState<'balanced' | 'pet' | 'plant'>('balanced');

  return (
    <section className="container-px mt-36 relative z-20">
      <div className="mx-auto max-w-3xl text-center mb-14">
        {/* Apple Health x Google Material You Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-[#0B0F12]/80 px-4 py-1.5 text-xs font-medium text-white mb-4 backdrop-blur-xl shadow-[0_0_24px_rgba(16,185,129,0.18)]">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-mono uppercase tracking-wider text-[11px] text-emerald-300">Companion OS Interface</span>
          <span className="text-white/20">|</span>
          <span className="text-ink-300 text-[11px]">Apple Health & Material You Standard</span>
        </div>

        <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          Everything living, calibrated in real time.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-ink-300 max-w-xl mx-auto leading-relaxed">
          A unified biophilic companion app designed to bring botanical telemetry and clinical pet biometric tracking into a singular, fluid ecosystem.
        </p>
      </div>

      {/* Modern Smartphone Mockup Frame */}
      <div className="relative mx-auto max-w-[390px] sm:max-w-[410px]">
        {/* Diffused Ambient Glow Behind Phone */}
        <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-emerald-500/25 to-cyan-500/20 rounded-[58px] blur-3xl opacity-75 pointer-events-none" />

        {/* Smartphone Chassis Container */}
        <div className="relative rounded-[50px] border-[3px] border-white/[0.18] bg-[#0B0F12] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.15)] ring-1 ring-white/10 overflow-hidden">
          {/* Dynamic Island Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400/80" />
              <span className="w-1 h-1 rounded-full bg-cyan-400/80" />
            </div>
          </div>

          {/* Smartphone Screen Inner Content */}
          <div className="relative rounded-[42px] bg-gradient-to-b from-[#0F1418] via-[#0B0F12] to-[#0A0D10] p-5 pt-10 text-white min-h-[740px] flex flex-col justify-between overflow-hidden">
            {/* Ambient Biophilic In-Screen Lighting Aurora */}
            <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 -left-12 w-48 h-48 rounded-full bg-amber-500/12 blur-3xl pointer-events-none" />

            {/* Mobile Header: Time, Battery & Status Bar */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-ink-400 px-1 pt-1 mb-4">
                <span>9:41</span>
                <div className="flex items-center gap-1.5 text-ink-300">
                  <Wifi className="w-3 h-3 text-ink-300" />
                  <Battery className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* User Profile Bar */}
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src="/petziq-shield-logo.png"
                      alt="Petziq Shield"
                      className="w-10 h-10 rounded-2xl object-contain bg-[#0B0F12] p-1 border border-white/20 shadow-md"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0B0F12]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono tracking-wider text-ink-400 uppercase">Companion OS</p>
                    <h3 className="text-sm font-bold text-white tracking-tight">Kiran's Sanctuary</h3>
                  </div>
                </div>

                <button className="w-9 h-9 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center hover:bg-white/10 transition">
                  <Bell className="w-4 h-4 text-ink-300" />
                </button>
              </div>

              {/* The "Smart Switcher" (Apple Health x Material You) */}
              <div className="rounded-2xl border border-white/[0.12] bg-[#0E1419]/90 p-1 backdrop-blur-xl mb-5 shadow-inner flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('balanced')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    activeTab === 'balanced'
                      ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 text-white border border-white/20 shadow-sm'
                      : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  Balanced
                </button>
                <button
                  onClick={() => setActiveTab('pet')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    activeTab === 'pet'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <PawPrint className="w-3 h-3 text-amber-400" />
                  Bruno (Pet)
                </button>
                <button
                  onClick={() => setActiveTab('plant')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all duration-300 flex items-center justify-center gap-1.5 ${
                    activeTab === 'plant'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : 'text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <Sprout className="w-3 h-3 text-emerald-400" />
                  Monstera
                </button>
              </div>

              {/* Bento Grid Layout Inside Mobile App */}
              <div className="space-y-3.5">
                {/* Bento Card 1: Emerald Pet Health Circular Ring with Isolated Warning Alert */}
                <div className="rounded-2xl border border-emerald-500/25 bg-[#0D1216]/95 p-4 glass shadow-[0_4px_24px_rgba(16,185,129,0.12)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <PawPrint className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Bruno • Golden Retriever</h4>
                        <p className="text-[10px] text-ink-400 font-mono">Vaccines: Active Passport</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Normal
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* SVG Circular Progress Ring in Emerald */}
                    <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                        <circle
                          cx="36"
                          cy="36"
                          r="30"
                          className="stroke-white/10 fill-none"
                          strokeWidth="4"
                        />
                        <circle
                          cx="36"
                          cy="36"
                          r="30"
                          className="stroke-emerald-400 fill-none"
                          strokeWidth="4"
                          strokeDasharray="188.5"
                          strokeDashoffset="37.7" // 80% complete
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-sm font-bold font-editorial text-white">94%</span>
                        <span className="text-[8px] font-mono text-emerald-400 uppercase">Vitality</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center text-ink-300">
                        <span>Daily Activity:</span>
                        <span className="font-mono text-white font-semibold">8.4 / 10 km</span>
                      </div>
                      <div className="flex justify-between items-center text-ink-300">
                        <span>Dietary Ration:</span>
                        <span className="font-mono text-white font-semibold">480g Salmon</span>
                      </div>
                      <div className="flex justify-between items-center text-ink-300">
                        <span>Next Booster:</span>
                        <span className="font-mono text-emerald-300 font-semibold">In 3 Days</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Card 2: Smooth Emerald Wave Graph Tracking Plant Soil Moisture with Isolated Amber Alert */}
                <div className="rounded-2xl border border-emerald-500/25 bg-[#0D1216]/95 p-4 glass shadow-[0_4px_24px_rgba(16,185,129,0.12)]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <Droplet className="w-3.5 h-3.5" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white">Boston Fern</h4>
                        <p className="text-[10px] text-ink-400 font-mono">Balcony Shelf • 510 Lux</p>
                      </div>
                    </div>
                    {/* Functional Amber Alert Highlight: Water the Fern */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-mono shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span>Water Needed</span>
                    </div>
                  </div>

                  {/* Smooth Emerald Wave SVG Graph */}
                  <div className="relative pt-2">
                    <svg className="w-full h-16 overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="waveGradientEmerald" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0,45 C50,20 100,55 150,30 C200,10 250,40 300,25 L300,70 L0,70 Z"
                        fill="url(#waveGradientEmerald)"
                      />
                      <path
                        d="M0,45 C50,20 100,55 150,30 C200,10 250,40 300,25"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]"
                      />
                      <circle cx="300" cy="25" r="4" fill="#34d399" className="animate-ping" opacity="0.75" />
                      <circle cx="300" cy="25" r="3.5" fill="#10b981" stroke="#fff" strokeWidth="1" />
                    </svg>
                    <div className="flex justify-between items-center text-[9px] font-mono text-ink-400 mt-1">
                      <span>Mon (42%)</span>
                      <span>Wed (38%)</span>
                      <span>Fri (31%)</span>
                      <span className="text-amber-300 font-bold">Now (22% Refill)</span>
                    </div>
                  </div>
                </div>

                {/* Bento Card 3: Dual Micro Indicators (Hardware Collar + Sunlight Lux) */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-emerald-500/25 bg-[#0D1216]/95 p-3.5 glass">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-mono uppercase">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Smart Tag</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-white">Online • Active</p>
                    <p className="text-[10px] text-emerald-400 mt-0.5">Laser QR Synced</p>
                  </div>

                  <div className="rounded-xl border border-emerald-500/25 bg-[#0D1216]/95 p-3.5 glass">
                    <div className="flex items-center gap-1.5 text-emerald-300 text-[10px] font-mono uppercase">
                      <Sun className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Photoperiod</span>
                    </div>
                    <p className="mt-1 text-sm font-bold text-white">6.2 hrs / day</p>
                    <p className="text-[10px] text-ink-400 mt-0.5">Indirect Sunlight</p>
                  </div>
                </div>
              </div>
            </div>

            {/* In-App Floating Dock / Bottom Navigation */}
            <div className="mt-4 rounded-2xl border border-white/[0.12] bg-[#0E1419]/90 p-2.5 backdrop-blur-xl flex items-center justify-around text-xs shadow-lg">
              <button className="flex flex-col items-center gap-1 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] font-mono">Overview</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-ink-400 hover:text-white transition">
                <PawPrint className="w-4 h-4" />
                <span className="text-[9px] font-mono">Pets</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-ink-400 hover:text-white transition">
                <Sprout className="w-4 h-4" />
                <span className="text-[9px] font-mono">Plants</span>
              </button>
              <button className="flex flex-col items-center gap-1 text-ink-400 hover:text-white transition">
                <Activity className="w-4 h-4" />
                <span className="text-[9px] font-mono">Passports</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

