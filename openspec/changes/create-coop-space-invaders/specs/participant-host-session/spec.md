# Spec Delta

## Purpose

Define private four-seat relay sessions whose participant host simulates the world and can transfer that authority while preserving the committed run.

## ADDED Requirements

### Requirement: Private rooms and bounded capacity
Participants SHALL be able to create or join a private room using a shareable code/link. A room SHALL admit up to four occupied seats, counting spectators and agreed recovery reservations, and SHALL allow solo play without waiting for another participant.

#### Scenario: A player creates a solo room
- **WHEN** a player creates a private room
- **THEN** they can start a one-player run and receive a shareable room code

#### Scenario: A fifth participant attempts admission
- **WHEN** all four seats are occupied and another participant joins that code
- **THEN** the participant receives a full-room result without changing the current run or creating an overflow room

### Requirement: Hot membership changes preserve the run
Joining or leaving SHALL NOT reset the wave or other players' lives. New players SHALL receive three lives and spawn protection. Returning players SHALL recover their remaining lives or eliminated status through a private room-scoped token, including after intentional leave. Late arrivals SHALL receive committed world state before interacting.

#### Scenario: Eliminated player refreshes
- **WHEN** a player with zero lives returns using their room-scoped token
- **THEN** they remain a spectator until the shared run restarts
- **AND** neither refresh nor intentional leave grants additional lives

#### Scenario: A guest joins during combat
- **WHEN** a guest joins an available seat during wave combat
- **THEN** they receive the current wave, players, aliens, projectiles and life states
- **AND** the other participants retain their progress

#### Scenario: A guest leaves
- **WHEN** a non-host participant leaves
- **THEN** their input is neutralized and remaining participants continue the same run

### Requirement: Only the elected participant simulates outcomes
The elected participant host SHALL compute movement, projectiles, alien behavior, damage, lives, and waves. Guests SHALL submit intent and render accepted outcomes. The relay SHALL handle membership, ordering and authority validation without simulating gameplay.

#### Scenario: A guest submits a false outcome
- **WHEN** a guest attempts to publish world state, damage, life changes, or wave advancement
- **THEN** the relay rejects the publication and the committed world remains unchanged

### Requirement: Ordered bounded participant actions
The relay SHALL attribute actions to their actual sending participant, order accepted actions, and reject malformed, excessive, duplicate or obsolete requests. Host simulation SHALL expire movement/fire intent after 300 milliseconds without a valid refresh.

#### Scenario: Input stops arriving
- **WHEN** a player's last valid movement/fire intent is older than 300 milliseconds
- **THEN** the host uses neutral controls until new valid input arrives

#### Scenario: Invalid or replayed input
- **WHEN** input contains nonfinite coordinates, an invalid sequence, or a superseded run/authority generation
- **THEN** it cannot move a player, fire a shot, or alter current world state

### Requirement: Automatic host migration
Host departure or failed liveness SHALL automatically promote the longest-connected eligible remaining participant. The successor SHALL resume the committed run with its wave, player lives, entities, random state and timers preserved. A connected spectator SHALL remain eligible to host.

#### Scenario: Host leaves with a spectator and survivor connected
- **WHEN** the host leaves and the longest-connected eligible remaining participant is a spectator
- **THEN** that spectator becomes host and continues simulation for the survivor
- **AND** neither the wave nor any life budget is reset

#### Scenario: Host stops responding
- **WHEN** the host fails the configured liveness check under the documented 200 ms RTT and up to 100 ms jitter test profile
- **THEN** the room shows migration and targets resumed authority within five seconds
- **AND** world progression remains frozen until a successor is ready

### Requirement: Stale authority cannot overwrite the successor
Every authority change SHALL identify a new generation. Only its elected host SHALL publish accepted world state, and returning or delayed old-host traffic SHALL NOT roll back the successor's run.

#### Scenario: Old host reconnects after migration
- **WHEN** a previous host returns or a delayed prior-generation snapshot arrives
- **THEN** the previous host participates as a guest and its old publication is rejected

### Requirement: Checkpoint restoration and ordered replay
Migration SHALL restore a complete accepted checkpoint and process its retained unacknowledged actions once. Tentative later frames SHALL NOT be layered onto restored state. Missing checkpoints or exhausted replay bounds SHALL produce a visible recovery state rather than a silent reset or fabricated continuity.

#### Scenario: Death or final-alien hit overlaps migration
- **WHEN** migration occurs while a death or final-alien action is unacknowledged
- **THEN** checkpoint restoration and replay produce at most one life deduction and one wave transition for each accepted event

#### Scenario: Successor cannot restore
- **WHEN** no eligible participant can restore a valid checkpoint
- **THEN** the room reports recovery failure and offers a lobby return without claiming the old run continued

### Requirement: Independent rooms and compatible consumers
Rooms SHALL isolate membership and world traffic from other room codes and game types. Adding this game SHALL preserve existing consumers' supported protocols and admission behavior.

#### Scenario: Two rooms run concurrently
- **WHEN** participants use different private codes or another supported game
- **THEN** host snapshots and actions from one room cannot change the other room
