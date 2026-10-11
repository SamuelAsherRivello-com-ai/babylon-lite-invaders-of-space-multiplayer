# invasion-gameplay Specification

## Purpose

Define the shared cooperative alien-wave loop, personal life budgets, spectating, and team replay without inheriting superseded asteroid or dungeon mechanics.

## Requirements

### Requirement: Cooperative descending alien combat
The game SHALL support one through four human players on the same team, moving horizontally and firing upward at descending aliens. Friendly shots SHALL NOT damage teammates.

#### Scenario: Players cooperate on one screen
- **WHEN** one, two, three, or four players participate in a run
- **THEN** they share the same alien population and world outcomes
- **AND** a friendly shot crossing a teammate does not consume that teammate's life

### Requirement: Numbered wave advancement
The run SHALL begin with three rows of six one-hit aliens in wave one and SHALL advance exactly once after all aliens are eliminated. Later waves SHALL introduce bounded armor, faster movement and varied firing patterns without splitting. Life budgets SHALL persist across waves.

#### Scenario: Final alien is defeated
- **WHEN** multiple shots strike the last alien during the same simulation step
- **THEN** the alien is removed once and the wave advances once
- **AND** every player's remaining lives are retained

#### Scenario: An alien remains alive
- **WHEN** any alien remains in the current wave
- **THEN** the game does not advance to the next wave

### Requirement: Three personal lives across the run
Each participating player SHALL begin the run with three lives. A confirmed death SHALL consume exactly one personal life; the first two deaths SHALL allow respawn and the third SHALL eliminate that player for the run. Wave changes SHALL NOT restore lives.

#### Scenario: Deaths span different waves
- **WHEN** a player dies once in each of three different waves
- **THEN** they have two lives after the first death, one after the second, and zero after the third
- **AND** they are eliminated after the third death

#### Scenario: Duplicate damage notifications
- **WHEN** a confirmed death is received more than once or occurs during authority transfer
- **THEN** that death consumes one life rather than multiple lives

### Requirement: Eliminated players spectate
An eliminated player SHALL remain able to view the current shared arena and teammate status, but SHALL NOT move, fire, respawn, or reset another player's ongoing run.

#### Scenario: A teammate survives longer
- **WHEN** one player has zero lives and another remains alive
- **THEN** the living player's run continues and the eliminated player sees a spectator state
- **AND** spectator fire or restart input does not alter combat or reset the run

### Requirement: Shared defeat and replay
The game SHALL enter team defeat when all participating connected players are eliminated or an alien reaches the invasion line. After five seconds of shared results it SHALL begin a fresh run at wave one with three lives for every participating player and cleared combat state.

#### Scenario: Invasion breach with lives remaining
- **WHEN** an alien reaches the invasion line while players have remaining lives
- **THEN** the entire team enters defeat and restarts together after the results countdown

#### Scenario: Last surviving player is eliminated
- **WHEN** the final participating connected player loses their third life
- **THEN** every connected participant sees the same team-defeat result

#### Scenario: The team restarts
- **WHEN** the agreed shared restart transition occurs after defeat
- **THEN** all participating players return at wave one with three lives
- **AND** prior shots, eliminations, pending respawns and wave-clear events cannot affect the new run
