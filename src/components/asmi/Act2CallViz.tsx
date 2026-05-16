import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = { x: number; y: number; label: string };
type Phase = "intro" | "dialing" | "resolved" | "outro";
type Branch = {
  id: string;
  d: string;
  endpoint: Endpoint;
  index: number;
};

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 18, y: 28, label: "Bay Area Plumbing" },
  { x: 82, y: 26, label: "Rapid Rooter" },
  { x: 14, y: 72, label: "Pacific Plumbing Co" },
  { x: 86, y: 74, label: "Mr. Fix-It" },
  { x: 50, y: 88, label: "Joe's Plumbing" },
];

const MOBILE_ENDPOINTS: Endpoint[] = [
  { x: 24, y: 24, label: "Bay Area Plumbing" },
  { x: 76, y: 24, label: "Rapid Rooter" },
  { x: 18, y: 54, label: "Pacific Plumbing Co" },
  { x: 82, y: 56, label: "Mr. Fix-It" },
  { x: 50, y: 82, label: "Joe's Plumbing" },
];

export function Act2CallViz() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const endpoints = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

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

  const phase = usePhase(scrollYProgress);
  const captionOpacity = useTransform(scrollYProgress, [0.03, 0.08, 0.24, 0.34], [0, 1, 1, 0]);
  const speechOpacity = useTransform(scrollYProgress, [0.1, 0.18, 0.34, 0.44], [0, 1, 1, 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0.14, 0.22, 0.95, 0.995], [0, 1, 1, 0]);
  const closingOpacity = useTransform(scrollYProgress, [0.72, 0.8, 0.96, 0.995], [0, 1, 1, 0]);
  const orbGlowOpacity = useTransform(scrollYProgress, [0.18, 0.28, 0.72, 0.94], [0.2, 0.55, 0.7, 0.18]);

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
    <section ref={ref} className="relative h-[280vh] md:h-[300vh]" style={{ overflowX: "hidden" }}>
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden relative" style={{ maxWidth: "100vw" }}>
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: orbGlowOpacity,
            background:
              "radial-gradient(circle at center, rgba(194,91,63,0.08) 0%, rgba(194,91,63,0.04) 18%, rgba(246,241,235,0) 52%)",
          }}
        />

        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-center z-20"
          style={{ top: "8%", opacity: captionOpacity, transform: "translateX(-50%)" }}
        >
          <p className="label-mono" style={{ color: "var(--color-stone)" }}>
            9:03 AM · Sarah's morning call
          </p>
        </motion.div>

        <motion.div
          className="absolute left-1/2 text-center px-6 w-full max-w-2xl z-20"
          style={{ top: isMobile ? "14%" : "17%", opacity: speechOpacity, transform: "translateX(-50%)" }}
        >
          <p
            className="font-serif italic"
            style={{
              color: "var(--color-ink)",
              fontSize: isMobile ? "1.22rem" : "clamp(1.3rem, 1.8vw, 1.78rem)",
              lineHeight: 1.34,
              textShadow: "0 1px 0 rgba(251,248,243,0.75)",
            }}
          >
            "Sink is leaking. Can you find a plumber today?"
          </p>
        </motion.div>

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

            <OrbBurst cx={cx} cy={cy} isMobile={isMobile} progress={scrollYProgress} phase={phase} />
          </motion.svg>
        )}

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{ opacity: sceneOpacity }}
        >
          <div className="relative" style={{ width: isMobile ? 112 : 152, height: isMobile ? 112 : 152 }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "rgba(194,91,63,0.12)", boxShadow: "0 0 90px rgba(194,91,63,0.18)" }}
            />
            <div className="absolute inset-[16%] rounded-full" style={{ background: "rgba(194,91,63,0.22)" }} />
            <div className="absolute inset-[31%] rounded-full" style={{ background: "rgba(194,91,63,0.34)" }} />
            <motion.div
              className="absolute inset-[39%] rounded-full"
              style={{ background: "var(--color-terracotta)", boxShadow: "0 0 40px rgba(194,91,63,0.28)" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

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

        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6 z-30 pointer-events-none"
          style={{ opacity: closingOpacity }}
        >
          <div>
            <p
              className="font-serif"
              style={{
                color: "var(--color-espresso)",
                fontSize: "clamp(2.35rem, 7vw, 4.9rem)",
                lineHeight: 1.04,
                textShadow: "0 8px 30px rgba(251,248,243,0.8)",
              }}
            >
              Sarah found out over iMessage.
            </p>
            <p
              className="mt-4 font-serif italic"
              style={{ color: "var(--color-ink)", fontSize: "clamp(1.3rem, 2.8vw, 2.35rem)" }}
            >
              She never opened an app.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function usePhase(progress: MotionValue<number>): Phase {
  const latest = progress.get();
  if (latest < 0.16) return "intro";
  if (latest < 0.64) return "dialing";
  if (latest < 0.92) return "resolved";
  return "outro";
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
  const drawStart = 0.2 + branch.index * 0.035;
  const drawEnd = drawStart + 0.18;
  const pathLength = useTransform(progress, [drawStart, drawEnd], [0, 1]);
  const opacity = useTransform(
    progress,
    winner
      ? [drawStart - 0.04, drawStart, 0.68, 0.95]
      : [drawStart - 0.04, drawStart, 0.58, 0.72, 0.92],
    winner ? [0, 0.56, 1, 0.45] : [0, 0.38, 0.72, 0.14, 0]
  );

  const stroke =
    phase === "resolved" || phase === "outro"
      ? winner
        ? "var(--color-sage-strong)"
        : "rgba(107, 101, 96, 0.16)"
      : "rgba(194, 91, 63, 0.84)";

  return (
    <motion.path
      d={branch.d}
      fill="none"
      stroke={stroke}
      strokeWidth={winner ? 2.2 : 1.5}
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
  const appearStart = 0.28 + branch.index * 0.035;
  const appearEnd = appearStart + 0.08;
  const opacity = useTransform(
    progress,
    winner
      ? [appearStart, appearEnd, 0.95, 0.99]
      : [appearStart, appearEnd, 0.56, 0.7],
    winner ? [0, 1, 1, 0] : [0, 1, 0.9, 0]
  );
  const color =
    phase === "resolved" || phase === "outro" ? (winner ? "var(--color-sage-strong)" : "rgba(194,91,63,0.2)") : "var(--color-terracotta)";
  const dur = 2.8 + branch.index * 0.24;

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

function OrbBurst({
  cx,
  cy,
  isMobile,
  progress,
  phase,
}: {
  cx: number;
  cy: number;
  isMobile: boolean;
  progress: MotionValue<number>;
  phase: Phase;
}) {
  const opacity = useTransform(progress, [0.18, 0.24, 0.9, 0.98], [0, 0.4, 0.4, 0]);
  const stroke = phase === "resolved" || phase === "outro" ? "rgba(95,131,101,0.52)" : "rgba(194,91,63,0.36)";

  return (
    <motion.g style={{ opacity }}>
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const inner = isMobile ? 60 : 84;
        const baseLen = 8 + ((i * 7) % 5) * 2;
        const x1 = cx + Math.cos(angle) * inner;
        const y1 = cy + Math.sin(angle) * inner;
        const x2a = cx + Math.cos(angle) * (inner + baseLen);
        const y2a = cy + Math.sin(angle) * (inner + baseLen);
        const x2b = cx + Math.cos(angle) * (inner + baseLen * 2.15);
        const y2b = cy + Math.sin(angle) * (inner + baseLen * 2.15);
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            stroke={stroke}
            strokeWidth={2}
            strokeLinecap="round"
            animate={{ x2: [x2a, x2b, x2a], y2: [y2a, y2b, y2a] }}
            transition={{
              duration: 1.6 + (i % 5) * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (i % 7) * 0.08,
            }}
            initial={{ x2: x2a, y2: y2a }}
          />
        );
      })}
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
  const labelStart = 0.23 + index * 0.04;
  const resultOpacity = useTransform(progress, winner ? [0.62, 0.72, 0.96, 0.995] : [0, 0, 1, 1], [0, 1, 1, 0]);
  const plainLabelOpacity = useTransform(
    progress,
    winner ? [labelStart, labelStart + 0.08, 0.6, 0.68] : [labelStart, labelStart + 0.08, 0.56, 0.68],
    [0, 1, 1, 0]
  );
  const dotOpacity = useTransform(
    progress,
    winner ? [labelStart - 0.03, labelStart, 0.96, 0.995] : [labelStart - 0.03, labelStart, 0.6, 0.72],
    winner ? [0, 1, 1, 0] : [0, 0.92, 0.92, 0]
  );
  const dotScale = useTransform(progress, winner ? [0.62, 0.72] : [0, 0.01], winner ? [1, 1.35] : [1, 1]);
  const dotColor = phase === "resolved" || phase === "outro"
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.14)"
    : "var(--color-terracotta)";
  const above = endpoint.y < 50;

  return (
    <>
      <motion.div
        className="absolute rounded-full"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          width: winner ? 12 : 10,
          height: winner ? 12 : 10,
          background: dotColor,
          transform: "translate(-50%, -50%)",
          opacity: dotOpacity,
          scale: dotScale,
          boxShadow: winner ? "0 0 30px rgba(95,131,101,0.45)" : undefined,
        }}
      />

      <div
        className="absolute"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          transform: above ? "translate(-50%, calc(-100% - 16px))" : "translate(-50%, 16px)",
          maxWidth: "min(70vw, 260px)",
        }}
      >
        <div className="text-center">
          <motion.span
            className="label-mono inline-block"
            style={{
              opacity: plainLabelOpacity,
              color: "var(--color-stone)",
              whiteSpace: isMobile ? "normal" : "nowrap",
              lineHeight: 1.45,
              maxWidth: isMobile ? "8rem" : undefined,
            }}
          >
            {endpoint.label}
          </motion.span>

          {winner && (
            <motion.div style={{ opacity: resultOpacity, y: useTransform(progress, [0.62, 0.72], [12, 0]) }}>
              <span
                className="label-mono inline-flex items-center justify-center px-4 py-2 rounded-full"
                style={{
                  color: "var(--color-sage-deep)",
                  background: "rgba(95,131,101,0.18)",
                  border: "1px solid rgba(95,131,101,0.28)",
                  boxShadow: "0 18px 48px -24px rgba(95,131,101,0.6), inset 0 1px 0 rgba(251,248,243,0.7)",
                  backdropFilter: "blur(10px)",
                  whiteSpace: "normal",
                  lineHeight: 1.45,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                }}
              >
                ✓ Bay Area Plumbing · Mike · Today 2pm
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
