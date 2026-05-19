# Act 5 playback wash — lighter, full-card, 90s loop

## Goal

The wash on the active audio card should feel like a slow, soft light pass across the card:

- lighter color than today (more washed out, less saturated)
- covers the whole card top-to-bottom and edge-to-edge, not a narrow patch
- starts at the left edge, ends at the right edge over 90 seconds (1.5 min)
- when it reaches the right, it restarts from the left and loops as long as audio is playing
- decoupled from audio length and from `progress` — pure visual time-based loop

## Change to make

In `src/components/asmi/Act5.tsx`, replace the current wash layer in `FieldNoteCard` with a full-card light sweep driven by its own 90-second loop while `isActive` is true.

1. **Lighter color**
   - Lower the wash overlay opacity so the cream card remains dominant.
   - Keep the per-story hue (`story.wash`) but render it noticeably softer.

2. **Full-card coverage**
   - The gradient layer spans the entire card (`inset-0`), full width and full height.
   - The gradient defines a wide, feathered light band that extends top to bottom, so as it sweeps the entire card surface is touched (not a small floating patch).

3. **90-second left-to-right loop**
   - Use a CSS keyframe animation, not `progress`-based transforms.
   - Keyframe moves `background-position` from the left edge to the right edge.
   - `animation: asmi-wash-sweep 90s linear infinite` while `isActive`.
   - Animation is removed (and opacity faded) when playback stops, so the next play restarts cleanly from the left.

## Implementation intent

```tsx
<span
  aria-hidden
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: `linear-gradient(100deg,
      transparent 0%,
      transparent 35%,
      ${story.wash} 50%,
      transparent 65%,
      transparent 100%)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "220% 100%",
    backgroundPosition: "0% 0%",
    opacity: isActive ? 0.35 : 0,
    animation: isActive ? "asmi-wash-sweep 90s linear infinite" : "none",
    transition: "opacity 0.5s ease",
  }}
/>
```

Global keyframe (added in `src/styles.css`):

```css
@keyframes asmi-wash-sweep {
  from { background-position: 0% 0%; }
  to   { background-position: 100% 0%; }
}
```

- `background-size: 220% 100%` makes the band wider than the card and full height.
- Moving `background-position` from `0%` to `100%` sweeps the band from the left edge to the right edge over 90 seconds, then loops.
- Lower opacity (`~0.35`) makes the wash visibly lighter than the current treatment.

## Keep unchanged

- Footer, privacy link, support email
- Audio startup / preload logic
- Phrase reveal timing and card copy
- Other acts and layouts
- Existing corner bloom and ambient bloom layers

## File touched

- `src/components/asmi/Act5.tsx` — replace the wash layer
- `src/styles.css` — add the `asmi-wash-sweep` keyframes
