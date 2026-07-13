import { assetPath } from './utils.js';

export class Sound {
  constructor() {
    this.allowSFX = true;
    this.musicVolume = 0.2;
    this.sfxVolume = 0.2;
    this.musicPlaying = false;

    this.soundtrack = new Audio(assetPath('sfx/main_theme.ogg'));
    this.soundtrack.loop = true;
    this.soundtrack.volume = this.musicVolume;

    this.sfx = {
      coin: assetPath('sfx/coin.ogg'),
      bump: assetPath('sfx/bump.ogg'),
      stomp: assetPath('sfx/stomp.ogg'),
      jump: assetPath('sfx/small_jump.ogg'),
      death: assetPath('sfx/death.wav'),
      kick: assetPath('sfx/kick.ogg'),
      brick_bump: assetPath('sfx/brick-bump.ogg'),
      powerup: assetPath('sfx/powerup.ogg'),
      powerup_appear: assetPath('sfx/powerup_appears.ogg'),
      pipe: assetPath('sfx/pipe.ogg'),
    };
  }

  playMusic() {
    this.musicPlaying = true;
    this.soundtrack.currentTime = 0;
    this.soundtrack.play().catch(() => {});
  }

  stopMusic() {
    this.musicPlaying = false;
    this.soundtrack.pause();
  }

  playSfx(key) {
    if (!this.allowSFX) return;
    const audio = new Audio(this.sfx[key]);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
  }

  playDeath() {
    this.stopMusic();
    const audio = new Audio(this.sfx.death);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {});
    return audio;
  }
}
