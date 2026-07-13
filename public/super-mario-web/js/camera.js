import { Vec2D } from './utils.js';

export class Camera {
  constructor(pos, entity) {
    this.pos = new Vec2D(pos.x, pos.y);
    this.entity = entity;
    this.x = this.pos.x * 32;
    this.y = this.pos.y * 32;
    this.targetX = 0;
  }

  move() {
    const xPosFloat = this.entity.getPosIndexAsFloat().x;
    const maxCam = (this.entity.levelObj?.levelLength ?? 60) - 10;

    if (xPosFloat > 10 && xPosFloat < maxCam) {
      this.targetX = -xPosFloat + 10;
    } else if (xPosFloat >= maxCam) {
      this.targetX = -maxCam + 10;
    } else {
      this.targetX = 0;
    }

    this.pos.x += (this.targetX - this.pos.x) * 0.14;
    this.x = this.pos.x * 32;
    this.y = this.pos.y * 32;
  }
}
