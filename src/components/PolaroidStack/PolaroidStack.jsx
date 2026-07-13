import React, { useMemo } from "react";
import Stack from "./Stack";
import "./PolaroidStack.css";

function PolaroidStack({ photos = [] }) {
  const polaroidCards = useMemo(() => {
    const source = photos.slice(0, 4);
    return source.map((photo, index) => (
      <img
        key={`${String(photo.src)}-${index}`}
        src={photo.src}
        alt={photo.alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserDrag: "none",
        }}
      />
    ));
  }, [photos]);

  if (polaroidCards.length < 3) return null;

  return (
    <div className="polaroid-stack-container">
      <div
        style={{
          width: 334,
          height: 460, // extra headroom for back polaroid peeking above the stack
          overflow: "visible",
          position: "relative",
        }}
      >
        <div
          style={{
            width: 668, // 2x native width
            height: 826, // 2x display height
            transform: "scale(0.5)",
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Stack
            cards={polaroidCards}
            sensitivity={120}
            randomRotation={true}
            animationConfig={{ stiffness: 260, damping: 20 }}
            sendToBackOnClick={true}
            mobileClickOnly={true}
            animateOnMount={true}
          />
        </div>
      </div>
    </div>
  );
}

export default PolaroidStack;
