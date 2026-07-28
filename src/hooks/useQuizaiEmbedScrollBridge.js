/**
 * Forward iframe wheel/touch to Lenis so page scrolling stays smooth
 * when the cursor is over QuizAI embeds (no nested iframe scroll).
 */
import { useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";

const SOURCE = "quizai-embed";

export function useQuizaiEmbedScrollBridge() {
  const lenis = useLenis();

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data;
      if (!data || data.source !== SOURCE || data.type !== "wheel") return;
      if (typeof data.deltaY !== "number") return;

      let delta = data.deltaY;
      if (data.deltaMode === 1) delta *= 16;
      if (data.deltaMode === 2) delta *= window.innerHeight;

      if (lenis) {
        const current =
          typeof lenis.targetScroll === "number"
            ? lenis.targetScroll
            : lenis.scroll;
        lenis.scrollTo(current + delta, {
          duration: 0.7,
          force: true,
        });
      } else {
        window.scrollBy({ top: delta, left: 0, behavior: "auto" });
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [lenis]);
}
