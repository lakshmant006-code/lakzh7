// Assets live inside web/ (img, sprites, levels, sfx folders)
export const ASSET_BASE = new URL('../', import.meta.url).href;

export function assetPath(relativePath) {
  const clean = relativePath.replace(/^\.\//, '');
  return new URL(clean, ASSET_BASE).href;
}
export const WINDOW_W = 640;
export const WINDOW_H = 480;
export const TILE = 32;

export class Vec2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

export class GameRect {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get left() { return this.x; }
  set left(v) { this.x = v; }
  get right() { return this.x + this.width; }
  set right(v) { this.x = v - this.width; }
  get top() { return this.y; }
  set top(v) { this.y = v; }
  get bottom() { return this.y + this.height; }
  set bottom(v) { this.y = v - this.height; }
  get bottomleft() { return [this.left, this.bottom]; }
  get bottomright() { return [this.right, this.bottom]; }
  get midbottom() { return [this.x + this.width / 2, this.bottom]; }
  get midleft() { return [this.left, this.y + this.height / 2]; }
  get midright() { return [this.right, this.y + this.height / 2]; }

  colliderect(other) {
    return (
      this.left < other.right &&
      this.right > other.left &&
      this.top < other.bottom &&
      this.bottom > other.top
    );
  }

  collidepoint(x, y) {
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  }
}

export function resolveAssetPath(path) {
  if (path.startsWith('./') || path.startsWith('../')) {
    return assetPath(path);
  }
  return path;
}

export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export async function fetchJson(url) {
  const resolved = url.startsWith('http') ? url : assetPath(url);
  const res = await fetch(resolved);
  if (!res.ok) throw new Error(`Failed to fetch ${resolved}`);
  return res.json();
}

export function cloneCanvas(source) {
  const c = document.createElement('canvas');
  c.width = source.width;
  c.height = source.height;
  c.getContext('2d').drawImage(source, 0, 0);
  return c;
}

export function deepCloneAnimation(anim) {
  if (!anim) return null;
  return {
    images: anim.images.slice(),
    timer: 0,
    index: 0,
    image: anim.images[0],
    idleSprite: anim.idleSprite,
    airSprite: anim.airSprite,
    deltaTime: anim.deltaTime,
    update() {
      this.timer += 1;
      if (this.timer % this.deltaTime === 0) {
        this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
      }
      this.image = this.images[this.index];
    },
    idle() { this.image = this.idleSprite; },
    inAir() { this.image = this.airSprite; },
  };
}
