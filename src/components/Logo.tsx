interface LogoProps {
  size?: number;
  className?: string;
  withWordmark?: boolean;
}

export function Logo({ size = 36, className = '', withWordmark = false }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/petziq-shield-logo.png"
        alt="Petziq Shield Logo"
        width={size}
        height={size}
        className="rounded-lg object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] shrink-0 transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span className="font-display font-extrabold tracking-tight text-white leading-none flex items-center text-lg sm:text-xl">
          Petziq
          <span className="text-brand-300 text-xs font-semibold ml-1 px-1.5 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.12]">
            PRO
          </span>
        </span>
      )}
    </div>
  );
}
