import { Collider } from './collider.js';

export class GoTrait {
  constructor(animation, ctx, camera, ent) {
    this.animation = animation;
    this.direction = 0;
    this.heading = 1;
    this.accelVel = 0.32;
    this.decelVel = 0.18;
    this.maxVel = 3.0;
    this.ctx = ctx;
    this.boost = false;
    this.camera = camera;
    this.entity = ent;
  }

  update() {
    if (this.boost) {
      this.maxVel = 5.0;
      this.animation.deltaTime = 4;
    } else {
      this.animation.deltaTime = 7;
      if (Math.abs(this.entity.vel.x) > 3.2) {
        this.entity.vel.x = 3.2 * this.heading;
      }
      this.maxVel = 3.2;
    }

    if (this.direction !== 0) {
      this.heading = this.direction;
      if (this.heading === 1) {
        if (this.entity.vel.x < this.maxVel) {
          this.entity.vel.x += this.accelVel * this.heading;
        }
      } else if (this.entity.vel.x > -this.maxVel) {
        this.entity.vel.x += this.accelVel * this.heading;
      }

      if (!this.entity.inAir) {
        this.animation.update();
      } else {
        this.animation.inAir();
      }
    } else {
      this.animation.update();
      if (this.entity.vel.x >= 0) {
        this.entity.vel.x -= this.decelVel;
      } else {
        this.entity.vel.x += this.decelVel;
      }
      if (Math.trunc(this.entity.vel.x) === 0) {
        this.entity.vel.x = 0;
        if (this.entity.inAir) {
          this.animation.inAir();
        } else {
          this.animation.idle();
        }
      }
    }

    if (Math.floor(this.entity.invincibilityFrames / 2) % 2 === 0) {
      this.drawEntity();
    }
  }

  updateAnimation(animation) {
    this.animation = animation;
    this.update();
  }

  drawEntity() {
    const [x, y] = this.entity.getPos();
    const img = this.animation.image;
    if (this.heading === 1) {
      this.ctx.drawImage(img, x, y);
    } else {
      this.ctx.save();
      this.ctx.translate(x + img.width, y);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(img, 0, 0);
      this.ctx.restore();
    }
  }
}

export class JumpTrait {
  constructor(entity) {
    this.verticalSpeed = -12;
    this.jumpHeight = 120;
    this.entity = entity;
    this.initalHeight = 384;
    this.deaccelerationHeight =
      this.jumpHeight - (this.verticalSpeed * this.verticalSpeed) / (2 * this.entity.gravity);
  }

  jump(jumping) {
    if (jumping && this.entity.onGround) {
      this.entity.sound.playSfx('jump');
      this.entity.vel.y = this.verticalSpeed;
      this.entity.inAir = true;
      this.initalHeight = this.entity.rect.y;
      this.entity.inJump = true;
      this.entity.obeyGravity = false;
    }

    if (this.entity.inJump) {
      if (
        this.initalHeight - this.entity.rect.y >= this.deaccelerationHeight ||
        this.entity.vel.y === 0
      ) {
        this.entity.inJump = false;
        this.entity.obeyGravity = true;
      }
    }
  }

  reset() {
    this.entity.inAir = false;
  }
}

export class BounceTrait {
  constructor(entity) {
    this.vel = 5;
    this.jump = false;
    this.entity = entity;
  }

  update() {
    if (this.jump) {
      this.entity.vel.y = 0;
      this.entity.vel.y -= this.vel;
      this.jump = false;
      this.entity.inAir = true;
    }
  }

  reset() {
    this.entity.inAir = false;
  }
}

export class LeftRightWalkTrait {
  constructor(entity, level) {
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.entity = entity;
    this.collDetection = new Collider(entity, level);
    this.speed = 1;
    this.entity.vel.x = this.speed * this.direction;
  }

  update() {
    if (this.entity.vel.x === 0) {
      this.direction *= -1;
    }
    this.entity.vel.x = this.speed * this.direction;
    this.moveEntity();
  }

  moveEntity() {
    this.entity.rect.y += this.entity.vel.y;
    this.collDetection.checkY();
    this.entity.rect.x += this.entity.vel.x;
    this.collDetection.checkX();
  }
}
