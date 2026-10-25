import React, { useCallback, useEffect, useRef, useState } from "react";
import "./DudeAsk.css";

const TYPE_MS = 32; // time between typed characters

/**
 * Click the person in the illustration and ask a few questions. Each answer is
 * typed out with a soft typewriter click per character (public/voice/answers.json
 * lists the questions and the words).
 */
export default function DudeAsk({ onClose, onHoverChange }) {
  const [items, setItems] = useState([]);
  const [current, setCurrent] = useState(null); // the item being answered
  const [shown, setShown] = useState(0); // characters of the answer revealed
  const timerRef = useRef(null);

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
    clearInterval(timerRef.current);
  }, []);

  useEffect(() => stop, [stop]);

  const ask = (item) => {
    stop();
    setCurrent(item);
    setShown(0);
    let count = 0;
    timerRef.current = setInterval(() => {
      count += 1;
      setShown(count);
      const char = item.answer[count - 1];
      if (count >= item.answer.length) clearInterval(timerRef.current);
    }, TYPE_MS);
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
