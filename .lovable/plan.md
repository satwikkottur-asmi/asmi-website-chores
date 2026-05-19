# Three fixes: durations, audio progress line, restore Act 6 design

## 1. Update story durations (`src/components/asmi/Act5.tsx`)

Match the real recording lengths in the `STORIES` array:

- Story 1 (Dr. Weng): `"0:47"` → `"3:04"`
- Story 2 (HVAC): `"1:12"` → `"1:49"`
- Story 3 (grandpa): `"3:20"` → `"2:11"`

These are visible as the bottom-right timestamp on each card. The real audio
element drives playback progress, so the displayed string is purely a label.

## 2. Fix the gradient-wash sweep on the card

Keep the existing subtle gradient wash — no new progress bar. Today it does
not visibly move because the transform range is tiny:

```
transform: `translateX(${(progress - 0.5) * 30}%)`  // ranges -15% → +15%
```

Fix in `FieldNoteCard` (Act5.tsx, the second wash `<span>`):

- Widen the sweep range so it actually travels across the card: use
  `translateX(${-60 + progress * 120}%)` (start off-canvas left at -60%,
  end off-canvas right at +60%).
- Add `transition: transform 80ms linear` so the rAF progress updates
  interpolate smoothly instead of snapping.
- Leave the gradient direction, tint, blend mode, and opacity behaviour
  unchanged.

The `progress` state is already updated every animation frame from the real
`<audio>` element — no state-machine changes needed.

## 3. Restore the original "Your day, handled." section (`src/components/asmi/Act6Close.tsx`)

The current file is a 200vh sticky scroll-driven sequence. Revert to the
original `whileInView` design that existed when the iMessage CTA first
shipped — same one currently used as the `prefersReducedMotion` fallback
inside this file. That design:

- Standard section (no sticky, no double height)
- Ambient blobs backdrop at ~50% opacity
- `Your day,` (serif) fades + rises in
- `handled.` (serif italic, terracotta) fades + rises in shortly after
- Subtitle `Join thousands who talk to Asmi every morning.`
- `<WaitlistForm size="lg" />` centered
- `No app to download.` caption below

Use `whileInView` with `once: true` and small stagger delays (0.15s between
elements) so the section assembles itself as it scrolls into view — the
"magical" feel from the original, without the long sticky-scroll runway.

Keep the section id `start` so the nav CTA still scrolls here. Keep
`AmbientBlobs` and `WaitlistForm` imports. Drop `useScroll`, `useTransform`,
`useRef`, and the `useStage` helper.

## Files touched

- `src/components/asmi/Act5.tsx` — durations + progress bar
- `src/components/asmi/Act6Close.tsx` — full rewrite back to static reveal

No new deps, no asset changes.
