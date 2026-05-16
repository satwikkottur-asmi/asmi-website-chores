import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = { x: number; y: number; label: string };
type Phase = "ask" | "listen" | "dial" | "confirm" | "close";
type Branch = {
  id: string;
  d: string;
  endpoint: Endpoint;
  index: number;
};

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 16, y: 30, label: "Bay Area Plumbing" },
  { x: 84, y: 28, label: "Rapid Rooter" },
  { x: 12, y: 72, label: "Pacific Plumbing Co" },
  { x: 88, y: 74, label: "Mr. Fix-It" },
  { x: 50, y: 88, label: "Joe's Plumbing" },
];

const MOBILE_ENDPOINTS: Endpoint[] = [
  { x: 20, y: 22, label: "Bay Area Plumbing" },
  { x: 80, y: 22, label: "Rapid Rooter" },
  { x: 14, y: 54, label: "Pacific Plumbing Co" },
  { x: 86, y: 56, label: "Mr. Fix-It" },
  { x: 50, y: 84, label: "Joe's Plumbing" },
];

// Step scroll ranges — each step gets real scroll room to be read.
const STEPS = {
  ask:     { start: 0.02, in: 0.08, out: 0.22, end: 0.26 },
  listen:  { start: 0.22, in: 0.28, out: 0.36, end: 0.40 },
  dial:    { start: 0.34, in: 0.42, out: 0.58, end: 0.62 }, // branches draw 0.34→0.58
  confirm: { start: 0.58, in: 0.66, out: 0.82, end: 0.86 },
  close:   { start: 0.82, in: 0.88, out: 0.97, end: 1.00 },
};

export function Act2CallViz() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const endpoints = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const { scrollY } = useScroll();
  const scrollYProgress = useMotionValue(0);

  const [size, setSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const el = ref.current;
      if (!el || typeof window === "undefined") return;

      const rect = el.getBoundingClientRect();
      const totalScrollable = Math.max(el.offsetHeight - window.innerHeight, 1);
      const rawProgress = -rect.top / totalScrollable;
      scrollYProgress.set(Math.max(0, Math.min(1, rawProgress)));
    };

    updateProgress();
    window.addEventListener("resize", updateProgress);
    return () => window.removeEventListener("resize", updateProgress);
  }, [scrollYProgress]);

  useMotionValueEvent(scrollY, "change", () => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;

    const rect = el.getBoundingClientRect();
    const totalScrollable = Math.max(el.offsetHeight - window.innerHeight, 1);
    const rawProgress = -rect.top / totalScrollable;
    scrollYProgress.set(Math.max(0, Math.min(1, rawProgress)));
  });

  const [phase, setPhase] = useState<Phase>("ask");
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value < STEPS.listen.start) setPhase("ask");
    else if (value < STEPS.dial.start) setPhase("listen");
    else if (value < STEPS.confirm.start) setPhase("dial");
    else if (value < STEPS.close.start) setPhase("confirm");
    else setPhase("close");
  });

  // STEP labels — top of the stage, always anchored
  const stepAskOpacity     = useTransform(scrollYProgress, [STEPS.ask.start, STEPS.ask.in, STEPS.ask.out, STEPS.ask.end], [0, 1, 1, 0]);
  const stepListenOpacity  = useTransform(scrollYProgress, [STEPS.listen.start, STEPS.listen.in, STEPS.listen.out, STEPS.listen.end], [0, 1, 1, 0]);
  const stepDialOpacity    = useTransform(scrollYProgress, [STEPS.dial.start, STEPS.dial.in, STEPS.dial.out, STEPS.dial.end], [0, 1, 1, 0]);
  const stepConfirmOpacity = useTransform(scrollYProgress, [STEPS.confirm.start, STEPS.confirm.in, STEPS.confirm.out, STEPS.confirm.end], [0, 1, 1, 0]);

  // Speech bubble (Sarah) — appears with ASK, lingers a touch into LISTEN
  const speechOpacity = useTransform(
    scrollYProgress,
    [STEPS.ask.start, STEPS.ask.in, STEPS.listen.in, STEPS.listen.end - 0.01],
    [0, 1, 1, 0]
  );

  // Asmi orb visible from LISTEN through CONFIRM
  const orbOpacity = useTransform(
    scrollYProgress,
    [STEPS.ask.out, STEPS.listen.in, STEPS.confirm.out, STEPS.close.in],
    [0, 1, 1, 0]
  );

  // Branch network visible from DIAL through CONFIRM
  const sceneOpacity = useTransform(
    scrollYProgress,
    [STEPS.dial.start - 0.02, STEPS.dial.in - 0.02, STEPS.confirm.out, STEPS.close.in],
    [0, 1, 1, 0]
  );

  // Closing message
  const closingOpacity = useTransform(
    scrollYProgress,
    [STEPS.close.start, STEPS.close.in, STEPS.close.out, STEPS.close.end],
    [0, 1, 1, 0]
  );

  const cx = size.w / 2;
  const cy = size.h / 2;
  const branches: Branch[] = endpoints.map((endpoint, index) => {
    const ex = (endpoint.x / 100) * size.w;
    const ey = (endpoint.y / 100) * size.h;
    const mx =
      (cx + ex) / 2 +
      (index - (endpoints.length - 1) / 2) * (size.w * (isMobile ? 0.028 : 0.04));
    const my =
      (cy + ey) / 2 + (index % 2 === 0 ? -(isMobile ? 42 : 60) : isMobile ? 42 : 60);
    return { id: `branch-${index}`, d: `M ${cx} ${cy} Q ${mx} ${my}, ${ex} ${ey}`, endpoint, index };
  });

  return (
    <section ref={ref} className="relative h-[185vh] md:h-[205vh]">
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden relative">
        {/* Warm radial wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(194,91,63,0.10) 0%, rgba(194,91,63,0.05) 25%, rgba(246,241,235,0) 60%)",
          }}
        />

        {/* Step label (top) — stacks of overlapping labels */}
        <div
          className="absolute left-1/2 -translate-x-1/2 text-center z-30 pointer-events-none"
          style={{ top: "6%" }}
        >
          <StepLabel index={1} text="The ask" opacity={stepAskOpacity} />
          <StepLabel index={2} text="Asmi listens" opacity={stepListenOpacity} />
          <StepLabel index={3} text="Asmi calls 5 plumbers" opacity={stepDialOpacity} />
          <StepLabel index={4} text="One confirms" opacity={stepConfirmOpacity} />
        </div>

        {/* Sarah's speech bubble */}
        <motion.div
          className="absolute left-1/2 px-6 w-full max-w-3xl z-20 pointer-events-none"
          style={{ top: isMobile ? "16%" : "18%", opacity: speechOpacity, transform: "translateX(-50%)" }}
        >
          <div className="text-center">
            <p
              className="label-mono mb-3"
              style={{ color: "var(--color-terracotta)" }}
            >
              Sarah · 9:03 AM
            </p>
            <p
              className="font-serif italic"
              style={{
                color: "var(--color-espresso)",
                fontSize: isMobile ? "1.45rem" : "clamp(1.7rem, 2.4vw, 2.3rem)",
                lineHeight: 1.28,
                fontWeight: 400,
              }}
            >
              "Sink is leaking. Can you find a plumber today?"
            </p>
          </div>
        </motion.div>

        {/* SVG network */}
        {size.w > 0 && (
          <motion.svg
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: sceneOpacity }}
          >
            <defs>
              {branches.map((branch) => (
                <path key={`def-${branch.id}`} id={branch.id} d={branch.d} />
              ))}
            </defs>

            {branches.map((branch) => (
              <BranchPath
                key={`line-${branch.id}`}
                branch={branch}
                progress={scrollYProgress}
                phase={phase}
              />
            ))}

            {branches.map((branch) => (
              <TravelingWave key={`wave-${branch.id}`} branch={branch} progress={scrollYProgress} phase={phase} />
            ))}
          </motion.svg>
        )}

        {/* Center Asmi orb */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{ opacity: orbOpacity }}
        >
          <div className="relative" style={{ width: isMobile ? 124 : 168, height: isMobile ? 124 : 168 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(194,91,63,0.14)", boxShadow: "0 0 110px rgba(194,91,63,0.28)" }}
            />
            <div className="absolute inset-[16%] rounded-full" style={{ background: "rgba(194,91,63,0.26)" }} />
            <div className="absolute inset-[31%] rounded-full" style={{ background: "rgba(194,91,63,0.4)" }} />
            <motion.div
              className="absolute inset-[39%] rounded-full"
              style={{ background: "var(--color-terracotta)", boxShadow: "0 0 50px rgba(194,91,63,0.45)" }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 label-mono"
              style={{ bottom: -28, color: "var(--color-terracotta)", whiteSpace: "nowrap" }}
            >
              Asmi
            </div>
          </div>
        </motion.div>

        {/* Endpoint labels */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: sceneOpacity }}>
          {endpoints.map((endpoint, index) => (
            <EndpointLabel
              key={endpoint.label}
              endpoint={endpoint}
              index={index}
              progress={scrollYProgress}
              phase={phase}
            />
          ))}
        </motion.div>

        {/* Closing message */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6 z-30 pointer-events-none"
          style={{ opacity: closingOpacity }}
        >
          <div>
            <p
              className="font-serif"
              style={{
                color: "var(--color-espresso)",
                fontSize: "clamp(2.4rem, 7vw, 5rem)",
                lineHeight: 1.04,
                fontWeight: 500,
              }}
            >
              Sarah found out over iMessage.
            </p>
            <p
              className="mt-5 font-serif italic"
              style={{ color: "var(--color-ink)", fontSize: "clamp(1.35rem, 2.8vw, 2.4rem)" }}
            >
              She never opened an app.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StepLabel({
  index,
  text,
  opacity,
}: {
  index: number;
  text: string;
  opacity: MotionValue<number>;
}) {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3 whitespace-nowrap"
      style={{ opacity, top: 0 }}
    >
      <span
        className="label-mono inline-flex items-center justify-center rounded-full"
        style={{
          width: 28,
          height: 28,
          background: "var(--color-terracotta)",
          color: "var(--color-cream)",
          fontSize: 11,
        }}
      >
        {index}
      </span>
      <span
        className="label-mono"
        style={{ color: "var(--color-espresso)", fontSize: "0.78rem", letterSpacing: "0.22em" }}
      >
        {text}
      </span>
    </motion.div>
  );
}

function BranchPath({
  branch,
  progress,
  phase,
}: {
  branch: Branch;
  progress: MotionValue<number>;
  phase: Phase;
}) {
  const winner = branch.index === 0;
  // Stagger each plumber's line within the DIAL step (0.34 → 0.58, ~0.24 range)
  const drawStart = STEPS.dial.start + branch.index * 0.04;
  const drawEnd = drawStart + 0.06;
  const pathLength = useTransform(progress, [drawStart, drawEnd], [0, 1]);

  const opacity = useTransform(
    progress,
    winner
      ? [drawStart - 0.02, drawStart, STEPS.confirm.in, STEPS.close.in]
      : [drawStart - 0.02, drawStart, STEPS.confirm.in, STEPS.confirm.out],
    winner ? [0, 0.85, 1, 0] : [0, 0.7, 0.12, 0]
  );

  const isConfirmed = phase === "confirm" || phase === "close";
  const stroke = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.18)"
    : "var(--color-terracotta)";

  return (
    <motion.path
      d={branch.d}
      fill="none"
      stroke={stroke}
      strokeWidth={winner ? 2.6 : 1.6}
      strokeLinecap="round"
      style={{ pathLength, opacity }}
    />
  );
}

function TravelingWave({
  branch,
  progress,
  phase,
}: {
  branch: Branch;
  progress: MotionValue<number>;
  phase: Phase;
}) {
  const winner = branch.index === 0;
  const appearStart = STEPS.dial.start + branch.index * 0.04 + 0.04;
  const appearEnd = appearStart + 0.05;
  const opacity = useTransform(
    progress,
    winner
      ? [appearStart, appearEnd, STEPS.confirm.in, STEPS.close.in]
      : [appearStart, appearEnd, STEPS.confirm.in - 0.02, STEPS.confirm.in + 0.02],
    winner ? [0, 1, 1, 0] : [0, 1, 0.6, 0]
  );
  const isConfirmed = phase === "confirm" || phase === "close";
  const color = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(194,91,63,0.18)"
    : "var(--color-terracotta)";
  const dur = 2.6 + branch.index * 0.22;

  return (
    <motion.g style={{ opacity }}>
      <g transform="translate(-7,-12)">
        {[0, 1, 2].map((bar) => (
          <rect
            key={bar}
            x={bar * 5}
            y={0}
            width={2}
            height={12}
            rx={1}
            fill={color}
            style={{
              transformOrigin: `${bar * 5 + 1}px 12px`,
              animation: `wave-bar 0.8s ease-in-out infinite`,
              animationDelay: `${bar * 0.12}s`,
            }}
          />
        ))}
      </g>
      <animateMotion dur={`${dur}s`} repeatCount="indefinite" rotate="0" keyPoints="0;1" keyTimes="0;1">
        <mpath href={`#${branch.id}`} />
      </animateMotion>
    </motion.g>
  );
}

function EndpointLabel({
  endpoint,
  index,
  progress,
  phase,
}: {
  endpoint: Endpoint;
  index: number;
  progress: MotionValue<number>;
  phase: Phase;
}) {
  const isMobile = useIsMobile();
  const winner = index === 0;
  const labelStart = STEPS.dial.start + index * 0.04;

  // Dot appears with the line
  const dotOpacity = useTransform(
    progress,
    winner
      ? [labelStart - 0.02, labelStart + 0.04, STEPS.close.in, STEPS.close.in + 0.02]
      : [labelStart - 0.02, labelStart + 0.04, STEPS.confirm.in, STEPS.confirm.out],
    winner ? [0, 1, 1, 0] : [0, 0.95, 0.3, 0]
  );
  const dotScale = useTransform(
    progress,
    winner ? [STEPS.confirm.start, STEPS.confirm.in] : [0, 0.01],
    winner ? [1, 1.5] : [1, 1]
  );

  // Plain label appears with dial, fades when confirm starts (winner's name swaps to a result card)
  const plainLabelOpacity = useTransform(
    progress,
    winner
      ? [labelStart, labelStart + 0.04, STEPS.confirm.start, STEPS.confirm.in]
      : [labelStart, labelStart + 0.04, STEPS.confirm.in, STEPS.confirm.out],
    [0, 1, 1, 0]
  );

  // Winner's confirmation card
  const resultOpacity = useTransform(
    progress,
    winner ? [STEPS.confirm.start, STEPS.confirm.in, STEPS.close.in, STEPS.close.in + 0.02] : [0, 0, 1, 1],
    [0, 1, 1, 0]
  );
  const resultY = useTransform(progress, [STEPS.confirm.start, STEPS.confirm.in], [14, 0]);

  const isConfirmed = phase === "confirm" || phase === "close";
  const dotColor = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.18)"
    : "var(--color-terracotta)";

  const above = endpoint.y < 50;

  return (
    <>
      <motion.div
        className="absolute rounded-full"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          width: winner ? 14 : 10,
          height: winner ? 14 : 10,
          background: dotColor,
          transform: "translate(-50%, -50%)",
          opacity: dotOpacity,
          scale: dotScale,
          boxShadow: winner && isConfirmed ? "0 0 36px rgba(95,131,101,0.6)" : undefined,
        }}
      />

      <div
        className="absolute"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          transform: above ? "translate(-50%, calc(-100% - 18px))" : "translate(-50%, 18px)",
          maxWidth: "min(70vw, 280px)",
        }}
      >
        <div className="text-center">
          <motion.span
            className="label-mono inline-block"
            style={{
              opacity: plainLabelOpacity,
              color: isConfirmed && !winner ? "var(--color-stone-dim)" : "var(--color-espresso)",
              whiteSpace: isMobile ? "normal" : "nowrap",
              lineHeight: 1.45,
              maxWidth: isMobile ? "8.5rem" : undefined,
              fontWeight: 500,
            }}
          >
            {endpoint.label}
          </motion.span>

          {winner && (
            <motion.div style={{ opacity: resultOpacity, y: resultY }} className="mt-2">
              <span
                className="label-mono inline-flex items-center justify-center px-4 py-2 rounded-full"
                style={{
                  color: "var(--color-cream)",
                  background: "var(--color-sage-strong)",
                  border: "1px solid var(--color-sage-deep)",
                  boxShadow: "0 18px 48px -18px rgba(73,100,78,0.6)",
                  whiteSpace: "normal",
                  lineHeight: 1.45,
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  fontWeight: 600,
                }}
              >
                ✓ Mike · Today 2pm
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
