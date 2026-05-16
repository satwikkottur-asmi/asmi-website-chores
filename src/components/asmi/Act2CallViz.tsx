import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

type Endpoint = { x: number; y: number; label: string };

const ENDPOINTS: Endpoint[] = [
  { x: 18, y: 22, label: "Mike's Plumbing" },
  { x: 86, y: 28, label: "Bay Area Pipes" },
  { x: 14, y: 70, label: "QuickFix" },
  { x: 88, y: 75, label: "City Drain" },
  { x: 50, y: 90, label: "AllPro Plumbing" },
];

export function Act2CallViz() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Phases: 0-0.2 intro, 0.2-0.35 branching, 0.35-0.6 filtering, 0.6-0.75 result, 0.75-1 dissolve
  const orbScale = useTransform(scrollYProgress, [0, 0.1], [0.6, 1]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);
  const wavePathLen = useTransform(scrollYProgress, [0.05, 0.2], [0, 1]);
  const branchProgress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const speechOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.6, 0.7], [0, 1, 1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.7, 0.8], [0, 1, 1, 0]);
  const closingOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const vizOpacity = useTransform(scrollYProgress, [0.78, 0.9], [1, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ opacity: vizOpacity }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {/* branches */}
            {ENDPOINTS.map((e, i) => (
              <Branch key={i} endpoint={e} index={i} progress={branchProgress} scrollProgress={scrollYProgress} />
            ))}

            {/* center watercolor orb */}
            <motion.g style={{ opacity: orbOpacity, scale: orbScale, transformOrigin: "50% 50%" }}>
              <circle cx="50" cy="50" r="6" fill="#C25B3F" opacity="0.18" />
              <circle cx="50" cy="50" r="4" fill="#C25B3F" opacity="0.35" />
              <motion.circle
                cx="50" cy="50" r="2.6" fill="#C25B3F"
                animate={{ r: [2.4, 2.9, 2.4] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.g>

            {/* hand-drawn waveform near orb */}
            <motion.path
              d="M 30 50 Q 33 46, 36 50 T 42 50 T 48 50 T 54 50 T 60 50 T 66 50 T 70 50"
              fill="none"
              stroke="#C25B3F"
              strokeWidth="0.4"
              strokeLinecap="round"
              style={{ pathLength: wavePathLen, opacity: useTransform(scrollYProgress, [0.05, 0.15, 0.55, 0.65], [0, 0.9, 0.9, 0]) }}
            />
          </svg>

          {/* labels overlay */}
          {ENDPOINTS.map((e, i) => (
            <EndpointLabel key={i} endpoint={e} index={i} progress={scrollYProgress} />
          ))}

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: "8%", opacity: captionOpacity }}
          >
            <p className="label-mono text-stone" style={{ color: "var(--color-stone)" }}>
              9:03 AM · Sarah's morning call
            </p>
          </motion.div>

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center px-6 max-w-md"
            style={{ top: "60%", opacity: speechOpacity }}
          >
            <p className="font-serif italic text-espresso" style={{ color: "var(--color-espresso)", fontSize: "clamp(1.1rem, 1.8vw, 1.6rem)" }}>
              "My sink is leaking. Can you find a plumber?"
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6"
          style={{ opacity: closingOpacity }}
        >
          <div>
            <p className="font-serif text-espresso" style={{ color: "var(--color-espresso)", fontSize: "clamp(2rem, 5vw, 4.4rem)", lineHeight: 1.05 }}>
              Sarah found out over iMessage.
            </p>
            <p className="mt-4 font-serif italic text-stone" style={{ color: "var(--color-stone)", fontSize: "clamp(1.2rem, 2.6vw, 2.2rem)" }}>
              She never opened an app.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Branch({
  endpoint,
  index,
  progress,
  scrollProgress,
}: {
  endpoint: Endpoint;
  index: number;
  progress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
}) {
  // Curved path from center (50,50) to endpoint
  const cx = 50, cy = 50;
  const { x, y } = endpoint;
  // control point — perpendicular offset for curve
  const mx = (cx + x) / 2 + (index - 2) * 6;
  const my = (cy + y) / 2 + ((index % 2 === 0) ? -8 : 8);
  const d = `M ${cx} ${cy} Q ${mx} ${my}, ${x} ${y}`;

  // Survival bands: which lines persist past phase 3?
  // Mike (0) and AllPro (4) turn green; others fade.
  const survives = index === 0 || index === 4;
  const winner = index === 0;

  // base color phases
  const stroke = useTransform(scrollProgress, (p) => {
    if (p < 0.42) return "#C25B3F";
    if (p < 0.55) return survives ? "#8BA888" : "#C9C2B6";
    if (p < 0.7) return winner ? "#8BA888" : "#C9C2B6";
    return winner ? "#8BA888" : "#C9C2B6";
  });
  const opacity = useTransform(scrollProgress, (p) => {
    if (p < 0.2) return 0;
    if (p < 0.42) return 0.85;
    if (!survives) return Math.max(0, 0.4 - (p - 0.42) * 2);
    if (!winner && p > 0.6) return Math.max(0, 0.5 - (p - 0.6) * 3);
    return 0.9;
  });

  return (
    <>
      <motion.path
        d={d}
        fill="none"
        stroke={stroke as unknown as string}
        strokeWidth="0.35"
        strokeLinecap="round"
        style={{ pathLength: progress, opacity }}
      />
      {/* traveling dot forward */}
      <FlowDot d={d} delay={index * 0.4} progress={scrollProgress} winner={winner} survives={survives} />
    </>
  );
}

function FlowDot({
  d, delay, progress, winner, survives,
}: { d: string; delay: number; progress: MotionValue<number>; winner: boolean; survives: boolean }) {
  const opacity = useTransform(progress, (p) => {
    if (p < 0.22) return 0;
    if (p < 0.45) return 0.9;
    if (winner && p > 0.6) return 0.95;
    if (survives && p < 0.6) return 0.7;
    return 0;
  });
  return (
    <motion.circle r="0.7" fill={winner ? "#8BA888" : "#C25B3F"} style={{ opacity }}>
      <animateMotion dur={`${4 + delay}s`} repeatCount="indefinite" path={d} />
    </motion.circle>
  );
}

function EndpointLabel({
  endpoint, index, progress,
}: { endpoint: Endpoint; index: number; progress: MotionValue<number> }) {
  const survives = index === 0 || index === 4;
  const winner = index === 0;

  const opacityBase = useTransform(progress, (p) => {
    if (p < 0.28) return 0;
    if (p < 0.45) return 1;
    if (!survives) return Math.max(0, 1 - (p - 0.45) * 4);
    if (!winner && p > 0.6) return Math.max(0, 1 - (p - 0.6) * 4);
    if (p > 0.78) return Math.max(0, 1 - (p - 0.78) * 5);
    return 1;
  });
  const showResult = useTransform(progress, (p) => (p > 0.45 && survives ? 1 : 0));
  const showInitial = useTransform(progress, (p) => (p > 0.45 && survives ? 0 : 1));

  const resultLabel = winner ? `${endpoint.label} · $85 · 2pm ✓` : `AllPro · $120 · 4pm ✓`;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${endpoint.x}%`,
        top: `${endpoint.y}%`,
        transform: "translate(-50%, -120%)",
        opacity: opacityBase,
      }}
    >
      <div className="relative whitespace-nowrap">
        <motion.span
          className="label-mono absolute left-1/2 -translate-x-1/2"
          style={{ color: "var(--color-stone)", opacity: showInitial }}
        >
          {endpoint.label}
        </motion.span>
        <motion.span
          className="label-mono absolute left-1/2 -translate-x-1/2"
          style={{ color: "var(--color-sage)", opacity: showResult }}
        >
          {resultLabel}
        </motion.span>
        {/* invisible spacer to give wrapper height */}
        <span className="label-mono opacity-0">{resultLabel}</span>
      </div>
    </motion.div>
  );
}
