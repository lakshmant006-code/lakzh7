import { deepCloneAnimation } from '../utils.js';
import { EntityBase } from './entityBase.js';

export class RandomBox extends EntityBase {
  constructor(ctx, spriteCollection, x, y, item, sound, dashboard, level, gravity = 0) {
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
    this.item = item;
    this.level = level;
  }

  update(cam) {
    if (this.alive && !this.triggered) {
      this.animation.update();
    } else {
      this.animation.image = this.spriteCollection.get('empty').image;
      if (this.item === 'RedMushroom') {
        this.level.addRedMushroom(Math.floor(this.rect.y / 32) - 1, Math.floor(this.rect.x / 32));
        this.sound.playSfx('powerup_appear');
      }
      this.item = null;
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
