import React, { useEffect, useState } from "react";
import { ArrowLeft, Info, RefreshCw, X } from "lucide-react";
import { generateRandomName } from "../../utils/randomWords";
import { generateFlowerImage } from "../../utils/flowerImage";
import "./FlowerModal.css";

export default function FlowerModal({
  isOpen,
  onClose,
  onPlant,
  isPlanting = false,
}) {
  const [step, setStep] = useState("form");
  const [suggestedName, setSuggestedName] = useState(() =>
    generateRandomName(),
  );
  const [name, setName] = useState("");
  const [color, setColor] = useState("#a855f7");
  const [message, setMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [generatedFlower, setGeneratedFlower] = useState(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setName("");
      setMessage("");
      setColor("#a855f7");
      setError("");
      setGeneratedFlower(null);
      setIsGenerating(false);
      return;
    }

    const initialName = generateRandomName();
    setSuggestedName(initialName);
    setName(initialName);
  }, [isOpen]);

  if (!isOpen) return null;

  const displayName = name.trim() || suggestedName;

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setIsGenerating(true);

    try {
      const flower = await generateFlowerImage({
        name: displayName,
        color,
        message,
      });
      setGeneratedFlower(flower);
      setStep("preview");
    } catch (err) {
      setError(err.message || "Could not generate your flower.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlant = () => {
    if (!generatedFlower || isPlanting) return;
    onPlant(generatedFlower);
  };

  return (
    <div
      className="flower-modal-overlay"
      role="presentation"
      onClick={isPlanting ? undefined : onClose}
    >
      <div
        className="flower-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="flower-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="flower-modal-close"
          onClick={onClose}
          disabled={isPlanting}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {step === "form" ? (
          <div className="flower-modal-scroll">
            <h2
              id="flower-modal-title"
              className="flower-modal-title flower-modal-title--playfair"
            >
              Plant your flower
            </h2>

            <form className="flower-modal-form" onSubmit={handleCreate}>
              <div className="flower-field">
                <label htmlFor="flower-name">Your name</label>
                <div className="flower-name-row">
                  <input
                    id="flower-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                    autoComplete="name"
                  />
                  <button
                    type="button"
                    className="flower-reroll"
                    onClick={() => {
                      const next = generateRandomName();
                      if (name === suggestedName) {
                        setName(next);
                      }
                      setSuggestedName(next);
                    }}
                    aria-label="Generate a new random name"
                    title="Re-roll name"
                  >
                    <RefreshCw size={18} />
                  </button>
                </div>
              </div>

              <div className="flower-field">
                <span className="flower-label">Flower color</span>
                <div className="flower-color-row">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    aria-label="Custom color"
                  />
                  <span className="flower-color-hex">{color}</span>
                </div>
              </div>

              <div className="flower-field">
                <label htmlFor="flower-message">
                  In one sentence, who are you?
                </label>
                <input
                  id="flower-message"
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="A curious soul who finds joy in small details."
                  maxLength={200}
                />
                <p className="flower-field-hint">
                  Your flower will visually capture this personality.
                </p>
              </div>

              {error ? (
                <p className="flower-modal-error" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className={`flower-modal-primary${isGenerating ? " flower-modal-primary--loading" : ""}`}
                disabled={isGenerating || !message.trim()}
              >
                {isGenerating ? "Creating your flower…" : "Create"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flower-modal-title-row">
              <h2
                id="flower-modal-title"
                className="flower-modal-title flower-modal-title--playfair"
              >
                Your flower is ready.
              </h2>
              <span className="flower-modal-info">
                <button
                  type="button"
                  className="flower-modal-info-btn"
                  aria-describedby="flower-ai-tooltip"
                  aria-label="How this flower was generated"
                >
                  <Info size={18} strokeWidth={2} />
                </button>
                <span
                  id="flower-ai-tooltip"
                  role="tooltip"
                  className="flower-modal-info-tooltip"
                >
                  Generated with Gemini AI from your name, color, and message.
                </span>
              </span>
            </div>

            <div className="flower-modal-scroll">
              <div className="flower-preview-stage">
                {generatedFlower?.image ? (
                  <img
                    src={generatedFlower.image}
                    alt={`Watercolor flower for ${generatedFlower.name}`}
                    className="flower-preview-image"
                  />
                ) : null}
              </div>

              <div className="flower-modal-actions">
                <button
                  type="button"
                  className="flower-modal-back"
                  onClick={() => setStep("form")}
                  aria-label="Go back"
                >
                  <ArrowLeft size={20} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className={`flower-modal-primary${isPlanting ? " flower-modal-primary--loading" : ""}`}
                  onClick={handlePlant}
                  disabled={isPlanting}
                >
                  {isPlanting ? "Planting…" : "Plant"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
