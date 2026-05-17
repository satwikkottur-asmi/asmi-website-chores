# Act 2 rewrite: GSAP ScrollTrigger + mobile-first density & interactivity

## Goal

Make the "Asmi calls 5 plumbers" scene feel deliberate, premium, and rock-solid on mobile. Replace the fragile sticky+IntersectionObserver setup with GSAP ScrollTrigger pinning, cut mobile density, and add real touch interactivity so the scene feels alive — not just a scrubbed cutscene.

## 1. Swap sticky + IO for GSAP ScrollTrigger

Replace the current `position: sticky` stage + invisible step markers + IntersectionObserver with a single pinned section driven by GSAP ScrollTrigger.

- One `<section>` of known height (`steps * 100svh + tail`).
- `ScrollTrigger.create({ trigger, start: "top top", end: "+=N", pin: true, scrub: 0.6 })`.
- A GSAP timeline maps scroll progress → discrete chapter index (0–4) via `snap` or progress thresholds.
- Chapter state still drives Framer Motion enter/exit for the inner elements (orb, lines, labels, Sarah's quote) — GSAP only owns pinning + progress.
- Use `ScrollTrigger.config({ ignoreMobileResize: true })` so iOS Safari URL-bar collapse doesn't re-trigger pin math.
- Refresh on resize via `ScrollTrigger.refresh()` debounced.

Why this fixes drift: pinning is deterministic, end is an absolute pixel distance, and the dynamic viewport toolbar no longer shifts the active band.

## 2. Cut mobile density

5 endpoints around a 124px orb in a 360px viewport will always feel cramped. On mobile:

- Show **3 plumbers**, not 5 (Bay Area, Rapid Rooter, Mr. Fix-It). Copy still says "Asmi calls 5 plumbers" — the visual is representative, not literal. Alternative: keep 5 but arrange as a vertical list instead of radial fan.
- Recommendation: vertical stacked list on mobile (each plumber a row with dot + name + status), radial fan stays for desktop. Reads like a live call log, scales naturally, no overlap math needed.
- Increase orb to ~140px on mobile so it remains the focal point.

## 3. Bump mobile typography

- Step label: 0.78rem → 0.9rem, tracking 0.18em.
- Endpoint / row labels: 0.7rem → 0.88rem.
- Sarah's quote: keep 1.5rem but tighten line-height to 1.2.
- Confirm pill: 10px → 12px.

## 4. Real touch interactivity

Currently zero interaction during the scene. Add:

- **Tap a plumber row/dot** → that row pulses, plays a short "ring" wave, shows a mini status ("ringing…"). Doesn't change the scripted outcome (Mike still wins), just makes the scene feel responsive.
- **Orb tap** → ripple pulse + subtle haptic-feel scale.
- **Confirm pill tap** → bounce + checkmark redraw.
- All taps use `whileTap` + a tiny audio-less "tick" animation. `WebkitTapHighlightColor: transparent` everywhere.

## 5. Performance pass

- Pause all 5 traveling waves once `isConfirmed` (already partially done) and only render the winner wave.
- During `dial`, cap concurrent waves to 3 on mobile.
- Replace `<animateMotion>` SVG waves (heavy on mobile Safari) with a single GSAP `motionPath` tween per branch, paused/killed on chapter exit.
- Memoize `branches` with stable refs; debounce `ResizeObserver` to 150ms.
- Lower orb pulse FPS via `transition.repeatDelay`.

## 6. Confirm-state visual hierarchy

- Non-winners: opacity 0.5 + 60% desaturation (not 0.18 — that reads as broken).
- Winner: keep sage pill, add a soft sage glow ring around its dot.
- Background warm-wash subtly shifts toward sage-tinted on confirm to reinforce success.

## 7. Act 5 mobile cloud polish (carry-over)

While in the area:

- Replace `Math.sin(index)` pseudo-scatter with a seeded random per word so positions actually look scattered.
- Suppress autoLit on a word the user has tapped for 4s (respect user intent).
- Add `layout` prop on motion spans for smoother reflow.

## Technical details

**Files to update**
- `src/components/asmi/Act2CallViz.tsx` — full rewrite of scene shell, new `MobilePlumberList` component, GSAP timeline.
- `src/components/asmi/Act5.tsx` — scatter + autoLit tweaks.
- `src/styles.css` — minor token adds if needed (sage glow, desaturated stone).
- `package.json` — add `gsap` (free ScrollTrigger is included in the standard package).

**New deps**
- `gsap` (~70kb gzipped, tree-shakeable; only import `gsap` + `ScrollTrigger`).

**GSAP skeleton**

```text
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=" + window.innerHeight * 4,
        pin: pinRef.current,
        scrub: 0.6,
        snap: { snapTo: [0, 0.25, 0.5, 0.75, 1], duration: 0.3 },
        onUpdate: (self) => setActive(Math.round(self.progress * 4)),
      },
    });
  }, sectionRef);
  return () => ctx.revert();
}, []);
```

## Validation

- Desktop: scene pins, 5 chapters reveal in order, releases cleanly into Act 3.
- iOS Safari (real device): URL bar collapse does not break pin or skip steps.
- Android Chrome mid-range: 60fps during dial chapter.
- Mobile: no label overlap, all text legible at arm's length, tapping plumbers gives clear feedback.
- No blank gap between Act 2 and Act 3.

## Out of scope

- Copy changes to Sarah's quote or step labels.
- Act 1/3/4/6 changes.
- New colors beyond minor sage/stone tweaks.
