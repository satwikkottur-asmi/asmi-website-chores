# Reorder sections (both) + rework Act 2/3 on mobile only

## Part A — Section reorder (mobile + desktop)

Move Act 5A "this week with asmi / a few things it handled." so it appears *before* Act 4 "From plumbers to prescriptions." on every viewport.

- In `src/components/asmi/Act5.tsx`: extract the 5A Stories block (heading + `FieldNoteCard` map, plus `STORIES` data, `FieldNoteCard`, and `activeIndex` state) into a new exported component `Act5Stories`. Remove it from `Act5` (which keeps only 5B "No app." and 5C "Languages").
- In `src/routes/index.tsx`: insert `<Act5Stories />` between `Act3ThreeMoments` and `Act4Cloud`, on both desktop and mobile.

New order, both viewports:
```text
Act 1 → Act 2 (desktop only, see Part B) → Act 3 → Act 5 Stories → Act 4 Cloud → Act 5 (No app. + Languages) → Act 6
```

## Part B — Mobile-only: kill the pin, merge Act 2 + Act 3

Desktop keeps the current pinned `Act2CallViz` exactly as-is. On mobile, Act 2's pin goes away and its content folds into Act 3 as three normally-scrolling, auto-playing scenes.

### `src/components/asmi/Act2CallViz.tsx`
- Wrap the entire returned `<section>` in `isMobile ? null : (...)` so on mobile the component renders nothing. Keep all desktop logic untouched.

### `src/components/asmi/Act3Moments.tsx`
- Add a mobile branch (`useIsMobile`). Desktop branch = current 3 `Moment` components unchanged.
- Mobile branch: three stacked scenes, each `min-h-[100svh] flex items-center justify-center`, normal page scroll (no `useScroll`, no pin, no GSAP):

  **Scene 1 — Sink is leaking** (replaces current Moment 1 on mobile)
  - Label `01` + "Sarah · 9:03 AM" mono kicker
  - Big serif italic: *"Sink is leaking. Can you find a plumber today?"*
  - `whileInView` fade + rise

  **Scene 2 — Asmi calls plumbers** (replaces current Moment 2 on mobile)
  - Label `02` + headline "Asmi works the phones."
  - New small component `PlumberCallLoop`: stacked card list of 5 rows — Bay Area Plumbing, Rapid Rooter, Pacific Plumbing Co, Mr. Fix-It, Joe's Plumbing.
  - Auto-loop, no scroll input: `setInterval` cycles a `phase` state every ~5–6s through `dialing → resolving → hold → reset`.
    - `dialing`: all 5 rows show a pulsing terracotta dot + "calling…" subtext.
    - `resolving`: Bay Area row turns sage/green, shows ✓ + "Mike · Today 2pm". Other 4 fade to ~45% opacity + desaturate, subtext flips to "no answer" / "voicemail" / "booked til Thu" / "no answer".
    - `hold`: keep resolved state visible ~2s.
    - `reset`: fade everything back to neutral, then loop.
  - Reuse the visual styling from the existing `PlumberRow` in `Act2CallViz.tsx` (sage winner card, dimmed losers, pulsing dot) — copy the row markup inline into `PlumberCallLoop` so Act3 has no dependency on Act2.
  - Pause the interval when the scene is offscreen via `IntersectionObserver` (CPU + battery).

  **Scene 3 — Done** (unchanged)
  - Keep the existing `MessageBubble` Moment 3 as-is.

### Why auto-loop, not scroll-driven
User wants uniformly smooth scrolling on mobile — no pin, no scrub. An in-view auto-loop plays the call-resolution beat without hijacking the scroll.

## Files touched
- `src/components/asmi/Act5.tsx` — extract `Act5Stories`.
- `src/routes/index.tsx` — render `<Act5Stories />` before `<Act4Cloud />`.
- `src/components/asmi/Act2CallViz.tsx` — early-return `null` on mobile.
- `src/components/asmi/Act3Moments.tsx` — add mobile branch with 3 auto-playing scenes incl. `PlumberCallLoop`.

## Not touched
- Desktop Act 2 (pinned plumber visualization), Act 4 cloud, Act 6, Nav, Footer — all unchanged.
- No content edits to existing copy beyond what's listed above.
