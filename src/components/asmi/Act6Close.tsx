import { motion } from "motion/react";
import { useRef } from "react";
import { AmbientBlobs } from "./Atmosphere";

export function Act6Close() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="start"
      ref={ref}
      className="relative"
      style={{ padding: "80px 20px", minHeight: "90vh" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 0.5 }}>
        <AmbientBlobs density={5} />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-[70vh]">
        <div className="text-center w-full max-w-4xl mx-auto">
          <motion.h2
            className="font-serif"
            style={{
              color: "var(--color-espresso)",
              fontSize: "clamp(36px, 10vw, 96px)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
              fontWeight: 400,
            }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          >
            handled.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.35 }}
            className="mt-10 md:mt-14"
          >
            <p
              className="font-sans mx-auto"
              style={{
                color: "#5C5349",
                fontSize: 18,
                fontWeight: 300,
                maxWidth: 540,
                lineHeight: 1.5,
              }}
            >
              Join thousands who talk to Asmi every morning.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.5 }}
          >
            <div className="mt-8 flex justify-center px-4">
              <WaitlistForm size="lg" />
            </div>
            <p className="mt-6 label-mono text-center" style={{ color: "var(--color-stone-dim)", fontSize: 12 }}>
              No app to download.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
