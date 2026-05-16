import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from "motion/react";
import { RefObject, useEffect, useRef, useState } from "react";
import { AmbientBlobs, BrushUnderline } from "./Atmosphere";
import { useIsMobile } from "@/hooks/use-mobile";

const HEADLINE = "The screen era is over.";

export function Act1Opening({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef ?? internalRef;
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const statementOpacity = useTransform(scrollYProgress, [0.38, 0.46], [1, 0]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.25, 0.42, 0.7], [0, 1, 0]);
  const wordmarkY = useTransform(scrollYProgress, [0.25, 0.7], [28, -12]);
  const brushOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  return (
    <section ref={ref} className="relative h-[100vh] md:h-[105vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center md:justify-center overflow-hidden px-5 sm:px-6 pt-[14vh] md:pt-0 gap-6 md:gap-0">
        <AmbientBlobs density={6} />

        <motion.div
          className="relative z-10 text-center w-full"
          style={{ opacity: statementOpacity }}
        >
          <ParticleTitle
            text={HEADLINE}
            progress={scrollYProgress}
            isMobile={!!isMobile}
            reducedMotion={!!prefersReducedMotion}
          />
          <div className="mt-6 sm:mt-10 flex justify-center">
            <motion.div style={{ opacity: brushOpacity }} className="w-full max-w-[24rem] sm:max-w-[40rem]">
              <BrushUnderline progress={1} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="relative z-20 mt-2 sm:mt-14 md:absolute md:left-0 md:right-0 md:px-6 md:mt-0 text-center w-full md:top-[58%]"
          style={{ opacity: wordmarkOpacity, y: wordmarkY }}
        >
          <p
            className="font-serif italic text-espresso tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.4rem)", color: "var(--color-espresso)" }}
          >
            asmi
          </p>
          <p
            className="mt-3 sm:mt-4 font-sans font-light text-stone max-w-xl mx-auto px-2"
            style={{ color: "var(--color-stone)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
          >
            AI that handles your personal chores in the physical world.
          </p>
          <div className="mt-6 sm:mt-8 flex justify-center px-4">
            <a href="#start" className="btn-pill w-full max-w-xs sm:w-auto justify-center">
              Start with an iMessage →
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

type Particle = {
  x0: number;
  y0: number;
  size: number;
  threshold: number; // when (during dissolve) this particle starts moving
  driftX: number;
  liftY: number;
  jitter: number;
  phase: number;
};

function ParticleTitle({
  text,
  progress,
  isMobile,
  reducedMotion,
}: {
  text: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  isMobile: boolean;
  reducedMotion: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dissolveRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const [ready, setReady] = useState(false);

  // Sample the rendered text into particles
  useEffect(() => {
    if (reducedMotion) return;
    const h1 = h1Ref.current;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!h1 || !wrap || !canvas) return;

    let cancelled = false;

    const build = async () => {
      // ensure fonts are loaded before sampling
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {}
      }
      if (cancelled) return;

      const rect = h1.getBoundingClientRect();
      const wrapRect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.ceil(rect.width);
      const h = Math.ceil(rect.height);
      if (w === 0 || h === 0) return;

      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.style.left = `${rect.left - wrapRect.left}px`;
      canvas.style.top = `${rect.top - wrapRect.top}px`;

      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      const cs = window.getComputedStyle(h1);
      const fontSize = parseFloat(cs.fontSize);
      octx.scale(dpr, dpr);
      octx.fillStyle = "#2C2520";
      octx.textBaseline = "alphabetic";
      octx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;

      // measure to center
      const metrics = octx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
      const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
      const textH = ascent + descent;
      const x = (w - metrics.width) / 2;
      const y = (h - textH) / 2 + ascent;
      octx.fillText(text, x, y);

      const img = octx.getImageData(0, 0, canvas.width, canvas.height);
      const data = img.data;
      const step = Math.max(2, Math.round((isMobile ? 5 : 3) * dpr));
      const particles: Particle[] = [];
      for (let py = 0; py < canvas.height; py += step) {
        for (let px = 0; px < canvas.width; px += step) {
          const idx = (py * canvas.width + px) * 4 + 3;
          if (data[idx] > 128) {
            const nx = px / dpr;
            const ny = py / dpr;
            particles.push({
              x0: nx,
              y0: ny,
              size: dpr >= 2 ? 1.5 : 1.25,
              threshold: (nx / w) * 0.55 + Math.random() * 0.12,
              driftX: 90 + Math.random() * 220,
              liftY: 40 + Math.random() * 140,
              jitter: 10 + Math.random() * 24,
              phase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      particlesRef.current = particles;
      setReady(true);
      draw();
    };

    build();
    const onResize = () => {
      setReady(false);
      build();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isMobile, reducedMotion]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const t = dissolveRef.current;
    if (t <= 0) {
      if (h1Ref.current) h1Ref.current.style.opacity = "1";
      return;
    }
    if (h1Ref.current) h1Ref.current.style.opacity = "0";
    if (t >= 1) return;

    const now = (performance.now() - startTimeRef.current) / 1000;
    const particles = particlesRef.current;
    ctx.fillStyle = "#2C2520";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const local = (t - p.threshold) / (1 - p.threshold);
      if (local <= 0) {
        ctx.globalAlpha = 1;
        ctx.fillRect(p.x0, p.y0, p.size, p.size);
        continue;
      }
      const e = local < 1 ? 1 - Math.pow(1 - local, 2) : 1;
      const wob = Math.sin(now * 2 + p.phase) * p.jitter * e;
      const x = p.x0 + e * p.driftX + wob;
      const y = p.y0 - e * p.liftY + Math.cos(now * 1.6 + p.phase) * p.jitter * 0.4 * e;
      const a = Math.max(0, 1 - local);
      ctx.globalAlpha = a;
      ctx.fillRect(x, y, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  };

  // Animate while dissolving
  useEffect(() => {
    if (reducedMotion) return;
    const loop = () => {
      draw();
      const t = dissolveRef.current;
      if (t > 0 && t < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };
    const ensureLoop = () => {
      if (rafRef.current == null) {
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    // expose via closure on the motion subscription below
    (ParticleTitle as any)._ensureLoop = ensureLoop;
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [reducedMotion, ready]);

  useMotionValueEvent(progress, "change", (v) => {
    if (reducedMotion) return;
    // map scroll progress 0.42..0.7 -> dissolve 0..1
    const t = Math.min(1, Math.max(0, (v - 0.42) / (0.7 - 0.42)));
    dissolveRef.current = t;
    if (t > 0 && t < 1) {
      (ParticleTitle as any)._ensureLoop?.();
    } else {
      draw();
    }
  });

  return (
    <div ref={wrapRef} className="relative w-full">
      <h1
        ref={h1Ref}
        className="font-serif font-normal text-espresso tracking-[-0.02em]"
        style={{
          fontSize: "clamp(2.2rem, 11vw, 14rem)",
          lineHeight: 1.02,
          color: "var(--color-espresso)",
          margin: 0,
        }}
      >
        {text}
      </h1>
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute"
          style={{ left: 0, top: 0 }}
        />
      )}
    </div>
  );
}
