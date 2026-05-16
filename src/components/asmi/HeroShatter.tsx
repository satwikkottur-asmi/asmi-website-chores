import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "motion/react";
import { RefObject, useMemo, useRef, useState } from "react";

const HEADLINE = "The screen era is over.";

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One-shot shatter overlay aligned to Act 1's scroll progress.
 * Plays a fixed-duration timeline (~700ms) when the hero is about
 * to release its sticky lock, so it lands at the seam into Act 2.
 */
export function HeroShatter({ targetRef }: { targetRef: RefObject<HTMLElement | null> }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const [phase, setPhase] = useState<"idle" | "shatter" | "done">("idle");
  const firedRef = useRef(false);
  const restoreTimerRef = useRef<number | null>(null);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p > 0.82 && !firedRef.current) {
      firedRef.current = true;
      setPhase("shatter");
      const dur = reduced ? 320 : 760;
      window.setTimeout(() => setPhase("done"), dur);
    }
    // If user scrolls back up far enough, allow it to fire again.
    if (p < 0.35 && firedRef.current && phase !== "shatter") {
      firedRef.current = false;
      if (restoreTimerRef.current) window.clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = window.setTimeout(() => setPhase("idle"), 150);
    }
  });

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const shardsPerChar = reduced ? 1 : isMobile ? 3 : 5;

  // Pre-compute shard transforms once with a stable seed.
  const shards = useMemo(() => {
    const rng = mulberry32(7);
    return HEADLINE.split("").map((ch, i) =>
      Array.from({ length: shardsPerChar }).map((_, s) => ({
        dx: (rng() - 0.5) * (isMobile ? 220 : 360),
        dy: 180 + rng() * 320,
        rot: (rng() - 0.5) * 120,
        delay: i * 0.005 + s * 0.012,
        topPct: (s / shardsPerChar) * 100,
        bottomPct: 100 - ((s + 1) / shardsPerChar) * 100,
        ch,
      }))
    );
  }, [shardsPerChar, isMobile]);

  return (
    <AnimatePresence>
      {phase === "shatter" && (
        <motion.div
          key="shatter"
          className="fixed inset-0 z-[55] pointer-events-none flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {/* soft flash */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "var(--color-cream, #F4ECDF)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 0.2 : [0, 0.5, 0] }}
            transition={{ duration: reduced ? 0.3 : 0.5, times: reduced ? undefined : [0, 0.25, 1] }}
          />

          <h1
            aria-hidden
            className="font-serif font-normal tracking-[-0.02em] relative text-center px-4"
            style={{
              fontSize: "clamp(2.2rem, 11vw, 14rem)",
              lineHeight: 1.02,
              color: "var(--color-espresso)",
            }}
          >
            {HEADLINE.split("").map((ch, i) => {
              if (ch === " ") return <span key={i}>&nbsp;</span>;
              return (
                <span key={i} style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ visibility: "hidden" }}>{ch}</span>
                  {shards[i].map((sh, s) => (
                    <motion.span
                      key={s}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "inline-block",
                        clipPath: `inset(${sh.topPct}% 0 ${sh.bottomPct}% 0)`,
                        willChange: "transform, opacity",
                      }}
                      initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      animate={
                        reduced
                          ? { opacity: 0 }
                          : { x: sh.dx, y: sh.dy, rotate: sh.rot, opacity: 0 }
                      }
                      transition={{
                        duration: reduced ? 0.3 : 0.7,
                        delay: sh.delay,
                        ease: [0.32, 0.02, 0.4, 1],
                      }}
                    >
                      {sh.ch}
                    </motion.span>
                  ))}
                </span>
              );
            })}
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
