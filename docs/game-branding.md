# Invaders of Space branding

![Invaders of Space logo above four colorful fighters and descending pixel aliens](images/game-logo.png)

Official name: **Invaders of Space**.

## Art direction

Crisp pixel arcade lettering over a midnight starfield, with mint, amber, lavender and blue fighters beneath descending coral, lavender and cyan aliens.

The existing docs/screenshot01.png gameplay capture and space-invaders/src/content/game/renderer.js establish the sparse dark arena, four ship colors and descending alien rows. The screenshot was viewed for visual context only. The final image was generated from a text prompt without supplying, cropping, tracing or compositing a screenshot.

## Asset and usage

- File: `docs/images/game-logo.png`.
- Purpose: README splash illustration and game-directory thumbnail.
- Generation: built-in OpenAI image generation through the existing Codex session. No API key, separately billed API or external image service was used.
- Format: opaque PNG, 1536 by 1024 pixels.
- Keep the complete title visible when displaying or resizing the image. The official name excludes "Multiplayer"; multiplayer capability remains documented separately in the README.

## Final generation prompt

```text
Use case: logo-brand.
Create a completely original finished landscape 3:2 arcade game splash illustration from scratch for "Invaders of Space". Exact title text, case preserved: "Invaders of Space". Make that title huge, beautifully readable at 240px thumbnail width, chunky pixel-inspired ivory lettering with cyan edges, across the upper half. Dark midnight navy and blue-black starfield, mint, amber, lavender and icy blue accents. Beneath the lettering, four small angular original space fighters in those four accent colors defend against descending rows of tiny original coral, lavender and cyan geometric aliens, with a few luminous projectile trails. Crisp deliberately pixelated arcade illustration, confident simple silhouettes and restrained glow, generous contrast, strong cohesive graphic design, limited colors. The game's actual appearance is a sparse portrait pixel invasion arena with four fighters and colored alien rows. This artwork must be an original promotional composition, not a gameplay screen. No HUD, no screenshot, no game UI, no borrowed franchise designs, no other text, no watermark. Never include the word Multiplayer. Opaque background.
```
