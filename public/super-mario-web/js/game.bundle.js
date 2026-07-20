// super-mario-python-master/web/js/utils.js
var ASSET_BASE = new URL("../", import.meta.url).href;
function assetPath(relativePath) {
  const clean = relativePath.replace(/^\.\//, "");
  return new URL(clean, ASSET_BASE).href;
}
var WINDOW_W = 640;
var WINDOW_H = 480;
var Vec2D = class {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
};
var GameRect = class {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  get left() {
    return this.x;
  }
  set left(v) {
    this.x = v;
  }
  get right() {
    return this.x + this.width;
  }
  set right(v) {
    this.x = v - this.width;
  }
  get top() {
    return this.y;
  }
  set top(v) {
    this.y = v;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(v) {
    this.y = v - this.height;
  }
  get bottomleft() {
    return [this.left, this.bottom];
  }
  get bottomright() {
    return [this.right, this.bottom];
  }
  get midbottom() {
    return [this.x + this.width / 2, this.bottom];
  }
  get midleft() {
    return [this.left, this.y + this.height / 2];
  }
  get midright() {
    return [this.right, this.y + this.height / 2];
  }
  colliderect(other) {
    return this.left < other.right && this.right > other.left && this.top < other.bottom && this.bottom > other.top;
  }
  collidepoint(x, y) {
    return x >= this.left && x <= this.right && y >= this.top && y <= this.bottom;
  }
};
function resolveAssetPath(path) {
  if (path.startsWith("./") || path.startsWith("../")) {
    return assetPath(path);
  }
  return path;
}
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}
async function fetchJson(url) {
  const resolved = url.startsWith("http") ? url : assetPath(url);
  const res = await fetch(resolved);
  if (!res.ok) throw new Error(`Failed to fetch ${resolved}`);
  return res.json();
}
function deepCloneAnimation(anim) {
  if (!anim) return null;
  return {
    images: anim.images.slice(),
    timer: 0,
    index: 0,
    image: anim.images[0],
    idleSprite: anim.idleSprite,
    airSprite: anim.airSprite,
    deltaTime: anim.deltaTime,
    update() {
      this.timer += 1;
      if (this.timer % this.deltaTime === 0) {
        this.index = this.index < this.images.length - 1 ? this.index + 1 : 0;
      }
      this.image = this.images[this.index];
    },
    idle() {
      this.image = this.idleSprite;
    },
    inAir() {
      this.image = this.airSprite;
    }
  };
}

// super-mario-python-master/web/js/spritesheet.js
var Spritesheet = class _Spritesheet {
  constructor(sheet) {
    this.sheet = sheet;
  }
  static async fromUrl(filename) {
    const img = await loadImage(filename);
    return new _Spritesheet(img);
  }
  imageAt(x, y, scalingFactor, colorKey = null, ignoreTileSize = false, xTileSize = 16, yTileSize = 16) {
    const sx = ignoreTileSize ? x : x * xTileSize;
    const sy = ignoreTileSize ? y : y * yTileSize;
    const sw = xTileSize;
    const sh = yTileSize;
    const dw = xTileSize * scalingFactor;
    const dh = yTileSize * scalingFactor;
    const canvas2 = document.createElement("canvas");
    canvas2.width = dw;
    canvas2.height = dh;
    const ctx2 = canvas2.getContext("2d");
    ctx2.imageSmoothingEnabled = false;
    ctx2.drawImage(this.sheet, sx, sy, sw, sh, 0, 0, dw, dh);
    if (colorKey !== null) {
      this.applyColorKey(canvas2, colorKey);
    }
    return canvas2;
  }
  applyColorKey(canvas2, colorKey) {
    const ctx2 = canvas2.getContext("2d");
    const { width, height } = canvas2;
    const imageData = ctx2.getImageData(0, 0, width, height);
    const data = imageData.data;
    let keyR;
    let keyG;
    let keyB;
    if (colorKey === -1) {
      keyR = data[0];
      keyG = data[1];
      keyB = data[2];
    } else if (Array.isArray(colorKey)) {
      [keyR, keyG, keyB] = colorKey;
    } else {
      keyR = colorKey.r ?? 0;
      keyG = colorKey.g ?? 0;
      keyB = colorKey.b ?? 0;
    }
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] === keyR && data[i + 1] === keyG && data[i + 2] === keyB) {
        data[i + 3] = 0;
      }
    }
    ctx2.putImageData(imageData, 0, 0);
  }
};
var Sprite = class {
  constructor(image, colliding, animation = null, redrawBackground = false) {
    this.image = image;
    this.colliding = colliding;
    this.animation = animation;
    this.redrawBackground = redrawBackground;
  }
  drawSprite(x, y, ctx2) {
    const px = x * 32;
    const py = y * 32;
    if (!this.animation) {
      ctx2.drawImage(this.image, px, py);
    } else {
      this.animation.update();
      ctx2.drawImage(this.animation.image, px, py);
    }
  }
};

// super-mario-python-master/web/js/dashboard.js
var CHARS = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
var Font = class _Font {
  constructor(spritesheet) {
    this.spritesheet = spritesheet;
    this.charSprites = this.loadFont();
  }
  static async create() {
    const sheet = await Spritesheet.fromUrl(assetPath("img/font.png"));
    return new _Font(sheet);
  }
  loadFont() {
    const font = {};
    let row = 0;
    let charAt = 0;
    for (const char of CHARS) {
      if (charAt === 16) {
        charAt = 0;
        row += 1;
      }
      font[char] = this.spritesheet.imageAt(charAt, row, 2, [0, 0, 0], false, 8, 8);
      charAt += 1;
    }
    return font;
  }
  drawText(ctx2, text, x, y, size) {
    for (const char of text) {
      const charSprite = this.charSprites[char];
      if (charSprite) {
        ctx2.drawImage(charSprite, 0, 0, charSprite.width, charSprite.height, x, y, size, size);
      }
      x += char === " " ? size / 2 : size;
    }
  }
};
var Dashboard = class {
  constructor(font, ctx2) {
    this.font = font;
    this.state = "menu";
    this.ctx = ctx2;
    this.levelName = "";
    this.points = 0;
    this.coins = 0;
    this.ticks = 0;
    this.time = 0;
  }
  drawText(ctx2, text, x, y, size) {
    this.font.drawText(ctx2, text, x, y, size);
  }
  update() {
    this.drawText(this.ctx, "MARIO", 50, 20, 15);
    this.drawText(this.ctx, this.pointString(), 50, 37, 15);
    this.drawText(this.ctx, `@x${this.coinString()}`, 225, 37, 15);
    this.drawText(this.ctx, "WORLD", 380, 20, 15);
    this.drawText(this.ctx, String(this.levelName), 395, 37, 15);
    this.drawText(this.ctx, "TIME", 520, 20, 15);
    if (this.state !== "menu") {
      this.drawText(this.ctx, this.timeString(), 535, 37, 15);
    }
    this.ticks += 1;
    if (this.ticks === 60) {
      this.ticks = 0;
      this.time += 1;
    }
  }
  coinString() {
    return String(this.coins).padStart(2, "0");
  }
  pointString() {
    return String(this.points).padStart(6, "0");
  }
  timeString() {
    return String(this.time).padStart(3, "0");
  }
};

// super-mario-python-master/web/js/entities/entityBase.js
var EntityBase = class {
  constructor(x, y, gravity) {
    this.vel = new Vec2D();
    this.rect = new GameRect(x * 32, y * 32, 32, 32);
    this.gravity = gravity;
    this.traits = null;
    this.alive = true;
    this.active = true;
    this.bouncing = false;
    this.timeAfterDeath = 5;
    this.timer = 0;
    this.type = "";
    this.onGround = false;
    this.obeyGravity = true;
  }
  applyGravity() {
    if (this.obeyGravity) {
      this.vel.y += this.gravity;
    }
  }
  updateTraits() {
    if (!this.traits) return;
    for (const trait of Object.values(this.traits)) {
      trait.update?.();
    }
  }
  getPosIndex() {
    return new Vec2D(Math.floor(this.rect.x / 32), Math.floor(this.rect.y / 32));
  }
  getPosIndexAsFloat() {
    return new Vec2D(this.rect.x / 32, this.rect.y / 32);
  }
};

// super-mario-python-master/web/js/entities/coin.js
var Coin = class extends EntityBase {
  constructor(ctx2, spriteCollection, x, y, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx2;
    this.spriteCollection = spriteCollection;
    this.animation = deepCloneAnimation(spriteCollection.get("coin").animation);
    this.type = "Item";
  }
  update(cam) {
    if (this.alive) {
      this.animation.update();
      this.ctx.drawImage(this.animation.image, this.rect.x + cam.x, this.rect.y);
    }
  }
};

// super-mario-python-master/web/js/entities/item.js
var Item = class {
  constructor(collection, ctx2, x, y, dashboard2) {
    this.itemPos = new Vec2D(x, y);
    this.itemVel = new Vec2D(0, 0);
    this.ctx = ctx2;
    this.dashboard = dashboard2;
    this.coinAnimation = deepCloneAnimation(collection.get("coin-item").animation);
    this.soundPlayed = false;
  }
  spawnCoin(cam, sound2, dashboard2) {
    if (!this.soundPlayed) {
      this.soundPlayed = true;
      dashboard2.points += 100;
      sound2.playSfx("coin");
    }
    this.coinAnimation.update();
    if (this.coinAnimation.timer < 45) {
      if (this.coinAnimation.timer < 15) {
        this.itemVel.y -= 0.5;
        this.itemPos.y += this.itemVel.y;
      } else {
        this.itemVel.y += 0.5;
        this.itemPos.y += this.itemVel.y;
      }
      this.ctx.drawImage(
        this.coinAnimation.image,
        this.itemPos.x + cam.x,
        this.itemPos.y
      );
    } else if (this.coinAnimation.timer < 80) {
      this.itemVel.y = -0.75;
      this.itemPos.y += this.itemVel.y;
      this.dashboard.drawText(this.ctx, "100", this.itemPos.x + 3 + cam.x, this.itemPos.y, 8);
    }
  }
};

// super-mario-python-master/web/js/entities/coinBox.js
var CoinBox = class extends EntityBase {
  constructor(ctx2, spriteCollection, x, y, sound2, dashboard2, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx2;
    this.spriteCollection = spriteCollection;
    this.animation = deepCloneAnimation(spriteCollection.get("CoinBox").animation);
    this.type = "Block";
    this.triggered = false;
    this.time = 0;
    this.maxTime = 10;
    this.sound = sound2;
    this.dashboard = dashboard2;
    this.vel = 1;
    this.item = new Item(spriteCollection, ctx2, this.rect.x, this.rect.y, dashboard2);
  }
  update(cam) {
    if (this.alive && !this.triggered) {
      this.animation.update();
    } else {
      this.animation.image = this.spriteCollection.get("empty").image;
      this.item.spawnCoin(cam, this.sound, this.dashboard);
      if (this.time < this.maxTime) {
        this.time += 1;
        this.rect.y -= this.vel;
      } else if (this.time < this.maxTime * 2) {
        this.time += 1;
        this.rect.y += this.vel;
      }
    }
    this.ctx.drawImage(
      this.spriteCollection.get("sky").image,
      this.rect.x + cam.x,
      this.rect.y + 2
    );
    this.ctx.drawImage(this.animation.image, this.rect.x + cam.x, this.rect.y - 1);
  }
};

// super-mario-python-master/web/js/entities/coinBrick.js
var CoinBrick = class extends EntityBase {
  constructor(ctx2, spriteCollection, x, y, sound2, dashboard2, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx2;
    this.spriteCollection = spriteCollection;
    this.image = spriteCollection.get("bricks").image;
    this.type = "Block";
    this.triggered = false;
    this.sound = sound2;
    this.dashboard = dashboard2;
    this.item = new Item(spriteCollection, ctx2, this.rect.x, this.rect.y, dashboard2);
  }
  update(cam) {
    if (!this.alive || this.triggered) {
      this.image = this.spriteCollection.get("empty").image;
      this.item.spawnCoin(cam, this.sound, this.dashboard);
    }
    this.ctx.drawImage(
      this.spriteCollection.get("sky").image,
      this.rect.x + cam.x,
      this.rect.y + 2
    );
    this.ctx.drawImage(this.image, this.rect.x + cam.x, this.rect.y - 1);
  }
};

// super-mario-python-master/web/js/animation.js
var Animation = class {
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
};

// super-mario-python-master/web/js/collider.js
var CollisionState = class {
  constructor(isColliding, isTop) {
    this.isColliding = isColliding;
    this.isTop = isTop;
  }
};
var EntityCollider = class {
  constructor(entity) {
    this.entity = entity;
  }
  check(target) {
    if (this.entity.rect.colliderect(target.rect)) {
      return this.determineSide(target.rect, this.entity.rect);
    }
    return new CollisionState(false, false);
  }
  determineSide(rect1, rect2) {
    if (rect1.collidepoint(rect2.bottomleft[0], rect2.bottomleft[1]) || rect1.collidepoint(rect2.bottomright[0], rect2.bottomright[1]) || rect1.collidepoint(rect2.midbottom[0], rect2.midbottom[1])) {
      if (rect2.collidepoint(rect1.midleft[0] / 2, rect1.midleft[1] / 2) || rect2.collidepoint(rect1.midright[0] / 2, rect1.midright[1] / 2)) {
        return new CollisionState(true, false);
      }
      if (this.entity.vel.y > 0) {
        return new CollisionState(true, true);
      }
    }
    return new CollisionState(true, false);
  }
};
var Collider = class {
  constructor(entity, level2) {
    this.entity = entity;
    this.level = level2.level;
    this.levelObj = level2;
  }
  checkX() {
    if (this.leftLevelBorderReached() || this.rightLevelBorderReached()) return;
    try {
      const rows = [
        this.level[this.entity.getPosIndex().y],
        this.level[this.entity.getPosIndex().y + 1],
        this.level[this.entity.getPosIndex().y + 2]
      ];
      for (const row of rows) {
        const tiles = row.slice(this.entity.getPosIndex().x, this.entity.getPosIndex().x + 2);
        for (const tile of tiles) {
          if (tile?.rect && this.entity.rect.colliderect(tile.rect)) {
            if (this.entity.vel.x > 0) {
              this.entity.rect.right = tile.rect.left;
              this.entity.vel.x = 0;
            }
            if (this.entity.vel.x < 0) {
              this.entity.rect.left = tile.rect.right;
              this.entity.vel.x = 0;
            }
          }
        }
      }
    } catch {
    }
  }
  checkY() {
    this.entity.onGround = false;
    try {
      const rows = [
        this.level[this.entity.getPosIndex().y],
        this.level[this.entity.getPosIndex().y + 1],
        this.level[this.entity.getPosIndex().y + 2]
      ];
      for (const row of rows) {
        const tiles = row.slice(this.entity.getPosIndex().x, this.entity.getPosIndex().x + 2);
        for (const tile of tiles) {
          if (tile?.rect && this.entity.rect.colliderect(tile.rect)) {
            if (this.entity.vel.y > 0) {
              this.entity.onGround = true;
              this.entity.rect.bottom = tile.rect.top;
              this.entity.vel.y = 0;
              if (this.entity.traits) {
                this.entity.traits.jumpTrait?.reset();
                this.entity.traits.bounceTrait?.reset();
              }
            }
            if (this.entity.vel.y < 0) {
              this.entity.rect.top = tile.rect.bottom;
              this.entity.vel.y = 0;
            }
          }
        }
      }
    } catch {
      try {
        this.entity.gameOver?.();
      } catch {
        this.entity.alive = null;
      }
    }
  }
  rightLevelBorderReached() {
    if (this.entity.getPosIndexAsFloat().x > this.levelObj.levelLength - 1) {
      this.entity.rect.x = (this.levelObj.levelLength - 1) * 32;
      this.entity.vel.x = 0;
      return true;
    }
    return false;
  }
  leftLevelBorderReached() {
    if (this.entity.rect.x < 0) {
      this.entity.rect.x = 0;
      this.entity.vel.x = 0;
      return true;
    }
    return false;
  }
};

// super-mario-python-master/web/js/traits.js
var GoTrait = class {
  constructor(animation, ctx2, camera, ent) {
    this.animation = animation;
    this.direction = 0;
    this.heading = 1;
    this.accelVel = 0.32;
    this.decelVel = 0.18;
    this.maxVel = 3;
    this.ctx = ctx2;
    this.boost = false;
    this.camera = camera;
    this.entity = ent;
  }
  update() {
    if (this.boost) {
      this.maxVel = 5;
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
};
var JumpTrait = class {
  constructor(entity) {
    this.verticalSpeed = -12;
    this.jumpHeight = 120;
    this.entity = entity;
    this.initalHeight = 384;
    this.deaccelerationHeight = this.jumpHeight - this.verticalSpeed * this.verticalSpeed / (2 * this.entity.gravity);
  }
  jump(jumping) {
    if (jumping && this.entity.onGround) {
      this.entity.sound.playSfx("jump");
      this.entity.vel.y = this.verticalSpeed;
      this.entity.inAir = true;
      this.initalHeight = this.entity.rect.y;
      this.entity.inJump = true;
      this.entity.obeyGravity = false;
    }
    if (this.entity.inJump) {
      if (this.initalHeight - this.entity.rect.y >= this.deaccelerationHeight || this.entity.vel.y === 0) {
        this.entity.inJump = false;
        this.entity.obeyGravity = true;
      }
    }
  }
  reset() {
    this.entity.inAir = false;
  }
};
var BounceTrait = class {
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
};
var LeftRightWalkTrait = class {
  constructor(entity, level2) {
    this.direction = Math.random() < 0.5 ? -1 : 1;
    this.entity = entity;
    this.collDetection = new Collider(entity, level2);
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
};

// super-mario-python-master/web/js/entities/goomba.js
var Goomba = class extends EntityBase {
  constructor(ctx2, spriteColl, x, y, level2, sound2) {
    super(y, x - 1, 1.25);
    this.spriteCollection = spriteColl;
    this.animation = new Animation([
      spriteColl.get("goomba-1").image,
      spriteColl.get("goomba-2").image
    ]);
    this.ctx = ctx2;
    this.leftrightTrait = new LeftRightWalkTrait(this, level2);
    this.type = "Mob";
    this.dashboard = level2.dashboard;
    this.collision = new Collider(this, level2);
    this.entityCollider = new EntityCollider(this);
    this.levelObj = level2;
    this.sound = sound2;
    this.textPos = new Vec2D(0, 0);
  }
  update(camera) {
    if (this.alive) {
      this.applyGravity();
      this.drawGoomba(camera);
      this.leftrightTrait.update();
      this.checkEntityCollision();
    } else {
      this.onDead(camera);
    }
  }
  drawGoomba(camera) {
    this.ctx.drawImage(this.animation.image, this.rect.x + camera.x, this.rect.y);
    this.animation.update();
  }
  onDead(camera) {
    if (this.timer === 0) {
      this.setPointsTextStartPosition(this.rect.x + 3, this.rect.y);
    }
    if (this.timer < this.timeAfterDeath) {
      this.movePointsTextUpAndDraw(camera);
      this.drawFlatGoomba(camera);
    } else {
      this.alive = null;
    }
    this.timer += 0.1;
  }
  drawFlatGoomba(camera) {
    this.ctx.drawImage(
      this.spriteCollection.get("goomba-flat").image,
      this.rect.x + camera.x,
      this.rect.y
    );
  }
  setPointsTextStartPosition(x, y) {
    this.textPos = new Vec2D(x, y);
  }
  movePointsTextUpAndDraw(camera) {
    this.textPos.y -= 0.5;
    this.dashboard.drawText(this.ctx, "100", this.textPos.x + camera.x, this.textPos.y, 8);
  }
  checkEntityCollision() {
    for (const ent of this.levelObj.entityList) {
      const collisionState = this.entityCollider.check(ent);
      if (collisionState.isColliding && ent.type === "Mob" && ent.bouncing) {
        this.alive = false;
        this.sound.playSfx("brick_bump");
      }
    }
  }
};

// super-mario-python-master/web/js/entities/koopa.js
var Koopa = class extends EntityBase {
  constructor(ctx2, spriteColl, x, y, level2, sound2) {
    super(y - 1, x, 1.25);
    this.spriteCollection = spriteColl;
    this.animation = new Animation([
      spriteColl.get("koopa-1").image,
      spriteColl.get("koopa-2").image
    ]);
    this.ctx = ctx2;
    this.leftrightTrait = new LeftRightWalkTrait(this, level2);
    this.timer = 0;
    this.timeAfterDeath = 35;
    this.type = "Mob";
    this.dashboard = level2.dashboard;
    this.collision = new Collider(this, level2);
    this.entityCollider = new EntityCollider(this);
    this.levelObj = level2;
    this.sound = sound2;
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
    this.animation.image = this.spriteCollection.get("koopa-hiding").image;
    this.drawKoopa(camera);
    this.leftrightTrait.update();
  }
  sleepingInShell(camera) {
    if (this.timer < this.timeAfterDeath) {
      this.ctx.drawImage(
        this.spriteCollection.get("koopa-hiding").image,
        this.rect.x + camera.x,
        this.rect.y - 32
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
        if (collisionState.isColliding && ent.type === "Mob" && ent.bouncing) {
          this.alive = false;
          this.sound.playSfx("brick_bump");
        }
      }
    }
  }
};

// super-mario-python-master/web/js/entities/randomBox.js
var RandomBox = class extends EntityBase {
  constructor(ctx2, spriteCollection, x, y, item, sound2, dashboard2, level2, gravity = 0) {
    super(x, y, gravity);
    this.ctx = ctx2;
    this.spriteCollection = spriteCollection;
    this.animation = deepCloneAnimation(spriteCollection.get("CoinBox").animation);
    this.type = "Block";
    this.triggered = false;
    this.time = 0;
    this.maxTime = 10;
    this.sound = sound2;
    this.dashboard = dashboard2;
    this.vel = 1;
    this.item = item;
    this.level = level2;
  }
  update(cam) {
    if (this.alive && !this.triggered) {
      this.animation.update();
    } else {
      this.animation.image = this.spriteCollection.get("empty").image;
      if (this.item === "RedMushroom") {
        this.level.addRedMushroom(Math.floor(this.rect.y / 32) - 1, Math.floor(this.rect.x / 32));
        this.sound.playSfx("powerup_appear");
      }
      this.item = null;
      if (this.time < this.maxTime) {
        this.time += 1;
        this.rect.y -= this.vel;
      } else if (this.time < this.maxTime * 2) {
        this.time += 1;
        this.rect.y += this.vel;
      }
    }
    this.ctx.drawImage(
      this.spriteCollection.get("sky").image,
      this.rect.x + cam.x,
      this.rect.y + 2
    );
    this.ctx.drawImage(this.animation.image, this.rect.x + cam.x, this.rect.y - 1);
  }
};

// super-mario-python-master/web/js/entities/mushroom.js
var RedMushroom = class extends EntityBase {
  constructor(ctx2, spriteColl, x, y, level2, sound2) {
    super(y, x - 1, 1.25);
    this.spriteCollection = spriteColl;
    this.animation = new Animation([spriteColl.get("mushroom").image]);
    this.ctx = ctx2;
    this.leftrightTrait = new LeftRightWalkTrait(this, level2);
    this.type = "Mob";
    this.dashboard = level2.dashboard;
    this.collision = new Collider(this, level2);
    this.entityCollider = new EntityCollider(this);
    this.levelObj = level2;
    this.sound = sound2;
    this.textPos = new Vec2D(0, 0);
  }
  update(camera) {
    if (this.alive) {
      this.applyGravity();
      this.drawRedMushroom(camera);
      this.leftrightTrait.update();
    } else {
      this.onDead(camera);
    }
  }
  drawRedMushroom(camera) {
    this.ctx.drawImage(this.animation.image, this.rect.x + camera.x, this.rect.y);
    this.animation.update();
  }
  onDead(camera) {
    if (this.timer === 0) {
      this.setPointsTextStartPosition(this.rect.x + 3, this.rect.y);
    }
    if (this.timer < this.timeAfterDeath) {
      this.movePointsTextUpAndDraw(camera);
    } else {
      this.alive = null;
    }
    this.timer += 0.1;
  }
  setPointsTextStartPosition(x, y) {
    this.textPos = new Vec2D(x, y);
  }
  movePointsTextUpAndDraw(camera) {
    this.textPos.y -= 0.5;
    this.dashboard.drawText(this.ctx, "100", this.textPos.x + camera.x, this.textPos.y, 8);
  }
};

// super-mario-python-master/web/js/level.js
var Tile = class {
  constructor(sprite, rect) {
    this.sprite = sprite;
    this.rect = rect;
  }
};
var Level = class {
  constructor(ctx2, sound2, dashboard2, sprites2) {
    this.sprites = sprites2;
    this.dashboard = dashboard2;
    this.sound = sound2;
    this.ctx = ctx2;
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
    }
  }
  loadLayers(data) {
    const layers = [];
    for (let x = data.level.layers.sky.x[0]; x < data.level.layers.sky.x[1]; x += 1) {
      layers.push([
        ...Array.from(
          { length: data.level.layers.sky.y[1] - data.level.layers.sky.y[0] },
          () => new Tile(this.sprites.get("sky"), null)
        ),
        ...Array.from({ length: data.level.layers.ground.y[1] - data.level.layers.ground.y[0] }, (_, i) => {
          const y = data.level.layers.ground.y[0] + i;
          return new Tile(
            this.sprites.get("ground"),
            new GameRect(x * 32, (y - 1) * 32, 32, 32)
          );
        })
      ]);
    }
    this.level = layers[0].map((_, colIndex) => layers.map((row) => row[colIndex]));
  }
  loadObjects(data) {
    data.level.objects.bush?.forEach(([x, y]) => this.addBushSprite(x, y));
    data.level.objects.cloud?.forEach(([x, y]) => this.addCloudSprite(x, y));
    data.level.objects.pipe?.forEach(([x, y, z]) => this.addPipeSprite(x, y, z));
    data.level.objects.sky?.forEach(([x, y]) => {
      this.level[y][x] = new Tile(this.sprites.get("sky"), null);
    });
    data.level.objects.ground?.forEach(([x, y]) => {
      this.level[y][x] = new Tile(
        this.sprites.get("ground"),
        new GameRect(x * 32, y * 32, 32, 32)
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
                this.sprites.get("sky").image,
                (x + camera.pos.x) * 32,
                y * 32
              );
            }
            tile.sprite.drawSprite(x + camera.pos.x, y, this.ctx);
          }
        }
      }
      this.updateEntities(camera);
    } catch {
    }
  }
  addCloudSprite(x, y) {
    try {
      for (let yOff = 0; yOff < 2; yOff += 1) {
        for (let xOff = 0; xOff < 3; xOff += 1) {
          this.level[y + yOff][x + xOff] = new Tile(
            this.sprites.get(`cloud${yOff + 1}_${xOff + 1}`),
            null
          );
        }
      }
    } catch {
    }
  }
  addPipeSprite(x, y, length = 2) {
    try {
      this.level[y][x] = new Tile(
        this.sprites.get("pipeL"),
        new GameRect(x * 32, y * 32, 32, 32)
      );
      this.level[y][x + 1] = new Tile(
        this.sprites.get("pipeR"),
        new GameRect((x + 1) * 32, y * 32, 32, 32)
      );
      for (let i = 1; i < length + 20; i += 1) {
        this.level[y + i][x] = new Tile(
          this.sprites.get("pipe2L"),
          new GameRect(x * 32, (y + i) * 32, 32, 32)
        );
        this.level[y + i][x + 1] = new Tile(
          this.sprites.get("pipe2R"),
          new GameRect((x + 1) * 32, (y + i) * 32, 32, 32)
        );
      }
    } catch {
    }
  }
  addBushSprite(x, y) {
    try {
      this.level[y][x] = new Tile(this.sprites.get("bush_1"), null);
      this.level[y][x + 1] = new Tile(this.sprites.get("bush_2"), null);
      this.level[y][x + 2] = new Tile(this.sprites.get("bush_3"), null);
    } catch {
    }
  }
  addCoinBox(x, y) {
    this.level[y][x] = new Tile(null, new GameRect(x * 32, y * 32 - 1, 32, 32));
    this.entityList.push(
      new CoinBox(this.ctx, this.sprites, x, y, this.sound, this.dashboard)
    );
  }
  addRandomBox(x, y, item) {
    this.level[y][x] = new Tile(null, new GameRect(x * 32, y * 32 - 1, 32, 32));
    this.entityList.push(
      new RandomBox(this.ctx, this.sprites, x, y, item, this.sound, this.dashboard, this)
    );
  }
  addCoin(x, y) {
    this.entityList.push(new Coin(this.ctx, this.sprites, x, y));
  }
  addCoinBrick(x, y) {
    this.level[y][x] = new Tile(null, new GameRect(x * 32, y * 32 - 1, 32, 32));
    this.entityList.push(
      new CoinBrick(this.ctx, this.sprites, x, y, this.sound, this.dashboard)
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
      new RedMushroom(this.ctx, this.sprites, x, y, this, this.sound)
    );
  }
};

// super-mario-python-master/web/js/camera.js
var Camera = class {
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
};

// super-mario-python-master/web/js/input.js
var Input = class {
  constructor(entity) {
    this.entity = entity;
    this.keys = {};
    this.mouseEvents = [];
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      this.handleKeyDown(e);
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.code] = false;
    });
    window.addEventListener("mouseup", (e) => {
      this.mouseEvents.push({ button: e.button, type: "mouseup" });
    });
    window.addEventListener("mousemove", (e) => {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });
  }
  handleKeyDown(e) {
    if (e.code === "Escape" || e.code === "F5") {
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
    const canvas2 = this.entity.ctx.canvas;
    const rect = canvas2.getBoundingClientRect();
    const scaleX = canvas2.width / rect.width;
    const scaleY = canvas2.height / rect.height;
    for (const e of this.mouseEvents) {
      if (e.type !== "mouseup") continue;
      const mouseX = (this.lastMouseX - rect.left) * scaleX;
      const mouseY = (this.lastMouseY - rect.top) * scaleY;
      if (e.button === 2) {
        this.entity.levelObj.addKoopa(
          mouseY / 32,
          mouseX / 32 - this.entity.camera.pos.x
        );
        this.entity.levelObj.addGoomba(
          mouseY / 32,
          mouseX / 32 - this.entity.camera.pos.x
        );
        this.entity.levelObj.addRedMushroom(
          mouseY / 32,
          mouseX / 32 - this.entity.camera.pos.x
        );
      }
      if (e.button === 0) {
        this.entity.levelObj.addCoin(
          mouseX / 32 - this.entity.camera.pos.x,
          mouseY / 32
        );
      }
    }
  }
};

// super-mario-python-master/web/js/pause.js
var Pause = class {
  constructor(ctx2, entity, dashboard2) {
    this.ctx = ctx2;
    this.entity = entity;
    this.dashboard = dashboard2;
    this.state = 0;
    this.pauseSurface = null;
    this.spritesheet = null;
    this.dot = null;
    this.grayDot = null;
    this.initSprites();
  }
  async initSprites() {
    this.spritesheet = await Spritesheet.fromUrl(assetPath("img/title_screen.png"));
    this.dot = this.spritesheet.imageAt(0, 150, 2, [255, 0, 220], true);
    this.grayDot = this.spritesheet.imageAt(20, 150, 2, [255, 0, 220], true);
  }
  createBackgroundBlur() {
    const canvas2 = document.createElement("canvas");
    canvas2.width = 640;
    canvas2.height = 480;
    const ctx2 = canvas2.getContext("2d");
    ctx2.filter = "blur(4px)";
    ctx2.drawImage(this.ctx.canvas, 0, 0);
    ctx2.filter = "none";
    this.pauseSurface = canvas2;
  }
  update() {
    if (this.pauseSurface) {
      this.ctx.drawImage(this.pauseSurface, 0, 0);
    }
    this.dashboard.drawText(this.ctx, "PAUSED", 120, 160, 68);
    this.dashboard.drawText(this.ctx, "CONTINUE", 150, 280, 32);
    this.dashboard.drawText(this.ctx, "BACK TO MENU", 150, 320, 32);
    this.drawDot();
    this.checkInput();
  }
  drawDot() {
    if (!this.dot) return;
    if (this.state === 0) {
      this.ctx.drawImage(this.dot, 100, 275);
      this.ctx.drawImage(this.grayDot, 100, 315);
    } else {
      this.ctx.drawImage(this.dot, 100, 315);
      this.ctx.drawImage(this.grayDot, 100, 275);
    }
  }
  checkInput() {
  }
  handleKey(code) {
    if (code === "Enter") {
      if (this.state === 0) {
        this.entity.pause = false;
      } else {
        this.entity.restart = true;
      }
    } else if (code === "ArrowUp" || code === "KeyK") {
      if (this.state > 0) this.state -= 1;
    } else if (code === "ArrowDown" || code === "KeyJ") {
      if (this.state < 1) this.state += 1;
    }
  }
};

// super-mario-python-master/web/js/mario.js
var Mario = class extends EntityBase {
  constructor(x, y, level2, ctx2, dashboard2, sound2, sprites2) {
    super(x, y, 0.8);
    const get = (name) => sprites2.get(name);
    const smallAnimation = new Animation(
      [get("mario_run1").image, get("mario_run2").image, get("mario_run3").image],
      get("mario_idle").image,
      get("mario_jump").image
    );
    const bigAnimation = new Animation(
      [get("mario_big_run1").image, get("mario_big_run2").image, get("mario_big_run3").image],
      get("mario_big_idle").image,
      get("mario_big_jump").image
    );
    this.smallAnimation = smallAnimation;
    this.bigAnimation = bigAnimation;
    this.camera = new Camera(this.rect, this);
    this.sound = sound2;
    this.input = new Input(this);
    this.inAir = false;
    this.inJump = false;
    this.powerUpState = 0;
    this.invincibilityFrames = 0;
    this.traits = {
      jumpTrait: new JumpTrait(this),
      goTrait: new GoTrait(smallAnimation, ctx2, this.camera, this),
      bounceTrait: new BounceTrait(this)
    };
    this.levelObj = level2;
    this.collision = new Collider(this, level2);
    this.ctx = ctx2;
    this.entityCollider = new EntityCollider(this);
    this.dashboard = dashboard2;
    this.restart = false;
    this.pause = false;
    this.pauseObj = new Pause(ctx2, this, dashboard2);
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
      if (ent.type === "Item") {
        this.onCollisionWithItem(ent);
      } else if (ent.type === "Block") {
        this.onCollisionWithBlock(ent);
      } else if (ent.type === "Mob") {
        this.onCollisionWithMob(ent, collisionState);
      }
    }
  }
  onCollisionWithItem(item) {
    const idx = this.levelObj.entityList.indexOf(item);
    if (idx !== -1) this.levelObj.entityList.splice(idx, 1);
    this.dashboard.points += 100;
    this.dashboard.coins += 1;
    this.sound.playSfx("coin");
  }
  onCollisionWithBlock(block) {
    if (!block.triggered) {
      this.dashboard.coins += 1;
      this.sound.playSfx("bump");
    }
    block.triggered = true;
  }
  onCollisionWithMob(mob, collisionState) {
    if (mob instanceof RedMushroom && mob.alive) {
      this.powerup(1);
      this.killEntity(mob);
      this.sound.playSfx("powerup");
    } else if (collisionState.isTop && (mob.alive || mob.bouncing)) {
      this.sound.playSfx("stomp");
      this.rect.bottom = mob.rect.top;
      this.bounce();
      this.killEntity(mob);
    } else if (collisionState.isTop && mob.alive && !mob.active) {
      this.sound.playSfx("stomp");
      this.rect.bottom = mob.rect.top;
      mob.timer = 0;
      this.bounce();
      mob.alive = false;
    } else if (collisionState.isColliding && mob.alive && !mob.active && !mob.bouncing) {
      mob.bouncing = true;
      if (mob.rect.x < this.rect.x) {
        mob.leftrightTrait.direction = -1;
        mob.rect.x -= 5;
        this.sound.playSfx("kick");
      } else {
        mob.rect.x += 5;
        mob.leftrightTrait.direction = 1;
        this.sound.playSfx("kick");
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
        this.sound.playSfx("pipe");
      }
    }
  }
  bounce() {
    this.traits.bounceTrait.jump = true;
  }
  killEntity(ent) {
    if (ent.constructor.name !== "Koopa") {
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
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, 640, 480);
      this.ctx.globalAlpha = 1;
      this.ctx.beginPath();
      this.ctx.arc(
        this.camera.x + this.rect.x + 16,
        this.rect.y + 16,
        this.gameOverRadius,
        0,
        Math.PI * 2
      );
      this.ctx.fillStyle = "#fff";
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
};

// super-mario-python-master/web/js/menu.js
var LEVEL_NAMES = ["Level1-1", "Level1-2"];
var Menu = class {
  constructor(ctx2, dashboard2, level2, sound2) {
    this.ctx = ctx2;
    this.sound = sound2;
    this.start = false;
    this.inSettings = false;
    this.state = 0;
    this.level = level2;
    this.music = true;
    this.sfx = true;
    this.currSelectedLevel = 1;
    this.levelNames = LEVEL_NAMES;
    this.inChoosingLevel = false;
    this.dashboard = dashboard2;
    this.levelCount = LEVEL_NAMES.length;
    this.menuBanner = null;
    this.menuDot = null;
    this.menuDot2 = null;
    this.initSprites();
    this.loadSettings();
  }
  async initSprites() {
    const spritesheet = await Spritesheet.fromUrl(assetPath("img/title_screen.png"));
    this.menuBanner = spritesheet.imageAt(0, 60, 2, [255, 0, 220], true, 180, 88);
    this.menuDot = spritesheet.imageAt(0, 150, 2, [255, 0, 220], true);
    this.menuDot2 = spritesheet.imageAt(20, 150, 2, [255, 0, 220], true);
  }
  loadSettings() {
    try {
      const data = JSON.parse(localStorage.getItem("marioSettings") || "{}");
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
    localStorage.setItem("marioSettings", JSON.stringify({ sound: this.music, sfx: this.sfx }));
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
    this.dashboard.drawText(this.ctx, "CHOOSE LEVEL", 180, 280, 24);
    this.dashboard.drawText(this.ctx, "SETTINGS", 180, 320, 24);
    this.dashboard.drawText(this.ctx, "EXIT", 180, 360, 24);
  }
  drawMenuBackground(withBanner = true) {
    const sky = this.level.sprites.get("sky").image;
    const ground = this.level.sprites.get("ground").image;
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
    this.ctx.drawImage(this.level.sprites.get("mario_idle").image, 2 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get("bush_1").image, 14 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get("bush_2").image, 15 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get("bush_2").image, 16 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get("bush_2").image, 17 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get("bush_3").image, 18 * 32, 12 * 32);
    this.ctx.drawImage(this.level.sprites.get("goomba-1").image, 18.5 * 32, 12 * 32);
  }
  drawSettings() {
    this.drawDot();
    this.dashboard.drawText(this.ctx, "MUSIC", 180, 280, 24);
    this.dashboard.drawText(this.ctx, this.music ? "ON" : "OFF", 340, 280, 24);
    this.dashboard.drawText(this.ctx, "SFX", 180, 320, 24);
    this.dashboard.drawText(this.ctx, this.sfx ? "ON" : "OFF", 340, 320, 24);
    this.dashboard.drawText(this.ctx, "BACK", 180, 360, 24);
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
      const color = this.currSelectedLevel === i + 1 ? "#ffffff" : "#969696";
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
    if (code === "Escape") {
      if (this.inChoosingLevel || this.inSettings) {
        this.inChoosingLevel = false;
        this.inSettings = false;
        this.state = 0;
      }
      return;
    }
    if (code === "ArrowUp" || code === "KeyK") {
      if (this.inChoosingLevel && this.currSelectedLevel > 3) {
        this.currSelectedLevel -= 3;
        this.drawLevelChooser();
      } else if (this.state > 0) {
        this.state -= 1;
      }
    } else if (code === "ArrowDown" || code === "KeyJ") {
      if (this.inChoosingLevel && this.currSelectedLevel + 3 <= this.levelCount) {
        this.currSelectedLevel += 3;
        this.drawLevelChooser();
      } else if (this.state < 2) {
        this.state += 1;
      }
    } else if (code === "ArrowLeft" || code === "KeyH") {
      if (this.inChoosingLevel && this.currSelectedLevel > 1) {
        this.currSelectedLevel -= 1;
        this.drawLevelChooser();
      }
    } else if (code === "ArrowRight" || code === "KeyL") {
      if (this.inChoosingLevel && this.currSelectedLevel < this.levelCount) {
        this.currSelectedLevel += 1;
        this.drawLevelChooser();
      }
    } else if (code === "Enter") {
      if (this.inChoosingLevel) {
        this.inChoosingLevel = false;
        this.dashboard.state = "start";
        this.dashboard.time = 0;
        const levelName = this.levelNames[this.currSelectedLevel - 1];
        this.level.loadLevel(levelName).then(() => {
          this.dashboard.levelName = levelName.split("Level")[1];
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
};

// super-mario-python-master/web/js/sound.js
var Sound = class {
  constructor() {
    this.allowSFX = true;
    this.musicVolume = 0.2;
    this.sfxVolume = 0.2;
    this.musicPlaying = false;
    this.soundtrack = new Audio(assetPath("sfx/main_theme.ogg"));
    this.soundtrack.loop = true;
    this.soundtrack.volume = this.musicVolume;
    this.sfx = {
      coin: assetPath("sfx/coin.ogg"),
      bump: assetPath("sfx/bump.ogg"),
      stomp: assetPath("sfx/stomp.ogg"),
      jump: assetPath("sfx/small_jump.ogg"),
      death: assetPath("sfx/death.wav"),
      kick: assetPath("sfx/kick.ogg"),
      brick_bump: assetPath("sfx/brick-bump.ogg"),
      powerup: assetPath("sfx/powerup.ogg"),
      powerup_appear: assetPath("sfx/powerup_appears.ogg"),
      pipe: assetPath("sfx/pipe.ogg")
    };
  }
  playMusic() {
    this.musicPlaying = true;
    this.soundtrack.currentTime = 0;
    this.soundtrack.play().catch(() => {
    });
  }
  stopMusic() {
    this.musicPlaying = false;
    this.soundtrack.pause();
  }
  playSfx(key) {
    if (!this.allowSFX) return;
    const audio = new Audio(this.sfx[key]);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {
    });
  }
  playDeath() {
    this.stopMusic();
    const audio = new Audio(this.sfx.death);
    audio.volume = this.sfxVolume;
    audio.play().catch(() => {
    });
    return audio;
  }
};

// super-mario-python-master/web/js/sprites.js
var SPRITE_FILES = [
  "sprites/Mario.json",
  "sprites/Goomba.json",
  "sprites/Koopa.json",
  "sprites/Animations.json",
  "sprites/BackgroundSprites.json",
  "sprites/ItemAnimations.json",
  "sprites/RedMushroom.json"
];
var Sprites = class _Sprites {
  constructor() {
    this.spriteCollection = {};
  }
  static async load() {
    const sprites2 = new _Sprites();
    sprites2.spriteCollection = await sprites2.loadSprites(SPRITE_FILES);
    return sprites2;
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
      if (data.type === "background") {
        for (const sprite of data.sprites) {
          const colorkey = sprite.colorKey ?? null;
          dic[sprite.name] = new Sprite(
            mySpritesheet.imageAt(sprite.x, sprite.y, sprite.scalefactor, colorkey),
            sprite.collision,
            null,
            sprite.redrawBg
          );
        }
        Object.assign(resDict, dic);
      } else if (data.type === "animation") {
        for (const sprite of data.sprites) {
          const images = sprite.images.map(
            (image) => mySpritesheet.imageAt(image.x, image.y, image.scale, sprite.colorKey)
          );
          dic[sprite.name] = new Sprite(
            null,
            null,
            new Animation(images, null, null, sprite.deltaTime)
          );
        }
        Object.assign(resDict, dic);
      } else if (data.type === "character" || data.type === "item") {
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
              ySize
            ),
            sprite.collision
          );
        }
        Object.assign(resDict, dic);
      }
    }
    return resDict;
  }
};

// super-mario-python-master/web/js/main.js
var canvas;
var ctx;
var loadingEl;
var fpsEl;
var menu;
var mario;
var level;
var dashboard;
var sound;
var sprites;
var lastTime = 0;
var frameCount = 0;
var fpsTimer = 0;
var accumulator = 0;
var FIXED_DT = 1e3 / 60;
function setLoadingMessage(msg) {
  if (loadingEl) loadingEl.textContent = msg;
}
async function boot() {
  canvas = document.getElementById("game");
  loadingEl = document.getElementById("loading");
  fpsEl = document.getElementById("fps");
  if (!canvas || !loadingEl) {
    throw new Error("Game canvas or loading element not found in page.");
  }
  ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  if (window.location.protocol === "file:") {
    loadingEl.innerHTML = "Cannot load from a local file.<br><br>Run a local server:<br><code>python -m http.server 8080</code><br><br>Then open <code>http://localhost:8080/web/</code>";
    return;
  }
  setLoadingMessage("Loading sprites...");
  sprites = await Sprites.load();
  setLoadingMessage("Loading font...");
  const font = await Font.create();
  setLoadingMessage("Starting game...");
  sound = new Sound();
  dashboard = new Dashboard(font, ctx);
  level = new Level(ctx, sound, dashboard, sprites);
  menu = new Menu(ctx, dashboard, level, sound);
  menu.onStart = () => {
    mario = new Mario(0, 0, level, ctx, dashboard, sound, sprites);
  };
  window.addEventListener("keydown", (e) => {
    if (!menu.start) {
      menu.handleKey(e.code);
    } else if (mario?.pause) {
      mario.pauseObj.handleKey(e.code);
    } else if (e.code === "KeyR" && mario) {
      const levelName = menu.levelNames[menu.currSelectedLevel - 1];
      dashboard.points = 0;
      dashboard.coins = 0;
      dashboard.time = 0;
      dashboard.ticks = 0;
      dashboard.state = "start";
      level.loadLevel(levelName).then(() => {
        mario = new Mario(0, 0, level, ctx, dashboard, sound, sprites);
      });
    }
  });
  canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  loadingEl.style.display = "none";
  requestAnimationFrame(gameLoop);
}
function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let delta = Math.min(timestamp - lastTime, 100);
  lastTime = timestamp;
  accumulator += delta;
  while (accumulator >= FIXED_DT) {
    update();
    frameCount += 1;
    accumulator -= FIXED_DT;
  }
  fpsTimer += delta;
  if (fpsTimer >= 1e3) {
    fpsEl.textContent = `FPS: ${frameCount}`;
    frameCount = 0;
    fpsTimer = 0;
  }
  requestAnimationFrame(gameLoop);
}
function update() {
  ctx.clearRect(0, 0, WINDOW_W, WINDOW_H);
  if (!menu.start) {
    menu.update();
    return;
  }
  if (mario.restart) {
    menu.start = false;
    menu.inChoosingLevel = false;
    menu.inSettings = false;
    menu.state = 0;
    mario = null;
    dashboard.points = 0;
    dashboard.coins = 0;
    dashboard.time = 0;
    dashboard.ticks = 0;
    dashboard.state = "menu";
    return;
  }
  if (mario.pause) {
    mario.pauseObj.update();
    return;
  }
  if (mario.gameOverActive) {
    level.drawLevel(mario.camera);
    dashboard.update();
    mario.updateGameOver();
    mario.input.checkForInput();
    return;
  }
  level.drawLevel(mario.camera);
  dashboard.update();
  mario.update();
}
async function probeAssets() {
  const probe = assetPath("sprites/Mario.json");
  const res = await fetch(probe);
  if (!res.ok) {
    throw new Error(`Asset probe failed (${res.status}): ${probe}`);
  }
}
export {
  boot,
  probeAssets,
  setLoadingMessage
};
