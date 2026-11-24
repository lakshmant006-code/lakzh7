import React, { useEffect, useRef } from "react";

/* Text waterfall, in Three.js (needs the `three` package). A sentence is set in strands that run away from you across a floor: close up the
   letters are huge and read as lines, further off they thin out, break apart and scatter, and the whole stream keeps pouring toward you.
   Every letter is one instance of a single quad cut from a glyph atlas, and its place along the flow is worked out in the vertex shader,
   so thousands of letters cost one draw call. Move the pointer to swing the camera.
   Speed is how fast it pours, Strands how many lines run side by side, Scatter how far the far end breaks up, Size the letter size,
   Spacing the gap between letters, Height how high the camera looks from, Lens the field of view. */
const VERT = /* glsl */ `
attribute vec4 aInfo;          // x: strand number from the middle, y: letter index along the strand, z: atlas cell, w: strand speed variation
attribute vec3 aSeed;
uniform float uTime, uSpeed, uScatter, uSize, uN, uGap, uCells, uZFar, uZNear;
varying vec2 vUv; varying float vFade;
void main() {
  float u = fract((uN - aInfo.y) / uN + uTime * uSpeed * 0.035 * aInfo.w);               // 0 far end, 1 right at the camera
  float z = mix(uZFar, uZNear, u);
  float x = aInfo.x * uGap * (0.25 + 1.6 * u);                                      // the lanes fan out as they come close
  float k = pow(clamp(1.0 - u / 0.6, 0.0, 1.0), 1.4) * uScatter;                   // far end: letters drift off their line
  x += (aSeed.x - 0.5) * k * 7.0; z += (aSeed.y - 0.5) * k * 9.0;
  float a = (aSeed.z - 0.5) * k * 6.2832, c = cos(a), s = sin(a);
  vec2 p = position.xy * uSize; p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
  vec3 world = vec3(x - p.y, 0.0, z - p.x);                                         // the letter lies on the floor, its top to the left, reading away from you
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  vUv = vec2((aInfo.z + uv.x) / uCells, uv.y);
  vFade = smoothstep(0.0, 0.05, u) * (1.0 - smoothstep(0.965, 1.0, u));
}`;
const FRAG = /* glsl */ `
uniform sampler2D uMap; varying vec2 vUv; varying float vFade;
void main() { float a = texture2D(uMap, vUv).a * vFade; if (a < 0.02) discard; gl_FragColor = vec4(0.04, 0.04, 0.04, a); }`;

export default function TextWaterfall({ text = "WE ARE ALREADY INFINITE.", speed = 1, strands = 13, scatter = 1, size = 1.35, spacing = 0.95, height = 14, lens = 62, label = 1 }) {
  const host = useRef(null), cfg = useRef({});
  cfg.current = { speed, scatter, height, lens };
  useEffect(() => {
    let dead = false, cleanup = () => {};
    import("three").then((THREE) => {
      if (dead) return;
      const el = host.current, renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setClearColor(0xffffff, 1);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      el.appendChild(renderer.domElement);
      // a glyph atlas: one cell per distinct letter
      const chars = [...new Set(text.toUpperCase().replace(/\s/g, "").split(""))], CELL = 128, cv = document.createElement("canvas");
      cv.width = CELL * chars.length; cv.height = CELL; const g = cv.getContext("2d");
      g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = `800 ${CELL * 0.8}px Inter, "Helvetica Neue", Arial, sans-serif`;
      chars.forEach((ch, i) => g.fillText(ch, CELL * i + CELL / 2, CELL * 0.82));
      const tex = new THREE.CanvasTexture(cv); tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
      // the strands: the text repeated end to end, spaced along the floor
      const glyphs = text.toUpperCase().split(""), ZFAR = -70, ZNEAR = 9, per = Math.max(8, Math.round((ZNEAR - ZFAR) / (size * spacing))), total = strands * per;
      const base = new THREE.PlaneGeometry(1, 1), geo = new THREE.InstancedBufferGeometry(); geo.index = base.index; geo.attributes.position = base.attributes.position; geo.attributes.uv = base.attributes.uv;
      const info = new Float32Array(total * 4), seed = new Float32Array(total * 3), rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
      let n = 0;
      for (let s = 0; s < strands; s++) { const sv = 0.85 + rnd() * 0.3; let gi = Math.floor(rnd() * glyphs.length);
        for (let j = 0; j < per; j++) { let ch = glyphs[gi % glyphs.length]; gi++; if (ch === " ") ch = glyphs[gi++ % glyphs.length] === " " ? chars[0] : glyphs[(gi - 1) % glyphs.length];
          info.set([s - (strands - 1) / 2, j, Math.max(0, chars.indexOf(ch)), sv], n * 4); seed.set([rnd(), rnd(), rnd()], n * 3); n++; } }
      geo.setAttribute("aInfo", new THREE.InstancedBufferAttribute(info, 4)); geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 3)); geo.instanceCount = total;
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uMap: { value: tex }, uTime: { value: 0 }, uSpeed: { value: 1 }, uScatter: { value: 1 }, uSize: { value: size }, uN: { value: per }, uGap: { value: size * 2.1 }, uCells: { value: chars.length }, uZFar: { value: ZFAR }, uZNear: { value: ZNEAR } } });
      const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false;
      const scene = new THREE.Scene(); scene.add(mesh);
      const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 400), P = { x: 0, y: 0, tx: 0, ty: 0 };
      const resize = () => { const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      resize(); const ro = new ResizeObserver(resize); ro.observe(el);
      const mv = (e) => { const r = el.getBoundingClientRect(); P.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; P.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; };
      window.addEventListener("pointermove", mv, { passive: true });
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; let raf, last = performance.now(), t = 0;
      const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now; const c = cfg.current;
        if (!reduce) t += dt; mat.uniforms.uTime.value = t; mat.uniforms.uSpeed.value = c.speed; mat.uniforms.uScatter.value = c.scatter;
        P.x += (P.tx - P.x) * (1 - Math.exp(-dt * 4)); P.y += (P.ty - P.y) * (1 - Math.exp(-dt * 4));
        cam.fov = c.lens; cam.updateProjectionMatrix(); cam.position.set(P.x * 3, c.height - P.y * 1.5, 14); cam.lookAt(P.x * 1.2, 0, -10); renderer.render(scene, cam); };
      raf = requestAnimationFrame(frame);
      cleanup = () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", mv); geo.dispose(); base.dispose(); mat.dispose(); tex.dispose(); renderer.dispose(); renderer.domElement.remove(); };
    });
    return () => { dead = true; cleanup(); };
  }, [text, strands, size, spacing]);
  return (
    <div ref={host} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#fff", borderRadius: 10 }}>
      {label ? <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, zIndex: 2, padding: "6px 8px 7px", background: "#0a0a0a", color: "#f5f5f3", font: "500 8px/1.35 ui-monospace, Menlo, monospace", letterSpacing: ".04em", borderBottomRightRadius: 4, pointerEvents: "none" }}>STG V.WATERFALL<br /><span style={{ color: "#8d8d88" }}>a kinetic type generator</span></div> : null}
    </div>
  );
}
