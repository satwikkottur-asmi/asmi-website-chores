import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function Moment({
  index, headline, subtext, ambient,
}: { index: number; headline: string; subtext: React.ReactNode; ambient: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0.02, 0.18, 0.68, 0.84], [0, 1, 1, 0]);
  const ambientOpacity = useTransform(scrollYProgress, [0.2, 0.32, 0.68, 0.84], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0.02, 0.28], [28, 0]);
  return (
    <div ref={ref} className="h-screen flex items-center justify-center relative overflow-hidden">
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: ambientOpacity }}
      >
        {ambient}
      </motion.div>
      <motion.div className="relative text-center px-5 sm:px-6 max-w-3xl w-full" style={{ opacity, y }}>
        <p className="label-mono mb-5 sm:mb-6" style={{ color: "var(--color-stone-dim)" }}>0{index}</p>
        <h2
          className="font-serif"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(1.75rem, 8vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          {headline}
        </h2>
        <div
          className="mt-5 sm:mt-6 font-sans"
          style={{ color: "#6B6560", fontSize: "clamp(1rem, 1.5vw, 1.3rem)" }}
        >
          {subtext}
        </div>
      </motion.div>
    </div>
  );
}

export function Act3ThreeMoments() {
  const isMobile = useIsMobile();
  if (isMobile) return <Act3Mobile />;
  return (
    <section className="relative">
      <Moment
        index={1}
        headline="Asmi calls you."
        subtext="Every morning. You just talk."
        ambient={<FullWaveform />}
      />
      <Moment
        index={2}
        headline="Asmi handles it."
        subtext="Calls. IVRs. Hold queues. Negotiation. In the real world."
        ambient={<FaintRadiating />}
      />
      <Moment
        index={3}
        headline="Done."
        subtext={<MessageBubble />}
        ambient={null}
      />
    </section>
  );
}

// =============================================================
// MOBILE — three auto-playing scenes, normal scroll
// =============================================================

function Act3Mobile() {
  return (
    <section className="relative">
      <MobileScene index={1}>
        <p
          className="label-mono mb-4"
          style={{ color: "var(--color-terracotta-deep)" }}
        >
          Sarah · 9:03 AM
        </p>
        <p
          className="font-serif italic mx-auto"
          style={{
            color: "var(--color-espresso-strong)",
            fontSize: "clamp(1.6rem, 7.5vw, 2.4rem)",
            lineHeight: 1.22,
            fontWeight: 400,
            textWrap: "balance",
            maxWidth: "22rem",
          }}
        >
          "Sink is leaking. Can you find a plumber today?"
        </p>
      </MobileScene>

      <MobileScene index={2}>
        <h2
          className="font-serif mb-8"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2rem, 8vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Asmi works the phones.
        </h2>
        <PlumberCallLoop />
      </MobileScene>

      <MobileScene index={3}>
        <h2
          className="font-serif mb-6"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2rem, 8vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          Done.
        </h2>
        <MessageBubble />
      </MobileScene>
    </section>
  );
}

function MobileScene({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <div className="min-h-[100svh] flex items-center justify-center relative px-5 py-16">
      <motion.div
        className="relative text-center w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <p
          className="label-mono mb-5"
          style={{ color: "var(--color-stone-dim)" }}
        >
          0{index}
        </p>
        {children}
      </motion.div>
    </div>
  );
}

// =============================================================
// PlumberCallLoop — auto-cycling call list (mobile Act 3 Step 2)
// =============================================================

type Phase = "idle" | "dialing" | "resolving" | "hold";

const PLUMBERS = [
  { name: "Bay Area Plumbing", resolvedNote: "Mike · Today 2pm", winner: true },
  { name: "Rapid Rooter", resolvedNote: "no answer", winner: false },
  { name: "Pacific Plumbing Co", resolvedNote: "voicemail", winner: false },
  { name: "Mr. Fix-It", resolvedNote: "booked til Thu", winner: false },
  { name: "Joe's Plumbing", resolvedNote: "no answer", winner: false },
];

function PlumberCallLoop() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const run = () => {
      if (cancelled) return;
      setPhase("dialing");
      timeouts.push(setTimeout(() => {
        if (cancelled) return;
        setPhase("resolving");
        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          setPhase("hold");
          timeouts.push(setTimeout(() => {
            if (cancelled) return;
            setPhase("idle");
            timeouts.push(setTimeout(run, 700));
          }, 2000));
        }, 1800));
      }, 2200));
    };

    timeouts.push(setTimeout(run, 400));

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [inView]);

  const resolved = phase === "resolving" || phase === "hold";

  return (
    <div ref={ref} className="mx-auto w-full max-w-sm flex flex-col gap-2.5">
      {PLUMBERS.map((p, i) => (
        <LoopPlumberRow
          key={p.name}
          plumber={p}
          index={i}
          phase={phase}
          resolved={resolved}
        />
      ))}
    </div>
  );
}

function LoopPlumberRow({
  plumber,
  index,
  phase,
  resolved,
}: {
  plumber: typeof PLUMBERS[number];
  index: number;
  phase: Phase;
  resolved: boolean;
}) {
  const { name, resolvedNote, winner } = plumber;
  const dialing = phase === "dialing";
  const dim = resolved && !winner;

  const dotColor = resolved
    ? winner
      ? "var(--color-sage-strong)"
      : "var(--color-stone-dim)"
    : phase === "idle"
      ? "var(--color-stone-dim)"
      : "var(--color-terracotta-deep)";

  const subtext =
    phase === "idle"
      ? "—"
      : dialing
        ? "calling…"
        : winner
          ? `✓ ${resolvedNote}`
          : resolvedNote;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      animate={{
        opacity: dim ? 0.45 : 1,
        filter: dim ? "saturate(0.4)" : "saturate(1)",
      }}
      className="relative flex items-center gap-3 text-left rounded-2xl px-4 py-3 w-full"
      style={{
        background: winner && resolved
          ? "rgba(95,131,101,0.12)"
          : "rgba(255,255,255,0.55)",
        border: winner && resolved
          ? "1px solid rgba(95,131,101,0.4)"
          : "1px solid rgba(107,101,96,0.12)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: winner && resolved
          ? "0 18px 40px -22px rgba(73,100,78,0.55)"
          : "0 4px 14px -8px rgba(76,53,38,0.18)",
        transition: "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, opacity 0.5s ease, filter 0.5s ease",
      }}
    >
      <span className="relative flex-shrink-0" style={{ width: 12, height: 12 }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: dotColor, transition: "background 0.5s ease" }}
          animate={
            dialing
              ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] }
              : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: 1.2,
            repeat: dialing ? Infinity : 0,
            ease: "easeInOut",
            delay: index * 0.18,
          }}
        />
      </span>

      <span className="flex-1 min-w-0 text-left">
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
        <AnimatePresence mode="wait">
          <motion.span
            key={subtext}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="block font-sans"
            style={{
              color: winner && resolved
                ? "var(--color-sage-strong)"
                : "var(--color-stone-dim)",
              fontSize: "0.78rem",
              marginTop: 2,
              fontWeight: winner && resolved ? 600 : 400,
            }}
          >
            {subtext}
          </motion.span>
        </AnimatePresence>
      </span>

      {winner && resolved && (
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
    </motion.div>
  );
}

function FullWaveform() {
  return (
    <svg viewBox="0 0 1200 200" className="w-full" preserveAspectRatio="none" style={{ height: "55vh", opacity: 0.03 }}>
      <motion.path
        d="M0 100 Q75 30 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100"
        fill="none" stroke="#C25B3F" strokeWidth="3" strokeLinecap="round"
        animate={{ d: [
          "M0 100 Q75 30 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100",
          "M0 100 Q75 170 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100",
          "M0 100 Q75 30 150 100 T300 100 T450 100 T600 100 T750 100 T900 100 T1050 100 T1200 100",
        ] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function FaintRadiating() {
  const lines = Array.from({ length: 12 });
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.02 }}>
      {lines.map((_, i) => {
        const angle = (i / lines.length) * Math.PI * 2;
        const x = 50 + Math.cos(angle) * 60;
        const y = 50 + Math.sin(angle) * 60;
        const mx = 50 + Math.cos(angle) * 30 + (i % 2 ? 10 : -10);
        const my = 50 + Math.sin(angle) * 30 + (i % 2 ? -10 : 10);
        return <path key={i} d={`M50 50 Q ${mx} ${my}, ${x} ${y}`} stroke="#C25B3F" strokeWidth="0.4" fill="none" />;
      })}
    </svg>
  );
}

function MessageBubble() {
  return (
    <motion.div
      className="mt-8 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <div
        className="inline-flex items-center gap-2 px-7 py-5 rounded-3xl rounded-bl-md font-sans"
        style={{
          background: "var(--color-sage)",
          color: "var(--color-espresso)",
          boxShadow: "0 8px 32px rgba(44,37,32,0.08), 0 12px 40px -16px rgba(139, 168, 136, 0.6)",
          fontSize: "1.15rem",
          fontWeight: 500,
          maxWidth: "85vw",
          minWidth: "min(360px, 85vw)",
          justifyContent: "center",
        }}
      >
        <span style={{ whiteSpace: "normal", lineHeight: 1.4 }}>✓ Bay Area Plumbing · Mike · Today 2pm</span>
      </div>
      <span className="mt-2 font-sans" style={{ fontSize: 11, color: "var(--color-stone-dim)" }}>
        Booked
      </span>
    </motion.div>
  );
}
