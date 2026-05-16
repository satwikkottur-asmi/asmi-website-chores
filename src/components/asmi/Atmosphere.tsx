import { motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef } from "react";

// Soft drifting organic blobs as ambient backdrop.
export function AmbientBlobs({ density = 5 }: { density?: number }) {
  const blobs = Array.from({ length: density });
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {blobs.map((_, i) => {
        const size = 360 + ((i * 137) % 380);
        const top = (i * 53) % 90;
        const left = (i * 79) % 90;
        const dur = 18 + (i % 5) * 4;
        const tone = ["#E6DCC8", "#E8D9C3", "#D9CFC0", "#EADFCC", "#D8C9B5"][i % 5];
        return (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: size,
              height: size,
              top: `${top}%`,
              left: `${left}%`,
              background: tone,
              opacity: 0.18,
              animation: `${i % 2 ? "drift-slower" : "drift-slow"} ${dur}s ease-in-out infinite`,
              animationDelay: `${-i * 2}s`,
              willChange: "transform",
            }}
          />
        );
      })}
    </div>
  );
}

export function CursorRepel({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Hand-drawn looking SVG underline brush.
export function BrushUnderline({ progress = 1 }: { progress?: number }) {
  return (
    <svg viewBox="0 0 600 40" className="w-full max-w-[40rem]" preserveAspectRatio="none">
      <motion.path
        d="M10 25 C 120 5, 240 38, 360 18 S 560 28, 590 14"
        fill="none"
        stroke="#C25B3F"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: progress }}
        transition={{ duration: 1.4, ease: "easeOut" }}
      />
    </svg>
  );
}

export function OrganicDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="w-full overflow-hidden leading-none" aria-hidden>
      <svg
        viewBox="0 0 1440 80"
        className="w-full h-16 md:h-24"
        preserveAspectRatio="none"
        style={{ transform: flip ? "scaleY(-1)" : undefined }}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,50 L1440,80 L0,80 Z"
          fill="rgba(44,37,32,0.04)"
        />
      </svg>
    </div>
  );
}

export function useCursorRepel(ref: React.RefObject<HTMLDivElement | null>, strength = 28) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        const f = (1 - d / 140) * strength;
        x.set((-dx / d) * f);
        y.set((-dy / d) * f);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [ref, strength, x, y]);
  return { x: useTransform(x, (v) => v), y: useTransform(y, (v) => v) };
}
