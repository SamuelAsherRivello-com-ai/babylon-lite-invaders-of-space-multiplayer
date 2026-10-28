# Spec Delta

## ADDED Requirements

### Requirement: Responsive game status in external gutters
The game SHALL place selected noninteractive status information in external gutters when sufficient space is available, without changing the centered portrait viewport's dimensions or position. Primary actions, dialogs, and essential player controls SHALL remain within the viewport.

#### Scenario: Wide window provides side gutters
- **WHEN** the centered portrait viewport leaves usable horizontal gutter space
- **THEN** selected status information appears in the external gutters and the viewport remains centered at its existing portrait ratio
- **AND** the gutters do not reduce the viewport's fitted dimensions

#### Scenario: Narrow window or fullscreen removes gutter space
- **WHEN** the available gutters are too narrow or not visible
- **THEN** selected status information moves into a compact in-viewport presentation or is omitted when redundant
- **AND** primary actions and movement/fire controls remain reachable

### Requirement: Expanded vertical gameplay presentation
The game SHALL use the vertical space released by moving selected HUD elements out of the portrait viewport to present a larger gameplay render area, while preserving the logical arena framing and keeping primary UI and controls usable in fullscreen and windowed modes.

#### Scenario: HUD is displayed in gutters
- **WHEN** selected HUD information is rendered outside the portrait viewport
- **THEN** the gameplay presentation uses the released in-viewport space for the arena
- **AND** the portrait game column remains centered without changing its aspect ratio

#### Scenario: Fullscreen or windowed layout changes
- **WHEN** the browser enters fullscreen, exits fullscreen, resizes, or changes zoom
- **THEN** the game column and gameplay presentation adapt to the available CSS-pixel space
- **AND** keyboard and touch controls remain usable without changing game rules or logical world bounds
