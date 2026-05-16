import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { AmbientBlobs, BrushUnderline } from "./Atmosphere";
import { useIsMobile } from "@/hooks/use-mobile";

const WORDS = ["The", "screen", "era", "is", "over."];

export function Act1Opening() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const statementOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0.2]);
  const statementY = useTransform(scrollYProgress, [0.5, 0.9], [0, isMobile ? -60 : -120]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);
  const wordmarkY = useTransform(scrollYProgress, [0.55, 0.85], [40, 0]);
  const brushOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  return (
    <section ref={ref} className="relative h-[140vh] md:h-[200vh]">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden px-5 sm:px-6">
        <AmbientBlobs density={6} />

        <motion.div
          className="relative z-10 text-center w-full"
          style={{ opacity: statementOpacity, y: statementY }}
        >
          <h1
            className="font-serif font-normal text-espresso tracking-[-0.02em]"
            style={{
              fontSize: "clamp(2.6rem, 13vw, 14rem)",
              lineHeight: 1.02,
              color: "var(--color-espresso)",
            }}
          >
            {WORDS.map((w, i) => (
              <span key={i}>
                <Word progress={scrollYProgress} index={i} total={WORDS.length}>
                  {w}
                </Word>
                {i < WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <div className="mt-6 sm:mt-10 flex justify-center">
            <motion.div style={{ opacity: brushOpacity }} className="w-full max-w-[24rem] sm:max-w-[40rem]">
              <BrushUnderline progress={1} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="relative z-20 mt-10 sm:mt-14 md:absolute md:left-0 md:right-0 md:px-6 md:mt-0 text-center w-full md:top-[58%]"
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
            style={{ color: "var(--color-stone)", fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)" }}
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
