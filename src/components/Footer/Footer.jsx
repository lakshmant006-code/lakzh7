import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Linkedin, Github, Mail, FileText, Globe } from "lucide-react";
import "./Footer.css";

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
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/lakshmant006-code",
    icon: Github,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:lakshmant006@gmail.com",
    icon: Mail,
    external: false,
  },
  {
    label: "Resume",
    href: "/Lakshman_Thota_Resume.pdf",
    icon: FileText,
    external: false,
  },
  {
    label: "Celestera",
    href: "https://www.celestera.online/?utm_source=portfolio&utm_medium=footer",
    icon: Globe,
    external: true,
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

    let rafId;
    let done = false;

    const animate = () => {
      done = true;
      cancelAnimationFrame(rafId);
      gsap.to(lineInners, {
        y: 0,
        duration: FOOTER_RISE_DURATION,
        ease: FOOTER_RISE_EASE,
        stagger: FOOTER_LINE_STAGGER,
      });
    };

    const poll = () => {
      if (done) return;
      const rect = footer.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        animate();
      } else {
        rafId = requestAnimationFrame(poll);
      }
    };

    rafId = requestAnimationFrame(poll);

    return () => {
      done = true;
      cancelAnimationFrame(rafId);
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
      {/* Hand-drawn scene: the mountain sits behind, clouds drift across on
          top and fade out on the left before coming back in from the right. */}
      <div className="footer-scene" aria-hidden="true">
        <img src="/footer/scene.webp" alt="" className="footer-scene-img" />
        <div className="footer-clouds">
          <div className="footer-clouds-track">
            <img src="/footer/clouds.webp" alt="" className="footer-clouds-copy" />
            <img src="/footer/clouds.webp" alt="" className="footer-clouds-copy" />
          </div>
        </div>
      </div>

      <div className="footer-content page-content-shell">
        <h2 className="footer-title">
          <FooterLine>Coded with love</FooterLine>
          <FooterLine>
            <span className="footer-title-em">and intentionality.</span>
          </FooterLine>
        </h2>

        <nav className="footer-icons" aria-label="Social links">
          {SOCIAL_LINKS.map(({ label, href, icon: Icon, external }) => (
            <a
              key={label}
              href={href}
              {...(label === "Resume"
                ? { onClick: (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("resume:open")); } }   // the resume opens over the page
                : external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="footer-icon-link"
              aria-label={label !== "Resume" && external ? `${label} (opens in new tab)` : label}
              title={label}
            >
              <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            </a>
          ))}
        </nav>

        <p
          className="footer-bio"
          aria-label={`© Lakshman Thota. Current time in Eastern Time: ${timeString}`}
        >
          <FooterLine>© Lakshman Thota | {timeString} ET</FooterLine>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
