import { motion } from "motion/react";
import { OrganicDivider } from "./Atmosphere";
import { AudioPlayButton } from "./AudioPlayButton";

const STORIES = [
  {
    num: "01",
    cat: "HEALTHCARE",
    catColor: "#C25B3F",
    accent: "#C25B3F",
    headline: "Three clinics called. Opening found. Insurance pre-authorized.",
    body: "Needed a specialist. Asmi called three clinics, compared wait times, booked the earliest opening, then called insurance to pre-authorize. Done before breakfast.",
    result: "→ CONFIRMED: DR. CHEN, TOMORROW 10AM.",
  },
  {
    num: "02",
    cat: "HOME REPAIR",
    catColor: "#8BA888",
    accent: "#8BA888",
    headline: "Five contractors called. Quotes compared. Best one booked.",
    body: "AC broke in July. Asmi called five HVAC contractors, compared availability and pricing, and confirmed the best option for Saturday morning.",
    result: "→ BOOKED: SATURDAY 9AM, $150 DIAGNOSTIC.",
  },
  {
    num: "03",
    cat: "FAMILY CARE",
    catColor: "#D4A574",
    accent: "#D4A574",
    headline: "Twice-daily check-ins. Italian. SF to Rome.",
    body: "Asmi calls his mother in Rome every morning and evening. In Italian. Tracks medications. Reorders when needed.",
    result: "→ THREE YEARS. NEVER MISSED A CALL.",
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

// Mobile hides smallest languages
const MOBILE_LANGUAGES = LANGUAGES.filter((l) => l.size !== "sm").slice(0, 20);

function langPos(i: number, total: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.cos(i * 78.233) * 12345.678;
  return {
    x: Math.min(95, Math.max(5, ((a - Math.floor(a)) * 88) + 6)),
    y: Math.min(92, Math.max(8, ((b - Math.floor(b)) * 82) + 9)),
    delay: (i / total) * 4,
    dur: 8 + (i % 6),
  };
}

export function Act5() {
  return (
    <section id="stories" className="relative">
      <OrganicDivider />

      {/* 5A Stories */}
      <div className="px-5 sm:px-6 py-20 md:py-32 max-w-4xl mx-auto">
        <motion.h2
          className="font-serif mb-20 md:mb-24"
          style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          This happened this week.
        </motion.h2>

        <div className="flex flex-col gap-[100px] md:gap-[120px]">
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              className="relative md:pl-8"
              style={{ minHeight: 1 }}
            >
              {/* Ghost number - desktop only */}
              <span
                className="hidden md:block absolute font-serif pointer-events-none select-none"
                style={{
                  top: -40,
                  left: -10,
                  fontSize: 180,
                  lineHeight: 1,
                  color: "var(--color-espresso)",
                  opacity: 0.035,
                  fontWeight: 400,
                  zIndex: 0,
                }}
                aria-hidden
              >
                {s.num}
              </span>

              {/* Left vertical accent line */}
              <span
                className="hidden md:block absolute"
                style={{
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background: s.accent,
                  opacity: 0.55,
                }}
                aria-hidden
              />

              <div className="relative" style={{ zIndex: 1 }}>
                <p className="label-mono mb-4" style={{ color: s.catColor }}>{s.cat}</p>

                <div className="flex items-start gap-4 md:gap-6">
                  <h3
                    className="font-serif flex-1"
                    style={{
                      color: "var(--color-espresso)",
                      fontSize: "clamp(24px, 4.5vw, 44px)",
                      lineHeight: 1.15,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {s.headline}
                  </h3>
                  <div className="mt-1">
                    <AudioPlayButton color={s.accent} />
                  </div>
                </div>

                <p
                  className="mt-5 font-sans max-w-2xl"
                  style={{ color: "#5C5349", fontSize: 18, lineHeight: 1.55 }}
                >
                  {s.body}
                </p>
                <p
                  className="mt-4 label-mono"
                  style={{ color: s.accent, fontSize: 14, letterSpacing: "0.14em" }}
                >
                  {s.result}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <OrganicDivider />

      {/* 5B Available everywhere */}
      <div className="px-5 sm:px-6 py-20 md:py-32 max-w-6xl mx-auto">
        <motion.h2
          className="font-serif mb-16 md:mb-20 text-center"
          style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
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
            style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            50+ languages. <em className="italic">Your accent. Your way.</em>
          </motion.h2>
        </div>

        {/* Mobile: organic flowing wrap, no labels smaller than 14px */}
        <div className="md:hidden px-4 mx-auto max-w-2xl flex flex-wrap justify-center items-center gap-x-4 gap-y-3" style={{ minHeight: 400 }}>
          {MOBILE_LANGUAGES.map((l, i) => {
            const sizeMap = { md: "1.15rem", lg: "1.5rem", xl: "2rem" } as Record<string, string>;
            const colorMap = { md: "#5C5349", lg: "var(--color-espresso)", xl: "var(--color-espresso)" } as Record<string, string>;
            return (
              <motion.span
                key={l.name}
                className="font-serif"
                style={{
                  fontSize: sizeMap[l.size] || "1rem",
                  color: colorMap[l.size] || "#5C5349",
                  opacity: l.size === "md" ? 0.85 : 1,
                }}
                animate={{ y: [0, -3, 0, 2, 0] }}
                transition={{ duration: 6 + (i % 5), repeat: Infinity, ease: "easeInOut", delay: (i % 6) * 0.3 }}
              >
                {l.name}
              </motion.span>
            );
          })}
        </div>

        {/* Desktop: scattered floating cloud */}
        <div className="hidden md:block relative mx-auto max-w-6xl" style={{ height: "min(70vh, 600px)" }}>
          {LANGUAGES.map((l, i) => {
            const p = langPos(i, LANGUAGES.length);
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
        style={{ color: "var(--color-espresso)", fontSize: 48, lineHeight: 1, letterSpacing: "-0.02em" }}
      >
        {word}
      </p>
      <div className="mt-5 h-7 flex items-center">{ambient}</div>
      <p className="mt-5 font-sans" style={{ color: "#6B6560", fontSize: 15, lineHeight: 1.5, maxWidth: 280 }}>
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
