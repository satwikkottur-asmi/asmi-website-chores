# Fix Act 2 scroll sync and missing result state

## Problems to fix

1. **Act 2 is lagging behind scroll.** The sticky animation phases are mapped too late, so the viewer reaches the next section before the dialing story finishes.
2. **The winner result is inconsistent.** The correct winner label is `✓ Bay Area Plumbing · Mike · Today 2pm`, but another message bubble still shows the dermatology copy later on the page.
3. **There is too much dead space after Act 2.** The section stays tall after the meaningful animation has ended, creating a blank-feeling gap before the next content takes over.

## What will change

### Act 2 — Scroll timing and waveform behavior
- Retune the section height and sticky progress mapping so the fan-out, dismissals, winner state, and closing beat all happen earlier and stay visually locked to the user’s scroll.
- Keep the original plumber story and endpoint labels exactly as requested.
- Keep the traveling mini waveform mechanic: 3 rectangular bars moving along each branch.
- Ensure state transitions are clear:
  - active calls use terracotta waveforms
  - the confirmed winning line switches to sage green
  - dismissed lines fade their waveform out over 300ms instead of disappearing abruptly
  - the winning endpoint label gets the soft green glow
- Make sure the winner label remains visible during the resolved state instead of dropping out before the section ends.

### Gap between Act 2 and the next section
- Shorten the effective scroll window for Act 2 so the sticky block releases closer to the end of the story.
- Align the fade-out of the call visualization with the fade-in of the next section so there is no blank handoff.

### Incorrect text later on the page
- Replace the dermatology message bubble in the following section with the correct plumbing result so the story stays consistent end-to-end.

## Out of scope
- No redesign of the rest of the homepage.
- No changes to the Act 2 story copy or endpoint names beyond restoring the correct plumbing result text.
- No backend or dependency changes.

## Technical notes
- Expected files: `src/components/asmi/Act2CallViz.tsx` and `src/components/asmi/Act3Moments.tsx`.
- The fix is presentation-only: scroll thresholds, sticky height, fade windows, and consistent result text.
