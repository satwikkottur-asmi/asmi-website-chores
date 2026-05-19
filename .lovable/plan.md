# Merge Act 2 + Act 3 into a single auto-playing scene; reorder cloud

Get rid of the GSAP pinning in Act 2. The plumber-call beat becomes Step 2 of a new unified Act 3 that plays on its own (no scroll-drive, no pinning), then naturally flows into "Asmi handles it." and "Done." Then move the "From plumbers to prescriptions" cloud so it appears *before* "No app. No new habit.".

## New flow (top of page → down)

```text
Act 1  Opening (unchanged)
Act 3  Three moments — auto-playing, no pin
       ├ Step 1  "Sink is leaking. Can you find a plumber today?"   (Sarah ask, was Act 2 intro)
       ├ Step 2  Asmi calls 5 plumbers — Bay Area turns green, rest fade   (was Act 2 climax, now auto-loops)
       └ Step 3  Done. ✓ Bay Area Plumbing · Mike · Today 2pm   (unchanged moment 3)
Act 4  From plumbers to prescriptions (cloud)   ← moved earlier
Act 5  No app. No new habit. / 50+ languages   (unchanged)
Act 6  Your day, handled. (close)
```

Net effect: one continuous, smooth-scrolling story. No sticky pin, no 200-300vh tall scroll sections in the middle.

## Files

### `src/components/asmi/Act3Moments.tsx` — rewrite

Replace the current 3 `Moment` blocks. New structure: a single `<section>` containing three full-viewport scenes stacked vertically. Each scene uses `whileInView` (once: false, amount: 0.5) so it plays whenever it enters view — no GSAP, no pin, no scroll-scrub.

- **Scene 1 — "Sink is leaking"**
  - Label `01` + Sarah timestamp ("Sarah · 9:03 AM")
  - Big serif italic line: *"Sink is leaking. Can you find a plumber today?"*
  - Fades in on enter
- **Scene 2 — Plumber calls (auto-loop)**
  - Label `02` + headline "Asmi works the phones."
  - A small **PlumberCallLoop** component: 5 rows (Bay Area Plumbing, Rapid Rooter, Pacific Plumbing Co, Mr. Fix-It, Joe's Plumbing).
  - Auto-loop using `setInterval` driving a local `phase` state: `idle → dialing (all rows pulse terracotta) → resolving (Bay Area turns sage/green + ✓, others dim) → hold → reset`. Loop length ~6s, repeats forever while in view (pause when `!inView` via IntersectionObserver to save CPU).
  - Reuse visual style from `MOBILE_PLUMBERS` rows in current `Act2CallViz.tsx` (sage winner card, dimmed losers, pulsing dot). Lift the row markup into this component so we don't import Act2.
- **Scene 3 — Done**
  - Unchanged: `MessageBubble` with "✓ Bay Area Plumbing · Mike · Today 2pm".

Each scene = `min-h-screen flex items-center` (not strict `h-screen`, so mobile address bar doesn't clip). Smooth normal scrolling between them.

### `src/routes/index.tsx` — reorder + remove Act 2

```tsx
<Act1Opening sectionRef={heroRef} />
{/* Act2CallViz removed — folded into Act3 */}
<Act3ThreeMoments />
<OrganicDivider />
<Act4Cloud />     {/* "From plumbers to prescriptions" — now before Act5 */}
<Act5 />
<Act6Close />
```

Also delete the `<div aria-hidden style={{ height: "40svh" }} />` spacer that used to follow the pinned Act 2.

### `src/components/asmi/Act2CallViz.tsx` — delete

No longer used. Removes the GSAP ScrollTrigger dependency at this point in the page (still fine to leave `gsap` installed).

## Why auto-loop instead of scroll-driven

User wants smooth, uniform scrolling across the whole site — no pin, no scrub. An in-view auto-loop animation reads as "alive" without hijacking scroll. IntersectionObserver pauses the interval when off-screen so it isn't burning cycles.

## Mobile/desktop

One layout for both — the call rows already work well at mobile width (≤24rem column, centered on desktop). No separate desktop "branching lines" visualization; the row-based version is clearer and lighter.

## Not touched

- Act 1, Act 4 (cloud internals), Act 5, Act 6 — content unchanged.
- Nav, ScrollProgress, footer — unchanged.
