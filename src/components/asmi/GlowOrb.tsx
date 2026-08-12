import { motion } from "motion/react";
import { memo, useState } from "react";
import { withAlpha } from "@/lib/theme";

/**
 * Three concentric alpha rings + a pulsing core, used as the "Asmi" call
 * indicator in Act 2 (desktop + mobile). Colors swap between terracotta
 * (in-progress) and sage (confirmed). On mobile, tapping the orb briefly
 * speeds up the core pulse.
 */
export const GlowOrb = memo(function GlowOrb({
  size,
  confirmed,
  tappable = false,
  pulseScale = 1.08,
  label = "Asmi",
  labelOffset = -22,
}: {
  size: number;
  confirmed: boolean;
  tappable?: boolean;
  pulseScale?: number;
  label?: string;
  labelOffset?: number;
}) {
  const [tapped, setTapped] = useState(false);

  return (
    <div
      className="relative"
      style={{ width: size, height: size, WebkitTapHighlightColor: "transparent" }}
      onClick={
        tappable
          ? () => {
              setTapped(true);
              setTimeout(() => setTapped(false), 600);
            }
          : undefined
      }
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: confirmed ? withAlpha("sage-strong", 0.14) : withAlpha("terracotta", 0.14),
          boxShadow: confirmed
            ? `0 0 110px ${withAlpha("sage-strong", 0.32)}`
            : `0 0 110px ${withAlpha("terracotta", 0.28)}`,
          transition: "background 0.6s ease, box-shadow 0.6s ease",
        }}
      />
      <div
        className="absolute inset-[16%] rounded-full"
        style={{
          background: confirmed ? withAlpha("sage-strong", 0.26) : withAlpha("terracotta", 0.26),
          transition: "background 0.6s ease",
        }}
      />
      <div
        className="absolute inset-[31%] rounded-full"
        style={{
          background: confirmed ? withAlpha("sage-strong", 0.4) : withAlpha("terracotta", 0.4),
          transition: "background 0.6s ease",
        }}
      />
      <motion.div
        className="absolute inset-[39%] rounded-full"
        style={{
          background: confirmed ? "var(--color-sage-strong)" : "var(--color-terracotta-deep)",
          boxShadow: confirmed
            ? `0 0 50px ${withAlpha("sage-deep", 0.55)}`
            : `0 0 50px ${withAlpha("terracotta-deep", 0.5)}`,
          transition: "background 0.6s ease, box-shadow 0.6s ease",
        }}
        animate={{ scale: tapped ? [1, 1.25, 1] : [1, pulseScale, 1] }}
        transition={{
          duration: tapped ? 0.6 : 2.8,
          repeat: tapped ? 0 : Infinity,
          ease: "easeInOut",
        }}
      />
      {label && (
        <div
          className="absolute left-1/2 -translate-x-1/2 label-mono"
          style={{
            bottom: labelOffset,
            color: confirmed ? "var(--color-sage-strong)" : "var(--color-terracotta-deep)",
            whiteSpace: "nowrap",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            transition: "color 0.6s ease",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
});
