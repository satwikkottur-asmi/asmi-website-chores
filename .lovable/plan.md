# Fix broken animations and visual issues

Audit pass on the live site found several real breakages, not just polish issues. This plan fixes them in priority order.

## Confirmed problems (from live screenshots)

1. **Act 2 (Call Visualization) is broken.** The center orb never appears, the curved call-lines never render, and the endpoint labels float in the wrong place. The only thing visible mid-section is the radial waveform ring and orphaned label text — so the whole "call branches → one survives" story is invisible.
2. **Act 6 final CTA is ghost-faded.** "Your day, handled." renders at very low opacity and the CTA / supporting copy is barely visible because the scroll-linked opacity timing never reaches 1 while the section is on screen.
3. **Act 4 task cloud overflows the right edge.** Some pills (e.g. "Grocery delivery") get clipped at the viewport edge because positions go past the safe inner bounds.
4. **Act 5 desktop language constellation is sparse + clusters collide.** Random positions cluster and overlap.
5. **Misc.** Mid-page sticky areas show large blank stretches because scroll-linked opacities fade content to 0 well before the next section arrives.

## What to change

### Act 2 — Call Visualization (rebuild the failing parts, keep the structure)
- Make the center orb always visible while the section is in the sticky window (replace the SVG `<motion.g>` scale/opacity wiring with a plain centered absolute-positioned div so it actually renders).
- Render the call-line branches with plain SVG `path` plus a CSS dasharray draw-in (no `pathLength` MotionValue on a path inside a stretched viewBox — that's the part not painting).
- Stroke color change (terracotta → sage for the winner, fade for the losers) driven by a CSS class swap based on scroll progress, not by passing a MotionValue into the `stroke` attribute.
- Endpoint labels: position with `transform: translate(-50%, -50%)` over the actual SVG endpoints, anchor them to the same sticky container the orb lives in, and add a small dot at each endpoint so they read as "phone numbers being dialed".
- Keep: the radial waveform ring around the orb, the caller-quote, and the closing "Sarah found out over iMessage" beat.

### Act 6 — Final CTA
- Replace the scroll-linked `opacity` MotionValues with `whileInView` reveal (once, `margin: -120px`) so the headline, italic "handled.", subhead, and CTA all reach full opacity as soon as they enter the viewport.
- Stagger them (0 / 0.15s / 0.35s / 0.5s) so the reveal still feels composed.
- Tighten section padding so the CTA isn't pushed to the very bottom of a tall section on desktop.

### Act 4 — Task Cloud
- Clamp x positions to [8, 88] and y to [10, 88] in `generatePositions`.
- Add `overflow: hidden` + `padding-inline` on the cloud container so anything near the edge can't bleed past.
- Reduce mouse-repel radius from 120px to 90px to prevent pills snapping into each other.

### Act 5 — Desktop language constellation
- Replace random positions with a deterministic ring-grid (3 concentric loose rings) so labels distribute evenly and don't collide.
- Keep the per-label float animation and hover color change.

### Cross-cutting cleanup
- Remove dead `as unknown as string` casts where MotionValues were being forced into non-style SVG attributes.
- For every scroll-linked section that goes fully transparent before the next section is visible, extend the fade-out window so there's no blank viewport between acts.
- Re-verify on desktop (current 1252px viewport) and mobile (375px) after each fix.

## Out of scope
- No copy changes.
- No new sections, no palette / typography changes.
- No new dependencies.

## Technical notes
- TanStack Start + motion/react. All changes are presentation-layer only.
- Files touched: `src/components/asmi/Act2CallViz.tsx`, `Act4Cloud.tsx`, `Act5.tsx`, `Act6Close.tsx`, and small additions in `src/styles.css` for the branch draw-in keyframe.
