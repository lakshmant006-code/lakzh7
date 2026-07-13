import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./BlockPartySpyNavSprite.css";

const SPRITE_SRC = {
  idle: "/projects/block-party/sprites/idle.gif",
  walkUp: "/projects/block-party/sprites/walk_up.gif",
  walkDown: "/projects/block-party/sprites/walk_down.gif",
};

const SPRITE_SIZE = 24;
const MOVE_MS = 420;
const NAV_STAGGER_MS = 1900;

const SPRITE_SLOT_SELECTOR = ".blockparty-spy-nav__sprite-slot";

function getLayoutOffset(el, ancestor) {
  let top = 0;
  let left = 0;
  let node = el;

  while (node && node !== ancestor) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent;
  }

  return node === ancestor ? { left, top } : null;
}

export default function BlockPartySpyNavSprite({
  activeId,
  sectionIds,
  linkRefs,
  trackRef,
}) {
  const [spriteY, setSpriteY] = useState(0);
  const [spriteX, setSpriteX] = useState(0);
  const [spriteSrc, setSpriteSrc] = useState(SPRITE_SRC.idle);
  const prevIndexRef = useRef(-1);
  const moveTokenRef = useRef(0);
  const moveTimerRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  const getSpritePosition = useCallback(
    (index) => {
      const btn = linkRefs.current[index];
      const track = trackRef.current;
      if (!btn || !track || index < 0) return { x: 0, y: 0 };

      const anchor = btn.querySelector(SPRITE_SLOT_SELECTOR) ?? btn;
      const layoutOffset = getLayoutOffset(anchor, track);

      if (layoutOffset) {
        return {
          x: layoutOffset.left,
          y: layoutOffset.top + (anchor.offsetHeight - SPRITE_SIZE) / 2,
        };
      }

      const trackRect = track.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();

      return {
        x: anchorRect.left - trackRect.left,
        y:
          anchorRect.top -
          trackRect.top +
          (anchorRect.height - SPRITE_SIZE) / 2,
      };
    },
    [linkRefs, trackRef],
  );

  const applySpriteCoords = useCallback((index) => {
    const { x, y } = getSpritePosition(index);
    setSpriteX(x);
    setSpriteY(y);
  }, [getSpritePosition]);

  const finishMove = useCallback((token) => {
    if (token !== moveTokenRef.current) return;
    setSpriteSrc(SPRITE_SRC.idle);
  }, []);

  const syncPosition = useCallback(
    (index, { animate = false } = {}) => {
      applySpriteCoords(index);

      if (!animate || prefersReducedMotion.current) {
        moveTokenRef.current += 1;
        if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
        setSpriteSrc(SPRITE_SRC.idle);
        return;
      }

      const prevIndex = prevIndexRef.current;
      if (prevIndex < 0 || prevIndex === index) {
        setSpriteSrc(SPRITE_SRC.idle);
        return;
      }

      moveTokenRef.current += 1;
      const token = moveTokenRef.current;
      setSpriteSrc(
        index > prevIndex ? SPRITE_SRC.walkDown : SPRITE_SRC.walkUp,
      );

      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
      moveTimerRef.current = setTimeout(() => finishMove(token), MOVE_MS);
    },
    [applySpriteCoords, finishMove],
  );

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useLayoutEffect(() => {
    const index = sectionIds.indexOf(activeId);
    if (index < 0) return;

    const isFirstSync = prevIndexRef.current < 0;
    syncPosition(index, { animate: !isFirstSync });
    prevIndexRef.current = index;
  }, [activeId, sectionIds, syncPosition]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const remeasure = () => {
      const index = sectionIds.indexOf(activeId);
      if (index < 0) return;
      applySpriteCoords(index);
    };

    let rafId = null;
    const scheduleRemeasure = () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = null;
        remeasure();
      });
    };

    const observer = new ResizeObserver(scheduleRemeasure);
    observer.observe(track);
    linkRefs.current.forEach((btn) => {
      if (btn) observer.observe(btn);
    });

    const onAnimationEnd = (event) => {
      if (!event.target.classList.contains("case-study-spy-nav__item")) return;
      scheduleRemeasure();
    };

    track.addEventListener("animationend", onAnimationEnd);
    window.addEventListener("resize", scheduleRemeasure);

    requestAnimationFrame(() => requestAnimationFrame(scheduleRemeasure));

    const staggerTimeout = window.setTimeout(scheduleRemeasure, NAV_STAGGER_MS);
    const fontsReady = document.fonts?.ready;
    if (fontsReady) fontsReady.then(scheduleRemeasure);

    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      observer.disconnect();
      track.removeEventListener("animationend", onAnimationEnd);
      window.removeEventListener("resize", scheduleRemeasure);
      window.clearTimeout(staggerTimeout);
    };
  }, [activeId, applySpriteCoords, linkRefs, trackRef, sectionIds]);

  useEffect(
    () => () => {
      if (moveTimerRef.current) clearTimeout(moveTimerRef.current);
    },
    [],
  );

  const handleTransitionEnd = (event) => {
    if (event.currentTarget !== event.target) return;
    if (event.propertyName !== "transform") return;
    finishMove(moveTokenRef.current);
  };

  return (
    <div
      className="blockparty-spy-nav-sprite"
      style={{
        transform: `translate(${spriteX}px, ${spriteY}px)`,
        width: SPRITE_SIZE,
        height: SPRITE_SIZE,
      }}
      onTransitionEnd={handleTransitionEnd}
      aria-hidden="true"
    >
      <div className="blockparty-spy-nav-sprite__enter">
        <img
          key={spriteSrc}
          src={spriteSrc}
          alt=""
          className="blockparty-spy-nav-sprite__img"
          width={SPRITE_SIZE}
          height={SPRITE_SIZE}
          draggable={false}
        />
      </div>
    </div>
  );
}
