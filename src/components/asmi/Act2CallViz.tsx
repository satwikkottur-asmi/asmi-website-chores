import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = { x: number; y: number; label: string };

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 18, y: 28, label: "Bay Area Plumbing" },
  { x: 82, y: 26, label: "Rapid Rooter" },
  { x: 14, y: 72, label: "Pacific Plumbing Co" },
  { x: 86, y: 74, label: "Mr. Fix-It" },
  { x: 50, y: 88, label: "Joe's Plumbing" },
];

const MOBILE_ENDPOINTS: Endpoint[] = [
  { x: 20, y: 28, label: "Bay Area" },
  { x: 80, y: 30, label: "Rapid Rooter" },
  { x: 50, y: 82, label: "Mr. Fix-It" },
];

export function Act2CallViz() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const ENDPOINTS = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const [phase, setPhase] = useState<"intro" | "dialing" | "resolved" | "outro">("intro");
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    if (p < 0.16) setPhase("intro");
    else if (p < 0.5) setPhase("dialing");
    else if (p < 0.82) setPhase("resolved");
    else setPhase("outro");
  });

  // Measure stage so curves & waveforms share pixel-space geometry.
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

  const captionOpacity = useTransform(scrollYProgress, [0.02, 0.1, 0.78, 0.86], [0, 1, 1, 0]);
  const speechOpacity = useTransform(scrollYProgress, [0.14, 0.22, 0.6, 0.7], [0, 1, 1, 0]);
  const vizOpacity = useTransform(scrollYProgress, [0.82, 0.92], [1, 0]);
  const closingOpacity = useTransform(scrollYProgress, [0.84, 0.94], [0, 1]);

  // Build paths in pixel space.
  const cx = size.w / 2;
  const cy = size.h / 2;
  const branches = ENDPOINTS.map((e, i) => {
    const ex = (e.x / 100) * size.w;
    const ey = (e.y / 100) * size.h;
    const mx = (cx + ex) / 2 + (i - (ENDPOINTS.length - 1) / 2) * (size.w * 0.04);
    const my = (cy + ey) / 2 + (i % 2 === 0 ? -60 : 60);
    return { id: `branch-${i}`, d: `M ${cx} ${cy} Q ${mx} ${my}, ${ex} ${ey}`, endpoint: e, index: i };
  });

  return (
    <section ref={ref} className="relative h-[260vh]" style={{ overflowX: "hidden" }}>
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden" style={{ maxWidth: "100vw" }}>
        {/* Caption */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 text-center z-20"
          style={{ top: "8%", opacity: captionOpacity, transform: "translateX(-50%)" }}
        >
          <p className="label-mono" style={{ color: "var(--color-stone)" }}>
            9:03 AM · Sarah's morning call
          </p>
        </motion.div>

        {/* Speech */}
        <motion.div
          className="absolute left-1/2 text-center px-6 w-full max-w-md z-20"
          style={{ top: isMobile ? "13%" : "16%", opacity: speechOpacity, transform: "translateX(-50%)" }}
        >
          <p
            className="font-serif italic"
            style={{
              color: "#6B6560",
              fontSize: isMobile ? "1rem" : "clamp(1.125rem, 1.8vw, 1.6rem)",
              lineHeight: 1.35,
            }}
          >
            "Sink is leaking. Can you find a plumber today?"
          </p>
        </motion.div>

        {/* SVG: branches + traveling waveforms (pixel-space, uniform) */}
        {size.w > 0 && (
          <motion.svg
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: vizOpacity }}
          >
            <defs>
              {branches.map((b) => (
                <path key={`def-${b.id}`} id={b.id} d={b.d} />
              ))}
            </defs>

            {/* branch lines */}
            {branches.map((b) => {
              const winner = b.index === 0;
              const drawn = phase !== "intro";
              const stroke =
                phase === "intro" || phase === "dialing"
                  ? "#C25B3F"
                  : winner ? "#8BA888" : "#C9C2B6";
              const op =
                phase === "intro" ? 0
                  : phase === "dialing" ? 0.85
                    : winner ? 0.95 : 0.18;
              return (
                <path
                  key={`line-${b.id}`}
                  d={b.d}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  className={`call-branch ${drawn ? "is-drawn" : ""}`}
                  style={{ opacity: op, transition: "opacity 0.6s ease, stroke 0.5s ease" }}
                />
              );
            })}

            {/* Traveling waveforms along each path */}
            {phase !== "intro" && branches.map((b) => {
              const winner = b.index === 0;
              const dismissed = (phase === "resolved" || phase === "outro") && !winner;
              const color = (phase === "resolved" || phase === "outro") && winner ? "#8BA888" : "#C25B3F";
              const dur = 2.2 + b.index * 0.18;
              return (
                <g
                  key={`wave-${b.id}`}
                  style={{
                    opacity: dismissed ? 0 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <g transform="translate(-7,-6)">
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
                          transformOrigin: `${bar * 5 + 1}px 6px`,
                          animation: `wave-bar 0.7s ease-in-out infinite`,
                          animationDelay: `${bar * 0.12}s`,
                          transition: "fill 0.4s ease",
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
                    <mpath href={`#${b.id}`} />
                  </animateMotion>
                </g>
              );
            })}

            {/* Radial waveform around orb */}
            {(phase === "dialing" || phase === "resolved") && (
              <g style={{ opacity: 0.35 }}>
                {Array.from({ length: 20 }).map((_, i) => {
                  const angle = (i / 20) * Math.PI * 2;
                  const inner = isMobile ? 56 : 80;
                  const baseLen = 8 + ((i * 7) % 5) * 2;
                  const x1 = cx + Math.cos(angle) * inner;
                  const y1 = cy + Math.sin(angle) * inner;
                  const x2a = cx + Math.cos(angle) * (inner + baseLen);
                  const y2a = cy + Math.sin(angle) * (inner + baseLen);
                  const x2b = cx + Math.cos(angle) * (inner + baseLen * 2.4);
                  const y2b = cy + Math.sin(angle) * (inner + baseLen * 2.4);
                  return (
                    <motion.line
                      key={i}
                      x1={x1} y1={y1}
                      stroke="#C25B3F"
                      strokeWidth={2}
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
            )}
          </motion.svg>
        )}

        {/* Center orb */}
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

        {/* Endpoint labels */}
        <motion.div className="absolute inset-0 pointer-events-none" style={{ opacity: vizOpacity }}>
          {ENDPOINTS.map((e, i) => (
            <EndpointLabel key={i} endpoint={e} index={i} phase={phase} />
          ))}
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
  const resolved = phase === "resolved" || phase === "outro";
  const showResult = resolved && winner;
  const labelOpacity = !visible ? 0 : resolved && !winner ? 0 : 1;
  const dotOpacity = !visible ? 0 : winner || phase === "dialing" ? 1 : 0.3;
  const dotColor = resolved ? (winner ? "#8BA888" : "#C9C2B6") : "#C25B3F";
  const above = endpoint.y < 50;

  return (
    <>
      <div
        className="absolute rounded-full"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          width: 10,
          height: 10,
          background: dotColor,
          transform: "translate(-50%, -50%)",
          opacity: dotOpacity,
          transition: "opacity 0.5s ease, background 0.5s ease",
          boxShadow: winner && resolved ? "0 0 24px rgba(139,168,136,0.6)" : undefined,
        }}
      />
      <div
        className="absolute"
        style={{
          left: `${endpoint.x}%`,
          top: `${endpoint.y}%`,
          transform: above
            ? "translate(-50%, calc(-100% - 14px))"
            : "translate(-50%, 14px)",
          opacity: labelOpacity,
          transition: "opacity 0.3s ease",
          maxWidth: "min(86vw, 360px)",
        }}
      >
        <div className="text-center">
          {showResult ? (
            <span
              className="label-mono inline-block px-3 py-1.5 rounded-md"
              style={{
                color: "var(--color-sage)",
                background: "rgba(139,168,136,0.10)",
                boxShadow: "0 0 24px rgba(139,168,136,0.3)",
                whiteSpace: "normal",
                lineHeight: 1.4,
              }}
            >
              ✓ Bay Area Plumbing · Mike · Today 2pm
            </span>
          ) : (
            <span className="label-mono whitespace-nowrap" style={{ color: "#6B6560" }}>
              {endpoint.label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
