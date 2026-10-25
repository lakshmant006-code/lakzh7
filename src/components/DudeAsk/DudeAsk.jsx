import React, { useCallback, useEffect, useRef, useState } from "react";
import { isSoundEnabled } from "../../utils/uiSounds";
import "./DudeAsk.css";

/**
 * Click the person in the illustration and ask a few questions. Each answer is
 * a recorded clip (public/voice/answers.json lists the question, the words and
 * the audio file), with the words typed out in step with the voice.
 */
export default function DudeAsk({ onClose, onHoverChange }) {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null); // the item being answered
  const [shown, setShown] = useState(0); // characters of the answer revealed
  const audioRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    let alive = true;
    fetch("/voice/answers.json")
      .then((r) => r.json())
      .then((data) => alive && setItems(data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const stop = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audioRef.current = null;
    }
  }, []);

  useEffect(() => stop, [stop]);

  const ask = (item) => {
    stop();
    setCurrent(item);
    setShown(0);

    // With sound off, just show the answer.
    if (!isSoundEnabled()) {
      setShown(item.answer.length);
      return;
    }
    const audio = new Audio(item.audio);
    audioRef.current = audio;
    const tick = () => {
      if (audioRef.current !== audio) return;
      const total = audio.duration || 0;
      const progress = total ? Math.min(1, audio.currentTime / (total * 0.94)) : 0;
      setShown(Math.ceil(item.answer.length * progress));
      if (!audio.ended) frameRef.current = requestAnimationFrame(tick);
      else setShown(item.answer.length);
    };
    audio.addEventListener("playing", () => {
      frameRef.current = requestAnimationFrame(tick);
    });
    audio.addEventListener("error", () => setShown(item.answer.length));
    audio.play().catch(() => setShown(item.answer.length));
  };

  const back = () => {
    stop();
    setCurrent(null);
  };

  const close = () => {
    stop();
    onClose();
  };

  return (
    <div
      className="dude-ask"
      data-sound="on"
      role="dialog"
      aria-label="Ask me a question"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseLeave={() => onHoverChange?.(false)}
    >
      <button type="button" className="dude-ask-close" aria-label="Close" onClick={close}>
        ×
      </button>
      {current ? (
        <>
          <p className="dude-ask-q">{current.question}</p>
          <p className="dude-ask-a" aria-live="polite">
            {current.answer.slice(0, shown)}
            {shown < current.answer.length ? (
              <span className="home-type-caret" aria-hidden="true">|</span>
            ) : null}
          </p>
          <button type="button" className="dude-ask-back" onClick={back}>
            ← more questions
          </button>
        </>
      ) : (
        <>
          <p className="dude-ask-title">ask me something</p>
          <ul className="dude-ask-list">
            {items.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => ask(item)}>
                  {item.question}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
