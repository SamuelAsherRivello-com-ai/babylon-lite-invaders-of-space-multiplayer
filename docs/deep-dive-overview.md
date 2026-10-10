# Deep Dive Overview

`rules.js` is the deterministic simulation: fixed-step movement, collisions, waves, personal lives and automatic team replay. Packed checkpoints preserve its PRNG, clock and action acknowledgement. Pure rule tests exercise those boundaries without a renderer.

`GameSession` coordinates the participant host and relay transport. The host applies ordered membership and input actions, advances the world, and publishes checkpoints. Guests predict their own ship and interpolate remote snapshots. A successor restores the committed world, replays pending actions, and acknowledges its epoch before resuming.

`renderer.js` projects that world through the Babylon Lite pixel-grid entry point into a 320×576 nearest-sampled texture. Presentation never feeds snapped coordinates back into rules. React supplies lobby, life HUD, settings, recovery messages and independent-pointer controls.

See [game design](game-design.md) for the complete rules and [layout](layout-and-game-integration.md) for the resolution contract. The shared server remains an opaque relay; the browser host is authoritative.
