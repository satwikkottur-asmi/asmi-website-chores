import { motion, useScroll, useTransform, useReducedMotion, MotionValue } from "motion/react";
import { useRef } from "react";
import { AmbientBlobs } from "./Atmosphere";
import { WaitlistForm } from "./WaitlistForm";

function useStage(progress: MotionValue<number>, start: number, end: number) {
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [40, 0]);
  return { opacity, y };
}

export function Act6Close() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Stage 1: ambient (0.00–0.15)
  const ambientOpacity = useTransform(scrollYProgress, [0.0, 0.15], [0.15, 0.55]);
  const horizonOpacity = useTransform(scrollYProgress, [0.0, 0.2], [0, 0.6]);
  const horizonY = useTransform(scrollYProgress, [0.0, 0.2], [60, 0]);

  // Stage 2: "Your day," (0.10–0.30)
  const yourDayOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
  const yourDayY = useTransform(scrollYProgress, [0.1, 0.3], [40, 0]);
  const yourDayBlur = useTransform(scrollYProgress, [0.1, 0.3], [8, 0]);
  const yourDayFilter = useTransform(yourDayBlur, (b) => `blur(${b}px)`);
  const yourDayTracking = useTransform(scrollYProgress, [0.1, 0.3], [0.04, -0.02]);
  const yourDayLetterSpacing = useTransform(yourDayTracking, (t) => `${t}em`);

  // Stage 3: "handled." (0.25–0.50)
  const handledOpacity = useTransform(scrollYProgress, [0.25, 0.5], [0, 1]);
  const handledY = useTransform(scrollYProgress, [0.25, 0.5], [48, 0]);
  const handledColor = useTransform(
    scrollYProgress,
    [0.25, 0.5],
    ["oklch(0.62 0.06 40)", "var(--color-terracotta)"],
  );
  const underlinePath = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);
  const underlineOpacity = useTransform(scrollYProgress, [0.3, 0.55], [0, 1]);

  // Stage 4: subtitle (0.45–0.65)
  const subtitle = useStage(scrollYProgress, 0.45, 0.65);

  // Stage 5: waitlist (0.60–0.80)
  const formOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const formY = useTransform(scrollYProgress, [0.6, 0.8], [32, 0]);
  const formScale = useTransform(scrollYProgress, [0.6, 0.8], [0.96, 1]);

  // Stage 6: caption (0.78–0.95)
  const captionOpacity = useTransform(scrollYProgress, [0.78, 0.95], [0, 1]);

  if (prefersReducedMotion) {
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
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
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              handled.
            </motion.p>
            <p
              className="font-sans mx-auto mt-10"
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
            <div className="mt-8 flex justify-center px-4">
              <WaitlistForm size="lg" />
            </div>
            <p className="mt-6 label-mono text-center" style={{ color: "var(--color-stone-dim)", fontSize: 12 }}>
              No app to download.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="start"
      ref={ref}
      className="relative"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center" style={{ padding: "0 20px" }}>
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          style={{ opacity: ambientOpacity }}
        >
          <AmbientBlobs density={5} />
        </motion.div>

        {/* horizon glow */}
        <motion.div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "55%",
            opacity: horizonOpacity,
            y: horizonY,
            background:
              "radial-gradient(ellipse at 50% 100%, color-mix(in oklab, var(--color-terracotta) 28%, transparent) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
          <motion.h2
            className="font-serif"
            style={{
              color: "var(--color-espresso)",
              fontSize: "clamp(36px, 10vw, 96px)",
              lineHeight: 0.98,
              letterSpacing: yourDayLetterSpacing,
              fontWeight: 400,
              opacity: yourDayOpacity,
              y: yourDayY,
              filter: yourDayFilter,
            }}
          >
            Your day,
          </motion.h2>

          <div className="relative inline-block mt-2">
            <motion.p
              className="font-serif italic"
              style={{
                color: handledColor,
                fontSize: "clamp(44px, 11vw, 108px)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                opacity: handledOpacity,
                y: handledY,
              }}
            >
              handled.
            </motion.p>
            <motion.svg
              className="absolute left-0 right-0 pointer-events-none"
              style={{
                bottom: "-0.05em",
                width: "100%",
                height: "0.18em",
                opacity: underlineOpacity,
              }}
              viewBox="0 0 200 10"
              preserveAspectRatio="none"
              fill="none"
            >
              <motion.path
                d="M2 6 Q 50 2, 100 5 T 198 4"
                stroke="var(--color-terracotta)"
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{ pathLength: underlinePath }}
              />
            </motion.svg>
          </div>

          <motion.div
            className="mt-10 md:mt-14"
            style={{ opacity: subtitle.opacity, y: subtitle.y }}
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

          <motion.div style={{ opacity: formOpacity, y: formY, scale: formScale }}>
            <div className="mt-8 flex justify-center px-4">
              <WaitlistForm size="lg" />
            </div>
          </motion.div>

          <motion.p
            className="mt-6 label-mono text-center"
            style={{ color: "var(--color-stone-dim)", fontSize: 12, opacity: captionOpacity }}
          >
            No app to download.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
