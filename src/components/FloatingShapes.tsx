export default function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Playful Colorful Animated Ambient Blobs */}
      <div
        className="blob h-96 w-96 rounded-full bg-gradient-to-tr from-amber-500/20 via-rose-500/15 to-transparent blur-3xl animate-pulse"
        style={{ top: '-5%', right: '5%', animationDuration: '8s' }}
      />
      <div
        className="blob h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-cyan-500/15 blur-3xl animate-pulse"
        style={{ top: '35%', left: '-5%', animationDuration: '10s' }}
      />
      <div
        className="blob h-80 w-80 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/15 to-amber-500/15 blur-3xl animate-pulse"
        style={{ bottom: '10%', right: '15%', animationDuration: '12s' }}
      />
      <div
        className="blob h-72 w-72 rounded-full bg-gradient-to-bl from-cyan-500/20 via-blue-500/15 to-emerald-500/15 blur-3xl animate-pulse"
        style={{ bottom: '35%', left: '20%', animationDuration: '9s' }}
      />
    </div>
  );
}
