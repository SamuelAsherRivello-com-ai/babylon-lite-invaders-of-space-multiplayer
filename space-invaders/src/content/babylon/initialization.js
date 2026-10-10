export function getInitializationMessage(webGpuAvailable, error) {
  const reason = String(error?.message ?? error ?? "");
  if(/WebGPU initialization timed out/i.test(reason))return "WebGPU initialization timed out. Close other graphics-intensive tabs, then retry graphics.";
  if (!webGpuAvailable || /webgpu.*(?:not available|unsupported)|adapter.*(?:not available|unsupported|not found)/i.test(reason)) {
    return "Babylon Lite requires WebGPU. Enable WebGPU or use a compatible browser and device.";
  }
  if (/render.?target|allocat(?:e|ion)|out of memory|device lost|texture.*(?:limit|dimension|memory)/i.test(reason)) {
    return "Babylon Lite could not allocate graphics resources. Close other graphics-intensive tabs or reduce the browser window size, then retry.";
  }
  return "Babylon Lite could not initialize this content. Check the browser console for details.";
}
