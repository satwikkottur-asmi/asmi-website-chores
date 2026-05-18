# Three polish fixes: hero alignment, channel copy, "This happened" redesign

## 1. Fix "The screen era is over" jump on load (Act 1)

The headline starts perfectly centered, then snaps upward the moment the `asmi` wordmark + subhead + CTA fade in below it. Cause: on mobile the wordmark block is in normal flow (`md:absolute`), so when it mounts it pushes the h1 up. On desktop the headline column also re-centers because the parent is a flex column with `justify-center` and a second child appears.

Fix:

- Reserve the wordmark block's space from first paint so nothing shifts. Two options; pick one in implementation:
  - **Preferred:** make the wordmark absolutely positioned on mobile too (`absolute bottom-[12svh] left-0 right-0`) so it never participates in the centering math. The h1 stays the only flex child and remains visually centered.
  - Alternative: render the wordmark block with `visibility: hidden` reserving height from t=0, then fade in via opacity only.
- Lock the h1 vertical anchor to the viewport center using `position: absolute; top: 50%; transform: translateY(-50%)` inside the sticky stage, so scroll-driven `y` transforms move it relative to a fixed anchor instead of a shifting flex baseline.
- Verify on 390px viewport: headline must not move between t=0 and t=0.3 of scroll.

## 2. Swap channel caption (Act 5B)

In `Act5.tsx`, the middle `<Channel>` caption:

```text
"iMessage mid-day. Same context."  →  "iMessage or WhatsApp anytime."
```

One-line copy change. No layout impact.

## 3. Redesign "This happened this week" — warm, consumer, on-theme

The current voicemail-waveform treatment reads as scientific/technical (bars + timestamps + mono labels). The rest of the site is serif, warm, paper-textured, hand-drawn. The section needs to feel like *postcards from Asmi* — small artifacts of real things she handled — not a call log.

### New concept: "Field notes from Asmi"

Each story becomes a **handwritten-feeling note card** with paper grain, a soft accent wash, and a single play affordance. The visual metaphor is a stack of journal entries or polaroid backs, not a dashboard.

Composition per card (mobile-first, full-width, ~stacked vertically with overlap):

```text
┌─────────────────────────────────────┐
│  ·  tuesday morning                 │  ← italic serif, lowercase
│                                     │
│  called Dr. Chen's office.          │  ← serif, conversational
│  got Sarah on the derm waitlist.    │
│  tomorrow, 10am.                    │
│                                     │
│  ───── pre-auth cleared ─────       │  ← hand-drawn divider
│                                     │
│     ▶  listen  ·  0:47              │  ← terracotta pill, bottom-left
└─────────────────────────────────────┘
   (soft drop shadow, 2deg tilt, paper texture overlay)
```

Three cards, each with its own accent wash (terracotta / sage / clay) bleeding from one corner. Slight alternating tilt (-1.5°, +1°, -0.8°) so the stack feels human, not aligned-to-grid. Generous vertical spacing; on desktop they can stagger horizontally with a subtle parallax on scroll. The "RECENT" eyebrow stays but moves to a smaller italic "this week with asmi —" lead-in.

Copy (rewritten in Asmi's voice — first-person, soft, specific):

1. *tuesday morning* — "called Dr. Chen's office. got Sarah on the derm waitlist. tomorrow, 10am." · pre-auth cleared
2. *wednesday, before coffee* — "got five HVAC quotes. booked the one Marco liked. saturday, 9am." · $150 diagnostic
3. *every morning · in italian* — "called mom in Rome. she's eating. she misses you." · three years, never missed

### The "wow" playback interaction (mobile-first, fitting the theme)

When the user taps the play pill, the card **transforms into a living moment** rather than scrubbing a waveform:

1. **Card lifts** — slight scale (1 → 1.03), shadow deepens, tilt straightens to 0°. Other cards dim to 40% and blur 4px. ~400ms.
2. **Paper "opens"** — the accent wash sweeps across the card surface left→right like a wash of watercolor (CSS mask + gradient), revealing a **soft ambient bloom** behind the text. Not a waveform — an organic, breathing aura.
3. **Type "speaks"** — the body text re-renders one phrase at a time with a gentle fade + 4px upward drift, synced to the duration. Each phrase glows briefly with the accent color as it "lands." Feels like Asmi is telling you what she did.
4. **A subtle audio-presence cue** — three tiny serif dots `· · ·` pulse at the bottom in the accent color, breathing in/out (no bars, no graph). Tap the dots or anywhere on the card to stop.
5. **End state** — the wash recedes back to corner, card settles, dots fade. Time pill flips to a small ✓.

All animation in Framer Motion + CSS. No real audio file needed; the experience IS the audio. If we later wire `AudioPlayButton` underneath, the visual stays the same and just syncs to `audio.currentTime`.

Why this fits:

- Serif type + lowercase voice + paper textures matches Act 1 / Act 3 / footer.
- No graph, no bars, no mono labels — nothing reads "dashboard."
- The play interaction is the payoff: tap = a memory unfolds. That's the consumer story.
- Mobile-first by construction (single column, large tap targets, motion within one card).

## Out of scope

- Real audio recordings (visual playback is enough).
- Act 2, 3, 4, 6.
- The "No app. No new habit." channels grid stays as-is apart from the one copy swap.

## Technical details

Files to edit:

- `src/components/asmi/Act1Opening.tsx` — absolutely position wordmark block on mobile; anchor h1 to viewport center inside the sticky stage.
- `src/components/asmi/Act5.tsx` — replace `STORIES` content + `VoicemailRow` with a new `FieldNoteCard` component (paper texture, tilt, accent wash, type-reveal playback). Update 5B middle caption.
- `src/styles.css` — add `@keyframes wash-sweep`, `@keyframes dots-breathe`, and a `.paper-grain` utility (subtle SVG noise data-URI background) if not reusable from existing tokens.

No new dependencies. Reuses existing color tokens (`--color-terracotta`, `--color-sage-strong`, `--color-clay`, `--color-cream`, `--color-espresso`).
