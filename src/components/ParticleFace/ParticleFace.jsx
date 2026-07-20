import { useEffect, useRef, useState } from "react";
import { initParticleFace } from "./particleFaceScene";
import "./ParticleFace.css";

const MODELS = [
  { key: "david", url: "/models/david-particles.bin" },
  { key: "dragon", url: "/models/dragon-particles.bin" },
  { key: "elder-tree", url: "/models/elder-tree-particles.bin" },
  { key: "apple", url: "/models/apple-particles.bin" },
  { key: "guest-01", url: "/models/guest-01-particles.bin" },
  { key: "guest-02", url: "/models/guest-02-particles.bin" },
];

const CYCLE_INTERVAL_MS = 8000;

export default function ParticleFace() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let cancelled = false;
    let cycleTimeout = null;
    let modelIndex = 0;

    function scheduleNextModel() {
      cycleTimeout = setTimeout(() => {
        modelIndex = (modelIndex + 1) % MODELS.length;
        sceneRef.current?.switchModel(MODELS[modelIndex].url);
        scheduleNextModel();
      }, CYCLE_INTERVAL_MS);
    }

    initParticleFace(container, { modelUrl: MODELS[0].url })
      .then((scene) => {
        if (cancelled) {
          scene.destroy();
          return;
        }
        sceneRef.current = scene;
        requestAnimationFrame(() => {
          if (!cancelled) setIsVisible(true);
        });
        scheduleNextModel();
      })
      .catch((err) => {
        console.error("[ParticleFace]", err);
      });

    return () => {
      cancelled = true;
      clearTimeout(cycleTimeout);
      setIsVisible(false);
      sceneRef.current?.destroy();
      sceneRef.current = null;
    };
  }, []);

  return (
    <div className={`particle-face${isVisible ? " particle-face--visible" : ""}`}>
      <div className="particle-face-canvas" ref={containerRef} />
    </div>
  );
}
