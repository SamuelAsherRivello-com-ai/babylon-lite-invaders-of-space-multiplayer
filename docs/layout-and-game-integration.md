# Layout and game integration

The app uses one fixed portrait 320×576 arena (5:9). `space-invaders/src/ui/layout.js` computes centered integer CSS scaling where possible, with a proportional fractional fallback on small windows. Gutters fill only the unused space. The world never changes its framing to accommodate browser zoom or fullscreen.

`App` and `BrowserSurface` compose independent content and UI layers. Primary controls, HUD, settings and recovery messages remain within the viewport. Four corners retain title, source link, settings and version roles. The main composition supplies `Content`, which owns its session lifecycle and renders through `GameCanvas`.

## Resolution contracts

- **Logical resolution:** 320×576 game pixels, fixed world bounds and camera.
- **Internal render resolution:** a 320×576 WebGPU texture with nearest sampling.
- **Canvas backing resolution:** the CSS dimensions multiplied by device pixel ratio exactly once by the engine.
- **Display size / CSS size:** centered integer multiples of logical pixels where they fit; smaller windows use proportional fractional scaling.

Fractional DPR does not promise universal physical-pixel alignment. Browser zoom changes CSS viewport size and DPR, while simulation coordinates and camera framing remain fixed.

## Rendering

`BabylonLiteAIEntry` is explicitly configured with `BabylonLiteMode.PixelPerfect2D`. Game sprites and view updates use the approved pixel-grid entry point. Simulation retains fractional coordinates; projected anchors snap to logical screen pixels. Renderer infrastructure owns the offscreen presentation helpers. There is no WebGL or canvas-2D fallback.

The original sprite atlas loads without mipmaps and uses nearest sampling. `GameCanvas` mounts and disposes its renderer safely under React StrictMode. It releases stale animations, observers, renderers and textures on cleanup. Resize and DPR changes update presentation dimensions without changing world bounds.

The graphics error UI leaves surrounding settings available and offers a retry. Settings neutralize local input while the shared simulation keeps running. `GameSession` owns its timer independently of the graphics lifecycle.
