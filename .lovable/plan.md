# Fix the Act 2 → Act 3 scroll jump (keep Act 2 pacing intact)

## The problem

Act 2 pacing (the calls scene) is deliberately slow — keep it. The break happens at the handoff into Act 3:

1. Act 2's pin fades the whole stage out over the last 8% of its scroll, so "Done by 9:11" disappears while the user is still scrolling.
2. Then a 40svh empty spacer.
3. Then Act 3 Moment 1 (`01 — Asmi calls you`) keeps its headline invisible until `scrollYProgress` 0.18 of its own section (with `offset: ["start end", "end start"]`, that's well after the section enters view).

The three empty stretches stack. On mobile (shorter viewport, faster flicks) the user blows past all of Moment 1 and lands on Moment 2 or 3, feeling like 3 screens were skipped.

Act 2 itself is not touched.

## The fix

Three coordinated, minimal changes — only the handoff, not the pinned scene.

### 1. Don't fade Act 2 out so early

`src/components/asmi/Act2CallViz.tsx` (the `onUpdate` inside the ScrollTrigger, ~line 84)

- Change the fade window from "last 8% (p > 0.92)" to "last 4% (p > 0.96)" so the final "Done by 9:11" frame stays fully visible right up to the pin release. No change to pin duration, scrub, or step mapping.

### 2. Shrink the dead spacer between Act 2 and Act 3

`src/routes/index.tsx` (the `<div aria-hidden style={{ height: "40svh" }} />` between `Act2CallViz` and `Act3ThreeMoments`)

- Reduce from `40svh` to `12svh`. Just enough breath — not a blank screen.

### 3. Bring Act 3 moment content in as soon as the section enters view

`src/components/asmi/Act3Moments.tsx` (`Moment` component, `useTransform` ranges)

- Headline `opacity`: `[0.02, 0.18, 0.68, 0.84]` → `[0.02, 0.10, 0.74, 0.90]`. Becomes readable when the section enters, holds longer before fading out.
- Headline `y` rise: `[0.02, 0.28]` → `[0.02, 0.16]` so the lift settles by the time it's mid-viewport instead of still moving.
- Ambient layer `opacity`: `[0.2, 0.32, 0.68, 0.84]` → `[0.08, 0.20, 0.74, 0.90]` so the backdrop is already there when the headline appears.

This is especially important on mobile, where each `h-screen` moment is short and a fast flick easily covers two of them — pulling the visible window earlier guarantees the user sees the headline of Moment 1 (and 2 and 3) instead of arriving at an empty frame.

## Out of scope

- Act 2 step pacing, pin duration, scrub, or step copy — explicitly preserved.
- Act 1, Act 4, Act 5, Act 6.
- Mobile-specific Act 3 layout, real audio, field-note cards, languages cloud.

## Technical notes

Files edited (3, surgical):

- `src/components/asmi/Act2CallViz.tsx` — fade-window threshold only.
- `src/routes/index.tsx` — spacer height between Act 2 and Act 3.
- `src/components/asmi/Act3Moments.tsx` — `useTransform` keyframe ranges inside `Moment`.

No dependency, token, layout, or copy changes. No new components.
