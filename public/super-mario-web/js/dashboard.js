import { assetPath } from './utils.js';
import { Spritesheet } from './spritesheet.js';

const CHARS =
  ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';

export class Font {
  constructor(spritesheet) {
    this.spritesheet = spritesheet;
    this.charSprites = this.loadFont();
  }

  static async create() {
    const sheet = await Spritesheet.fromUrl(assetPath('img/font.png'));
    return new Font(sheet);
  }

  loadFont() {
    const font = {};
    let row = 0;
    let charAt = 0;

    for (const char of CHARS) {
      if (charAt === 16) {
        charAt = 0;
        row += 1;
      }
      font[char] = this.spritesheet.imageAt(charAt, row, 2, [0, 0, 0], false, 8, 8);
      charAt += 1;
    }
    return font;
  }

  drawText(ctx, text, x, y, size) {
    for (const char of text) {
      const charSprite = this.charSprites[char];
      if (charSprite) {
        ctx.drawImage(charSprite, 0, 0, charSprite.width, charSprite.height, x, y, size, size);
      }
      x += char === ' ' ? size / 2 : size;
    }
  }
}

export class Dashboard {
  constructor(font, ctx) {
    this.font = font;
    this.state = 'menu';
    this.ctx = ctx;
    this.levelName = '';
    this.points = 0;
    this.coins = 0;
    this.ticks = 0;
    this.time = 0;
  }

  drawText(ctx, text, x, y, size) {
    this.font.drawText(ctx, text, x, y, size);
  }

  update() {
    this.drawText(this.ctx, 'MARIO', 50, 20, 15);
    this.drawText(this.ctx, this.pointString(), 50, 37, 15);
    this.drawText(this.ctx, `@x${this.coinString()}`, 225, 37, 15);
    this.drawText(this.ctx, 'WORLD', 380, 20, 15);
    this.drawText(this.ctx, String(this.levelName), 395, 37, 15);
    this.drawText(this.ctx, 'TIME', 520, 20, 15);
    if (this.state !== 'menu') {
      this.drawText(this.ctx, this.timeString(), 535, 37, 15);
    }

    this.ticks += 1;
    if (this.ticks === 60) {
      this.ticks = 0;
      this.time += 1;
    }
  }

  coinString() {
    return String(this.coins).padStart(2, '0');
  }

  pointString() {
    return String(this.points).padStart(6, '0');
  }

  timeString() {
    return String(this.time).padStart(3, '0');
  }
}
