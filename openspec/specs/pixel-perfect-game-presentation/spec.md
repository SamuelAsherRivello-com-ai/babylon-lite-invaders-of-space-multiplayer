# pixel-perfect-game-presentation Specification

## Purpose

Provide a readable shared-screen pixel-art invasion game with responsive controls, usable template UI, and explicit rendering and connection recovery states.

## Requirements

### Requirement: Fixed shared arena
The game SHALL show all player ships and the alien playfield through one fixed portrait view. Resizing, fullscreen and browser zoom SHALL preserve world bounds and gameplay coordinates. Primary controls and HUD SHALL remain within the viewport.

#### Scenario: A four-player room enters fullscreen
- **WHEN** four participants play and one enters fullscreen or resizes their browser
- **THEN** that client continues to see the same complete arena and operable HUD
- **AND** the shared world state and other clients' framing remain unchanged

### Requirement: Crisp pixel presentation
The renderer SHALL use nearest sampling, disabled smoothing and mipmaps, no multisample antialiasing, pixel-aligned displayed anchors and integer logical-to-CSS scaling when it fits. Fractional simulation coordinates SHALL remain independent of rendered coordinates; fractional-fit limitations SHALL be documented.

#### Scenario: Fractional movement at integer display scale
- **WHEN** a player moves between fractional simulation positions at an integer CSS scale
- **THEN** displayed sprite anchors align to logical screen pixels without modifying simulation positions

#### Scenario: No integer scale fits
- **WHEN** the available viewport is smaller than the logical scene
- **THEN** a positive proportional fit keeps the game visible and usable
- **AND** documentation does not claim strict pixel alignment at that fractional fit

### Requirement: Keyboard and simultaneous touch control
Players SHALL be able to move with A/D or left/right arrows and fire with Space, and use concurrent on-screen movement/fire controls. Blur, cancellation, local menus, disconnect and teardown SHALL release held input.

#### Scenario: Move and fire using touch
- **WHEN** separate pointers hold a direction and the fire control concurrently
- **THEN** the player moves and fires until the corresponding pointers are released or cancelled

#### Scenario: Browser loses focus
- **WHEN** a participant loses focus while moving or firing
- **THEN** their local held controls clear and neutral input is sent when transport is available

### Requirement: Local menus preserve shared authority
A participant's settings or local pause menu SHALL neutralize their controls without pausing other players' shared run. Host networking, liveness and simulation SHALL remain independent of a local dialog's rendering pause.

#### Scenario: Host opens settings
- **WHEN** the host opens a local settings dialog while guests play
- **THEN** host controls stop, guest gameplay continues, and no competing authority is created solely by the dialog

### Requirement: Readable team and connection status
The interface SHALL show numbered wave, remaining aliens, team score, distinguishable player seats, personal lives, spectator status and current connection/migration failures. Hostile and friendly shots SHALL be visually distinct.

#### Scenario: A player is eliminated while another survives
- **WHEN** a player enters spectating
- **THEN** the HUD marks their zero lives and spectator status while retaining the survivor's current lives and wave

#### Scenario: Migration is in progress
- **WHEN** shared authority is temporarily unavailable
- **THEN** the interface displays a migration state instead of showing a silent frozen game

### Requirement: Unsupported graphics and safe lifecycle
Unavailable WebGPU or failed initialization SHALL produce an actionable in-content error while preserving usable shell controls. Setup, cleanup, retry and resize SHALL NOT create duplicate loops, subscriptions or held inputs.

#### Scenario: Device cannot initialize graphics
- **WHEN** graphics initialization fails or WebGPU is unavailable
- **THEN** the shell shows a readable error and retry/help controls rather than a blank canvas

#### Scenario: Content remounts
- **WHEN** the game content is repeatedly mounted and unmounted
- **THEN** stale rendering loops, session listeners and input handlers are released

### Requirement: Original presentation and controllable sound
Artwork, characters, effects, UI and any sounds SHALL be original or supplied with documented provenance. If sound is included, both an in-game mute control and documented mute URL argument SHALL silence all game audio.

#### Scenario: Silent verification
- **WHEN** the game starts with its documented mute argument
- **THEN** all gameplay audio remains silent without disabling gameplay or networking
