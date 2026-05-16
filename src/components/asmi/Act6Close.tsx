import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AmbientBlobs } from "./Atmosphere";

export function Act6Close() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y1 = useTransform(scrollYProgress, [0.2, 0.6], [40, 0]);
  const o1 = useTransform(scrollYProgress, [0.15, 0.5], [0, 1]);
  const o2 = useTransform(scrollYProgress, [0.35, 0.7], [0, 1]);
  const oRest = useTransform(scrollYProgress, [0.55, 0.85], [0, 1]);

  return (
    <section ref={ref} className="relative h-[120vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <AmbientBlobs density={6} />
        <div className="relative z-10 text-center px-6">
          <motion.h2
            className="font-serif text-espresso"
            style={{ color: "var(--color-espresso)", fontSize: "clamp(3.2rem, 12vw, 14rem)", lineHeight: 0.95, letterSpacing: "-0.02em", opacity: o1, y: y1 }}
          >
            Your day,
          </motion.h2>
          <motion.p
            className="font-serif italic mt-2"
            style={{ color: "var(--color-terracotta)", fontSize: "clamp(3.6rem, 13vw, 15rem)", lineHeight: 0.95, letterSpacing: "-0.02em", opacity: o2 }}
          >
            handled.
          </motion.p>
          <motion.div style={{ opacity: oRest }} className="mt-12">
            <p className="font-sans text-stone max-w-xl mx-auto" style={{ color: "var(--color-stone)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}>
              Join thousands who talk to Asmi every morning.
            </p>
            <div className="mt-8">
              <a href="#start" className="btn-pill">Start with an iMessage →</a>
            </div>
            <p className="mt-6 label-mono" style={{ color: "var(--color-stone-dim)" }}>
              No app to download.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
