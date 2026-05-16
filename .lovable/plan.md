# Fixes: Act 2 scroll lock, winner badge, mobile polish

## 1. Act 2 — keep the page locked until the full call story plays

Symptom: by the time the winning (green) line appears, the user has already scrolled past — the sticky stage has released too early, so the climax happens off-screen.

Fix in `Act2CallViz.tsx`:
- Lengthen the sticky scroll window: section height `h-[260vh] md:h-[240vh]` (was 185/168vh). More scroll = longer time the stage stays pinned at `top-0`.
- Re-tune phase thresholds so the green/winner moment lands mid-scroll, not at the end:
  - `intro` < 0.10
  - `dialing` 0.10–0.40
  - `resolved` 0.40–0.78 (full beat to read the green result)
  - `outro` ≥ 0.78
- Re-map opacity transforms to the new ranges so nothing fades while the resolved beat is on screen:
  - `speechOpacity` `[0.06, 0.14, 0.34, 0.42]`
  - `vizOpacity` `[0.82, 0.92]` (viz holds through the whole resolved beat)
  - `closingOpacity` `[0.72, 0.84]`
  - `captionOpacity` `[0, 0.06, 0.90, 0.96]`

Net effect: scroll drives the animation while the page stays put; only after the green winner has been visible for a real beat does the section release and the next section come in.

## 2. Winner badge — smaller

In `EndpointLabel` (resolved/winner branch): drop padding to `px-2 py-1`, set `fontSize: 11px` and `letterSpacing: 0.08em`, tighten `maxWidth` to `min(70vw, 230px)`, and soften the glow to `0 0 16px rgba(139,168,136,0.25)`. Keep the copy `✓ Bay Area Plumbing · Mike · Today 2pm`.

## 3. Hero → Act 2 shatter transition

Give "The screen era is over." a real payoff: the headline shatters and the call viz is revealed through the cracks.

New component `HeroShatter.tsx`, rendered as a fixed-position overlay between Act 1 and Act 2.

Beat:
1. Hero locks. Words assemble normally.
2. When Act 1 `scrollYProgress` crosses `0.92` (or Act 2 enters `intro`), trigger a one-shot ~700ms shatter timeline.
3. Each letter of the headline is split into ~6 angular shards (per-letter `<span>` wrappers, shards generated with a seeded RNG so layout is stable). Shards animate via Motion: `x` (random ±200), `y` (200–500 downward), `rotate` (±60deg), `opacity 1→0`, `filter: blur(0→3px)`, staggered 8ms per shard.
4. A subtle linen→cream flash (`background` overlay, 120ms) hides the seam while Act 1 sticky releases and Act 2 sticky engages.
5. Through the clearing shards, the Act 2 orb is already pulsing — call viz takes over.

Implementation notes:
- Trigger source of truth: a single shared `useMotionValue` (or a `useState` lifted to `index.tsx`) flipped by Act 1's scroll threshold. Act 2 reads the same value to make sure its `intro` phase aligns with the shatter completing.
- Shatter is a fixed-duration timeline, NOT scroll-frame-bound — avoids jank during scroll-jacking. Scroll-lock for the call story (section 1) stays exactly as planned.
- Shards are pure CSS transforms, no canvas/WebGL.
- `prefers-reduced-motion`: skip the shatter, fall back to a 250ms cross-fade.
- Mobile: same effect, shard count halved (~3 per letter) for perf.

Files: new `src/components/asmi/HeroShatter.tsx`, small wiring edits in `src/routes/index.tsx`, and one threshold read in `Act2CallViz.tsx`.

## 4. Mobile fixes

### 4a. `Act1Opening.tsx` — hero vertical centering
The sticky container is `h-screen flex flex-col items-center justify-center`, but the absolutely-positioned wordmark (`md:top-[58%]`) plus the in-flow CTA block push the visual center upward on mobile (the headline ends up near the top). Fix:
- Remove the mobile reliance on `justify-center` for the headline; explicitly position the headline block with `mt-[18vh]` on mobile so it sits closer to optical center for a tall mobile viewport, and keep the wordmark/CTA stacked below.
- Reduce the headline clamp lower bound so 5 words fit on two lines without dominating the viewport: `clamp(2.2rem, 11vw, 14rem)`.
- Add `gap-6` between headline and CTA stack on mobile so they read as one centered group.

### 4b. `Act5.tsx` — mobile language cloud
Currently mobile uses a flex-wrap list. Replace with the same scattered absolute-positioned cloud the desktop uses, scaled to mobile:
- Render `LANGUAGES` (full list, not filtered) with the existing `langPos` math in an absolutely-positioned container `h-[70vh] max-h-[560px]`.
- Mobile size map: `sm: 0.85rem`, `md: 1.1rem`, `lg: 1.55rem`, `xl: 2.2rem` so a few words stand out and the rest recede, matching the desktop hierarchy.
- Tighten `RING_R` to `[10, 22, 32, 42]` only at small widths via a `useIsMobile` branch to keep labels inside the viewport.
- Drop the `MOBILE_LANGUAGES` filter and the wrap markup.

### 4c. General mobile font sizes
Sweep the most-visible mobile text and raise the lower bound of each `clamp()` so nothing reads as cramped on a 390px screen:
- `Act5` section H2s: `clamp(2.4rem, 6vw, 5rem)` → `clamp(2.8rem, 9vw, 5rem)`.
- `Act5` story headlines: `clamp(24px, 4.5vw, 44px)` → `clamp(26px, 6vw, 44px)`.
- `Act5` story body: `fontSize: 18` → `clamp(16px, 4.2vw, 18px)`, line-height 1.6.
- `Act5` Channel word: fixed `48` → `clamp(38px, 9vw, 48px)`.
- `Act5` Channel caption: `15` → `clamp(15px, 4vw, 16px)`.
- `Act2CallViz` speech bubble mobile: `1rem` → `1.15rem`; closing beat headline `clamp(2rem, 5vw, 4.4rem)` → `clamp(2.2rem, 7vw, 4.4rem)`.

## Out of scope
- No copy changes (besides the badge size, copy stays exactly as shown).
- No palette/typography/library changes.
- No backend, no new routes.

## Files touched
- `src/components/asmi/Act2CallViz.tsx`
- `src/components/asmi/Act1Opening.tsx`
- `src/components/asmi/Act5.tsx`
