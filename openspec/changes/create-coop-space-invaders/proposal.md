# Proposal

## Why

Create an original, pixel-perfect cooperative Space Invaders browser game for one to four players, using the shared browser template and Colyseus service. The supplied dungeon example and superseded asteroid description do not express the confirmed host-simulated alien-wave game, so implementation needs one consistent contract first.

## What Changes

- Establish `SamuelAsherRivello/babylon-lite-space-invaders-clone` through GitHub template generation during a separately authorized implementation phase; preserve this existing planning directory when bringing in the generated checkout.
- Replace the template showcase with a fixed-screen 2D alien invasion game, original pixel artwork, horizontal player movement, upward shooting, keyboard and simultaneous touch controls, wave HUD, and spectator presentation.
- Support private cooperative rooms with one to four occupied seats, hot join/drop, and disabled friendly fire. Each player has three lives across the whole run; eliminated players spectate until the team loses and restarts together at wave one.
- Add the isolated `space-invaders` room to the shared multiplayer server. The elected participant's browser owns all simulation and gameplay outcomes. The server owns admission, membership, host election, ordered input relay, and bounded checkpoint storage only.
- Reuse `ParticipantHostRelay`, private-room helpers, and `@rmc/multiplayer-client`; add compatible host-generation fencing, game-neutral input events, liveness support, and resumable checkpoints rather than reusing server-authoritative Gungeon combat.
- Transfer authority automatically to the longest-connected eligible remaining participant without resetting the wave or lives. Restore the latest committed checkpoint and retained input suffix; reject superseded host traffic.
- Plan backend tests/release/public relay verification before game-client integration, then game release, GitHub Pages verification, and local checkout synchronization.
- Start wave one with three rows of six one-hit aliens; later waves add bounded armor, faster movement and varied fire without splitting. New players get three lives; returning players retain remaining lives or elimination. An invasion-line breach ends the run; a five-second results screen precedes a shared wave-one restart.
- Use the existing backend's documented process-local hosting contract and verify a public four-minute game-specific session. Report process loss and connection limits separately from participant-host migration; the suggested ten-minute continuity was never approved.

## Capabilities

### New Capabilities

- `invasion-gameplay`: Descending alien waves, cooperative combat, per-player three-life runs, elimination, spectating, and team restart.
- `participant-host-session`: Four-seat private sessions, ordered controls, host-only simulation, hot membership changes, checkpoint transfer, and host migration.
- `pixel-perfect-game-presentation`: Fixed shared screen, Babylon Lite pixel-grid rendering, original assets, responsive controls/HUD, and recovery presentation.
- `game-delivery`: Template establishment, shared skills provenance, compatible backend/client release ordering, meaningful browser verification, and Pages delivery gates.

### Modified Capabilities

The inherited `babylon-lite-content`, `babylon-render-resolution`, and `source-organization-standards` capabilities are adapted to the fixed game, replacing showcase controls and generic folder names while preserving pixel-grid, resource lifecycle and UI/content separation contracts. Server implementation reconciles its own OpenSpec changes separately.

## Impact

- Game repository: root package/Vite configuration, renamed `space-invaders/` application, template React shell and Babylon Lite adapters, tests, `docs/`, workflows, and version metadata. These template files are established locally and implementation is in progress.
- Shared server: `multiplayer-server/src/server.ts`, a new game-specific relay room, additive relay/client support, private admission routing, tests, package release assets, game registry, and README demo catalogs.
- Observed dependencies: template `@babylonjs/lite@1.32.0`, React/Vite, Node 24; server/client version `0.9.9` with Colyseus SDK `0.17.43`. These are inspected source versions, not proof of a compatible published release.
- User-confirmed host authority overrides the create-game skill's generic server-authority default. The user now requests interview, update and apply-with-Playwright; implementation follows the reconciled plan.
- Publication remains contingent on actual backend and browser verification; planning files alone do not prove a playable delivery.
