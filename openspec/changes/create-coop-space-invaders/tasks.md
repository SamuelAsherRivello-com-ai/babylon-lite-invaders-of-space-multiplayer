# Tasks

The user has authorized interview, update and apply-with-Playwright. D1-D3 are resolved by the three interview answers; D4 follows the existing shared-server contract. Implementation items remain unchecked until their stated evidence exists.

## 1. Establish the template project and preserve planning

- [x] 1.1 Recheck the destination's existence and all required source revisions; create the game with GitHub template generation only when no conflicting destination exists. Verify origin/default branch and the bootstrap-history checklist before task-specific commits; preserve unrelated files.
- [x] 1.2 Stage and reconcile the generated checkout with this directory, preserving OpenSpec config and this entire change. Verify all planning files survive, existing template specs are inventoried, and no Git history or project files are replaced accidentally.
- [x] 1.3 Rename `project-name/` to `space-invaders/`, update Vite root/base, npm test paths, Pages output and ignore paths, and replace project metadata. Verify no unintended generic-folder references remain and baseline `npm ci`, `npm test`, and `npm run build` pass.
- [x] 1.4 Reconcile template OpenSpec `1.13.1` with this plan created under `1.14.0` using isolated tooling; generate compatible local skills without editing generated files. Verify validation, doctor output, target marker and generated metadata, and record the selected version without changing global tooling.
- [x] 1.5 Import the workflow-required shared skills as real files, resolve overlaps without overwriting customizations, and record source revisions, installation steps and actual licensing information in `docs/skills-import.md`. Verify imported files and provenance match the recorded source.
- [x] 1.6 Document fixed portrait presentation, proposed logical size, selected engine, root commands and four corner roles. Reconcile inherited showcase-specific specifications with the game scope; verify documentation and applicable accepted specs no longer claim showcase content is required gameplay.

## 2. Resolve gates before their dependent work

- [x] 2.1 Reconcile confirmed D1: three rows of six one-hit aliens, later armor/speed/fire variety without splitting. Verify matching proposal/design/spec examples.
- [x] 2.2 Reconcile confirmed D2: newcomers get three lives; private-token returns retain lives/elimination after refresh or intentional leave. Verify the lifecycle table covers these cases.
- [x] 2.3 Reconcile confirmed D3: alien breach defeats the team, with five-second shared results and wave-one replay. Verify lobby, combat, break, defeat and restart transitions are defined.
- [x] 2.4 Reconcile D4 with the existing shared-server route: verify a public 240-second game-specific session and document process/connection limits; do not claim the unapproved ten-minute continuity or add a provider.

## 3. Add the isolated relay protocol in the shared server

- [x] 3.1 Reuse or obtain the server checkout on its default branch, preserve unrelated changes, and create a server-scoped OpenSpec plan for this contract. Verify overlap with the active Rabbits relay and private-room hosting plans is reconciled without changing their scope silently.
- [x] 3.2 Add the isolated `space-invaders` room/registry and private create/join routing using existing code helpers. Add integration tests proving independent codes, solo admission, four occupied seats, fifth-seat rejection, URL-compatible normalized codes and no overflow rooms.
- [x] 3.3 Add server-stamped ordered input/membership actions, host-only checkpoint acceptance, protocol/run validation and bounded UTF-8/wire payload checks. Verify malformed numbers, spoofed senders, duplicate sequences, guest state publication, excessive message rates and oversized frames are rejected without affecting other games.
- [x] 3.4 After D2, connect private-code/recovery lifecycle to stable gameplay seats and publish neutralizing membership events. Verify hot join/drop does not reset other seats, full capacity includes reservations/spectators, and recovery follows the agreed life/identity policy.
- [x] 3.5 Add compatible host epochs, readiness and a bounded checkpoint/action journal around the existing relay helper. Verify explicit departure, missed heartbeat, duplicate traffic, stale returning host, successor failure and journal exhaustion produce one authority or a visible paused recovery state.
- [x] 3.6 Add a synthetic-world migration test that restores PRNG/clock/entities and replays acknowledged/unacknowledged action boundaries. Verify a checkpointed third death or last-alien result is not duplicated and a connected spectator can become host.
- [x] 3.7 Update the root feature catalog, sorted in-development game entries, `multiplayer-server/documentation/games.md`, and room protocol docs. Run `npm run check:docs`, `npm run typecheck` and `npm test`, including Rabbits and existing coded-room regressions.

## 4. Extend and release the shared client/backend before game integration

- [x] 4.1 Add opt-in new-game heartbeat/recovery, game-neutral action events, epoch/transfer/readiness state and cleanup to the shared client while retaining existing API/events. Verify fake transport/client tests cover connect, retry, disconnect, old-generation callbacks and timer teardown, and existing consumers still pass.
- [x] 4.2 Document the new client message/state contract, seat semantics, migration limits and exact release installation procedure in the client README. Verify examples use real exports and `npm pack --dry-run` includes all needed assets.
- [x] 4.3 After D4, adapt the supported deployment verification to create two private game clients, exchange a checkpoint/action, migrate the participant host and reconnect across the approved duration. Verify this probe is a required pre-promotion gate and preserves existing staging/rollback checks.
- [x] 4.4 Run Node 24 `npm ci`, docs/type checks, full server tests and packaging checks. Verify failures are resolved before scoped default-branch commits/pushes; include no unrelated server files.
- [x] 4.5 Invoke the actual backend release workflow with a discovered valid next version. Verify tag/release/client asset, deployed health version and public game-specific two-client migration/recovery probe, then fast-forward the local server checkout. Record actual version, endpoint and evidence; leave downstream tasks gated on failure.

## 5. Integrate the game session and pixel-perfect presentation

- [x] 5.1 Pin the exact verified shared-client release asset in the game package and lockfile; add safe local/production endpoint configuration. Verify installation uses the released artifact and errors never silently fall back to offline simulation.
- [x] 5.2 Replace the showcase with the fixed portrait game scene through the existing PixelPerfect2D entry point; preserve required gutters/corners and adapt shell dialog behavior. Verify sprite/view mutations use the entry point, host processing survives settings dialogs, and no showcase-only code remains active.
- [x] 5.3 Add original native-resolution sprites, player/shot colors and hit effects with provenance. Verify actual assets load in a production preview beneath `/babylon-lite-space-invaders-clone/`, and screenshots show distinct player seats and hostile shots.
- [x] 5.4 Add keyboard and independent-pointer movement/fire controls with neutralization and teardown. Verify simultaneous move/fire, pointer cancellation, focus loss, menu opening and remounts through focused input tests and browser interaction.
- [x] 5.5 Add lobby/create/join/share, four-seat life HUD, wave/enemy/score displays, spectator view and connection/migration/error states. Verify solo start and late join show current state without obscuring the arena on desktop and narrow mobile layouts.
- [x] 5.6 Implement local movement prediction, sequenced reconciliation and remote snapshot interpolation separate from authoritative simulation. Verify immediate local movement and stable remote motion under measured 200 ms RTT and up to 100 ms jitter, without applying rendered coordinates to gameplay.
- [x] 5.7 Add optional original event audio only if selected, with UI mute and `?mute=true`; verify both silence every sound. Document controls, presentation limits, actual asset provenance and WebGPU requirements alongside these changes.

## 6. Implement and verify host-owned game rules

- [x] 6.1 Implement deterministic fixed-step host movement, fire cadence, collisions, friendly-fire exclusion and expiring input. Verify pure rule tests cover bounds, simultaneous hits, neutral input and checkpoint serialization/restoration without requiring WebGPU.
- [x] 6.2 After D1, implement the agreed first formation and bounded increasing wave difficulty. Verify last-alien removal advances once, approved armor/pattern behavior matches fixtures, PRNG continuation survives transfer and entity/wire budgets hold across later waves and four players.
- [x] 6.3 After D3, implement three-life death/respawn/elimination, protected respawn, invasion failure and team defeat/restart phases. Verify deaths spanning waves, spectator inability to act, survivor continuation, simultaneous final deaths and clean wave-one replay.
- [x] 6.4 After D2, connect hot membership and authenticated recovery to player life/status state. Verify new arrivals, intentional leave, dropped eliminated seats, returning hosts and reserved seats match the lifecycle table and cannot reset another player's progress.
- [x] 6.5 Connect actual-world checkpoint acknowledgements and ordered replay to host transfer; neutralize departed input and discard speculative frames. Verify death, respawn, wave-clear and restart boundary migration never duplicates a life deduction or transition, and no usable checkpoint produces visible recovery failure.
- [x] 6.6 Document final game rules, host responsibilities, life/recovery semantics and the agreed limits in the README and verification guide. Verify descriptions match the implemented phase table and tests, with proposed defaults removed or explicitly resolved.

## 7. Verify complete gameplay and prepare delivery

- [x] 7.1 Run game rule tests, retained shell/render checks and production build. Verify no leaked timers/subscriptions or duplicated loops after retry, resize, fullscreen and repeated remount; inspect console/runtime and asset errors.
- [x] 7.2 Play a complete cooperative loop in two independent WebGPU-capable browser sessions: clear a wave, spend three personal lives, spectate a survivor, reach team defeat and restart. Verify both clients agree on lives, wave, score and phase; record real screenshots and browser/GPU details.
- [x] 7.3 Exercise one, two, three and four participants, fifth-seat rejection, two isolated codes, hot join/drop, forced host loss, spectator hosting, old-host return and latency/jitter. Verify the measured migration target and prediction/interpolation behavior with recorded evidence.
- [x] 7.4 Inspect desktop and narrow mobile layouts, integer and fractional fit, DPR changes, browser zoom, fullscreen, touch emulation and unsupported-WebGPU errors. Verify primary UI stays reachable and world framing remains fixed; disclose physical-device coverage separately.
- [x] 7.5 Preserve the real initiating prompt and consequential follow-ups in the README disclosure block with interpretations separate; add actual screenshots, setup commands, releases/endpoints and known limits. Verify every link, mark an unavailable original-prompt URL unverified, and retain useful template credits.
- [x] 7.6 Adapt game release checks to build before tagging and Pages to publish the renamed app output with root `version.txt`. Verify workflow commands and artifact paths against a local production build before release dispatch.

## 8. Release, verify publicly and finalize after implementation

- [ ] 8.1 Commit/push only scoped game changes on the default branch and invoke the inspected game Release workflow. Verify its checks, generated version commit, tag and release; never create a pull request or force-push as a side effect.
- [ ] 8.2 Deploy the intended release through Pages, dispatching the workflow explicitly if needed. Verify public subpath assets, displayed version, connection to the recorded relay and a public two-client full-loop/migration smoke test; do not equate deployment status with playable success.
- [x] 8.3 Verify the actual production session-duration/reconnect contract selected in D4 and repeat affected shared-game compatibility probes. Record remaining hosting/device limits and keep any unmet acceptance requirement unchecked.
- [ ] 8.4 Fetch and fast-forward both game and server checkouts to include release-generated commits. Verify clean task-related status, local/remote alignment and separate game/server release evidence without discarding unrelated work.
- [ ] 8.5 When implementation acceptance is actually met, use the applicable OpenSpec sync/archive/finalization workflow and return verified playable/repository/release links and checkout paths. Verify no task is marked complete merely because its artifact exists or deployment job is green.
