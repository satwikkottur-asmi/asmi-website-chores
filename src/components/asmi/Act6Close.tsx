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
    <section
      id="start"
      ref={ref}
      className="relative"
      style={{ padding: "120px 20px", minHeight: "100vh" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.5 }}>
        <AmbientBlobs density={5} />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-[80vh]" style={{ padding: "40px 0" }}>
        <div className="text-center w-full max-w-4xl mx-auto">
          <motion.h2
            className="font-serif"
            style={{
              color: "var(--color-espresso)",
              fontSize: "clamp(36px, 10vw, 96px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              fontWeight: 400,
              opacity: o1,
              y: y1,
            }}
          >
            Your day,
          </motion.h2>
          <motion.p
            className="font-serif italic mt-2"
            style={{
              color: "var(--color-terracotta)",
              fontSize: "clamp(44px, 11vw, 108px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.span style={{ opacity: o2, display: "inline-block" }}>handled.</motion.span>
          </motion.p>
          <motion.div style={{ opacity: oRest }} className="mt-10 md:mt-14">
            <p
              className="font-sans mx-auto"
              style={{
                color: "#6B6560",
                fontSize: 18,
                fontWeight: 300,
                maxWidth: 540,
                lineHeight: 1.5,
              }}
            >
              Join thousands who talk to Asmi every morning.
            </p>
            <div className="mt-8 flex justify-center px-4">
              <a
                href="#start"
                className="btn-pill"
                style={{
                  padding: "16px 40px",
                  width: "100%",
                  maxWidth: 320,
                  justifyContent: "center",
                }}
              >
                Start with an iMessage →
              </a>
            </div>
            <p className="mt-6 label-mono" style={{ color: "var(--color-stone-dim)", fontSize: 12 }}>
              No app to download.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
