import { WINDOW_W, WINDOW_H, assetPath } from './utils.js';
import { Font, Dashboard } from './dashboard.js';
import { Level } from './level.js';
import { Mario } from './mario.js';
import { Menu } from './menu.js';
import { Sound } from './sound.js';
import { Sprites } from './sprites.js';

let canvas;
let ctx;
let loadingEl;
let fpsEl;
let menu;
let mario;
let level;
let dashboard;
let sound;
let sprites;
let lastTime = 0;
let frameCount = 0;
let fpsTimer = 0;
let accumulator = 0;
const FIXED_DT = 1000 / 60;

export function setLoadingMessage(msg) {
  if (loadingEl) loadingEl.textContent = msg;
}

export async function boot() {
  canvas = document.getElementById('game');
  loadingEl = document.getElementById('loading');
  fpsEl = document.getElementById('fps');

  if (!canvas || !loadingEl) {
    throw new Error('Game canvas or loading element not found in page.');
  }

  ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;

  if (window.location.protocol === 'file:') {
    loadingEl.innerHTML =
      'Cannot load from a local file.<br><br>Run a local server:<br><code>python -m http.server 8080</code><br><br>Then open <code>http://localhost:8080/web/</code>';
    return;
  }

  setLoadingMessage('Loading sprites...');
  sprites = await Sprites.load();

  setLoadingMessage('Loading font...');
  const font = await Font.create();

  setLoadingMessage('Starting game...');
  sound = new Sound();
  dashboard = new Dashboard(font, ctx);
  level = new Level(ctx, sound, dashboard, sprites);
  menu = new Menu(ctx, dashboard, level, sound);
  menu.onStart = () => {
    mario = new Mario(0, 0, level, ctx, dashboard, sound, sprites);
  };

  window.addEventListener('keydown', (e) => {
    if (!menu.start) {
      menu.handleKey(e.code);
    } else if (mario?.pause) {
      mario.pauseObj.handleKey(e.code);
    }
  });

  canvas.addEventListener('contextmenu', (e) => e.preventDefault());

  loadingEl.style.display = 'none';
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
  if (fpsTimer >= 1000) {
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
    dashboard.state = 'menu';
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

// Quick probe so boot can fail fast with a readable message.
export async function probeAssets() {
  const probe = assetPath('sprites/Mario.json');
  const res = await fetch(probe);
  if (!res.ok) {
    throw new Error(`Asset probe failed (${res.status}): ${probe}`);
  }
}
