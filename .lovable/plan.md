# Fix Act 2/3 overlap, shorten mobile call scene, redesign "This week" as voicemail waveforms

## 1. Act 2 and Act 3 visually merging

Cause: Act 2's GSAP pin ends 0.4 viewport early (`STEPS.length - 0.4`), so it unpins while Act 3's first moment is already sliding up underneath. They render in the same scroll band.

Fix:

- Change pin `end` to `"+=" + window.innerHeight * STEPS.length` (no early release).
- Fade the entire pinned stage to opacity 0 over the last 8% of progress so it disappears before unpin.
- Add a 40svh breathing spacer between Act 2 and Act 3 so the eye resets on warm linen.
- Defer Act 3's first ambient waveform until the section is ≥20% in view (currently starts at `start end`).

## 2. Mobile plumber scene takes too many scrolls

Currently 4 steps × 100svh = 4 screen-heights on mobile. Too long.

- Mobile: collapse to 3 chapters — `ask` → `dial` (orb + list appear together) → `confirm`. Drop the standalone "listens" beat; orb pulse during dial conveys it.
- Reduce mobile pin distance to `2 * window.innerHeight` (from 4).
- Tighten scrub 0.5 → 0.3 for snappier transitions.
- Faster row stagger on mobile (0.08 vs 0.14).
- Desktop keeps 4 chapters and current pacing.

## 3. Rename Act 2 step labels (punchy, time-stamped)

Replace the current flat labels with a real micro-narrative that shows time passing — makes the scene feel like an event, not a diagram.

```text
Morning, 9:03.  →  Asmi picks it up.  →  Asmi works the phones.  →  Done by 9:11.
```

Update `STEPS` in `Act2CallViz.tsx`. Sarah's quote timestamp ("Sarah · 9:03 AM") already matches step 1; the new "Done by 9:11" closes the loop.

## 4. Redesign "This happened this week" as voicemail waveforms

Throw out cards, chat bubbles, and ghost numbers. The headline says the screen era is over — the section should feel like *sound from the physical world*, not a UI screenshot.

**Concept:** each story is a horizontal voicemail waveform. The waveform IS the story. Around it: minimal mono caption (who, what, outcome) and a play affordance. Nothing else.

Composition per story:

```text
HEALTHCARE · TUE 7:14 AM

▶  ▌▎▍▌▎▏▍▌▌▎▏▎▍▌▎▎▍▌▎▏▎▌▍▌▎▏▎▍▌▎▏▎▌▍▌▎▏▎▍▌▎     0:47
    │
    └─ Dr. Chen, derm. Tomorrow 10am. Insurance pre-auth'd.
```

Specifics:

- Full-width waveform per story, ~64–96px tall, terracotta/sage/clay accent per category.
- Waveform is a generated SVG of ~80 bars with seeded pseudo-random heights — looks like a real call recording. Bars gently breathe (subtle scaleY animation) when idle so the page feels alive.
- Tap/click the waveform → bars sweep left-to-right in the accent color (the "playhead"), simulating playback. Uses existing `AudioPlayButton` logic but visualized as scrubbing the waveform itself rather than a separate button. Real audio optional — visual playback is enough.
- One small mono line above the waveform: `CATEGORY · DAY TIME` (e.g. `HEALTHCARE · TUE 7:14 AM`).
- One serif outcome line below: short, lowercase, ledger-style. *"dr chen, derm. tomorrow 10am. insurance pre-auth'd."*
- No card chrome. No background fill. No ghost numbers. No vertical rule. Three waveforms stacked with generous breathing room. The page itself is the canvas.
- Headline stays "This happened this week." but moves to left-aligned, mono "RECENT" eyebrow above it.

Why this works:

- Honors "screen era is over" — there's no UI element on screen, just sound made visible.
- Reuses existing tokens (terracotta/sage/clay/espresso/stone-dim).
- Direct payoff to the product claim: Asmi makes calls. Here are the calls.
- Looks unlike any SaaS site — Awwwards-grade.

Copy condensed to ledger-style (lowercase, no marketing voice):

1. `HEALTHCARE · TUE 7:14 AM` / `dr chen, derm. tomorrow 10am. insurance pre-auth'd.`
2. `HOME REPAIR · WED 6:48 AM` / `five hvac quotes. saturday 9am. $150 diagnostic.`
3. `FAMILY CARE · DAILY · IT-IT` / `mom in rome. twice a day. three years. never missed.`

## Out of scope

- Act 1, 4, 6.
- Real audio file changes — visualization is purely SVG playback. Existing `AudioPlayButton` can stay wired underneath if real audio plays.
- Copy rewrites beyond Act 2 step labels and the 3 story lines.

## Technical details

Files to edit:

- `src/components/asmi/Act2CallViz.tsx` — pin `end` fix, fade-on-confirm, mobile 3-chapter collapse, scrub timing, new `STEPS` labels.
- `src/components/asmi/Act3Moments.tsx` — defer first Moment's ambient animation.
- `src/components/asmi/Act5.tsx` — rewrite 5A Stories section: new `<VoicemailRow>` component with seeded waveform SVG + playhead sweep. Remove ghost numbers, vertical accent rule, body paragraphs, and result label.
- `src/routes/index.tsx` — add 40svh spacer between `<Act2CallViz />` and `<Act3ThreeMoments />`.

No new dependencies.
