# Restore visible gradient wash on FieldNoteCard playback

The sweep already exists in `FieldNoteCard` (Act5.tsx, lines ~608–620) but is invisible because the `story.tint` values are very low-alpha (0.10–0.16) and the sweep layer uses `mixBlendMode: multiply` on a cream background — the effect washes out to nothing.

## Fix

In `src/components/asmi/Act5.tsx`:

1. **Bolder sweep gradient.** Replace the sweep's `background` with a gradient that uses a stronger, opaque-ish version of the story accent (derived from `story.tint` but at higher alpha, ~0.45–0.55), so the band reads clearly as it travels across the card during playback.

2. **Drop `mixBlendMode: multiply`** on the sweep layer — switch to normal blending so the band shows on cream paper without being eaten.

3. **Slightly widen the band** (transparent 0% → tint 50% → transparent 100% with a tighter peak) so it feels like a soft wash, not a hairline.

4. **Keep the corner-bloom layer and the ambient bloom behind text untouched** — only the moving sweep band changes.

5. **Per-story accent color**: introduce a `story.accent` alongside the existing `tint`, set to the same hue but at ~0.5 alpha (terracotta, sage, amber). Use `accent` for the sweep, keep `tint` for the soft blooms so the existing softness is preserved.

## Files touched
- `src/components/asmi/Act5.tsx` — add `accent` to each story, update the sweep `<span>` styles.

## Not touched
- Audio playback logic, phrase reveal, progress timing, card layout, dimming behavior, Act 2/3/4/6.
