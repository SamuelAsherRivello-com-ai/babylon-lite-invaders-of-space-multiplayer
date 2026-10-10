# source-organization-standards Specification

## Purpose

Provide a small, discoverable source organization that separates reusable React UI from project content and gives template users clear conventions without imposing a framework or renderer.

## Requirements

### Requirement: Separate UI and content responsibilities
The game SHALL place reusable React components, layout logic, styles and UI-only helpers under `space-invaders/src/ui/`. Game content, session coordination and renderer integration SHALL live under `space-invaders/src/content/`.

#### Scenario: Consumer adds canvas content
- **WHEN** a developer inspects the source tree
- **THEN** game-specific behavior has an obvious location under `src/content/` while reusable shell UI remains under `src/ui/`

### Requirement: Provide a starter UI template component
The adapted game SHALL provide discoverable reusable UI composition through its active `App`, `BrowserSurface` and `Dialog` components, without retaining an unused starter component.

#### Scenario: Consumer starts a new UI component
- **WHEN** a developer inspects the UI source directory and coding guidance
- **THEN** active components demonstrate naming and responsibility boundaries without embedding renderer behavior

### Requirement: Keep standards lightweight
The project SHALL document only practical naming, placement, import, and responsibility conventions needed to maintain the UI/content boundary, and SHALL avoid prescribing additional libraries or an elaborate architecture.

#### Scenario: Consumer reads project guidance
- **WHEN** a consumer reads the project standards
- **THEN** they can decide where a new file belongs and how it should depend on the other layer without learning a new framework
