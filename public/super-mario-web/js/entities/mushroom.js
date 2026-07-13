import { Animation } from '../animation.js';
import { Collider, EntityCollider } from '../collider.js';
import { Vec2D } from '../utils.js';
import { LeftRightWalkTrait } from '../traits.js';
import { EntityBase } from './entityBase.js';

export class RedMushroom extends EntityBase {
  constructor(ctx, spriteColl, x, y, level, sound) {
    super(y, x - 1, 1.25);
    this.spriteCollection = spriteColl;
    this.animation = new Animation([spriteColl.get('mushroom').image]);
    this.ctx = ctx;
    this.leftrightTrait = new LeftRightWalkTrait(this, level);
    this.type = 'Mob';
    this.dashboard = level.dashboard;
    this.collision = new Collider(this, level);
    this.entityCollider = new EntityCollider(this);
    this.levelObj = level;
    this.sound = sound;
    this.textPos = new Vec2D(0, 0);
  }

  update(camera) {
    if (this.alive) {
      this.applyGravity();
      this.drawRedMushroom(camera);
      this.leftrightTrait.update();
    } else {
      this.onDead(camera);
    }
  }

  drawRedMushroom(camera) {
    this.ctx.drawImage(this.animation.image, this.rect.x + camera.x, this.rect.y);
    this.animation.update();
  }

  onDead(camera) {
    if (this.timer === 0) {
      this.setPointsTextStartPosition(this.rect.x + 3, this.rect.y);
    }
    if (this.timer < this.timeAfterDeath) {
      this.movePointsTextUpAndDraw(camera);
    } else {
      this.alive = null;
    }
    this.timer += 0.1;
  }

  setPointsTextStartPosition(x, y) {
    this.textPos = new Vec2D(x, y);
  }

  movePointsTextUpAndDraw(camera) {
    this.textPos.y -= 0.5;
    this.dashboard.drawText(this.ctx, '100', this.textPos.x + camera.x, this.textPos.y, 8);
  }
}
