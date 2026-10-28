# Design

## Context

See proposal.md for motivation and specs/browser-template-layout/spec.md for the behavior contract. `BrowserSurface` already fits a centered portrait viewport and renders four independent external gutter regions. The game canvas fills the viewport, while status and touch/room UI are currently composed in an overlay within it.

## Goals / Non-Goals

**Goals:**
- Reuse the existing gutter regions for selected status without moving or shrinking the fitted portrait viewport.
- Reflow status back into a compact viewport arrangement when side gutters are unavailable, including fullscreen.
- Give the Babylon presentation more of the portrait column's vertical extent while keeping control targets and essential actions visible.
- Keep the project identity “Invaders of Space” and its familiar “Space Invaders” display title consistent across the UI.

**Non-Goals:**
- Changing simulation rules, logical world bounds, networking, room flows, or renderer technology.
- Making gameplay controls or primary actions depend on the external gutters.
- Changing the portrait orientation or adding an alternate layout orientation.

## Decisions

- Compose gutter status as optional React content supplied through the existing `BrowserSurface` gutter slots. Keep the viewport fitting algorithm independent from that content so gutters never push the column inward.
- Define a responsive breakpoint by available gutter width, not just device type. Use the existing in-viewport status presentation below that threshold and in fullscreen, where gutters disappear.
- Relocate only concise, noninteractive status such as wave, score, connected crew/lives, and room state. Keep lobby actions, dialogs, room join/create, leave/invite actions, and movement/fire controls inside the viewport.
- Reallocate the freed overlay area to the gameplay presentation without changing the fixed 320×576 logical arena or game camera framing. Validate safe spacing at narrow heights so the playfield does not cover the touch controls or modal content.
- Keep “Invaders of Space” as the project name and retain “Space Invaders” in its user-facing title treatment.

## Risks / Trade-offs

- **Status may feel disconnected from the arena on wide screens** → Align gutter groups with the viewport and retain concise labels and player colors.
- **Fullscreen has no external gutters** → Return status to the compact viewport layout and keep its actions operable within the viewport.
- **Touch controls can conflict with a taller arena** → Preserve their viewport anchoring, minimum touch target size, and top-layer hit testing.
- **A responsive CSS breakpoint may not fit every zoom or window shape** → Base fallback behavior on measured available gutter dimensions and verify resize/zoom transitions.

## Migration Plan

Implement the responsive composition in place without a data or network migration. For the Apply phase, start exactly one Vite preview for review and stop for the user's approval before any merge or commit. Rollback consists of reverting the layout/UI changes; game state and room compatibility are unaffected.
