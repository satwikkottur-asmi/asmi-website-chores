import { motion } from "motion/react";
import { AmbientBlobs } from "./Atmosphere";
import { WaitlistForm } from "./WaitlistForm";

export function Act6Close() {
  return (
    <section
      id="start"
      className="relative"
      style={{ padding: "80px 20px", minHeight: "90vh" }}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ opacity: 0.5 }}
      >
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
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
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
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
          >
            handled.
          </motion.p>
          <motion.p
            className="font-sans mx-auto mt-10"
            style={{
              color: "#5C5349",
              fontSize: 18,
              fontWeight: 300,
              maxWidth: 540,
              lineHeight: 1.5,
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            Join thousands who talk to Asmi every morning.
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center px-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <WaitlistForm size="lg" />
          </motion.div>
          <motion.p
            className="mt-6 label-mono text-center"
            style={{ color: "var(--color-stone-dim)", fontSize: 12 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            No app to download.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
