import { loadImage } from './utils.js';

export class Spritesheet {
  constructor(sheet) {
    this.sheet = sheet;
  }

  static async fromUrl(filename) {
    const img = await loadImage(filename);
    return new Spritesheet(img);
  }

  imageAt(x, y, scalingFactor, colorKey = null, ignoreTileSize = false, xTileSize = 16, yTileSize = 16) {
    const sx = ignoreTileSize ? x : x * xTileSize;
    const sy = ignoreTileSize ? y : y * yTileSize;
    const sw = xTileSize;
    const sh = yTileSize;
    const dw = xTileSize * scalingFactor;
    const dh = yTileSize * scalingFactor;

    const canvas = document.createElement('canvas');
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(this.sheet, sx, sy, sw, sh, 0, 0, dw, dh);

    if (colorKey !== null) {
      this.applyColorKey(canvas, colorKey);
    }

    return canvas;
  }

  applyColorKey(canvas, colorKey) {
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let keyR;
    let keyG;
    let keyB;
    if (colorKey === -1) {
      keyR = data[0];
      keyG = data[1];
      keyB = data[2];
    } else if (Array.isArray(colorKey)) {
      [keyR, keyG, keyB] = colorKey;
    } else {
      keyR = colorKey.r ?? 0;
      keyG = colorKey.g ?? 0;
      keyB = colorKey.b ?? 0;
    }

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === keyR && data[i + 1] === keyG && data[i + 2] === keyB) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

export class Sprite {
  constructor(image, colliding, animation = null, redrawBackground = false) {
    this.image = image;
    this.colliding = colliding;
    this.animation = animation;
    this.redrawBackground = redrawBackground;
  }

  drawSprite(x, y, ctx) {
    const px = x * 32;
    const py = y * 32;
    if (!this.animation) {
      ctx.drawImage(this.image, px, py);
    } else {
      this.animation.update();
      ctx.drawImage(this.animation.image, px, py);
    }
  }
}
