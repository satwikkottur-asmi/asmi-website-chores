# Fix plan: replace the fragile sticky scene with a step-based pinned sequence

## Goal

Rebuild the call animation so it feels deliberate and readable on desktop and mobile: one scroll beat reveals one piece of information, the scene stays visually locked while the sequence plays, and there is no dead space before or after it.

## Recommended approach

Replace the current single tall sticky section plus manual progress math with a chapter-based scrollytelling scene:

- A dedicated scene shell controls when the call stage is active.
- Four or five full-height step markers drive the sequence.
- The visualization stays fixed only while those markers are being traversed.
- Each step maps to a discrete state instead of a fragile continuous progress band.

This is more reliable than the current setup because it avoids scroll listener timing drift, reduces mobile viewport issues, and makes the release point exact.

## 1. Rebuild Act 2 as step chapters instead of one progress scrub

In `src/components/asmi/Act2CallViz.tsx`:

- Split the narrative into explicit chapters:
  1. Sarah asks
  2. Asmi listens
  3. Asmi calls 5 plumbers
  4. One confirms
  5. Result holds, then release
- Create one viewport-height marker per chapter.
- Drive the visible state from the active chapter using `IntersectionObserver` or per-step in-view tracking rather than raw `scrollY` math.
- Keep small within-step easing for polish, but make the sequence fundamentally state-based.

## 2. Use a pinned scene shell that does not depend on the current sticky behavior

In `Act2CallViz.tsx`:

- Replace the current “one section with one sticky child” setup with a scene wrapper that:
  - becomes fixed to the viewport while Act 2 is active
  - releases cleanly when the last step completes
- Use top and bottom sentinels so the pin/unpin timing is explicit.
- Use `100svh`/`100dvh`-safe sizing for mobile browsers.
- Ensure no ancestor of the pinned layer applies overflow or transforms that can break pinning.

## 3. Make every scroll beat reveal a single clear event

Adjust the animation language so the sequence is easy to consume:

- Step 1: Sarah’s request appears first, with strong contrast.
- Step 2: Asmi orb and “listening” state appear.
- Step 3: Plumber calls fan out one by one with clearer line and label contrast.
- Step 4: The confirmed plumber turns into the highlighted green result state.
- Step 5: Hold the confirmed state briefly before the page continues.

No step should advance to the next beat until the current one has had readable on-screen time.

## 4. Remove the dead space before and after the sequence

- Match scene length to the exact number of chapters instead of using an oversized scroll container.
- Start Act 2 immediately at the seam after Act 1.
- Reduce or remove any spacer gap before `Act3ThreeMoments`.
- Keep the final confirmed state visible until release so the section never fades into emptiness.

## 5. Tighten contrast and visual hierarchy in the highlight section

- Deepen the green confirmation palette so it reads clearly against the warm background.
- Increase contrast for labels and supporting text.
- Keep colors consistent with the rest of the site while making Act 2 feel like the focal moment.

## Files to update

- `src/components/asmi/Act2CallViz.tsx`
- `src/routes/index.tsx`
- `src/components/asmi/Act3Moments.tsx`
- `src/styles.css` if token adjustments are needed for stronger contrast

## Validation

- Desktop: the scene stays locked while each chapter reveals in order.
- Mobile: the same sequence remains readable without sticky drift or early release.
- No large blank gap appears after Act 2.
- The user can clearly read each beat before the next one begins.
