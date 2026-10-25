/**
 * Tiny UI sounds for hover and press, generated with ElevenLabs sound effects.
 *
 * - "pop" plays when the pointer enters an image card, "tick" for links and
 *   buttons, "press" on click.
 * - Only on devices with a real hover pointer (mouse or trackpad).
 * - Browsers keep audio locked until the visitor's first click or key press,
 *   so nothing plays before that.
 * - A visitor can turn it off; the choice is remembered.
 */
const FILES = {
  pop: "/sounds/hover-pop.mp3",
  tick: "/sounds/hover-tick.mp3",
  press: "/sounds/press.mp3",
  horn: "/sounds/auto-horn.mp3",
  woof: "/sounds/dog-woof.mp3",
};
// Per-sound loudness (the files are peak-normalised).
const GAIN = { pop: 0.35, tick: 0.2, press: 0.4, horn: 0.5, woof: 0.45 };
const MIN_GAP_MS = 70;

const CARD =
  ".work-bento-item, .natural-play-bento-item, .cs-next-card, .expanding-photo-row-hitarea, .stack-container, [data-sound='pop']";
const SMALL = "a[href], button, [role='button'], .pill, [data-sound='tick']";

const STORAGE_KEY = "ui-sound";
let enabled = true;
try {
  enabled = localStorage.getItem(STORAGE_KEY) !== "off";
} catch {
  /* storage unavailable: stay on for this visit */
}
const listeners = new Set();

export const isSoundEnabled = () => enabled;
export function setSoundEnabled(next) {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(enabled));
}
export function subscribeSound(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

let ctx = null;
const buffers = {};
const loading = {};
const lastPlayed = {};

function unlock() {
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  Object.entries(FILES).forEach(([name, url]) => {
    loading[name] = fetch(url)
      .then((r) => r.arrayBuffer())
      .then(
        (data) =>
          new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)),
      )
      .then((buf) => {
        buffers[name] = buf;
      })
      .catch(() => {});
  });
}

/**
 * Play a sound the visitor asked for with a click (a horn, a woof). The very
 * first click has to unlock audio and fetch the file, so wait for it.
 */
export function playSoundOnClick(name) {
  if (!enabled) return;
  unlock();
  if (buffers[name]) {
    playSound(name);
    return;
  }
  loading[name]?.then(() => playSound(name));
}

export function playSound(name) {
  if (!enabled || !ctx || !buffers[name]) return;
  const now = performance.now();
  if (now - (lastPlayed[name] || 0) < MIN_GAP_MS) return;
  lastPlayed[name] = now;

  const source = ctx.createBufferSource();
  source.buffer = buffers[name];
  // A touch of random pitch so repeated hovers don't sound mechanical.
  source.playbackRate.value = 0.94 + Math.random() * 0.12;
  const gain = ctx.createGain();
  gain.gain.value = GAIN[name];
  source.connect(gain).connect(ctx.destination);
  source.start();
}

/** Attach the global hover and press listeners. Returns a cleanup function. */
export function initUiSounds() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!finePointer.matches) return () => {};

  // A region marked data-sound="off" plays nothing by itself (it has its own).
  const isOff = (target) => target.closest("[data-sound]")?.dataset.sound === "off";

  const onOver = (e) => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target || isOff(target)) return;
    const card = target.closest(CARD);
    const small = card ? null : target.closest(SMALL);
    const el = card || small;
    if (!el || el.contains(e.relatedTarget)) return; // still inside the same element
    playSound(card ? "pop" : "tick");
  };
  const onDown = (e) => {
    unlock();
    if (e.button !== 0 || !(e.target instanceof Element) || isOff(e.target)) return;
    if (e.target.closest(CARD) || e.target.closest(SMALL)) playSound("press");
  };

  document.addEventListener("mouseover", onOver, true);
  document.addEventListener("pointerdown", onDown, true);
  document.addEventListener("keydown", unlock, true);
  return () => {
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("keydown", unlock, true);
  };
}
