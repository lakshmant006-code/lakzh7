export class CollisionState {
  constructor(isColliding, isTop) {
    this.isColliding = isColliding;
    this.isTop = isTop;
  }
}

export class EntityCollider {
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
    if (
      rect1.collidepoint(rect2.bottomleft[0], rect2.bottomleft[1]) ||
      rect1.collidepoint(rect2.bottomright[0], rect2.bottomright[1]) ||
      rect1.collidepoint(rect2.midbottom[0], rect2.midbottom[1])
    ) {
      if (
        rect2.collidepoint(rect1.midleft[0] / 2, rect1.midleft[1] / 2) ||
        rect2.collidepoint(rect1.midright[0] / 2, rect1.midright[1] / 2)
      ) {
        return new CollisionState(true, false);
      }
      if (this.entity.vel.y > 0) {
        return new CollisionState(true, true);
      }
    }
    return new CollisionState(true, false);
  }
}

export class Collider {
  constructor(entity, level) {
    this.entity = entity;
    this.level = level.level;
    this.levelObj = level;
  }

  checkX() {
    if (this.leftLevelBorderReached() || this.rightLevelBorderReached()) return;

    try {
      const rows = [
        this.level[this.entity.getPosIndex().y],
        this.level[this.entity.getPosIndex().y + 1],
        this.level[this.entity.getPosIndex().y + 2],
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
      // out of bounds
    }
  }

  checkY() {
    this.entity.onGround = false;

    try {
      const rows = [
        this.level[this.entity.getPosIndex().y],
        this.level[this.entity.getPosIndex().y + 1],
        this.level[this.entity.getPosIndex().y + 2],
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
}
