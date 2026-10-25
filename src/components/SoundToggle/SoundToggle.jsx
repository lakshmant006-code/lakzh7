import React, { useEffect, useState } from "react";
import {
  initUiSounds,
  isSoundEnabled,
  setSoundEnabled,
  subscribeSound,
} from "../../utils/uiSounds";
import "./SoundToggle.css";

/** Starts the hover and press sounds, and shows a small on/off switch. */
const SoundToggle = () => {
  const [on, setOn] = useState(isSoundEnabled);

  useEffect(() => initUiSounds(), []);
  useEffect(() => subscribeSound(setOn), []);

  return (
    <button
      type="button"
      className="sound-toggle"
      aria-pressed={on}
      aria-label={on ? "Turn interface sounds off" : "Turn interface sounds on"}
      title={on ? "Sound on" : "Sound off"}
      onClick={() => setSoundEnabled(!on)}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {on ? (
          <>
            <path d="M15.5 9a4 4 0 0 1 0 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M18 6.5a7.5 7.5 0 0 1 0 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
};

export default SoundToggle;
