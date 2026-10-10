# Verification evidence

## Automated game checks

`npm test` passes 27 tests covering deterministic rules, personal lives, wave transitions, checkpoint replay, input neutralization, guest prediction, bounded action retention, pixel-grid policy, WebGPU errors, and shell layout. `npm run build` produces the GitHub Pages subpath build. Counts are recorded during implementation and must be refreshed at delivery.

## Shared relay

- Node 24.21.0 targeted real-Colyseus test passed for capacity, private-code isolation, stable identity recovery, ordered inputs, host-only checkpoints, explicit/silent host migration, stale-host fencing, malformed traffic, rate limits and journal exhaustion.
- The staged deployment `https://rmc-colyseus-multiplayer-server-guf62h2x1.vercel.app` completed the 240-second Space Invaders probe with checkpoint tick 238 and successful host migration on 2026-10-10 UTC.
- Four simultaneous private Space Invaders admissions passed against that deployment using the corrected shared client.
- The shared Combat regression revealed Vercel cold-instance admission and upgrade routing. Bounded same-invitation HTTP retries and issued-reservation socket retries passed its complete public integration test. No compatibility assertion was removed.
- These staged checks do not establish the final stable endpoint or published client release. Those remain release acceptance gates.

## Browser checks completed so far

Microsoft Edge uses hardware WebGPU on Intel Gen-12LP; `isFallbackAdapter` is false. The actual renderer and lobby were inspected at 1280×720. A separate mobile-emulated context at 390×844 and DPR 2 displayed the complete portrait lobby without scrolling and opened/closed settings. A separate context with WebGPU disabled showed the graphics guidance and retry control, with settings still usable.

Physical touch devices have not been tested. Touch emulation and independent-pointer unit tests do not prove physical-device compatibility. Full cooperative browser gameplay, latency measurements, fullscreen/DPR changes and public release verification are pending and must not be inferred from the lobby screenshots.

Resize verification in Edge confirmed 640×1152 at integer 2× for a 1920×1200 window; proportional 266.66×480 CSS fit for 320×480; and 320×576 at 1× for 1280×720. A simulated DPR change from 1 to 1.5 changed backing width from 320 to 480 once. Fullscreen entry/exit through settings succeeded. These checks preserve fixed world framing; physical fractional-DPR displays and physical touch hardware remain untested.

The complete shared-server suite passed all 134 tests under Node 24.21.0 after the admission fix. Client packaging, documentation validation and TypeScript checks also passed.

The actual game simulation also completed wave clear, personal three-life elimination, spectator survivor continuation, team defeat and automatic wave-one replay over the staged public relay in 30.185 seconds. Migration after a committed personal death preserved the life record and private-token rejoin restored the same seat. This is network/session evidence, separate from the pending WebGPU cooperative browser gameplay check.

With ordered WebSocket impairment configured as 100 ms each way and ±50 ms jitter, the actual networked simulation completed the same full loop plus committed-death migration and recovery in 59.556 seconds. Across 13,184 delayed messages, measured one-way delay was 51.39–258.00 ms, mean 126.93 ms (including host scheduling stalls and ordered queuing). This does not substitute for the browser prediction/interpolation visual check.
