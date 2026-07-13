import { fetchJson, resolveAssetPath } from './utils.js';
import { Animation } from './animation.js';
import { Sprite, Spritesheet } from './spritesheet.js';

const SPRITE_FILES = [
  'sprites/Mario.json',
  'sprites/Goomba.json',
  'sprites/Koopa.json',
  'sprites/Animations.json',
  'sprites/BackgroundSprites.json',
  'sprites/ItemAnimations.json',
  'sprites/RedMushroom.json',
];

export class Sprites {
  constructor() {
    this.spriteCollection = {};
  }

  static async load() {
    const sprites = new Sprites();
    sprites.spriteCollection = await sprites.loadSprites(SPRITE_FILES);
    return sprites;
  }

  get(name) {
    return this.spriteCollection[name];
  }

  async loadSprites(urlList) {
    const resDict = {};

    for (const relUrl of urlList) {
      const data = await fetchJson(relUrl);
      const sheetUrl = resolveAssetPath(data.spriteSheetURL);
      const mySpritesheet = await Spritesheet.fromUrl(sheetUrl);
      const dic = {};

      if (data.type === 'background') {
        for (const sprite of data.sprites) {
          const colorkey = sprite.colorKey ?? null;
          dic[sprite.name] = new Sprite(
            mySpritesheet.imageAt(sprite.x, sprite.y, sprite.scalefactor, colorkey),
            sprite.collision,
            null,
            sprite.redrawBg,
          );
        }
        Object.assign(resDict, dic);
      } else if (data.type === 'animation') {
        for (const sprite of data.sprites) {
          const images = sprite.images.map((image) =>
            mySpritesheet.imageAt(image.x, image.y, image.scale, sprite.colorKey),
          );
          dic[sprite.name] = new Sprite(
            null,
            null,
            new Animation(images, null, null, sprite.deltaTime),
          );
        }
        Object.assign(resDict, dic);
      } else if (data.type === 'character' || data.type === 'item') {
        for (const sprite of data.sprites) {
          const colorkey = sprite.colorKey ?? null;
          const xSize = sprite.xsize ?? data.size[0];
          const ySize = sprite.ysize ?? data.size[1];
          dic[sprite.name] = new Sprite(
            mySpritesheet.imageAt(
              sprite.x,
              sprite.y,
              sprite.scalefactor,
              colorkey,
              true,
              xSize,
              ySize,
            ),
            sprite.collision,
          );
        }
        Object.assign(resDict, dic);
      }
    }

    return resDict;
  }
}
