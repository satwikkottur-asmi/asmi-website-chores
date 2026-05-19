# Mobile-only: move "a few things it handled" before "from plumbers to prescriptions"

Desktop order stays exactly as it is today. On mobile, the Stories block (Act 5A — "this week with asmi / a few things it handled.") should appear *above* the cloud section (Act 4 — "From plumbers to prescriptions"), then the rest of Act 5 (No app. / 50+ languages) continues as usual.

## Approach

Split the Stories block out of `Act5` into its own component, then render it in a different position on mobile vs desktop.

### 1. `src/components/asmi/Act5.tsx`

- Extract the 5A Stories block (lines ~119–161 — the `this week with asmi / a few things it handled` heading + `FieldNoteCard` map) into a new exported component `Act5Stories`. Keep `STORIES`, `FieldNoteCard`, and the `activeIndex` state with it.
- In `Act5` itself, render `<Act5Stories />` only on desktop (`hidden md:block` wrapper), so existing desktop layout is unchanged.
- The remaining `Act5` keeps 5B (No app.) and 5C (Languages) intact.

### 2. `src/routes/index.tsx`

- Render `<Act5Stories />` only on mobile, inserted between `Act3ThreeMoments` and `Act4Cloud`:

```tsx
<Act3ThreeMoments />
<div className="md:hidden"><Act5Stories /></div>
<OrganicDivider />
<Act4Cloud />
<Act5 />
<Act6Close />
```

Use a CSS-only `md:hidden` / `hidden md:block` toggle (not JS `useIsMobile`) so SSR renders correctly on both and there's no hydration flash.

## Result

- **Mobile:** Act 1 → Act 3 (3 moments) → **a few things it handled** → from plumbers to prescriptions → No app. → 50+ languages → Act 6.
- **Desktop:** unchanged (Act 1 → Act 2 → Act 3 → Act 4 → Act 5 [Stories, No app., Languages] → Act 6).

## Not touched

- All animations, Act 2 pinning, Act 4 cloud, Act 6 — unchanged.
- No content edits, only ordering.
