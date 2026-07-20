import React, { useCallback, useEffect, useRef, useState } from "react";
import "./MarioGame.css";

const TILE = 32;
const GRAVITY = 0.65;
const JUMP_VELOCITY = -12.5;
const BOUNCE_VELOCITY = -7;
const MOVE_SPEED = 2.6;
const MAX_FALL = 14;
const CHUNK_WIDTH = TILE * 16;
const SPEED_UP_SCORE = 800;
const SPEED_UP_MULTIPLIER = 1.5;
const MORE_OBSTACLES_SCORE = 300;
const MARIO_W = 26;
const MARIO_H = 30;
const GOOMBA_W = 28;
const GOOMBA_H = 26;
const COIN_SIZE = 20;
const SQUISH_FRAMES = 14;
const SPIKE_W = TILE * 2;
const SPIKE_H = 18;

const ASSET_BASE = "/mario/";
const SPRITES = {
  marioIdle: ASSET_BASE + "mario-idle.png",
  marioRun1: ASSET_BASE + "mario-run1.png",
  marioRun2: ASSET_BASE + "mario-run2.png",
  marioRun3: ASSET_BASE + "mario-run3.png",
  marioJump: ASSET_BASE + "mario-jump.png",
  goomba1: ASSET_BASE + "goomba-1.png",
  goomba2: ASSET_BASE + "goomba-2.png",
  brick: ASSET_BASE + "tile-brick.png",
  coin: ASSET_BASE + "coin.png",
};

const KEY_MAP = {
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
  ArrowUp: "jump",
  w: "jump",
  W: "jump",
  " ": "jump",
  Spacebar: "jump",
};

function createLevel(groundY) {
  const goombaDefs = [
    [260, 200, 360],
    [900, 820, 1020],
    [1320, 1240, 1440],
    [1750, 1680, 1860],
  ];
  const goombas = goombaDefs.map(([x, minX, maxX]) => ({
    x,
    minX,
    maxX,
    y: groundY - GOOMBA_H,
    vx: 1.1,
    alive: true,
    squish: 0,
    animTimer: 0,
    animFrame: 0,
  }));

  const coinDefs = [
    [150, 50],
    [630, 50],
    [1080, 50],
    [1480, 50],
    [1850, 50],
    [1900, 50],
    [470, 56 + 22],
    [505, 56 + 22],
    [540, 56 + 22],
    [850, 80 + 22],
    [885, 80 + 22],
    [1260, 56 + 22],
    [1295, 56 + 22],
    [1330, 56 + 22],
    [1640, 68 + 22],
    [1675, 68 + 22],
  ];
  const coins = coinDefs.map(([x, hOff]) => ({
    x,
    y: groundY - hOff,
    collected: false,
  }));

  return { goombas, coins, spikes: [] };
}

function generateChunk(startX, groundY, scoreVal) {
  const goombas = [];
  const coins = [];
  const spikes = [];
  const hardMode = scoreVal >= MORE_OBSTACLES_SCORE;

  if (hardMode && Math.random() < 0.45) {
    spikes.push({
      x: startX + 220 + Math.random() * (CHUNK_WIDTH - 320),
      y: groundY - SPIKE_H,
      w: SPIKE_W,
      h: SPIKE_H,
    });
  }

  if (Math.random() < 0.7) {
    const hOff = [56, 68, 80][Math.floor(Math.random() * 3)];
    const clusterX = startX + 140;
    const coinCount = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < coinCount; i++) {
      coins.push({
        x: clusterX + 16 + i * 32,
        y: groundY - hOff - 22,
        collected: false,
      });
    }
  }

  if (Math.random() < 0.55) {
    coins.push({
      x: startX + 60 + Math.random() * (CHUNK_WIDTH - 120),
      y: groundY - 50,
      collected: false,
    });
  }

  const goombaChance = hardMode ? 0.95 : 0.85;
  if (Math.random() < goombaChance) {
    // Past MORE_OBSTACLES_SCORE, chunks have a chance to split into two
    // patrol lanes so two Goombas can occupy the same chunk for extra
    // challenge, instead of always just the one.
    if (hardMode && Math.random() < 0.5) {
      const midX = startX + CHUNK_WIDTH / 2;
      const lanes = [
        { minX: startX + 60, maxX: midX - 20 },
        { minX: midX + 20, maxX: startX + CHUNK_WIDTH - 60 },
      ];
      lanes.forEach((lane) => {
        goombas.push({
          x: (lane.minX + lane.maxX) / 2,
          minX: lane.minX,
          maxX: lane.maxX,
          y: groundY - GOOMBA_H,
          vx: 1.1 + Math.random() * 0.4,
          alive: true,
          squish: 0,
          animTimer: 0,
          animFrame: 0,
        });
      });
    } else {
      const minX = startX + 60;
      const maxX = startX + CHUNK_WIDTH - 60;
      goombas.push({
        x: (minX + maxX) / 2,
        minX,
        maxX,
        y: groundY - GOOMBA_H,
        vx: 1.1,
        alive: true,
        squish: 0,
        animTimer: 0,
        animFrame: 0,
      });
    }
  }

  return { goombas, coins, spikes };
}

function createMario(groundY) {
  return {
    x: 40,
    y: groundY - MARIO_H,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: true,
    animTimer: 0,
    animFrame: 0,
    state: "idle",
  };
}

function drawCloud(ctx, x, y) {
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.ellipse(x, y, 18, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 14, y - 4, 14, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 14, y + 2, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawSpikes(ctx, x, y, w, h) {
  const teeth = Math.max(2, Math.round(w / 16));
  const toothW = w / teeth;
  ctx.fillStyle = "#6b6b6b";
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  for (let i = 0; i < teeth; i++) {
    ctx.lineTo(x + i * toothW + toothW / 2, y);
    ctx.lineTo(x + (i + 1) * toothW, y + h);
  }
  ctx.closePath();
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const CLOUD_SPOTS = [
  [60, 24],
  [260, 16],
  [520, 30],
  [820, 20],
  [1150, 28],
  [1500, 18],
  [1820, 26],
];
const CLOUD_PERIOD = 2200;

const MarioGame = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const inputRef = useRef({
    left: false,
    right: false,
    jumpHeld: false,
    jumpQueued: false,
  });
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [gameStatus, setGameStatus] = useState("playing");
  const [deathCause, setDeathCause] = useState(null);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const images = {};
    let loadedCount = 0;
    const total = Object.keys(SPRITES).length;
    let imagesReady = false;
    Object.entries(SPRITES).forEach(([key, src]) => {
      const img = new Image();
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === total) imagesReady = true;
      };
      img.src = src;
      images[key] = img;
    });

    let width = container.clientWidth;
    let height = container.clientHeight;
    let groundY = height - TILE;
    let { goombas, coins, spikes } = createLevel(groundY);
    let mario = createMario(groundY);
    let camera = 0;
    let generatedUpTo = 2048;
    let scoreVal = 0;
    let hintDismissed = false;
    let status = "playing";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = container.clientWidth;
      height = container.clientHeight || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      const newGroundY = height - TILE;
      const dy = newGroundY - groundY;
      if (dy !== 0) {
        mario.y += dy;
        goombas.forEach((g) => {
          g.y += dy;
        });
        coins.forEach((c) => {
          c.y += dy;
        });
        groundY = newGroundY;
      }
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0 },
    );
    io.observe(container);

    const input = inputRef.current;

    function update(dt) {
      dt *= scoreVal >= SPEED_UP_SCORE ? SPEED_UP_MULTIPLIER : 1;

      const jumpPressed = input.jumpQueued;
      input.jumpQueued = false;

      if (input.left && !input.right) {
        mario.vx = -MOVE_SPEED;
        mario.facing = -1;
      } else if (input.right && !input.left) {
        mario.vx = MOVE_SPEED;
        mario.facing = 1;
      } else {
        mario.vx = 0;
      }

      if (jumpPressed && mario.onGround) {
        mario.vy = JUMP_VELOCITY;
        mario.onGround = false;
      }

      mario.vy = Math.min(mario.vy + GRAVITY * dt, MAX_FALL);

      mario.x += mario.vx * dt;
      mario.x = Math.max(0, mario.x);

      // Endless level: keep building chunks ahead of Mario forever
      const lookahead = width + CHUNK_WIDTH * 2;
      while (generatedUpTo < mario.x + lookahead) {
        const chunk = generateChunk(generatedUpTo, groundY, scoreVal);
        goombas.push(...chunk.goombas);
        coins.push(...chunk.coins);
        spikes.push(...chunk.spikes);
        generatedUpTo += CHUNK_WIDTH;
      }

      mario.y += mario.vy * dt;
      mario.onGround = false;
      if (mario.y < 0) {
        mario.y = 0;
        mario.vy = 0;
      }

      // Ground is an infinite plane rather than a platform entry, since the
      // level scrolls forever and a finite ground platform would need
      // regenerating/extending right along with everything else.
      if (mario.y + MARIO_H > groundY) {
        mario.y = groundY - MARIO_H;
        mario.vy = 0;
        mario.onGround = true;
      }

      if (!mario.onGround) {
        mario.state = "jump";
      } else if (mario.vx !== 0) {
        mario.state = "run";
        mario.animTimer += dt;
        if (mario.animTimer > 6) {
          mario.animTimer = 0;
          mario.animFrame = (mario.animFrame + 1) % 3;
        }
      } else {
        mario.state = "idle";
        mario.animFrame = 0;
      }

      const targetCam = mario.x - width * 0.4;
      camera = Math.max(0, targetCam);

      // Drop anything that's scrolled well behind the camera so the
      // entity arrays stay bounded over an endless play session.
      const pruneCutoff = camera - width;
      for (let i = goombas.length - 1; i >= 0; i--) {
        if (goombas[i].x + GOOMBA_W < pruneCutoff) goombas.splice(i, 1);
      }
      for (let i = coins.length - 1; i >= 0; i--) {
        if (coins[i].x + COIN_SIZE < pruneCutoff) coins.splice(i, 1);
      }
      for (let i = spikes.length - 1; i >= 0; i--) {
        if (spikes[i].x + spikes[i].w < pruneCutoff) spikes.splice(i, 1);
      }

      for (const s of spikes) {
        const overlapX = mario.x < s.x + s.w && mario.x + MARIO_W > s.x;
        const overlapY = mario.y < s.y + s.h && mario.y + MARIO_H > s.y;
        if (overlapX && overlapY) {
          status = "lost";
          setGameStatus("lost");
          setDeathCause("spike");
          break;
        }
      }

      for (const g of goombas) {
        if (!g.alive) {
          g.squish -= dt;
          continue;
        }
        g.x += g.vx * dt;
        if (g.x < g.minX || g.x + GOOMBA_W > g.maxX) {
          g.vx *= -1;
          g.x = Math.max(g.minX, Math.min(g.x, g.maxX - GOOMBA_W));
        }
        g.animTimer += dt;
        if (g.animTimer > 10) {
          g.animTimer = 0;
          g.animFrame = (g.animFrame + 1) % 2;
        }

        const overlapX = mario.x < g.x + GOOMBA_W && mario.x + MARIO_W > g.x;
        const overlapY = mario.y < g.y + GOOMBA_H && mario.y + MARIO_H > g.y;
        if (overlapX && overlapY) {
          const fallingOnTop =
            mario.vy > 0 && mario.y + MARIO_H - g.y < GOOMBA_H * 0.6;
          if (fallingOnTop) {
            g.alive = false;
            g.squish = SQUISH_FRAMES;
            mario.vy = BOUNCE_VELOCITY;
            scoreVal += 100;
            setScore(scoreVal);
          } else {
            status = "lost";
            setGameStatus("lost");
            setDeathCause("goomba");
            break;
          }
        }
      }
      for (let i = goombas.length - 1; i >= 0; i--) {
        if (!goombas[i].alive && goombas[i].squish <= 0) goombas.splice(i, 1);
      }

      for (const c of coins) {
        if (c.collected) continue;
        const overlapX = mario.x < c.x + COIN_SIZE && mario.x + MARIO_W > c.x;
        const overlapY = mario.y < c.y + COIN_SIZE && mario.y + MARIO_H > c.y;
        if (overlapX && overlapY) {
          c.collected = true;
          scoreVal += 10;
          setScore(scoreVal);
        }
      }

      if (!hintDismissed && (jumpPressed || input.left || input.right)) {
        hintDismissed = true;
        setShowHint(false);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#5c94fc");
      grad.addColorStop(1, "#a6dcff");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const cloudParallax = camera * 0.3;
      const cloudBandStart = Math.floor((cloudParallax - 100) / CLOUD_PERIOD) - 1;
      const cloudBandEnd =
        Math.floor((cloudParallax + width + 100) / CLOUD_PERIOD) + 1;
      for (let band = cloudBandStart; band <= cloudBandEnd; band++) {
        CLOUD_SPOTS.forEach(([cx, cy]) => {
          drawCloud(ctx, cx + band * CLOUD_PERIOD - cloudParallax, cy);
        });
      }

      ctx.save();
      ctx.translate(-camera, 0);

      if (imagesReady) {
        // Ground has no platform entry (it's an infinite collision plane),
        // so draw it as a tiled strip spanning whatever's in view instead.
        const groundStartX = Math.floor(camera / TILE) * TILE;
        const groundEndX = camera + width;
        for (let x = groundStartX; x < groundEndX; x += TILE) {
          ctx.drawImage(images.brick, x, groundY, TILE, TILE);
        }

        for (const s of spikes) {
          drawSpikes(ctx, s.x, s.y, s.w, s.h);
        }

        for (const c of coins) {
          if (c.collected) continue;
          const t = performance.now() / 250;
          const scaleX = Math.abs(Math.cos(t + c.x));
          ctx.save();
          ctx.translate(c.x + COIN_SIZE / 2, c.y + COIN_SIZE / 2);
          ctx.scale(Math.max(0.15, scaleX), 1);
          ctx.drawImage(
            images.coin,
            -COIN_SIZE / 2,
            -COIN_SIZE / 2,
            COIN_SIZE,
            COIN_SIZE,
          );
          ctx.restore();
        }

        for (const g of goombas) {
          let img = g.animFrame === 0 ? images.goomba1 : images.goomba2;
          let h = GOOMBA_H;
          let yDraw = g.y;
          if (!g.alive) {
            const progress = 1 - Math.max(0, g.squish) / SQUISH_FRAMES;
            h = GOOMBA_H * (1 - 0.6 * progress);
            yDraw = g.y + (GOOMBA_H - h);
            img = images.goomba1;
            ctx.globalAlpha = Math.max(0, g.squish / SQUISH_FRAMES);
          }
          ctx.drawImage(img, g.x, yDraw, GOOMBA_W, h);
          ctx.globalAlpha = 1;
        }

        let marioImg;
        if (mario.state === "jump") marioImg = images.marioJump;
        else if (mario.state === "run")
          marioImg = [images.marioRun1, images.marioRun2, images.marioRun3][
            mario.animFrame
          ];
        else marioImg = images.marioIdle;

        ctx.save();
        if (mario.facing === -1) {
          ctx.translate(mario.x + MARIO_W, mario.y);
          ctx.scale(-1, 1);
          ctx.drawImage(marioImg, 0, 0, MARIO_W, MARIO_H);
        } else {
          ctx.drawImage(marioImg, mario.x, mario.y, MARIO_W, MARIO_H);
        }
        ctx.restore();
      }

      ctx.restore();

      ctx.fillStyle = "rgba(0,0,0,0.35)";
      roundRect(ctx, 10, 10, 86, 28, 8);
      ctx.fill();
      if (imagesReady) ctx.drawImage(images.coin, 16, 15, 18, 18);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px monospace";
      ctx.textBaseline = "middle";
      ctx.fillText("x " + scoreVal, 40, 25);
    }

    let lastTime = performance.now();
    let rafId;
    function loop(now) {
      rafId = requestAnimationFrame(loop);
      const dt = Math.min((now - lastTime) / (1000 / 60), 2);
      lastTime = now;
      if (!document.hidden && isVisible) {
        if (status === "playing") update(dt);
        draw();
      }
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
    };
  }, [restartKey]);

  const handleRestart = useCallback(() => {
    inputRef.current = {
      left: false,
      right: false,
      jumpHeld: false,
      jumpQueued: false,
    };
    setScore(0);
    setShowHint(true);
    setGameStatus("playing");
    setDeathCause(null);
    setRestartKey((k) => k + 1);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "r" || e.key === "R") {
      handleRestart();
      return;
    }
    const action = KEY_MAP[e.key];
    if (!action) return;
    e.preventDefault();
    if (action === "jump") {
      if (!inputRef.current.jumpHeld) inputRef.current.jumpQueued = true;
      inputRef.current.jumpHeld = true;
    } else {
      inputRef.current[action] = true;
    }
  }, [handleRestart]);

  const handleKeyUp = useCallback((e) => {
    const action = KEY_MAP[e.key];
    if (!action) return;
    e.preventDefault();
    if (action === "jump") inputRef.current.jumpHeld = false;
    else inputRef.current[action] = false;
  }, []);

  const press = (key) => () => {
    inputRef.current[key] = true;
  };
  const release = (key) => () => {
    inputRef.current[key] = false;
  };
  const pressJump = () => {
    inputRef.current.jumpQueued = true;
  };

  return (
    <div
      ref={containerRef}
      className="mario-game"
      tabIndex={0}
      role="application"
      aria-label="Mini Mario platformer game. Use the arrow keys or on-screen buttons to run and jump."
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <canvas ref={canvasRef} className="mario-game-canvas" />
      {showHint ? (
        <div className="mario-game-hint">
          <span className="mario-game-hint-desktop">
            ← → to move · Space to jump · R to restart
          </span>
          <span className="mario-game-hint-mobile">Tap to play</span>
        </div>
      ) : null}
      {gameStatus !== "playing" ? (
        <div className="mario-overlay">
          <div className="mario-overlay-card">
            <h3>Game Over</h3>
            <p>
              {deathCause === "goomba"
                ? "A Goomba got you!"
                : "A hazard got you!"}{" "}
              Score: {score}
            </p>
            <button
              type="button"
              className="mario-restart-btn"
              onClick={handleRestart}
            >
              Restart
            </button>
          </div>
        </div>
      ) : null}
      <div className="mario-controls" aria-hidden="true">
        <div className="mario-controls-left">
          <button
            type="button"
            className="mario-btn mario-btn-left"
            onPointerDown={press("left")}
            onPointerUp={release("left")}
            onPointerLeave={release("left")}
            onPointerCancel={release("left")}
          >
            ◀
          </button>
          <button
            type="button"
            className="mario-btn mario-btn-right"
            onPointerDown={press("right")}
            onPointerUp={release("right")}
            onPointerLeave={release("right")}
            onPointerCancel={release("right")}
          >
            ▶
          </button>
        </div>
        <button
          type="button"
          className="mario-btn mario-btn-jump"
          onPointerDown={pressJump}
        >
          ⤴
        </button>
      </div>
    </div>
  );
};

export default MarioGame;
