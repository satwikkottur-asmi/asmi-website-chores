# Restore visible waveform on call branches (Act 2)

## Problem
The traveling waveform on each call branch in `Act2CallViz.tsx` is too small and visually swallowed by the branch line. Previously the bars were larger, brighter, and sat on a small backing chip so they read clearly against the line.

## Change
Update only the `TravelingWave` component in `src/components/asmi/Act2CallViz.tsx`:

- Add a soft rounded background "chip" behind the bars (cream/linen fill with a subtle terracotta/sage border matching the wave color) so the waveform sits on top of the line instead of blending into it.
- Increase bar size: width ~3px, height ~18px, gap ~6px, 4 bars instead of 3.
- Brighten color and add a soft glow (SVG `filter: drop-shadow`) using the branch color.
- Re-center the group transform so the chip is centered on the path point.
- Keep the `wave-bar` keyframe + per-bar stagger; slightly increase the scale range so motion is more pronounced.
- Winner state (sage) keeps the same treatment, just with sage color.

No changes to layout, steps, endpoints, branch paths, or any other component.

## Files
- `src/components/asmi/Act2CallViz.tsx` — replace `TravelingWave` only.
