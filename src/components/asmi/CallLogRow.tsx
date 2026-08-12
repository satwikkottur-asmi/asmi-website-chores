import { AnimatePresence, motion } from "motion/react";
import { memo } from "react";
import { dimState, EASE_OUT, withAlpha } from "@/lib/theme";

/**
 * A single row in a "calling the plumbers" list — pulsing status dot, name,
 * status subtext, and a winner checkmark once resolved. Shared between the
 * Act 2 mobile scene and the Act 3 mobile auto-playing loop.
 */
export const CallLogRow = memo(function CallLogRow({
  index,
  name,
  subtext,
  subtextColor,
  winner,
  resolved,
  dotColor,
  dialing,
  dim,
  tapped = false,
  onTap,
}: {
  index: number;
  name: string;
  subtext: string;
  /** Overrides the default resolved/unresolved subtext color, e.g. for a "ringing…" tap state. */
  subtextColor?: string;
  winner: boolean;
  resolved: boolean;
  dotColor: string;
  dialing: boolean;
  dim: boolean;
  /** Whether a tap ripple should be shown right now (Act 2 mobile behavior). */
  tapped?: boolean;
  /** If provided, the row becomes tappable (Act 2 mobile behavior). */
  onTap?: () => void;
}) {
  const interactive = Boolean(onTap);
  const highlight = winner && resolved;

  const Wrapper = interactive ? motion.button : motion.div;

  return (
    <Wrapper
      {...(interactive ? { type: "button", onClick: onTap } : {})}
      initial={{ opacity: 0, x: -16 }}
      animate={{ x: 0, ...dimState(dim) }}
      whileInView={interactive ? undefined : { x: 0, ...dimState(dim) }}
      viewport={interactive ? undefined : { once: true }}
      whileTap={interactive ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE_OUT }}
      className="relative flex items-center gap-3 text-left rounded-2xl px-4 py-3 w-full"
      style={{
        background: highlight ? withAlpha("sage-strong", 0.12) : withAlpha("white", 0.55),
        border: highlight
          ? `1px solid ${withAlpha("sage-strong", 0.4)}`
          : `1px solid ${withAlpha("stone", 0.12)}`,
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow: highlight
          ? `0 18px 40px -22px ${withAlpha("sage-deep", 0.55)}`
          : `0 4px 14px -8px ${withAlpha("ink", 0.18)}`,
        WebkitTapHighlightColor: "transparent",
        transition:
          "background 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease, opacity 0.5s ease, filter 0.5s ease",
      }}
    >
      <span className="relative flex-shrink-0" style={{ width: 12, height: 12 }}>
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: dotColor, transition: "background 0.5s ease" }}
          animate={
            dialing ? { scale: [1, 1.5, 1], opacity: [1, 0.4, 1] } : { scale: 1, opacity: 1 }
          }
          transition={{
            duration: 1.2,
            repeat: dialing ? Infinity : 0,
            ease: "easeInOut",
            delay: index * 0.18,
          }}
        />
        {interactive && tapped && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${dotColor}` }}
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        )}
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
              color:
                subtextColor ?? (highlight ? "var(--color-sage-strong)" : "var(--color-stone-dim)"),
              fontSize: "0.78rem",
              marginTop: 2,
              fontWeight: highlight ? 600 : 400,
            }}
          >
            {subtext}
          </motion.span>
        </AnimatePresence>
      </span>

      {highlight && (
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
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
    </Wrapper>
  );
});
