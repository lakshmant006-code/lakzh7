import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Footer from "../../components/Footer/Footer";
import GrassGlobe from "../../components/GrassGlobe/GrassGlobe";
import useScrollReset from "../../hooks/useScrollReset";
import { fetchFlowers, plantFlower } from "../../utils/flowersApi";
import { recordGardenSession } from "../../utils/gardenStatsApi";
import FlowerModal from "./FlowerModal";
import "./PlantYourFlower.css";

export default function PlantYourFlower() {
  useScrollReset();
  const [modalOpen, setModalOpen] = useState(false);
  const [flowers, setFlowers] = useState([]);
  const [flowersLoading, setFlowersLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [plantError, setPlantError] = useState("");
  const [isPlanting, setIsPlanting] = useState(false);
  const [sessionCount, setSessionCount] = useState(null);
  const [welcomeVisible, setWelcomeVisible] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchFlowers()
      .then((loaded) => {
        if (!cancelled) {
          setFlowers(loaded);
          setLoadError("");
        }
      })
      .catch((err) => {
        console.error("[PlantYourFlower] load flowers", err);
        if (!cancelled) {
          setLoadError(err.message || "Could not load flowers.");
        }
      })
      .finally(() => {
        if (!cancelled) setFlowersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    recordGardenSession()
      .then((count) => {
        if (cancelled) return;
        setSessionCount(count);
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) setWelcomeVisible(true);
          });
        });
      })
      .catch((err) => {
        console.error("[PlantYourFlower] session count", err);
      });

    return () => {
      cancelled = true;
      setWelcomeVisible(false);
    };
  }, []);

  const handlePlant = async (flower) => {
    setPlantError("");
    setIsPlanting(true);

    try {
      const saved = await plantFlower({
        name: flower.name,
        image: flower.image,
        message: flower.message,
      });
      setFlowers((prev) => [...prev, saved]);
      setModalOpen(false);
    } catch (err) {
      console.error("[PlantYourFlower] plant flower", err);
      setPlantError(err.message || "Could not plant your flower.");
    } finally {
      setIsPlanting(false);
    }
  };

  return (
    <main className="plant-your-flower-page">
      <section className="plant-your-flower-hero">
        <div className="plant-your-flower-globe-wrap">
          <GrassGlobe flowers={flowers} />
        </div>

        {loadError ? (
          <p className="plant-your-flower-status plant-your-flower-status--error">
            {loadError}
          </p>
        ) : null}

        {plantError ? (
          <p className="plant-your-flower-status plant-your-flower-status--error">
            {plantError}
          </p>
        ) : null}

        <div className="plant-your-flower-actions">
          <div className="plant-your-flower-actions-inner">
            <div className="plant-your-flower-welcome-slot">
              <p
                className={`plant-your-flower-welcome${
                  welcomeVisible ? " plant-your-flower-welcome--visible" : ""
                }`}
                aria-live="polite"
              >
                {sessionCount === 1 ? (
                  <>
                    1 visitor{" "}
                    <span className="plant-your-flower-text-muted">
                      has checked out this garden.
                    </span>
                  </>
                ) : sessionCount !== null ? (
                  <>
                    {sessionCount.toLocaleString()} visitors{" "}
                    <span className="plant-your-flower-text-muted">
                      have checked out this garden.
                    </span>
                  </>
                ) : null}
                {sessionCount !== null ? (
                  <span className="plant-your-flower-welcome-info">
                    <button
                      type="button"
                      className="plant-your-flower-welcome-info-btn"
                      aria-describedby="plant-your-flower-globe-tooltip"
                      aria-label="About the 3D garden display"
                    >
                      <Info size={16} strokeWidth={2} aria-hidden />
                    </button>
                    <span
                      id="plant-your-flower-globe-tooltip"
                      role="tooltip"
                      className="plant-your-flower-welcome-info-tooltip"
                    >
                      If you&apos;re seeing a solid green ball with no grass,
                      your device may not support the full 3D garden. Try
                      another device for the complete experience.
                    </span>
                  </span>
                ) : null}
              </p>
            </div>
            <div
              className={`plant-your-flower-cta-slot${
                welcomeVisible ? " plant-your-flower-cta-slot--visible" : ""
              }`}
            >
              <button
                type="button"
                className="plant-your-flower-cta"
                onClick={() => setModalOpen(true)}
                disabled={flowersLoading || isPlanting}
              >
                Plant your flower
              </button>
            </div>
          </div>
        </div>
      </section>

      <FlowerModal
        isOpen={modalOpen}
        onClose={() => {
          if (!isPlanting) setModalOpen(false);
        }}
        onPlant={handlePlant}
        isPlanting={isPlanting}
      />

      <Footer />
    </main>
  );
}
