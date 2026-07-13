import { ScrollTrigger } from "gsap/ScrollTrigger";

let refreshRaf = null;

/** Debounced ScrollTrigger.refresh for layout shifts (images, masonry columns, etc.). */
export function scheduleScrollTriggerLayoutRefresh() {
  if (refreshRaf != null) cancelAnimationFrame(refreshRaf);
  refreshRaf = requestAnimationFrame(() => {
    refreshRaf = null;
    ScrollTrigger.refresh();
  });
}

/** If the user is pinned near the document bottom, keep them there after height changes. */
export function preserveScrollAtBottom(lenis, thresholdPx = 96) {
  const scrollTop = lenis?.scroll ?? window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll - scrollTop > thresholdPx) return;

  const target = document.documentElement.scrollHeight;
  if (lenis) {
    lenis.scrollTo(target, { immediate: true });
  } else {
    window.scrollTo(0, target);
  }
}
