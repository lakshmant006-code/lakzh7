import * as THREE from "./vendor/three.module.min.js";

// Everything (custom shaders, canvas textures, built-in materials) works in display colour space,
// so the pixel/dither pass can quantise the final colours directly.
THREE.ColorManagement.enabled = false;

const params = new URLSearchParams(location.search);
const COARSE = matchMedia("(pointer: coarse)").matches;
const Q = +params.get("q") || (COARSE ? 0.6 : 1); // density multiplier
const DPR_CAP = 2;

const canvas = document.getElementById("c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP));
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

/* ---------- seeded random ---------- */
function rng(seed) {
  let s = seed >>> 0;
  const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  r.range = (a, b) => a + (b - a) * r();
  r.gauss = () => (r() + r() + r() + r() - 2) * 1.2;
  return r;
}

/* ---------- shared wind state (uniform objects are shared by reference) ---------- */
const U = {
  uPhase: { value: 0 }, uStrength: { value: 0.8 }, uGust: { value: 0 }, uDir: { value: new THREE.Vector2(0.94, 0.34) },
  uTime: { value: 0 },
};
const SUN = new THREE.Vector3(-0.45, 0.65, 0.5).normalize();

/* ---------- plant material: instanced, wind-bent, vertex-coloured ---------- */
const WIND_GLSL = `
uniform float uPhase, uStrength, uGust; uniform vec2 uDir;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
vec2 windOff(vec2 base, float rnd){
  vec2 along = vec2(dot(base,uDir), dot(base, vec2(-uDir.y,uDir.x)));
  float w1 = vn(vec2(along.x*0.11 - uPhase*0.9, along.y*0.16));
  float w2 = vn(vec2(along.x*0.42 - uPhase*1.9, along.y*0.55 + uPhase*0.2));
  float swell = 0.5 + 0.5*sin(along.x*0.35 - uPhase*2.4 + along.y*0.12);
  float field = 0.55*w1 + 0.25*w2 + 0.35*swell;
  float push = (0.12 + field*1.1 + uGust*(0.4+0.6*swell)) * uStrength;
  float flutter = sin(uPhase*5.0 + rnd*40.0 + base.x*1.3) * (0.25 + 0.5*w2);
  return uDir*push*0.55 + vec2(-uDir.y,uDir.x)*flutter*min(push,1.2)*0.12;
}`;

const PLANT_VS = `
${WIND_GLSL}
attribute vec3 aCol; attribute vec3 aPos; attribute vec4 aI; attribute vec3 aTint;
uniform float uBend; uniform vec3 uCam; uniform float uFogD; uniform vec3 uOff; uniform float uScl;
varying vec3 vCol; varying vec3 vN; varying float vH; varying float vFog; varying vec3 vV;
void main(){
  float yaw = aI.x, hs = aI.y, ws = aI.z, rnd = aI.w;
  vec3 p = vec3(position.x*ws, position.y*hs, position.z*hs) * uScl;
  float c = cos(yaw), s = sin(yaw);
  vec3 q = vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z);
  vec3 n = vec3(c*normal.x + s*normal.z, normal.y, -s*normal.x + c*normal.z);
  float h = max(position.y, 0.0);
  float sw = h*h*uBend;
  vec2 off = windOff(aPos.xz, rnd) * sw * hs;
  q.xz += off;
  q.y -= 0.5*dot(off,off)/max(hs,0.01);
  vec3 world = aPos * uScl + uOff + q;
  vCol = aCol * aTint; vN = n; vH = h;
  vV = normalize(uCam - world);
  vFog = 1.0 - exp(-pow(distance(world, uCam)*uFogD, 1.3));
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;
const PLANT_FS = `
uniform vec3 uSun; uniform vec3 uFog; uniform float uGlow;
varying vec3 vCol; varying vec3 vN; varying float vH; varying float vFog; varying vec3 vV;
void main(){
  vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n;
  float lam = clamp(dot(n,uSun)*0.5+0.5, 0.0, 1.0);
  float trans = pow(clamp(dot(-n,uSun),0.0,1.0), 2.0) * 0.5;
  float ao = mix(0.5, 1.0, smoothstep(0.0, 0.45, vH));
  vec3 light = vec3(0.52,0.60,0.66)*0.6 + vec3(1.05,0.96,0.80)*lam*0.85;
  vec3 c = vCol*light*ao + vCol*vec3(0.5,0.6,0.2)*trans*0.6;
  c += vCol * pow(1.0-abs(dot(n,vV)), 3.0) * uGlow;
  c = mix(c, uFog, vFog);
  gl_FragColor = vec4(c, 1.0);
}`;

function plantMaterial({ bend = 1, fog = [0.78, 0.9, 0.95], fogD = 0.012, glow = 0.12, cam }) {
  return new THREE.ShaderMaterial({
    vertexShader: PLANT_VS, fragmentShader: PLANT_FS, side: THREE.DoubleSide,
    uniforms: {
      uPhase: U.uPhase, uStrength: U.uStrength, uGust: U.uGust, uDir: U.uDir,
      uBend: { value: bend }, uCam: { value: cam.position }, uSun: { value: SUN }, uFog: { value: new THREE.Vector3(...fog) },
      uFogD: { value: fogD }, uGlow: { value: glow }, uOff: { value: new THREE.Vector3() }, uScl: { value: 1 },
    },
  });
}

/* ---------- geometry builder ---------- */
class GB {
  constructor() { this.p = []; this.c = []; this.i = []; }
  grid(rows, cols, fn) {
    const base = this.p.length / 3;
    for (let r = 0; r <= rows; r++) for (let k = 0; k <= cols; k++) {
      const o = fn(k / cols, r / rows); this.p.push(o[0], o[1], o[2]); this.c.push(o[3], o[4], o[5]);
    }
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const a = base + r * (cols + 1) + k, b = a + 1, c = a + cols + 1, d = c + 1;
      this.i.push(a, c, b, b, c, d);
    }
  }
  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(this.p, 3));
    g.setAttribute("aCol", new THREE.Float32BufferAttribute(this.c, 3));
    g.setIndex(this.i); g.computeVertexNormals();
    return g;
  }
}
const mix3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const hex = (h) => [((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255];

/** slender stem, bowed in +x, from y=0 to y=1 */
function addStem(gb, { bow = 0.04, r0 = 0.014, r1 = 0.008, c0 = hex(0x2c6a1a), c1 = hex(0x59a232) }) {
  gb.grid(8, 5, (u, v) => {
    const a = u * Math.PI * 2, cx = bow * Math.sin(v * Math.PI * 0.9), rad = r0 + (r1 - r0) * v;
    return [cx + Math.cos(a) * rad, v, Math.sin(a) * rad, ...mix3(c0, c1, v)];
  });
}
/** a curved petal / leaf: arc from vertical angle phi0 with curl kappa, length L, half-width W */
function addPetal(gb, { y = 1, angle = 0, phi0 = 0.4, kappa = 0.8, L = 0.3, W = 0.12, cup = 0.5, c0, c1, rows = 6, cols = 4, tipPow = 0.75, edge = 0, ox = 0 }) {
  const ca = Math.cos(angle), sa = Math.sin(angle);
  gb.grid(rows, cols, (u, v) => {
    const s = u * 2 - 1;
    const rd = Math.abs(kappa) < 1e-3 ? L * Math.sin(phi0) * v : L * (Math.cos(phi0) - Math.cos(phi0 + kappa * v)) / kappa;
    const yy = Math.abs(kappa) < 1e-3 ? L * Math.cos(phi0) * v : L * (Math.sin(phi0 + kappa * v) - Math.sin(phi0)) / kappa;
    const w = W * Math.pow(Math.max(Math.sin(Math.PI * Math.pow(v, tipPow)), 0), 0.7) * (v < 0.02 ? 0.3 : 1);
    const across = s * w;
    const lift = s * s * w * cup;
    // direction (ca, sa) in xz; across = perpendicular
    const x = ox + ca * rd - sa * across, z = sa * rd + ca * across;
    const col = mix3(c0, c1, Math.pow(v, 1.2));
    const e = 1 + edge * s * s;
    return [x, y + yy + lift, z, col[0] * e, col[1] * e, col[2] * e];
  });
}
function addBlade(gb, { curl = 0.3, c0 = hex(0x1d4a14), c1 = hex(0x7fbf3a), seg = 5 }) {
  gb.grid(seg, 1, (u, v) => {
    const s = u * 2 - 1, w = 0.5 * (1 - Math.pow(v, 1.3));
    const col = mix3(c0, c1, Math.pow(v, 0.9));
    return [s * w, v, curl * v * v, col[0], col[1], col[2]];
  });
}
function addSpike(gb, dir, len, rad, c) {
  const [dx, dy, dz] = dir;
  gb.grid(1, 3, (u, v) => {
    const a = u * Math.PI * 2, r = rad * (1 - v);
    return [dx * len * v + Math.cos(a) * r, dy * len * v + Math.sin(a) * r, dz * len * v, c[0], c[1], c[2]];
  });
}

/* ---------- plant geometries (all in a ~1 unit tall local space) ---------- */
function tulipGeo() {
  const gb = new GB();
  addStem(gb, { bow: 0.05, r0: 0.02, r1: 0.011 });
  for (let k = 0; k < 3; k++) { // broad leaves from the base
    addPetal(gb, { y: 0.02, angle: k * 2.1 + 0.4, phi0: 0.3, kappa: 1.1, L: 0.62, W: 0.1, cup: 0.5, c0: hex(0x1f5a1a), c1: hex(0x66b23a), rows: 7, cols: 4, tipPow: 0.9 });
  }
  const topX = 0.05 * Math.sin(Math.PI * 0.9);
  const pinkBase = hex(0xfff0f5), pinkMid = hex(0xf36a9c), pinkTip = hex(0xd9306f);
  const petal = (angle, phi0, kappa, L, W, c1) => addPetal(gb, { y: 1, ox: topX, angle, phi0, kappa, L, W, cup: 0.9, c0: pinkBase, c1, rows: 6, cols: 4, tipPow: 0.7, edge: 0.18 });
  for (let k = 0; k < 6; k++) petal(k * (Math.PI / 3) + 0.2, 0.5, -0.85, 0.3, 0.13, k % 2 ? pinkMid : pinkTip);
  for (let k = 0; k < 6; k++) petal(k * (Math.PI / 3) + 0.2 + Math.PI / 6, 0.25, -0.6, 0.29, 0.11, pinkMid);
  for (let k = 0; k < 4; k++) petal(k * (Math.PI / 2) + 0.5, 0.05, -0.3, 0.2, 0.08, hex(0xff9ec0));
  return gb.build();
}
function buttercupGeo() {
  const gb = new GB();
  addStem(gb, { bow: 0.07, r0: 0.012, r1: 0.007 });
  addPetal(gb, { y: 0.04, angle: 0.6, phi0: 0.35, kappa: 1.0, L: 0.35, W: 0.07, cup: 0.4, c0: hex(0x2a6a20), c1: hex(0x6fb43a) });
  const topX = 0.07 * Math.sin(Math.PI * 0.9);
  for (let k = 0; k < 5; k++) {
    addPetal(gb, { y: 1, ox: topX, angle: k * (Math.PI * 2 / 5), phi0: 0.95, kappa: -0.55, L: 0.15, W: 0.085, cup: 0.6, c0: hex(0xe0961a), c1: hex(0xffe23a), rows: 4, cols: 4, tipPow: 0.55, edge: 0.12 });
  }
  return gb.build();
}
function dandelionGeo() {
  const gb = new GB();
  addStem(gb, { bow: 0.05, r0: 0.01, r1: 0.007, c0: hex(0x3d7a2a), c1: hex(0x86b84a) });
  const topX = 0.05 * Math.sin(Math.PI * 0.9), r = rng(5);
  for (let k = 0; k < 70; k++) {
    const th = Math.acos(1 - 2 * r()), ph = r() * Math.PI * 2;
    const d = [Math.sin(th) * Math.cos(ph), Math.cos(th), Math.sin(th) * Math.sin(ph)];
    const g = new GB();
    addSpike(g, d, 0.11, 0.004, [0.96, 0.97, 0.99]);
    for (let q = 0; q < g.p.length; q += 3) { gb.p.push(g.p[q] + topX, g.p[q + 1] + 1.0, g.p[q + 2]); }
    const off = (gb.p.length - g.p.length) / 3;
    gb.c.push(...g.c); for (const idx of g.i) gb.i.push(idx + off);
  }
  return gb.build();
}
function smallFlowerGeo(c0, c1) {
  const gb = new GB();
  addStem(gb, { bow: 0.03, r0: 0.014, r1: 0.008 });
  const topX = 0.03 * Math.sin(Math.PI * 0.9);
  for (let k = 0; k < 5; k++) addPetal(gb, { y: 1, ox: topX, angle: k * (Math.PI * 2 / 5), phi0: 1.2, kappa: -0.6, L: 0.2, W: 0.12, cup: 0.5, c0, c1, rows: 3, cols: 3, tipPow: 0.5 });
  return gb.build();
}
function lotusGeo() {
  const gb = new GB();
  const c0 = hex(0xfff6f8), c1 = hex(0xf37aa8), c2 = hex(0xe0457f);
  for (let k = 0; k < 8; k++) addPetal(gb, { y: 0, angle: k * Math.PI / 4, phi0: 1.05, kappa: -0.35, L: 0.5, W: 0.2, cup: 0.5, c0, c1: k % 2 ? c1 : c2, edge: 0.15 });
  for (let k = 0; k < 8; k++) addPetal(gb, { y: 0.03, angle: k * Math.PI / 4 + Math.PI / 8, phi0: 0.55, kappa: 0.2, L: 0.42, W: 0.17, cup: 0.7, c0, c1, edge: 0.15 });
  for (let k = 0; k < 6; k++) addPetal(gb, { y: 0.05, angle: k * Math.PI / 3, phi0: 0.15, kappa: 0.4, L: 0.3, W: 0.12, cup: 0.8, c0: hex(0xffe27a), c1: hex(0xffb0c8) });
  return gb.build();
}
function bladeGeo(curl, c0, c1, seg) {
  const gb = new GB(); addBlade(gb, { curl, c0, c1, seg }); return gb.build();
}
function leafGeo(L, W) { // big arched leaf for pond edges
  const gb = new GB();
  addPetal(gb, { y: 0, angle: 0, phi0: 1.1, kappa: -0.5, L, W, cup: 0.5, c0: hex(0x11501e), c1: hex(0x7ad04a), rows: 10, cols: 6, tipPow: 0.9 });
  return gb.build();
}

/* ---------- instancing ---------- */
function instanced(geo, mat, items) {
  const n = items.length;
  const g = new THREE.InstancedBufferGeometry();
  g.index = geo.index;
  for (const k of ["position", "normal", "aCol"]) g.setAttribute(k, geo.getAttribute(k));
  const pos = new Float32Array(n * 3), inst = new Float32Array(n * 4), tint = new Float32Array(n * 3);
  items.forEach((it, i) => {
    pos.set(it.pos, i * 3); inst.set([it.yaw ?? 0, it.h ?? 1, it.w ?? it.h ?? 1, it.rnd ?? Math.random()], i * 4); tint.set(it.tint ?? [1, 1, 1], i * 3);
  });
  g.setAttribute("aPos", new THREE.InstancedBufferAttribute(pos, 3));
  g.setAttribute("aI", new THREE.InstancedBufferAttribute(inst, 4));
  g.setAttribute("aTint", new THREE.InstancedBufferAttribute(tint, 3));
  g.instanceCount = n;
  const m = new THREE.Mesh(g, mat); m.frustumCulled = false;
  return m;
}
const tintJitter = (r, a = 0.14) => { const k = 1 - a + r() * a * 2; return [k, 1 - a * 0.5 + r() * a, k]; };

/* ---------- particles (petals, seeds) ---------- */
class Particles {
  constructor(max, color, size) {
    this.max = max; this.n = 0;
    this.pos = new Float32Array(max * 3); this.vel = new Float32Array(max * 3); this.life = new Float32Array(max); this.age = new Float32Array(max);
    this.alpha = new Float32Array(max);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute("aA", new THREE.BufferAttribute(this.alpha, 1));
    this.geo = g;
    this.mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color(...color) }, uSize: { value: size }, uPx: { value: 1 } },
      vertexShader: `attribute float aA; uniform float uSize, uPx; varying float vA;
        void main(){ vA=aA; vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = uSize*uPx/max(-mv.z,0.1); gl_Position = projectionMatrix*mv; }`,
      fragmentShader: `uniform vec3 uColor; varying float vA;
        void main(){ vec2 d = gl_PointCoord-0.5; float r = length(d)*2.0; float a = smoothstep(1.0,0.55,r)*vA; if(a<0.01) discard; gl_FragColor = vec4(uColor, a); }`,
    });
    this.points = new THREE.Points(g, this.mat); this.points.frustumCulled = false;
  }
  emit(x, y, z, vx, vy, vz, life) {
    const i = this.n < this.max ? this.n++ : Math.floor(Math.random() * this.max);
    this.pos.set([x, y, z], i * 3); this.vel.set([vx, vy, vz], i * 3); this.life[i] = life; this.age[i] = 0;
  }
  update(dt, wind, gravity) {
    for (let i = 0; i < this.n; i++) {
      this.age[i] += dt;
      const t = this.age[i] / this.life[i];
      if (t >= 1) { this.alpha[i] = 0; continue; }
      const o = i * 3;
      this.vel[o] += (wind.x * 1.6 - this.vel[o]) * dt * 0.8;
      this.vel[o + 2] += (wind.y * 1.6 - this.vel[o + 2]) * dt * 0.8;
      this.vel[o + 1] += gravity * dt;
      this.pos[o] += this.vel[o] * dt; this.pos[o + 1] += this.vel[o + 1] * dt; this.pos[o + 2] += this.vel[o + 2] * dt;
      this.alpha[i] = Math.min(1, t * 8) * (1 - Math.pow(t, 3));
    }
    this.geo.attributes.position.needsUpdate = true; this.geo.attributes.aA.needsUpdate = true;
  }
}

/* ---------- butterfly ---------- */
function makeButterfly() {
  const g = new THREE.Group();
  const shape = new THREE.Shape();
  shape.moveTo(0, 0); shape.bezierCurveTo(0.1, 0.32, 0.5, 0.38, 0.46, 0.08); shape.bezierCurveTo(0.42, -0.06, 0.2, -0.14, 0.14, -0.3);
  shape.bezierCurveTo(0.08, -0.34, 0.02, -0.2, 0, 0);
  const geo = new THREE.ShapeGeometry(shape, 12);
  const mat = new THREE.MeshBasicMaterial({ color: 0xf7fbff, side: THREE.DoubleSide });
  const wl = new THREE.Mesh(geo, mat), wr = new THREE.Mesh(geo, mat);
  wl.scale.x = -1;
  const pl = new THREE.Group(), pr = new THREE.Group();
  pl.add(wl); pr.add(wr);
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.16, 3, 6), new THREE.MeshBasicMaterial({ color: 0x3a4a5a }));
  body.rotation.x = Math.PI / 2;
  g.add(pl, pr, body);
  g.userData = { pl, pr, v: new THREE.Vector3(), target: new THREE.Vector3(), t: Math.random() * 10 };
  g.scale.setScalar(0.8);
  return g;
}
function updateButterfly(b, dt, target, lowAltitude) {
  const d = b.userData; d.t += dt;
  const tx = target.x + Math.sin(d.t * 1.3) * 0.9, tz = target.z + Math.cos(d.t * 0.9) * 0.6, ty = target.y + Math.sin(d.t * 2.1) * 0.25 + (lowAltitude ? 0 : 0.2);
  const k = 1 - Math.exp(-dt * 1.4);
  const px = b.position.x, pz = b.position.z;
  b.position.x += (tx - b.position.x) * k; b.position.y += (ty - b.position.y) * k; b.position.z += (tz - b.position.z) * k;
  const vx = b.position.x - px, vz = b.position.z - pz;
  if (Math.hypot(vx, vz) > 1e-4) b.rotation.y = Math.atan2(vx, vz) + Math.PI;
  const flap = Math.sin(d.t * 22) * 0.9;
  d.pl.rotation.z = -0.2 - flap; d.pr.rotation.z = 0.2 + flap;
}

/* ---------- camera, pointer helpers ---------- */
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
const ray = new THREE.Raycaster();
const ndc = new THREE.Vector2();
function pickPlane(x, y, planeY) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const t = (planeY - ray.ray.origin.y) / ray.ray.direction.y;
  return t > 0 ? ray.ray.at(t, new THREE.Vector3()) : null;
}
function pickZ(x, y, z) {
  const r = canvas.getBoundingClientRect();
  ndc.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ndc, camera);
  const t = (z - ray.ray.origin.z) / ray.ray.direction.z;
  return t > 0 ? ray.ray.at(t, new THREE.Vector3()) : null;
}
function skyTexture(stops) {
  const c = document.createElement("canvas"); c.width = 2; c.height = 256;
  const x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 0, 256);
  stops.forEach(([p, col]) => g.addColorStop(p, col));
  x.fillStyle = g; x.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.NoColorSpace; return t;
}
function hillMesh(z, baseY, amp, freq, colTop, colBot, seed, width = 220) {
  const r = rng(seed), N = 90, pos = [], col = [], idx = [];
  const phase = r() * 6;
  for (let i = 0; i <= N; i++) {
    const x = (i / N - 0.5) * width;
    const top = baseY + amp * (Math.sin(x * freq + phase) * 0.6 + Math.sin(x * freq * 2.3 + phase * 2) * 0.3);
    pos.push(x, top, z, x, baseY - 30, z);
    col.push(...colTop.toArray(), ...colBot.toArray());
    if (i < N) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  return new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, fog: false }));
}

/* =====================================================================
   SCENES
   each: { build(), group, bg, hint, enter(), resize(), update(dt, ctx), tap(x,y), move(x,y) }
   ===================================================================== */
const SCENES = {};

/* ---------- 1. Tulip field ---------- */
SCENES.tulips = () => {
  const group = new THREE.Group(), r = rng(11);
  const FOG = [0.80, 0.92, 0.96];
  const mat = plantMaterial({ bend: 0.5, fog: FOG, fogD: 0.016, glow: 0.12, cam: camera });
  const tulips = [];
  const NT = Math.round(1700 * Q);
  for (let i = 0; i < NT; i++) {
    const z = 5.2 - 26 * Math.pow(r(), 1.5), half = 3.4 + (6 - z) * 0.5;
    tulips.push({ pos: [(r() * 2 - 1) * half, 0, z], yaw: r() * 6.28, h: r.range(0.75, 1.25), w: undefined, tint: [1 + r() * 0.12, 0.9 + r() * 0.18, 0.95 + r() * 0.12], rnd: r() });
  }
  tulips.forEach((t) => { t.w = t.h; });
  group.add(instanced(tulipGeo(), mat, tulips));
  // dense leafy undergrowth
  const NB = Math.round(60000 * Q), blades = [];
  const bladeMat = plantMaterial({ bend: 0.7, fog: FOG, fogD: 0.016, glow: 0.05, cam: camera });
  for (let i = 0; i < NB; i++) {
    const z = 5.6 - 27 * Math.pow(r(), 1.4), half = 3.8 + (6 - z) * 0.52;
    blades.push({ pos: [(r() * 2 - 1) * half, 0, z], yaw: r() * 6.28, h: r.range(0.35, 0.95), w: r.range(0.05, 0.1), tint: tintJitter(r), rnd: r() });
  }
  group.add(instanced(bladeGeo(0.25, hex(0x143c10), hex(0x5fae35), 4), bladeMat, blades));
  // ground + hills
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 120), new THREE.MeshBasicMaterial({ color: 0x143a10 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(0, -0.02, -40); group.add(ground);
  group.add(hillMesh(-48, 2.4, 3.4, 0.045, new THREE.Color(0xc8e86a), new THREE.Color(0x5aa43a), 3));
  group.add(hillMesh(-36, 0.4, 2.0, 0.07, new THREE.Color(0x7fc24a), new THREE.Color(0x2f7a26), 7));
  const petals = new Particles(900, [1.0, 0.55, 0.72], 0.1); group.add(petals.points);
  const butterfly = makeButterfly(); butterfly.position.set(0, 2, 0); group.add(butterfly);
  const target = new THREE.Vector3(0, 1.8, -1);
  let ambient = 0;
  return {
    group, hint: "Tap to scatter petals",
    bg: skyTexture([[0, "#4aa0e8"], [0.55, "#9fd0f0"], [1, "#d9f0f4"]]),
    enter() { camera.position.set(0, 1.1, 7.2); camera.lookAt(0, 1.35, -2); camera.fov = 48; camera.updateProjectionMatrix(); },
    update(dt, c) {
      ambient += dt * (0.6 + c.strength * 2);
      while (ambient > 0.08) {
        ambient -= 0.08;
        petals.emit((Math.random() - 0.5) * 12, 0.8 + Math.random() * 2.2, 1 - Math.random() * 6, 0, 0.1, 0, 4 + Math.random() * 3);
      }
      petals.update(dt, c.dir, -0.35);
      updateButterfly(butterfly, dt, target, true);
    },
    move(x, y) { const p = pickZ(x, y, -1); if (p) target.set(p.x, Math.max(0.7, p.y), p.z); },
    tap(x, y) {
      const p = pickZ(x, y, 0); if (!p) return;
      target.set(p.x, Math.max(0.9, p.y + 0.4), p.z);
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * 6.28, s = 0.8 + Math.random() * 2.4;
        petals.emit(p.x + (Math.random() - 0.5) * 0.4, p.y, p.z + (Math.random() - 0.5) * 0.4, Math.cos(a) * s, 1.4 + Math.random() * 2, Math.sin(a) * s * 0.5, 2.5 + Math.random() * 3);
      }
    },
    petals,
  };
};

/* ---------- 2. Buttercup meadow ---------- */
SCENES.meadow = () => {
  const group = new THREE.Group(), r = rng(23);
  const FOG = [0.70, 0.88, 0.92];
  const mkMat = (bend, glow = 0.1) => plantMaterial({ bend, fog: FOG, fogD: 0.03, glow, cam: camera });
  const place = (n, zNear, zFar, hMin, hMax, extra) => Array.from({ length: n }, () => {
    const z = zNear - (zNear - zFar) * Math.pow(r(), 1.3), half = 2.4 + (zNear - z) * 0.9;
    const h = r.range(hMin, hMax);
    return { pos: [(r() * 2 - 1) * half, 0, z], yaw: r() * 6.28, h, w: h, rnd: r(), ...extra?.(h) };
  });
  const blades = place(Math.round(52000 * Q), 4.2, -10, 1.1, 2.0, (h) => ({ w: r.range(0.025, 0.05), tint: tintJitter(r, 0.2) }));
  group.add(instanced(bladeGeo(0.35, hex(0x0c3a2c), hex(0x6cc44a), 6), mkMat(0.55, 0.06), blades));
  const low = place(Math.round(30000 * Q), 4.4, -6, 0.25, 0.7, () => ({ w: r.range(0.03, 0.05), tint: tintJitter(r, 0.2) }));
  group.add(instanced(bladeGeo(0.3, hex(0x0f4a36), hex(0x3fa59a), 4), mkMat(0.6, 0.05), low));
  group.add(instanced(buttercupGeo(), mkMat(0.5, 0.2), place(Math.round(320 * Q) + 20, 3.6, -6, 1.2, 2.3, () => ({ tint: [1, 0.96 + r() * 0.08, 0.9 + r() * 0.1] }))));
  const puffs = place(Math.round(46 * Q) + 6, 3.4, -4, 1.6, 2.5);
  group.add(instanced(dandelionGeo(), mkMat(0.45, 0.4), puffs));
  const blue = place(Math.round(520 * Q), 3.4, -3, 0.35, 0.65, () => ({ tint: r() < 0.5 ? [0.8, 0.85, 1.1] : [0.95, 0.9, 1.1] }));
  group.add(instanced(smallFlowerGeo(hex(0xe8f0ff), hex(0x6a8cf0)), mkMat(0.5, 0.25), blue));
  const seeds = new Particles(700, [1, 1, 1], 0.06); group.add(seeds.points);
  const butterfly = makeButterfly(); butterfly.position.set(0, 2, 1); group.add(butterfly);
  const target = new THREE.Vector3(0, 1.6, 0);
  let dust = 0;
  const blow = (n, x, y, z) => {
    for (let i = 0; i < n; i++) {
      const s = 0.5 + Math.random() * 1.2;
      seeds.emit(x + (Math.random() - 0.5) * 0.3, y + (Math.random() - 0.5) * 0.3, z + (Math.random() - 0.5) * 0.3, U.uDir.value.x * s * 1.6, 0.4 + Math.random() * 0.9, U.uDir.value.y * s * 1.6, 3 + Math.random() * 4);
    }
  };
  return {
    group, hint: "Tap to blow the dandelions",
    bg: skyTexture([[0, "#2f86e0"], [0.5, "#78bdf0"], [1, "#cdeaf4"]]),
    enter() { camera.position.set(0, 1.5, 7.5); camera.lookAt(0, 1.7, 0); camera.fov = 52; camera.updateProjectionMatrix(); },
    update(dt, c) {
      dust += dt * (0.5 + c.strength * 3);
      while (dust > 0.1) { dust -= 0.1; const p = puffs[Math.floor(Math.random() * puffs.length)]; blow(1, p.pos[0], p.h * 1.0, p.pos[2]); }
      seeds.update(dt, c.dir, 0.05);
      updateButterfly(butterfly, dt, target, false);
    },
    move(x, y) { const p = pickZ(x, y, 0); if (p) target.set(p.x, Math.max(0.9, p.y), p.z); },
    tap(x, y) {
      const p = pickZ(x, y, 0); if (!p) return;
      target.set(p.x, Math.max(1.0, p.y + 0.5), p.z);
      const near = puffs.slice().sort((a, b) => Math.hypot(a.pos[0] - p.x, a.h - p.y) - Math.hypot(b.pos[0] - p.x, b.h - p.y)).slice(0, 5);
      near.forEach((n) => blow(40, n.pos[0], n.h, n.pos[2]));
      blow(60, p.x, p.y, p.z);
    },
  };
};

/* ---------- 3. Pond ---------- */
const WATER_FS = `
uniform float uTime; uniform vec4 uRip[8]; uniform vec2 uDrift;
varying vec3 vW;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<5;i++){ s+=a*vn(p); p=p*2.03+vec2(1.7,9.2); a*=0.5; } return s; }
void main(){
  vec2 p = vW.xz;
  vec2 q = p*0.18 + uDrift;
  float n = fbm(q + fbm(q*1.6 + uTime*0.02));
  vec3 deep = vec3(0.04,0.33,0.84), mid = vec3(0.12,0.52,0.95), cloud = vec3(0.80,0.91,1.0);
  vec3 col = mix(deep, mid, smoothstep(0.25,0.7,n));
  col = mix(col, cloud, smoothstep(0.58,0.82,fbm(q*0.8 - 3.0)) * 0.85);
  float rim = 0.0; vec2 grad = vec2(0.0);
  for(int i=0;i<8;i++){
    vec4 r = uRip[i]; float age = uTime - r.z; if(age<0.0 || age>6.0) continue;
    vec2 d = p - r.xy; float dist = length(d)+1e-4; float front = age*1.9;
    float env = exp(-pow((dist-front)*0.9, 2.0)) * exp(-age*0.55) * r.w;
    float w = sin((dist-front)*9.0);
    rim += env*w; grad += (d/dist) * env * cos((dist-front)*9.0) * 9.0;
  }
  col += vec3(0.5,0.7,0.9) * max(rim,0.0) * 0.55 - vec3(0.06,0.1,0.12) * max(-rim,0.0);
  vec3 nrm = normalize(vec3(-grad.x*0.06, 1.0, -grad.y*0.06));
  float spec = pow(max(dot(nrm, normalize(vec3(-0.4,0.9,0.3))), 0.0), 60.0);
  col += vec3(1.0) * spec * 0.6;
  float sp = pow(vn(p*9.0 + uTime*vec2(0.3,-0.2)), 14.0); col += vec3(0.7,0.9,1.0)*sp*0.5;
  gl_FragColor = vec4(col, 1.0);
}`;
SCENES.pond = () => {
  const group = new THREE.Group(), r = rng(31);
  const waterMat = new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime, uRip: { value: Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, -100, 0)) }, uDrift: { value: new THREE.Vector2() } },
    vertexShader: `varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: WATER_FS,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), waterMat);
  water.rotation.x = -Math.PI / 2; group.add(water);
  group.add(new THREE.HemisphereLight(0xdff0ff, 0x4a5a40, 1.6));
  const sun = new THREE.DirectionalLight(0xfff3dc, 2.2); sun.position.set(-4, 8, 3); group.add(sun);

  // rocks on the left edge
  const edgeL = new THREE.Group(), edgeR = new THREE.Group();
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x9aa0ab, roughness: 0.9, flatShading: false });
  [[0, 0, 0, 1.7, 1.2], [-0.3, 0.2, 1.6, 1.2, 0.9], [0.4, 0.1, -1.7, 1.1, 0.8]].forEach(([x, y, z, sx, sz]) => {
    const g = new THREE.IcosahedronGeometry(1, 3), p = g.attributes.position;
    for (let i = 0; i < p.count; i++) { const px = p.getX(i), py = p.getY(i), pz = p.getZ(i), k = 1 + (Math.sin(px * 5.1 + pz * 3.3) * 0.5 + Math.cos(py * 6.7 - px * 2.9) * 0.5) * 0.09; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); }
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, rockMat); m.scale.set(sx, 0.6, sz); m.position.set(x, y, z); edgeL.add(m);
  });
  group.add(edgeL);

  const leafMat = plantMaterial({ bend: 0.8, fog: [1, 1, 1], fogD: 0.0, glow: 0.15, cam: camera });
  const leaves = [];
  const NL = Math.round(22 * Math.max(Q, 0.5));
  for (let i = 0; i < NL; i++) {
    leaves.push({ pos: [r.range(-0.4, 0.6), 0.25 + r() * 0.5, r.range(-3.2, 3.8)], yaw: Math.PI + r.range(-0.7, 0.7), h: r.range(0.9, 1.7), w: r.range(0.9, 1.6), tint: tintJitter(r, 0.1), rnd: r() });
  }
  edgeR.add(instanced(leafGeo(2.6, 0.5), leafMat, leaves));
  group.add(edgeR);

  // lily pads with lotus flowers
  const pads = [], lotusItems = [];
  const padMat = new THREE.MeshStandardMaterial({ color: 0x3f9a34, roughness: 0.6, side: THREE.DoubleSide });
  const padGeo = new THREE.CircleGeometry(1, 40, 0.35, Math.PI * 2 - 0.7); padGeo.rotateX(-Math.PI / 2);
  [[-1.3, 0.8, 0.9], [1.1, -1.1, 0.75], [0.2, 1.9, 0.6], [-0.4, -1.6, 0.55], [2.0, 1.2, 0.5]].forEach(([x, z, s], i) => {
    const m = new THREE.Mesh(padGeo, padMat); m.scale.set(s, 1, s); m.position.set(x, 0.03, z); m.rotation.y = r() * 6.28;
    m.userData.s = i; group.add(m); pads.push(m);
    if (i < 2) lotusItems.push({ pos: [x, 0.05, z], yaw: r() * 6.28, h: s * 0.9, w: s * 0.9, tint: [1, 1, 1], rnd: r() });
  });
  const lotusMat = plantMaterial({ bend: 0.0, fog: [1, 1, 1], fogD: 0, glow: 0.2, cam: camera });
  group.add(instanced(lotusGeo(), lotusMat, lotusItems));

  const butterfly = makeButterfly(); butterfly.position.set(1, 1.4, 0); group.add(butterfly);
  const target = new THREE.Vector3(0, 1, 0);
  let ripIdx = 0, lastRip = 0, lastP = new THREE.Vector3(), ambient = 0;
  const ripple = (x, z, amp) => { waterMat.uniforms.uRip.value[ripIdx % 8].set(x, z, U.uTime.value, amp); ripIdx++; };
  const extents = () => {
    const hh = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.y, hw = hh * camera.aspect;
    edgeL.position.set(-hw - 0.3, 0, -hh * 0.1);
    const k = Math.max(0.6, Math.min(1.2, hh / 3.6));
    edgeL.scale.setScalar(k); leafMat.uniforms.uScl.value = k;
    leafMat.uniforms.uOff.value.set(hw - 0.9 * k, 0, 0);
  };
  return {
    group, hint: "Move over the water, tap for a big ripple", bg: new THREE.Color(0x2a78d8),
    enter() { camera.position.set(0, 9, 0.001); camera.up.set(0, 0, -1); camera.fov = 40; camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); extents(); },
    leave() { camera.up.set(0, 1, 0); },
    resize: extents,
    update(dt, c) {
      waterMat.uniforms.uDrift.value.addScaledVector(U.uDir.value, dt * 0.01 * (0.4 + c.strength));
      ambient += dt * (0.2 + c.strength * 1.1);
      while (ambient > 1) { ambient -= 1; ripple((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 6, 0.35); }
      pads.forEach((p, i) => { p.position.y = 0.03 + Math.sin(U.uTime.value * 0.9 + i * 1.7) * 0.012; p.rotation.z = Math.sin(U.uTime.value * 0.6 + i) * 0.015; });
      updateButterfly(butterfly, dt, target, false);
    },
    move(x, y) {
      const p = pickPlane(x, y, 0); if (!p) return;
      target.set(p.x, 1.2, p.z);
      const now = U.uTime.value;
      if (now - lastRip > 0.16 && p.distanceTo(lastP) > 0.35) { ripple(p.x, p.z, 0.45); lastRip = now; lastP.copy(p); }
    },
    tap(x, y) { const p = pickPlane(x, y, 0); if (p) { target.set(p.x, 1.2, p.z); ripple(p.x, p.z, 1.4); ripple(p.x, p.z, 0.8); Sound.plink(1); setTimeout(() => Sound.plink(0.5), 150); } },
  };
};



/* ---------- 4. Jungle canopy: big rendered leaves in dappled light ---------- */
const LEAF_VS = `
${WIND_GLSL}
attribute vec2 aUV; attribute vec4 aA; attribute vec4 aR; attribute vec2 aT;
varying vec2 vUV; varying vec3 vN; varying vec3 vW; varying float vRnd; varying float vHue; varying float vLen;
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,s,0., -s,c,0., 0.,0.,1.); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
void main(){
  float sc = aA.w, rnd = aR.w, v = aUV.y;
  float sway = sin(uPhase*1.3 + rnd*6.283 + aA.x*0.45) * (0.03 + 0.05*uStrength) + uGust*0.07*sin(uPhase*3.0 + rnd*9.0);
  mat3 R = rotY(aR.x) * rotZ(aR.y + sway * 0.6) * rotX(aR.z + sway * 0.35);
  vec3 p = R * (position * sc);
  vec2 wo = windOff(aA.xz, rnd) * 0.07 * v * sc * uStrength;
  p.xz += wo;
  vec3 world = aA.xyz + p;
  vUV = aUV; vN = R * normal; vW = world; vRnd = rnd; vHue = aT.y; vLen = v;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}`;
const LEAF_FS = `
uniform float uTime; uniform float uKind; uniform vec3 uSun; uniform vec3 uCam; uniform vec3 uPtr; uniform float uPtrA;
varying vec2 vUV; varying vec3 vN; varying vec3 vW; varying float vRnd; varying float vHue; varying float vLen;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
float fbm(vec2 p){ float a=0.5, s=0.0; for(int i=0;i<4;i++){ s+=a*vn(p); p=p*2.03+vec2(1.7,9.2); a*=0.5; } return s; }
float sunMask(vec3 w){
  vec2 p = w.xz + w.y * vec2(0.55, 0.35);                 // light slants through the canopy
  float n = fbm(p * 0.30 + vec2(uTime * 0.012, 0.0));
  float shaft = 0.5 + 0.5 * sin((p.x * 0.62 - p.y * 0.38) * 0.95 + 1.3 + n * 2.0);
  float m = smoothstep(0.55, 0.64, n * 0.78 + shaft * 0.36);
  float d = distance(w.xz, uPtr.xz);                       // the pointer opens a gap in the leaves
  m = max(m, smoothstep(2.6, 0.2, d) * uPtrA);
  return m;
}
void main(){
  vec3 n = normalize(vN); if(!gl_FrontFacing) n = -n;
  float u = vUV.x, v = vUV.y;
  // veins
  float mid = smoothstep(0.075, 0.0, abs(u)) * (1.0 - v * 0.55);
  float side = 0.0;
  if (uKind < 0.5) {
    float f = fract(v * 17.0 - abs(u) * 2.6 + vRnd * 3.0);
    side = smoothstep(0.075, 0.0, min(f, 1.0 - f)) * smoothstep(0.09, 0.22, abs(u)) * (1.0 - abs(u) * 0.45);
  } else if (uKind < 1.5) {
    float a = atan(u * 0.78, v + 0.06);
    float f = fract(a * 5.2 + vRnd);
    side = smoothstep(0.07, 0.0, min(f, 1.0 - f)) * smoothstep(0.08, 0.3, v) * (1.0 - smoothstep(0.55, 1.0, v) * 0.7);
    float f2 = fract(v * 11.0 - abs(u) * 1.3);                         // fine cross veins
    side = max(side, smoothstep(0.05, 0.0, min(f2, 1.0 - f2)) * 0.35 * smoothstep(0.2, 0.5, abs(u)));
  }
  float vein = max(mid, side * 0.8);
  float mott = fbm(vec2(u * 3.0 + vRnd * 9.0, v * 9.0));
  float lam = clamp(dot(n, uSun) * 0.5 + 0.5, 0.0, 1.0);
  float trans = pow(clamp(dot(-n, uSun), 0.0, 1.0), 1.4);
  float lit = sunMask(vW);

  vec3 shadowCol = vec3(0.02, 0.12, 0.11), midCol = vec3(0.10, 0.36, 0.19), sunCol = mix(vec3(0.56, 0.78, 0.24), vec3(0.74, 0.86, 0.30), vHue);
  vec3 col = mix(shadowCol * (0.8 + 0.5 * mott), midCol * (0.7 + 0.5 * mott), 0.25 + 0.5 * lam);
  col = mix(col, sunCol * (0.62 + 0.38 * lam) * (0.8 + 0.3 * mott), lit * 0.88);
  col += vec3(0.30, 0.46, 0.06) * trans * lit * 0.45;                  // light shining through the blade
  vec3 veinCol = mix(vec3(0.30, 0.52, 0.30), vec3(0.86, 0.93, 0.62), lit);
  col = mix(col, veinCol, vein * (0.28 + 0.4 * lit));
  col *= 1.0 - 0.45 * pow(abs(u), 5.0);                                // darker, rolled edges
  if (uKind > 1.5) col *= 0.82;                                        // ferns sit deeper
  float depth = smoothstep(0.1, 3.4, vW.y);
  col *= mix(0.10, 1.0, depth);                                        // the understory falls into dark teal
  col = mix(col, vec3(0.02, 0.09, 0.09), (1.0 - depth) * 0.5);
  gl_FragColor = vec4(col, 1.0);
}`;

function leafMesh(geo, kind, items, uniforms) {
  const n = items.length;
  const g = new THREE.InstancedBufferGeometry();
  g.index = geo.index;
  for (const k of ["position", "normal", "aUV"]) g.setAttribute(k, geo.getAttribute(k));
  const A = new Float32Array(n * 4), R = new Float32Array(n * 4), T = new Float32Array(n * 2);
  items.forEach((it, i) => { A.set([...it.pos, it.s], i * 4); R.set([it.yaw, it.pitch, it.roll ?? 0, it.rnd], i * 4); T.set([kind, it.hue ?? Math.random()], i * 2); });
  g.setAttribute("aA", new THREE.InstancedBufferAttribute(A, 4));
  g.setAttribute("aR", new THREE.InstancedBufferAttribute(R, 4));
  g.setAttribute("aT", new THREE.InstancedBufferAttribute(T, 2));
  g.instanceCount = n;
  const mat = new THREE.ShaderMaterial({ vertexShader: LEAF_VS, fragmentShader: LEAF_FS, side: THREE.DoubleSide,
    uniforms: { ...uniforms, uKind: { value: kind } } });
  const m = new THREE.Mesh(g, mat); m.frustumCulled = false; return m;
}
/** one broad leaf, length 1 along +x, base at the origin: kind 0 long and pointed, kind 1 round and heart-based */
function broadLeafGeo(kind) {
  const rows = 22, cols = 14, pos = [], uv = [], idx = [];
  for (let r = 0; r <= rows; r++) for (let k = 0; k <= cols; k++) {
    const v = r / rows, u = k / cols * 2 - 1;
    let w;
    if (kind === 0) w = 0.34 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.78)), 0.8);
    else w = 0.56 * Math.pow(Math.sin(Math.PI * Math.pow(v, 0.62)), 0.55) * (1 - 0.18 * v);
    const wave = 0.022 * Math.sin(v * 26 + u * 3) * u * u;
    const y = 0.2 * Math.sin(Math.PI * v * 0.6) - 0.34 * v * v + (kind === 0 ? 0.32 : 0.22) * u * u * w + wave;
    pos.push(v, y, u * w); uv.push(u, v);
  }
  for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
    const a = r * (cols + 1) + k, b = a + 1, c = a + cols + 1, d = c + 1; idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aUV", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}
function fernGeo() {
  const pos = [], uv = [], idx = [];
  const rach = (t) => [t, 0.34 * Math.sin(Math.PI * 0.5 * t) - 0.38 * t * t];
  for (let i = 0; i < 18; i++) {
    const t = (i + 1) / 19, [bx, by] = rach(t), [nx, ny] = rach(t + 0.02);
    const tx = nx - bx, ty = ny - by, tl = Math.hypot(tx, ty), Tx = tx / tl, Ty = ty / tl;
    for (const side of [-1, 1]) {
      const a = 1.05, len = 0.2 * (1 - t * 0.72);
      const dx = Tx * Math.cos(a), dy = Ty * Math.cos(a), dz = side * Math.sin(a);
      const dl = Math.hypot(dx, dy, dz), D = [dx / dl, dy / dl, dz / dl];
      const wl = Math.hypot(D[2], D[0]) || 1, Wd = [D[2] / wl, 0, -D[0] / wl];
      const base = pos.length / 3;
      for (let j = 0; j <= 3; j++) {
        const sj = j / 3, ww = 0.032 * len / 0.2 * Math.pow(Math.sin(Math.PI * Math.min(sj, 0.98)), 0.7);
        const cx = bx + D[0] * len * sj, cy = by + D[1] * len * sj - 0.05 * len * sj * sj, cz = D[2] * len * sj;
        pos.push(cx + Wd[0] * ww, cy, cz + Wd[2] * ww, cx - Wd[0] * ww, cy, cz - Wd[2] * ww);
        uv.push(1, sj, -1, sj);
      }
      for (let j = 0; j < 3; j++) { const q = base + j * 2; idx.push(q, q + 2, q + 1, q + 1, q + 2, q + 3); }
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("aUV", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}

SCENES.canopy = () => {
  const group = new THREE.Group(), r = rng(47);
  const uni = {
    uPhase: U.uPhase, uStrength: U.uStrength, uGust: U.uGust, uDir: U.uDir, uTime: U.uTime,
    uSun: { value: new THREE.Vector3(-0.35, 0.85, -0.3).normalize() }, uCam: { value: camera.position },
    uPtr: { value: new THREE.Vector3(0, 1.8, 0) }, uPtrA: { value: 0 },
  };
  const J = (a) => (r() * 2 - 1) * a;
  // the big leaves in front, cut by the frame, like the reference
  const hero = [
    { pos: [-6.6, 3.5, -2.2], yaw: 0.15, pitch: -0.22, roll: 0.15, s: 7.6, rnd: r() },
    { pos: [-3.6, 3.9, 4.8], yaw: 0.75, pitch: -0.3, roll: -0.1, s: 6.4, rnd: r() },
  ];
  const heroLong = [
    { pos: [7.8, 2.9, -2.4], yaw: Math.PI - 0.3, pitch: -0.28, roll: 0.1, s: 8.4, rnd: r() },
    { pos: [2.2, 2.5, 5.6], yaw: -Math.PI / 2 + 0.15, pitch: -0.12, roll: 0.0, s: 6.2, rnd: r() },
    { pos: [4.6, 3.3, 3.0], yaw: Math.PI + 0.55, pitch: -0.34, roll: -0.12, s: 5.6, rnd: r() },
  ];
  const ring = (rMin, rMax) => { const a = r() * 6.283, d = r.range(rMin, rMax); return [Math.cos(a) * d * 1.45, Math.sin(a) * d * 0.9 - 0.8]; };
  const mid = Array.from({ length: Math.round(13 * Math.max(Q, 0.6)) }, () => {
    const [x, z] = ring(3.2, 7); const yaw = Math.atan2(-z - 0.8, -x) * -1 + J(0.5);
    return { pos: [x, r.range(1.3, 2.7), z], yaw, pitch: r.range(-0.42, -0.05), roll: J(0.25), s: r.range(2.6, 4.4), rnd: r(), hue: r() };
  });
  const midRound = Array.from({ length: 4 }, () => {
    const [x, z] = ring(4, 7.5);
    return { pos: [x, r.range(1.2, 2.2), z], yaw: r() * 6.28, pitch: r.range(-0.35, -0.05), roll: J(0.2), s: r.range(2.2, 3.4), rnd: r(), hue: r() };
  });
  const low = Array.from({ length: Math.round(46 * Math.max(Q, 0.5)) }, () => ({
    pos: [J(9), r.range(0.2, 1.0), r.range(-7, 5.5)], yaw: r() * 6.28, pitch: r.range(-0.1, 0.55), roll: J(0.3), s: r.range(1.0, 2.2), rnd: r(), hue: r(),
  }));
  const ferns = Array.from({ length: Math.round(90 * Math.max(Q, 0.5)) }, () => ({
    pos: [J(9), r.range(0.1, 0.8), r.range(-7, 5.5)], yaw: r() * 6.28, pitch: r.range(-0.2, 0.3), roll: J(0.3), s: r.range(1.3, 2.6), rnd: r(), hue: r(),
  }));
  const carpet = Array.from({ length: Math.round(420 * Math.max(Q, 0.4)) }, () => ({
    pos: [J(10), r.range(0.02, 0.35), r.range(-8, 6)], yaw: r() * 6.28, pitch: r.range(0.0, 0.7), roll: J(0.4), s: r.range(0.45, 1.0), rnd: r(), hue: r(),
  }));
  group.add(leafMesh(broadLeafGeo(0), 0, [...heroLong, ...mid, ...low, ...carpet], uni));
  group.add(leafMesh(broadLeafGeo(1), 1, [...hero, ...midRound], uni));
  group.add(leafMesh(fernGeo(), 2, ferns, uni));
  // dark forest floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShaderMaterial({
    uniforms: { uTime: U.uTime },
    vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",
    fragmentShader: `uniform float uTime; varying vec3 vW;
      float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
      float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
      void main(){ float n = vn(vW.xz * 1.6) * 0.6 + vn(vW.xz * 5.0) * 0.4;
        gl_FragColor = vec4(mix(vec3(0.01, 0.045, 0.05), vec3(0.05, 0.16, 0.12), n), 1.0); }`,
  }));
  floor.rotation.x = -Math.PI / 2; group.add(floor);
  /* leaves that let go: a tap starts a slow, drifting fall; a few also come away on their own */
  const FALL = 56;
  const leafShape = new THREE.Shape();
  leafShape.moveTo(0, -0.55); leafShape.bezierCurveTo(0.42, -0.3, 0.46, 0.25, 0, 0.6); leafShape.bezierCurveTo(-0.46, 0.25, -0.42, -0.3, 0, -0.55);
  const fallMesh = new THREE.InstancedMesh(new THREE.ShapeGeometry(leafShape, 8), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), FALL);
  fallMesh.frustumCulled = false; fallMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const greens = [0x2c6f3b, 0x3f9147, 0x6aa84f, 0x9cc65a, 0x5f9b45].map((h) => new THREE.Color(h));
  const dummy = new THREE.Object3D(), fall = [];
  for (let i = 0; i < FALL; i++) { fall.push({ on: false, x: 0, y: 0, z: 0, t: 0, ph: 0, sp: [0, 0, 0], s: 1, sink: 0 }); fallMesh.setColorAt(i, greens[i % greens.length]); dummy.scale.setScalar(0); dummy.updateMatrix(); fallMesh.setMatrixAt(i, dummy.matrix); }
  group.add(fallMesh);
  let shower = 0, spawnAcc = 0, ambientAcc = 0, landed = 0;
  const release = () => {
    const l = fall.find((q) => !q.on); if (!l) return;
    l.on = true; l.x = J(7.5); l.z = r.range(-6, 3.5); l.y = r.range(5.2, 8); l.t = 0; l.ph = r() * 6.28; l.s = r.range(0.55, 1.0);
    l.sp = [r.range(-1.1, 1.1), r.range(-0.9, 0.9), r.range(-1.4, 1.4)]; l.sink = r.range(0.42, 0.7);
  };
  let idle = 0;
  return {
    group, bg: new THREE.Color(0x03120f),
    enter() { camera.position.set(0.4, 9.2, 3.6); camera.up.set(0, 1, 0); camera.fov = 50; camera.lookAt(0, 0, -0.9); camera.updateProjectionMatrix(); },
    update(dt, c) {
      idle += dt;
      uni.uPtrA.value = ease(uni.uPtrA.value, idle < 2.4 ? 0.9 : 0.0, dt, 0.5);
      // the shower: fades out over a few seconds after the last tap; between taps a leaf lets go now and then
      shower = Math.max(0, shower - dt);
      spawnAcc += dt * 9 * Math.min(1, shower / 2.2); while (spawnAcc >= 1) { spawnAcc -= 1; release(); }
      ambientAcc += dt * 0.22; while (ambientAcc >= 1) { ambientAcc -= 1; release(); }
      const wx = U.uDir.value.x * (0.25 + c.strength * 0.5), wz = U.uDir.value.y * (0.25 + c.strength * 0.5);
      for (let i = 0; i < FALL; i++) {
        const l = fall[i];
        if (l.on) {
          l.t += dt; l.y -= l.sink * dt;
          l.x += (wx + Math.sin(l.t * 1.3 + l.ph) * 0.45) * dt; l.z += (wz * 0.6 + Math.cos(l.t * 1.1 + l.ph) * 0.3) * dt;
          if (l.y <= 0.12) { l.on = false; dummy.scale.setScalar(0); if (landed++ % 4 === 0) Sound.leaf(); }
          else { dummy.position.set(l.x, l.y, l.z); dummy.rotation.set(l.t * l.sp[0], l.t * l.sp[1], l.t * l.sp[2]); dummy.scale.setScalar(l.s * Math.min(1, l.t * 1.6)); }
          dummy.updateMatrix(); fallMesh.setMatrixAt(i, dummy.matrix);
        }
      }
      fallMesh.instanceMatrix.needsUpdate = true;
    },
    move(x, y) { const p = pickPlane(x, y, 1.8); if (p) { uni.uPtr.value.copy(p); idle = 0; } },
    tap(x, y) { const p = pickPlane(x, y, 1.8); if (p) { uni.uPtr.value.copy(p); idle = 0; uni.uPtrA.value = 1.3; } shower = 6.5; for (let k = 0; k < 4; k++) release(); Sound.rustle(1); },
  };
};


/* ---------- small synthesised sounds: no audio files, only on a tap, quiet, and silent when the site's sound toggle is off ---------- */
const Sound = (() => {
  let ctx = null, master = null, buf = null;
  const off = () => { try { return localStorage.getItem("ui-sound") === "off"; } catch (_) { return false; } };
  function unlock() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return false;
      ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.55; master.connect(ctx.destination);
      buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = buf.getChannelData(0); let b = 0;
      for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; b = b * 0.97 + w * 0.03; d[i] = (w * 0.5 + b * 6) * 0.6; }   // soft, slightly brown noise
    }
    if (ctx.state === "suspended") ctx.resume();
    return true;
  }
  const ok = () => ctx && !off();
  function noise(t, dur, type, freq, q, peak, attack) {
    const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(t, Math.random()); src.stop(t + dur + 0.05); return f;
  }
  function tone(t, f0, f1, dur, peak) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "sine";
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  return {
    unlock,
    /** leaves moving against each other: a soft swell of filtered noise */
    rustle(amount = 1) {
      if (!ok()) return; const t = ctx.currentTime;
      const f = noise(t, 1.6 + amount * 0.6, "bandpass", 3000, 0.7, 0.07 * amount, 0.35);
      f.frequency.setValueAtTime(2400, t); f.frequency.linearRampToValueAtTime(4200, t + 1.6);
      noise(t + 0.05, 1.2, "highpass", 6500, 0.5, 0.012 * amount, 0.3);
    },
    /** one leaf touching down */
    leaf() { if (!ok()) return; noise(ctx.currentTime, 0.18, "bandpass", 2600 + Math.random() * 1500, 1.4, 0.018, 0.02); },
    /** a drop on water: a short falling note and a wet puff */
    plink(strength = 1) {
      if (!ok()) return; const t = ctx.currentTime, base = 480 + Math.random() * 260;
      tone(t, base * 1.9, base * 0.8, 0.28, 0.07 * strength);
      tone(t + 0.07, base * 1.2, base * 0.6, 0.34, 0.035 * strength);
      noise(t, 0.22, "lowpass", 900, 0.6, 0.03 * strength, 0.01);
    },
  };
})();
addEventListener("pointerdown", () => Sound.unlock(), { passive: true });

/* ---------- pixel + ordered-dither pass ---------- */
const PX = +params.get("px") || (innerWidth < 700 ? 2 : 3);       // CSS pixels per "big pixel"
const LEVELS = 9;                                                   // colour steps per channel
let pixelOn = params.get("px") !== "0";
const rt = new THREE.WebGLRenderTarget(2, 2, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, depthBuffer: true });
const postScene = new THREE.Scene(), postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postMat = new THREE.ShaderMaterial({
  uniforms: { tDiffuse: { value: rt.texture }, uRes: { value: new THREE.Vector2(2, 2) }, uLevels: { value: LEVELS }, uFade: { value: 0 } },
  vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uLevels; uniform float uFade; varying vec2 vUv;
    float bayer(vec2 p){
      int x = int(mod(p.x, 4.0)), y = int(mod(p.y, 4.0));
      float m[16] = float[16](0.,8.,2.,10., 12.,4.,14.,6., 3.,11.,1.,9., 15.,7.,13.,5.);
      return (m[y*4+x] + 0.5) / 16.0;
    }
    void main(){
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float t = bayer(floor(vUv * uRes)) - 0.5;
      c = floor(c * (uLevels - 1.0) + 0.5 + t * 0.95) / (uLevels - 1.0);
      // halftone dissolve to the page colour while switching scenes
      float th = bayer(floor(vUv * uRes * 0.5) * 2.0 + vec2(mod(floor(vUv.x * uRes.x), 2.0), 0.0));
      c = mix(c, vec3(0.961, 0.953, 0.937), step(th * 0.96 + 0.02, uFade));
      gl_FragColor = vec4(c, 1.0);
    }`,
  depthTest: false, depthWrite: false,
});
postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

/* ---------- scene manager ---------- */
const META = {
  pond: ["Lily pond", "Summer · pads, lotus and ripples", "Move over the water · tap for a big ripple · drag to fly", "pond"],
  canopy: ["Jungle canopy", "Understory · broad leaves in dappled light", "Move to open a gap in the canopy · tap to shake the leaves", "canopy"],
  mites: ["Rainy velvets", "A memory · velvet mites after the rain", "Move over a mite · press and hold to make it curl up", "rainy velvets"],
  street: ["Street", "Midday · a city street from above", "Traffic keeps its lanes and stops at the signal · hover to honk · or be the cow", "street"],
  bollywood: ["Bollywood", "A memory · a dance under the arch, the Taj Mahal behind", "Move to stir the wind · tap to wrap the dupatta around him, tap again to let go · the slider sets the breeze", "bollywood"],
  focus: ["Focus", "A memory · the long road and the balloon", "Click the lens to turn the focus, four clicks to clear it · click again to start over", "focus"],
  grass: ["Grass from above", "Meadow · combed by the wind", "Tap to plant flowers and watch them bloom · someone will come over", "grass"],
};
const ORDER = ["pond", "canopy", "mites", "grass", "street", "focus"];
const nav = document.getElementById("scenes");
const deck = document.getElementById("deck");
const built = {};
let current = null, currentId = null, mitesing = false;
const root = new THREE.Scene();
const mitesFrame = document.getElementById("mites");
const grassFrame = document.getElementById("grass");
const streetFrame = document.getElementById("street");
const bollyFrame = document.getElementById("bollywood");
const focusFrame = document.getElementById("focus");

/** swap what is on screen right now (no animation) */
function showNow(id) {
  const isMites = id === "mites", isGrass = id === "grass", isStreet = id === "street", isBolly = id === "bollywood", isFocus = id === "focus";
  document.body.classList.toggle("is-focus", isFocus);
  document.body.classList.toggle("is-bollywood", isBolly);
  document.body.classList.toggle("is-street", isStreet);
  document.body.classList.toggle("is-canopy", id === "canopy");
  document.body.classList.toggle("is-mites", isMites);
  document.body.classList.toggle("is-grass", isGrass);
  // frames only run while visible
  if (isMites && !mitesFrame.src) mitesFrame.src = mitesFrame.dataset.src + (pixelOn ? "?px=1" : "");
  if (isGrass && !grassFrame.src) grassFrame.src = grassFrame.dataset.src;
  if (isStreet && !streetFrame.src) streetFrame.src = streetFrame.dataset.src;
  if (isBolly && !bollyFrame.src) bollyFrame.src = bollyFrame.dataset.src;
  if (isFocus && !focusFrame.src) focusFrame.src = focusFrame.dataset.src;
  try { streetFrame.contentWindow?.postMessage({ away: !isStreet }, "*"); } catch (_) {}
  if (!isStreet && streetFrame.src) setTimeout(() => { if (currentId !== "street") streetFrame.removeAttribute("src"); }, 2600);   // its sound lasts two more seconds, then it stops
  if (!isBolly && bollyFrame.src) setTimeout(() => { if (currentId !== "bollywood") bollyFrame.removeAttribute("src"); }, 700);
  if (!isFocus && focusFrame.src) setTimeout(() => { if (currentId !== "focus") focusFrame.removeAttribute("src"); }, 700);
  if (!isMites && mitesFrame.src) setTimeout(() => { if (currentId !== "mites") mitesFrame.removeAttribute("src"); }, 700);
  if (!isGrass && grassFrame.src) setTimeout(() => { if (currentId !== "grass") grassFrame.removeAttribute("src"); }, 700);
  currentId = id;
  if (isMites || isGrass || isStreet || isBolly || isFocus) { mitesing = true; }
  else {
    mitesing = false;
    if (current?.leave) current.leave();
    if (current) root.remove(current.group);
    current = built[id] || (built[id] = SCENES[id]());
    root.add(current.group); root.background = current.bg;
    current.enter(); resize();
  }
  const [t, sub, hintText] = META[id];
  document.getElementById("cap-title").textContent = t; document.getElementById("cap-sub").textContent = sub;
  document.getElementById("cap-hint").textContent = hintText;
  [...nav.querySelectorAll(".name")].forEach((el) => el.setAttribute("aria-current", String(el.dataset.id === id)));
  history.replaceState(null, "", location.search + "#" + id);
}

/* dissolve out (halftone dots to white), swap, dissolve back in */
let fade = 0, fadeDir = 0, pending = null, elapsed = 0, autoplay = params.get("auto") !== "0";
const DURATION = 11;
function goto(id, manual) {
  if (!SCENES[id] && id !== "mites" && id !== "grass" && id !== "street" && id !== "bollywood" && id !== "focus" || ORDER.indexOf(id) < 0) id = "pond";
  elapsed = 0;
  if (manual && id === currentId) return;
  if (currentId === null) { showNow(id); return; }
  pending = id; fadeDir = 1; deck.classList.add("swap");
}
function stepFade(dt) {
  if (fadeDir === 0) return;
  fade = Math.min(1, Math.max(0, fade + fadeDir * dt / (fadeDir > 0 ? 0.45 : 0.55)));
  if (fadeDir > 0 && fade >= 1) {
    showNow(pending); pending = null; fadeDir = -1; deck.classList.remove("swap");
  } else if (fadeDir < 0 && fade <= 0) fadeDir = 0;
}
ORDER.forEach((id) => {
  const b = document.createElement("button"); b.className = "name"; b.dataset.id = id; b.innerHTML = META[id][3] + "<i></i>";
  b.onclick = () => goto(id, true); nav.appendChild(b);
});
const playBtn = document.createElement("button"); playBtn.id = "play"; playBtn.type = "button";
const syncPlay = () => { playBtn.textContent = autoplay ? "pause" : "play"; playBtn.setAttribute("aria-label", autoplay ? "Pause" : "Play"); };
playBtn.onclick = () => { autoplay = !autoplay; syncPlay(); };
nav.appendChild(playBtn); syncPlay();

/* ---------- pixel toggle ---------- */
const pxBtn = document.getElementById("px");
const syncPx = () => {
  pxBtn.setAttribute("aria-pressed", String(pixelOn)); pxBtn.textContent = pixelOn ? "pixel: on" : "pixel: off";
  if (mitesFrame.src) mitesFrame.src = mitesFrame.dataset.src + (pixelOn ? "?px=1" : "");
};
pxBtn.addEventListener("click", () => { pixelOn = !pixelOn; syncPx(); resize(); });

/* ---------- wind controls ---------- */
const slider = document.getElementById("wind"), label = document.getElementById("label");
const NAMES = [[0.12, "Still"], [0.5, "Light air"], [1.0, "Breeze"], [1.7, "Windy"], [2.4, "Gale"], [9, "Storm"]];
let target = parseFloat(slider.value), speed = target, strength = target, gust = 0, phase = 0, dirAngle = 0.35, dirTarget = 0.35;
const sendWind = () => { for (const f of [grassFrame, bollyFrame]) { try { f.contentWindow?.postMessage({ wind: target }, "*"); } catch (_) {} } };
const setTarget = (v) => { target = v; slider.value = v; label.textContent = NAMES.find(([m]) => v < m)[1]; sendWind(); };
grassFrame.addEventListener("load", sendWind);
bollyFrame.addEventListener("load", sendWind);
slider.addEventListener("input", () => setTarget(parseFloat(slider.value)));
setTarget(target);
syncPx();

let down = null;
addEventListener("pointerdown", (e) => { if (e.target !== canvas) return; down = { x: e.clientX, y: e.clientY }; });
addEventListener("pointermove", (e) => { if (e.target === canvas) current?.move?.(e.clientX, e.clientY); });
addEventListener("pointerup", (e) => {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y); down = null;
  if (moved > 12) return;
  gust = Math.max(gust, 1.0);
  const sr = canvas.getBoundingClientRect(); dirTarget += ((e.clientX - sr.left) / sr.width - 0.5) * 0.6;
  current?.tap?.(e.clientX, e.clientY);
});

/* ---------- loop ---------- */
function resize() {
  const dpr = Math.min(devicePixelRatio || 1, DPR_CAP);
  const sw = Math.max(2, canvas.clientWidth), sh = Math.max(2, canvas.clientHeight);
  renderer.setPixelRatio(dpr); renderer.setSize(sw, sh, false);
  const rw = Math.ceil(sw / PX), rh = Math.ceil(sh / PX);
  rt.setSize(rw, rh); postMat.uniforms.uRes.value.set(rw, rh);
  camera.aspect = sw / sh; camera.updateProjectionMatrix();
  const px = (pixelOn ? rh : sh * dpr) * 0.5;
  Object.values(built).forEach((s) => s.group.traverse((o) => { if (o.material?.uniforms?.uPx) o.material.uniforms.uPx.value = px; }));
  current?.resize?.();
}
addEventListener("resize", resize);

function ease(cur, tgt, dt, tau) { return cur + (tgt - cur) * (1 - Math.exp(-dt / tau)); }
let last = performance.now(), time = 0;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now; time += dt;
  speed = ease(speed, target, dt, 0.9); strength = ease(strength, target, dt, 0.7);
  gust = ease(gust, 0, dt, 1.6); dirAngle = ease(dirAngle, dirTarget, dt, 1.2);
  phase += speed * dt;
  U.uPhase.value = phase; U.uStrength.value = strength; U.uGust.value = gust; U.uTime.value = time;
  U.uDir.value.set(Math.cos(dirAngle), Math.sin(dirAngle));
  stepFade(dt);
  if (autoplay && fadeDir === 0) {
    elapsed += dt;
    if (elapsed >= DURATION) goto(ORDER[(ORDER.indexOf(currentId) + 1) % ORDER.length]);
  }
  const prog = nav.querySelector('.name[aria-current="true"]'); if (prog) prog.style.setProperty("--p", autoplay ? Math.min(1, elapsed / DURATION) : 0);
  if (!mitesing && current) {
    current.update(dt, { strength, dir: U.uDir.value, time });
    if (pixelOn && currentId !== "canopy") {          // the canopy keeps its original, undithered render
      postMat.uniforms.uFade.value = fade;
      renderer.setRenderTarget(rt); renderer.render(root, camera); renderer.setRenderTarget(null); renderer.render(postScene, postCam);
      canvas.style.opacity = 1;
    } else { renderer.render(root, camera); canvas.style.opacity = 1 - fade; }
  } else canvas.style.opacity = 1;
  requestAnimationFrame(frame);
}
goto(location.hash.slice(1) || "pond");
requestAnimationFrame(frame);
window.__nature = { show: goto, setTarget, get state() { return { speed, strength, phase, target, scene: currentId }; } };
