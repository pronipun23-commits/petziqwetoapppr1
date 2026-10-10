interface LogoProps {
  size?: number;
  className?: string;
  withWordmark?: boolean;
}

export function Logo({ size = 36, className = '' }: LogoProps) {
  const width = Math.round(size * 1.83);
  return (
    <img
      src="/Gemini_Generated_Image_uyaczluyaczluyac.png"
      alt="Petziq"
      width={width}
      height={size}
      className={`object-contain object-center ${className}`}
      style={{ width, height: size }}
    />
  );
}
