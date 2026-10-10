# Template delivery audit

This records outcomes for `AGENTS_TEMPLATE_USAGE_CHECKLIST.md`; inherited instructions remain reusable. “Verified” means evidence exists in this checkout or the linked delivery evidence, rather than a checked box alone.

| Checklist group and item | Outcome and evidence |
| --- | --- |
| 1: Select GitHub template generation or local copy | Verified: GitHub template generation, recorded in `skills-import.md`. |
| Purpose, platforms, stack, deployment and dependencies | Verified: browser game, Babylon Lite/WebGPU, React, GitHub Pages, Vercel Hobby relay; README and design. |
| Game versus app | Verified: actual game replaces the showcase; Babylon Lite retained. |
| One orientation | Verified: fixed 320×576 portrait; no orientation toggle. |
| Pixel Perfect entry and original gameplay | Verified: rendering-policy tests, browser gameplay and original atlas. |
| Viewport, gutters and fullscreen | Verified: fixed world, original gutters, responsive fit and fullscreen checks. |
| Optional audio | Not applicable: silent game; `?mute=true` documented. |
| Authorized repository creation and correct destination | Verified: requested destination generated from required template. |
| Repository access limitations | Not applicable: creation and metadata access succeeded. |
| Optional skill selection and setup | Verified: invoked create-game workflow explicitly requires the full shared skill import; provenance and version reconciliation recorded. |
| Possible skill sources | Verified: required AI Skills Library used; Tiled and Blender packages not needed. |
| Human skill installation, licensing and minimal import | Verified with explicit override: user invoked installed skills; full import required by create-game, terms retained; no global skill edits. |
| 2: Bootstrap commit | Unverified exact capitalization: GitHub generated `Initial commit`, rather than `Initial Commit`. Single-commit bootstrap was verified before project work; history was preserved. |
| Correct origin | Verified: game remote on `main`; no feature branch or worktree. |
| Renamed application folder and metadata | Verified: `space-invaders/`, real Vite root/base and project metadata. |
| README title and project content | Verified: actual game, controls, rules, setup and limits. |
| Original AI Prompt disclosure | Verified: original request and follow-ups retained separately from interpretations. Source conversation URL unavailable and explicitly unverified. |
| About description and topics | Verified: actual game description and game/multiplayer/cooperative/pixel-art/webgpu/babylonjs topics. |
| About website | Verified: `https://www.samuelasherrivello.com/`. |
| Replace irrelevant template artifacts | Verified: inactive showcase components, preferences, art and obsolete documentation removed or adapted. |
| CI, deployment and version policy | Verified locally: inspected workflows build/test before release; root `version.txt`. Public delivery evidence is recorded separately in `verification.md`. |
| Root package and app source layout | Verified: root manifests/configuration; app source/assets/tests beneath `space-invaders/`. |
| Four corner roles | Verified: title, repository, settings and version retained. |
| 3: Required tools and dependencies only | Verified: existing Vite/React/Babylon Lite tooling; shared client for requested multiplayer. |
| Real setup/run/test/build commands | Verified: root scripts used; no nonexistent formatter advertised. |
| Ignore generated files and secrets | Verified: app build, Node modules, local environment, implementation work and browser artifacts ignored. |
| Safe environment example | Not applicable: no configuration required; production relay origin is explicit, optional override validates origin and HTTPS. |
| Focused automated checks | Verified: rules, migration, local prediction, controls, shell and render policy. |
| Real runtime and representative screenshots | Verified: hardware Edge WebGPU, complete cooperative loop, mobile emulation and actual game screenshots. |
| Manual or unavailable checks | Verified disclosure: physical touch hardware, physical fractional-DPR displays and native browser UI zoom are unverified; emulation is identified. |
| 4: Generated OpenSpec skills | Verified: isolated 1.13.1 generated actual local skills, target marker and generated metadata. |
| OpenSpec tooling version | Verified with documented reconciliation: isolated 1.13.1 for template generation; existing global 1.14.0 for compatible planning; no global downgrade. |
| OpenSpec doctor and generated metadata | Verified in `skills-import.md`. |
| Reopen Codex and inspect skill autocomplete | Unverified: desktop autocomplete was not inspected; the skills were available and read directly. |
| Project-specific context | Verified: config describes actual game, host relay and mandatory free Hobby plan. |
| Active versus accepted specifications | Verified during implementation: active game change, synchronized applicable template deltas; final game sync/archive tracked separately. |
| 5: Search stale names and placeholders | Verified: active paths renamed; historical examples, imported skills and reusable checklist strings deliberately retained and explained. |
| Run documented local and authorized delivery checks | Local checks verified; public release evidence tracked in `verification.md`. |
| Verify README links, commands, imagery and packages | Reviewed against actual project; final release package and public demo remain delivery gates until verified. |
| Original prompt URL | Unverified: no source URL supplied; no invented link. |
| About metadata | Verified through GitHub API after update. |
| Report checklist outcomes | Verified: this table identifies verified, conditional and unverified items. |
| Ready status | Local gameplay verified; final ready status depends on public release and delivery gates. |

The twelve scorecard questions are satisfied by the renamed app, correct Vite configuration, resolved active placeholders, actual README, real commands, adapted template artifacts, four corners, one orientation, silent audio policy, nonconflicting shell shortcuts, correct ignores and disclosed verification limits. Conditional audio support is satisfied by deliberately omitting sound. Final delivery status is recorded separately rather than inferred from this scorecard.
