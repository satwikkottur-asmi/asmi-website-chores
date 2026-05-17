# Fix Act 2/3 overlap, shorten mobile call scene, redesign "This week"

Three focused issues from the screenshot and questions.

## 1. Act 2 and Act 3 visually merging (the screenshot bug)

What's happening: Act 2 uses GSAP `pin: true` with `pinSpacing: true`, but the `end` is `+= window.innerHeight * (STEPS.length - 0.4)` (3.6 viewports for 4 steps). The last 0.4 viewport "early release" means the pin unpins while the user is still mid-scroll, and Act 3's first moment ("Asmi calls you.") slides up underneath the still-rendered final Act 2 frame. Both render in the same scroll band — that's what the screenshot captures.

Fix:

- Change `end` to `"+=" + window.innerHeight * STEPS.length` (full 4 viewports). No early release.
- Add a short post-pin breathing band: after the pinned stage ends, render an empty 40svh spacer before Act 3 so the eye resets on warm linen before "Asmi calls you." enters. This kills the visual collision.
- On the final "confirm" step, fade the entire pinned stage out (opacity → 0) over the last 8% of progress so it physically disappears before unpin, instead of cutting.
- Wrap Act 3's first `<Moment>` so its ambient waveform doesn't start animating until the section is at least 20% in view (currently starts at `start end` which is why it appears behind Act 2).

Result: clean handoff. Act 2 fades, brief pause, Act 3 enters on its own.

## 2. Mobile plumber section takes too many scrolls

Current: 4 steps × 100svh = ~4 full screen-heights of scrolling on mobile. You're right — it's too long. Each chapter (ask, listen, dial, confirm) only changes a small piece of the frame, so each scroll feels like a tiny payoff.

Fix:

- On mobile, collapse to 3 chapters: `ask` → `dial` (with orb + list appearing together) → `confirm`. Drop the standalone "Asmi listens" beat — the orb pulse during dial already conveys it.
- Reduce mobile pin distance to `2 * window.innerHeight` (down from 4). Two flicks of the thumb gets you through the whole scene.
- Tighten `scrub` from 0.5 → 0.3 so chapter transitions feel snappier.
- Stagger the 5 plumber rows faster on mobile (delay 0.08 instead of 0.14).
- Desktop keeps the current 4-chapter pacing — it has more pixel real-estate and the narrative reads as deliberate there.

Result: mobile completes the scene in ~2 screen-scrolls instead of 4, without losing the story.

## 3. "This happened this week." is text-heavy and off-theme

Right now: three stacked text blocks (category label, big headline, body paragraph, mono result). Reads like a press release, not like the warm tactile rest of the site.

Redesign as **iMessage-style conversation cards** — matches the product (Asmi is a texting interface) and the existing "Done." sage message bubble in Act 3.

Each story becomes a small phone-screen card showing the actual exchange:

```text
┌─────────────────────────────────┐
│  HEALTHCARE          9:14 AM    │
│                                 │
│   ┌──────────────────────────┐  │
│   │ need a derm appt this    │  │  (Sarah, right-aligned, sand bubble)
│   │ week                     │  │
│   └──────────────────────────┘  │
│                                 │
│  ┌────────────────────┐         │  (Asmi, left-aligned, cream bubble)
│  │ on it. calling 3   │         │
│  │ clinics now…       │         │
│  └────────────────────┘         │
│                                 │
│  ┌──────────────────────────┐   │
│  │ ✓ Dr. Chen · tmrw 10am   │   │  (sage confirm bubble — matches Act 3)
│  │   insurance pre-auth'd   │   │
│  └──────────────────────────┘   │
│                                 │
│  ▶ play 12s                     │  (existing AudioPlayButton, repositioned)
└─────────────────────────────────┘
```

Specifics:

- Three cards, stacked vertically on mobile, 3-up grid on desktop (≥md).
- Card chrome: rounded-3xl, soft cream background, 1px stone-border, subtle shadow. Faint phone-frame top bar with category label + timestamp.
- Bubbles use existing tokens: user = `--color-sand`, Asmi = `--color-cream` with stone border, confirm = `--color-sage` (matches the existing "Done." bubble for visual continuity).
- Bubbles animate in sequentially on scroll-in (whileInView, stagger 0.4s) — feels like watching the chat happen.
- AudioPlayButton stays — moves to card footer with mono "▶ play 12s" label.
- Ghost numbers + vertical accent rule are removed (no longer needed; the card itself is the visual unit).
- Copy condenses: short text-message-style lines, not full sentences. Less to read, more to feel.

Result: visually rich, on-brand (texting is the product), uses tokens already in the design system, and the chat-bubble metaphor proves the "you just text Asmi" claim instead of telling it.

## Out of scope

- Act 1, 4, 6 changes.
- Audio file changes (button keeps current behavior).
- Copy rewrites beyond the 3 stories on Act 5A.

## Technical details

Files to edit:

- `src/components/asmi/Act2CallViz.tsx` — adjust `end` math, fade-out on confirm, mobile 3-chapter collapse, scrub timing.
- `src/components/asmi/Act3Moments.tsx` — delay first Moment's ambient until in view, ensure top breathing space.
- `src/components/asmi/Act5.tsx` — rewrite Stories section as ConversationCard component; new sub-component with bubble primitives. Keep STORIES data shape but add per-story `messages: { from: 'user'|'asmi'|'confirm', text: string }[]`.
- `src/styles.css` — small additions if needed for bubble shadows / phone-frame border tokens.

No new dependencies.
