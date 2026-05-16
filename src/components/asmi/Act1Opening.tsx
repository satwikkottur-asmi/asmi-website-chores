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

  const statementOpacity = useTransform(scrollYProgress, [0.28, 0.34], [1, 0]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.32, 0.45, 0.85], [0, 1, 0]);
  const wordmarkY = useTransform(scrollYProgress, [0.32, 0.85], [28, -12]);
  const brushOpacity = useTransform(scrollYProgress, [0.02, 0.12], [0, 1]);

  return (
    <section ref={ref} className="relative h-[200vh] md:h-[210vh]">
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
  alpha0: number;
  threshold: number;
  driftX: number;
  liftY: number;
  jitter: number;
  phase: number;
};

const H1_STYLE: React.CSSProperties = {
  fontSize: "clamp(2.2rem, 11vw, 14rem)",
  lineHeight: 1.02,
  color: "var(--color-espresso)",
  margin: 0,
  letterSpacing: "-0.02em",
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
  const measureRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dispatchSizeRef = useRef({ w: 0, h: 0, dpr: 1 });
  const dissolveRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const ensureLoopRef = useRef<(() => void) | null>(null);
  const [built, setBuilt] = useState(false);

  // Build particles from a high-fidelity rasterization of the headline.
  useEffect(() => {
    if (reducedMotion) return;
    const measure = measureRef.current;
    const canvas = canvasRef.current;
    if (!measure || !canvas) return;

    let cancelled = false;

    const build = async () => {
      if (document.fonts && (document.fonts as any).ready) {
        try {
          await (document.fonts as any).ready;
        } catch {}
      }
      if (cancelled) return;

      const rect = measure.getBoundingClientRect();
      const w = Math.ceil(rect.width);
      const h = Math.ceil(rect.height);
      if (w === 0 || h === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      dispatchSizeRef.current = { w, h, dpr };

      const off = document.createElement("canvas");
      off.width = canvas.width;
      off.height = canvas.height;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      const cs = window.getComputedStyle(measure);
      const fontSize = parseFloat(cs.fontSize);
      octx.scale(dpr, dpr);
      octx.fillStyle = "#2C2520";
      octx.textBaseline = "alphabetic";
      octx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;

      const metrics = octx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || fontSize * 0.8;
      const descent = metrics.actualBoundingBoxDescent || fontSize * 0.2;
      const textH = ascent + descent;
      const x = (w - metrics.width) / 2;
      const y = (h - textH) / 2 + ascent;
      octx.fillText(text, x, y);

      const img = octx.getImageData(0, 0, canvas.width, canvas.height);
      const data = img.data;
      const cw = canvas.width;
      const ch = canvas.height;

      // Dense per-device-pixel sampling. Step = 1 device px on mobile-light, else 1.
      // To keep particle count reasonable, step by `stride` device px.
      const stride = isMobile ? 2 : 1;
      const particles: Particle[] = [];
      for (let py = 0; py < ch; py += stride) {
        for (let px = 0; px < cw; px += stride) {
          const a = data[(py * cw + px) * 4 + 3];
          if (a < 8) continue;
          const nx = px / dpr;
          const ny = py / dpr;
          particles.push({
            x0: nx,
            y0: ny,
            alpha0: a / 255,
            threshold: (nx / w) * 0.55 + Math.random() * 0.1,
            driftX: 110 + Math.random() * 260,
            liftY: 50 + Math.random() * 180,
            jitter: 8 + Math.random() * 22,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      particlesRef.current = particles;
      setBuilt(true);
      drawStatic();
    };

    build();
    const onResize = () => {
      setBuilt(false);
      build();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, isMobile, reducedMotion]);

  const drawStatic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { dpr } = dispatchSizeRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const particles = particlesRef.current;
    const dot = 1 / dpr; // 1 device px
    ctx.fillStyle = "#2C2520";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.globalAlpha = p.alpha0;
      ctx.fillRect(p.x0, p.y0, dot, dot);
    }
    ctx.globalAlpha = 1;
  };

  const drawAnimated = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { dpr } = dispatchSizeRef.current;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const t = dissolveRef.current;
    if (t <= 0) {
      drawStatic();
      return;
    }
    const particles = particlesRef.current;
    const now = (performance.now() - startTimeRef.current) / 1000;
    const dot = 1 / dpr;
    ctx.fillStyle = "#2C2520";
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const local = (t - p.threshold) / Math.max(0.0001, 1 - p.threshold);
      if (local <= 0) {
        ctx.globalAlpha = p.alpha0;
        ctx.fillRect(p.x0, p.y0, dot, dot);
        continue;
      }
      if (local >= 1) continue;
      const e = 1 - Math.pow(1 - local, 2);
      const wob = Math.sin(now * 2 + p.phase) * p.jitter * e;
      const x = p.x0 + e * p.driftX + wob;
      const y = p.y0 - e * p.liftY + Math.cos(now * 1.6 + p.phase) * p.jitter * 0.4 * e;
      const a = p.alpha0 * (1 - local);
      ctx.globalAlpha = a;
      ctx.fillRect(x, y, dot, dot);
    }
    ctx.globalAlpha = 1;
  };

  // RAF loop while dissolving
  useEffect(() => {
    if (reducedMotion) return;
    const loop = () => {
      drawAnimated();
      const t = dissolveRef.current;
      if (t > 0 && t < 1) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
        if (t <= 0) drawStatic();
      }
    };
    ensureLoopRef.current = () => {
      if (rafRef.current == null) {
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      ensureLoopRef.current = null;
    };
  }, [reducedMotion, built]);

  useMotionValueEvent(progress, "change", (v) => {
    if (reducedMotion) return;
    const t = Math.min(1, Math.max(0, v / 0.25));
    const prev = dissolveRef.current;
    dissolveRef.current = t;
    if (t > 0 && t < 1) {
      ensureLoopRef.current?.();
    } else if (t !== prev) {
      drawAnimated();
    }
  });

  // Reduced-motion fallback: just render the real h1.
  if (reducedMotion) {
    return (
      <div ref={wrapRef} className="relative w-full">
        <h1
          className="font-serif font-normal text-espresso tracking-[-0.02em]"
          style={H1_STYLE}
        >
          {text}
        </h1>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Sizing/SEO/a11y h1: occupies layout space, invisible. */}
      <h1
        ref={measureRef}
        className="font-serif font-normal text-espresso tracking-[-0.02em]"
        style={{ ...H1_STYLE, visibility: "hidden" }}
      >
        {text}
      </h1>
      {/* Visual rendering lives entirely on this canvas. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 m-auto"
        style={{ left: 0, right: 0, top: 0, bottom: 0 }}
      />
    </div>
  );
}
