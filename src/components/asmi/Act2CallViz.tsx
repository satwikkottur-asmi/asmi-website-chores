import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Endpoint = {
  x: number;
  y: number;
  label: string;
  eta: string;
  winner?: boolean;
};

type Branch = {
  id: string;
  d: string;
  endpoint: Endpoint;
  index: number;
};

const DESKTOP_ENDPOINTS: Endpoint[] = [
  { x: 16, y: 28, label: "Bay Area Plumbing", eta: "No answer", winner: true },
  { x: 84, y: 26, label: "Rapid Rooter", eta: "Busy" },
  { x: 12, y: 70, label: "Pacific Plumbing Co", eta: "Tomorrow" },
  { x: 88, y: 70, label: "Mr. Fix-It", eta: "Next week" },
  { x: 50, y: 88, label: "Joe's Plumbing", eta: "Voicemail" },
];

const MOBILE_ENDPOINTS: Endpoint[] = [
  { x: 18, y: 20, label: "Bay Area Plumbing", eta: "No answer", winner: true },
  { x: 82, y: 20, label: "Rapid Rooter", eta: "Busy" },
  { x: 12, y: 52, label: "Pacific Plumbing Co", eta: "Tomorrow" },
  { x: 88, y: 54, label: "Mr. Fix-It", eta: "Next week" },
  { x: 50, y: 84, label: "Joe's Plumbing", eta: "Voicemail" },
];

const STORY_STEPS = [
  {
    eyebrow: "01",
    title: "Sarah asks",
    body: "Sink is leaking. Can you find a plumber today?",
  },
  {
    eyebrow: "02",
    title: "Asmi understands",
    body: "Urgent job. Same-day needed. Kitchen sink.",
  },
  {
    eyebrow: "03",
    title: "Asmi calls 5 plumbers",
    body: "Every outreach fans out at once, so Sarah is not chasing callbacks.",
  },
  {
    eyebrow: "04",
    title: "One confirms",
    body: "Mike can be there today at 2pm, so Sarah gets a real answer immediately.",
  },
] as const;

const STEP_DELAYS = [0, 1400, 3000, 5000];

export function Act2CallViz() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const endpoints = isMobile ? MOBILE_ENDPOINTS : DESKTOP_ENDPOINTS;
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [activeStep, setActiveStep] = useState(-1);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();

    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasStarted) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setActiveStep(3);
      return;
    }

    const timers = STEP_DELAYS.map((delay, index) =>
      window.setTimeout(() => setActiveStep(index), delay)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [hasStarted]);

  const cx = size.w / 2;
  const cy = size.h / 2;
  const branches: Branch[] = endpoints.map((endpoint, index) => {
    const ex = (endpoint.x / 100) * size.w;
    const ey = (endpoint.y / 100) * size.h;
    const mx =
      (cx + ex) / 2 +
      (index - (endpoints.length - 1) / 2) * (size.w * (isMobile ? 0.024 : 0.038));
    const my =
      (cy + ey) / 2 + (index % 2 === 0 ? -(isMobile ? 34 : 58) : isMobile ? 34 : 58);

    return {
      id: `branch-${index}`,
      d: `M ${cx} ${cy} Q ${mx} ${my}, ${ex} ${ey}`,
      endpoint,
      index,
    };
  });

  return (
    <section ref={sectionRef} className="relative py-20 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:px-10">
        <div className="grid gap-10 md:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] md:items-center">
          <div className="space-y-5 md:pr-8">
            {STORY_STEPS.map((step, index) => {
              const isActive = index <= activeStep;
              const isCurrent = index === activeStep;

              return (
                <motion.div
                  key={step.eyebrow}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0.36, x: isActive ? 0 : -10 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="border-b pb-5"
                  style={{ borderColor: "color-mix(in srgb, var(--color-espresso) 10%, transparent)" }}
                >
                  <div className="mb-2 flex items-center gap-3">
                    <span
                      className="label-mono inline-flex h-7 w-7 items-center justify-center rounded-full"
                      style={{
                        background: isActive ? "var(--color-terracotta)" : "color-mix(in srgb, var(--color-sand) 72%, white)",
                        color: isActive ? "var(--color-cream)" : "var(--color-stone)",
                      }}
                    >
                      {step.eyebrow}
                    </span>
                    <p
                      className="label-mono"
                      style={{ color: isCurrent ? "var(--color-terracotta)" : "var(--color-stone)" }}
                    >
                      {step.title}
                    </p>
                  </div>
                  <p
                    className="font-serif text-[1.15rem] leading-[1.35] md:text-[1.35rem]"
                    style={{ color: isActive ? "var(--color-espresso)" : "var(--color-stone)" }}
                  >
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <div
            ref={stageRef}
            className="relative min-h-[520px] overflow-hidden border px-4 py-6 md:min-h-[680px] md:px-6"
            style={{
              borderColor: "color-mix(in srgb, var(--color-terracotta) 12%, transparent)",
              background:
                "linear-gradient(135deg, var(--color-linen) 0%, var(--color-morning) 48%, var(--color-sand) 100%)",
            }}
          >
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--color-cream) 62%, transparent) 0%, transparent 36%, color-mix(in srgb, var(--color-terracotta) 6%, transparent) 100%)",
              }}
            />

            <motion.div
              initial={false}
              animate={{ opacity: activeStep >= 0 ? 1 : 0, y: activeStep >= 0 ? 0 : 12 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 top-[10%] z-20 w-full max-w-2xl -translate-x-1/2 px-4 text-center"
            >
              <p className="label-mono mb-3" style={{ color: "var(--color-terracotta)" }}>
                Sarah · 9:03 AM
              </p>
              <p
                className="font-serif italic"
                style={{
                  color: "var(--color-espresso)",
                  fontSize: isMobile ? "1.4rem" : "clamp(1.7rem, 2.4vw, 2.3rem)",
                  lineHeight: 1.28,
                }}
              >
                “Sink is leaking. Can you find a plumber today?”
              </p>
            </motion.div>

            {size.w > 0 && (
              <svg
                width={size.w}
                height={size.h}
                viewBox={`0 0 ${size.w} ${size.h}`}
                className="pointer-events-none absolute inset-0"
                aria-hidden="true"
              >
                {branches.map((branch) => {
                  const isVisible = activeStep >= 2;
                  const isWinner = branch.endpoint.winner;
                  const isConfirmed = activeStep >= 3;

                  return (
                    <motion.path
                      key={branch.id}
                      d={branch.d}
                      fill="none"
                      stroke={
                        isConfirmed
                          ? isWinner
                            ? "var(--color-sage-deep)"
                            : "color-mix(in srgb, var(--color-stone) 20%, transparent)"
                          : "var(--color-terracotta)"
                      }
                      strokeWidth={isWinner ? 2.5 : 1.5}
                      strokeLinecap="round"
                      initial={false}
                      animate={{
                        pathLength: isVisible ? 1 : 0,
                        opacity: isVisible ? (isConfirmed ? (isWinner ? 1 : 0.18) : 0.92) : 0,
                      }}
                      transition={{
                        duration: 0.9,
                        ease: "easeOut",
                        delay: isVisible ? branch.index * 0.18 : 0,
                      }}
                    />
                  );
                })}
              </svg>
            )}

            <motion.div
              initial={false}
              animate={{ opacity: activeStep >= 1 ? 1 : 0, scale: activeStep >= 1 ? 1 : 0.92 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative" style={{ width: isMobile ? 124 : 168, height: isMobile ? 124 : 168 }}>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.06, 1], opacity: [0.24, 0.4, 0.24] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "color-mix(in srgb, var(--color-terracotta) 18%, transparent)" }}
                />
                <div
                  className="absolute inset-[15%] rounded-full"
                  style={{ background: "color-mix(in srgb, var(--color-terracotta) 26%, transparent)" }}
                />
                <div
                  className="absolute inset-[30%] rounded-full"
                  style={{ background: "color-mix(in srgb, var(--color-terracotta) 44%, transparent)" }}
                />
                <div
                  className="absolute inset-[39%] rounded-full"
                  style={{
                    background: "var(--color-terracotta)",
                    boxShadow: "0 0 50px color-mix(in srgb, var(--color-terracotta) 48%, transparent)",
                  }}
                />
                <div
                  className="label-mono absolute left-1/2 -translate-x-1/2"
                  style={{ bottom: -28, color: "var(--color-terracotta)", whiteSpace: "nowrap" }}
                >
                  Asmi
                </div>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-20">
              {endpoints.map((endpoint, index) => {
                const winner = Boolean(endpoint.winner);
                const isVisible = activeStep >= 2;
                const isConfirmed = activeStep >= 3;
                const above = endpoint.y < 50;

                return (
                  <div key={endpoint.label}>
                    <motion.div
                      initial={false}
                      animate={{
                        opacity: isVisible ? 1 : 0,
                        scale: isConfirmed && winner ? 1.35 : 1,
                      }}
                      transition={{
                        duration: 0.45,
                        ease: "easeOut",
                        delay: isVisible ? index * 0.18 : 0,
                      }}
                      className="absolute rounded-full"
                      style={{
                        left: `${endpoint.x}%`,
                        top: `${endpoint.y}%`,
                        width: winner ? 14 : 10,
                        height: winner ? 14 : 10,
                        transform: "translate(-50%, -50%)",
                        background:
                          isConfirmed && winner
                            ? "var(--color-sage-deep)"
                            : isConfirmed
                              ? "color-mix(in srgb, var(--color-stone) 26%, transparent)"
                              : "var(--color-terracotta)",
                        boxShadow:
                          isConfirmed && winner
                            ? "0 0 34px color-mix(in srgb, var(--color-sage-deep) 54%, transparent)"
                            : "none",
                      }}
                    />

                    <div
                      className="absolute"
                      style={{
                        left: `${endpoint.x}%`,
                        top: `${endpoint.y}%`,
                        transform: above ? "translate(-50%, calc(-100% - 18px))" : "translate(-50%, 18px)",
                        maxWidth: isMobile ? "8.75rem" : "14rem",
                      }}
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          opacity: isVisible ? 1 : 0,
                          y: isVisible ? 0 : 10,
                        }}
                        transition={{ duration: 0.5, ease: "easeOut", delay: isVisible ? index * 0.18 : 0 }}
                        className="text-center"
                      >
                        <p
                          className="label-mono"
                          style={{
                            color:
                              isConfirmed && winner
                                ? "var(--color-sage-deep)"
                                : isConfirmed
                                  ? "var(--color-stone-dim)"
                                  : "var(--color-espresso)",
                            lineHeight: 1.45,
                            whiteSpace: isMobile ? "normal" : "nowrap",
                          }}
                        >
                          {endpoint.label}
                        </p>
                        <p
                          className="mt-1 text-[0.8rem] md:text-[0.85rem]"
                          style={{ color: "var(--color-stone)" }}
                        >
                          {endpoint.eta}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </div>

            <motion.div
              initial={false}
              animate={{ opacity: activeStep >= 3 ? 1 : 0, y: activeStep >= 3 ? 0 : 18 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="absolute bottom-8 left-1/2 z-30 w-full max-w-md -translate-x-1/2 px-4"
            >
              <div
                className="border px-5 py-4"
                style={{
                  borderColor: "color-mix(in srgb, var(--color-sage-deep) 20%, transparent)",
                  background: "color-mix(in srgb, var(--color-cream) 88%, white)",
                  boxShadow: "0 24px 60px -28px color-mix(in srgb, var(--color-sage-deep) 34%, transparent)",
                }}
              >
                <p className="label-mono mb-2" style={{ color: "var(--color-sage-deep)" }}>
                  Confirmed appointment
                </p>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-[1.3rem] leading-none md:text-[1.5rem]" style={{ color: "var(--color-espresso)" }}>
                      Mike · Today 2pm
                    </p>
                    <p className="mt-2 text-sm md:text-base" style={{ color: "var(--color-stone)" }}>
                      Sarah gets a real yes instead of five loose threads.
                    </p>
                  </div>
                  <span
                    className="label-mono inline-flex h-8 items-center justify-center px-3"
                    style={{ background: "var(--color-sage-deep)", color: "var(--color-cream)" }}
                  >
                    live
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
