import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";

const HEADLINE = "The screen era is over.";

// Seeded RNG so shard positions are stable across renders.
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fixed overlay that shatters "The screen era is over." into shards
 * when the user scrolls past Act 1, then unmounts so Act 2 takes over.
 * One-shot timeline (~700ms), not scroll-frame-bound — no jank.
 */
export function HeroShatter() {
  const [phase, setPhase] = useState<"idle" | "shatter" | "done">("idle");
  const triggeredRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (triggeredRef.current) return;
      // Trigger when scrolled past ~85% of first viewport (end of Act 1 hero).
      const trigger = window.innerHeight * 0.85;
      if (window.scrollY >= trigger) {
        triggeredRef.current = true;
        setPhase("shatter");
        const dur = reduced ? 260 : 720;
        window.setTimeout(() => setPhase("done"), dur);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reduced]);

  if (phase === "done") return null;

  const shardsPerLetter = isMobile ? 3 : 6;
  const rng = mulberry32(42);

  return (
    <AnimatePresence>
      {phase === "shatter" && (
        <motion.div
          key="shatter"
          className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* linen flash */}
          <motion.div
            className="absolute inset-0"
            style={{ background: "var(--color-cream)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: reduced ? 0.15 : [0, 0.55, 0] }}
            transition={{ duration: reduced ? 0.26 : 0.42, times: reduced ? undefined : [0, 0.2, 1] }}
          />

          {/* shatter shards rendered per letter */}
          <h1
            aria-hidden
            className="font-serif font-normal text-espresso tracking-[-0.02em] relative"
            style={{
              fontSize: "clamp(2.2rem, 11vw, 14rem)",
              lineHeight: 1.02,
              color: "var(--color-espresso)",
              textAlign: "center",
              padding: "0 1rem",
            }}
          >
            {HEADLINE.split("").map((ch, i) => {
              if (ch === " ") return <span key={i}>&nbsp;</span>;
              return (
                <span key={i} style={{ position: "relative", display: "inline-block" }}>
                  <span style={{ visibility: "hidden" }}>{ch}</span>
                  {Array.from({ length: shardsPerLetter }).map((_, s) => {
                    const dx = (rng() - 0.5) * (isMobile ? 240 : 380);
                    const dy = 180 + rng() * 360;
                    const rot = (rng() - 0.5) * 140;
                    const delay = reduced ? 0 : s * 0.008 + i * 0.006;
                    // each shard is a clipped slice of the letter
                    const top = (s / shardsPerLetter) * 100;
                    const bottom = 100 - ((s + 1) / shardsPerLetter) * 100;
                    return (
                      <motion.span
                        key={s}
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "inline-block",
                          clipPath: `inset(${top}% 0 ${bottom}% 0)`,
                          willChange: "transform, opacity, filter",
                        }}
                        initial={{ x: 0, y: 0, rotate: 0, opacity: 1, filter: "blur(0px)" }}
                        animate={
                          reduced
                            ? { opacity: 0 }
                            : {
                                x: dx,
                                y: dy,
                                rotate: rot,
                                opacity: 0,
                                filter: "blur(3px)",
                              }
                        }
                        transition={{
                          duration: reduced ? 0.25 : 0.68,
                          delay,
                          ease: [0.36, 0, 0.66, -0.56],
                        }}
                      >
                        {ch}
                      </motion.span>
                    );
                  })}
                </span>
              );
            })}
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
