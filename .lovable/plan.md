# Footer additions + restore original gradient wash

## 1. Footer — privacy policy + support email

In `src/routes/index.tsx` footer (lines 62–76), add a third row/column:

- Email link: `support@asmiai.com` (mailto)
- Privacy policy link → `/privacy`

Layout: keep current asmi wordmark left, tagline middle, and add a right-aligned cluster with the support email and "Privacy" link separated by a dot. Italic serif, stone-dim color, fontSize 14, matching existing footer typography.

Create a minimal `src/routes/privacy.tsx` route with a placeholder privacy policy page (heading + short paragraph) so the link resolves and SSR/typecheck passes.

## 2. Restore original gradient wash on FieldNoteCard

In `src/components/asmi/Act5.tsx`, the current sweep is a narrow vertical band tied to `progress` that travels left→right. The original effect was a **soft full-card diagonal wash** that simply appears (fades in) when audio starts — not a moving bar.

Replace the moving-band `<span>` (around lines 612–623) with the original:

```tsx
<span
  aria-hidden
  className="absolute inset-0 pointer-events-none"
  style={{
    background: `linear-gradient(115deg, ${story.wash} 0%, ${story.wash} 35%, transparent 70%)`,
    opacity: isActive ? 1 : 0,
    transition: "opacity 0.7s ease",
  }}
/>
```

- Uses `story.wash` (the bolder per-story color already defined) so it reads on cream.
- No `mixBlendMode: multiply` (that washed it out previously).
- No transform/progress coupling — appears smoothly as soon as audio starts, fades out when it stops.
- Corner bloom + ambient bloom layers stay untouched.

## Files touched
- `src/routes/index.tsx` — footer additions
- `src/routes/privacy.tsx` — new placeholder route
- `src/components/asmi/Act5.tsx` — restore original wash

## Not touched
Audio logic, phrase reveal, Act 2/3/4/6, mobile layout.
