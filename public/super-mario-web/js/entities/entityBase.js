import { GameRect, Vec2D } from '../utils.js';

export class EntityBase {
  constructor(x, y, gravity) {
    this.vel = new Vec2D();
    this.rect = new GameRect(x * 32, y * 32, 32, 32);
    this.gravity = gravity;
    this.traits = null;
    this.alive = true;
    this.active = true;
    this.bouncing = false;
    this.timeAfterDeath = 5;
    this.timer = 0;
    this.type = '';
    this.onGround = false;
    this.obeyGravity = true;
  }

  applyGravity() {
    if (this.obeyGravity) {
      this.vel.y += this.gravity;
    }
  }

  updateTraits() {
    if (!this.traits) return;
    for (const trait of Object.values(this.traits)) {
      trait.update?.();
    }
  }

  getPosIndex() {
    return new Vec2D(Math.floor(this.rect.x / 32), Math.floor(this.rect.y / 32));
  }

  getPosIndexAsFloat() {
    return new Vec2D(this.rect.x / 32, this.rect.y / 32);
  }
}
