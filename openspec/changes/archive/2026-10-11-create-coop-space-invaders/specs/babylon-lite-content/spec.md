## REMOVED Requirements

### Requirement: Developer-selectable content mode
**Reason**: This repository ships one fixed 2D game rather than a selectable template demonstration.
**Migration**: The new pixel-perfect-game-presentation capability defines the game's mandatory WebGPU renderer and fixed framing.

### Requirement: Pixel-art showcase scene
**Reason**: The requested game replaces the source template's demonstration scene.
**Migration**: Original ship and alien sprites use the same approved pixel-grid entry point.

### Requirement: Native-size showcase sprite
**Reason**: The game has its own authored 16-pixel sprite atlas and logical arena.
**Migration**: Fixed logical resolution and integer CSS scaling preserve authored pixels.

### Requirement: Viewport settings label and modal-controlled world-edge outline
**Reason**: Engine demonstration controls crowd the game HUD and pausing the shared world conflicts with host simulation.
**Migration**: Preserve four React corner roles; settings neutralize local input while the host continues simulation. Engine diagnostics belong in verification evidence.
