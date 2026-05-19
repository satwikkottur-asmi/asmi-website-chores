# Update Act 5 field-note stories + wire real audio

Update the three "this week with asmi" cards in `src/components/asmi/Act5.tsx`
and attach the uploaded recordings so each card plays the real call.

## Copy changes (STORIES array)

**Story 1 — Dr. Weng's office**
- `"got Sarah on the primary care waitlist."` → `"got Jonathan on the primary care waitlist."`
- `"tomorrow, 10am."` → `"tuesday, 10am."`

**Story 2 — HVAC**
- No copy changes.

**Story 3 — replace the "mom in Nigeria" story entirely**
- kicker: `"sunday evening · in Spanish"`
- phrases:
  1. `"called grandpa in Spain."`
  2. `"he has pain."`
  3. `"he took his medicines."`
- tag: `"check-in logged"`
- duration: keep `"3:20"` (will be overridden by real audio length)
- accent/tint/tilt: unchanged (clay palette still fits)

## Audio wiring

Copy the three uploads into `public/audio/`:
- `user-uploads://Doc_Sandra_Call.mp4`  → `public/audio/doc-sandra-call.mp4` (story 1)
- `user-uploads://HVAC_Call.mp4`        → `public/audio/hvac-call.mp4` (story 2)
- `user-uploads://Spanish_Call_Grandpa.mp4` → `public/audio/spanish-grandpa-call.mp4` (story 3)

Set each story's `src` field to the matching `/audio/...` path. The existing
`FieldNoteCard` already prefers real audio when `story.src` is set
(uses `HTMLAudioElement`, swaps the visual timer for the real duration, and
calls `onStop` on `ended`), so no component logic changes are needed.

## Technical notes

- Files are `.mp4` containers but audio-only — `new Audio(src)` handles mp4
  audio tracks in all evergreen browsers, so no transcoding.
- Files served from `public/` are referenced by absolute path (`/audio/...`),
  no import needed.
- Only `src/components/asmi/Act5.tsx` is edited; no new dependencies.
