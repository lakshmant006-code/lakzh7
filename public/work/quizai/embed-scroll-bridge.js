/**
 * Same-origin iframe helper: forward wheel/touch to the parent so Lenis
 * keeps scrolling the page. No nested scrolling inside the embed.
 */
(function () {
  const SOURCE = "quizai-embed";

  function forwardWheel(e) {
    if (!window.parent || window.parent === window) return;
    e.preventDefault();
    window.parent.postMessage(
      {
        source: SOURCE,
        type: "wheel",
        deltaY: e.deltaY,
        deltaMode: e.deltaMode,
      },
      "*"
    );
  }

  let touchStartY = 0;
  function onTouchStart(e) {
    if (e.touches && e.touches[0]) touchStartY = e.touches[0].clientY;
  }
  function onTouchMove(e) {
    if (!window.parent || window.parent === window) return;
    if (!e.touches || !e.touches[0]) return;
    const y = e.touches[0].clientY;
    const deltaY = touchStartY - y;
    touchStartY = y;
    if (Math.abs(deltaY) < 1) return;
    e.preventDefault();
    window.parent.postMessage(
      { source: SOURCE, type: "wheel", deltaY: deltaY * 2, deltaMode: 0 },
      "*"
    );
  }

  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  document.documentElement.style.height = "100%";
  document.body.style.height = "100%";

  window.addEventListener("wheel", forwardWheel, { passive: false });
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
})();
