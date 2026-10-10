export default function FloatingShapes() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="blob h-72 w-72 bg-brand-500/8" style={{ top: '5%', right: '8%' }} />
      <div className="blob h-64 w-64 bg-ocean-500/6" style={{ top: '40%', left: '3%' }} />
    </div>
  );
}
