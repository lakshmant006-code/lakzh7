import { assetPath } from './utils.js';
import { Spritesheet } from './spritesheet.js';

const LEVEL_NAMES = ['Level1-1', 'Level1-2'];

export class Menu {
  constructor(ctx, dashboard, level, sound) {
    this.ctx = ctx;
    this.sound = sound;
    this.start = false;
    this.inSettings = false;
    this.state = 0;
    this.level = level;
    this.music = true;
    this.sfx = true;
    this.currSelectedLevel = 1;
    this.levelNames = LEVEL_NAMES;
    this.inChoosingLevel = false;
    this.dashboard = dashboard;
    this.levelCount = LEVEL_NAMES.length;
    this.menuBanner = null;
    this.menuDot = null;
    this.menuDot2 = null;
    this.initSprites();
    this.loadSettings();
  }

  async initSprites() {
    const spritesheet = await Spritesheet.fromUrl(assetPath('img/title_screen.png'));
    this.menuBanner = spritesheet.imageAt(0, 60, 2, [255, 0, 220], true, 180, 88);
    this.menuDot = spritesheet.imageAt(0, 150, 2, [255, 0, 220], true);
    this.menuDot2 = spritesheet.imageAt(20, 150, 2, [255, 0, 220], true);
  }

  loadSettings() {
    try {
      const data = JSON.parse(localStorage.getItem('marioSettings') || '{}');
      this.music = data.sound ?? false;
      this.sfx = data.sfx ?? false;
      if (this.music) {
        this.sound.playMusic();
      }
      this.sound.allowSFX = this.sfx;
    } catch {
      this.music = false;
      this.sfx = false;
      this.sound.allowSFX = false;
      this.saveSettings();
    }
  }

  saveSettings() {
    localStorage.setItem('marioSettings', JSON.stringify({ sound: this.music, sfx: this.sfx }));
  }

  update() {
    if (this.inChoosingLevel) {
      this.drawMenuBackground(false);
      this.dashboard.update();
      this.drawLevelChooser();
      return;
    }
    this.drawMenuBackground();
    this.dashboard.update();
    if (!this.inSettings) {
      this.drawMenu();
    } else {
      this.drawSettings();
    }
  }

  drawDot() {
    if (!this.menuDot) return;
    if (this.state === 0) {
      this.ctx.drawImage(this.menuDot, 145, 273);
      this.ctx.drawImage(this.menuDot2, 145, 313);
      this.ctx.drawImage(this.menuDot2, 145, 353);
    } else if (this.state === 1) {
      this.ctx.drawImage(this.menuDot, 145, 313);
      this.ctx.drawImage(this.menuDot2, 145, 273);
      this.ctx.drawImage(this.menuDot2, 145, 353);
    } else {
      this.ctx.drawImage(this.menuDot, 145, 353);
      this.ctx.drawImage(this.menuDot2, 145, 273);
      this.ctx.drawImage(this.menuDot2, 145, 313);
    }
  }

  drawMenu() {
    this.drawDot();
    this.dashboard.drawText(this.ctx, 'CHOOSE LEVEL', 180, 280, 24);
    this.dashboard.drawText(this.ctx, 'SETTINGS', 180, 320, 24);
    this.dashboard.drawText(this.ctx, 'EXIT', 180, 360, 24);
  }

  drawMenuBackground(withBanner = true) {
    const sky = this.level.sprites.get('sky').image;
    const ground = this.level.sprites.get('ground').image;
    for (let y = 0; y < 13; y += 1) {
      for (let x = 0; x < 20; x += 1) {
        this.ctx.drawImage(sky, x * 32, y * 32);
      }
    }
    for (let y = 13; y < 15; y += 1) {
      for (let x = 0; x < 20; x += 1) {
        this.ctx.drawImage(ground, x * 32, y * 32);
      }
    }
    if (withBanner && this.menuBanner) {
      this.ctx.drawImage(this.menuBanner, 150, 80);
    }
    this.ctx.drawImage(this.level.sprites.get('mario_idle').image, 2 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get('bush_1').image, 14 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get('bush_2').image, 15 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get('bush_2').image, 16 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get('bush_2').image, 17 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get('bush_3').image, 18 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get('goomba-1').image, 18.5 * 32, 12 * 32);
  }

  drawSettings() {
    this.drawDot();
    this.dashboard.drawText(this.ctx, 'MUSIC', 180, 280, 24);
    this.dashboard.drawText(this.ctx, this.music ? 'ON' : 'OFF', 340, 280, 24);
    this.dashboard.drawText(this.ctx, 'SFX', 180, 320, 24);
    this.dashboard.drawText(this.ctx, this.sfx ? 'ON' : 'OFF', 340, 320, 24);
    this.dashboard.drawText(this.ctx, 'BACK', 180, 360, 24);
  }

  chooseLevel() {
    this.drawMenuBackground(false);
    this.inChoosingLevel = true;
    this.drawLevelChooser();
  }

  drawBorder(x, y, width, height, color, thickness) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, thickness);
    this.ctx.fillRect(x, y + height, width, thickness);
    this.ctx.fillRect(x, y, thickness, height);
    this.ctx.fillRect(x + width, y, thickness, height + thickness);
  }

  drawLevelChooser() {
    let j = 0;
    const offset = 75;
    const textOffset = 90;
    this.levelNames.forEach((levelName, i) => {
      const color = this.currSelectedLevel === i + 1 ? '#ffffff' : '#969696';
      if (i < 3) {
        this.dashboard.drawText(this.ctx, levelName, 175 * i + textOffset, 100, 12);
        this.drawBorder(175 * i + offset, 55, 125, 75, color, 5);
      } else {
        this.dashboard.drawText(this.ctx, levelName, 175 * j + textOffset, 250, 12);
        this.drawBorder(175 * j + offset, 210, 125, 75, color, 5);
        j += 1;
      }
    });
  }

  handleKey(code) {
    if (code === 'Escape') {
      if (this.inChoosingLevel || this.inSettings) {
        this.inChoosingLevel = false;
        this.inSettings = false;
        this.state = 0;
      }
      return;
    }

    if (code === 'ArrowUp' || code === 'KeyK') {
      if (this.inChoosingLevel && this.currSelectedLevel > 3) {
        this.currSelectedLevel -= 3;
        this.drawLevelChooser();
      } else if (this.state > 0) {
        this.state -= 1;
      }
    } else if (code === 'ArrowDown' || code === 'KeyJ') {
      if (this.inChoosingLevel && this.currSelectedLevel + 3 <= this.levelCount) {
        this.currSelectedLevel += 3;
        this.drawLevelChooser();
      } else if (this.state < 2) {
        this.state += 1;
      }
    } else if (code === 'ArrowLeft' || code === 'KeyH') {
      if (this.inChoosingLevel && this.currSelectedLevel > 1) {
        this.currSelectedLevel -= 1;
        this.drawLevelChooser();
      }
    } else if (code === 'ArrowRight' || code === 'KeyL') {
      if (this.inChoosingLevel && this.currSelectedLevel < this.levelCount) {
        this.currSelectedLevel += 1;
        this.drawLevelChooser();
      }
    } else if (code === 'Enter') {
      if (this.inChoosingLevel) {
        this.inChoosingLevel = false;
        this.dashboard.state = 'start';
        this.dashboard.time = 0;
        const levelName = this.levelNames[this.currSelectedLevel - 1];
        this.level.loadLevel(levelName).then(() => {
          this.dashboard.levelName = levelName.split('Level')[1];
          this.start = true;
          this.onStart?.();
        });
        return;
      }
      if (!this.inSettings) {
        if (this.state === 0) this.chooseLevel();
        else if (this.state === 1) {
          this.inSettings = true;
          this.state = 0;
        } else if (this.state === 2) {
          window.close();
        }
      } else if (this.state === 0) {
        if (this.music) {
          this.sound.stopMusic();
          this.music = false;
        } else {
          this.sound.playMusic();
          this.music = true;
        }
        this.saveSettings();
      } else if (this.state === 1) {
        this.sfx = !this.sfx;
        this.sound.allowSFX = this.sfx;
        this.saveSettings();
      } else {
        this.inSettings = false;
      }
    }
  }
}
