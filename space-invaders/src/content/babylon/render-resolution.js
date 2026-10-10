// Babylon Lite's pinned SpriteRenderer derives its projection size from surface.canvas,
// even when setSpriteRendererTarget redirects its output to a texture. Give the scene
// renderer a surface view with target dimensions while sharing the engine's render
// context registry, device, encoder, and swapchain view. The presenter remains attached
// to the real engine surface and therefore uses the native canvas dimensions.
export function createRenderTargetSurfaceView(engine, width, height) {
  const surface = Object.create(engine);
  Object.defineProperty(surface, "canvas", {
    value: { width, height },
    enumerable: true,
  });
  return surface;
}
