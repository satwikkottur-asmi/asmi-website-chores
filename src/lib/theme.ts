// Named palette entries backed by --rgb-* CSS custom properties in styles.css.
// Keep in sync with the --rgb-* declarations there.
const PALETTE = [
  "linen",
  "sand",
  "espresso",
  "espresso-strong",
  "ink",
  "stone",
  "stone-dim",
  "terracotta",
  "terracotta-deep",
  "sage",
  "sage-strong",
  "sage-deep",
  "sky",
  "clay",
  "apricot",
  "cream",
  "white",
] as const;

export type ThemeColor = (typeof PALETTE)[number];

/** Alpha-blended reference to a theme color, e.g. withAlpha("terracotta", 0.4) */
export function withAlpha(color: ThemeColor, alpha: number) {
  return `rgba(var(--rgb-${color}), ${alpha})`;
}

/**
 * Shared motion constants so easing curves, durations, and dim/saturate
 * states read the same across every Act instead of being retyped per file.
 */
export const EASE_OUT = [0.2, 0.7, 0.2, 1] as const;

export const DIM_OPACITY = 0.45;
export const SATURATE_DIM = "saturate(0.4)";
export const SATURATE_FULL = "saturate(1)";

/** Standard opacity/filter pair applied to a "resolved, not the winner" row. */
export function dimState(dim: boolean) {
  return {
    opacity: dim ? DIM_OPACITY : 1,
    filter: dim ? SATURATE_DIM : SATURATE_FULL,
  };
}
