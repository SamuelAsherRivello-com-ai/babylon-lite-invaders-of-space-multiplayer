# Design

## Context

See [proposal.md](proposal.md) for motivation and scope. This directory was empty, without Git or application code. With explicit user approval, OpenSpec was initialized using the installed CLI, version `1.14.0`, with no generated AI tools. Nothing has been copied from the template or deployed.

### Inspected sources, 2026-10-10

| Source | Revision | Evidence relevant to the design |
| --- | --- | --- |
| [Browser template](https://github.com/SamuelAsherRivello/github-repository-template/tree/49d6c20741f2aaac509f7954392d72526614aca6) | `49d6c20741f2aaac509f7954392d72526614aca6` | `AGENTS.md`, usage checklist, layout guide, package/Vite configuration, pixel-grid entry, initialization/configuration, main rendering/layout specs, Release and Pages workflows |
| [Shared server](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/tree/d01a2d6c567d0504727b10dc106d083b276d1075) | `d01a2d6c567d0504727b10dc106d083b276d1075` | Agent instructions, README, game catalog, relay helper and Rabbits room/tests, private-code lifecycle, server admission/registry, client implementation/README/package, release/deploy/Render-check workflows, hosting configuration and long-session probe |
| [Shared skills](https://github.com/SamuelAsherRivello/ai-skills-library/tree/f3700fdd4fab4cde2047a99a305ae3ac57e3d0c5) | `f3700fdd4fab4cde2047a99a305ae3ac57e3d0c5` | Agent instructions, README, skill tree and ordinary-file installation guidance; root README reports no repository license |
| [Pixel Walker](https://github.com/SamuelAsherRivello/babylon-lite-pixel-walker/tree/56dc58eedbb89b9a93016525d6e10465756dfc57) | `56dc58eedbb89b9a93016525d6e10465756dfc57` | README original-prompt disclosure presentation; gameplay and older engine version are not inherited |

All three required repositories report `main` as their default branch. The sources were read through GitHub; no remote write occurred. These revisions must be refreshed and differences reviewed when implementation starts.

### Confirmed versus proposed

Confirmed: Space Invaders with descending aliens replaces the asteroid concept and Gungeon example; one to four cooperative players can join/drop; the participant host simulates; the service is a relay; host departure migrates authority and preserves the run; every player has three lives across all waves, then spectates until the whole team is eliminated and starts over at wave one.

Presentation defaults: title `Space Invaders Clone`, repository slug matching this directory, fixed portrait `320 x 576` logical scene, left/right movement along a shared bottom band, upward fire, no friendly fire, original pixel assets, and a two-second protected respawn. The subsequent three-question interview confirmed three rows of six one-hit aliens initially, then armor/speed/fire variety without splitting; three lives for newcomers with retained life/elimination state for returning players; and team defeat on an invasion breach.

## Goals / Non-Goals

**Goals:**

- Make a single host simulation transferable, independently testable, and separate from rendering, networking, and local prediction.
- Reuse the template shell and released shared client while adding only the missing relay/session capabilities.
- Make migration, late join, and elimination observable and verifiable with independent clients.
- Keep deferred gameplay and hosting decisions as explicit gates, allowing useful infrastructure work without silently deciding them.

**Non-Goals:**

- Server-side alien AI, movement simulation, projectile collision, damage, or wave computation.
- Asteroids/fracturing inherited by accident, dungeon traversal, mouse aiming, dodge rolls, loot, revives, weapon upgrades, or mandatory bosses from the example prompt.
- Competitive anti-cheat against a malicious host, accounts, cross-device persistent identities, durable saves, ranked scores, or spectator seats beyond the four occupied seats.
- Feature branches, worktrees, pull requests, or upstream template/global-skill edits.
- Changing the shared hosting provider or claiming continuity beyond its documented process-local limits.

## Decisions

### 1. Establish the real template checkout without losing this plan

On implementation approval, check whether the intended destination repository exists before template generation. A collision is not permission to replace it. For a new repository use GitHub's template-generation API/CLI flow, verify its `origin`, default branch, and template bootstrap-history checklist before adding project-specific commits. Clone into a temporary staging location, reconcile its `openspec/` contents with this initialized planning root, and bring the generated checkout into this named directory without deleting planning files. Do not run clone directly over this nonempty folder or create unrelated worktrees.

Rename `project-name/` to `space-invaders/`; update root npm scripts, Vite `root` and `base`, Pages artifact path, `.gitignore`, and documentation references. Keep package/lockfile/workflows at the root, game source/tests/assets beneath the app directory, and documentation imagery under `docs/`. Reuse the four corner roles and required external gutters. Treat inherited showcase-only specs as template examples and reconcile their applicability before claiming the generated game satisfies its main specs.

The template pins OpenSpec `1.13.1`; this planning environment is `1.14.0`. Preserve these artifacts, test validation with the template's pinned CLI using an isolated invocation, and use that version for generated local tools unless an explicit compatibility update is recorded. Do not downgrade global tooling or hand-edit generated skills. The create-game workflow requests a shared-library import despite the template's generic minimal-skill preference: copy the required library skills as real files, preserve overlapping customizations, record revisions and per-skill licensing facts, and use the compatible generator for generated OpenSpec skills. Missing licensing information remains disclosed, not fabricated.

### 2. Reuse relay infrastructure, not another game's combat room

The server has `ParticipantHostRelay` with longest-active-participant election, host-only `publish`, latest `{state, random, clock, sequence, timestamp}` retention, and `expire(now, timeoutMs)`. `JustLikeRabbitsRoom` demonstrates ordered actions and state transfer, but has twelve seats and public single-room admission. Its client heartbeat is hard-coded to `just-like-rabbits`. It is not a ready-made four-player private action-game protocol.

Add `space-invaders-room.ts` and a `space-invaders` registry entry. Combine the reusable election helper with existing private-code admission and lifecycle support; extend `server.ts`'s private admission routing and recovery type handling explicitly, because registry insertion alone currently uses public `reserve(game)`. Preserve the old game keys, constructor signatures, message handlers, and release tarball names. Server membership and transport validation remain authoritative; the server does not step the world.

Use existing code helpers for four-character create/join links, URL auto-join, and capacity errors. A player may start a solo room; later arrivals do not reset it. Four seats include eliminated spectators and bounded recovery reservations. Life recovery uses the confirmed lifecycle table below.

Server changes belong in a scoped change within the server repository during apply. Reconcile the active `add-just-like-rabbits-relay` work and `standardize-private-room-flow` hosting plan before changing their shared modules; do not rewrite or mark their tasks complete from this game root.

### 3. One versioned host-owned world

Put pure simulation in game modules such as `src/game/simulation.js`, `rules.js`, and `wave-plan.js`. Networking uses `session.js` and `protocol.js`; local input/prediction and Babylon presentation are separate. These are proposed paths, not existing modules.

Use fixed 60 Hz simulation steps driven by monotonic elapsed time, with at most four catch-up steps per frame; do not simulate a long hidden-tab backlog. Snapshots publish initially at 20 Hz, inputs at up to 20 Hz with immediate sends for control transitions. Guests predict only their own horizontal movement and cosmetic shot feedback. The host validates world bounds, input expiry, fire cadence, damage, respawns, elimination, wave completion, and run restart.

The checkpoint includes `protocolVersion`, `rulesVersion`, `runId`, `hostEpoch`, `tick`, `lastAppliedRelaySeq`, PRNG state, simulation clock, wave/phase/timers, formation state, aliens and HP, all projectiles, player seat identities/lives/status/positions/cooldowns, and next entity/event identifiers. A consumed-life result is represented in the checkpoint with a stable event ID. Randomness uses the transferred PRNG; spawn timers do not depend on a new host's wall clock. Spectating does not disqualify a connected, healthy browser from hosting.

### 4. Relay protocol and bounds

| Direction | Proposed message | Contract |
| --- | --- | --- |
| Participant to relay | `input` | `{protocolVersion, runId, hostEpoch, clientSeq, axis, fire}`; axis finite in `[-1,1]`, fire boolean, increasing safe-integer sequence |
| Participant to relay | `heartbeat` | Liveness only; approximately once per second, independent of rendering/input |
| Participant to relay | `ready` / `restartRequest` | Bounded intent; relay orders it, host resolves it under the approved start/restart policy |
| Relay to host | `gameAction` | Server-stamped sender/seat, relay sequence and receive time; input or membership event |
| Host to relay | `hostSnapshot` | Versioned complete checkpoint, host epoch, tick and acknowledged relay sequence |
| Relay to participants | `gameState` | Accepted host checkpoint and server-owned host identity/epoch |
| Relay to participants | `hostTransfer` | New host/epoch, committed checkpoint and ordered unacknowledged event suffix |
| New host to relay | `hostReady` | Restored checkpoint identity/tick; opens the new authority generation |

Introduce additive shared-client listeners/state for `gameAction`, epochs, and migration readiness, plus opt-in heartbeat/recovery for the new game. Preserve `habitatAction` for Rabbits. Use relay-authenticated sender IDs; never trust a client-supplied seat. Invalid game keys/codes, full rooms, malformed numbers, duplicate sequences, old run IDs, and superseded host epochs are rejected without state changes.

The current transport's `maxPayload` is 16,384 bytes, while Rabbits checks up to 48,000 JSON characters. Do not inherit that conflicting limit or raise the shared cap silently. Limit the new game's encoded checkpoint to at most 12 KiB, leaving envelope overhead; measure actual serializer frame size against the transport cap. Initial entity budgets: at most 80 aliens, 64 hostile shots, 24 friendly shots, four player states, and no cosmetic particles in synchronized state. Cap inputs plus snapshots within the existing approximate 60-message-per-client-per-second envelope. Verify rates/bytes under load and lower budgets when necessary; wave complexity cannot grow network state without bound.

### 5. Automatic migration with fencing and bounded replay

The current helper retains only a latest snapshot and host identity; it lacks a host generation and action suffix. Extend compatibly or add a game-neutral wrapper used by this game. Increment a server-owned `hostEpoch` on every authority change, and accept authoritative output only from that epoch's host. Delayed packets from a returning previous host cannot roll back current state.

Keep a bounded ordered input/membership journal since the latest host-acknowledged checkpoint. The host consumes that order at tick boundaries and publishes its acknowledgement. A successor restores the checkpoint, neutralizes the departed player's input, and processes the retained suffix once. Duplicate action/event identifiers are ignored; unacknowledged inputs can be reapplied from restored state, not applied on top of tentative prior outcomes. Future frames and tentative effects beyond the checkpoint are discarded. A short visible rollback to committed state is possible; zero lost speculative frames is not promised.

On explicit host leave, elect immediately. For silent host failure, propose a three-second liveness threshold with one-second heartbeats; target resumption within five seconds under the defined test network profile. Freeze shared progression while authority is unresolved. The elected successor sends `hostReady` before new authoritative publication is accepted; if it cannot restore or does not become ready, mark it ineligible and try the next participant. A returning old host rejoins as a guest. Hidden hosts should voluntarily yield when another eligible participant is available; a lone hidden host can hold a clearly displayed suspended session rather than advancing catch-up deaths.

Bound the journal to 256 events and the uncommitted window to one second of normal traffic. If the host stops committing or the journal would overflow, pause admission of new gameplay actions and recover authority; do not drop an action suffix and pretend the run is preserved. If no valid checkpoint or successor exists, show a recovery error and offer return to the lobby instead of silently restarting at wave one. Backend process loss is a separate hosting failure, not participant-host migration.

### 6. Combat, lives and spectating

Players move horizontally in the bottom band and shoot upward at aliens moving sideways and descending. Aliens shoot readable downward attacks. Clear the complete alien set to advance the numbered wave once; phase transitions are host-owned and included in checkpoints. A shared score can coexist with player contribution counts, but lives are personal and do not refill between waves.

Death one or two schedules a protected respawn; death three eliminates the player for that run. An eliminated player's input cannot move/fire or trigger a respawn. They still see the full shared arena, living-player labels, and team status. When all participating connected players are eliminated, enter team defeat. Restart resets wave, lives, shots, score, timers and PRNG/run identity consistently for everyone. The resolved lifecycle table below defines recovery reservations and restart timing.

Confirmed progression: wave one has three rows of six one-hit aliens with slow straight downward fire. Later waves increase row/column count within 80 aliens, movement speed within a readable cap, and firing cadence within projectile budgets. Armor appears from wave three with HP capped at four; aimed and three-shot fan attacks appear progressively. No alien splits. Exact tuning values are implementation choices verified for readability.

### 7. Fixed portrait presentation and responsive input

Use the skill's portrait default with a proposed `320 x 576` logical arena and a fixed view containing every player and alien; no following camera, scrollable dungeon, teammate-offscreen arrows, arbitrary sprite rotation, or fractional camera zoom. Keep playable space clear of the four React corners, HUD, and touch controls.

Initialize `BabylonLiteAIEntry.configure({mode: BabylonLiteMode.PixelPerfect2D})`; use its `addSprite`, `move`, `update`, `updateView` and `centerView` APIs. Keep simulation and prediction positions fractional and separate from snapped presentation. Use nearest sampling, no mipmaps, MSAA 1, centered integer logical-to-CSS scaling when it fits, DPR applied once, and a documented positive fractional fit below 1x. Browser zoom/fullscreen/resize cannot change world bounds or authoritative positions.

Controls: A/D or left/right arrows, Space to fire, and separate on-screen left/right/fire buttons supporting simultaneous pointer IDs. Clear controls on blur, pointer cancel, menu opening, disconnect, and teardown; held input expires after 300 ms at the host. Local settings pause only local input/presentation. Adapt the template's dialog-driven processing pause so it never stops host simulation for everyone; networking and liveness remain independent. A dedicated solo shared-pause behavior, if desired, is a separate decision.

Use distinct four-player colors and seat labels, contrasting hostile/friendly shots, original alien silhouettes, hit feedback and small explosions. Prefer code-authored pixel sprites or a native-resolution atlas; record actual provenance. Optional audio is 4-10 original event effects, no required music, mute UI and `?mute=true`. No reference art, branding, or sounds are copied. HUD shows wave, remaining aliens, team score and all four seat/life/spectator states. Show connecting/full/retrying/migrating/unsupported-WebGPU/error states within the shell.

### 8. Public hosting is a separate release gate

Observed server release deploys Vercel, runs a 240-second feasibility relay and documents process-local rooms with a 300-second connection limit. Its active hosting plan explicitly defers cross-instance continuity and constrains that release to free first-party Vercel infrastructure. The historical single-instance Render Blueprint is not the active release target. No live endpoint, credentials, provider quota, or compatible released Rabbits relay has been verified in this proposal phase.

Use the existing Vercel release route and its documented process-local contract; verify a 240-second public game-specific two-client session including participant-host migration and same-process reconnect. The suggested ten-minute run was never approved and is not a user requirement. Do not claim cross-instance or process-loss continuity or change the hosting provider. Public verification and explicit recovery errors remain delivery gates. The relay never simulates gameplay.

### 9. Verification and delivery order

After separate apply authorization, establish the template checkout and preserve planning, then implement/test/release the backend and exact shared client before game-client integration. Template establishment is not game-client implementation. Backend integration tests can use deterministic synthetic checkpoints before game artwork exists. Discover the next release version and exact tarball URL; do not assume source `0.9.9` includes the new game or invent a future tag.

Backend checks: Node 24 `npm ci`, `npm run check:docs`, `npm run typecheck`, `npm test`, client `npm pack --dry-run`, regression games, capacity/isolation and migration probes. Update sorted consumer lists as in-development until a verified Pages URL exists. Extend the game-specific deployment probe and the selected workflow, preserving staging, promotion, and rollback behavior.

Game checks: adjusted existing `npm test`, `npm run build`, deterministic rules/transitions, production subpath asset loading, two independent WebGPU browsers, keyboard and emulated multitouch, full three-life elimination/spectating/restart, guest/host drop and migration, two simultaneous private rooms, fifth-seat rejection and same-run recovery. Test one through four players. Use a measured profile of 200 ms RTT with up to 100 ms jitter, recording effective rather than merely configured delay; target local movement feedback within one animation frame and no duplicated hit/life/wave outcomes. Physical mobile testing remains unverified unless performed.

Use Edge with hardware WebGPU if the embedded browser cannot support it. Capture screenshots from the actual build. Adapt the template Release workflow to run a production build before tagging: its inspected release currently tests but does not build. Rename the Pages `project-name/dist` artifact path. Keep `version.txt` authoritative for the game, independently of the server/client package version. Verify public game assets, gameplay, backend compatibility and visible version after Pages deployment; dispatch Pages explicitly if a release bot push did not trigger it. Fetch/fast-forward both local checkouts without discarding unrelated work.

## Risks / Trade-offs

- [Malicious or faulty participant host] -> Host authority is intentional; relay validation prevents guest/state spoofing and stale publishers, but does not make combat tamper-proof.
- [Migration replays a recent death or wave transition] -> Restore committed state, deduplicate event IDs, fence epochs and test deaths/wave clears at handoff boundaries.
- [Browser throttling or GPU-heavy frame work] -> Separate fixed-step world, networking/liveness and renderer; yield hidden authority and cap catch-up/entity budgets.
- [Checkpoint exceeds transport frame size] -> Measure serialized bytes, cap synchronized entities and omit cosmetic particles; do not use the Rabbits 48,000-character check as the wire limit.
- [Leave/rejoin restores three lives] -> Private-token identity/life recovery must be tested; existing code-based anonymous seat recovery is not sufficient evidence of identity continuity.
- [Process loss is confused with host migration] -> Document separate failure states and gate production hosting continuity before declaring playable delivery.
- [Imported tooling overwrites this plan or global setup] -> Stage template merge, preserve initialized artifacts, resolve the 1.13.1/1.14.0 difference locally, and never edit generated skills by hand.

## Migration Plan

1. Preserve this plan while creating the game from the inspected template; re-read current instructions/revisions and keep default branches.
2. Add a server-scoped OpenSpec change for the isolated relay contract, reconcile overlapping active work, implement and validate locally.
3. Stage and verify the existing backend route and its bounded session contract, then publish the compatible shared-client release. A failure leaves public delivery incomplete.
4. Build the game against that pinned client, complete gated gameplay choices and browser verification, and adapt docs/workflows.
5. Release and deploy Pages only after actual verification; align both local checkouts with generated version commits.
6. On backend rollout failure use its supported rollback and keep the previous game/client dependency pin. On game rollout failure redeploy the last verified game revision. Do not publish another version merely to retry a failed deployment.

## Resolved Decisions and Lifecycle

The three-question interview resolves D1-D3. D4 uses the existing shared-server contract rather than adding an unrequested duration/provider requirement. Task references to these IDs now denote verification of resolved choices.

| Case | Required behavior |
| --- | --- |
| New player joins an available seat | Three lives, protected spawn, current wave preserved |
| Known player refreshes or reconnects | Restore remaining lives/elimination using a private room-scoped recovery token |
| Player intentionally leaves and returns | Retain the same run's life record; release occupancy but retain the token record until run reset/room disposal |
| Eliminated player returns | Spectate until the next run |
| Host leaves or fails liveness | Promote an eligible participant and preserve committed world/life records |
| All connected players eliminated | Team defeat; disconnected records do not stall results indefinitely |
| Aliens reach the invasion line | Immediate team defeat regardless of lives |
| Defeat | Five-second shared results screen then reset wave/lives/entities/score together |
| First participant starts | Host start from lobby; hot joins need no ready gate |
| Last participant leaves | Keep a 15-second recovery grace then dispose the room/token records |
| Relay process/instance is lost | Show expired/unavailable room and offer a new room; no durable continuity claim |

Recovery tokens are privately delivered, absent from snapshots/links, and stored per room in the browser. Clearing storage or switching devices creates a new anonymous participant; no account identity is claimed. Tests must exercise refresh and intentional leave with the same token, including eliminated players.

