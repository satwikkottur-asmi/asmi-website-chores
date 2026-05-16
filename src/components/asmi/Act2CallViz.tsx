import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = { x: number; y: number; label: string };

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 20, y: 26, label: "Bay Dermatology" },
  { x: 82, y: 24, label: "SkinCare Clinic" },
  { x: 16, y: 72, label: "Pacific Derm" },
  { x: 84, y: 74, label: "City Skin Center" },
  { x: 50, y: 88, label: "Dr. Park's Office" },
];

const MOBILE_ENDPOINTS: Endpoint[] = [
  { x: 22, y: 26, label: "Bay Derm" },
  { x: 80, y: 30, label: "SkinCare" },
  { x: 50, y: 80, label: "Pacific Derm" },
];

export function Act2CallViz() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const ENDPOINTS = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Discrete phase state, driven by scroll position. Renders as plain SVG (no MotionValue->attr coercion).
  const [phase, setPhase] = useState<"intro" | "dialing" | "resolved" | "outro">("intro");
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p < 0.18) setPhase("intro");
    else if (p < 0.5) setPhase("dialing");
    else if (p < 0.82) setPhase("resolved");
    else setPhase("outro");
  });

  const captionOpacity = useTransform(scrollYProgress, [0.04, 0.12, 0.78, 0.86], [0, 1, 1, 0]);
  const speechOpacity = useTransform(scrollYProgress, [0.18, 0.26, 0.6, 0.7], [0, 1, 1, 0]);
  const vizOpacity = useTransform(scrollYProgress, [0.82, 0.92], [1, 0]);
  const closingOpacity = useTransform(scrollYProgress, [0.84, 0.94], [0, 1]);

  return (
    <section ref={ref} className="relative h-[300vh]" style={{ overflowX: "hidden" }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ maxWidth: "100vw" }}>
        {/* Caption */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-center z-20"
          style={{ top: "8%", opacity: captionOpacity }}
        >
          <p className="label-mono" style={{ color: "var(--color-stone)" }}>
            9:03 AM · Sarah's morning call
          </p>
        </motion.div>

        {/* Branches + endpoints (SVG, viewBox stretched to fill) */}
        <motion.svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: vizOpacity }}
        >
          {ENDPOINTS.map((e, i) => {
            const winner = i === 0;
            const drawn = phase !== "intro";
            const colorClass =
              phase === "intro" || phase === "dialing"
                ? "stroke-terracotta"
                : winner
                  ? "stroke-sage"
                  : "stroke-faded";
            const op =
              phase === "intro" ? 0
              : phase === "dialing" ? 0.85
              : winner ? 0.95 : 0.18;
            const mx = (50 + e.x) / 2 + (i - (ENDPOINTS.length - 1) / 2) * 5;
            const my = (50 + e.y) / 2 + (i % 2 === 0 ? -7 : 7);
            const d = `M 50 50 Q ${mx} ${my}, ${e.x} ${e.y}`;
            return (
              <path
                key={`b${i}`}
                d={d}
                fill="none"
                strokeWidth="0.35"
                strokeLinecap="round"
                className={`call-branch ${colorClass} ${drawn ? "is-drawn" : ""}`}
                style={{ opacity: op, transition: "opacity 0.6s ease, stroke 0.6s ease" }}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}

          {/* endpoint dots — drawn in DOM (below) to avoid SVG stretch */}

          {/* radial waveform around orb (decorative) */}
          <g style={{ opacity: phase === "dialing" || phase === "resolved" ? 0.3 : 0 }}>
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
          </g>
        </motion.svg>

        {/* Center orb — plain DOM so it always renders */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
          style={{ opacity: vizOpacity }}
        >
          <div className="relative" style={{ width: isMobile ? 96 : 140, height: isMobile ? 96 : 140 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: "#C25B3F", opacity: 0.16 }} />
            <div className="absolute inset-[18%] rounded-full" style={{ background: "#C25B3F", opacity: 0.32 }} />
            <motion.div
              className="absolute inset-[36%] rounded-full"
              style={{ background: "#C25B3F" }}
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Endpoint labels (DOM, positioned over SVG) */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: vizOpacity }}>
          {ENDPOINTS.map((e, i) => (
            <EndpointLabel key={i} endpoint={e} index={i} phase={phase} />
          ))}
        </motion.div>

        {/* Speech */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-center px-6 w-full max-w-md z-20"
          style={{ top: isMobile ? "12%" : "16%", opacity: speechOpacity, transform: "translate(-50%, 0)" }}
        >
          <p
            className="font-serif italic"
            style={{
              color: "#6B6560",
              fontSize: isMobile ? "1rem" : "clamp(1.125rem, 1.8vw, 1.6rem)",
              lineHeight: 1.35,
              marginTop: isMobile ? 28 : 36,
            }}
          >
            "I need to see a dermatologist. Can you find one that takes my insurance?"
          </p>
        </motion.div>

        {/* Closing beat */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6 z-30"
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

function EndpointLabel({
  endpoint, index, phase,
}: { endpoint: Endpoint; index: number; phase: "intro" | "dialing" | "resolved" | "outro" }) {
  const winner = index === 0;
  const visible = phase !== "intro";
  // After resolution: only winner shows result; others fade out fully.
  const resolved = phase === "resolved" || phase === "outro";
  const showResult = resolved && winner;
  const opacity = !visible ? 0 : resolved && !winner ? 0 : 1;

  // Push label vertically away from the orb so it doesn't overlap.
  const above = endpoint.y < 50;
  const offsetY = above ? "calc(-100% - 14px)" : "14px";

  return (
    <div
      className="absolute"
      style={{
        left: `${endpoint.x}%`,
        top: `${endpoint.y}%`,
        transform: `translate(-50%, ${offsetY})`,
        opacity,
        transition: "opacity 0.5s ease",
        maxWidth: "44vw",
      }}
    >
      <div className="whitespace-nowrap text-center">
        {showResult ? (
          <span
            className="label-mono px-2.5 py-1 rounded-md"
            style={{
              color: "var(--color-sage)",
              background: "rgba(139,168,136,0.10)",
              boxShadow: "0 0 24px rgba(139,168,136,0.25)",
            }}
          >
            Bay Dermatology · Dr. Chen · Tomorrow 10am ✓
          </span>
        ) : (
          <span className="label-mono" style={{ color: "#6B6560" }}>
            {endpoint.label}
          </span>
        )}
      </div>
    </div>
  );
}
