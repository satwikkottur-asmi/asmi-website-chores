import { memo, useMemo } from "react";
import { type ThemeColor, withAlpha } from "@/lib/theme";

/**
 * Full-bleed decorative radial wash behind a pinned scene. Memoized since it
 * has no dependency on scroll/animation state and would otherwise recompute
 * its gradient string on every parent re-render.
 */
export const RadialVignette = memo(function RadialVignette({
  color,
  strong = 0.1,
  soft = 0.05,
  fade = "linen",
}: {
  color: ThemeColor;
  strong?: number;
  soft?: number;
  fade?: ThemeColor;
}) {
  const background = useMemo(
    () =>
      `radial-gradient(circle at center, ${withAlpha(color, strong)} 0%, ${withAlpha(color, soft)} 25%, ${withAlpha(fade, 0)} 60%)`,
    [color, strong, soft, fade],
  );

  return <div className="absolute inset-0 pointer-events-none" style={{ background }} />;
});
