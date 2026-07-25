import React, { useRef, useEffect } from "react";

/**
 * Drop-in replacement for an autoplaying background <video>.
 *
 * Defers the network request: the file is only fetched once the element scrolls
 * near the viewport (src is set on first intersection), then it plays while
 * visible and pauses when scrolled away. This keeps below-the-fold videos from
 * downloading on initial page load.
 *
 * Any autoPlay/loop/muted/playsInline/preload passed in are intentionally
 * ignored — this component always renders a muted, looping, inline video with
 * preload="none" — so it can be swapped in for a plain <video> without changes.
 *
 * @param {string} rootMargin - how early to start loading before entering view.
 */
const LazyVideo = ({
  src,
  className,
  style,
  poster,
  rootMargin = "400px",
  // swallow eager attributes so they don't re-enable preloading
  autoPlay: _autoPlay,
  loop: _loop,
  muted: _muted,
  playsInline: _playsInline,
  preload: _preload,
  ...rest
}) => {
  const ref = useRef(null);
  const loaded = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!loaded.current && src) {
              video.src = src;
              loaded.current = true;
            }
            const played = video.play();
            if (played && played.catch) played.catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { rootMargin, threshold: 0.01 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, rootMargin]);

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      poster={poster}
      loop
      muted
      playsInline
      preload="none"
      {...rest}
    />
  );
};

export default LazyVideo;
