/**
 * Click targets inside the home illustration.
 *
 * The auto and the person are their own transparent layers, so they are
 * hit-tested by pixel (the auto follows its drive across). The dog is part of
 * the background artwork, so it gets a fixed zone, in fractions of the scene.
 */
const SAMPLE_W = 590; // layers are 2360 x 1640; a quarter size is plenty
const SAMPLE_H = 410;
const ALPHA = 40;
const PAD = 3; // forgiveness in sampled pixels, for thin shapes

const DOG = { u0: 0.772, u1: 0.846, v0: 0.581, v1: 0.66 };

const LAYER = {
  dude: ".home-layer-character",
  auto: ".home-layer-auto",
  house: ".home-layer-house",
};

export function createHotspotDetector(card) {
  const samples = {};

  const load = (name) => {
    const img = card.querySelector(LAYER[name]);
    if (!img || samples[name] || samples[`${name}-pending`]) return;
    samples[`${name}-pending`] = true;
    const copy = new Image();
    copy.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SAMPLE_W;
      canvas.height = SAMPLE_H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(copy, 0, 0, SAMPLE_W, SAMPLE_H);
      samples[name] = ctx.getImageData(0, 0, SAMPLE_W, SAMPLE_H).data;
    };
    copy.src = img.currentSrc || img.src;
  };

  // Is there ink on this layer under the pointer? (pad = also check nearby)
  const inkAt = (name, x, y, pad = 0) => {
    const data = samples[name];
    const img = card.querySelector(LAYER[name]);
    if (!data || !img) return false;
    const r = img.getBoundingClientRect(); // includes the auto's drive transform
    const u = (x - r.left) / r.width;
    const v = (y - r.top) / r.height;
    if (u < 0 || u > 1 || v < 0 || v > 1) return false;
    const cx = Math.floor(u * (SAMPLE_W - 1));
    const cy = Math.floor(v * (SAMPLE_H - 1));
    for (let dy = -pad; dy <= pad; dy++) {
      for (let dx = -pad; dx <= pad; dx++) {
        const px = cx + dx;
        const py = cy + dy;
        if (px < 0 || py < 0 || px >= SAMPLE_W || py >= SAMPLE_H) continue;
        if (data[(py * SAMPLE_W + px) * 4 + 3] > ALPHA) return true;
      }
    }
    return false;
  };

  return {
    /** Start reading the layers (cheap; call on first hover). */
    warm() {
      Object.keys(LAYER).forEach(load);
    },
    /** "dude", "auto", "dog" or null for a point on the page. */
    detect(x, y) {
      if (inkAt("dude", x, y, PAD)) return "dude";
      // The house is drawn over the auto, so a point on the house isn't the auto.
      if (!inkAt("house", x, y) && inkAt("auto", x, y, PAD)) return "auto";
      const stage = card.querySelector(".home-hero-stage");
      if (stage) {
        const r = stage.getBoundingClientRect();
        const u = (x - r.left) / r.width;
        const v = (y - r.top) / r.height;
        if (u >= DOG.u0 && u <= DOG.u1 && v >= DOG.v0 && v <= DOG.v1) return "dog";
      }
      return null;
    },
  };
}
