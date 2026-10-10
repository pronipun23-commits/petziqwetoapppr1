import { useEffect, useRef, useState } from 'react';

interface ParallaxOffset {
  x: number;
  y: number;
}

export function useMouseParallax(sensitivity = 0.02): {
  offset: ParallaxOffset;
  containerRef: React.RefObject<HTMLDivElement>;
} {
  const [offset, setOffset] = useState<ParallaxOffset>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef<ParallaxOffset>({ x: 0, y: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rawX = (e.clientX - centerX) * sensitivity;
      const rawY = (e.clientY - centerY) * sensitivity;
      targetRef.current = { x: rawX, y: rawY };
    };

    const animate = () => {
      const target = targetRef.current;
      setOffset((prev) => {
        // Once the easing has caught up with the cursor, return the identical
        // object so React bails out of the re-render. Without this the looping
        // requestAnimationFrame re-rendered the whole hologram 60x/second even
        // while the pointer was idle.
        if (
          Math.abs(target.x - prev.x) < 0.01 &&
          Math.abs(target.y - prev.y) < 0.01
        ) {
          return prev;
        }
        return {
          x: prev.x + (target.x - prev.x) * 0.08,
          y: prev.y + (target.y - prev.y) * 0.08,
        };
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [sensitivity]);

  return { offset, containerRef };
}
