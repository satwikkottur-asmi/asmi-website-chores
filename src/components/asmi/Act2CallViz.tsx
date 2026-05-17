import { AnimatePresence, motion } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

type Endpoint = {
  x: number;
  y: number;
  label: string;
  labelOffsetX: number;
  labelOffsetY: number;
  labelAlign: "left" | "center" | "right";
  maxWidth?: number;
};

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 16, y: 30, label: "Bay Area Plumbing", labelOffsetX: 16, labelOffsetY: -10, labelAlign: "left", maxWidth: 220 },
  { x: 84, y: 28, label: "Rapid Rooter", labelOffsetX: -16, labelOffsetY: -10, labelAlign: "right", maxWidth: 180 },
  { x: 12, y: 72, label: "Pacific Plumbing Co", labelOffsetX: 16, labelOffsetY: 8, labelAlign: "left", maxWidth: 220 },
  { x: 88, y: 74, label: "Mr. Fix-It", labelOffsetX: -16, labelOffsetY: 8, labelAlign: "right", maxWidth: 150 },
  { x: 50, y: 88, label: "Joe's Plumbing", labelOffsetX: 0, labelOffsetY: 14, labelAlign: "center", maxWidth: 170 },
];

// Winner is always index 0 (Bay Area Plumbing → "Mike")
const MOBILE_PLUMBERS = [
  { name: "Bay Area Plumbing", note: "Mike · Today 2pm" },
  { name: "Rapid Rooter", note: "no answer" },
  { name: "Pacific Plumbing Co", note: "voicemail" },
  { name: "Mr. Fix-It", note: "booked til Thu" },
  { name: "Joe's Plumbing", note: "no answer" },
];

const DESKTOP_STEPS = [
  { key: "ask", label: "Morning, 9:03." },
  { key: "listen", label: "Asmi picks it up." },
  { key: "dial", label: "Asmi works the phones." },
  { key: "confirm", label: "Done by 9:11." },
] as const;
const MOBILE_STEPS = [
  { key: "ask", label: "Morning, 9:03." },
  { key: "dial", label: "Asmi works the phones." },
  { key: "confirm", label: "Done by 9:11." },
] as const;
type StepKey = "ask" | "listen" | "dial" | "confirm";

export function Act2CallViz() {
  const isMobile = useIsMobile();
  const steps = isMobile ? MOBILE_STEPS : DESKTOP_STEPS;
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // GSAP ScrollTrigger pinning — deterministic across desktop & mobile
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const stepCount = steps.length;
    const pinViewports = isMobile ? 2 : stepCount;

    const ctx = gsap.context(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => "+=" + window.innerHeight * pinViewports,
        pin: pin,
        pinSpacing: true,
        scrub: isMobile ? 0.3 : 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          const idx = Math.min(
            stepCount - 1,
            Math.max(0, Math.round(p * (stepCount - 1) + 0.0001))
          );
          setActive((prev) => (prev === idx ? prev : idx));
          // Fade the entire pinned stage over the last 8% so it doesn't collide with Act 3
          const fade = p > 0.92 ? Math.max(0, 1 - (p - 0.92) / 0.08) : 1;
          pin.style.opacity = String(fade);
        },
      });

      return () => {
        trigger.kill();
      };
    }, section);

    return () => ctx.revert();
  }, [isMobile, steps.length]);

  const activeKey = (steps[active]?.key ?? "ask") as StepKey;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: `${(isMobile ? 2 : steps.length) * 100}svh` }}
    >
      <div
        ref={pinRef}
        className="relative h-[100svh] w-full overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--color-linen), var(--color-sand) 55%, var(--color-morning))",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at center, rgba(194,91,63,0.10) 0%, rgba(194,91,63,0.05) 25%, rgba(246,241,235,0) 60%)",
          }}
        />
        {isMobile ? (
          <MobileScene active={active} activeKey={activeKey} steps={steps} />
        ) : (
          <DesktopScene active={active} activeKey={activeKey} steps={steps} />
        )}
      </div>
    </section>
  );
}

// =============================================================
// Shared step header
// =============================================================

function StepHeader({
  active,
  steps,
  top,
}: {
  active: number;
  steps: ReadonlyArray<{ key: string; label: string }>;
  top: string;
}) {
  const step = steps[active] ?? steps[0];
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none w-full px-4"
      style={{ top }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step.key}
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
            className="font-serif italic"
            style={{
              color: "var(--color-espresso-strong)",
              fontSize: "clamp(1.05rem, 2.2vw, 1.4rem)",
              letterSpacing: "-0.01em",
            }}
          >
            {step.label}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// =============================================================
// MOBILE — vertical call-log layout, tap interactive
// =============================================================

function MobileScene({ active }: { active: number }) {
  const showOrb = active >= 1;
  const showList = active >= 2;
  const isConfirmed = active >= 3;

  return (
    <>
      <StepHeader active={active} top="5%" />

      {/* Sarah's ask */}
      <AnimatePresence>
        {active === 0 && (
          <motion.div
            key="ask"
            className="absolute left-0 right-0 z-20 pointer-events-none flex justify-center px-5"
            style={{ top: "18%" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="text-center w-full max-w-md">
              <p className="label-mono mb-3" style={{ color: "var(--color-terracotta-deep)" }}>
                Sarah · 9:03 AM
              </p>
              <p
                className="font-serif italic mx-auto"
                style={{
                  color: "var(--color-espresso-strong)",
                  fontSize: "1.55rem",
                  lineHeight: 1.22,
                  fontWeight: 400,
                  textWrap: "balance",
                  maxWidth: "20rem",
                }}
              >
                "Sink is leaking. Can you find a plumber today?"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Orb — top center for mobile, smaller */}
      <AnimatePresence>
        {showOrb && (
          <motion.div
            key="orb-m"
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ top: active === 1 ? "32%" : "16%" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{
              opacity: 1,
              scale: 1,
              top: active === 1 ? "32%" : "16%",
            }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <MobileOrb size={active === 1 ? 140 : 96} confirmed={isConfirmed} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call log */}
      <AnimatePresence>
        {showList && (
          <motion.div
            key="list"
            className="absolute left-0 right-0 z-20 px-5"
            style={{ top: "34%", bottom: "8%" }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="mx-auto w-full max-w-sm flex flex-col gap-2.5">
              {MOBILE_PLUMBERS.map((p, i) => (
                <PlumberRow
                  key={p.name}
                  index={i}
                  name={p.name}
                  note={p.note}
                  isConfirmed={isConfirmed}
                  active={active}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MobileOrb({ size, confirmed }: { size: number; confirmed: boolean }) {
  const [pulse, setPulse] = useState(false);
  return (
    <div
      className="relative"
      style={{ width: size, height: size, WebkitTapHighlightColor: "transparent" }}
      onClick={() => {
        setPulse(true);
        setTimeout(() => setPulse(false), 600);
      }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: confirmed ? "rgba(95,131,101,0.14)" : "rgba(194,91,63,0.14)",
          boxShadow: confirmed
            ? "0 0 110px rgba(95,131,101,0.32)"
            : "0 0 110px rgba(194,91,63,0.28)",
          transition: "background 0.6s ease, box-shadow 0.6s ease",
        }}
      />
      <div
        className="absolute inset-[16%] rounded-full"
        style={{
          background: confirmed ? "rgba(95,131,101,0.26)" : "rgba(194,91,63,0.26)",
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute inset-[31%] rounded-full"
        style={{
          background: confirmed ? "rgba(95,131,101,0.4)" : "rgba(194,91,63,0.4)",
          transition: "background 0.6s ease",
        }}
      />
      <motion.div
        className="absolute inset-[39%] rounded-full"
        style={{
          background: confirmed ? "var(--color-sage-strong)" : "var(--color-terracotta-deep)",
          boxShadow: confirmed
            ? "0 0 50px rgba(73,100,78,0.55)"
            : "0 0 50px rgba(162,72,48,0.5)",
          transition: "background 0.6s ease, box-shadow 0.6s ease",
        }}
        animate={{ scale: pulse ? [1, 1.25, 1] : [1, 1.08, 1] }}
        transition={{
          duration: pulse ? 0.6 : 2.8,
          repeat: pulse ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 label-mono"
        style={{
          bottom: -22,
          color: confirmed ? "var(--color-sage-strong)" : "var(--color-terracotta-deep)",
          whiteSpace: "nowrap",
          fontSize: "0.7rem",
          letterSpacing: "0.2em",
          transition: "color 0.6s ease",
        }}
      >
        Asmi
      </div>
    </div>
  );
}

function PlumberRow({
  index,
  name,
  note,
  isConfirmed,
  active,
}: {
  index: number;
  name: string;
  note: string;
  isConfirmed: boolean;
  active: number;
}) {
  const winner = index === 0;
  const [tapped, setTapped] = useState(false);
  // Stagger row reveal during the "dial" step
  const delay = active === 2 ? index * 0.14 : 0;

  // Color/state logic
  const dim = isConfirmed && !winner;
  const dotColor = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "var(--color-stone-dim)"
    : "var(--color-terracotta-deep)";

  return (
    <motion.button
      type="button"
      onClick={() => {
        setTapped(true);
        setTimeout(() => setTapped(false), 900);
      }}
      initial={{ opacity: 0, x: -16 }}
      animate={{
        opacity: dim ? 0.45 : 1,
        x: 0,
        filter: dim ? "saturate(0.4)" : "saturate(1)",
      }}
      transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
      whileTap={{ scale: 0.98 }}
      className="relative flex items-center gap-3 text-left rounded-2xl px-4 py-3 w-full"
      style={{
        background: winner && isConfirmed
          ? "rgba(95,131,101,0.12)"
          : "rgba(255,255,255,0.55)",
        border: winner && isConfirmed
          ? "1px solid rgba(95,131,101,0.4)"
          : "1px solid rgba(107,101,96,0.12)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: winner && isConfirmed
          ? "0 18px 40px -22px rgba(73,100,78,0.55)"
          : "0 4px 14px -8px rgba(76,53,38,0.18)",
        WebkitTapHighlightColor: "transparent",
        transition: "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
      }}
    >
      {/* Pulsing dot */}
      <span className="relative flex-shrink-0" style={{ width: 12, height: 12 }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: dotColor, transition: "background 0.5s ease" }}
          animate={
            !isConfirmed && active === 2
              ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: 1.2,
            repeat: !isConfirmed && active === 2 ? Infinity : 0,
            ease: "easeInOut",
            delay: index * 0.18,
          }}
        />
        {tapped && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${dotColor}` }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}
      </span>

      <span className="flex-1 min-w-0">
        <span
          className="block label-mono"
          style={{
            color: dim ? "var(--color-stone-dim)" : "var(--color-espresso-strong)",
            fontSize: "0.82rem",
            letterSpacing: "0.12em",
            fontWeight: 600,
            transition: "color 0.5s ease",
          }}
        >
          {name}
        </span>
        <span
          className="block font-sans"
          style={{
            color: winner && isConfirmed
              ? "var(--color-sage-strong)"
              : tapped
                ? "var(--color-terracotta-deep)"
                : "var(--color-stone-dim)",
            fontSize: "0.78rem",
            marginTop: 2,
            fontWeight: winner && isConfirmed ? 600 : 400,
            transition: "color 0.4s ease",
          }}
        >
          {tapped && !isConfirmed
            ? "ringing…"
            : isConfirmed
              ? winner
                ? `✓ ${note}`
                : note
              : "calling…"}
        </span>
      </span>

      {winner && isConfirmed && (
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
          className="flex-shrink-0 inline-flex items-center justify-center rounded-full"
          style={{
            width: 24,
            height: 24,
            background: "var(--color-sage-strong)",
            color: "var(--color-cream)",
            fontSize: 13,
          }}
          aria-hidden
        >
          ✓
        </motion.span>
      )}
    </motion.button>
  );
}

// =============================================================
// DESKTOP — radial fan (refined)
// =============================================================

function DesktopScene({ active }: { active: number }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const showOrb = active >= 1;
  const showBranches = active >= 2;
  const isConfirmed = active >= 3;

  const cx = size.w / 2;
  const cy = size.h / 2;
  const branches = useMemo(
    () =>
      DESKTOP_ENDPOINTS.map((endpoint, index) => {
        const ex = (endpoint.x / 100) * size.w;
        const ey = (endpoint.y / 100) * size.h;
        const mx =
          (cx + ex) / 2 +
          (index - (DESKTOP_ENDPOINTS.length - 1) / 2) * (size.w * 0.04);
        const my = (cy + ey) / 2 + (index % 2 === 0 ? -60 : 60);
        return {
          id: `branch-${index}`,
          d: `M ${cx} ${cy} Q ${mx} ${my}, ${ex} ${ey}`,
          endpoint,
          index,
        };
      }),
    [cx, cy, size.w]
  );

  return (
    <div ref={stageRef} className="absolute inset-0">
      <StepHeader active={active} top="5.5%" />

      <AnimatePresence>
        {active === 0 && (
          <motion.div
            key="ask"
            className="absolute left-0 right-0 z-20 pointer-events-none flex justify-center px-5"
            style={{ top: "22%" }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="text-center w-full max-w-3xl">
              <p className="label-mono mb-3" style={{ color: "var(--color-terracotta-deep)" }}>
                Sarah · 9:03 AM
              </p>
              <p
                className="font-serif italic mx-auto"
                style={{
                  color: "var(--color-espresso-strong)",
                  fontSize: "clamp(1.7rem, 2.4vw, 2.3rem)",
                  lineHeight: 1.28,
                  fontWeight: 400,
                  textWrap: "balance",
                }}
              >
                "Sink is leaking. Can you find a plumber today?"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <TravelingWave key="winner-wave" branch={branches[0]} winner />
          )}
        </svg>
      )}

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
            <div className="relative" style={{ width: 168, height: 168 }}>
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: isConfirmed ? "rgba(95,131,101,0.14)" : "rgba(194,91,63,0.14)",
                  boxShadow: isConfirmed
                    ? "0 0 110px rgba(95,131,101,0.32)"
                    : "0 0 110px rgba(194,91,63,0.28)",
                  transition: "background 0.6s ease, box-shadow 0.6s ease",
                }}
              />
              <div
                className="absolute inset-[16%] rounded-full"
                style={{
                  background: isConfirmed ? "rgba(95,131,101,0.26)" : "rgba(194,91,63,0.26)",
                  transition: "background 0.6s ease",
                }}
              />
              <div
                className="absolute inset-[31%] rounded-full"
                style={{
                  background: isConfirmed ? "rgba(95,131,101,0.4)" : "rgba(194,91,63,0.4)",
                  transition: "background 0.6s ease",
                }}
              />
              <motion.div
                className="absolute inset-[39%] rounded-full"
                style={{
                  background: isConfirmed
                    ? "var(--color-sage-strong)"
                    : "var(--color-terracotta-deep)",
                  boxShadow: isConfirmed
                    ? "0 0 50px rgba(73,100,78,0.55)"
                    : "0 0 50px rgba(162,72,48,0.5)",
                  transition: "background 0.6s ease, box-shadow 0.6s ease",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 label-mono"
                style={{
                  bottom: -28,
                  color: isConfirmed
                    ? "var(--color-sage-strong)"
                    : "var(--color-terracotta-deep)",
                  whiteSpace: "nowrap",
                  transition: "color 0.6s ease",
                }}
              >
                Asmi
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBranches &&
          DESKTOP_ENDPOINTS.map((endpoint, index) => (
            <EndpointLabel
              key={endpoint.label}
              endpoint={endpoint}
              index={index}
              isConfirmed={isConfirmed}
            />
          ))}
      </AnimatePresence>
    </div>
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
  const delay = activeIndex === 2 ? branch.index * 0.18 : 0;
  const stroke = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.3)"
    : "var(--color-terracotta-deep)";
  const targetOpacity = isConfirmed ? (winner ? 1 : 0.5) : winner ? 0.9 : 0.75;

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
  const color = winner ? "var(--color-sage-strong)" : "var(--color-terracotta-deep)";
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
}: {
  endpoint: Endpoint;
  index: number;
  isConfirmed: boolean;
}) {
  const winner = index === 0;
  const delay = 0.18 * index;
  const alignStyles = {
    left: { transform: "translate(0, 0)", textAlign: "left" as const },
    center: { transform: "translate(-50%, 0)", textAlign: "center" as const },
    right: { transform: "translate(-100%, 0)", textAlign: "right" as const },
  }[endpoint.labelAlign];

  const dotColor = isConfirmed
    ? winner
      ? "var(--color-sage-strong)"
      : "rgba(107, 101, 96, 0.45)"
    : "var(--color-terracotta-deep)";

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
          opacity: isConfirmed && !winner ? 0.55 : 1,
          scale: winner && isConfirmed ? 1.5 : 1,
          filter: isConfirmed && !winner ? "saturate(0.4)" : "saturate(1)",
        }}
        transition={{ duration: 0.5, delay, ease: [0.2, 0.7, 0.2, 1] }}
      />

      <motion.div
        className="absolute"
        style={{
          left: `calc(${endpoint.x}% + ${endpoint.labelOffsetX}px)`,
          top: `calc(${endpoint.y}% + ${endpoint.labelOffsetY}px)`,
          transform: alignStyles.transform,
          maxWidth: endpoint.maxWidth ? `${endpoint.maxWidth}px` : "12rem",
        }}
        initial={{ opacity: 0, y: endpoint.labelOffsetY < 0 ? -6 : 6 }}
        animate={{
          opacity: isConfirmed && !winner ? 0.5 : 1,
          y: 0,
          filter: isConfirmed && !winner ? "saturate(0.4)" : "saturate(1)",
        }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
      >
        <div style={{ textAlign: alignStyles.textAlign }}>
          {!(winner && isConfirmed) && (
            <span
              className="label-mono inline-block"
              style={{
                color: isConfirmed
                  ? "var(--color-stone-dim)"
                  : "var(--color-espresso-strong)",
                whiteSpace: "normal",
                lineHeight: 1.45,
                fontWeight: 600,
                fontSize: "0.72rem",
                letterSpacing: "0.16em",
                textWrap: "balance",
                textShadow: "0 1px 0 rgba(251,248,243,0.55)",
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
                  textAlign: "center",
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
