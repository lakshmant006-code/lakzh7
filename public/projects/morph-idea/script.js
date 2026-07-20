(function () {
  const panel = document.getElementById("panel");
  const dial = document.getElementById("shadowDial");
  const dialValue = document.getElementById("shadowValue");
  const dialIndicator = document.getElementById("dialIndicator");
  const track = document.getElementById("brightnessTrack");
  const handle = document.getElementById("brightnessHandle");
  const brightnessOverlay = document.getElementById("brightnessOverlay");

  const panelButtons = {
    home: panel.querySelector('[data-control="home"]'),
    cloud: panel.querySelector('[data-control="cloud"]'),
    wifi: panel.querySelector('[data-control="wifi"]'),
    flash: panel.querySelector('[data-control="flash"]'),
    reset: panel.querySelector('[data-control="reset"]'),
  };

  const modeButtons = {
    ghost: panel.querySelector('[data-mode="ghost"]'),
    glass: panel.querySelector('[data-mode="glass"]'),
    coffee: panel.querySelector('[data-mode="coffee"]'),
  };

  const MIN_SCREEN_BRIGHTNESS = 0.35;
  const MAX_OVERLAY_OPACITY = 0.55;
  let brightness = 100;
  let draggingDial = false;
  let draggingSlider = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function normalizeAngle(degrees) {
    let angle = degrees % 360;
    if (angle < 0) angle += 360;
    return Math.round(angle);
  }

  function applyShadowAngle(degrees) {
    const rad = (degrees * Math.PI) / 180;
    const hlDist = 7;
    const dkDist = 5;

    panel.style.setProperty("--hl-x", `${(Math.sin(rad) * hlDist).toFixed(2)}px`);
    panel.style.setProperty("--hl-y", `${(Math.cos(rad) * hlDist).toFixed(2)}px`);
    panel.style.setProperty("--dk-x", `${(-Math.sin(rad) * dkDist).toFixed(2)}px`);
    panel.style.setProperty("--dk-y", `${(-Math.cos(rad) * dkDist).toFixed(2)}px`);
  }

  function setShadowAngle(degrees) {
    shadowAngle = normalizeAngle(degrees);
    dialValue.textContent = String(shadowAngle);
    dialIndicator.style.transform = `rotate(${shadowAngle}deg)`;
    dial.setAttribute("aria-valuenow", String(shadowAngle));
    applyShadowAngle(shadowAngle);
  }

  function angleFromPointer(clientX, clientY) {
    const rect = dial.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radians = Math.atan2(clientY - cy, clientX - cx);
    return normalizeAngle((radians * 180) / Math.PI + 90);
  }

  dial.addEventListener("pointerdown", (event) => {
    draggingDial = true;
    dial.setPointerCapture(event.pointerId);
    setShadowAngle(angleFromPointer(event.clientX, event.clientY));
  });

  dial.addEventListener("pointermove", (event) => {
    if (!draggingDial) return;
    setShadowAngle(angleFromPointer(event.clientX, event.clientY));
  });

  dial.addEventListener("pointerup", () => {
    draggingDial = false;
  });

  dial.addEventListener("keydown", (event) => {
    const step = event.shiftKey ? 15 : 5;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      setShadowAngle(shadowAngle + step);
      event.preventDefault();
    } else if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      setShadowAngle(shadowAngle - step);
      event.preventDefault();
    }
  });

  const HANDLE_MIN = 0;
  let handleMax = track.clientHeight - handle.offsetHeight;

  function updateSliderBounds() {
    handleMax = track.clientHeight - handle.offsetHeight;
    setBrightness(brightness);
  }

  function setBrightness(value) {
    brightness = clamp(Math.round(value), 0, 100);
    const ratio = brightness / 100;
    handle.style.top = `${HANDLE_MIN + handleMax * (1 - ratio)}px`;
    handle.setAttribute("aria-valuenow", String(brightness));

    const dimAmount = 1 - ratio;
    brightnessOverlay.style.opacity = String(dimAmount * MAX_OVERLAY_OPACITY);
    document.documentElement.style.filter = `brightness(${MIN_SCREEN_BRIGHTNESS + ratio * (1 - MIN_SCREEN_BRIGHTNESS)})`;
  }

  function ratioFromPointer(clientY) {
    if (handleMax <= 0) return brightness / 100;
    const rect = track.getBoundingClientRect();
    const y = clamp(clientY - rect.top - handle.offsetHeight / 2, HANDLE_MIN, handleMax);
    return 1 - y / handleMax;
  }

  handle.addEventListener("pointerdown", (event) => {
    draggingSlider = true;
    handle.classList.add("is-dragging");
    handle.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  track.addEventListener("pointerdown", (event) => {
    if (event.target === handle || handle.contains(event.target)) return;
    draggingSlider = true;
    handle.classList.add("is-dragging");
    track.setPointerCapture(event.pointerId);
    setBrightness(ratioFromPointer(event.clientY) * 100);
  });

  window.addEventListener("pointermove", (event) => {
    if (!draggingSlider) return;
    setBrightness(ratioFromPointer(event.clientY) * 100);
  });

  window.addEventListener("pointerup", () => {
    if (draggingSlider) {
      draggingSlider = false;
      handle.classList.remove("is-dragging");
    }
  });

  Object.entries(panelButtons).forEach(([key, btn]) => {
    if (key === "reset") {
      btn.addEventListener("click", resetAll);
      return;
    }
    btn.addEventListener("click", () => btn.classList.toggle("is-active"));
  });

  Object.entries(modeButtons).forEach(([key, btn]) => {
    btn.addEventListener("click", () => {
      const isActive = btn.classList.contains("is-active");
      Object.values(modeButtons).forEach((b) => b.classList.remove("is-active"));
      if (!isActive) btn.classList.add("is-active");
    });
  });

  function resetAll() {
    setShadowAngle(0);
    setBrightness(100);
    document.documentElement.style.filter = "";
    panel.querySelectorAll(".neo-btn.is-active").forEach((btn) => {
      btn.classList.remove("is-active");
    });
  }

  window.addEventListener("resize", updateSliderBounds);

  if (typeof ResizeObserver !== "undefined") {
    const sliderObserver = new ResizeObserver(updateSliderBounds);
    sliderObserver.observe(track);
    sliderObserver.observe(handle);
  }

  setShadowAngle(0);
  setBrightness(100);
})();
