import { useCallback, useLayoutEffect, useRef, useState } from "react";

const INSPIRATION_ITEMS = [
  {
    id: "stardew-valley",
    src: "/projects/block-party/stardew-valley.gif",
    title: "Stardew Valley",
    description:
      "Digital neighborhoods — a whole community accessible by everyone, anywhere.",
    top: 2,
    left: 0,
    width: "28%",
    zIndex: 4,
  },
  {
    id: "maplestory",
    src: "/projects/block-party/maplestory.gif",
    title: "MapleStory",
    description:
      "Digital neighborhoods — a whole community accessible by everyone, anywhere.",
    top: 10,
    left: 58,
    width: "28%",
    zIndex: 3,
  },
  {
    id: "tamagotchi",
    src: "/projects/block-party/tamagotchi.gif",
    title: "Tamagotchi",
    description:
      "Tiny pixel characters that created communities of people who got genuinely invested in nurturing them like their own.",
    top: 34,
    left: 78,
    width: "19%",
    zIndex: 2,
  },
  {
    id: "thronglets",
    src: "/projects/block-party/thronglets.gif",
    title: "Thronglets",
    description:
      "Tiny pixel characters that created communities of people who got genuinely invested in nurturing them like their own.",
    top: 34,
    left: 10,
    width: "25%",
    zIndex: 3,
  },
  {
    id: "twitch",
    src: "/projects/block-party/twitch.gif",
    title: "Twitch Stream Avatar Overlays",
    description:
      "Viewers create an avatar and watch it move around alongside everyone else's — giving strangers a community.",
    top: 40,
    left: 40,
    width: "27%",
    zIndex: 5,
  },
];

const HALF_THRESHOLD = 50;
const DRAG_THRESHOLD = 6;

const isTouchDevice = () =>
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

const MOBILE_POSITIONS = {
  "stardew-valley": { top: 0, left: 0 },
  maplestory: { top: 20, left: 35 },
  tamagotchi: { top: 40, left: 62 },
  thronglets: { top: 45, left: 0 },
  twitch: { top: 75, left: 18 },
};

const isMobileLayout = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px)").matches;

const initialPositions = () => {
  const mobile = isMobileLayout();

  return Object.fromEntries(
    INSPIRATION_ITEMS.map((item) => [
      item.id,
      mobile
        ? (MOBILE_POSITIONS[item.id] ?? { top: item.top, left: item.left })
        : { top: item.top, left: item.left },
    ]),
  );
};

function clampPercent(value, max) {
  return Math.max(0, Math.min(value, max));
}

function clampPosition(
  leftPx,
  topPx,
  itemWidth,
  itemHeight,
  containerWidth,
  containerHeight,
) {
  const maxLeft = Math.max(0, containerWidth - itemWidth);
  const maxTop = Math.max(0, containerHeight - itemHeight);

  return {
    left: (clampPercent(leftPx, maxLeft) / containerWidth) * 100,
    top: (clampPercent(topPx, maxTop) / containerHeight) * 100,
  };
}

function getThumbHeight(article) {
  const thumb = article.querySelector(".blockparty-inspiration-thumb-wrap");
  return thumb?.offsetHeight ?? article.offsetHeight;
}

function isDetailsAbove(topPercent, thumbHeightPx, containerHeightPx) {
  if (!containerHeightPx || !thumbHeightPx) {
    return topPercent >= HALF_THRESHOLD;
  }

  const thumbHeightPercent = (thumbHeightPx / containerHeightPx) * 100;
  const centerPercent = topPercent + thumbHeightPercent / 2;

  return centerPercent >= HALF_THRESHOLD;
}

export default function InspirationGallery() {
  const cloudRef = useRef(null);
  const dragRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [hoverSuppressedId, setHoverSuppressedId] = useState(null);
  const [positions, setPositions] = useState(initialPositions);
  const [containerHeight, setContainerHeight] = useState(0);
  const [thumbHeights, setThumbHeights] = useState({});
  const [detailsHeights, setDetailsHeights] = useState({});

  useLayoutEffect(() => {
    const cloud = cloudRef.current;
    if (!cloud) return undefined;

    const measure = () => {
      setContainerHeight(cloud.clientHeight);

      const thumbs = {};
      const details = {};
      INSPIRATION_ITEMS.forEach((item) => {
        const article = cloud.querySelector(`[data-id="${item.id}"]`);
        const thumb = article?.querySelector(
          ".blockparty-inspiration-thumb-wrap",
        );
        const detailsInner = article?.querySelector(
          ".blockparty-inspiration-details-inner",
        );
        thumbs[item.id] = thumb?.offsetHeight ?? 0;
        details[item.id] = detailsInner?.scrollHeight ?? 0;
      });
      setThumbHeights(thumbs);
      setDetailsHeights(details);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(cloud);
    INSPIRATION_ITEMS.forEach((item) => {
      const inner = cloud.querySelector(
        `[data-id="${item.id}"] .blockparty-inspiration-details-inner`,
      );
      if (inner) observer.observe(inner);
    });

    return () => observer.disconnect();
  }, []);

  const handlePointerDown = useCallback(
    (event, itemId) => {
      if (event.button !== 0) return;

      const article = event.currentTarget;
      const container = cloudRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const position = positions[itemId];

      dragRef.current = {
        id: itemId,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originLeftPx: (position.left / 100) * containerRect.width,
        originTopPx: (position.top / 100) * containerRect.height,
        itemWidth: article.offsetWidth,
        itemHeight: getThumbHeight(article),
        containerWidth: containerRect.width,
        containerHeight: containerRect.height,
        moved: false,
      };

      article.setPointerCapture(event.pointerId);
      setDraggingId(itemId);
      setActiveId(null);
      setHoverSuppressedId(null);
    },
    [positions],
  );

  const handlePointerMove = useCallback((event) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD) {
      drag.moved = true;
      setHoverSuppressedId(drag.id);
    }

    const next = clampPosition(
      drag.originLeftPx + dx,
      drag.originTopPx + dy,
      drag.itemWidth,
      drag.itemHeight,
      drag.containerWidth,
      drag.containerHeight,
    );

    setPositions((prev) => ({ ...prev, [drag.id]: next }));
  }, []);

  const endDrag = useCallback((event, itemId) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== itemId || drag.pointerId !== event.pointerId)
      return;

    event.currentTarget.releasePointerCapture(event.pointerId);

    if (!drag.moved && isTouchDevice()) {
      setActiveId((prev) => (prev === itemId ? null : itemId));
    } else if (drag.moved) {
      setHoverSuppressedId(itemId);
      event.currentTarget.querySelector(".blockparty-inspiration-card")?.blur();
    }

    dragRef.current = null;
    setDraggingId(null);
  }, []);

  return (
    <div
      ref={cloudRef}
      className={`blockparty-inspiration-cloud${
        draggingId ? " blockparty-inspiration-cloud--dragging" : ""
      }`}
      role="list"
      aria-label="Inspiration references"
    >
      {INSPIRATION_ITEMS.map((item) => {
        const position = positions[item.id];
        const isActive = activeId === item.id;
        const isDragging = draggingId === item.id;
        const isHoverSuppressed = hoverSuppressedId === item.id;
        const detailsAbove = isDetailsAbove(
          position.top,
          thumbHeights[item.id] ?? 0,
          containerHeight,
        );

        return (
          <article
            key={item.id}
            role="listitem"
            data-id={item.id}
            className={[
              "blockparty-inspiration-item",
              isActive && "blockparty-inspiration-item--active",
              isDragging && "blockparty-inspiration-item--dragging",
              isHoverSuppressed &&
                "blockparty-inspiration-item--hover-suppressed",
              detailsAbove && "blockparty-inspiration-item--details-above",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{
              top: `${position.top}%`,
              left: `${position.left}%`,
              "--inspiration-width": item.width,
              "--inspiration-z": item.zIndex,
            }}
            onPointerDown={(event) => handlePointerDown(event, item.id)}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => endDrag(event, item.id)}
            onPointerCancel={(event) => endDrag(event, item.id)}
            onPointerLeave={() => {
              if (!draggingId && hoverSuppressedId === item.id) {
                setHoverSuppressedId(null);
              }
            }}
          >
            <div
              className="blockparty-inspiration-card"
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`${item.title}: ${item.description}`}
              style={{
                "--inspiration-details-height": `${detailsHeights[item.id] ?? 0}px`,
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setActiveId((prev) => (prev === item.id ? null : item.id));
              }}
            >
              <div className="blockparty-inspiration-dialog">
                <div className="blockparty-inspiration-thumb-wrap">
                  <img
                    src={item.src}
                    alt=""
                    aria-hidden="true"
                    className="blockparty-inspiration-thumb"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="blockparty-inspiration-details">
                <div className="blockparty-inspiration-details-inner">
                  <h3 className="blockparty-inspiration-item-title">
                    {item.title}
                  </h3>
                  <div className="blockparty-inspiration-desc-row">
                    <p className="blockparty-inspiration-item-desc">
                      {item.description}
                    </p>
                    <span
                      className="blockparty-inspiration-cursor"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
