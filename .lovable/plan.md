# Three small fixes: copy + mobile channels layout

## 1. "Delivered" → "Booked" (Act 3)

`src/components/asmi/Act3Moments.tsx` line 127. One-word swap. No layout impact.

## 2. "a few things she handled" → "a few things it handled" (Act 5A)

`src/components/asmi/Act5.tsx` line 141. Headline above the field-note cards. One-word swap.

## 3. Declutter "No app. No new habit." on mobile (Act 5B)

The three channels (Call / Text / Listen) currently stack as a tall vertical column on mobile, each one centered with a 48px serif word, an ambient mark, and a caption — plus generous `gap-12` between them. On a 390px viewport this reads as ~3 full screens of repeated structure and feels cluttered.

Redesign for mobile only (desktop row layout stays as-is):

- Switch from a stacked centered column to a **horizontal 3-up row** on mobile, since the three items are peers and shorter side-by-side reads as one unit instead of three sections.
- Shrink the channel word from `clamp(38px, 9vw, 48px)` to `clamp(22px, 6vw, 28px)` on mobile so three fit comfortably.
- Move the ambient mark (wave / dots / ripples) **above** the word, smaller (~16–18px tall) so the row has a compact icon-over-label rhythm.
- Drop the per-channel caption on mobile. Replace the three captions with one combined line below the row: *"Call, text, or just talk — iMessage, WhatsApp, or a phone call."* (keeps the substance, removes the repetition).
- Tighten section vertical padding on mobile (`py-20` → `py-14`) and the headline-to-row gap (`mb-16` → `mb-10`).
- Keep the existing closing line *"Same intelligence. Every surface. No app."* but reduce its top margin on mobile (`mt-16` → `mt-10`).
- Desktop (`md:` and up) keeps the current 3-column layout, full-size word, individual captions, and existing spacing — no regression.

### Technical details

Files to edit:

- `src/components/asmi/Act3Moments.tsx` — change "Delivered" to "Booked".
- `src/components/asmi/Act5.tsx`:
  - Line 141: "she handled" → "it handled".
  - Lines 162–186 (5B block): add a mobile-specific compact layout for the three `Channel`s and the combined caption; gate the existing desktop markup with `hidden md:flex` / `hidden md:block`.
  - `Channel` component stays unchanged for desktop; add a sibling `ChannelCompact` (or inline JSX) for the mobile row.

No new dependencies. No token changes.

## Out of scope

- Field-note cards, languages cloud, Act 1/2/3/4/6.
- Real audio wiring (already prepared via `src` prop).
