import { deepCloneAnimation } from '../utils.js';
import { EntityBase } from './entityBase.js';
import { Item } from './item.js';

export class CoinBox extends EntityBase {
  constructor(ctx, spriteCollection, x, y, sound, dashboard, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx;
    this.spriteCollection = spriteCollection;
    this.animation = deepCloneAnimation(spriteCollection.get('CoinBox').animation);
    this.type = 'Block';
    this.triggered = false;
    this.time = 0;
    this.maxTime = 10;
    this.sound = sound;
    this.dashboard = dashboard;
    this.vel = 1;
    this.item = new Item(spriteCollection, ctx, this.rect.x, this.rect.y, dashboard);
  }

  update(cam) {
    if (this.alive && !this.triggered) {
      this.animation.update();
    } else {
      this.animation.image = this.spriteCollection.get('empty').image;
      this.item.spawnCoin(cam, this.sound, this.dashboard);
      if (this.time < this.maxTime) {
        this.time += 1;
        this.rect.y -= this.vel;
      } else if (this.time < this.maxTime * 2) {
        this.time += 1;
        this.rect.y += this.vel;
      }
    }
    this.ctx.drawImage(
      this.spriteCollection.get('sky').image,
      this.rect.x + cam.x,
      this.rect.y + 2,
    );
    this.ctx.drawImage(this.animation.image, this.rect.x + cam.x, this.rect.y - 1);
  }
}
