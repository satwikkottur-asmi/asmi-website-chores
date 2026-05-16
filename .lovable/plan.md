# Fix the "blank preview" first viewport

## What’s actually happening
The homepage is rendering, but the opening hero text starts at zero opacity, so the first viewport can look blank even though the page is loaded and animating in the background.

## Plan
1. **Make Act 1 visible on first paint**
   - Update `src/components/asmi/Act1Opening.tsx` so the opening statement is readable at scroll position 0.
   - Keep the scroll-led reveal feeling, but start from a visible baseline instead of a fully hidden state.

2. **Preserve the intended narrative motion**
   - Retune the hero word animation so it still breathes/materializes as you scroll, without hiding the entire message before interaction.
   - Make sure the secondary wordmark/CTA timing doesn’t visually fight the primary headline.

3. **Clean up the scroll warning if needed**
   - Review the scroll-tracked sections using `useScroll` and add the required positioned container where needed so Motion stops warning about measurement.

4. **Validate in preview**
   - Re-open the preview and confirm the first viewport shows real content immediately.
   - Verify the page still flows correctly through the later acts.

## Files likely to change
- `src/components/asmi/Act1Opening.tsx`
- Possibly one additional scroll section if the Motion warning needs a surgical container-position fix

## Technical note
This is not a routing failure or total render crash. The app is loading; the initial hero choreography is making the first screen appear empty.
