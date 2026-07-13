export class Input {
  constructor(entity) {
    this.entity = entity;
    this.keys = {};
    this.mouseEvents = [];

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      this.handleKeyDown(e);
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
    window.addEventListener('mouseup', (e) => {
      this.mouseEvents.push({ button: e.button, type: 'mouseup' });
    });

    window.addEventListener('mousemove', (e) => {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });
  }

  handleKeyDown(e) {
    if (e.code === 'Escape' || e.code === 'F5') {
      if (!this.entity.pause && !this.entity.gameOverActive) {
        this.entity.pause = true;
        this.entity.pauseObj.createBackgroundBlur();
      }
    }
  }

  checkForInput() {
    this.checkForKeyboardInput();
    this.checkForMouseInput();
    this.mouseEvents = [];
  }

  checkForKeyboardInput() {
    const left = this.keys.ArrowLeft || this.keys.KeyH;
    const right = this.keys.ArrowRight || this.keys.KeyL;

    if (left && !right) {
      this.entity.traits.goTrait.direction = -1;
    } else if (right && !left) {
      this.entity.traits.goTrait.direction = 1;
    } else {
      this.entity.traits.goTrait.direction = 0;
    }

    const isJumping = this.keys.Space || this.keys.ArrowUp || this.keys.KeyK;
    this.entity.traits.jumpTrait.jump(isJumping);
    this.entity.traits.goTrait.boost = this.keys.ShiftLeft || this.keys.ShiftRight;
  }

  checkForMouseInput() {
    const canvas = this.entity.ctx.canvas;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    for (const e of this.mouseEvents) {
      if (e.type !== 'mouseup') continue;
      const mouseX = (this.lastMouseX - rect.left) * scaleX;
      const mouseY = (this.lastMouseY - rect.top) * scaleY;

      if (e.button === 2) {
        this.entity.levelObj.addKoopa(
          mouseY / 32,
          mouseX / 32 - this.entity.camera.pos.x,
        );
        this.entity.levelObj.addGoomba(
          mouseY / 32,
          mouseX / 32 - this.entity.camera.pos.x,
        );
        this.entity.levelObj.addRedMushroom(
          mouseY / 32,
          mouseX / 32 - this.entity.camera.pos.x,
        );
      }
      if (e.button === 0) {
        this.entity.levelObj.addCoin(
          mouseX / 32 - this.entity.camera.pos.x,
          mouseY / 32,
        );
      }
    }
  }
}
