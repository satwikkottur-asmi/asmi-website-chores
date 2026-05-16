import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type Pill = { label: string; cat: "home" | "health" | "fin" | "travel" | "family"; size: "lg" | "md" | "sm" };

const CATS: Record<Pill["cat"], string> = {
  home: "#C25B3F",
  health: "#8BA888",
  fin: "#D4A574",
  travel: "#7EADC2",
  family: "#C9956F",
};

const PILLS: Pill[] = [
  { label: "Book dentist", cat: "health", size: "md" },
  { label: "Dispute charge", cat: "fin", size: "md" },
  { label: "Call plumber", cat: "home", size: "lg" },
  { label: "Check on Mom", cat: "family", size: "lg" },
  { label: "Cancel subscription", cat: "fin", size: "md" },
  { label: "Moving quotes", cat: "home", size: "md" },
  { label: "Refill prescription", cat: "health", size: "md" },
  { label: "Book salon", cat: "family", size: "sm" },
  { label: "Insurance claim", cat: "fin", size: "md" },
  { label: "Phone bill", cat: "fin", size: "sm" },
  { label: "Find electrician", cat: "home", size: "md" },
  { label: "Book movers", cat: "home", size: "md" },
  { label: "Car service", cat: "home", size: "sm" },
  { label: "Compare flights", cat: "travel", size: "lg" },
  { label: "Call landlord", cat: "home", size: "sm" },
  { label: "Reverse bank fee", cat: "fin", size: "md" },
  { label: "Schedule vet", cat: "family", size: "sm" },
  { label: "Parking ticket", cat: "fin", size: "sm" },
  { label: "Order supplies", cat: "home", size: "sm" },
  { label: "Restaurant reservation", cat: "travel", size: "md" },
  { label: "Courier documents", cat: "home", size: "sm" },
  { label: "Chase invoice", cat: "fin", size: "sm" },
  { label: "Book hotel", cat: "travel", size: "md" },
  { label: "Negotiate rate", cat: "fin", size: "md" },
  { label: "Renew passport", cat: "travel", size: "md" },
  { label: "School enrollment", cat: "family", size: "md" },
  { label: "AC repair", cat: "home", size: "sm" },
  { label: "Pharmacy", cat: "health", size: "sm" },
  { label: "Tailor appointment", cat: "family", size: "sm" },
  { label: "Grocery delivery", cat: "home", size: "sm" },
  { label: "Doctor follow-up", cat: "health", size: "sm" },
  { label: "Notary booking", cat: "fin", size: "sm" },
  { label: "Birthday flowers", cat: "family", size: "sm" },
  { label: "Tax help", cat: "fin", size: "md" },
  { label: "Travel insurance", cat: "travel", size: "sm" },
  { label: "Locksmith", cat: "home", size: "sm" },
  { label: "Therapy intake", cat: "health", size: "sm" },
  { label: "Internet outage", cat: "home", size: "sm" },
];

function positions(count: number) {
  const out: { x: number; y: number; delay: number; dur: number }[] = [];
  for (let i = 0; i < count; i++) {
    const a = Math.sin(i * 9.31) * 10000;
    const b = Math.cos(i * 4.27) * 10000;
    out.push({
      x: ((a - Math.floor(a)) * 92) + 4,
      y: ((b - Math.floor(b)) * 78) + 11,
      delay: ((i * 13) % 100) / 100,
      dur: 7 + ((i * 7) % 8),
    });
  }
  return out;
}

const POS = positions(PILLS.length);
// Mobile shows a curated subset to avoid visual overload
const MOBILE_PILLS = PILLS.slice(0, 24);

export function Act4Cloud() {
  const ref = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const cloudOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const cloudScale = useTransform(scrollYProgress, [0.1, 0.4], [0.92, 1]);

  return (
    <section ref={ref} className="relative py-24 md:py-32">
      <div className="text-center mb-12 md:mb-14 px-5 sm:px-6">
        <h2
          className="font-serif text-espresso"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2.2rem, 7vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          From plumbers to prescriptions.
        </h2>
        <p
          className="mt-3 md:mt-4 font-sans text-stone"
          style={{ color: "var(--color-stone)", fontSize: "clamp(0.95rem, 1.4vw, 1.2rem)" }}
        >
          Everything that needs a phone call.
        </p>
      </div>

      {isMobile ? (
        <motion.div
          className="px-4 mx-auto max-w-xl flex flex-wrap justify-center gap-2.5"
          style={{ opacity: cloudOpacity }}
        >
          {MOBILE_PILLS.map((p, i) => (
            <FlowingPill key={p.label} pill={p} delay={(i % 6) * 0.25} dur={6 + (i % 4)} />
          ))}
        </motion.div>
      ) : (
        <motion.div
          ref={containerRef}
          className="relative mx-auto"
          style={{
            opacity: cloudOpacity,
            scale: cloudScale,
            height: "min(78vh, 720px)",
            maxWidth: "1400px",
          }}
        >
          {PILLS.map((p, i) => (
            <FloatingPill key={p.label} pill={p} pos={POS[i]} containerRef={containerRef} />
          ))}
        </motion.div>
      )}
    </section>
  );
}

function FlowingPill({ pill, delay, dur }: { pill: Pill; delay: number; dur: number }) {
  const sizeClass =
    pill.size === "lg" ? "px-4 py-2.5 text-[0.9rem]"
    : pill.size === "md" ? "px-3.5 py-2 text-[0.82rem]"
    : "px-3 py-1.5 text-[0.76rem]";
  return (
    <motion.div
      animate={{ y: [0, -4, 0, 3, 0] }}
      transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full font-sans font-normal whitespace-nowrap ${sizeClass}`}
        style={{
          background: "rgba(251, 248, 243, 0.85)",
          color: "var(--color-stone)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(44,37,32,0.08)",
        }}
      >
        <span
          className="inline-block rounded-full"
          style={{ width: 6, height: 6, background: CATS[pill.cat] }}
        />
        {pill.label}
      </span>
    </motion.div>
  );
}

function FloatingPill({
  pill, pos, containerRef,
}: {
  pill: Pill;
  pos: { x: number; y: number; delay: number; dur: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      const radius = 130;
      if (d < radius && d > 0.1) {
        const force = (1 - d / radius) * 26;
        setOffset({ x: -(dx / d) * force, y: -(dy / d) * force });
      } else {
        setOffset({ x: 0, y: 0 });
      }
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  const sizeClass =
    pill.size === "lg" ? "px-5 py-3 text-[0.95rem]"
    : pill.size === "md" ? "px-4 py-2.5 text-[0.85rem]"
    : "px-3.5 py-2 text-[0.78rem]";

  return (
    <motion.div
      ref={ref}
      className="absolute select-none"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        x: offset.x,
        y: offset.y + Math.sin(pos.delay * 6) * 0,
      }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
    >
      <motion.div
        animate={{ y: [0, -8, 0, 6, 0] }}
        transition={{ duration: pos.dur, repeat: Infinity, ease: "easeInOut", delay: pos.delay }}
      >
        <button
          className={`group inline-flex items-center gap-2 rounded-full font-sans font-normal whitespace-nowrap transition-all duration-300 ${sizeClass}`}
          style={{
            background: "rgba(251, 248, 243, 0.85)",
            color: "var(--color-stone)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(44,37,32,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-terracotta)";
            e.currentTarget.style.color = "var(--color-espresso)";
            e.currentTarget.style.transform = "scale(1.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(44,37,32,0.06)";
            e.currentTarget.style.color = "var(--color-stone)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: 6, height: 6, background: CATS[pill.cat] }}
          />
          {pill.label}
        </button>
      </motion.div>
    </motion.div>
  );
}
