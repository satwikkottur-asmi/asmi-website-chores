import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { OrganicDivider } from "./Atmosphere";

const STORIES = [
  {
    meta: "HEALTHCARE · TUE 7:14 AM",
    duration: "0:47",
    outcome: "dr chen, derm. tomorrow 10am. insurance pre-auth'd.",
    accent: "var(--color-terracotta)",
    seed: 17,
  },
  {
    meta: "HOME REPAIR · WED 6:48 AM",
    duration: "1:12",
    outcome: "five hvac quotes. saturday 9am. $150 diagnostic.",
    accent: "var(--color-sage-strong)",
    seed: 41,
  },
  {
    meta: "FAMILY CARE · DAILY · IT-IT",
    duration: "3:20",
    outcome: "mom in rome. twice a day. three years. never missed.",
    accent: "var(--color-clay)",
    seed: 73,
  },
];

const LANGUAGES = [
  { name: "English", size: "xl" }, { name: "Español", size: "lg" }, { name: "Français", size: "lg" },
  { name: "हिन्दी", size: "xl" }, { name: "中文", size: "lg" }, { name: "Italiano", size: "md" },
  { name: "Deutsch", size: "md" }, { name: "العربية", size: "lg" }, { name: "Português", size: "md" },
  { name: "日本語", size: "lg" }, { name: "한국어", size: "md" }, { name: "Русский", size: "md" },
  { name: "Türkçe", size: "sm" }, { name: "Tiếng Việt", size: "sm" }, { name: "ภาษาไทย", size: "sm" },
  { name: "தமிழ்", size: "md" }, { name: "বাংলা", size: "md" }, { name: "Nederlands", size: "sm" },
  { name: "Polski", size: "sm" }, { name: "Svenska", size: "sm" }, { name: "Suomi", size: "sm" },
  { name: "Norsk", size: "sm" }, { name: "Українська", size: "sm" }, { name: "ελληνικά", size: "sm" },
  { name: "עברית", size: "md" }, { name: "Filipino", size: "sm" }, { name: "Bahasa", size: "sm" },
  { name: "Magyar", size: "sm" }, { name: "Čeština", size: "sm" }, { name: "Română", size: "sm" },
  { name: "Dansk", size: "sm" }, { name: "Català", size: "sm" }, { name: "Punjabi", size: "md" },
];


// Precompute per-ring positions so each label gets a unique slot on its ring.
const RING_OF: Record<string, number> = { xl: 0, lg: 1, md: 2, sm: 3 };
const RING_R = [12, 26, 38, 48]; // % radius
const RING_OFFSET = [0, 0.17, 0.41, 0.06];
const RING_ASPECT = 1.65; // ellipse stretch

const RING_COUNTS = LANGUAGES.reduce<Record<number, number>>((acc, l) => {
  const r = RING_OF[l.size] ?? 3;
  acc[r] = (acc[r] || 0) + 1;
  return acc;
}, {});
const RING_INDEX: number[] = [];
{
  const seen: Record<number, number> = {};
  LANGUAGES.forEach((l) => {
    const r = RING_OF[l.size] ?? 3;
    RING_INDEX.push(seen[r] || 0);
    seen[r] = (seen[r] || 0) + 1;
  });
}

function langPos(i: number, total: number, size: string) {
  const ring = RING_OF[size] ?? 3;
  const slot = RING_INDEX[i];
  const count = RING_COUNTS[ring] || 1;
  const angle = (slot / count) * Math.PI * 2 + RING_OFFSET[ring] * Math.PI * 2;
  const r = RING_R[ring];
  const x = 50 + Math.cos(angle) * r * RING_ASPECT * 0.55;
  const y = 50 + Math.sin(angle) * r;
  return {
    x: Math.min(94, Math.max(6, x)),
    y: Math.min(92, Math.max(8, y)),
    delay: (i / total) * 4,
    dur: 8 + (i % 6),
  };
}

export function Act5() {
  return (
    <section id="stories" className="relative">
      <OrganicDivider />

      {/* 5A Stories — voicemail waveforms */}
      <div className="px-5 sm:px-8 py-20 md:py-32 max-w-5xl mx-auto">
        <motion.p
          className="label-mono mb-5"
          style={{ color: "var(--color-stone-dim)" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          Recent
        </motion.p>
        <motion.h2
          className="font-serif mb-20 md:mb-28"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2.8rem, 9vw, 5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          This happened this week.
        </motion.h2>

        <div className="flex flex-col gap-16 md:gap-24">
          {STORIES.map((s, i) => (
            <VoicemailRow key={i} story={s} index={i} />
          ))}
        </div>
      </div>

      <OrganicDivider />

      {/* 5B Available everywhere */}
      <div className="px-5 sm:px-6 py-20 md:py-32 max-w-6xl mx-auto">
        <motion.h2
          className="font-serif mb-16 md:mb-20 text-center"
          style={{ color: "var(--color-espresso)", fontSize: "clamp(2.8rem, 9vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          No app. No new habit.
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-12 md:gap-8">
          <Channel word="Call" caption="Every morning. Asmi calls you." ambient={<MiniWave />} />
          <Channel word="Text" caption="iMessage mid-day. Same context." ambient={<TypingDots />} />
          <Channel word="Listen" caption="Call Asmi directly. Always on." ambient={<Ripples />} />
        </div>

        <p
          className="mt-16 md:mt-20 font-sans text-center"
          style={{ color: "var(--color-espresso)", fontSize: 16, fontWeight: 400 }}
        >
          Same intelligence. Every surface. No app.
        </p>
      </div>

      <OrganicDivider />

      {/* 5C Languages */}
      <div id="languages" className="px-5 sm:px-6 py-20 md:py-32">
        <div className="text-center mb-12">
          <motion.h2
            className="font-serif"
            style={{ color: "var(--color-espresso)", fontSize: "clamp(2.8rem, 9vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            50+ languages. <em className="italic">Your accent. Your way.</em>
          </motion.h2>
        </div>

        {/* Mobile: scattered floating cloud with tap-to-light interaction */}
        <MobileLanguageCloud />


        {/* Desktop: scattered floating cloud */}
        <div className="hidden md:block relative mx-auto max-w-6xl" style={{ height: "min(70vh, 600px)" }}>
          {LANGUAGES.map((l, i) => {
            const p = langPos(i, LANGUAGES.length, l.size);
            const sizeMap = { sm: "1rem", md: "1.4rem", lg: "2.1rem", xl: "3.2rem" } as Record<string, string>;
            const colorMap = { sm: "#8A8278", md: "#6B6560", lg: "var(--color-espresso)", xl: "var(--color-espresso)" } as Record<string, string>;
            return (
              <motion.span
                key={l.name}
                className="absolute font-serif cursor-default transition-colors duration-300"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: sizeMap[l.size],
                  color: colorMap[l.size],
                  opacity: l.size === "sm" ? 0.7 : l.size === "md" ? 0.88 : 1,
                }}
                animate={{ y: [0, -10, 0, 8, 0] }}
                transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
                whileHover={{ color: "var(--color-terracotta)", scale: 1.1, opacity: 1, transition: { duration: 0.2 } }}
              >
                {l.name}
              </motion.span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MobileLanguageCloud() {
  const [tapped, setTapped] = useState<Set<number>>(new Set());
  const [autoLit, setAutoLit] = useState<number>(-1);
  const lastTapRef = useRef<number>(0);

  // Auto-cycle a highlighted word so the cloud feels alive without input.
  // Pause auto-cycle for 4s after a tap so user intent is respected.
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() - lastTapRef.current < 4000) return;
      setAutoLit(Math.floor(Math.random() * LANGUAGES.length));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const sizeMap = { sm: "0.95rem", md: "1.2rem", lg: "1.65rem", xl: "2.25rem" } as Record<string, string>;
  const colorMap = {
    sm: "#9A9288",
    md: "#6B6560",
    lg: "var(--color-espresso)",
    xl: "var(--color-espresso)",
  } as Record<string, string>;

  // Deterministic pseudo-random helpers (stable across renders)
  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  return (
    <div className="md:hidden relative mx-auto w-full max-w-md px-3" style={{ minHeight: 460 }}>
      <div
        className="flex flex-wrap items-center justify-center"
        style={{ rowGap: "0.55rem", columnGap: "0.85rem" }}
      >
        {LANGUAGES.map((l, i) => {
          const isLit = tapped.has(i) || autoLit === i;
          const rotate = (rand(i + 1) - 0.5) * 14; // -7deg..7deg
          const yOffset = (rand(i + 7) - 0.5) * 14; // visual scatter
          const dur = 5 + rand(i + 3) * 4;
          const delay = rand(i + 11) * 3;

          return (
            <motion.span
              key={l.name}
              role="button"
              tabIndex={0}
              onClick={() => {
                lastTapRef.current = Date.now();
                setTapped((prev) => {
                  const next = new Set(prev);
                  next.has(i) ? next.delete(i) : next.add(i);
                  return next;
                });
              }}
              className="font-serif inline-block select-none"
              style={{
                fontSize: sizeMap[l.size],
                color: isLit ? "var(--color-terracotta)" : colorMap[l.size],
                opacity: isLit ? 1 : l.size === "sm" ? 0.7 : l.size === "md" ? 0.88 : 1,
                lineHeight: 1.1,
                whiteSpace: "nowrap",
                transform: `translateY(${yOffset}px) rotate(${rotate}deg)`,
                transition: "color 0.4s ease, opacity 0.4s ease",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
              animate={{ y: [0, -4, 0, 3, 0], scale: isLit ? 1.15 : 1 }}
              transition={{
                y: { duration: dur, repeat: Infinity, ease: "easeInOut", delay },
                scale: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] },
              }}
              whileTap={{ scale: 1.25 }}
            >
              {l.name}
            </motion.span>
          );
        })}
      </div>
      <p
        className="text-center mt-6 label-mono"
        style={{ color: "var(--color-stone-dim)", fontSize: "0.65rem" }}
      >
        tap any language
      </p>
    </div>
  );
}

function Channel({ word, caption, ambient }: { word: string; caption: string; ambient: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
    >
      <p
        className="font-serif"
        style={{ color: "var(--color-espresso)", fontSize: "clamp(38px, 9vw, 48px)", lineHeight: 1, letterSpacing: "-0.02em" }}
      >
        {word}
      </p>
      <div className="mt-5 h-7 flex items-center">{ambient}</div>
      <p className="mt-5 font-sans" style={{ color: "#6B6560", fontSize: "clamp(15px, 4vw, 16px)", lineHeight: 1.55, maxWidth: 280 }}>
        {caption}
      </p>
    </motion.div>
  );
}

function MiniWave() {
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 24 }}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          style={{
            width: 3,
            background: "var(--color-terracotta)",
            display: "block",
            height: 24,
            transformOrigin: "center",
            animation: `wave-bar 1s ease-in-out ${i * 0.13}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-end gap-1.5 h-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{
            width: 8, height: 8,
            background: "#6B6560",
            animation: `typing-dot 1.4s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Ripples() {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute rounded-full border"
          style={{
            width: 36, height: 36,
            borderColor: "var(--color-terracotta)",
            opacity: 0.15,
            animation: `ripple 3s ease-out ${i}s infinite`,
          }}
        />
      ))}
      <span className="block rounded-full" style={{ width: 8, height: 8, background: "var(--color-terracotta)" }} />
    </div>
  );
}

// =============================================================
// Voicemail waveform row (Act 5A)
// =============================================================

type Story = {
  meta: string;
  duration: string;
  outcome: string;
  accent: string;
  seed: number;
};

// Seeded pseudo-random for stable, "real-looking" waveforms across renders
function seededRand(seed: number, i: number) {
  const x = Math.sin(seed * 9301 + i * 49297) * 233280;
  return x - Math.floor(x);
}

function VoicemailRow({ story, index }: { story: Story; index: number }) {
  const BARS = 96;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1 playhead
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  // Parse duration "m:ss" → seconds for the visual playback timer
  const totalSec = (() => {
    const [m, s] = story.duration.split(":").map(Number);
    return (m || 0) * 60 + (s || 0);
  })();

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    startRef.current = performance.now() - progress * totalSec * 1000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - startRef.current) / (totalSec * 1000));
      setProgress(p);
      if (p >= 1) {
        setPlaying(false);
        setProgress(0);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, totalSec]);

  // Build bar heights once (seeded), 0.18..1.0
  const heights = Array.from({ length: BARS }, (_, i) => {
    const r1 = seededRand(story.seed, i);
    const r2 = seededRand(story.seed + 1, i * 3);
    // Slight envelope so it looks like speech, not noise
    const env = 0.65 + 0.35 * Math.sin((i / BARS) * Math.PI);
    return Math.max(0.14, Math.min(1, (r1 * 0.7 + r2 * 0.5) * env));
  });

  const playedCount = Math.floor(progress * BARS);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
    >
      {/* Meta line */}
      <p
        className="label-mono mb-4"
        style={{ color: "var(--color-stone-dim)", fontSize: "0.7rem" }}
      >
        {story.meta}
      </p>

      {/* Play button + waveform row */}
      <button
        type="button"
        onClick={() => {
          if (playing) {
            setPlaying(false);
          } else {
            setProgress(0);
            setPlaying(true);
          }
        }}
        aria-label={playing ? "Pause recording" : "Play recording"}
        className="group relative flex items-center gap-4 md:gap-6 w-full text-left"
        style={{ WebkitTapHighlightColor: "transparent" }}
      >
        {/* Play / pause glyph */}
        <span
          className="shrink-0 inline-flex items-center justify-center rounded-full transition-transform"
          style={{
            width: 44,
            height: 44,
            border: `1.5px solid ${story.accent}`,
            background: playing ? story.accent : "transparent",
            transition: "background 0.3s ease, transform 0.3s ease",
          }}
        >
          {playing ? (
            <span className="flex gap-[3px]">
              <span style={{ width: 3, height: 13, background: "var(--color-cream)" }} />
              <span style={{ width: 3, height: 13, background: "var(--color-cream)" }} />
            </span>
          ) : (
            <span
              style={{
                width: 0,
                height: 0,
                borderLeft: `11px solid ${story.accent}`,
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                marginLeft: 3,
              }}
            />
          )}
        </span>

        {/* Waveform */}
        <span
          className="relative flex-1 flex items-center"
          style={{ height: 64, gap: 2 }}
        >
          <span className="flex items-center w-full justify-between" style={{ height: "100%" }}>
            {heights.map((h, i) => {
              const isPlayed = playing && i < playedCount;
              const isHead = playing && i === playedCount;
              return (
                <span
                  key={i}
                  className="block rounded-full"
                  style={{
                    width: 2,
                    height: `${h * 100}%`,
                    background: isPlayed || isHead ? story.accent : "var(--color-stone-dim)",
                    opacity: isPlayed ? 0.95 : isHead ? 1 : 0.42,
                    transform: isHead ? "scaleY(1.15)" : "scaleY(1)",
                    transition: "background 0.15s ease, opacity 0.15s ease, transform 0.15s ease",
                    animation: !playing
                      ? `wave-bar ${3 + (i % 7) * 0.15}s ease-in-out ${i * 0.012}s infinite`
                      : undefined,
                    transformOrigin: "center",
                  }}
                />
              );
            })}
          </span>
        </span>

        {/* Duration */}
        <span
          className="font-mono shrink-0 tabular-nums"
          style={{
            color: playing ? story.accent : "var(--color-stone-dim)",
            fontSize: 13,
            letterSpacing: "0.04em",
            minWidth: 42,
            textAlign: "right",
            transition: "color 0.3s ease",
          }}
        >
          {story.duration}
        </span>
      </button>

      {/* Outcome line */}
      <p
        className="mt-5 md:mt-6 font-serif italic"
        style={{
          color: "var(--color-espresso-strong)",
          fontSize: "clamp(1.15rem, 2.4vw, 1.5rem)",
          lineHeight: 1.4,
          letterSpacing: "-0.005em",
          paddingLeft: 60, // align with waveform start (button width + gap)
          maxWidth: "44rem",
        }}
      >
        {story.outcome}
      </p>
    </motion.div>
  );
}
