import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = { x: number; y: number; label: string };

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 18, y: 22, label: "Bay Dermatology" },
  { x: 86, y: 28, label: "SkinCare Clinic" },
  { x: 14, y: 70, label: "Pacific Derm" },
  { x: 88, y: 75, label: "City Skin Center" },
  { x: 50, y: 90, label: "Dr. Park's Office" },
];

// Mobile: 3 lines only, endpoint labels stacked on the right side
const MOBILE_ENDPOINTS: Endpoint[] = [
  { x: 82, y: 28, label: "Bay Dermatology" },
  { x: 84, y: 52, label: "SkinCare Clinic" },
  { x: 82, y: 76, label: "Pacific Derm" },
];

export function Act2CallViz() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const ENDPOINTS = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const orbScale = useTransform(scrollYProgress, [0, 0.1], [0.6, isMobile ? 0.7 : 1]);
  const orbOpacity = useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0, 1, 1, 0]);
  const branchProgress = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const speechOpacity = useTransform(scrollYProgress, [0.18, 0.25, 0.6, 0.7], [0, 1, 1, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.05, 0.12, 0.7, 0.8], [0, 1, 1, 0]);
  const closingOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const vizOpacity = useTransform(scrollYProgress, [0.78, 0.9], [1, 0]);
  const radialOpacity = useTransform(scrollYProgress, [0.08, 0.18, 0.7, 0.8], [0, 0.3, 0.3, 0]);

  return (
    <section ref={ref} className="relative h-[300vh]" style={{ overflowX: "hidden" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ maxWidth: "100vw" }}>
        <motion.div className="absolute inset-0" style={{ opacity: vizOpacity }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {ENDPOINTS.map((e, i) => (
              <Branch
                key={i}
                endpoint={e}
                index={i}
                total={ENDPOINTS.length}
                progress={branchProgress}
                scrollProgress={scrollYProgress}
              />
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

            {/* radial waveform ring around orb */}
            <motion.g style={{ opacity: radialOpacity, transformOrigin: "50% 50%" }}>
              {Array.from({ length: 22 }).map((_, i) => {
                const angle = (i / 22) * Math.PI * 2;
                const inner = 7.5;
                const baseLen = 1.6 + ((i * 7) % 5) * 0.4;
                const x1 = 50 + Math.cos(angle) * inner;
                const y1 = 50 + Math.sin(angle) * inner;
                const x2a = 50 + Math.cos(angle) * (inner + baseLen);
                const y2a = 50 + Math.sin(angle) * (inner + baseLen);
                const x2b = 50 + Math.cos(angle) * (inner + baseLen * 2.2);
                const y2b = 50 + Math.sin(angle) * (inner + baseLen * 2.2);
                return (
                  <motion.line
                    key={i}
                    x1={x1} y1={y1}
                    stroke="#C25B3F"
                    strokeWidth="0.28"
                    strokeLinecap="round"
                    animate={{ x2: [x2a, x2b, x2a], y2: [y2a, y2b, y2a] }}
                    transition={{
                      duration: 1.4 + (i % 5) * 0.15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (i % 7) * 0.08,
                    }}
                    initial={{ x2: x2a, y2: y2a }}
                  />
                );
              })}
            </motion.g>
          </svg>

          {/* labels overlay */}
          {ENDPOINTS.map((e, i) => (
            <EndpointLabel key={i} endpoint={e} index={i} progress={scrollYProgress} />
          ))}

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: "8%", opacity: captionOpacity }}
          >
            <p className="label-mono" style={{ color: "var(--color-stone)" }}>
              9:03 AM · Sarah's morning call
            </p>
          </motion.div>

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center px-6 w-full max-w-md"
            style={{ top: isMobile ? "82%" : "60%", opacity: speechOpacity }}
          >
            <p
              className="font-serif italic"
              style={{
                color: "#6B6560",
                fontSize: isMobile ? "1rem" : "clamp(1.125rem, 1.8vw, 1.6rem)",
                lineHeight: 1.35,
              }}
            >
              "I need to see a dermatologist. Can you find one that takes my insurance?"
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6"
          style={{ opacity: closingOpacity }}
        >
          <div>
            <p className="font-serif" style={{ color: "var(--color-espresso)", fontSize: "clamp(2rem, 5vw, 4.4rem)", lineHeight: 1.05 }}>
              Sarah found out over iMessage.
            </p>
            <p className="mt-4 font-serif italic" style={{ color: "#5C5349", fontSize: "clamp(1.2rem, 2.6vw, 2.2rem)" }}>
              She never opened an app.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Branch({
  endpoint, index, total, progress, scrollProgress,
}: {
  endpoint: Endpoint;
  index: number;
  total: number;
  progress: MotionValue<number>;
  scrollProgress: MotionValue<number>;
}) {
  const cx = 50, cy = 50;
  const { x, y } = endpoint;
  const mx = (cx + x) / 2 + (index - (total - 1) / 2) * 6;
  const my = (cy + y) / 2 + ((index % 2 === 0) ? -8 : 8);
  const d = `M ${cx} ${cy} Q ${mx} ${my}, ${x} ${y}`;

  // Winner is always index 0 (Bay Dermatology)
  const survives = index === 0 || index === Math.min(4, total - 1);
  const winner = index === 0;

  const stroke = useTransform(scrollProgress, (p) => {
    if (p < 0.42) return "#C25B3F";
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
      <TravelingWave d={d} delay={index * 0.6} progress={scrollProgress} winner={winner} survives={survives} />
    </>
  );
}

function TravelingWave({
  d, delay, progress, winner, survives,
}: { d: string; delay: number; progress: MotionValue<number>; winner: boolean; survives: boolean }) {
  // Group of 4 mini bars that travel along the path
  const opacity = useTransform(progress, (p) => {
    if (p < 0.22) return 0;
    if (p < 0.42) return 0.95;
    if (!survives) return Math.max(0, 0.6 - (p - 0.42) * 3.5); // dissolve smoothly
    if (winner && p > 0.6) return 0.95;
    if (survives && p < 0.6) return 0.75;
    return 0;
  });
  const color = useTransform(progress, (p) => (winner && p > 0.45 ? "#8BA888" : "#C25B3F"));

  return (
    <motion.g style={{ opacity }}>
      <g>
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x={(i - 1.5) * 0.7}
            y={-1.5}
            width="0.45"
            height="3"
            fill={color as unknown as string}
            rx="0.15"
            animate={{ height: [1.2, 3, 1.2], y: [-0.6, -1.5, -0.6] }}
            transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
          />
        ))}
        <animateMotion dur={`${4.2 + delay}s`} repeatCount="indefinite" path={d} rotate="auto" />
      </g>
    </motion.g>
  );
}

function EndpointLabel({
  endpoint, index, progress,
}: { endpoint: Endpoint; index: number; progress: MotionValue<number> }) {
  const survives = index === 0;
  const winner = index === 0;

  const opacityBase = useTransform(progress, (p) => {
    if (p < 0.28) return 0;
    if (p < 0.45) return 1;
    if (!survives) return Math.max(0, 1 - (p - 0.45) * 4);
    if (p > 0.78) return Math.max(0, 1 - (p - 0.78) * 5);
    return 1;
  });
  const showResult = useTransform(progress, (p) => (p > 0.45 && survives ? 1 : 0));
  const showInitial = useTransform(progress, (p) => (p > 0.45 && survives ? 0 : 1));

  const resultLabel = winner
    ? "Bay Dermatology · Dr. Chen · Tomorrow 10am ✓"
    : `${endpoint.label} ✓`;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${endpoint.x}%`,
        top: `${endpoint.y}%`,
        transform: "translate(-50%, -120%)",
        opacity: opacityBase,
        maxWidth: "44vw",
      }}
    >
      <div className="relative whitespace-nowrap">
        <motion.span
          className="label-mono absolute left-1/2 -translate-x-1/2"
          style={{ color: "#6B6560", opacity: showInitial }}
        >
          {endpoint.label}
        </motion.span>
        <motion.span
          className="label-mono absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded-md"
          style={{
            color: "var(--color-sage)",
            opacity: showResult,
            boxShadow: winner ? "0 0 24px rgba(139,168,136,0.3)" : undefined,
            background: winner ? "rgba(139,168,136,0.06)" : undefined,
          }}
        >
          {resultLabel}
        </motion.span>
        <span className="label-mono opacity-0">{resultLabel}</span>
      </div>
    </motion.div>
  );
}
