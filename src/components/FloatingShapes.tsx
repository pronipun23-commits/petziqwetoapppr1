export default function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Biophilic Monochromatic Emerald & Sage Ambient Orbs */}
      <div
        className="blob h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl animate-pulse"
        style={{ top: '-5%', right: '5%', animationDuration: '8s' }}
      />
      <div
        className="blob h-96 w-96 rounded-full bg-gradient-to-br from-emerald-600/15 via-emerald-500/10 to-transparent blur-3xl animate-pulse"
        style={{ top: '35%', left: '-5%', animationDuration: '10s' }}
      />
      <div
        className="blob h-80 w-80 rounded-full bg-gradient-to-tr from-teal-500/15 via-emerald-500/10 to-transparent blur-3xl animate-pulse"
        style={{ bottom: '10%', right: '15%', animationDuration: '12s' }}
      />
      <div
        className="blob h-72 w-72 rounded-full bg-gradient-to-bl from-emerald-500/15 via-teal-600/10 to-transparent blur-3xl animate-pulse"
        style={{ bottom: '35%', left: '20%', animationDuration: '9s' }}
      />
    </div>
  );
}
