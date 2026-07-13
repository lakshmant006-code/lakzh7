import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";

gsap.registerPlugin(ScrollTrigger);

const FOOTER_RISE_DURATION = 1;
const FOOTER_RISE_EASE = "power2.out";
const FOOTER_LINE_STAGGER = 0.12;

const FooterLine = ({ children }) => (
  <span className="footer-line">
    <span className="footer-line-inner">{children}</span>
  </span>
);

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lakshman-thota/",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:lakshmant006@gmail.com",
    external: false,
  },
];

const Footer = () => {
  const footerRef = useRef(null);
  const [timeString, setTimeString] = useState("—:—:—");

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;

    const lineInners = footer.querySelectorAll(".footer-line-inner");
    if (!lineInners.length) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(lineInners, { y: 0 });
      return undefined;
    }

    gsap.set(lineInners, { y: "100%" });

    let scrollTrigger = null;
    const timeoutId = window.setTimeout(() => {
      ScrollTrigger.refresh();
      scrollTrigger = ScrollTrigger.create({
        trigger: footer,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(lineInners, {
            y: 0,
            duration: FOOTER_RISE_DURATION,
            ease: FOOTER_RISE_EASE,
            stagger: FOOTER_LINE_STAGGER,
          });
        },
      });
    }, 100);

    return () => {
      window.clearTimeout(timeoutId);
      if (scrollTrigger) scrollTrigger.kill();
    };
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options = {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setTimeString(now.toLocaleTimeString("en-US", options));
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer ref={footerRef} id="contact" className="footer">
      <div className="footer-container page-content-shell">
        <div className="footer-left-col">
          <div className="footer-blurb">
            <h2 className="footer-title">
              <FooterLine>
                Crafting digital experiences{" "}
                <span className="footer-title-em">from scratch.</span>
              </FooterLine>
            </h2>

            <p className="footer-subtitle">
              <FooterLine>
                Thoughtfully designed. Custom coded.
              </FooterLine>
            </p>

            <p
              className="footer-bio"
              aria-label={`© Lakshman Thota. Current time in Eastern Time: ${timeString}`}
            >
              <FooterLine>© Lakshman Thota | {timeString} ET</FooterLine>
            </p>
          </div>

          <div className="footer-links-col">
            <p className="footer-bio social-links-heading">
              <FooterLine>SAY HI</FooterLine>
            </p>
            <div
              className="social-links"
              role="navigation"
              aria-label="Social links"
            >
              {SOCIAL_LINKS.map(({ label, href, external }) => (
                <a
                  key={label}
                  href={href}
                  {...(external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="social-link"
                  aria-label={external ? `${label} (opens in new tab)` : label}
                >
                  <FooterLine>
                    {label}
                    <span className="arrow" aria-hidden>
                      ↗
                    </span>
                  </FooterLine>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
