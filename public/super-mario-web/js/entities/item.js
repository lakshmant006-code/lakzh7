import { deepCloneAnimation, Vec2D } from '../utils.js';

export class Item {
  constructor(collection, ctx, x, y, dashboard) {
    this.itemPos = new Vec2D(x, y);
    this.itemVel = new Vec2D(0, 0);
    this.ctx = ctx;
    this.dashboard = dashboard;
    this.coinAnimation = deepCloneAnimation(collection.get('coin-item').animation);
    this.soundPlayed = false;
  }

  spawnCoin(cam, sound, dashboard) {
    if (!this.soundPlayed) {
      this.soundPlayed = true;
      dashboard.points += 100;
      sound.playSfx('coin');
    }
    this.coinAnimation.update();
    if (this.coinAnimation.timer < 45) {
      if (this.coinAnimation.timer < 15) {
        this.itemVel.y -= 0.5;
        this.itemPos.y += this.itemVel.y;
      } else {
        this.itemVel.y += 0.5;
        this.itemPos.y += this.itemVel.y;
      }
      this.ctx.drawImage(
        this.coinAnimation.image,
        this.itemPos.x + cam.x,
        this.itemPos.y,
      );
    } else if (this.coinAnimation.timer < 80) {
      this.itemVel.y = -0.75;
      this.itemPos.y += this.itemVel.y;
      this.dashboard.drawText(this.ctx, '100', this.itemPos.x + 3 + cam.x, this.itemPos.y, 8);
    }
  }
}
