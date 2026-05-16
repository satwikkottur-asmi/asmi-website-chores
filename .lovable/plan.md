# Hero title — proper particle dissolve (rebuild)

## What's wrong today

The current implementation renders the title twice:
- A real DOM `<h1>` (clean serif, antialiased by the browser).
- A `<canvas>` overlay that re-rasterizes the same text from `getComputedStyle` and samples it on a 3px grid.

Then it crossfades between them as scroll progresses. The canvas version doesn't match the DOM version pixel-for-pixel (different rasterizer, sparse grid → visible dot pattern, slight metric drift), so during the transition you see a "ghost" or "alternate" version of the headline. That's the hacky feel in screenshot 2.

## Goal

One single visual representation of the headline from the start. The real text appears to disintegrate into particles that drift away. No duplicate, no crossfade between two renderings.

## Approach

Render the headline entirely on canvas from the moment the page loads, at a density high enough that it looks identical to the native serif `<h1>`. The DOM `<h1>` is kept only for accessibility/SEO (`sr-only`, visually hidden). There is never a moment where both renderings are visible.

### Concretely

1. **Single source of truth = canvas.**
   - One `<canvas>` sized to the headline's natural bounding box (measured once via a hidden measuring `<h1>` with identical font styles, then removed/hidden).
   - `<h1>` element is `sr-only` (kept for screen readers / SEO).
   - No more crossfade between DOM text and canvas.

2. **High-fidelity rasterization (no dotted look at rest).**
   - Render at `devicePixelRatio` (capped at 2).
   - Wait for `document.fonts.ready` before sampling so the serif (Newsreader) is actually loaded.
   - Sample every pixel (step = 1 logical px, ~1.5–2 device px) instead of every 3px. At rest the particles pack densely enough to look like solid antialiased text.
   - Use the sampled alpha as the particle's base alpha (not a hard 0/1 threshold). This preserves the serif's edge antialiasing, so the rendered text reads as crisp type, not a halftone.
   - Particle color = espresso `#2C2520`; size = 1 device px square (or 1.2 px circle on hi-DPI).

3. **Dissolve driven by scroll.**
   - `scrollYProgress` 0 → ~0.25 maps to dissolve `t` 0 → 1, completing well before the next section.
   - Per-particle threshold seeded by `x / width` so the wind sweeps left → right (matches the reference codepen).
   - Once a particle's local progress > 0: drift right + lift up + sine wobble, alpha fades to 0.
   - At `t == 0` the canvas renders the headline statically (no animation cost, looks identical to native type).
   - `requestAnimationFrame` loop only runs while `0 < t < 1`.

4. **Sizing & layout stay identical.**
   - The wrapper still reserves the same space the `<h1>` used to take (so the BrushUnderline, CTA, asmi wordmark, and overall hero rhythm don't shift).
   - Done by keeping a visually-hidden `<h1>` in the flow with `visibility: hidden` (occupies space, not painted) and absolutely positioning the canvas on top of it.

5. **Reduced motion / fallback.**
   - `prefers-reduced-motion`: render the real `<h1>` normally, no canvas at all. Pure opacity fade as scroll passes.
   - Same fallback if Canvas 2D unavailable.

6. **Hero pin duration stays at ~2 viewports** (already changed) so dissolve has room to complete before Act 2 appears.

## Why this fixes the complaint

- No alternate/ghost text — the canvas IS the title, from page load.
- Dense per-pixel sampling with alpha preserved = at rest, the canvas is visually indistinguishable from the DOM serif. No dotted/stippled look until particles start to scatter.
- Single render path → no crossfade artifacts, no font/metric drift.

## Files

- Rewrite `ParticleTitle` inside `src/components/asmi/Act1Opening.tsx`. No other files touched.

## Out of scope

- No changes to other Acts, Nav, tokens, or routes.
- No new dependencies.
