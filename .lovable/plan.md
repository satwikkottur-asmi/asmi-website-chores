# Fix scroll pacing between Act 2 (calls) and Act 3 (moments)

## The problem

Two things compound to create the "slow then sudden skip" feeling around the calls scene:

1. **Act 2 is over-pinned.** The pinned scene reserves one full viewport of scroll per step (`pinViewports = stepCount`), so on desktop the four steps (`ask → listen → dial → confirm`) consume ~4 viewports. The middle "Asmi works the phones" step feels like wading because nothing changes for ~33% of the pin distance. On mobile it's 2 viewports for 3 steps — same issue, smaller scale.
2. **The handoff into Act 3 collapses.** The last 8% of the pin fades the whole stage out, then there's only a 40svh spacer, then Act 3 Moment 1 (`01 — Asmi calls you`) doesn't fade its headline in until `scrollYProgress` 0.18 of its own section. So the user scrolls through: fading Act 2 → empty spacer → empty top half of Act 3 → headline pops in. Reads as "I just skipped 3–4 screens."

## The fix

Three small, coordinated adjustments. No new components, no copy changes.

### 1. Tighten Act 2 pin distance

`src/components/asmi/Act2CallViz.tsx`

- Desktop: `pinViewports = stepCount - 1` (so 4 steps → 3 viewports of scroll instead of 4). Each step transition still gets ~1 viewport, but the final "Done by 9:11" hold no longer eats a dedicated viewport.
- Mobile: `pinViewports = 1.5` (was 2) — 3 steps over 1.5 viewports feels brisk, not skimmed.
- Increase `scrub` slightly (desktop `0.5 → 0.7`, mobile `0.3 → 0.5`) so the wheel-to-step mapping feels smoother, not snappier.
- Update the `<section>` height to match (`${pinViewports + 1} * 100svh` — the `+1` reserves the visible pinned viewport itself; today it uses `steps.length * 100svh` which double-counts).

### 2. Soften the Act 2 → Act 3 handoff

`src/components/asmi/Act2CallViz.tsx`

- Replace the abrupt last-8% opacity fade with a gentler last-15% fade, and clamp the floor at `0.0` only at `p >= 0.99` (was `> 0.92`). This keeps "Done by 9:11" legible right up to the handoff instead of vanishing while the user is still mid-scroll.

`src/routes/index.tsx`

- Reduce the post-Act 2 spacer from `40svh` to `16svh`. The Act 2 pin already releases on a held final frame; the big spacer is what makes the next scroll feel like a jump cut.

### 3. Bring Act 3 moments in sooner

`src/components/asmi/Act3Moments.tsx`

- Move the headline fade-in window earlier: `opacity` keyframes `[0.02, 0.18, 0.68, 0.84]` → `[0.02, 0.10, 0.72, 0.88]`. Headline becomes readable as soon as the section enters the viewport instead of waiting until it's near center.
- Match the `y` rise: `[0.02, 0.28]` → `[0.02, 0.18]`.
- Ambient layer fade-in: `[0.2, 0.32, ...]` → `[0.10, 0.22, ...]` so the visual backdrop arrives with the headline, not after it.

## Out of scope

- Copy, typography, Act 1, Act 4, Act 5, Act 6.
- Real audio wiring, field-note cards, languages cloud.
- Reduced-motion handling (already covered globally in `src/styles.css`).

## Technical notes

Files edited:

- `src/components/asmi/Act2CallViz.tsx` — `pinViewports`, `scrub`, section height, fade-out window.
- `src/routes/index.tsx` — spacer height between `Act2CallViz` and `Act3ThreeMoments`.
- `src/components/asmi/Act3Moments.tsx` — `useTransform` keyframe ranges inside `Moment`.

No dependency or token changes. ScrollTrigger config (`ignoreMobileResize`, `anticipatePin`) stays as-is.
