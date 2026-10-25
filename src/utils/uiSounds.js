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
  type: "/sounds/type.mp3",
};
// Per-sound loudness (the files are peak-normalised).
const GAIN = { pop: 0.35, tick: 0.2, press: 0.4, horn: 0.2, woof: 0.35, type: 0.09 };
const MIN_GAP_MS = 70;
// Typing clicks come fast, so they get a shorter gap.
const GAP_MS = { type: 28 };

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
  if (!next) Object.keys(LOOPS).forEach(stopLoop);
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
  if (now - (lastPlayed[name] || 0) < (GAP_MS[name] ?? MIN_GAP_MS)) return;
  lastPlayed[name] = now;

  const source = ctx.createBufferSource();
  source.buffer = buffers[name];
  // A touch of random pitch so repeated hovers don't sound mechanical.
  source.playbackRate.value =
    name === "type" ? 0.9 + Math.random() * 0.22 : 0.94 + Math.random() * 0.12;
  const gain = ctx.createGain();
  gain.gain.value = GAIN[name];
  source.connect(gain).connect(ctx.destination);
  source.start();
}

// ---- Looping music (plays while the pointer hovers the Work page dot field) ----
const LOOPS = {
  // Four bars at 100 bpm, cut to repeat seamlessly (generated with ElevenLabs Music).
  dots: { url: "/sounds/dots-loop.mp3", length: 9.6, gain: 0.2 },
};
const FADE_IN_S = 0.3;
const FADE_OUT_S = 0.6;
const loopBuffers = {};
const loopLoading = {};
const loopState = {}; // name -> { wanted, source, gain, stopTimer }

function loadLoop(name) {
  if (loopBuffers[name]) return Promise.resolve(loopBuffers[name]);
  if (!loopLoading[name]) {
    loopLoading[name] = fetch(LOOPS[name].url)
      .then((r) => r.arrayBuffer())
      .then((data) => new Promise((res, rej) => ctx.decodeAudioData(data, res, rej)))
      .then((buf) => (loopBuffers[name] = buf))
      .catch(() => null);
  }
  return loopLoading[name];
}

function startLoop(name, buffer) {
  const st = loopState[name];
  const cfg = LOOPS[name];
  clearTimeout(st.stopTimer);
  const now = ctx.currentTime;
  if (st.source) {
    // Already playing (a short pause in hovering): just bring it back up.
    st.gain.gain.cancelScheduledValues(now);
    st.gain.gain.setValueAtTime(st.gain.gain.value, now);
    st.gain.gain.linearRampToValueAtTime(cfg.gain, now + FADE_IN_S);
    return;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.loopStart = 0;
  source.loopEnd = cfg.length; // drop the encoder's padding so the loop is gapless
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(cfg.gain, now + FADE_IN_S);
  source.connect(gain).connect(ctx.destination);
  source.start();
  st.source = source;
  st.gain = gain;
}

function stopLoop(name) {
  const st = loopState[name];
  if (!st) return;
  st.wanted = false;
  if (!st.source) return;
  const now = ctx.currentTime;
  st.gain.gain.cancelScheduledValues(now);
  st.gain.gain.setValueAtTime(st.gain.gain.value, now);
  st.gain.gain.linearRampToValueAtTime(0, now + FADE_OUT_S);
  clearTimeout(st.stopTimer);
  const { source } = st;
  st.stopTimer = setTimeout(() => {
    if (st.wanted) return;
    try {
      source.stop();
    } catch {
      /* already stopped */
    }
    if (st.source === source) {
      st.source = null;
      st.gain = null;
    }
  }, FADE_OUT_S * 1000 + 50);
}

/** Turn a looping track on (fades in) or off (fades out). Needs a prior click. */
export function setLoopActive(name, active) {
  const st = (loopState[name] ||= { wanted: false, source: null, gain: null, stopTimer: 0 });
  if (!active || !enabled) {
    if (ctx) stopLoop(name);
    return;
  }
  st.wanted = true;
  if (!ctx) return; // audio is still locked until the first click or key press
  loadLoop(name).then((buf) => {
    if (buf && st.wanted && enabled) startLoop(name, buf);
  });
}

/**
 * Attach the global listeners. Every device unlocks audio on its first touch,
 * click or key press (iPads included). Hover and press sounds are only for
 * devices with a real hover pointer. Returns a cleanup function.
 */
export function initUiSounds() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

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
    if (!finePointer) return;
    if (e.button !== 0 || !(e.target instanceof Element) || isOff(e.target)) return;
    if (e.target.closest(CARD) || e.target.closest(SMALL)) playSound("press");
  };
  // iOS only lets audio start from a touch that ends or begins in a handler.
  const onTouch = () => unlock();

  if (finePointer) document.addEventListener("mouseover", onOver, true);
  document.addEventListener("pointerdown", onDown, true);
  document.addEventListener("touchstart", onTouch, { capture: true, passive: true });
  document.addEventListener("touchend", onTouch, { capture: true, passive: true });
  document.addEventListener("keydown", unlock, true);
  return () => {
    document.removeEventListener("mouseover", onOver, true);
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("touchstart", onTouch, true);
    document.removeEventListener("touchend", onTouch, true);
    document.removeEventListener("keydown", unlock, true);
  };
}
