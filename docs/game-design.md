# Space Invaders — Cooperative Defense

One to four pilots defend a fixed portrait arena. A/D or arrows move horizontally,
Space fires upward. Touch controls support independent direction and fire
pointers. There is no friendly fire, splitting, asteroid physics, revive, loot,
dodge, scrolling camera or boss inherited from the example prompt.

Wave one has eighteen one-hit aliens, three rows of six. Later waves add rows,
columns, armor, speed, aimed shots and occasional paired shots. Alien rows descend
at screen edges. The last alien starts a 2.5-second wave break. Wave difficulty
also accounts for connected living players; world bounds remain identical.

Each pilot has three personal lives across the entire run. A hit consumes one;
survivors respawn after one second with protection. The third death makes that
pilot a spectator. A protected spawn prevents immediate repeated hits. Connected
spectators are eligible hosts. The run continues while a connected pilot lives.
All connected pilots eliminated, or any alien reaching the invasion line, ends
the team run. Five shared results seconds precede wave one with all pilots at
three lives. A newcomer cannot reset the current wave or teammates' lives.

Private four-character rooms can start solo. Invite links contain the public
code only. Private room-scoped recovery tokens restore the same identity and
life record after refresh or intentional leave. Intentional leave frees
occupancy; a dropped socket reserves occupancy for fifteen seconds. Spectators
occupy a seat. Losing browser storage loses anonymous identity proof. Rooms
dispose fifteen seconds after the last connection leaves.

The host browser simulates at 60 Hz, bounded to four catch-up steps. The relay
only handles admission, ordered input/membership, host election and opaque state.
Inputs refresh at 20 Hz and expire after 300 ms. Checkpoints publish at 20 Hz.
The next active participant restores the committed checkpoint and its pending
actions, then acknowledges its authority epoch before progression resumes.
Late/stale hosts cannot overwrite it. A missing checkpoint gives a recovery
error. A hidden browser withholds heartbeats to yield to a visible participant.
Settings release local controls while shared simulation continues.

Every pilot predicts their horizontal ship immediately, reconciles against acknowledged
input, and interpolate remote state. Cosmetic muzzle feedback is local; all
damage and wave outcomes come from the elected host. Simulation coordinates
remain fractional; displayed anchors snap through the pixel-grid helper.

The original 256×32 atlas is generated from authored pixel shapes by
`scripts/generate-art.mjs`. It includes four ships, three alien types, animation
frames, armor, projectiles, stars and burst effects. No copyrighted reference art
is imported. This game is intentionally silent; `?mute=true` is accepted as a
silent verification URL and there are no audio sources or music to mute.

The logical view is 320×576 (portrait 5:9). This resolves the proposed 320×576
logical arena to matching CSS framing, rather than stretching it to the skill's
default 9:16. Centered integer CSS scaling is used whenever possible. A smaller
viewport uses proportional fractional fit, which suspends strict pixel-grid
display guarantees. Fractional DPR may map CSS pixels unevenly to physical
pixels; no universal physical-pixel promise is made. The WebGPU presentation
surface applies DPR once; the game renders to a nearest-sampled logical target.

Deployment uses the existing **free Vercel Hobby plan only**. Its process-local
Colyseus rooms and 300-second function limit do not provide persistent rooms.
The release gate verifies a four-minute game session and migration. Backend
process loss is reported as expired/unavailable; it is separate from participant
host migration. No paid feature, external host or automatic overage is enabled.
