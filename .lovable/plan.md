# Hero title — scroll-driven particle dissolve

Replace the current word-by-word fade on the Act 1 headline ("The screen era is over.") with a particle dissolve effect: as the user scrolls, the letters break into small particles that drift up and to the right like windblown dust, then fade out. Reference: https://codepen.io/TaminoMartinius/pen/AobWbm

The rest of the page (wordmark, CTA, BrushUnderline, atmosphere, all other Acts) stays exactly as-is.

## Behavior

- At scroll progress 0 → 0.4: title is solid, rendered as normal text (crisp, accessible, SEO-friendly).
- At progress 0.4 → 0.7: title transitions into a canvas overlay; pixels lift off as particles, drifting up-right with slight turbulence, fading as they go.
- At progress > 0.7: title fully gone (canvas cleared), wordmark fades in as today.
- Reverses smoothly on scroll back up.
- `prefers-reduced-motion`: skip particles, use the existing simple opacity fade.
- Mobile: lower particle density for performance; same behavior.

## Technical approach

In `src/components/asmi/Act1Opening.tsx`:

1. Add a new `ParticleTitle` component that renders:
   - A hidden/measured DOM `<h1>` for layout + accessibility (kept in normal flow, drives sizing).
   - An absolutely-positioned `<canvas>` overlay on top, same box.
2. On mount + resize: draw the headline text to an offscreen canvas, sample pixels on a grid (step ~3px desktop, ~5px mobile), and build a particle array `{x0, y0, vx, vy, life}`.
3. Subscribe to the existing `scrollYProgress` via `useMotionValueEvent`. Map progress 0.4–0.7 → dissolve amount `t` (0..1).
   - For each particle, compute `x = x0 + ease(t) * (drift + noise)`, `y = y0 - ease(t) * (lift + noise)`, `alpha = 1 - t`.
   - Particles activate staggered left→right (wind sweep) using `particle.threshold = x0 / width * 0.6`.
4. Use a single `requestAnimationFrame` loop only while `t > 0 && t < 1` to avoid idle cost. Render with `ctx.fillRect` (2x2 px) using espresso color `#2C2520`.
5. Toggle DOM `<h1>` opacity inversely (`1 - t`) so the canvas takes over seamlessly.
6. Remove the current per-word `Word` dim/translate effect (replaced by the dissolve).

Keep `statementY` / `statementScale` motion or drop them — drop them to let the dissolve carry the moment; keep `statementOpacity` only as the final clean-up past 0.7.

## Files

- Edit: `src/components/asmi/Act1Opening.tsx` (add ParticleTitle, swap word rendering).
- No new dependencies. Uses existing `motion/react` + canvas 2D.

## Out of scope

- No changes to Act2 waveform, Nav, other Acts, styles.css tokens, or routes.
