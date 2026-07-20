// Loads a File into an <img>, and downsizes it to a JPEG data URI small
// enough to comfortably clear the server's 6MB payload limit
// (server/upload-store.js) before it's ever sent over the wire.
const MAX_DIMENSION = 1280;
const JPEG_QUALITY = 0.85;

export function loadImageFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image file"));
    };
    img.src = url;
  });
}

export function resizeToDataUri(img) {
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}
