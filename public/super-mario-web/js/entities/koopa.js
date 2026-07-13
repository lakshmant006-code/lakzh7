import { Animation } from '../animation.js';
import { Collider, EntityCollider } from '../collider.js';
import { LeftRightWalkTrait } from '../traits.js';
import { EntityBase } from './entityBase.js';

export class Koopa extends EntityBase {
  constructor(ctx, spriteColl, x, y, level, sound) {
    super(y - 1, x, 1.25);
    this.spriteCollection = spriteColl;
    this.animation = new Animation([
      spriteColl.get('koopa-1').image,
      spriteColl.get('koopa-2').image,
    ]);
    this.ctx = ctx;
    this.leftrightTrait = new LeftRightWalkTrait(this, level);
    this.timer = 0;
    this.timeAfterDeath = 35;
    this.type = 'Mob';
    this.dashboard = level.dashboard;
    this.collision = new Collider(this, level);
    this.entityCollider = new EntityCollider(this);
    this.levelObj = level;
    this.sound = sound;
  }

  update(camera) {
    if (this.alive && this.active) {
      this.updateAlive(camera);
      this.checkEntityCollision();
    } else if (this.alive && !this.active && !this.bouncing) {
      this.sleepingInShell(camera);
      this.checkEntityCollision();
    } else if (this.bouncing) {
      this.shellBouncing(camera);
    }
  }

  drawKoopa(camera) {
    const img = this.animation.image;
    const x = this.rect.x + camera.x;
    const y = this.rect.y - 32;
    if (this.leftrightTrait.direction === -1) {
      this.ctx.drawImage(img, x, y);
    } else {
      this.ctx.save();
      this.ctx.translate(x + img.width, y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(img, 0, 0);
      this.ctx.restore();
    }
  }

  shellBouncing(camera) {
    this.leftrightTrait.speed = 4;
    this.applyGravity();
    this.animation.image = this.spriteCollection.get('koopa-hiding').image;
    this.drawKoopa(camera);
    this.leftrightTrait.update();
  }

  sleepingInShell(camera) {
    if (this.timer < this.timeAfterDeath) {
      this.ctx.drawImage(
        this.spriteCollection.get('koopa-hiding').image,
        this.rect.x + camera.x,
        this.rect.y - 32,
      );
    } else {
      this.alive = true;
      this.active = true;
      this.bouncing = false;
      this.timer = 0;
    }
    this.timer += 0.1;
  }

  updateAlive(camera) {
    this.applyGravity();
    this.drawKoopa(camera);
    this.animation.update();
    this.leftrightTrait.update();
  }

  checkEntityCollision() {
    for (const ent of this.levelObj.entityList) {
      if (ent !== this) {
        const collisionState = this.entityCollider.check(ent);
        if (collisionState.isColliding && ent.type === 'Mob' && ent.bouncing) {
          this.alive = false;
          this.sound.playSfx('brick_bump');
        }
      }
    }
  }
}
