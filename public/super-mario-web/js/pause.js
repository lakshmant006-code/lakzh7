import { assetPath } from './utils.js';
import { Spritesheet } from './spritesheet.js';

export class Pause {
  constructor(ctx, entity, dashboard) {
    this.ctx = ctx;
    this.entity = entity;
    this.dashboard = dashboard;
    this.state = 0;
    this.pauseSurface = null;
    this.spritesheet = null;
    this.dot = null;
    this.grayDot = null;
    this.initSprites();
  }

  async initSprites() {
    this.spritesheet = await Spritesheet.fromUrl(assetPath('img/title_screen.png'));
    this.dot = this.spritesheet.imageAt(0, 150, 2, [255, 0, 220], true);
    this.grayDot = this.spritesheet.imageAt(20, 150, 2, [255, 0, 220], true);
  }

  createBackgroundBlur() {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    ctx.filter = 'blur(4px)';
    ctx.drawImage(this.ctx.canvas, 0, 0);
    ctx.filter = 'none';
    this.pauseSurface = canvas;
  }

  update() {
    if (this.pauseSurface) {
      this.ctx.drawImage(this.pauseSurface, 0, 0);
    }
    this.dashboard.drawText(this.ctx, 'PAUSED', 120, 160, 68);
    this.dashboard.drawText(this.ctx, 'CONTINUE', 150, 280, 32);
    this.dashboard.drawText(this.ctx, 'BACK TO MENU', 150, 320, 32);
    this.drawDot();
    this.checkInput();
  }

  drawDot() {
    if (!this.dot) return;
    if (this.state === 0) {
      this.ctx.drawImage(this.dot, 100, 275);
      this.ctx.drawImage(this.grayDot, 100, 315);
    } else {
      this.ctx.drawImage(this.dot, 100, 315);
      this.ctx.drawImage(this.grayDot, 100, 275);
    }
  }

  checkInput() {
    // handled via menu key listener in main
  }

  handleKey(code) {
    if (code === 'Enter') {
      if (this.state === 0) {
        this.entity.pause = false;
      } else {
        this.entity.restart = true;
      }
    } else if (code === 'ArrowUp' || code === 'KeyK') {
      if (this.state > 0) this.state -= 1;
    } else if (code === 'ArrowDown' || code === 'KeyJ') {
      if (this.state < 1) this.state += 1;
    }
  }
}
