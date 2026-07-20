import * as THREE from "three";
import { loadMeshParticles, subsampleParticles } from "./meshParticleLoader";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./particleShaders";

const ASSEMBLE_DURATION = 1.3;
const CROSSFADE_DURATION = 1.6;
const CAMERA_FOV = 38;
const AUTO_ROTATE_SPEED = 0.06;
const DRAG_SENSITIVITY = 0.0055;
const MOMENTUM_DECAY = 0.94;
const ROTATION_X_LIMIT = 1.1;
const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2.6;
const WHEEL_ZOOM_SPEED = 0.0012;
const ZOOM_SMOOTHING = 0.15;

function getPixelRatio() {
  return window.innerWidth < 1200
    ? Math.min(window.devicePixelRatio, 1.5)
    : Math.min(window.devicePixelRatio, 2);
}

function getMaxParticles() {
  if (window.innerWidth < 720) return 140000;
  if (window.innerWidth < 1200) return 260000;
  return 500000;
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function easeInCubic(t) {
  return t * t * t;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function createMaterial() {
  const uniforms = {
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uMouse: { value: new THREE.Vector3(9999, 9999, 0) },
    uMouseRadius: { value: 0.1 },
    uMouseStrength: { value: 0.85 },
    uPerspectiveScale: { value: 0 },
    uColor: { value: new THREE.Color(0xffffff) },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return { material, uniforms };
}

function buildGeometry(d) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(d.positions, 3));
  geometry.setAttribute("aNormal", new THREE.BufferAttribute(d.normals, 3));
  geometry.setAttribute("aColor", new THREE.BufferAttribute(d.colorsNorm, 3));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(d.seeds, 1));
  return geometry;
}

function disposeModel(model) {
  model.geometry.dispose();
  model.material.dispose();
}

export async function initParticleFace(container, { modelUrl } = {}) {
  const getSize = () => ({
    width: container.clientWidth || window.innerWidth,
    height: container.clientHeight || window.innerHeight,
  });
  let { width, height } = getSize();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, width / height, 0.05, 100);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(getPixelRatio());
  renderer.setSize(width, height);

  const canvas = renderer.domElement;
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.cursor = "grab";
  canvas.style.touchAction = "none";
  container.appendChild(canvas);

  async function loadAndBuildData(url) {
    const raw = await loadMeshParticles(url);
    const sub = subsampleParticles(raw, getMaxParticles());
    const n = sub.count;
    const positions = new Float32Array(n * 3);
    const colorsNorm = new Float32Array(n * 3);
    const seeds = new Float32Array(n);

    for (let i = 0; i < n; i++) {
      const i3 = i * 3;
      positions[i3] = sub.positions[i3] - sub.center.x;
      positions[i3 + 1] = sub.positions[i3 + 1] - sub.center.y;
      positions[i3 + 2] = sub.positions[i3 + 2] - sub.center.z;
      colorsNorm[i3] = sub.colors[i3] / 255;
      colorsNorm[i3 + 1] = sub.colors[i3 + 1] / 255;
      colorsNorm[i3 + 2] = sub.colors[i3 + 2] / 255;
      seeds[i] = Math.random();
    }

    return { count: n, positions, normals: sub.normals, colorsNorm, seeds, radius: sub.radius };
  }

  function makeModel(data) {
    const geometry = buildGeometry(data);
    const { material, uniforms } = createMaterial();
    const points = new THREE.Points(geometry, material);
    scene.add(points);
    return { points, geometry, material, uniforms, radius: data.radius };
  }

  const initialData = await loadAndBuildData(modelUrl);
  let current = makeModel(initialData);
  let incoming = null;

  let baseDistance = 0;
  let zoomFactor = 1;
  let zoomFactorSmoothed = 1;
  let frameRadius = current.radius;

  function fitCamera() {
    const { width: w, height: h } = getSize();
    camera.aspect = w / h;
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const limitingFov = Math.min(vFov, hFov);
    baseDistance = (frameRadius / Math.sin(limitingFov / 2)) * 1.55;
    camera.position.set(0, 0, baseDistance * zoomFactor);
    camera.updateProjectionMatrix();

    const drawingBufferHeight = renderer.domElement.height;
    const perspectiveScale = drawingBufferHeight / (2 * Math.tan(vFov / 2));
    current.uniforms.uPerspectiveScale.value = perspectiveScale;
    if (incoming) incoming.uniforms.uPerspectiveScale.value = perspectiveScale;
  }

  fitCamera();

  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersection = new THREE.Vector3();
  const mouseTarget = new THREE.Vector3(9999, 9999, 0);
  const sharedMouse = new THREE.Vector3(9999, 9999, 0);
  const localMouseTarget = new THREE.Vector3(9999, 9999, 0);
  const invQuat = new THREE.Quaternion();
  const pointerNdc = new THREE.Vector2(0, 0);
  let pointerActive = false;

  let isDragging = false;
  let lastDragX = 0;
  let lastDragY = 0;
  let manualRotY = 0;
  let manualRotX = 0;
  let velocityY = 0;
  let velocityX = 0;

  const activePointers = new Map();
  let pinchStartDistance = 0;
  let pinchStartZoom = 1;

  function getPinchDistance() {
    const pts = Array.from(activePointers.values());
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }

  function updatePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -(((clientY - rect.top) / rect.height) * 2 - 1);
    pointerActive = true;
    raycaster.setFromCamera(pointerNdc, camera);
    if (raycaster.ray.intersectPlane(plane, intersection)) {
      mouseTarget.copy(intersection);
    }
  }

  function onPointerMove(e) {
    if (activePointers.has(e.pointerId)) {
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (activePointers.size === 2) {
      const dist = getPinchDistance();
      if (pinchStartDistance > 0 && dist > 0) {
        zoomFactor = clamp(pinchStartZoom * (pinchStartDistance / dist), MIN_ZOOM, MAX_ZOOM);
      }
      return;
    }

    updatePointer(e.clientX, e.clientY);

    if (isDragging) {
      const dx = e.clientX - lastDragX;
      const dy = e.clientY - lastDragY;
      lastDragX = e.clientX;
      lastDragY = e.clientY;

      manualRotY += dx * DRAG_SENSITIVITY;
      manualRotX = clamp(manualRotX + dy * DRAG_SENSITIVITY, -ROTATION_X_LIMIT, ROTATION_X_LIMIT);
      velocityY = dx * DRAG_SENSITIVITY;
      velocityX = dy * DRAG_SENSITIVITY;
    }
  }

  function onPointerDown(e) {
    activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    canvas.setPointerCapture?.(e.pointerId);

    if (activePointers.size === 2) {
      isDragging = false;
      pinchStartDistance = getPinchDistance();
      pinchStartZoom = zoomFactor;
      return;
    }

    isDragging = true;
    lastDragX = e.clientX;
    lastDragY = e.clientY;
    velocityY = 0;
    velocityX = 0;
    canvas.style.cursor = "grabbing";
  }

  function endDrag() {
    isDragging = false;
    canvas.style.cursor = "grab";
  }

  function onPointerUp(e) {
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) pinchStartDistance = 0;
    if (activePointers.size === 0) endDrag();
  }

  function onPointerLeave(e) {
    activePointers.delete(e.pointerId);
    if (activePointers.size < 2) pinchStartDistance = 0;
    pointerActive = false;
    mouseTarget.set(9999, 9999, 0);
    sharedMouse.set(9999, 9999, 0);
    if (activePointers.size === 0 && isDragging) endDrag();
  }

  function onWheel(e) {
    e.preventDefault();
    const scale = Math.exp(e.deltaY * WHEEL_ZOOM_SPEED);
    zoomFactor = clamp(zoomFactor * scale, MIN_ZOOM, MAX_ZOOM);
  }

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointercancel", onPointerLeave);
  canvas.addEventListener("wheel", onWheel, { passive: false });

  let resizeTimeout;
  function handleResize() {
    const { width: w, height: h } = getSize();
    renderer.setPixelRatio(getPixelRatio());
    renderer.setSize(w, h);
    fitCamera();
  }

  let resizeObserver;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(handleResize, 80);
    });
    resizeObserver.observe(container);
  } else {
    window.addEventListener("resize", handleResize);
  }

  const clock = new THREE.Clock();
  let disposed = false;
  let parallaxY = 0;
  let parallaxX = 0;
  let pointerWasActive = false;

  let hasAssembled = false;
  let assembleStart = clock.getElapsedTime();
  let crossfadeStart = 0;
  let transitioning = false;

  function switchModel(url) {
    if (transitioning) return;
    transitioning = true;

    loadAndBuildData(url)
      .then((data) => {
        incoming = makeModel(data);
        frameRadius = Math.max(current.radius, incoming.radius);
        fitCamera();
        crossfadeStart = clock.getElapsedTime();
      })
      .catch((err) => {
        console.error("[ParticleFace] switchModel", err);
        transitioning = false;
      });
  }

  renderer.setAnimationLoop(() => {
    if (disposed) return;
    const elapsed = clock.getElapsedTime();
    current.uniforms.uTime.value = elapsed;
    if (incoming) incoming.uniforms.uTime.value = elapsed;

    if (incoming) {
      const t = Math.min((elapsed - crossfadeStart) / CROSSFADE_DURATION, 1);
      current.uniforms.uIntro.value = 1 - easeInCubic(t);
      incoming.uniforms.uIntro.value = easeOutCubic(t);
      if (t >= 1) {
        scene.remove(current.points);
        disposeModel(current);
        current = incoming;
        incoming = null;
        transitioning = false;
        frameRadius = current.radius;
        fitCamera();
      }
    } else if (!hasAssembled) {
      const t = Math.min((elapsed - assembleStart) / ASSEMBLE_DURATION, 1);
      current.uniforms.uIntro.value = easeOutCubic(t);
      if (t >= 1) hasAssembled = true;
    } else {
      current.uniforms.uIntro.value = 1;
    }

    if (!isDragging && (Math.abs(velocityY) > 0.00005 || Math.abs(velocityX) > 0.00005)) {
      manualRotY += velocityY;
      manualRotX = clamp(manualRotX + velocityX, -ROTATION_X_LIMIT, ROTATION_X_LIMIT);
      velocityY *= MOMENTUM_DECAY;
      velocityX *= MOMENTUM_DECAY;
    }

    const targetParallaxY = !isDragging && pointerActive ? pointerNdc.x * 0.12 : 0;
    const targetParallaxX = !isDragging && pointerActive ? -pointerNdc.y * 0.06 : 0;
    parallaxY += (targetParallaxY - parallaxY) * 0.05;
    parallaxX += (targetParallaxX - parallaxX) * 0.05;

    const rotY = elapsed * AUTO_ROTATE_SPEED + manualRotY + parallaxY;
    const rotX = manualRotX + parallaxX;
    current.points.rotation.set(rotX, rotY, 0);
    if (incoming) incoming.points.rotation.set(rotX, rotY, 0);

    zoomFactorSmoothed += (zoomFactor - zoomFactorSmoothed) * ZOOM_SMOOTHING;
    camera.position.set(0, 0, baseDistance * zoomFactorSmoothed);

    invQuat.copy(current.points.quaternion).invert();
    localMouseTarget.copy(mouseTarget).applyQuaternion(invQuat);
    if (pointerActive && !pointerWasActive) {
      // Just started hovering: snap straight to the target instead of
      // lerping in from the far-away "inactive" sentinel, which at this
      // lerp factor would otherwise take ~45 frames (most of a second of
      // holding still) before the disperse radius ever registers.
      sharedMouse.copy(localMouseTarget);
    } else {
      sharedMouse.lerp(localMouseTarget, 0.35);
    }
    pointerWasActive = pointerActive;

    current.uniforms.uMouse.value.copy(sharedMouse);
    if (incoming) incoming.uniforms.uMouse.value.copy(sharedMouse);

    renderer.render(scene, camera);
  });

  return {
    switchModel,
    destroy() {
      disposed = true;
      renderer.setAnimationLoop(null);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointercancel", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }
      clearTimeout(resizeTimeout);
      disposeModel(current);
      if (incoming) disposeModel(incoming);
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    },
  };
}

