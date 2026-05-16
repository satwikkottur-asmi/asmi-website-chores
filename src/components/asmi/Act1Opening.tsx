import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AmbientBlobs, BrushUnderline } from "./Atmosphere";

const WORDS = ["The", "screen", "era", "is", "over."];

export function Act1Opening() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const statementOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0.2]);
  const statementY = useTransform(scrollYProgress, [0.5, 0.9], [0, -120]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const wordmarkY = useTransform(scrollYProgress, [0.55, 0.85], [40, 0]);
  const brushOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  return (
    <section ref={ref} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <AmbientBlobs density={6} />

        <motion.div
          className="relative z-10 text-center px-6"
          style={{ opacity: statementOpacity, y: statementY }}
        >
          <h1 className="font-serif font-normal text-espresso leading-[0.95] tracking-[-0.02em]"
              style={{ fontSize: "clamp(3.2rem, 12vw, 14rem)", color: "var(--color-espresso)" }}>
            {WORDS.map((w, i) => (
              <Word key={i} progress={scrollYProgress} index={i} total={WORDS.length}>
                {w}{i < WORDS.length - 1 ? " " : ""}
              </Word>
            ))}
          </h1>
          <div className="mt-10 flex justify-center">
            <motion.div style={{ opacity: brushOpacity }}>
              <BrushUnderline progress={1} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute z-20 left-0 right-0 px-6 text-center"
          style={{ opacity: wordmarkOpacity, y: wordmarkY, top: "58%" }}
        >
          <p className="font-serif italic text-espresso tracking-tight"
             style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", color: "var(--color-espresso)" }}>
            asmi
          </p>
          <p className="mt-4 font-sans font-light text-stone max-w-xl mx-auto"
             style={{ color: "var(--color-stone)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}>
            AI that handles your personal chores in the physical world.
          </p>
          <div className="mt-8">
            <a href="#start" className="btn-pill">Start with an iMessage →</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  index,
  total,
}: {
  children: React.ReactNode;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  index: number;
  total: number;
}) {
  // Subtle scroll-led breathing: words start fully visible, drift slightly as you scroll.
  const dim = useTransform(
    progress,
    [0.45, 0.7],
    [1, index === total - 1 ? 1 : 0.55]
  );
  const y = useTransform(progress, [0, 0.5], [0, -(index * 2)]);
  return (
    <motion.span style={{ opacity: dim, y, display: "inline-block" }}>{children}</motion.span>
  );
}
