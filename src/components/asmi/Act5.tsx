import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { OrganicDivider } from "./Atmosphere";

type Story = {
  kicker: string;        // "tuesday morning"
  phrases: string[];     // body text, one phrase per line
  tag: string;           // "pre-auth cleared"
  duration: string;      // "0:47"
  accent: string;        // css color
  tint: string;          // soft wash color (blooms)
  wash: string;          // bolder sweep color, visible on cream
  tilt: number;          // deg
  src?: string;          // optional real audio
};

const STORIES: Story[] = [
  {
    kicker: "tuesday morning",
    phrases: [
      "called Dr. Weng's office.",
      "got Jonathan on the primary care waitlist.",
      "tuesday, 10am.",
    ],
    tag: "pre-auth cleared",
    duration: "3:04",
    accent: "var(--color-terracotta)",
    tint: "rgba(194, 91, 63, 0.10)",
    wash: "rgba(194, 91, 63, 0.55)",
    tilt: -1.5,
    src: "/audio/doc-sandra-call.mp4",
  },
  {
    kicker: "wednesday, before coffee",
    phrases: [
      "got five HVAC quotes.",
      "booked the one Marco liked.",
      "saturday, 9am.",
    ],
    tag: "$150 diagnostic",
    duration: "1:49",
    accent: "var(--color-sage-strong)",
    tint: "rgba(95, 131, 101, 0.12)",
    wash: "rgba(95, 131, 101, 0.5)",
    tilt: 1.1,
    src: "/audio/hvac-call.mp4",
  },
  {
    kicker: "sunday evening · in Spanish",
    phrases: [
      "called grandpa in Spain.",
      "he has pain.",
      "he took his medicines.",
    ],
    tag: "check-in logged",
    duration: "2:11",
    accent: "var(--color-clay)",
    tint: "rgba(212, 165, 116, 0.16)",
    wash: "rgba(212, 165, 116, 0.55)",
    tilt: -0.8,
    src: "/audio/spanish-grandpa-call.mp4",
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


const RING_OF: Record<string, number> = { xl: 0, lg: 1, md: 2, sm: 3 };
const RING_R = [12, 26, 38, 48];
const RING_OFFSET = [0, 0.17, 0.41, 0.06];
const RING_ASPECT = 1.65;

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

export function Act5Stories() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="stories" className="relative">
      <OrganicDivider />

      {/* 5A Stories — field notes from Asmi */}
      <div className="px-5 sm:px-8 py-20 md:py-32 max-w-4xl mx-auto">
        <motion.p
          className="font-serif italic mb-3"
          style={{ color: "var(--color-stone-dim)", fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)" }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          this week with asmi —
        </motion.p>
        <motion.h2
          className="font-serif mb-16 md:mb-24"
          style={{
            color: "var(--color-espresso)",
            fontSize: "clamp(2.6rem, 8.5vw, 4.6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          a few things it handled.
        </motion.h2>

        <div className="flex flex-col gap-10 md:gap-14">
          {STORIES.map((s, i) => (
            <FieldNoteCard
              key={i}
              story={s}
              index={i}
              isActive={activeIndex === i}
              isDimmed={activeIndex !== null && activeIndex !== i}
              onPlay={() => setActiveIndex(i)}
              onStop={() => setActiveIndex(null)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function Act5() {
  return (
    <section className="relative">
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

        {/* Desktop: full 3-column with captions */}
        <div className="hidden md:flex flex-row gap-8">
          <Channel word="Call" caption="Every morning. Asmi calls you." ambient={<MiniWave />} />
          <Channel word="Text" caption="iMessage or WhatsApp anytime." ambient={<TypingDots />} />
          <Channel word="Listen" caption="Call Asmi directly. Always on." ambient={<Ripples />} />
        </div>

        {/* Mobile: compact 3-up row + single combined caption */}
        <div className="md:hidden">
          <div className="flex flex-row items-end justify-between gap-3">
            <ChannelCompact word="Call" ambient={<MiniWave />} />
            <ChannelCompact word="Text" ambient={<TypingDots />} />
            <ChannelCompact word="Listen" ambient={<Ripples />} />
          </div>
          <p
            className="mt-10 font-sans text-center mx-auto"
            style={{ color: "#6B6560", fontSize: 14, lineHeight: 1.55, maxWidth: 300 }}
          >
            Call, text, or just talk — iMessage, WhatsApp, or a phone call.
          </p>
        </div>

        <p
          className="mt-14 md:mt-20 font-sans text-center"
          style={{ color: "var(--color-espresso)", fontSize: 16, fontWeight: 400 }}
        >
          Same intelligence. Every surface. No app.
        </p>
      </div>


      <OrganicDivider />

      {/* 5C Languages */}
      <div id="languages" className="px-5 sm:px-6 pt-20 pb-16 md:py-32">
        <div className="text-center mb-16 md:mb-16">
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

        <MobileLanguageCloud />

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

  const rand = (seed: number) => {
    const x = Math.sin(seed * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };

  return (
    <div className="md:hidden relative mx-auto w-full max-w-md px-2">
      <div
        className="flex flex-wrap items-center justify-center"
        style={{ rowGap: "0.95rem", columnGap: "1rem" }}
      >
        {LANGUAGES.map((l, i) => {
          const isLit = tapped.has(i) || autoLit === i;
          const rotate = (rand(i + 1) - 0.5) * 6;
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
                lineHeight: 1.15,
                whiteSpace: "nowrap",
                transform: `rotate(${rotate}deg)`,
                transition: "color 0.4s ease, opacity 0.4s ease",
                cursor: "pointer",
                WebkitTapHighlightColor: "transparent",
              }}
              animate={{ y: [0, -3, 0, 2, 0], scale: isLit ? 1.15 : 1 }}
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

function ChannelCompact({ word, ambient }: { word: string; ambient: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6 }}
      className="flex-1 flex flex-col items-center gap-3"
    >
      <div className="h-5 flex items-end">{ambient}</div>
      <p
        className="font-serif"
        style={{ color: "var(--color-espresso)", fontSize: "clamp(22px, 6vw, 28px)", lineHeight: 1, letterSpacing: "-0.02em" }}
      >
        {word}
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
// Field Note Card — postcard from Asmi (Act 5A)
// =============================================================

function durationToSeconds(d: string) {
  const [m, s] = d.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
}

function FieldNoteCard({
  story,
  index,
  isActive,
  isDimmed,
  onPlay,
  onStop,
}: {
  story: Story;
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const [progress, setProgress] = useState(0); // 0..1
  const [finished, setFinished] = useState(false);
  const [audioReady, setAudioReady] = useState(!story.src);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Visual playback duration (real audio overrides when story.src is provided)
  const baseDuration = durationToSeconds(story.duration);
  // Cap visual-only playback so even "3:20" doesn't bore the user
  const visualDuration = Math.min(baseDuration, 8);

  useEffect(() => {
    if (story.src) {
      const a = new Audio(story.src);
      a.preload = "auto";
      a.load();
      audioRef.current = a;
      const markReady = () => setAudioReady(true);
      const onEnd = () => {
        setFinished(true);
        onStop();
      };
      a.addEventListener("loadeddata", markReady);
      a.addEventListener("canplay", markReady);
      a.addEventListener("ended", onEnd);
      return () => {
        a.pause();
        a.removeEventListener("loadeddata", markReady);
        a.removeEventListener("canplay", markReady);
        a.removeEventListener("ended", onEnd);
      };
    }
  }, [story.src, onStop]);

  useEffect(() => {
    if (!isActive) {
      cancelAnimationFrame(rafRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    setFinished(false);

    if (audioRef.current && story.src) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      const tick = () => {
        const a = audioRef.current!;
        const p = a.duration ? Math.min(1, a.currentTime / a.duration) : 0;
        setProgress(p);
        if (!a.paused && !a.ended) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Visual-only playback
      startRef.current = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - startRef.current) / (visualDuration * 1000));
        setProgress(p);
        if (p >= 1) {
          setFinished(true);
          onStop();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, visualDuration, story.src, onStop]);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
    }
  }, [isActive]);

  const handleToggle = () => {
    if (isActive) {
      onStop();
      setProgress(0);
    } else {
      setProgress(0);
      onPlay();
    }
  };

  // Reveal phrases progressively
  const phraseCount = story.phrases.length;
  const phraseProgress = progress * phraseCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
      style={{
        filter: isDimmed ? "blur(3px)" : "none",
        opacity: isDimmed ? 0.35 : 1,
        transition: "filter 0.4s ease, opacity 0.4s ease",
      }}
    >
      <motion.button
        type="button"
        onClick={handleToggle}
        aria-label={isActive ? "Stop recording" : "Play recording"}
        className="relative block w-full text-left rounded-[22px] overflow-hidden paper-grain"
        style={{
          background: "var(--color-cream)",
          padding: "clamp(22px, 5vw, 38px)",
          paddingBottom: "clamp(70px, 14vw, 90px)",
          boxShadow: isActive
            ? "0 30px 60px -20px rgba(44,37,32,0.25), 0 8px 20px -10px rgba(44,37,32,0.15)"
            : "0 14px 30px -18px rgba(44,37,32,0.18), 0 4px 10px -6px rgba(44,37,32,0.08)",
          WebkitTapHighlightColor: "transparent",
          cursor: "pointer",
        }}
        animate={{
          rotate: isActive ? 0 : story.tilt,
          scale: isActive ? 1.02 : 1,
          y: isActive ? -4 : 0,
        }}
        transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
      >
        {/* Accent wash — corner bloom that sweeps across during playback */}
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(120% 90% at 0% 0%, ${story.tint} 0%, transparent 55%)`,
            transition: "opacity 0.6s ease",
            opacity: isActive ? 0 : 1,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(115deg, ${story.wash} 0%, ${story.wash} 35%, transparent 70%)`,
            opacity: isActive ? 1 : 0,
            transition: "opacity 0.7s ease",
          }}
        />

        {/* Soft ambient bloom behind text during playback */}
        <AnimatePresence>
          {isActive && (
            <motion.span
              aria-hidden
              className="absolute pointer-events-none rounded-full"
              style={{
                left: "50%",
                top: "55%",
                width: "70%",
                height: "70%",
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle, ${story.tint} 0%, transparent 65%)`,
                filter: "blur(40px)",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: [0.9, 1.05, 0.95, 1.05] }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            />
          )}
        </AnimatePresence>

        {/* Kicker */}
        <p
          className="font-serif italic relative"
          style={{
            color: "var(--color-stone-dim)",
            fontSize: "clamp(0.95rem, 2.4vw, 1.1rem)",
            letterSpacing: "0.005em",
          }}
        >
          <span
            aria-hidden
            className="inline-block rounded-full mr-2 align-middle"
            style={{
              width: 5,
              height: 5,
              background: story.accent,
              opacity: 0.6,
              transform: "translateY(-2px)",
            }}
          />
          {story.kicker}
        </p>

        {/* Body — phrases */}
        <div
          className="mt-5 md:mt-6 relative font-serif"
          style={{
            color: "var(--color-espresso-strong)",
            fontSize: "clamp(1.35rem, 4.4vw, 1.9rem)",
            lineHeight: 1.35,
            letterSpacing: "-0.005em",
          }}
        >
          {story.phrases.map((phrase, pi) => {
            // Each phrase fades in based on its slice of progress
            const localStart = pi / phraseCount;
            const localEnd = (pi + 1) / phraseCount;
            let phraseOpacity = isActive
              ? Math.max(0.25, Math.min(1, (progress - localStart + 0.05) / 0.15))
              : 1;
            const isCurrent =
              isActive && phraseProgress >= pi && phraseProgress < pi + 1;

            return (
              <motion.span
                key={pi}
                className="block"
                style={{
                  color: isCurrent ? story.accent : undefined,
                  opacity: phraseOpacity,
                  transition: "color 0.5s ease, opacity 0.4s ease",
                }}
                animate={
                  isCurrent
                    ? { y: [-2, 0], opacity: [0.5, 1] }
                    : { y: 0 }
                }
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {phrase}
              </motion.span>
            );
          })}
        </div>

        {/* Hand-drawn divider + tag */}
        <div className="mt-6 md:mt-7 flex items-center gap-3">
          <svg
            width="48"
            height="8"
            viewBox="0 0 48 8"
            preserveAspectRatio="none"
            aria-hidden
            style={{ flexShrink: 0 }}
          >
            <path
              d="M1 4 C 8 1, 16 7, 24 4 S 40 1, 47 5"
              stroke={story.accent}
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </svg>
          <span
            className="font-mono"
            style={{
              color: "var(--color-stone)",
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              textTransform: "lowercase",
            }}
          >
            {story.tag}
          </span>
        </div>

        {/* Bottom-left: play pill */}
        <div
          className="absolute flex items-center gap-3"
          style={{
            left: "clamp(22px, 5vw, 38px)",
            bottom: "clamp(22px, 5vw, 30px)",
          }}
        >
          <span
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 36,
              height: 36,
              border: `1.5px solid ${story.accent}`,
              background: isActive ? story.accent : "transparent",
              transition: "background 0.3s ease",
            }}
          >
            {isActive ? (
              <span className="flex gap-[3px]">
                <span style={{ width: 3, height: 11, background: "var(--color-cream)" }} />
                <span style={{ width: 3, height: 11, background: "var(--color-cream)" }} />
              </span>
            ) : finished ? (
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
                <path
                  d="M2 7 L6 11 L12 3"
                  stroke={story.accent}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            ) : (
              <span
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `9px solid ${story.accent}`,
                  borderTop: "6px solid transparent",
                  borderBottom: "6px solid transparent",
                  marginLeft: 3,
                }}
              />
            )}
          </span>
          <span
            className="font-serif italic"
            style={{
              color: isActive ? story.accent : audioReady ? "var(--color-stone)" : "var(--color-stone-dim)",
              fontSize: "0.95rem",
              transition: "color 0.3s ease",
            }}
          >
            {isActive ? "listening" : finished ? "played" : audioReady ? "listen" : "loading"}
          </span>

          {/* Breathing dots — audio presence cue */}
          <AnimatePresence>
            {isActive && (
              <motion.span
                className="flex items-center gap-1 ml-1"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="block rounded-full"
                    style={{ width: 4, height: 4, background: story.accent }}
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{
                      duration: 1.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.18,
                    }}
                  />
                ))}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom-right: duration */}
        <span
          className="absolute font-mono tabular-nums"
          style={{
            right: "clamp(22px, 5vw, 38px)",
            bottom: "clamp(28px, 5.5vw, 36px)",
            color: isActive ? story.accent : "var(--color-stone-dim)",
            fontSize: "0.78rem",
            letterSpacing: "0.06em",
            transition: "color 0.3s ease",
          }}
        >
          {story.duration}
        </span>
      </motion.button>
    </motion.div>
  );
}
