import { useRef, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import CursorPill from "../../components/CursorPill/CursorPill";

function parseCssTime(value, fallbackSeconds) {
  const raw = value?.trim();
  if (!raw) return fallbackSeconds;
  if (raw.endsWith("ms")) return parseFloat(raw) / 1000 || fallbackSeconds;
  return parseFloat(raw) || fallbackSeconds;
}

const COLORS = [
  "#57068C",
  "#FFD200",
  "#FF6B6B",
  "#4D96FF",
  "#6BCB77",
  "#FF85A2",
  "#FFA94D",
  "#C77DFF",
];

const COOLDOWN_MS = 1400;
const BATCH_COUNT = 6;
const PARTICLES_PER_BATCH = 28;
const BATCH_INTERVAL_MS = 320;

function createTrickleParticle(viewWidth, viewHeight) {
  const size = 6 + Math.random() * 8;

  return {
    x: (0.02 + Math.random() * 0.96) * viewWidth,
    y: -24 - Math.random() * viewHeight * 0.12,
    w: size,
    h: size * (0.55 + Math.random() * 0.35),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: Math.random() < 0.5 ? "square" : "circle",
    vx: (Math.random() - 0.5) * 1.8,
    vy: 0.35 + Math.random() * 1.1,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 4,
    wobble: Math.random() * 10,
    wobbleSpeed: (Math.random() * 0.04 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
    tilt: Math.random() * 10,
    tiltSpeed: (Math.random() * 0.05 + 0.02) * (Math.random() < 0.5 ? 1 : -1),
    drift: (Math.random() - 0.5) * 0.35,
    gravity: 0.028 + Math.random() * 0.018,
    tick: 0,
    totalTicks: 420 + Math.random() * 220,
  };
}

function fireTrickleConfetti(particlesRef, viewWidth, viewHeight, onSpawn) {
  const timeoutIds = [];

  for (let batch = 0; batch < BATCH_COUNT; batch += 1) {
    const spawn = () => {
      for (let i = 0; i < PARTICLES_PER_BATCH; i += 1) {
        particlesRef.current.push(
          createTrickleParticle(viewWidth, viewHeight),
        );
      }
      onSpawn();
    };

    if (batch === 0) {
      spawn();
    } else {
      timeoutIds.push(window.setTimeout(spawn, batch * BATCH_INTERVAL_MS));
    }
  }

  return timeoutIds;
}

export default function HeroTitleConfetti({ id, className, children }) {
  const titleRef = useRef(null);
  const titleInnerRef = useRef(null);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const cooldownRef = useRef(0);
  const burstTimeoutsRef = useRef([]);
  const [isHovering, setIsHovering] = useState(false);

  const getViewSize = useCallback(() => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvas = canvasRef.current;
    const viewWidth = canvas
      ? canvas.width / dpr
      : window.innerWidth;
    const viewHeight = canvas
      ? canvas.height / dpr
      : window.innerHeight;
    return { viewWidth, viewHeight };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      burstTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const titleEl = titleRef.current;
    const innerEl = titleInnerRef.current;
    if (!titleEl || !innerEl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(innerEl, { y: 0 });
      return;
    }

    const heroSection = titleEl.closest(".blockparty-section--hero");
    const styles = heroSection ? getComputedStyle(heroSection) : null;
    const delay = parseCssTime(
      styles?.getPropertyValue("--blockparty-hero-text-delay"),
      0.4,
    );
    const duration = parseCssTime(
      styles?.getPropertyValue("--blockparty-hero-text-duration"),
      1,
    );

    gsap.set(innerEl, { y: "100%" });
    const tween = gsap.to(innerEl, {
      y: 0,
      duration,
      delay,
      ease: "power2.out",
    });

    return () => tween.kill();
  }, []);

  const drawParticle = useCallback((ctx, particle) => {
    const wobbleX = Math.sin(particle.wobble) * 5;
    const wobbleY = Math.cos(particle.wobble) * 3;
    const scaleX = Math.abs(Math.cos(particle.tilt));
    const fade = Math.min(1, (particle.totalTicks - particle.tick) / 80);

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(particle.x + wobbleX, particle.y + wobbleY);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.scale(scaleX, 1);
    ctx.fillStyle = particle.color;

    if (particle.shape === "circle") {
      ctx.beginPath();
      ctx.arc(0, 0, particle.w / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(
        -particle.w / 2,
        -particle.h / 2,
        particle.w,
        particle.h,
      );
    }

    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const { viewWidth, viewHeight } = getViewSize();
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, viewWidth, viewHeight);

    let active = false;

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const particle = particles[i];

      particle.tick += 1;
      particle.x += particle.vx + particle.drift;
      particle.y += particle.vy;
      particle.vy += particle.gravity;
      particle.vx *= 0.998;
      particle.wobble += particle.wobbleSpeed;
      particle.tilt += particle.tiltSpeed;
      particle.rotation += particle.rotationSpeed;

      if (particle.tick >= particle.totalTicks || particle.y > viewHeight + 40) {
        particles.splice(i, 1);
        continue;
      }

      active = true;
      drawParticle(ctx, particle);
    }

    if (active) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      rafRef.current = null;
      ctx.clearRect(0, 0, viewWidth, viewHeight);
    }
  }, [drawParticle, getViewSize]);

  const startAnimation = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [animate]);

  const triggerConfetti = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const now = Date.now();
    if (now - cooldownRef.current < COOLDOWN_MS) return;
    cooldownRef.current = now;

    if (!canvasRef.current) return;

    burstTimeoutsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    burstTimeoutsRef.current = [];

    const { viewWidth, viewHeight } = getViewSize();

    burstTimeoutsRef.current = fireTrickleConfetti(
      particlesRef,
      viewWidth,
      viewHeight,
      startAnimation,
    );
  }, [getViewSize, startAnimation]);

  return (
    <>
      <CursorPill isHovering={isHovering} text="Click me" />
      <h1
        ref={titleRef}
        id={id}
        className={`${className} blockparty-hero-title--interactive`.trim()}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={triggerConfetti}
      >
        <span className="blockparty-hero-title-line">
          <span
            ref={titleInnerRef}
            className="blockparty-hero-title-line-inner"
          >
            {children}
          </span>
        </span>
      </h1>
      {createPortal(
        <canvas
          ref={canvasRef}
          className="blockparty-confetti-canvas"
          aria-hidden="true"
        />,
        document.body,
      )}
    </>
  );
}
