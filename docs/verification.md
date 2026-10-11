# Verification evidence

## Automated game checks

`npm test` passes 31 tests covering deterministic rules, personal lives, wave transitions, checkpoint replay, input neutralization, host and guest prediction, bounded action retention, pixel-grid policy, WebGPU errors, and shell layout. `npm run build` produces the GitHub Pages subpath build.

## Shared relay

- Node 24.21.0 targeted real-Colyseus test passed for capacity, private-code isolation, stable identity recovery, ordered inputs, host-only checkpoints, explicit/silent host migration, stale-host fencing, malformed traffic, rate limits and journal exhaustion.
- The staged deployment `https://rmc-colyseus-multiplayer-server-guf62h2x1.vercel.app` completed the 240-second Space Invaders probe with checkpoint tick 238 and successful host migration on 2026-10-10 UTC.
- Four simultaneous private Space Invaders admissions passed against that deployment using the corrected shared client.
- The shared Combat regression revealed Vercel cold-instance admission and upgrade routing. Bounded same-invitation HTTP retries and issued-reservation socket retries passed its complete public integration test. No compatibility assertion was removed.
- These historical staged checks are supplemented by the stable production and published frontend results below.

## Browser checks

Microsoft Edge uses hardware WebGPU on Intel Gen-12LP; `isFallbackAdapter` is false. The actual renderer and lobby were inspected at 1280×720. A separate mobile-emulated context at 390×844 and DPR 2 displayed the complete portrait lobby without scrolling and opened/closed settings. A separate context with WebGPU disabled showed the graphics guidance and retry control, with settings still usable.

Physical touch devices have not been tested. Touch emulation and independent-pointer unit tests do not prove physical-device compatibility. Public frontend verification is recorded separately below.

Resize verification in Edge confirmed 640×1152 at integer 2× for a 1920×1200 window; proportional 266.66×480 CSS fit for 320×480; and 320×576 at 1× for 1280×720. A simulated DPR change from 1 to 1.5 changed backing width from 320 to 480 once. Fullscreen entry/exit through settings succeeded. These checks preserve fixed world framing; physical fractional-DPR displays and physical touch hardware remain untested.

The complete shared-server suite passed all 134 tests under Node 24.21.0 after the admission fix. Client packaging, documentation validation and TypeScript checks also passed.

The actual game simulation also completed wave clear, personal three-life elimination, spectator survivor continuation, team defeat and automatic wave-one replay over the staged public relay in 30.185 seconds. Migration after a committed personal death preserved the life record and private-token rejoin restored the same seat. This is network/session evidence, separate from the WebGPU cooperative browser checks documented here.

With ordered WebSocket impairment configured as 100 ms each way and ±50 ms jitter, the actual networked simulation completed the same full loop plus committed-death migration and recovery in 59.556 seconds. Across 13,184 delayed messages, measured one-way delay was 51.39–258.00 ms, mean 126.93 ms (including host scheduling stalls and ordered queuing). This does not substitute for the browser prediction/interpolation visual check.

The complete WebGPU browser loop passed against the staged relay `https://rmc-colyseus-multiplayer-server-r3o5u3ru2.vercel.app`: solo start, late joining through four seats, fifth-player rejection, hot drop, settings while the host continues, wave clear, three personal deaths, spectating a surviving pilot, shared defeat and automatic wave-one restart. The gameplay portion took 41.932 seconds. Background visibility and lifecycle were emulated; the silent-host handoff took 2.743 seconds. Returning the old host did not reclaim authority, and refresh restored its private identity. Browser input was automated through keyboard events, with no world-state mutation. There were no page errors. This check found and fixed missing room-code retention in the URL after create/join.

The authenticated [Hobby audit](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/38084550878) confirmed `plan: hobby` and the existing relay project. No plan change or additional hosting provider was used.

Two WebGPU browser clients also completed the gameplay loop under ordered WebSocket delays configured as 100 ms each way with ±50 ms jitter. The gameplay portion took 41.326 seconds; silent-host handoff took 3.054 seconds. Host movement appeared after 49.6 ms and guest movement after 35.8 ms, without waiting for the relay acknowledgement. Across 7,031 delayed messages on the final page lifetimes, one-way delay ranged from 49.9 to 189.8 ms, including scheduling and ordered queuing. There were no page errors.

Mobile touch emulation at 390×844 passed concurrent direction/fire, releasing direction while fire remained held, pointer cancellation, settings resume and actual movement, with no overflow. A separate private code remained isolated. Under the same delay profile, 122 animation-frame samples of a remote alien had a maximum adjacent horizontal displacement of 1.151 logical pixels; the unmodified-network run had 121 samples and a maximum of 0.339 pixels. Physical touch hardware remains untested.

The extended delayed-browser run also passed spectator hosting: the eliminated pilot took authority in 3.175 seconds, stayed eliminated, and continued simulating for the survivor. The earlier handoff in this run took 3.817 seconds, including configured network impairment. The returning old host stayed a guest. The full loop, both handoffs and replay completed in 50.776 seconds with no page errors.

An intentionally stalled adapter request produced the graphics timeout/retry state after fifteen seconds; retry obtained the real hardware adapter and displayed the game. Desktop 125% zoom was emulated with a 1024×576 CSS viewport and DPR 1.25: the logical world stayed 320×576, the backing surface became 400×720, and the page stayed within its viewport. Settings remained reachable. This is zoom emulation, separate from physical browser UI zoom and physical fractional-DPR hardware.

## Reproduce browser verification

The checked-in callbacks use Playwright CLI with a headed WebGPU-capable browser. Start the local game with `npm run dev -- --host 127.0.0.1 --port 5185 --strictPort` before local checks. The callbacks open independent browser contexts, drive actual controls, and close their own contexts. Local gameplay inspection is read-only and omitted from production.

```sh
playwright-cli -s=invaders open about:blank --browser=msedge --headed
playwright-cli -s=invaders run-code --filename=scripts/verification/gameplay.js
playwright-cli -s=invaders eval 'window.__browserEvidence'
playwright-cli -s=invaders run-code --filename=scripts/verification/touch-and-motion.js
playwright-cli -s=invaders run-code --filename=scripts/verification/graphics-and-zoom.js
node scripts/verification/generate-latency.mjs
playwright-cli -s=invaders run-code --filename=.implementation/latency-browser-gameplay.js
playwright-cli -s=invaders run-code --filename=.implementation/latency-touch-and-motion.js
node scripts/verification/generate-public.mjs
playwright-cli -s=invaders run-code --filename=.implementation/public-browser-gameplay.js
```

The public two-client callback observes received WebSocket frames without a production debug API. It checks wave clear, spectator continuation, both living and spectator host handoffs, refresh recovery, team defeat, automatic replay and cross-client agreement. Browser resource limits can affect how many simultaneous WebGPU contexts one test machine can initialize; separate physical machines are not represented by a single GPU's context limit.

Before publication, this passive-observation callback passed the complete loop against the staged relay using the local browser client in 78.130 seconds. Living-host and spectator-host handoffs took 3.366 and 2.911 seconds, respectively. Both clients agreed on the new run, wave one, score zero, combat phase and restored lives. This establishes the verifier's behavior; it does not claim the GitHub Pages deployment has been tested yet.

Shared-server release run `38084815998` passed all local checks but encountered intermittent public Bomberman, Combat and Ring Rivals failures. A focused repeat against its same staged deployment passed all four affected integration tests. The deployment gate now retains both attempt logs and permits one failed-test rerun; every assertion must pass before promotion. A permanent-failure fixture verified that rerunning cannot turn an enduring assertion failure into success. No assertion or compatibility test was removed.

On October 11, 2026 (UTC), the published v0.9.12 client artifact was installed from its exact GitHub release URL. Fresh installation reported zero audit vulnerabilities; all 31 game tests and the production build passed under Node 24. The stable production relay reported v0.9.12. Its game-specific protocol check passed in 21.078 seconds, and its 240-second session probe passed with checkpoint tick 239 and successful migration. The passive browser verifier, using this released client against that production relay, passed in 78.160 seconds with no page or asset errors; living and spectator host handoffs took 3.331 and 2.608 seconds. This run used the local frontend; the deployed frontend is checked after publication.

## Published delivery

[Release v0.0.9](https://github.com/SamuelAsherRivello/babylon-lite-space-invaders-clone/releases/tag/v0.0.9) passed its [release workflow](https://github.com/SamuelAsherRivello/babylon-lite-space-invaders-clone/actions/runs/38111268189). The explicitly dispatched [Pages deployment](https://github.com/SamuelAsherRivello/babylon-lite-space-invaders-clone/actions/runs/38111290352) published commit `58b0709e4fd7378312ee58fdf2c0cb29d25cd10a`; its public `version.txt` serves `version=0.0.9`.

The [actual public game](https://samuelasherrivello.github.io/babylon-lite-space-invaders-clone/) passed the passive two-client browser verifier in 49.256 seconds on October 11, 2026 UTC. It verified wave clear, three personal deaths, spectator continuation, team defeat, automatic replay, living-host migration (2.727 seconds), spectator-host migration (3.109 seconds), stale-host return, refresh identity recovery and agreement on run/wave/score/lives. There were zero page or static-asset errors. Browser windows were minimized for the final run; hidden/frozen host loss was explicitly emulated. Two earlier public attempts were interrupted by browser closure and are not counted as passes.

The game pins the actual [shared-client v0.9.12 release](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/releases/tag/v0.9.12); its tarball SHA-256 is `708bb889f1b17ced20e6c1e4573448a9cbce3752a840b3d63e2d1abf5748b178`. Production `/api/health` reported v0.9.12 with `space-invaders` registered during public verification. Shared backend main can advance for other consumers without changing this pinned artifact.

The existing Vercel project remains on free Hobby. Rooms are process-local and can expire with instance loss or connection limits; the verified duration is four minutes. Host migration does not provide durable storage or cross-instance routing. The backend's separate private-room infrastructure proposal retains its broader target; this game does not claim that work is complete. Physical touch, physical fractional-DPR hardware and native browser UI zoom remain unverified.

Verification helpers minimize new Chromium windows through CDP. They emulate visibility deliberately so background automation can exercise simulation separately from the explicit hidden-host tests.
