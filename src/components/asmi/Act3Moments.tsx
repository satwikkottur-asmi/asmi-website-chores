import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function Moment({
  index, headline, subtext, ambient,
}: { index: number; headline: string; subtext: React.ReactNode; ambient: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.15, 0.5], [40, 0]);
  return (
    <div ref={ref} className="h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">{ambient}</div>
      <motion.div className="relative text-center px-5 sm:px-6 max-w-3xl w-full" style={{ opacity, y }}>
        <p className="label-mono mb-5 sm:mb-6" style={{ color: "var(--color-stone-dim)" }}>0{index}</p>
        <h2
          className="font-serif"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(1.75rem, 8vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {headline}
        </h2>
        <div
          className="mt-5 sm:mt-6 font-sans"
          style={{ color: "#6B6560", fontSize: "clamp(1rem, 1.5vw, 1.3rem)" }}
        >
          {subtext}
        </div>
      </motion.div>
    </div>
  );
}

export function Act3ThreeMoments() {
  return (
    <section className="relative">
      <Moment
        index={1}
        headline="Asmi calls you."
        subtext="Every morning. You just talk."
        ambient={<FullWaveform />}
      />
      <Moment
        index={2}
        headline="Asmi handles it."
        subtext="Calls. IVRs. Hold queues. Negotiation. In the real world."
        ambient={<FaintRadiating />}
      />
      <Moment
        index={3}
        headline="Done."
        subtext={<MessageBubble />}
        ambient={null}
      />
    </section>
  );
}

function FullWaveform() {
  return (
    <svg viewBox="0 0 1200 200" className="w-full" preserveAspectRatio="none" style={{ height: "55vh", opacity: 0.03 }}>
      <motion.path
        d="M0 100 Q75 30 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100"
        fill="none" stroke="#C25B3F" strokeWidth="3" strokeLinecap="round"
        animate={{ d: [
          "M0 100 Q75 30 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100",
          "M0 100 Q75 170 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100",
          "M0 100 Q75 30 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100",
        ] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function FaintRadiating() {
  const lines = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.02 }}>
      {lines.map((_, i) => {
        const angle = (i / lines.length) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 60;
        const y = 50 + Math.sin(angle) * 60;
        const mx = 50 + Math.cos(angle) * 30 + (i % 2 ? 10 : -10);
        const my = 50 + Math.sin(angle) * 30 + (i % 2 ? -10 : 10);
        return <path key={i} d={`M50 50 Q ${mx} ${my}, ${x} ${y}`} stroke="#C25B3F" strokeWidth="0.4" fill="none" />;
      })}
    </svg>
  );
}

function MessageBubble() {
  return (
    <motion.div
      className="mt-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div
        className="inline-flex items-center gap-2 px-7 py-5 rounded-3xl rounded-bl-md font-sans"
        style={{
          background: "var(--color-sage)",
          color: "var(--color-espresso)",
          boxShadow: "0 8px 32px rgba(44,37,32,0.08), 0 12px 40px -16px rgba(139, 168, 136, 0.6)",
          fontSize: "1.15rem",
          fontWeight: 500,
          maxWidth: "85vw",
          minWidth: "min(360px, 85vw)",
          justifyContent: "center",
        }}
      >
        <span>✓ Bay Dermatology. Tomorrow 10am. Dr. Chen.</span>
      </div>
      <span className="mt-2 font-sans" style={{ fontSize: 11, color: "var(--color-stone-dim)" }}>
        Delivered
      </span>
    </motion.div>
  );
}
