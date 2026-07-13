import { forwardRef, useRef } from "react";
import useRiseUpOnScroll from "../../hooks/useRiseUpOnScroll";

const FadeInSection = forwardRef(function FadeInSection(
  { start, delay, className, children, ...rest },
  forwardedRef
) {
  const internalRef = useRef(null);
  const ref = forwardedRef ?? internalRef;

  useRiseUpOnScroll(ref, { start, delay });

  return (
    <section ref={ref} className={className} {...rest}>
      {children}
    </section>
  );
});

export default FadeInSection;
