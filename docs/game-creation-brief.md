# Completed game creation template

This is the implementation brief derived from the initiating template and the user's corrections. The original prompt remains verbatim in the README.

```text
$ai-skills-create-game

- Title: Space Invaders — Cooperative Defense
- Type: Online cooperative multiplayer for 1, 2, 3 or 4 human players on one team. A room can start solo. Players can join or leave during a wave.
- World and camera:
  - One fixed 320×576 logical-pixel portrait arena, shared by every player.
  - A front view of descending alien formations, with horizontally moving ships along the bottom firing upward.
  - A fixed orthographic 2D view; world bounds and framing do not change with player count, resize or fullscreen.
  - Babylon Lite with WebGPU and the PixelPerfect2D entry point. Use nearest sampling and integer display scaling when space permits, with proportional fractional fit on smaller screens.
- Core loop:
  - Defend the invasion line, dodge hostile shots and clear every alien to advance the wave.
  - Wave one contains three rows of six one-hit aliens.
  - Later waves add formation size, armor, speed, aimed fire and paired shots within explicit entity and bandwidth budgets. Aliens do not fracture or split.
  - A cleared wave gives a 2.5-second break before the next formation.
  - Each player has three personal lives across the entire run. Surviving players respawn after one second with temporary protection.
  - A third personal death makes that player a spectator while any connected teammate remains alive.
  - All connected players eliminated, or any alien crossing the invasion line, ends the team run.
  - Show shared results for five seconds, then automatically restart everyone together at wave one with three lives.
- Controls:
  - A/D or left/right arrows move horizontally; Space fires upward.
  - Independent on-screen direction and FIRE pointers support simultaneous touch movement and shooting.
  - Release input on focus loss, cancellation, settings and departure. Settings pause only that player's controls while the host continues the shared simulation.
  - F toggles fullscreen; settings also provides the fullscreen control.
- Cooperative mechanics:
  - Create or join a private four-character room. Share its public code or invite URL.
  - The creator starts the run; later arrivals enter the current wave with three lives.
  - Disable friendly fire. Give each seat a distinct ship color.
  - Returning with the browser's private room-scoped token preserves identity, lives and elimination, including after refresh or intentional departure.
  - Intentional departure frees occupancy immediately. A dropped connection reserves occupancy for fifteen seconds. Spectators occupy a seat and can host.
  - Dispose an empty room after fifteen seconds.
  - Adapt wave difficulty to connected living players while keeping identical world bounds.
- Look and feel:
  - Original pixel ships, animated aliens, armor, bright shots, stars and short hit/death effects.
  - Dark navy space with mint, amber, violet and blue player colors; readable hostile projectiles.
  - Show personal lives, all four teammate seats, team score, wave number, remaining aliens, room code, connection/host status and spectator state.
  - Retain the template's four corner roles: title, source repository, settings and release version. Use coordinated space artwork in the gutters.
  - Keep controls and recovery UI reachable on desktop and narrow mobile viewports.
  - Deliberately omit audio and music. The game remains silent with ?mute=true.
- Gameplay requirements:
  - One upward laser weapon with a controlled firing cadence and no friendly damage.
  - Deterministic fixed-step movement, collision, scoring, personal lives, wave breaks and shared restart.
  - Increasing alien armor and fire variety; no asteroid physics, fracturing, top-down dungeon, loot, revives, dodge roll or unrelated bosses from the original example template.
  - Useful unsupported-WebGPU, graphics initialization timeout, retry, full-room, expired-room and paused-recovery states.
- Multiplayer server and smoothness:
  - Extend https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server with an isolated space-invaders room and compatible shared-client events.
  - Use the existing free Vercel Hobby plan only. Publish the static game through GitHub Pages.
  - The elected participant host owns and simulates movement, aliens, projectiles, damage, lives, score and waves. The server is a relay, not a gameplay simulator.
  - The relay validates admission, private recovery, ordered input/membership, authority epochs, host-only opaque checkpoints, payload bounds and message rates.
  - Run the host at 60 Hz with bounded catch-up. Send input and checkpoints at 20 Hz; expire stale input after 300 ms.
  - Predict every local ship immediately without feeding presentation coordinates into gameplay. Reconcile acknowledged input and interpolate remote snapshots for guests.
  - Elect a successor on departure or missed heartbeats. Restore the last committed world and pending ordered actions before the successor acknowledges its epoch and resumes.
  - Hidden tabs yield eligibility. Returning stale hosts remain guests. A missing checkpoint or exhausted journal gives a visible recovery error rather than resetting silently.
  - Bound checkpoints to 12 KiB, the journal to 256 actions, active players to four, aliens to eighty, hostile shots to sixty-four and friendly shots to twenty-four.
  - Verify two real WebGPU browser clients, complete gameplay, capacity and isolation, refresh recovery, spectator hosting, host handoff, and responsiveness with 200 ms configured round-trip delay and up to 100 ms jitter.
  - Verify a public four-minute session. Document Vercel's temporary process-local room and 300-second function limits; browser-host migration does not recover a lost backend process.
- Inspiration links:
  - https://en.wikipedia.org/wiki/Space_Invaders — descending formations, horizontal bottom movement, upward shooting and wave progression.
- Inspiration screenshots:
  - No external screenshots supplied. Actual implementation screenshots are docs/screenshot01.png and docs/spectating.png.
- Originality requirement:
  - Keep the selected project title. Create original pixel artwork, characters, effects, interface and arena presentation; use Space Invaders for gameplay inspiration only.
```
