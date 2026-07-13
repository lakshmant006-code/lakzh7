function isNearWhite(r, g, b, threshold) {
  return r >= threshold && g >= threshold && b >= threshold;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function isLightColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.299 * r + 0.587 * g + 0.114 * b > 230;
}

/** Remove near-white background connected to the image border. */
function removeBorderBackground(imageData, width, height, threshold) {
  const d = imageData.data;
  const total = width * height;
  const visited = new Uint8Array(total);
  const queue = new Int32Array(total);
  let head = 0;
  let tail = 0;

  const isCandidate = (index) => {
    const offset = index * 4;
    return isNearWhite(d[offset], d[offset + 1], d[offset + 2], threshold);
  };

  const enqueue = (index) => {
    if (visited[index] || !isCandidate(index)) return;
    visited[index] = 1;
    queue[tail++] = index;
  };

  for (let x = 0; x < width; x++) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  while (head < tail) {
    const index = queue[head++];
    const x = index % width;
    const y = (index / width) | 0;

    if (x > 0) enqueue(index - 1);
    if (x < width - 1) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y < height - 1) enqueue(index + width);
  }

  for (let index = 0; index < total; index++) {
    if (visited[index]) {
      d[index * 4 + 3] = 0;
    }
  }
}

/** Remove near-white background for compositing on the grass globe. */
export function applyTransparency(src, threshold = 248) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      removeBorderBackground(
        imageData,
        canvas.width,
        canvas.height,
        threshold,
      );
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = src;
  });
}

export async function generateFlowerImage({ name, color, message }) {
  const res = await fetch("/api/generate-flower", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color, message }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || res.statusText);
  }

  const rawSrc = `data:${data.mimeType};base64,${data.image}`;
  const threshold = isLightColor(color) ? 252 : 248;
  const transparentSrc = await applyTransparency(rawSrc, threshold);

  return {
    image: transparentSrc,
    name,
    message,
    color,
    model: data.model,
    createdAt: Date.now(),
  };
}
