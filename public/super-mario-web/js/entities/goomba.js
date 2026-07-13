import { deepCloneAnimation, Vec2D } from '../utils.js';
import { Animation } from '../animation.js';
import { Collider, EntityCollider } from '../collider.js';
import { LeftRightWalkTrait } from '../traits.js';
import { EntityBase } from './entityBase.js';

export class Goomba extends EntityBase {
  constructor(ctx, spriteColl, x, y, level, sound) {
    super(y, x - 1, 1.25);
    this.spriteCollection = spriteColl;
    this.animation = new Animation([
      spriteColl.get('goomba-1').image,
      spriteColl.get('goomba-2').image,
    ]);
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
      this.drawGoomba(camera);
      this.leftrightTrait.update();
      this.checkEntityCollision();
    } else {
      this.onDead(camera);
    }
  }

  drawGoomba(camera) {
    this.ctx.drawImage(this.animation.image, this.rect.x + camera.x, this.rect.y);
    this.animation.update();
  }

  onDead(camera) {
    if (this.timer === 0) {
      this.setPointsTextStartPosition(this.rect.x + 3, this.rect.y);
    }
    if (this.timer < this.timeAfterDeath) {
      this.movePointsTextUpAndDraw(camera);
      this.drawFlatGoomba(camera);
    } else {
      this.alive = null;
    }
    this.timer += 0.1;
  }

  drawFlatGoomba(camera) {
    this.ctx.drawImage(
      this.spriteCollection.get('goomba-flat').image,
      this.rect.x + camera.x,
      this.rect.y,
    );
  }

  setPointsTextStartPosition(x, y) {
    this.textPos = new Vec2D(x, y);
  }

  movePointsTextUpAndDraw(camera) {
    this.textPos.y -= 0.5;
    this.dashboard.drawText(this.ctx, '100', this.textPos.x + camera.x, this.textPos.y, 8);
  }

  checkEntityCollision() {
    for (const ent of this.levelObj.entityList) {
      const collisionState = this.entityCollider.check(ent);
      if (collisionState.isColliding && ent.type === 'Mob' && ent.bouncing) {
        this.alive = false;
        this.sound.playSfx('brick_bump');
      }
    }
  }
}
