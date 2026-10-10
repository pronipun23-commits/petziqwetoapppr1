import { useMemo } from 'react';
import { useMouseParallax } from '@/hooks/useMouseParallax';
import { PawPrint, Heart, Activity, Droplets, Thermometer, Shield } from 'lucide-react';

function HologramParticles() {
  // Generated once per mount. Computing these during render made the particles
  // teleport on every parallax frame instead of drifting.
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        animationDelay: `${Math.random() * 6}s`,
        animationDuration: `${3 + Math.random() * 4}s`,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((style, i) => (
        <div key={i} className="hologram-particle" style={style} />
      ))}
    </div>
  );
}

function ScanningRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="hologram-ring hologram-ring-1" />
      <div className="hologram-ring hologram-ring-2" />
      <div className="hologram-ring hologram-ring-3" />
    </div>
  );
}

function FloatingPanels({ offset }: { offset: { x: number; y: number } }) {
  const panels = [
    { icon: Heart, label: 'Heart Rate', value: '98 bpm', x: -220, y: -80, delay: '0s' },
    { icon: Droplets, label: 'Hydration', value: 'Optimal', x: 200, y: -40, delay: '0.5s' },
    { icon: Activity, label: 'Activity', value: 'Active', x: -200, y: 80, delay: '1s' },
    { icon: Thermometer, label: 'Temperature', value: '37.2C', x: 210, y: 90, delay: '1.5s' },
  ];

  return (
    <>
      {panels.map((panel, i) => (
        <div
          key={i}
          className="hologram-panel"
          style={{
            left: `calc(50% + ${panel.x}px + ${offset.x * (1.5 + i * 0.3)}px)`,
            top: `calc(50% + ${panel.y}px + ${offset.y * (1.5 + i * 0.3)}px)`,
            animationDelay: panel.delay,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-cyan-400/15 text-cyan-300">
              <panel.icon className="h-3 w-3" />
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-cyan-400/60">{panel.label}</div>
              <div className="text-[11px] font-semibold text-cyan-200">{panel.value}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function CentralPet() {
  return (
    <div className="hologram-pet-container">
      {/* Base glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-cyan-400/20 via-teal-400/10 to-transparent blur-2xl animate-pulse-glow" />
      
      {/* Pet icon with holographic treatment */}
      <div className="relative z-10 flex items-center justify-center">
        <div className="hologram-pet-core">
          <div className="grid h-28 w-28 sm:h-36 sm:w-36 place-items-center rounded-full">
            <div className="relative">
              <PawPrint className="h-14 w-14 sm:h-20 sm:w-20 text-cyan-200 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]" strokeWidth={1.5} />
              <div className="absolute inset-0 blur-md">
                <PawPrint className="h-14 w-14 sm:h-20 sm:w-20 text-cyan-300/40" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shield badge */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 z-20">
        <div className="hologram-badge">
          <Shield className="h-3 w-3 text-cyan-300" />
          <span className="text-[9px] font-semibold text-cyan-200 uppercase tracking-wider">Protected</span>
        </div>
      </div>
    </div>
  );
}

function GroundReflection() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[320px] sm:w-[420px] pointer-events-none">
      <div className="hologram-ground" />
    </div>
  );
}

export function HolographicHero() {
  const { offset, containerRef } = useMouseParallax(0.015);

  return (
    <div ref={containerRef} className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] flex items-center justify-center hologram-scene">
      {/* Background ambient glow */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.25) 0%, rgba(20,184,166,0.15) 40%, transparent 70%)',
          transform: `translate(${offset.x * 2}px, ${offset.y * 2}px)`,
        }}
      />

      {/* Main holographic container */}
      <div
        className="relative z-10"
        style={{
          transform: `perspective(1200px) rotateY(${offset.x * 0.3}deg) rotateX(${-offset.y * 0.3}deg)`,
          transition: 'transform 0.1s ease-out',
        }}
      >
        <div className="relative w-[320px] h-[380px] sm:w-[400px] sm:h-[460px] lg:w-[480px] lg:h-[540px]">
          {/* Outer glass frame */}
          <div className="absolute inset-4 sm:inset-6 hologram-frame" />
          
          <ScanningRings />
          <HologramParticles />
          <FloatingPanels offset={offset} />
          <CentralPet />
          <GroundReflection />

          {/* Top scanning line */}
          <div className="hologram-scan-line" />
        </div>
      </div>
    </div>
  );
}
