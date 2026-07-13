import { useState, useEffect, useRef, useCallback } from "react";
const idleGif = "/pixel-cat/idle.gif";
const runGif = "/pixel-cat/run.gif";
const lickingGif = "/pixel-cat/licking.gif";
const playingGif = "/pixel-cat/playing.gif";
const loafGif = "/pixel-cat/loaf.gif";
import "./PixelCat.css";

const BASE_CAT_SIZE = 64;
const DESKTOP_CAT_SCALE = 2;
const MOBILE_CAT_SCALE = 1.75;
const MOBILE_CAT_MQL = "(max-width: 767px)";
const CAT_SPEED = 3;
const LICK_INTERVAL_MIN = 8000;
const LICK_INTERVAL_MAX = 20000;
const PLAY_INTERVAL_MIN = 12000;
const PLAY_INTERVAL_MAX = 28000;
const LOAF_INTERVAL_MIN = 10000;
const LOAF_INTERVAL_MAX = 22000;
const LICK_DURATION = 2167;
const PLAY_DURATION = 3286;
const LOAF_DURATION = 6000;
const RUN_ARRIVAL_THRESHOLD = 4;
/** First lick / play / loaf after mount: random delay in this range (ms) so idle holds longer on load */
const INITIAL_STATE_DELAY_MIN = 5000;
const INITIAL_STATE_DELAY_MAX = 10000;
const BUBBLE_HOLD_MS = 1400;
const BUBBLE_FADE_MS = 600;
const TYPE_MS = 38;
const INTRO_MESSAGE = "Play with Boba?";

const REFUSE_MESSAGES = [
  "Boba doesn't seem to want to play right now...",
  "Boba does what he wants.",
  "I think Boba needs more love to play...",
  "meow",
  "Boba is busy being a loaf.",
  "Nothing happened...",
  "Boba ignored you.",
  "Boba is in his own world right now.",
];

const LOVE_MESSAGES = [
  "Boba loves to be pet!",
  "prrrrrrr....",
  "Boba is very happy!",
  "Boba purrs softly...",
  'Boba says "meow I love you!"',
  "Boba's tail goes swish swish!",
];

function PixelCatBubble({
  text,
  id,
  durationMs,
  persistent,
  onTypingComplete,
}) {
  const [charIndex, setCharIndex] = useState(0);
  const typeIntervalRef = useRef(null);
  const onTypingCompleteRef = useRef(onTypingComplete);

  onTypingCompleteRef.current = onTypingComplete;

  useEffect(() => {
    setCharIndex(0);
    let i = 0;
    typeIntervalRef.current = window.setInterval(() => {
      i += 1;
      setCharIndex(i);
      if (i >= text.length && typeIntervalRef.current) {
        window.clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        onTypingCompleteRef.current?.();
      }
    }, TYPE_MS);

    return () => {
      if (typeIntervalRef.current) {
        window.clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
      }
    };
  }, [text, id]);

  return (
    <p
      className={`pixel-cat-bubble${persistent ? " pixel-cat-bubble--persistent" : ""}`}
      style={persistent ? undefined : { animationDuration: `${durationMs}ms` }}
      aria-hidden="true"
    >
      {text.slice(0, charIndex)}
    </p>
  );
}

export default function PixelCat() {
  const containerRef = useRef(null);
  const [catPos, setCatPos] = useState(0); // x position in px from left, constrained by container
  const [state, setState] = useState("idle"); // idle | run | licking | playing | loaf
  const [facingLeft, setFacingLeft] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [cursorPings, setCursorPings] = useState([]);
  const [bubbleMessage, setBubbleMessage] = useState(null);
  const [showIntroBubble, setShowIntroBubble] = useState(true);
  const [catScale, setCatScale] = useState(DESKTOP_CAT_SCALE);

  const targetXRef = useRef(null); // when set, cat runs to this x (left edge) then goes idle
  const mousePos = useRef({ x: -9999, y: -9999 });
  const containerRect = useRef({ left: 0, width: 0 });
  const catPosRef = useRef(catPos);
  const stateRef = useRef(state);
  const animFrameRef = useRef(null);
  const lickTimerRef = useRef(null);
  const playTimerRef = useRef(null);
  const loafTimerRef = useRef(null);
  const interactionLockedRef = useRef(false);
  const lastIdleFacingRef = useRef(null);
  const initialPositionSetRef = useRef(false);
  const firstLickRef = useRef(true);
  const firstPlayRef = useRef(true);
  const firstLoafRef = useRef(true);
  const bubbleTimerRef = useRef(null);
  const bubbleMessageRef = useRef(null);
  const bubbleTypingCompleteRef = useRef(true);
  const showIntroBubbleRef = useRef(true);
  const catMetricsRef = useRef({
    scale: DESKTOP_CAT_SCALE,
    scaledSize: BASE_CAT_SIZE * DESKTOP_CAT_SCALE,
  });

  catPosRef.current = catPos;
  stateRef.current = state;
  bubbleMessageRef.current = bubbleMessage;
  showIntroBubbleRef.current = showIntroBubble;

  const dismissIntroBubble = useCallback(() => {
    if (!showIntroBubbleRef.current) return false;
    showIntroBubbleRef.current = false;
    setShowIntroBubble(false);
    return true;
  }, []);

  const syncCatMetrics = useCallback(() => {
    const scale = window.matchMedia(MOBILE_CAT_MQL).matches
      ? MOBILE_CAT_SCALE
      : DESKTOP_CAT_SCALE;
    catMetricsRef.current = {
      scale,
      scaledSize: BASE_CAT_SIZE * scale,
    };
    setCatScale(scale);
  }, []);

  useEffect(() => {
    syncCatMetrics();
    const mql = window.matchMedia(MOBILE_CAT_MQL);
    const handleChange = () => syncCatMetrics();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [syncCatMetrics]);

  // Update container rect for tap-to-run position
  const updateRect = useCallback(() => {
    if (containerRef.current) {
      const r = containerRef.current.getBoundingClientRect();
      containerRect.current = { left: r.left, top: r.top, width: r.width };
    }
  }, []);

  useEffect(() => {
    const setInitialCenter = () => {
      updateRect();
      if (containerRect.current.width > 0 && !initialPositionSetRef.current) {
        const { scaledSize } = catMetricsRef.current;
        const centerX = (containerRect.current.width - scaledSize) / 2;
        setCatPos(Math.max(0, centerX));
        initialPositionSetRef.current = true;
      }
    };
    setInitialCenter();
    const ro = new ResizeObserver(setInitialCenter);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [updateRect]);

  // Schedule random licking (only when idle, don't interrupt run or click)
  const scheduleLick = useCallback(() => {
    const delay = firstLickRef.current
      ? INITIAL_STATE_DELAY_MIN +
        Math.random() * (INITIAL_STATE_DELAY_MAX - INITIAL_STATE_DELAY_MIN)
      : LICK_INTERVAL_MIN +
        Math.random() * (LICK_INTERVAL_MAX - LICK_INTERVAL_MIN);
    if (firstLickRef.current) firstLickRef.current = false;
    lickTimerRef.current = setTimeout(() => {
      if (stateRef.current === "idle" && !interactionLockedRef.current) {
        interactionLockedRef.current = true;
        setState("licking");
        setTimeout(() => {
          setState("idle");
          interactionLockedRef.current = false;
          scheduleLick();
        }, LICK_DURATION);
      } else {
        scheduleLick();
      }
    }, delay);
  }, []);

  // Schedule random playing (only when idle, like licking)
  const schedulePlay = useCallback(() => {
    const delay = firstPlayRef.current
      ? INITIAL_STATE_DELAY_MIN +
        Math.random() * (INITIAL_STATE_DELAY_MAX - INITIAL_STATE_DELAY_MIN)
      : PLAY_INTERVAL_MIN +
        Math.random() * (PLAY_INTERVAL_MAX - PLAY_INTERVAL_MIN);
    if (firstPlayRef.current) firstPlayRef.current = false;
    playTimerRef.current = setTimeout(() => {
      if (stateRef.current === "idle" && !interactionLockedRef.current) {
        interactionLockedRef.current = true;
        setState("playing");
        setTimeout(() => {
          setState("idle");
          interactionLockedRef.current = false;
          schedulePlay();
        }, PLAY_DURATION);
      } else {
        schedulePlay();
      }
    }, delay);
  }, []);

  // Schedule random loaf (only when idle, like licking/playing)
  const scheduleLoaf = useCallback(() => {
    const delay = firstLoafRef.current
      ? INITIAL_STATE_DELAY_MIN +
        Math.random() * (INITIAL_STATE_DELAY_MAX - INITIAL_STATE_DELAY_MIN)
      : LOAF_INTERVAL_MIN +
        Math.random() * (LOAF_INTERVAL_MAX - LOAF_INTERVAL_MIN);
    if (firstLoafRef.current) firstLoafRef.current = false;
    loafTimerRef.current = setTimeout(() => {
      if (stateRef.current === "idle" && !interactionLockedRef.current) {
        interactionLockedRef.current = true;
        setState("loaf");
        setTimeout(() => {
          setState("idle");
          interactionLockedRef.current = false;
          scheduleLoaf();
        }, LOAF_DURATION);
      } else {
        scheduleLoaf();
      }
    }, delay);
  }, []);

  useEffect(() => {
    scheduleLick();
    return () => clearTimeout(lickTimerRef.current);
  }, [scheduleLick]);

  useEffect(() => {
    schedulePlay();
    return () => clearTimeout(playTimerRef.current);
  }, [schedulePlay]);

  useEffect(() => {
    scheduleLoaf();
    return () => clearTimeout(loafTimerRef.current);
  }, [scheduleLoaf]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop: run toward targetX when set; when idle, face cursor left/right (no movement)
  useEffect(() => {
    const loop = () => {
      updateRect();
      const rect = containerRect.current;
      const targetX = targetXRef.current;
      const current = catPosRef.current;
      const { scaledSize } = catMetricsRef.current;
      const catCenterX = current + scaledSize / 2;

      if (targetX != null && !interactionLockedRef.current) {
        const dx = targetX - current;
        const dist = Math.abs(dx);

        if (dist <= RUN_ARRIVAL_THRESHOLD) {
          setCatPos(targetX);
          setState("idle");
          targetXRef.current = null;
        } else {
          const step = dx > 0 ? CAT_SPEED : -CAT_SPEED;
          const maxX = Math.max(0, rect.width - scaledSize);
          const newX = Math.max(0, Math.min(maxX, current + step));
          setCatPos(newX);
          setState("run");
          setFacingLeft(dx < 0);
        }
      } else if (stateRef.current === "idle") {
        const mouseLocalX = mousePos.current.x - rect.left;
        const faceLeft = mouseLocalX < catCenterX;
        if (lastIdleFacingRef.current !== faceLeft) {
          lastIdleFacingRef.current = faceLeft;
          setFacingLeft(faceLeft);
        }
      }
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [updateRect]);

  const handleBubbleTypingComplete = useCallback(() => {
    bubbleTypingCompleteRef.current = true;
  }, []);

  const showBubble = useCallback((messages) => {
    if (showIntroBubbleRef.current) return;
    if (bubbleMessageRef.current && !bubbleTypingCompleteRef.current) {
      return;
    }

    const text = messages[Math.floor(Math.random() * messages.length)];
    const id = Date.now();
    const durationMs = text.length * TYPE_MS + BUBBLE_HOLD_MS + BUBBLE_FADE_MS;
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTypingCompleteRef.current = false;
    setBubbleMessage({ text, id, durationMs });
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleMessage(null);
      bubbleTypingCompleteRef.current = true;
      bubbleTimerRef.current = null;
    }, durationMs);
  }, []);

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    };
  }, []);

  const getTapPosition = (e) => {
    let clientX = 0,
      clientY = 0;
    if (e.clientX != null && e.clientY != null) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      const t = e.changedTouches && e.changedTouches[0];
      if (t) {
        clientX = t.clientX;
        clientY = t.clientY;
      }
    }
    return { clientX, clientY };
  };

  const showCursorAtTap = (e) => {
    updateRect();
    const rect = containerRect.current;
    const { clientX, clientY } = getTapPosition(e);
    const localX = clientX - rect.left;
    const localY = clientY - (rect.top ?? 0);
    const catCenterX = catPosRef.current + catMetricsRef.current.scaledSize / 2;
    const tapIsRightOfCat = localX > catCenterX;
    const id = Date.now();
    setCursorPings((prev) => [
      ...prev,
      { id, x: localX, y: localY, flip: tapIsRightOfCat },
    ]);
    setTimeout(() => {
      setCursorPings((p) => p.filter((c) => c.id !== id));
    }, 800);
  };

  const CURSOR_PING_SIZE = 48; /* 2x scale for cursor.png */

  const handleContainerTap = (e) => {
    dismissIntroBubble();
    showCursorAtTap(e);
    const isPetTap = e.target.closest && e.target.closest(".pixel-cat-sprite");
    if (isPetTap) {
      handlePetClick(e);
      return;
    }
    if (interactionLockedRef.current) {
      showBubble(REFUSE_MESSAGES);
      return;
    }
    updateRect();
    const rect = containerRect.current;
    const { clientX } = getTapPosition(e);
    const localX = clientX - rect.left;
    const { scaledSize } = catMetricsRef.current;
    const catLeft = localX - scaledSize / 2;
    const maxX = Math.max(0, rect.width - scaledSize);
    const clamped = Math.max(0, Math.min(maxX, catLeft));
    targetXRef.current = clamped;
    setState("run");
    setFacingLeft(clamped < catPosRef.current);
  };

  const handlePetClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    dismissIntroBubble();
    const catCenterX = catPosRef.current + catMetricsRef.current.scaledSize / 2;

    showBubble(LOVE_MESSAGES);

    // Clicking the cat only shows hearts; play/loaf/lick happen on random timers only
    const id = Date.now();
    setFloatingHearts((prev) => [...prev, { id, x: catCenterX }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 1100);
  };

  const handleContainerClick = (e) => {
    handleContainerTap(e);
  };

  const handleContainerTouchEnd = (e) => {
    handleContainerTap(e);
  };

  const gifMap = {
    idle: idleGif,
    run: runGif,
    licking: lickingGif,
    playing: playingGif,
    loaf: loafGif,
  };

  return (
    <div
      ref={containerRef}
      className="pixel-cat-scene"
      onClick={handleContainerClick}
      onTouchEnd={handleContainerTouchEnd}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleContainerTap(e);
        }
      }}
      aria-label="Pixel cat: tap to move cat, tap cat to pet"
    >
      {showIntroBubble && (
        <PixelCatBubble
          key="intro"
          id="intro"
          text={INTRO_MESSAGE}
          persistent
        />
      )}

      {!showIntroBubble && bubbleMessage && (
        <PixelCatBubble
          key={bubbleMessage.id}
          id={bubbleMessage.id}
          text={bubbleMessage.text}
          durationMs={bubbleMessage.durationMs}
          onTypingComplete={handleBubbleTypingComplete}
        />
      )}

      {floatingHearts.map((h) => (
        <img
          key={h.id}
          src="/pixel-cat/pixel-heart.png"
          alt=""
          className="pixel-cat-floating-heart"
          style={{
            left: h.x,
            width: 24,
            height: 24,
          }}
          draggable={false}
        />
      ))}

      {cursorPings.map((c) => (
        <img
          key={c.id}
          src="/pixel-cat/cursor.png"
          alt=""
          className={`pixel-cat-cursor-ping${c.flip ? " pixel-cat-cursor-ping-flip" : ""}`}
          style={{
            left: c.x - CURSOR_PING_SIZE / 2,
            top: c.y - CURSOR_PING_SIZE / 2,
            width: CURSOR_PING_SIZE,
            height: CURSOR_PING_SIZE,
          }}
          draggable={false}
        />
      ))}

      <img
        src={gifMap[state]}
        alt="pixel cat"
        className="pixel-cat-sprite"
        style={{
          left: catPos,
          transform: facingLeft
            ? `scale(${catScale}) scaleX(-1)`
            : `scale(${catScale}) scaleX(1)`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          handlePetClick(e);
        }}
        onTouchEnd={(e) => {
          e.stopPropagation();
          handlePetClick(e);
        }}
        draggable={false}
      />
    </div>
  );
}
