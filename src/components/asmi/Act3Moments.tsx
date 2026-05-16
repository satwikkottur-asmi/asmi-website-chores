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
      <motion.div className="relative text-center px-6 max-w-3xl" style={{ opacity, y }}>
        <p className="label-mono mb-6" style={{ color: "var(--color-stone-dim)" }}>0{index}</p>
        <h2 className="font-serif text-espresso" style={{ color: "var(--color-espresso)", fontSize: "clamp(2.6rem, 7vw, 6rem)", lineHeight: 1.02, letterSpacing: "-0.02em" }}>
          {headline}
        </h2>
        <div className="mt-6 font-sans text-stone" style={{ color: "var(--color-stone)", fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)" }}>
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
        ambient={<AmbientWave />}
      />
      <Moment
        index={2}
        headline="Asmi handles it."
        subtext="Calls. IVRs. Hold queues. Negotiation. In the real world."
        ambient={<AmbientBranches />}
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

function AmbientWave() {
  return (
    <svg viewBox="0 0 1200 200" className="w-full opacity-[0.06]" preserveAspectRatio="none" style={{ height: "40vh" }}>
      <motion.path
        d="M0 100 Q150 40 300 100 T600 100 T900 100 T1200 100"
        fill="none" stroke="#C25B3F" strokeWidth="2"
        animate={{ d: [
          "M0 100 Q150 40 300 100 T600 100 T900 100 T1200 100",
          "M0 100 Q150 160 300 100 T600 100 T900 100 T1200 100",
          "M0 100 Q150 40 300 100 T600 100 T900 100 T1200 100",
        ] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function AmbientBranches() {
  const lines = Array.from({ length: 7 });
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full opacity-[0.05]" preserveAspectRatio="xMidYMid slice">
      {lines.map((_, i) => {
        const angle = (i / lines.length) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 45;
        const y = 50 + Math.sin(angle) * 45;
        const mx = 50 + Math.cos(angle) * 25 + (i % 2 ? 6 : -6);
        const my = 50 + Math.sin(angle) * 25 + (i % 2 ? -6 : 6);
        return <path key={i} d={`M50 50 Q ${mx} ${my}, ${x} ${y}`} stroke="#C25B3F" strokeWidth="0.3" fill="none" />;
      })}
    </svg>
  );
}

function MessageBubble() {
  return (
    <div className="mt-8 flex justify-center">
      <div
        className="inline-flex items-center gap-2 px-6 py-4 rounded-3xl rounded-bl-md font-sans"
        style={{
          background: "var(--color-sage)",
          color: "var(--color-espresso)",
          boxShadow: "0 12px 40px -16px rgba(139, 168, 136, 0.6)",
          fontSize: "1.05rem",
          fontWeight: 500,
        }}
      >
        <span>✓ Mike's Plumbing. 2pm. $85.</span>
      </div>
    </div>
  );
}
