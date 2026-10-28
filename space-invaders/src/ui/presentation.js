const MIN_ASPECT = 16 / 10;
const MAX_ASPECT = 16 / 9;

export function fitPresentationFrame(width, height) {
  if (!(Number.isFinite(width) && Number.isFinite(height)) || width <= 0 || height <= 0) {
    return { width: 0, height: 0, aspect: MAX_ASPECT };
  }
  const aspect = Math.max(MIN_ASPECT, Math.min(MAX_ASPECT, width / height));
  const frameWidth = Math.min(width, height * aspect);
  return { width: frameWidth, height: frameWidth / aspect, aspect };
}
