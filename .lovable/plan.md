# Scroll-staged reveal for "Your day, handled." (Act 6)

Right now the closing section uses `whileInView` with `once: true`, so once any part of it crosses the viewport margin everything fades in together over ~1 second and then sits static. The earlier feel was a true scroll-driven cinematic — each line earning its place as the user moved down the page.

## What to change

Drive every element off the section's own scroll progress instead of a one-shot in-view trigger, so the closing reads as a slow, deliberate unveiling synced to the user's gesture.

Staged sequence as scroll progress goes 0 → 1 through the section:

1. **0.00 – 0.15** — ambient blobs deepen from faint to full warmth, a soft horizon glow rises from the bottom.
2. **0.10 – 0.30** — "Your day," rises from +40px with a gentle blur-to-sharp, letter tracking eases from loose to set.
3. **0.25 – 0.50** — "handled." swings in italic, slightly later and slower, with the terracotta color warming from muted to full saturation. A hairline brush underline draws across underneath.
4. **0.45 – 0.65** — "Join thousands who talk to Asmi every morning." fades up.
5. **0.60 – 0.80** — Waitlist form rises and settles; subtle scale from 0.96 → 1.
6. **0.78 – 0.95** — "No app to download." monogram caption fades in last.

To make scroll actually drive this, the section needs scroll runway. Increase its height to ~180vh and pin the inner content with `sticky top-0 h-screen` so the user scrolls *through* the reveal while the composition stays centered. On mobile, compress runway to ~150vh and shorten each stage slightly so it doesn't feel like dead scrolling.

Respect `useReducedMotion`: fall back to a single soft fade-in (no transforms, no pinning) when reduced motion is on.

## Technical details

File: `src/components/asmi/Act6Close.tsx`.

- Use `useScroll({ target: ref, offset: ["start end", "end start"] })` to get `scrollYProgress` for the whole section pass.
- For each element create a `useTransform` mapping its sub-range of progress to `opacity`, `y`, and (where noted) `filter: blur()`, `scale`, or color.
- Replace the current flex centering with a `sticky top-0 h-screen flex items-center` wrapper inside a tall outer `<section>` (≈180vh desktop, ≈150vh mobile via `clamp` or `h-[180vh] md:h-[200vh]` style).
- Keep existing copy, colors, typography, and `WaitlistForm` usage unchanged.
- Remove all `whileInView` / `viewport` props on the staged elements.
- Add a thin SVG brush stroke under "handled." driven by `pathLength` tied to progress 0.30 → 0.55, reusing the terracotta tone.
- Guard with `const prefersReducedMotion = useReducedMotion();` — when true, render the old simple `initial`/`animate` fade without scroll binding or sticky pin.

## Out of scope

- Other acts (1–5), `WaitlistForm` internals, copy changes, color tokens.
