export class Animation {
  constructor(images, idleSprite = null, airSprite = null, deltaTime = 7) {
    this.images = images;
    this.timer = 0;
    this.index = 0;
    this.image = this.images[this.index];
    this.idleSprite = idleSprite;
    this.airSprite = airSprite;
    this.deltaTime = deltaTime;
  }

  update() {
    this.timer += 1;
    if (this.timer % this.deltaTime === 0) {
      this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
    }
    this.image = this.images[this.index];
  }

  idle() {
    this.image = this.idleSprite;
  }

  inAir() {
    this.image = this.airSprite;
  }
}
