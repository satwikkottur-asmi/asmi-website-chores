# Tone down the Act 5 playback wash

## Goal

Make the playback wash feel subtle again: lighter color, softer presence, and much slower motion. It should read as a gentle ambient sweep across the card, not a strong moving overlay.

## Change to make

Adjust only the wash layer in `src/components/asmi/Act5.tsx` so that:

- the tint is visibly lighter
- the wash opacity is reduced
- the sweep moves slowly and calmly
- the card keeps the same overall structure and playback behavior

## Implementation details

Update the moving wash `<span>` in `FieldNoteCard` with three changes:

1. **Lighten the color treatment**
   - Reduce the active wash alpha by switching from the current stronger `story.wash` presentation to a softer rendering.
   - Lower the overlay opacity so the cream card remains dominant.

2. **Slow the sweep down**
   - Decouple the sweep from the aggressive “cross in the first few seconds” behavior.
   - Tie the movement to a much slower progress curve so the wash glides gradually instead of rushing across the card.

3. **Keep it soft-edged**
   - Preserve the broad, feathered gradient shape.
   - Avoid turning it into a narrow bar or hard progress indicator.

Implementation intent:

```tsx
<span
  aria-hidden
  className="absolute inset-y-0 left-0 pointer-events-none"
  style={{
    width: "82%",
    background: `linear-gradient(102deg, transparent 0%, transparent 18%, ${story.wash} 38%, ${story.wash} 50%, transparent 82%)`,
    opacity: isActive ? 0.45 : 0,
    transform: `translateX(${/* slower, gentler travel */}%)`,
    transition: isActive
      ? "transform 140ms linear, opacity 260ms ease-out"
      : "opacity 260ms ease-out",
  }}
/>
```

## Keep unchanged

- Footer, privacy link, and support email
- Audio startup / preload logic
- Phrase reveal timing and card copy
- Other acts and layouts

## File touched

- `src/components/asmi/Act5.tsx` — soften and slow the playback wash
