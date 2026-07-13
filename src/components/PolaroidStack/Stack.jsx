import { motion, useMotionValue } from "framer-motion";
import { useState, useEffect } from "react";
import "./Stack.css";

const ENTRANCE_STAGGER_S = 0.16;
const ENTRANCE_DROP_Y = 320;
const ENTRANCE_SPRING = {
  type: "spring",
  stiffness: 180,
  damping: 34,
  mass: 1.4,
};
const HOVER_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false,
  rotateZ,
  transformOrigin,
  offsetX = 0,
  offsetY = 0,
  hoverRotateZ,
  hoverX,
  hoverY,
  isGroupHovered = false,
  zIndex = 0,
  enterFromY = 0,
  enterDelay = 0,
  animateOnMount = false,
  entranceComplete = true,
}) {
  const x = useMotionValue(0); // drag offset only
  const y = useMotionValue(0);

  function handleDragEnd(_, info) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  const restingX = isGroupHovered ? (hoverX ?? offsetX) : offsetX;
  const restingY = isGroupHovered ? (hoverY ?? offsetY) : offsetY;
  const restingRotateZ = isGroupHovered ? (hoverRotateZ ?? rotateZ) : rotateZ;

  const motionTransition = entranceComplete
    ? HOVER_SPRING
    : { ...ENTRANCE_SPRING, delay: enterDelay };

  const motionProps = animateOnMount
    ? {
        initial: {
          x: offsetX,
          y: offsetY + enterFromY,
          rotateZ: 0,
          opacity: 0,
        },
        animate: {
          x: restingX,
          y: restingY,
          rotateZ: restingRotateZ,
          opacity: 1,
        },
      }
    : {
        initial: false,
        animate: {
          x: restingX,
          y: restingY,
          rotateZ: restingRotateZ,
        },
      };

  if (disableDrag) {
    return (
      <motion.div
        className="card-rotate-disabled"
        style={{
          transformOrigin,
          zIndex,
        }}
        transition={motionTransition}
        {...motionProps}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="card-rotate"
      style={{ transformOrigin, zIndex }}
      transition={motionTransition}
      {...motionProps}
    >
      <motion.div
        style={{ x, y, width: "100%", height: "100%" }}
        drag
        dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
        dragElastic={0.6}
        whileTap={{ cursor: "grabbing" }}
        onDragEnd={handleDragEnd}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768,
  animateOnMount = false,
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGroupHovered, setIsGroupHovered] = useState(false);
  const [entranceComplete, setEntranceComplete] = useState(!animateOnMount);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState(() => {
    if (cards.length) {
      return cards
        .map((content, index) => ({ id: index + 1, content }))
        .reverse();
    }
    return [];
  });

  useEffect(() => {
    if (cards.length) {
      setStack(
        cards.map((content, index) => ({ id: index + 1, content })).reverse(),
      );
    }
  }, [cards]);

  useEffect(() => {
    if (!animateOnMount || prefersReducedMotion || stack.length === 0) {
      setEntranceComplete(true);
      return;
    }

    setEntranceComplete(false);
    const settleMs =
      900 + (stack.length - 1) * ENTRANCE_STAGGER_S * 1000;
    const timer = window.setTimeout(() => setEntranceComplete(true), settleMs);
    return () => window.clearTimeout(timer);
  }, [animateOnMount, prefersReducedMotion, stack.length]);

  const sendToBack = (id) => {
    setStack((prev) => {
      const newStack = [...prev];
      const index = newStack.findIndex((card) => card.id === id);
      const [card] = newStack.splice(index, 1);
      newStack.unshift(card);
      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;
        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  if (stack.length === 0) return null;

  return (
    <div
      className="stack-container"
      onMouseEnter={() => {
        pauseOnHover && setIsPaused(true);
        setIsGroupHovered(true);
      }}
      onMouseLeave={() => {
        pauseOnHover && setIsPaused(false);
        setIsGroupHovered(false);
      }}
    >
      {stack.map((card, index) => {
        const stackPosition = stack.length - index - 1; // 0 = top … 3 = back
        const rotations = [
          { rotateZ: 0, x: 0, y: 0, transformOrigin: "50% 50%" },
          { rotateZ: -10, x: -50, y: 0, transformOrigin: "50% 50%" },
          { rotateZ: 10, x: 80, y: 0, transformOrigin: "50% 50%" },
          { rotateZ: 0, x: 0, y: -52, transformOrigin: "50% 100%" },
        ];
        const rotationsHover = [
          { rotateZ: 0, x: 0, y: -12 }, // top: lifts up slightly
          { rotateZ: -18, x: -65, y: 0 }, // middle: fans left
          { rotateZ: 18, x: 100, y: 0 }, // bottom: fans right
          { rotateZ: 5, x: 0, y: -68 }, // back: peeks up a bit more
        ];
        const rot = rotations[stackPosition] ?? rotations[2];
        const rotHover = rotationsHover[stackPosition] ?? rotationsHover[2];
        const targetScale = 0.94 - stackPosition * 0.06;
        const shouldAnimateEntrance =
          animateOnMount && !prefersReducedMotion;
        const enterFromY = shouldAnimateEntrance ? -ENTRANCE_DROP_Y : 0;
        const enterDelay = shouldAnimateEntrance
          ? index * ENTRANCE_STAGGER_S
          : 0;
        const cardTransition = entranceComplete
          ? {
              type: "spring",
              stiffness: animationConfig.stiffness,
              damping: animationConfig.damping,
            }
          : {
              ...ENTRANCE_SPRING,
              delay: enterDelay,
            };

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
            rotateZ={rot.rotateZ}
            transformOrigin={rot.transformOrigin}
            offsetX={rot.x}
            offsetY={rot.y}
            hoverRotateZ={rotHover.rotateZ}
            hoverX={rotHover.x}
            hoverY={rotHover.y}
            isGroupHovered={isGroupHovered}
            zIndex={index}
            enterFromY={enterFromY}
            enterDelay={enterDelay}
            animateOnMount={shouldAnimateEntrance}
            entranceComplete={entranceComplete}
          >
            <motion.div
              className={
                stackPosition === 3 ? "card card--back" : "card"
              }
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              initial={
                shouldAnimateEntrance
                  ? { scale: targetScale * 0.9, opacity: 0 }
                  : false
              }
              animate={{
                scale: targetScale,
                opacity: 1,
              }}
              transition={cardTransition}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}
