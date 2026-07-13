import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CARD_COUNT = 7;
const INTRO_SRC = (n) => `/projects/block-party/intro-${n}.png`;

const isTouchDevice = () =>
  window.matchMedia("(hover: none), (pointer: coarse)").matches;

const cardCenterX = (el) => el.offsetLeft + el.offsetWidth / 2;

export default function IntroFan() {
  const fanRef = useRef(null);
  const [liftedId, setLiftedId] = useState(null);

  useEffect(() => {
    const fan = fanRef.current;
    if (!fan) return;

    let revealed = false;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".blockparty-intro-card", fan);
      if (cards.length !== CARD_COUNT) return;

      const finishReveal = () => {
        fan.classList.add("blockparty-intro-fan--revealed");
        gsap.set(cards, { clearProps: "transform,opacity" });
      };

      const reveal = () => {
        if (revealed) return;
        revealed = true;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          finishReveal();
          return;
        }

        const duration = 0.32;
        const overlap = 0.14;

        const tl = gsap.timeline({ onComplete: finishReveal });

        cards.forEach((card, i) => {
          const x =
            i === 0 ? 0 : cardCenterX(cards[i - 1]) - cardCenterX(card);

          gsap.set(card, { x, scale: 0.88, opacity: 0 });
          tl.to(
            card,
            { x: 0, scale: 1, opacity: 1, duration, ease: "power3.out" },
            i === 0 ? 0 : `-=${overlap}`,
          );
        });
      };

      const trigger = ScrollTrigger.create({
        trigger: fan,
        start: "top 88%",
        once: true,
        onEnter: reveal,
      });

      ScrollTrigger.refresh();
      if (trigger.isActive || ScrollTrigger.isInViewport(fan, 0.1)) {
        reveal();
      }
    }, fan);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={fanRef}
      className="blockparty-intro-fan"
      role="group"
      aria-label="Intro photos"
    >
      {Array.from({ length: CARD_COUNT }, (_, i) => {
        const id = i + 1;
        return (
          <div
            key={id}
            className={`blockparty-intro-card${
              liftedId === id ? " blockparty-intro-card--lifted" : ""
            }`}
            style={{ "--fan-index": id }}
            onClick={() =>
              isTouchDevice() &&
              setLiftedId((prev) => (prev === id ? null : id))
            }
          >
            <img
              src={INTRO_SRC(id)}
              alt={`Block Party intro photo ${id}`}
              className="blockparty-intro-card-img"
            />
          </div>
        );
      })}
    </div>
  );
}
