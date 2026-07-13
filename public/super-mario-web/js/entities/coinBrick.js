import { EntityBase } from './entityBase.js';
import { Item } from './item.js';

export class CoinBrick extends EntityBase {
  constructor(ctx, spriteCollection, x, y, sound, dashboard, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx;
    this.spriteCollection = spriteCollection;
    this.image = spriteCollection.get('bricks').image;
    this.type = 'Block';
    this.triggered = false;
    this.sound = sound;
    this.dashboard = dashboard;
    this.item = new Item(spriteCollection, ctx, this.rect.x, this.rect.y, dashboard);
  }

  update(cam) {
    if (!this.alive || this.triggered) {
      this.image = this.spriteCollection.get('empty').image;
      this.item.spawnCoin(cam, this.sound, this.dashboard);
    }
    this.ctx.drawImage(
      this.spriteCollection.get('sky').image,
      this.rect.x + cam.x,
      this.rect.y + 2,
    );
    this.ctx.drawImage(this.image, this.rect.x + cam.x, this.rect.y - 1);
  }
}
