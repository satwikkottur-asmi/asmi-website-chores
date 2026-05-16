# Fix plan: make the hero-to-call sequence work exactly as intended

## Goal

Restore the shatter transition and make the call animation begin immediately at the seam, stay pinned while the full sequence plays, and release only after the green confirmed state and final message have both had time on screen.

## 1. Restore the missing shatter effect

Problem: the shatter effect was removed from the route, so the transition beat is gone entirely.

Fix:
- Re-add `HeroShatter` to `src/routes/index.tsx`.
- Rebuild `HeroShatter.tsx` as a one-shot overlay triggered by a shared handoff state, not by an independent `window.scrollY` listener.
- Use a fixed-duration animation (~650–750ms) so the effect feels intentional and not tied to scroll jitter.
- Keep the visual language already approved: the headline breaks into shards, brief flash, Act 2 revealed underneath.

## 2. Make Act 2 start right away instead of after a dead scroll zone

Problem: Act 2 currently has too much empty intro distance. The user scrolls into a mostly blank frame before the real call motion starts.

Fix in `Act2CallViz.tsx`:
- Start the sticky section earlier and front-load the content so the orb, branches, and first call beat are visible as soon as the user crosses out of the hero.
- Compress the silent intro band to a very small slice of progress:
  - `intro` `0.00–0.08`
  - `dialing` `0.08–0.42`
  - `resolved` `0.42–0.80`
  - `outro` `0.80+`
- Move caption/speech opacity ramps earlier so there is no blank hold before the call sequence is readable.
- Ensure the first waveform motion is already active during the early dialing window.

## 3. Keep the call section pinned until everything is revealed

Problem: the user can scroll a long distance without getting a satisfying locked sequence, and the release timing does not align with the final reveal.

Fix:
- Re-time the sticky container so the visible narrative is:
  1. hero shatters
  2. call fans out
  3. winner turns green
  4. closing message appears
  5. only then does the page continue
- Tune the section height and fade ranges together instead of only increasing raw height.
- Hold the green confirmed state on screen before the closing copy fades in.
- Hold the closing copy on screen before the sticky stage fades out.

## 4. Use one shared transition state across Act 1, shatter, and Act 2

Problem: the current pieces are acting independently, which creates desync and awkward handoff timing.

Fix:
- Lift a small transition state into `src/routes/index.tsx`.
- `Act1Opening` reports when the headline has reached the shatter threshold.
- `HeroShatter` reads that same state and plays exactly once.
- `Act2CallViz` uses that same handoff state to align its opening beat so the call is already present behind the shatter.

## 5. Smoothness and performance guardrails

To prevent another janky transition:
- Avoid `window` scroll listeners for the handoff logic.
- Keep shatter transforms to `transform` + `opacity`; use minimal blur only if it remains smooth.
- Keep the pinned scene visually full at every frame — no blank cream screen between sections.
- Preserve reduced-motion fallback as a quick cross-fade.

## Files to update

- `src/routes/index.tsx`
- `src/components/asmi/Act1Opening.tsx`
- `src/components/asmi/Act2CallViz.tsx`
- `src/components/asmi/HeroShatter.tsx`

## Validation

- Desktop: first scroll out of hero immediately reveals the call stage.
- The call stage stays pinned through the green winner and the final “She never opened an app” beat.
- No blank seam between hero and Act 2.
- Shatter effect is visibly present and smooth.
