/**
 * Start a muted, inline video in a way iOS/iPadOS Safari accepts.
 *
 * React sets `muted` as a DOM property, not an HTML attribute, and Safari can
 * refuse autoplay for a video that doesn't carry the attribute. So mark the
 * element muted + inline first, then play, and retry once the browser has data
 * (a play() before the first frame loads is rejected on some builds).
 */
export function playMutedVideo(video) {
  if (!video) return;
  video.muted = true;
  video.defaultMuted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");

  const tryPlay = () => {
    const played = video.play();
    if (played && played.catch) played.catch(() => {});
  };

  tryPlay();
  if (video.readyState < 2) {
    video.addEventListener("loadeddata", tryPlay, { once: true });
    video.addEventListener("canplay", tryPlay, { once: true });
  }
}
