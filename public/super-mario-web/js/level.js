import { assetPath, fetchJson, GameRect } from './utils.js';
import { Coin } from './entities/coin.js';
import { CoinBox } from './entities/coinBox.js';
import { CoinBrick } from './entities/coinBrick.js';
import { Goomba } from './entities/goomba.js';
import { Koopa } from './entities/koopa.js';
import { RandomBox } from './entities/randomBox.js';
import { RedMushroom } from './entities/mushroom.js';

class Tile {
  constructor(sprite, rect) {
    this.sprite = sprite;
    this.rect = rect;
  }
}

export class Level {
  constructor(ctx, sound, dashboard, sprites) {
    this.sprites = sprites;
    this.dashboard = dashboard;
    this.sound = sound;
    this.ctx = ctx;
    this.level = null;
    this.levelLength = 0;
    this.entityList = [];
  }

  async loadLevel(levelname) {
    const data = await fetchJson(`levels/${levelname}.json`);
    this.loadLayers(data);
    this.loadObjects(data);
    this.loadEntities(data);
    this.levelLength = data.length;
  }

  loadEntities(data) {
    try {
      const entities = data.level.entities;
      entities.CoinBox?.forEach(([x, y]) => this.addCoinBox(x, y));
      entities.Goomba?.forEach(([x, y]) => this.addGoomba(x, y));
      entities.Koopa?.forEach(([x, y]) => this.addKoopa(x, y));
      entities.coin?.forEach(([x, y]) => this.addCoin(x, y));
      entities.coinBrick?.forEach(([x, y]) => this.addCoinBrick(x, y));
      entities.RandomBox?.forEach(([x, y, item]) => this.addRandomBox(x, y, item));
    } catch {
      // no entities
    }
  }

  loadLayers(data) {
    const layers = [];
    for (let x = data.level.layers.sky.x[0]; x < data.level.layers.sky.x[1]; x += 1) {
      layers.push([
        ...Array.from({ length: data.level.layers.sky.y[1] - data.level.layers.sky.y[0] }, () =>
          new Tile(this.sprites.get('sky'), null),
        ),
        ...Array.from({ length: data.level.layers.ground.y[1] - data.level.layers.ground.y[0] }, (_, i) => {
          const y = data.level.layers.ground.y[0] + i;
          return new Tile(
            this.sprites.get('ground'),
            new GameRect(x * 32, (y - 1) * 32, 32, 32),
          );
        }),
      ]);
    }
    this.level = layers[0].map((_, colIndex) => layers.map((row) => row[colIndex]));
  }

  loadObjects(data) {
    data.level.objects.bush?.forEach(([x, y]) => this.addBushSprite(x, y));
    data.level.objects.cloud?.forEach(([x, y]) => this.addCloudSprite(x, y));
    data.level.objects.pipe?.forEach(([x, y, z]) => this.addPipeSprite(x, y, z));
    data.level.objects.sky?.forEach(([x, y]) => {
      this.level[y][x] = new Tile(this.sprites.get('sky'), null);
    });
    data.level.objects.ground?.forEach(([x, y]) => {
      this.level[y][x] = new Tile(
        this.sprites.get('ground'),
        new GameRect(x * 32, y * 32, 32, 32),
      );
    });
  }

  updateEntities(cam) {
    for (let i = this.entityList.length - 1; i >= 0; i -= 1) {
      const entity = this.entityList[i];
      entity.update(cam);
      if (entity.alive === null) {
        this.entityList.splice(i, 1);
      }
    }
  }

  drawLevel(camera) {
    try {
      for (let y = 0; y < 15; y += 1) {
        for (let x = 0 - Math.floor(camera.pos.x + 1); x < 20 - Math.floor(camera.pos.x - 1); x += 1) {
          const tile = this.level[y]?.[x];
          if (tile?.sprite) {
            if (tile.sprite.redrawBackground) {
              this.ctx.drawImage(
                this.sprites.get('sky').image,
                (x + camera.pos.x) * 32,
                y * 32,
              );
            }
            tile.sprite.drawSprite(x + camera.pos.x, y, this.ctx);
          }
        }
      }
      this.updateEntities(camera);
    } catch {
      // index out of bounds
    }
  }

  addCloudSprite(x, y) {
    try {
      for (let yOff = 0; yOff < 2; yOff += 1) {
        for (let xOff = 0; xOff < 3; xOff += 1) {
          this.level[y + yOff][x + xOff] = new Tile(
            this.sprites.get(`cloud${yOff + 1}_${xOff + 1}`),
            null,
          );
        }
      }
    } catch {
      // ignore
    }
  }

  addPipeSprite(x, y, length = 2) {
    try {
      this.level[y][x] = new Tile(
        this.sprites.get('pipeL'),
        new GameRect(x * 32, y * 32, 32, 32),
      );
      this.level[y][x + 1] = new Tile(
        this.sprites.get('pipeR'),
        new GameRect((x + 1) * 32, y * 32, 32, 32),
      );
      for (let i = 1; i < length + 20; i += 1) {
        this.level[y + i][x] = new Tile(
          this.sprites.get('pipe2L'),
          new GameRect(x * 32, (y + i) * 32, 32, 32),
        );
        this.level[y + i][x + 1] = new Tile(
          this.sprites.get('pipe2R'),
          new GameRect((x + 1) * 32, (y + i) * 32, 32, 32),
        );
      }
    } catch {
      // ignore
    }
  }

  addBushSprite(x, y) {
    try {
      this.level[y][x] = new Tile(this.sprites.get('bush_1'), null);
      this.level[y][x + 1] = new Tile(this.sprites.get('bush_2'), null);
      this.level[y][x + 2] = new Tile(this.sprites.get('bush_3'), null);
    } catch {
      // ignore
    }
  }

  addCoinBox(x, y) {
    this.level[y][x] = new Tile(null, new GameRect(x * 32, y * 32 - 1, 32, 32));
    this.entityList.push(
      new CoinBox(this.ctx, this.sprites, x, y, this.sound, this.dashboard),
    );
  }

  addRandomBox(x, y, item) {
    this.level[y][x] = new Tile(null, new GameRect(x * 32, y * 32 - 1, 32, 32));
    this.entityList.push(
      new RandomBox(this.ctx, this.sprites, x, y, item, this.sound, this.dashboard, this),
    );
  }

  addCoin(x, y) {
    this.entityList.push(new Coin(this.ctx, this.sprites, x, y));
  }

  addCoinBrick(x, y) {
    this.level[y][x] = new Tile(null, new GameRect(x * 32, y * 32 - 1, 32, 32));
    this.entityList.push(
      new CoinBrick(this.ctx, this.sprites, x, y, this.sound, this.dashboard),
    );
  }

  addGoomba(x, y) {
    this.entityList.push(new Goomba(this.ctx, this.sprites, x, y, this, this.sound));
  }

  addKoopa(x, y) {
    this.entityList.push(new Koopa(this.ctx, this.sprites, x, y, this, this.sound));
  }

  addRedMushroom(x, y) {
    this.entityList.push(
      new RedMushroom(this.ctx, this.sprites, x, y, this, this.sound),
    );
  }
}
