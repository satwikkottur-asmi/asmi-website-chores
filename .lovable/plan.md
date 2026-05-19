# Restore the elegant left-to-right wash on audio playback

## Goal

Bring back the earlier playback effect on the Act 5 audio cards: a soft, elegant gradient wash that starts immediately when audio begins and visibly travels from left to right across the whole card. It should feel like a broad light sweep, not a static overlay and not a skinny random bar.

## Change to make

In `src/components/asmi/Act5.tsx`, replace the current static playback wash layer with a moving wash layer that:

- spans the full card height
- uses a soft-edged gradient based on `story.wash`
- starts just off-canvas on the left when playback begins
- moves fully across the card as `progress` advances
- remains elegant and diffused rather than looking like a hard progress bar

## Implementation details

Update the active wash `<span>` in `FieldNoteCard` so it uses both a soft diagonal gradient and horizontal translation tied to playback progress. The shape should be wide enough to read as a wash, with a feathered center and transparent falloff on both sides.

Implementation intent:

```tsx
<span
  aria-hidden
  className="absolute inset-y-0 left-0 pointer-events-none"
  style={{
    width: "70%",
    background: `linear-gradient(100deg, transparent 0%, ${story.wash} 30%, ${story.wash} 50%, transparent 82%)`,
    opacity: isActive ? 0.95 : 0,
    transform: `translateX(${/* start off left, sweep fully right via progress */}%)`,
    transition: isActive
      ? "transform 80ms linear, opacity 180ms ease-out"
      : "opacity 220ms ease-out",
  }}
/>
```

Expected motion behavior:

- At play start (`progress` near `0`), the wash is already visible and positioned off the left edge.
- During playback, it sweeps continuously across the card from left to right.
- By the end of playback, it exits off the right edge.
- On stop/end, it fades cleanly without leaving a tint blanket over the card.

## Keep unchanged

- Footer, privacy link, and support email
- Audio preload/startup logic
- Phrase reveal timing and card copy
- Other acts and section layouts

## File touched

- `src/components/asmi/Act5.tsx` — restore the moving playback wash behavior
