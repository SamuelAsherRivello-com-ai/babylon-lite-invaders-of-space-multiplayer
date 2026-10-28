# Proposal

## Why

The centered portrait game currently keeps most status HUD and game presentation inside a relatively constrained viewport, leaving external gutters mostly unused. Moving selected status into the gutters can make better use of wide windows and give the alien arena more vertical room while keeping the game column centered and the existing controls usable.

## What Changes

- Keep the 320×576 portrait Babylon game column centered within the browser surface.
- Place selected noninteractive status HUD elements in the external gutters when there is room, while keeping primary actions, game dialogs, and essential control feedback in the viewport.
- Reclaim the HUD space inside the portrait column to expand the gameplay render area toward the available window height.
- Preserve keyboard and touch movement/fire controls, room creation and joining, settings, and fullscreen behavior; retain a usable responsive arrangement when gutters are narrow or absent.
- Present the project as “Invaders of Space” internally while continuing to show “Space Invaders” as its familiar display title.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `browser-template-layout`: Support optional responsive gutter HUD composition that does not displace the centered portrait viewport, and define how gameplay gains vertical room while keeping primary UI and controls usable in the viewport/fullscreen.

## Impact

- Affected code: `space-invaders/src/ui/App.jsx`, `BrowserSurface.jsx`, `layout.js`, `style.css`, and `space-invaders/src/content/Content.jsx`.
- Affected behavior: responsive placement of selected game status, portrait viewport composition, project naming in the UI, and vertical playfield presentation.
- No changes to game simulation, multiplayer protocol, dependencies, hosting, or game rules are intended.
