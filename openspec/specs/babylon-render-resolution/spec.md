# babylon-render-resolution Specification

## Purpose

Defines a fixed logical target and nearest-sampled responsive WebGPU presentation independent of game coordinates.

## Requirements

### Requirement: Logical resolution independent of render resolution
The game SHALL use a fixed 320×576 logical arena and internal render target. CSS resize, fullscreen, browser zoom and DPR changes SHALL update presentation without changing simulation coordinates or camera framing.

#### Scenario: Render target changes while playing
- **WHEN** the browser viewport, fullscreen state or DPR changes
- **THEN** the logical target remains 320×576 and the native backing dimensions follow CSS size and DPR exactly once

### Requirement: Nearest-neighbor presentation
The logical game target SHALL use nearest-neighbor sampling when presented into the native backing buffer, without mipmaps or blended pixel-art edges. Integer CSS scaling SHALL be used where it fits; proportional fractional fit SHALL be documented for smaller windows.

#### Scenario: Smaller render target is enlarged
- **WHEN** the native presentation is larger than the fixed logical target
- **THEN** nearest sampling enlarges the logical output without changing world framing

#### Scenario: Larger render target is reduced
- **WHEN** a small window requires reducing the logical output
- **THEN** nearest sampling uses proportional fractional fit with its documented limitations

