import { motion } from "motion/react";
import { OrganicDivider } from "./Atmosphere";

const STORIES = [
  {
    cat: "MOVING LOGISTICS",
    catColor: "var(--color-terracotta)",
    headline: "Seven suppliers. Best price. Boxes ordered.",
    body: "Asmi called seven, compared quotes, placed the order.",
    result: "→ No tabs opened. He just talked.",
  },
  {
    cat: "EMERGENCY REPAIR",
    catColor: "var(--color-sage)",
    headline: "Five plumbers. One at the door in two hours.",
    body: "Burst pipe. Five calls in parallel. One confirmed.",
    result: "→ iMessage: \"He's on his way.\"",
  },
  {
    cat: "FAMILY CARE",
    catColor: "var(--color-clay)",
    headline: "Twice-daily check-ins. Italian. SF to Rome.",
    body: "Asmi calls his mother in Rome every morning and evening. In Italian.",
    result: "→ Three years. Never missed a call.",
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

function langPos(i: number, total: number) {
  const a = Math.sin(i * 12.9898) * 43758.5453;
  const b = Math.cos(i * 78.233) * 12345.678;
  return {
    x: ((a - Math.floor(a)) * 92) + 4,
    y: ((b - Math.floor(b)) * 86) + 7,
    delay: (i / total) * 4,
    dur: 8 + (i % 6),
  };
}

export function Act5() {
  return (
    <section className="relative">
      <OrganicDivider />

      {/* 5A Stories */}
      <div className="px-6 py-32 max-w-4xl mx-auto">
        <motion.h2
          className="font-serif text-espresso mb-20"
          style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          This happened this week.
        </motion.h2>

        <div className="space-y-24">
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.1 }}
              className="relative"
            >
              <p className="label-mono mb-4" style={{ color: s.catColor }}>{s.cat}</p>
              <h3 className="font-serif text-espresso" style={{ color: "var(--color-espresso)", fontSize: "clamp(1.6rem, 3.4vw, 2.8rem)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
                {s.headline}
              </h3>
              <p className="mt-4 font-sans text-stone max-w-2xl" style={{ color: "var(--color-stone)", fontSize: "clamp(1rem, 1.3vw, 1.15rem)" }}>
                {s.body}
              </p>
              <p className="mt-3 label-mono" style={{ color: "var(--color-sage)" }}>{s.result}</p>
              {i < STORIES.length - 1 && (
                <svg className="mt-16 w-40 opacity-40" viewBox="0 0 200 12">
                  <path d="M0 6 Q 50 0, 100 6 T 200 6" stroke="var(--color-stone-dim)" strokeWidth="1" fill="none" />
                </svg>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <OrganicDivider />

      {/* 5B Available */}
      <div className="px-6 py-32 max-w-5xl mx-auto text-center">
        <motion.h2
          className="font-serif text-espresso mb-16"
          style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          No app. No new habit.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mt-20">
          <ChannelWord word="Call" ambient={<MiniWave />} />
          <ChannelWord word="Text" ambient={<TypingDots />} />
          <ChannelWord word="Listen" ambient={<Ripples />} />
        </div>
        <p className="mt-20 font-sans text-stone max-w-2xl mx-auto" style={{ color: "var(--color-stone)", fontSize: "clamp(1rem, 1.4vw, 1.2rem)" }}>
          Asmi calls you. You call Asmi. You text Asmi. <em className="font-serif italic">Same intelligence everywhere.</em>
        </p>
      </div>

      <OrganicDivider />

      {/* 5C Languages */}
      <div className="px-6 py-32">
        <div className="text-center mb-12">
          <motion.h2
            className="font-serif text-espresso"
            style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            50+ languages. <em className="italic">Your accent. Your way.</em>
          </motion.h2>
        </div>
        <div className="relative mx-auto max-w-6xl" style={{ height: "min(70vh, 600px)" }}>
          {LANGUAGES.map((l, i) => {
            const p = langPos(i, LANGUAGES.length);
            const sizeMap = { sm: "1rem", md: "1.4rem", lg: "2.1rem", xl: "3.2rem" } as Record<string, string>;
            const colorMap = { sm: "var(--color-stone-dim)", md: "var(--color-stone)", lg: "var(--color-espresso)", xl: "var(--color-espresso)" } as Record<string, string>;
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
                  opacity: l.size === "sm" ? 0.6 : l.size === "md" ? 0.8 : 1,
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

function ChannelWord({ word, ambient }: { word: string; ambient: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center"
    >
      <p className="font-serif text-espresso" style={{ color: "var(--color-espresso)", fontSize: "clamp(2.4rem, 5vw, 3.8rem)", letterSpacing: "-0.02em" }}>
        {word}
      </p>
      <div className="mt-4 h-12 flex items-center justify-center">{ambient}</div>
    </motion.div>
  );
}

function MiniWave() {
  return (
    <svg viewBox="0 0 120 24" className="w-32">
      <motion.path
        d="M0 12 Q 15 4 30 12 T 60 12 T 90 12 T 120 12"
        stroke="var(--color-terracotta)" strokeWidth="1.5" fill="none"
        animate={{ d: [
          "M0 12 Q 15 4 30 12 T 60 12 T 90 12 T 120 12",
          "M0 12 Q 15 20 30 12 T 60 12 T 90 12 T 120 12",
          "M0 12 Q 15 4 30 12 T 60 12 T 90 12 T 120 12",
        ] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-end gap-1.5 h-6">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block w-2.5 h-2.5 rounded-full"
          style={{
            background: "var(--color-terracotta)",
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
            animation: `ripple 2.4s ease-out ${i * 0.7}s infinite`,
          }}
        />
      ))}
      <span className="block rounded-full" style={{ width: 8, height: 8, background: "var(--color-terracotta)" }} />
    </div>
  );
}
