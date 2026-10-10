# Verification evidence

## Automated game checks

`npm test` passes 31 tests covering deterministic rules, personal lives, wave transitions, checkpoint replay, input neutralization, host and guest prediction, bounded action retention, pixel-grid policy, WebGPU errors, and shell layout. `npm run build` produces the GitHub Pages subpath build.

## Shared relay

- Node 24.21.0 targeted real-Colyseus test passed for capacity, private-code isolation, stable identity recovery, ordered inputs, host-only checkpoints, explicit/silent host migration, stale-host fencing, malformed traffic, rate limits and journal exhaustion.
- The staged deployment `https://rmc-colyseus-multiplayer-server-guf62h2x1.vercel.app` completed the 240-second Space Invaders probe with checkpoint tick 238 and successful host migration on 2026-10-10 UTC.
- Four simultaneous private Space Invaders admissions passed against that deployment using the corrected shared client.
- The shared Combat regression revealed Vercel cold-instance admission and upgrade routing. Bounded same-invitation HTTP retries and issued-reservation socket retries passed its complete public integration test. No compatibility assertion was removed.
- These staged checks do not establish the final stable endpoint or published client release. Those remain release acceptance gates.

## Browser checks completed so far

Microsoft Edge uses hardware WebGPU on Intel Gen-12LP; `isFallbackAdapter` is false. The actual renderer and lobby were inspected at 1280×720. A separate mobile-emulated context at 390×844 and DPR 2 displayed the complete portrait lobby without scrolling and opened/closed settings. A separate context with WebGPU disabled showed the graphics guidance and retry control, with settings still usable.

Physical touch devices have not been tested. Touch emulation and independent-pointer unit tests do not prove physical-device compatibility. Public release verification remains pending.

Resize verification in Edge confirmed 640×1152 at integer 2× for a 1920×1200 window; proportional 266.66×480 CSS fit for 320×480; and 320×576 at 1× for 1280×720. A simulated DPR change from 1 to 1.5 changed backing width from 320 to 480 once. Fullscreen entry/exit through settings succeeded. These checks preserve fixed world framing; physical fractional-DPR displays and physical touch hardware remain untested.

The complete shared-server suite passed all 134 tests under Node 24.21.0 after the admission fix. Client packaging, documentation validation and TypeScript checks also passed.

The actual game simulation also completed wave clear, personal three-life elimination, spectator survivor continuation, team defeat and automatic wave-one replay over the staged public relay in 30.185 seconds. Migration after a committed personal death preserved the life record and private-token rejoin restored the same seat. This is network/session evidence, separate from the pending WebGPU cooperative browser gameplay check.

With ordered WebSocket impairment configured as 100 ms each way and ±50 ms jitter, the actual networked simulation completed the same full loop plus committed-death migration and recovery in 59.556 seconds. Across 13,184 delayed messages, measured one-way delay was 51.39–258.00 ms, mean 126.93 ms (including host scheduling stalls and ordered queuing). This does not substitute for the browser prediction/interpolation visual check.

The complete WebGPU browser loop passed against the staged relay `https://rmc-colyseus-multiplayer-server-r3o5u3ru2.vercel.app`: solo start, late joining through four seats, fifth-player rejection, hot drop, settings while the host continues, wave clear, three personal deaths, spectating a surviving pilot, shared defeat and automatic wave-one restart. The gameplay portion took 41.932 seconds. Background visibility and lifecycle were emulated; the silent-host handoff took 2.743 seconds. Returning the old host did not reclaim authority, and refresh restored its private identity. Browser input was automated through keyboard events, with no world-state mutation. There were no page errors. This check found and fixed missing room-code retention in the URL after create/join.

The authenticated [Hobby audit](https://github.com/SamuelAsherRivello/rmc-colyseus-multiplayer-server/actions/runs/38084550878) confirmed `plan: hobby` and the existing relay project. No plan change or additional hosting provider was used.

Two WebGPU browser clients also completed the gameplay loop under ordered WebSocket delays configured as 100 ms each way with ±50 ms jitter. The gameplay portion took 41.326 seconds; silent-host handoff took 3.054 seconds. Host movement appeared after 49.6 ms and guest movement after 35.8 ms, without waiting for the relay acknowledgement. Across 7,031 delayed messages on the final page lifetimes, one-way delay ranged from 49.9 to 189.8 ms, including scheduling and ordered queuing. There were no page errors.

Mobile touch emulation at 390×844 passed concurrent direction/fire, releasing direction while fire remained held, pointer cancellation, settings resume and actual movement, with no overflow. A separate private code remained isolated. Under the same delay profile, 122 animation-frame samples of a remote alien had a maximum adjacent horizontal displacement of 1.151 logical pixels; the unmodified-network run had 121 samples and a maximum of 0.339 pixels. Physical touch hardware remains untested.

The extended delayed-browser run also passed spectator hosting: the eliminated pilot took authority in 3.175 seconds, stayed eliminated, and continued simulating for the survivor. The earlier handoff in this run took 3.817 seconds, including configured network impairment. The returning old host stayed a guest. The full loop, both handoffs and replay completed in 50.776 seconds with no page errors.

An intentionally stalled adapter request produced the graphics timeout/retry state after fifteen seconds; retry obtained the real hardware adapter and displayed the game. Desktop 125% zoom was emulated with a 1024×576 CSS viewport and DPR 1.25: the logical world stayed 320×576, the backing surface became 400×720, and the page stayed within its viewport. Settings remained reachable. This is zoom emulation, separate from physical browser UI zoom and physical fractional-DPR hardware.
