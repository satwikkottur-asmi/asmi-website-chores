import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = { x: number; y: number; label: string };

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

const STEPS = [
  { key: "ask", label: "The ask" },
  { key: "listen", label: "Asmi listens" },
  { key: "dial", label: "Asmi calls 5 plumbers" },
  { key: "confirm", label: "One confirms" },
] as const;
type StepKey = typeof STEPS[number]["key"];

export function Act2CallViz() {
  const isMobile = useIsMobile();
  const endpoints = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const stageRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

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
    const observers: IntersectionObserver[] = [];
    stepRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(i);
          });
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const activeKey: StepKey = STEPS[active].key;
  const showOrb = active >= 1;
  const showBranches = active >= 2;
  const isConfirmed = active >= 3;

  const cx = size.w / 2;
  const cy = size.h / 2;
  const branches = useMemo(
    () =>
      endpoints.map((endpoint, index) => {
        const ex = (endpoint.x / 100) * size.w;
        const ey = (endpoint.y / 100) * size.h;
        const mx =
          (cx + ex) / 2 +
          (index - (endpoints.length - 1) / 2) * (size.w * (isMobile ? 0.028 : 0.04));
        const my =
          (cy + ey) / 2 + (index % 2 === 0 ? -(isMobile ? 42 : 60) : isMobile ? 42 : 60);
        return {
          id: `branch-${index}`,
          d: `M ${cx} ${cy} Q ${mx} ${my}, ${ex} ${ey}`,
          endpoint,
          index,
        };
      }),
    [endpoints, cx, cy, size.w, isMobile]
  );

  return (
    <section className="relative">
      {/* Sticky stage — pinned for the whole sequence */}
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-linen), var(--color-sand) 55%, var(--color-morning))",
        }}
      >
        {/* Warm radial wash */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(194,91,63,0.10) 0%, rgba(194,91,63,0.05) 25%, rgba(246,241,235,0) 60%)",
          }}
        />

        {/* Step indicator (top) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none"
          style={{ top: "5.5%" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
              className="flex items-center justify-center gap-3 whitespace-nowrap"
            >
              <span
                className="label-mono inline-flex items-center justify-center rounded-full"
                style={{
                  width: 26,
                  height: 26,
                  background: "var(--color-terracotta)",
                  color: "var(--color-cream)",
                  fontSize: 11,
                }}
              >
                {active + 1}
              </span>
              <span
                className="label-mono"
                style={{
                  color: "var(--color-espresso)",
                  fontSize: "0.78rem",
                  letterSpacing: "0.22em",
                }}
              >
                {STEPS[active].label}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sarah's speech bubble */}
        <AnimatePresence>
          {active === 0 && (
            <motion.div
              key="ask"
              className="absolute left-1/2 px-6 w-full max-w-3xl z-20 pointer-events-none"
              style={{ top: isMobile ? "20%" : "22%", transform: "translateX(-50%)" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
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
          )}
        </AnimatePresence>

        {/* SVG network (lines + waves) */}
        {size.w > 0 && (
          <svg
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            className="absolute inset-0 pointer-events-none"
          >
            <defs>
              {branches.map((b) => (
                <path key={`def-${b.id}`} id={b.id} d={b.d} />
              ))}
            </defs>

            {showBranches &&
              branches.map((b) => (
                <BranchLine
                  key={`line-${b.id}`}
                  branch={b}
                  isConfirmed={isConfirmed}
                  activeIndex={active}
                />
              ))}

            {showBranches &&
              !isConfirmed &&
              branches.map((b) => (
                <TravelingWave key={`wave-${b.id}`} branch={b} />
              ))}

            {showBranches && isConfirmed && (
              <TravelingWave
                key="winner-wave"
                branch={branches[0]}
                winner
              />
            )}
          </svg>
        )}

        {/* Center Asmi orb */}
        <AnimatePresence>
          {showOrb && (
            <motion.div
              key="orb"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
              <div
                className="relative"
                style={{
                  width: isMobile ? 124 : 168,
                  height: isMobile ? 124 : 168,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "rgba(194,91,63,0.14)",
                    boxShadow: "0 0 110px rgba(194,91,63,0.28)",
                  }}
                />
                <div
                  className="absolute inset-[16%] rounded-full"
                  style={{ background: "rgba(194,91,63,0.26)" }}
                />
                <div
                  className="absolute inset-[31%] rounded-full"
                  style={{ background: "rgba(194,91,63,0.4)" }}
                />
                <motion.div
                  className="absolute inset-[39%] rounded-full"
                  style={{
                    background: "var(--color-terracotta)",
                    boxShadow: "0 0 50px rgba(194,91,63,0.45)",
                  }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <div
                  className="absolute left-1/2 -translate-x-1/2 label-mono"
                  style={{
                    bottom: -28,
                    color: "var(--color-terracotta)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Asmi
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Endpoint dots + labels */}
        <AnimatePresence>
          {showBranches &&
            endpoints.map((endpoint, index) => (
              <EndpointLabel
                key={endpoint.label}
                endpoint={endpoint}
                index={index}
                isConfirmed={isConfirmed}
                isMobile={isMobile}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Invisible step markers — drive the scene via IntersectionObserver */}
      <div className="relative" style={{ marginTop: "-100svh" }}>
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="h-[100svh] w-full pointer-events-none"
            aria-hidden
          />
        ))}
        {/* extra tail so the last step holds before release */}
        <div className="h-[60svh] w-full pointer-events-none" aria-hidden />
      </div>
    </section>
  );
}

function BranchLine({
  branch,
  isConfirmed,
  activeIndex,
}: {
  branch: { id: string; d: string; index: number };
  isConfirmed: boolean;
  activeIndex: number;
}) {
  const winner = branch.index === 0;
  // Stagger draw-in during "dial" step (active index 2)
  const delay = activeIndex === 2 ? branch.index * 0.18 : 0;
  const stroke = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.18)"
    : "var(--color-terracotta)";
  const targetOpacity = isConfirmed ? (winner ? 1 : 0.18) : winner ? 0.9 : 0.75;

  return (
    <motion.path
      d={branch.d}
      fill="none"
      stroke={stroke}
      strokeWidth={winner ? 2.6 : 1.6}
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: targetOpacity }}
      transition={{
        pathLength: { duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] },
        opacity: { duration: 0.5, delay, ease: "easeOut" },
        stroke: { duration: 0.4 },
      }}
    />
  );
}

function TravelingWave({
  branch,
  winner,
}: {
  branch: { id: string; index: number };
  winner?: boolean;
}) {
  const color = winner ? "var(--color-sage-strong)" : "var(--color-terracotta)";
  const dur = 2.6 + branch.index * 0.22;
  return (
    <g>
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
      <animateMotion
        dur={`${dur}s`}
        repeatCount="indefinite"
        rotate="0"
        keyPoints="0;1"
        keyTimes="0;1"
      >
        <mpath href={`#${branch.id}`} />
      </animateMotion>
    </g>
  );
}

function EndpointLabel({
  endpoint,
  index,
  isConfirmed,
  isMobile,
}: {
  endpoint: Endpoint;
  index: number;
  isConfirmed: boolean;
  isMobile: boolean;
}) {
  const winner = index === 0;
  const delay = 0.18 * index;
  const above = endpoint.y < 50;

  const dotColor = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.22)"
    : "var(--color-terracotta)";

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
          boxShadow:
            winner && isConfirmed ? "0 0 36px rgba(95,131,101,0.6)" : undefined,
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{
          opacity: isConfirmed && !winner ? 0.35 : 1,
          scale: winner && isConfirmed ? 1.5 : 1,
        }}
        transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
      />

      <motion.div
        className="absolute"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          transform: above
            ? "translate(-50%, calc(-100% - 18px))"
            : "translate(-50%, 18px)",
          maxWidth: "min(70vw, 280px)",
        }}
        initial={{ opacity: 0, y: above ? -6 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
      >
        <div className="text-center">
          {!(winner && isConfirmed) && (
            <span
              className="label-mono inline-block"
              style={{
                color: isConfirmed
                  ? "var(--color-stone-dim)"
                  : "var(--color-espresso)",
                whiteSpace: isMobile ? "normal" : "nowrap",
                lineHeight: 1.45,
                maxWidth: isMobile ? "8.5rem" : undefined,
                fontWeight: 500,
                transition: "color 0.4s ease",
              }}
            >
              {endpoint.label}
            </span>
          )}

          {winner && isConfirmed && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
            >
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
      </motion.div>
    </>
  );
}
