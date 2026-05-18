import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { RefObject, useRef } from "react";
import { AmbientBlobs, BrushUnderline } from "./Atmosphere";
import { useIsMobile } from "@/hooks/use-mobile";

const WORDS = ["The", "screen", "era", "is", "over."];

export function Act1Opening({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  const internalRef = useRef<HTMLElement>(null);
  const ref = sectionRef ?? internalRef;
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const statementOpacity = useTransform(scrollYProgress, [0.42, 0.68], [1, 0]);
  const statementY = useTransform(scrollYProgress, [0.42, 0.72], [0, isMobile ? -36 : -72]);
  const statementScale = useTransform(scrollYProgress, [0.5, 0.72], [1, prefersReducedMotion ? 0.985 : 1.02]);
  const wordmarkOpacity = useTransform(scrollYProgress, [0.3, 0.48, 0.68], [0, 1, 0]);
  const wordmarkY = useTransform(scrollYProgress, [0.32, 0.68], [28, -12]);
  const brushOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);

  return (
    <section ref={ref} className="relative h-[100vh] md:h-[105vh]">
      <div className="sticky top-0 h-screen overflow-hidden px-5 sm:px-6">
        <AmbientBlobs density={6} />

        {/* Headline — absolutely centered in the viewport so it doesn't shift when the wordmark mounts */}
        <motion.div
          className="absolute left-0 right-0 px-5 sm:px-6 z-10 text-center"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            opacity: statementOpacity,
          }}
        >
          <motion.div style={{ y: statementY, scale: statementScale }}>
            <h1
              className="font-serif font-normal text-espresso tracking-[-0.02em]"
              style={{
                fontSize: "clamp(2.2rem, 11vw, 14rem)",
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
        </motion.div>

        {/* Wordmark block — absolutely positioned on every breakpoint, anchored to lower portion */}
        <motion.div
          className="absolute left-0 right-0 px-5 sm:px-6 z-20 text-center"
          style={{
            bottom: isMobile ? "9svh" : undefined,
            top: isMobile ? undefined : "62%",
            opacity: wordmarkOpacity,
            y: wordmarkY,
          }}
        >
          <p
            className="font-serif italic text-espresso tracking-tight"
            style={{ fontSize: "clamp(1.8rem, 5vw, 3.4rem)", color: "var(--color-espresso)" }}
          >
            asmi
          </p>
          <p
            className="mt-3 sm:mt-4 font-sans font-light text-stone max-w-xl mx-auto px-2"
            style={{ color: "var(--color-stone)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}
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
