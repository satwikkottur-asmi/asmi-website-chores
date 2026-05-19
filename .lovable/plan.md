# More breathing room on mobile: heading-to-content gaps

Two sections on mobile have cramped headlines pressed against their content. Bump both, plus increase the vertical rhythm of each section so it doesn't feel stacked on top of the next.

## Changes in `src/components/asmi/Act5.tsx`

**5B "No app. No new habit."** (around line 165–205)
- Section padding: `py-14 md:py-32` → `py-20 md:py-32`
- Headline bottom margin: `mb-10 md:mb-20` → `mb-16 md:mb-20`
- Mobile caption top margin (under the 3 channels): `mt-8` → `mt-10`
- Final tagline top margin: `mt-10 md:mt-20` → `mt-14 md:mt-20`

**5C "50+ languages"** (around line 211–223)
- Section padding: `pt-16 pb-10 md:py-32` → `pt-20 pb-16 md:py-32`
- Title wrapper margin: `mb-12 md:mb-16` → `mb-16 md:mb-16`

## Why these specific values

Mobile heading is `clamp(2.8rem, 9vw, 5rem)` ≈ 45 px tall. A `mb-12` (48 px) gap is roughly 1× the headline — visually it reads as "stuck to". `mb-16` (64 px) gives the headline ~1.4× breathing room, which matches the rhythm the rest of the page already uses (Act 5A uses `mb-16 md:mb-24`).

Section padding bumps (`py-14` → `py-20`) align mobile vertical rhythm with the rest of the page — Act 5A and the languages section will all sit at `py-20` on mobile.

No new dependencies. Only one file touched.
