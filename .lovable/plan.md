# Three fixes: durations, audio progress line, restore Act 6 design

## 1. Update story durations (`src/components/asmi/Act5.tsx`)

Match the real recording lengths in the `STORIES` array:

- Story 1 (Dr. Weng): `"0:47"` → `"3:04"`
- Story 2 (HVAC): `"1:12"` → `"1:49"`
- Story 3 (grandpa): `"3:20"` → `"2:11"`

These are visible as the bottom-right timestamp on each card. The real audio
element drives playback progress, so the displayed string is purely a label.

## 2. Make the playing-progress line actually move on the card

Today the only "progress" visual on `FieldNoteCard` is a subtle gradient wash
that translates from `-40%` → roughly `+10%` — easy to miss. Add an explicit
hairline progress bar pinned to the bottom edge of the card that fills left →
right as `progress` advances (0 → 1).

Implementation in `FieldNoteCard` (Act5.tsx):

- Add an absolutely-positioned 2px-tall span at `bottom: 0; left: 0; right: 0;`
  inside the existing `motion.button` (which already has `overflow-hidden`).
- Track rail uses `story.tint` at low opacity; fill uses `story.accent`.
- Fill is a child span with `width: ${progress * 100}%`, `height: 100%`,
  `transition: width 80ms linear` so the rAF updates look smooth.
- Only render when `isActive || finished` (rail stays hidden at rest, fill
  remains full when finished, snaps back to 0 on next play via existing
  `setProgress(0)`).

No changes to the existing progress state machine — it already updates from
the real `<audio>` element every animation frame.

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
