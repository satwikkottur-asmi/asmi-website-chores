# Mobile + Desktop Polish Pass

Goal: keep the current desktop experience intact, and make every act feel native on a phone (375–430px). No new content, no story changes — only layout, sizing, pacing, and touch behavior.

## What changes, act by act

**Act 1 — Opening hero**
- Shorten the scroll section from `200vh` to `140vh` on mobile so the reveal doesn't drag.
- Move the wordmark/CTA block down with safer spacing (use `flex` stack inside the sticky frame instead of `top: 58%`) so headline and wordmark never collide on short viewports.
- Tighten headline clamp lower bound and line-height for phones.
- CTA becomes full-width pill on mobile.

**Act 2 — Call viz**
- Audit at 375px; ensure the phone/wave illustration scales and ambient SVGs don't clip. Reduce side padding, scale down ring sizes.

**Act 3 — Three moments**
- Reduce headline clamp floor; add horizontal padding so long lines ("Calls. IVRs. Hold queues…") wrap nicely.
- Message bubble: smaller padding and font on mobile.

**Act 4 — Pill cloud (biggest fix)**
- Desktop: unchanged (scattered floating cloud with mouse-repel).
- Mobile (<768px): switch to a **dense flowing wrap layout** — pills become inline-flex inside a centered container with `flex-wrap`, gentle staggered float animation kept, mouse-repel disabled (no hover on touch). Trim to ~24 pills on mobile to avoid visual overload.
- Container height becomes `auto` on mobile instead of `78vh`.

**Act 5**
- Verify spacing; tighten section padding and font clamps for mobile.

**Act 6 — Close**
- Same hero treatment as Act 1: shorter scroll distance, stacked layout, full-width CTA.
- Headline clamp lowered so "handled." doesn't overflow on 375px.

**Nav**
- Already hides middle links under `md`. Add: shrink CTA label to "iMessage" on `<sm` so it fits with the wordmark.

## Cross-cutting

- Add a `useIsMobile` check (already exists at `src/hooks/use-mobile.tsx`) where layout truly diverges (Act 4, Act 1/6 scroll length).
- Replace hover-only affordances with always-on subtle styling on touch (pills get a faint border by default).
- Reduce parallax travel distances by ~40% on mobile for smoother scroll on low-end devices.
- Keep `prefers-reduced-motion` rule already in `styles.css`.

## Technical notes

- Use Tailwind responsive prefixes (`sm:`, `md:`) for static layout differences; use the `useIsMobile` hook only where JS behavior must branch (disabling mouse-repel, swapping Act 4 layout, shortening scroll heights).
- No new dependencies. No design system token changes.
- QA at 375×812, 414×896, 768×1024, 1280×800, 1920×1080.

## Out of scope

- No copy changes, no new sections, no color/typography changes, no new animations beyond what's needed for the mobile pill layout.
