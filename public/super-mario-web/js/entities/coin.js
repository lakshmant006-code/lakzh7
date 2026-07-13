import { deepCloneAnimation } from '../utils.js';
import { EntityBase } from './entityBase.js';

export class Coin extends EntityBase {
  constructor(ctx, spriteCollection, x, y, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx;
    this.spriteCollection = spriteCollection;
    this.animation = deepCloneAnimation(spriteCollection.get('coin').animation);
    this.type = 'Item';
  }

  update(cam) {
    if (this.alive) {
      this.animation.update();
      this.ctx.drawImage(this.animation.image, this.rect.x + cam.x, this.rect.y);
    }
  }
}
