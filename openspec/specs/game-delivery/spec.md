# game-delivery Specification

## Purpose

Ensure the template-based game and compatible relay backend are reproducible, independently verified, and honestly delivered through their actual release workflows.

## Requirements

### Requirement: Reproducible project provenance
The resulting project SHALL record template and shared-skill source revisions, preserve planning artifacts and unrelated work, and document actual setup commands, dependency versions and provenance. Existing remote repositories SHALL NOT be replaced on a name collision.

#### Scenario: Generated checkout is established
- **WHEN** the template-generated game checkout is brought into the planning directory
- **THEN** this change's artifacts survive and the origin identifies the destination game repository
- **AND** recorded commands match that checkout's actual configuration

### Requirement: Compatible backend precedes game integration
The game SHALL integrate against an exact released shared-client asset only after its matching backend supports and publicly verifies the new relay protocol. Source version numbers or health responses alone SHALL NOT establish compatibility.

#### Scenario: Backend release exists but game relay is unverified
- **WHEN** a release or health endpoint succeeds without a public two-client game-specific relay probe
- **THEN** client integration and playable delivery remain gated

### Requirement: Meaningful multiplayer verification
Verification SHALL exercise one through four players, two independent browser clients, hot join/drop, full capacity, spectating, restart, host migration, room isolation and latency/jitter. Reports SHALL distinguish automated rules, browser gameplay, emulated touch and physical-device testing.

#### Scenario: Latency and jitter are introduced
- **WHEN** two clients play under the documented measured network profile
- **THEN** local input remains responsive and shared damage, lives and wave results agree
- **AND** evidence records effective delay, motion quality and migration results

### Requirement: Production continuity is verified against its declared contract
Public delivery SHALL test a 240-second two-client game-specific session on the existing backend route and document its process-local and connection-duration limits. Participant-host migration SHALL NOT be presented as protection from relay-process loss or as proof of cross-instance continuity.

#### Scenario: Only a four-minute relay was checked
- **WHEN** a four-minute relay probe succeeds
- **THEN** the report does not claim ten-minute, cross-instance or process-loss continuity

### Requirement: Published build and version agree
Delivery SHALL verify the actual public game starts, loads assets beneath its repository subpath, uses the verified relay release and displays the released game version. Both local checkouts SHALL be synchronized with release-generated commits without discarding unrelated work.

#### Scenario: Release commit does not trigger Pages
- **WHEN** a game release succeeds but Pages still serves an older revision
- **THEN** delivery remains incomplete until the intended revision is deployed and publicly checked

### Requirement: Original request remains distinguishable from interpretation
Documentation SHALL preserve the actual initiating request and consequential follow-ups in a collapsible original-prompt block, with assumptions separate. Unavailable prompt URLs and unverified demos SHALL be disclosed rather than invented.

#### Scenario: Initiating prompt has no recoverable URL
- **WHEN** documentation can preserve the supplied prompt text but cannot recover its source URL
- **THEN** it includes the real text and reports the source-link checklist item as unverified

### Requirement: Deferred decisions gate dependent implementation
Future unresolved concept or hosting changes SHALL remain explicit and block their dependent tasks. Artifact presence or validation SHALL NOT prove implementation. The resolved D1-D3 choices and existing backend contract SHALL be reflected consistently across planning and verification.

#### Scenario: Planning artifacts validate with open decisions
- **WHEN** planning validation succeeds but gameplay or public probes have not run
- **THEN** implementation and delivery remain unverified
