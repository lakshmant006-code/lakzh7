import { Animation } from './animation.js';
import { Camera } from './camera.js';
import { Collider, EntityCollider } from './collider.js';
import { GameRect } from './utils.js';
import { EntityBase } from './entities/entityBase.js';
import { RedMushroom } from './entities/mushroom.js';
import { BounceTrait, GoTrait, JumpTrait } from './traits.js';
import { Input } from './input.js';
import { Pause } from './pause.js';

export class Mario extends EntityBase {
  constructor(x, y, level, ctx, dashboard, sound, sprites) {
    super(x, y, 0.8);
    const get = (name) => sprites.get(name);
    const smallAnimation = new Animation(
      [get('mario_run1').image, get('mario_run2').image, get('mario_run3').image],
      get('mario_idle').image,
      get('mario_jump').image,
    );
    const bigAnimation = new Animation(
      [get('mario_big_run1').image, get('mario_big_run2').image, get('mario_big_run3').image],
      get('mario_big_idle').image,
      get('mario_big_jump').image,
    );
    this.smallAnimation = smallAnimation;
    this.bigAnimation = bigAnimation;

    this.camera = new Camera(this.rect, this);
    this.sound = sound;
    this.input = new Input(this);
    this.inAir = false;
    this.inJump = false;
    this.powerUpState = 0;
    this.invincibilityFrames = 0;
    this.traits = {
      jumpTrait: new JumpTrait(this),
      goTrait: new GoTrait(smallAnimation, ctx, this.camera, this),
      bounceTrait: new BounceTrait(this),
    };

    this.levelObj = level;
    this.collision = new Collider(this, level);
    this.ctx = ctx;
    this.entityCollider = new EntityCollider(this);
    this.dashboard = dashboard;
    this.restart = false;
    this.pause = false;
    this.pauseObj = new Pause(ctx, this, dashboard);
    this.gameOverActive = false;
  }

  update() {
    if (this.invincibilityFrames > 0) {
      this.invincibilityFrames -= 1;
    }
    this.updateTraits();
    this.moveMario();
    this.camera.move();
    this.applyGravity();
    this.checkEntityCollision();
    this.input.checkForInput();
  }

  moveMario() {
    this.rect.y += this.vel.y;
    this.collision.checkY();
    this.rect.x += this.vel.x;
    this.collision.checkX();
  }

  checkEntityCollision() {
    for (const ent of [...this.levelObj.entityList]) {
      const collisionState = this.entityCollider.check(ent);
      if (!collisionState.isColliding) continue;

      if (ent.type === 'Item') {
        this.onCollisionWithItem(ent);
      } else if (ent.type === 'Block') {
        this.onCollisionWithBlock(ent);
      } else if (ent.type === 'Mob') {
        this.onCollisionWithMob(ent, collisionState);
      }
    }
  }

  onCollisionWithItem(item) {
    const idx = this.levelObj.entityList.indexOf(item);
    if (idx !== -1) this.levelObj.entityList.splice(idx, 1);
    this.dashboard.points += 100;
    this.dashboard.coins += 1;
    this.sound.playSfx('coin');
  }

  onCollisionWithBlock(block) {
    if (!block.triggered) {
      this.dashboard.coins += 1;
      this.sound.playSfx('bump');
    }
    block.triggered = true;
  }

  onCollisionWithMob(mob, collisionState) {
    if (mob instanceof RedMushroom && mob.alive) {
      this.powerup(1);
      this.killEntity(mob);
      this.sound.playSfx('powerup');
    } else if (collisionState.isTop && (mob.alive || mob.bouncing)) {
      this.sound.playSfx('stomp');
      this.rect.bottom = mob.rect.top;
      this.bounce();
      this.killEntity(mob);
    } else if (collisionState.isTop && mob.alive && !mob.active) {
      this.sound.playSfx('stomp');
      this.rect.bottom = mob.rect.top;
      mob.timer = 0;
      this.bounce();
      mob.alive = false;
    } else if (collisionState.isColliding && mob.alive && !mob.active && !mob.bouncing) {
      mob.bouncing = true;
      if (mob.rect.x < this.rect.x) {
        mob.leftrightTrait.direction = -1;
        mob.rect.x -= 5;
        this.sound.playSfx('kick');
      } else {
        mob.rect.x += 5;
        mob.leftrightTrait.direction = 1;
        this.sound.playSfx('kick');
      }
    } else if (collisionState.isColliding && mob.alive && !this.invincibilityFrames) {
      if (this.powerUpState === 0) {
        this.gameOver();
      } else if (this.powerUpState === 1) {
        this.powerUpState = 0;
        this.traits.goTrait.updateAnimation(this.smallAnimation);
        const { x, y } = this.rect;
        this.rect = new GameRect(x, y + 32, 32, 32);
        this.invincibilityFrames = 60;
        this.sound.playSfx('pipe');
      }
    }
  }

  bounce() {
    this.traits.bounceTrait.jump = true;
  }

  killEntity(ent) {
    if (ent.constructor.name !== 'Koopa') {
      ent.alive = false;
    } else {
      ent.timer = 0;
      ent.leftrightTrait.speed = 1;
      ent.alive = true;
      ent.active = false;
      ent.bouncing = false;
    }
    this.dashboard.points += 100;
  }

  gameOver() {
    if (this.gameOverActive) return;
    this.gameOverActive = true;
    this.gameOverRadius = 500;
    this.deathAudio = this.sound.playDeath();
  }

  updateGameOver() {
    if (!this.gameOverActive) return false;

    if (this.gameOverRadius > 20) {
      this.gameOverRadius -= 2;
      this.ctx.save();
      this.ctx.globalAlpha = 0.5;
      this.ctx.fillStyle = '#000';
      this.ctx.fillRect(0, 0, 640, 480);
      this.ctx.globalAlpha = 1;
      this.ctx.beginPath();
      this.ctx.arc(
        this.camera.x + this.rect.x + 16,
        this.rect.y + 16,
        this.gameOverRadius,
        0,
        Math.PI * 2,
      );
      this.ctx.fillStyle = '#fff';
      this.ctx.fill();
      this.ctx.restore();
      return true;
    }

    if (this.deathAudio && !this.deathAudio.ended) {
      return true;
    }

    this.restart = true;
    return true;
  }

  getPos() {
    return [this.camera.x + this.rect.x, this.rect.y];
  }

  setPos(x, y) {
    this.rect.x = x;
    this.rect.y = y;
  }

  powerup(powerupID) {
    if (this.powerUpState === 0 && powerupID === 1) {
      this.powerUpState = 1;
      this.traits.goTrait.updateAnimation(this.bigAnimation);
      this.rect = new GameRect(this.rect.x, this.rect.y - 32, 32, 64);
      this.invincibilityFrames = 20;
    }
  }
}
