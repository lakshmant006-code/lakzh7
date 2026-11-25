import React, { useEffect, useRef } from "react";

/* Text waterfall, in Three.js (needs the `three` package). A sentence is set in white strands on black that fall from the top and bend outward as they
   come out at the bottom, read from a screen recording of the effect:
     - At the top every letter falls on its own: some drop 3-5 times faster than the line they are heading for, some barely faster, and each one
       eases out (cubic) as it settles into its place. Speeds between letters differ, but no letter ever overtakes another once it has landed.
     - Once settled the strand is a line of text set with real letter widths (measured from the font) plus Tracking, and the whole line
       scrolls slowly along its curve. Near the bottom the lines speed up again (ease in) as the letters get big and come out.
     - The strands run straight down side by side and bend outward, the outer ones most (Bend).
   Every letter is one instance of a quad cut from a glyph atlas; where it is, how big and how it is turned is worked out in the vertex shader,
   so thousands of letters cost one draw call. Move the pointer to swing the camera.
   Speed: how fast the lines scroll. Fall: how much faster the letters drop in than the line (0 = no falling in). Settle: how far down they ease out
   into their line. Scatter: how loose and tilted they are before they land. Tracking: extra space between letters (em).
   Strands, Size, Bend, Height and Lens shape the picture. */
const VERT = /* glsl */ `
attribute vec4 aInfo;          // x: strand number from the middle, y: where the letter sits along its strand (em), z: atlas cell, w: the strand's own start
attribute vec4 aSeed;          // three randoms for this letter, and the strand's speed variation
uniform float uTime, uSpeed, uScatter, uSize, uLen, uGap, uCells, uZFar, uZNear, uFan, uFall, uSettle, uLnr;
varying vec2 vUv; varying float vFade;
const float A = 0.45, B = 1.15;                                                     // letter scale along the path: A at the top, A + B at the bottom
void main() {
  float zr = uZNear - uZFar;
  float qn = fract(1.0 - aInfo.y / uLen + aInfo.w + uTime * uSpeed * 0.11 * aSeed.w);     // the letter's slot along the line, in letter widths
  float s = (A / B) * (exp(qn * uLnr) - 1.0);                                       // ... turned into a place along the path, so the spacing grows with the letters
  // the individual fall: above its slot at first, dropping in fast, easing out (cubic) until it is in line
  float lag = mix(0.05, 0.42, aSeed.x) * uFall, zone = mix(0.3, 0.62, aSeed.y) * uSettle;
  float e = 1.0 - pow(1.0 - clamp(s / zone, 0.0, 1.0), 3.0);
  float u = s - lag * (1.0 - e);
  float x2 = smoothstep(0.72, 1.0, s); u += 0.07 * x2 * x2;                         // ease in as it comes out at the bottom
  float uc = max(u, 0.0);
  float z = uZFar + zr * u;
  float x = aInfo.x * uGap * (0.5 + uFan * uc * uc);                                // straight down at first, then bending out
  float dx = aInfo.x * uGap * uFan * 2.0 * uc;
  float k = (1.0 - e) * uScatter;                                                    // loose until it lands
  x += (fract(aSeed.x * 91.7) - 0.5) * k * 4.0; z += (fract(aSeed.y * 57.3) - 0.5) * k * 5.0;
  float a = (aSeed.z - 0.5) * k * 6.2832, c = cos(a), sn = sin(a);
  float sc = uSize * (A + B * min(uc, 1.0));                                         // small at the top, big where it comes out
  vec2 p = position.xy * sc * 1.25; p = vec2(c * p.x - sn * p.y, sn * p.x + c * p.y);
  vec2 r = -normalize(vec2(dx, zr)); vec2 up = vec2(r.y, -r.x);                      // the text reads back up its path
  vec3 world = vec3(x + p.x * r.x + p.y * up.x, 0.0, z + p.x * r.y + p.y * up.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
  vUv = vec2((aInfo.z + uv.x) / uCells, uv.y);
  vFade = smoothstep(-0.5, -0.12, u) * (1.0 - smoothstep(0.965, 1.0, s));
}`;
const FRAG = /* glsl */ `
uniform sampler2D uMap; varying vec2 vUv; varying float vFade;
void main() { float a = texture2D(uMap, vUv).a * vFade; if (a < 0.02) discard; gl_FragColor = vec4(0.96, 0.96, 0.94, a); }`;

export default function TextWaterfall({ text = "WE ARE ALREADY INFINITE.", speed = 1, strands = 18, fall = 1, settle = 1, scatter = 0.6, tracking = 0.04, size = 1.2, fan = 5.5, height = 26, lens = 30, label = 1 }) {
  const host = useRef(null), cfg = useRef({});
  cfg.current = { speed, scatter, height, lens, fall, settle };
  useEffect(() => {
    let dead = false, cleanup = () => {};
    import("three").then((THREE) => {
      if (dead) return;
      const el = host.current, renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setClearColor(0x000000, 1);
      renderer.domElement.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
      el.appendChild(renderer.domElement);
      // a glyph atlas, one cell per distinct letter; the font's own advance widths give the real spacing
      const T = text.toUpperCase(), chars = [...new Set(T.replace(/\s/g, "").split(""))], CELL = 128, FONT = CELL * 0.8, cv = document.createElement("canvas");
      cv.width = CELL * chars.length; cv.height = CELL; const g = cv.getContext("2d");
      g.fillStyle = "#fff"; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.font = `800 ${FONT}px Inter, "Helvetica Neue", Arial, sans-serif`;
      chars.forEach((ch, i) => g.fillText(ch, CELL * i + CELL / 2, CELL * 0.82));
      const adv = (ch) => g.measureText(ch).width / FONT;                           // the letter's width in ems
      const tex = new THREE.CanvasTexture(cv); tex.anisotropy = renderer.capabilities.getMaxAnisotropy(); tex.generateMipmaps = true; tex.minFilter = THREE.LinearMipmapLinearFilter;
      const glyphs = T.split(""), sentence = glyphs.reduce((w, ch) => w + (ch === " " ? Math.max(0.28, adv(" ")) : adv(ch)) + tracking, 0) + 0.5;   // one pass of the sentence, with a gap before it repeats
      // the path is 56 long; with letters growing from A to A+B, exactly `Q` ems fit along it: round to whole sentences and nudge the size to match
      const ZFAR = -34, ZNEAR = 22, zr = ZNEAR - ZFAR, A = 0.45, B = 1.15, lnr = Math.log((A + B) / A), Q = (zr * lnr) / (B * size), reps = Math.max(1, Math.round(Q / sentence)), uLen = reps * sentence, sizeEff = (zr * lnr) / (B * uLen);
      const per = glyphs.filter((ch) => ch !== " ").length * reps, total = strands * per;
      const base = new THREE.PlaneGeometry(1, 1), geo = new THREE.InstancedBufferGeometry(); geo.index = base.index; geo.attributes.position = base.attributes.position; geo.attributes.uv = base.attributes.uv;
      const info = new Float32Array(total * 4), seed = new Float32Array(total * 4), rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
      let n = 0;
      for (let s = 0; s < strands; s++) {
        const phase = rnd(), sv = 0.9 + rnd() * 0.2; let em = 0;
        for (let r = 0; r < reps; r++) for (const ch of glyphs) { const w = ch === " " ? Math.max(0.28, adv(" ")) : adv(ch);
          if (ch !== " ") { info.set([s - (strands - 1) / 2, em + w / 2, chars.indexOf(ch), phase], n * 4); seed.set([rnd(), rnd(), rnd(), sv], n * 4); n++; }
          em += w + tracking; }
      }
      geo.setAttribute("aInfo", new THREE.InstancedBufferAttribute(info, 4)); geo.setAttribute("aSeed", new THREE.InstancedBufferAttribute(seed, 4)); geo.instanceCount = n;
      const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { uMap: { value: tex }, uTime: { value: 0 }, uSpeed: { value: 1 }, uScatter: { value: 1 }, uSize: { value: sizeEff }, uLen: { value: uLen }, uGap: { value: sizeEff * 0.62 * 1.2 }, uCells: { value: chars.length }, uZFar: { value: ZFAR }, uZNear: { value: ZNEAR }, uFan: { value: fan }, uFall: { value: 1 }, uSettle: { value: 1 }, uLnr: { value: lnr } } });
      const mesh = new THREE.Mesh(geo, mat); mesh.frustumCulled = false;
      const scene = new THREE.Scene(); scene.add(mesh);
      const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 400), P = { x: 0, y: 0, tx: 0, ty: 0 };
      const resize = () => { const w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight); renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); };
      resize(); const ro = new ResizeObserver(resize); ro.observe(el);
      const mv = (e) => { const r = el.getBoundingClientRect(); P.tx = ((e.clientX - r.left) / r.width - 0.5) * 2; P.ty = ((e.clientY - r.top) / r.height - 0.5) * 2; };
      window.addEventListener("pointermove", mv, { passive: true });
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches; let raf, last = performance.now(), t = 0;
      const frame = (now) => { raf = requestAnimationFrame(frame); const dt = Math.min(0.05, (now - last) / 1000); last = now; const c = cfg.current, u = mat.uniforms;
        if (!reduce) t += dt; u.uTime.value = t; u.uSpeed.value = c.speed; u.uScatter.value = c.scatter; u.uFall.value = c.fall; u.uSettle.value = c.settle;
        P.x += (P.tx - P.x) * (1 - Math.exp(-dt * 4)); P.y += (P.ty - P.y) * (1 - Math.exp(-dt * 4));
        cam.fov = c.lens; cam.updateProjectionMatrix(); cam.position.set(P.x * 4, c.height - P.y * 2, 26); cam.lookAt(P.x * 1.5, 0, -6); renderer.render(scene, cam); };
      raf = requestAnimationFrame(frame);
      cleanup = () => { cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener("pointermove", mv); geo.dispose(); base.dispose(); mat.dispose(); tex.dispose(); renderer.dispose(); renderer.domElement.remove(); };
    });
    return () => { dead = true; cleanup(); };
  }, [text, strands, size, tracking, fan]);
  return (
    <div ref={host} style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", background: "#000", borderRadius: 10 }}>
      {label ? <div aria-hidden="true" style={{ position: "absolute", left: 0, top: 0, zIndex: 2, padding: "6px 8px 7px", background: "#000", boxShadow: "inset 0 0 0 1px #2a2a2a", color: "#f5f5f3", font: "500 8px/1.35 ui-monospace, Menlo, monospace", letterSpacing: ".04em", borderBottomRightRadius: 4, pointerEvents: "none" }}>STG V.WATERFALL<br /><span style={{ color: "#8d8d88" }}>a kinetic type generator</span></div> : null}
    </div>
  );
}
