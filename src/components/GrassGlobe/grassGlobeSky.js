import * as THREE from "three";

/** Mask fade / site edge tone; sync with PlantYourFlower.css --site-bg. */
export const GLOBE_SKY_FILL = "#fafafa";

const SKY_CENTER = [0.7, 0.82, 0.97];
const SKY_MID = [0.82, 0.9, 0.99];
const SKY_HALO = [0.88, 0.93, 0.99];
const SKY_EDGE = [0.98, 0.98, 0.98];

function mixVec3(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function skyColorAtRadius(r) {
  const t = smoothstep(0.03, 1, r);
  const core = mixVec3(SKY_CENTER, SKY_MID, smoothstep(0, 0.55, t));
  const halo = mixVec3(core, SKY_HALO, smoothstep(0.42, 0.86, t));
  return mixVec3(halo, SKY_EDGE, smoothstep(0.76, 0.98, t));
}

/**
 * View-fixed radial sky (stable while orbiting). Bluest at center, #fafafa at edges.
 * 16:9 canvas matches typical globe viewport so the falloff stays circular on screen.
 */
export function createGlobeSkyBackground() {
  const width = 512;
  const height = 288;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  const imageData = ctx.createImageData(width, height);
  const { data } = imageData;

  const cx = 0.5;
  const cy = 0.5;
  const maxDist = Math.sqrt(cx * cx + cy * cy);

  for (let y = 0; y < height; y += 1) {
    const ny = y / height - cy;
    for (let x = 0; x < width; x += 1) {
      const nx = x / width - cx;
      const r = Math.sqrt(nx * nx + ny * ny) / maxDist;
      const [red, green, blue] = skyColorAtRadius(r);
      const i = (y * width + x) * 4;
      data[i] = Math.round(red * 255);
      data[i + 1] = Math.round(green * 255);
      data[i + 2] = Math.round(blue * 255);
      data[i + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}
