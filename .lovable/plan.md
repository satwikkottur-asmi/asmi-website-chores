# Fix plan: make the call animation truly pinned, step-by-step, and readable

## Goal

Fix the highlight section so the viewport feels locked while scrolling through the call story: Sarah asks, Asmi calls 5 plumbers one by one, one confirms in a stronger green, and only then does the page move to the next section.

## What is failing now

- The call section is not behaving like a true pinned sequence.
- Motion is warning that a scroll container/target is not being measured correctly, which can cause bad offset tracking.
- The section reveals are tied to a long progress band, so the screen keeps drifting instead of feeling anchored.
- The reveal timing is too compressed, while the copy and winner state are too light for the most important section on the page.

## 1. Rebuild Act 2 around a real sticky stage

Update `src/components/asmi/Act2CallViz.tsx` so the animation is driven by a dedicated relative wrapper with a sticky child that stays at `top-0 h-screen` for the entire narrative.

Plan:
- Keep the outer section strictly responsible for scroll length.
- Keep the inner stage strictly responsible for the pinned visual frame.
- Move all reveal choreography to this pinned stage instead of letting the page feel like it is sliding past the content.
- Fix the Motion container/target setup so the scroll progress is measured against a stable relative element.

## 2. Make the sequence reveal one beat per scroll segment

Retime the progress map in `Act2CallViz.tsx` into slower, discrete bands:

1. **Sarah asks** — message and prompt fully readable before anything else changes.
2. **Asmi listens** — central orb and support label come in and hold.
3. **Asmi calls 5 plumbers** — branches and endpoints reveal one at a time, not all at once.
4. **One confirms** — winner upgrades into the strong green confirmation state and holds.
5. **Close** — closing copy appears while the winner remains visible briefly.
6. **Release** — only after the close beat finishes does the sticky section let the next section enter.

This will be done by widening each step range, adding deliberate hold ranges, and removing any fast overlap that makes the user miss information.

## 3. Remove the “screen keeps moving” feeling

The user experience should feel like scroll is scrubbing the animation while the frame stays put.

Plan:
- Increase the scroll length only where it gives each step breathing room.
- Delay Act 2 release until after the close state has had a visible hold.
- Pull Act 3 upward so there is no dead spacer after Act 2 finishes.
- Check the seam between Act 2 and Act 3 so the next section arrives immediately after release.

## 4. Strengthen contrast and hierarchy in the highlight section

The call section should read as the visual centerpiece of the page.

Plan:
- Deepen the green winner treatment using existing site tokens, not raw colors in component markup.
- Increase contrast for key labels, message copy, and endpoint text.
- Keep non-winning plumbers quieter, but still readable during their reveal.
- Preserve the site palette so the section feels more vivid without looking disconnected from the rest of the page.

## 5. Keep scope focused

Do not bring back the shatter effect in this pass.

This fix is only about:
- pinned scroll behavior
- slower step-by-step reveal timing
- no empty gap before the next section
- stronger visibility and visual emphasis in the call section

## Files to update

- `src/components/asmi/Act2CallViz.tsx`
- `src/components/asmi/Act3Moments.tsx`
- `src/styles.css`

## Validation

- The call section stays visually pinned while the user scrolls through every reveal.
- The viewport does not feel like it is drifting downward during the key beats.
- Sarah’s ask, the 5 calls, and the single confirmation each have their own readable scroll segment.
- The green confirmed state is clearly visible and aesthetically stronger.
- The next section appears immediately after the call sequence ends, with no dead empty space.
