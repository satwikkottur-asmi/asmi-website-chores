# Restore previous waveform visibility (Act 2 call animation)

## Scope
Only the traveling waveform that moves along each call branch from Asmi → plumber. Nothing else changes — no edits to lines, endpoints, steps, layout, colors elsewhere, or any other component.

## Change
In `src/components/asmi/Act2CallViz.tsx`, update only the `TravelingWave` component so the bars are clearly visible on top of the branch line (as they were before):

- Larger bars: width ~3px, height ~18px, 4 bars with ~6px spacing.
- Brighter fill + soft drop-shadow glow in the branch color so it pops off the line.
- Slightly stronger scale animation range on `wave-bar`.
- Re-center the group so the waveform sits centered on the moving point along the path.

No other file or component is touched.
