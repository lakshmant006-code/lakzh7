/* The dupatta's physics, off the main thread so drawing never waits for it.

   Solver: XPBD with small steps (one constraint pass per substep, many substeps), the most stable real-time cloth scheme.
   - warp and weft stretch are separate, nearly rigid constraints, and shear is softer: silk is anisotropic
   - bending is a curvature (bilaplacian) force on the weave, so folds round off instead of kinking
   - every pair of points two apart keeps a minimum distance, so the mesh cannot collapse or fold through itself
   - the body is a solid it slides on (every substep); layers of silk push each other apart (every frame)
   - mass, drag and stiffness vary over the cloth (the embroidered hem is heavier and stiffer, the middle lighter),
     and the wind is a moving field, so each region moves with its own inertia instead of all at once
   The main thread sends ticks, the pointer and taps; this sends back the last two states and how far between them to draw. */

let SCALE, ANCHOR, REDUCE;
const COLS = 26, ROWS = 120, N = COLS * ROWS, idx = (i, j) => j * COLS + i;
const LENGTH = 600, W_TOP = 28, W_FULL = 150;
const STEP = 1 / 60;
let SUB = 8, H = STEP / SUB;                                                  // sub-steps adapt to the machine: fewer when it is slow, back up when it is not
let slowFor = 0, fastFor = 0;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const widthAt = (v) => W_TOP + (W_FULL - W_TOP) * smooth(0, 0.2, v);

const x = new Float32Array(N * 3), p = new Float32Array(N * 3), v = new Float32Array(N * 3), acc = new Float32Array(N * 3);
const w = new Float32Array(N), w0 = new Float32Array(N), drag = new Float32Array(N), kb = new Float32Array(N);
const nrm = new Float32Array(N * 3), K = new Float32Array(N * 3), contact = new Uint8Array(N);
let cA, cB, cL, cAt, nC = 0, mA, mB, mL, nM = 0;

let GRAVITY, windSlider = 0.8, gust = 0, kick = 0, ptr = null, ptrVel = { x: 0, y: 0 };
const noise = (t, s) => Math.sin(t * 0.9 + s) * 0.5 + Math.sin(t * 1.7 + s * 2.3) * 0.3 + Math.sin(t * 3.1 + s * 0.7) * 0.2;

/* ---------- the photographer: his outline as elliptical slices, and the drape it settles into ---------- */
const BODY = [[607,392.2,10.9],[613,391.8,13.9],[619,392.3,17.1],[625,394.2,21.5],[631,396.5,23.7],[637,397.3,24.8],[643,397.3,27.6],[649,396.5,30.9],[655,394.7,33.7],[661,393.1,37.4],[667,393.2,41.2],[673,394.1,43.2],[679,394.3,44],[685,392.6,41.9],[691,390.4,39.7],[697,387.9,37.9],[703,385.8,36.1],[709,385,34.4],[715,385.8,35],[721,387,35.3],[727,388.2,34.8],[733,389.3,33.8],[739,390.3,32.9],[745,391.2,31.8],[751,391.8,30.8],[757,392.8,30.6],[763,393.5,30.9],[769,393.7,31.7],[775,393.9,32.3],[781,393.9,32.6],[787,393.8,32.3],[793,393.7,31.8],[799,393.9,31.4],[805,394,31.1],[811,394.2,31.7],[817,394.5,31.7],[823,395.1,32.4],[829,395.5,33.1],[835,396,33.8],[841,396.8,34.4],[847,397.6,35.5],[853,399.8,36.9],[859,402.2,38.8],[865,404.2,40.7],[871,403.8,39.6],[877,403,37.9],[883,400.8,35.8]];
const bodyAt = (y) => {
  const f = (Math.min(Math.max(y, BODY[0][0]), BODY[BODY.length - 1][0]) - BODY[0][0]) / 6, i = Math.min(BODY.length - 2, Math.floor(f)), t = f - i;
  return [BODY[i][1] + (BODY[i + 1][1] - BODY[i][1]) * t, BODY[i][2] + (BODY[i + 1][2] - BODY[i][2]) * t];
};
const SKIN = 2.5, DEPTH = 0.62;
const HEAD_Y = BODY[0][0] - 6, FEET_Y = BODY[BODY.length - 1][0] + 4;
const tentAt = (y) => { const [bx, hw0] = bodyAt(y), e = smooth(HEAD_Y + 20, HEAD_Y + 60, y), hw = Math.max(hw0, 26 * (1 - e) + hw0 * e); return [bx, hw + SKIN, hw * DEPTH + SKIN]; };
const SLICE = BODY.map(([, bx, hw]) => [bx, hw + SKIN, hw * DEPTH + SKIN]);
const tgt = new Float32Array(N * 3);
function buildDrape() {
  // the free end down his back, up over his crown like a hood, then down his front, each thread wrapped round his outline
  const BACK = 78, S1 = BACK + 16, bodyLen = Math.min(LENGTH - S1, FEET_Y - HEAD_Y + 20);
  const slack = Math.max(0, (LENGTH - S1) - bodyLen), M = 96, SPAN = Math.PI * 0.94;
  for (let j = 0; j < ROWS; j++) {
    const s = j / (ROWS - 1) * LENGTH;
    let y, phi;
    if (s <= S1) { const f = s / S1; y = HEAD_Y + BACK * Math.pow(1 - f, 1.4); phi = Math.PI * (1 - smooth(0.62, 1, f)); }
    else { const d = Math.min(s - S1, bodyLen); y = HEAD_Y + d * ((FEET_Y - HEAD_Y) / bodyLen) + Math.max(0, s - S1 - bodyLen) * 0.12; phi = 0; }
    const [bx, A, B] = tentAt(y), gather = 0.9 + 0.06 * Math.sin(j * 0.21);
    const L = [0]; for (let q = 1; q <= M; q++) { const th = q / M * SPAN; L.push(L[q - 1] + Math.hypot(A * Math.cos(th), B * Math.sin(th)) * SPAN / M); }
    for (let i = 0; i < COLS; i++) {
      const u = i / (COLS - 1) - 0.5, want = Math.abs(u) * W_FULL * gather, k = idx(i, j) * 3;
      let q = 0; while (q < M - 1 && L[q + 1] < want) q++;
      const th = phi + Math.sign(u) * Math.min(SPAN, (q + (want - L[q]) / ((L[q + 1] - L[q]) || 1)) / M * SPAN);
      tgt[k] = bx + A * Math.sin(th);
      tgt[k + 1] = y + Math.sin(u * 9 + j * 0.3) * 1.2 - (s <= S1 ? 3 * Math.cos(th) : 0);
      tgt[k + 2] = B * Math.cos(th) + (s > S1 + bodyLen ? Math.sin(u * 22 + j * 0.45) * (2 + slack * 0.02) : 0);
    }
  }
}

/* ---------- the cloth ---------- */
function build() {
  const hash = (i, j) => { const s = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return s - Math.floor(s); };
  for (let j = 0; j < ROWS; j++) {
    const vv = j / (ROWS - 1), wd = widthAt(vv);
    for (let i = 0; i < COLS; i++) {
      const u = i / (COLS - 1), q = idx(i, j), k = q * 3;
      x[k] = ANCHOR.x - vv * LENGTH; x[k + 1] = ANCHOR.y + (u - 0.5) * wd; x[k + 2] = (Math.sin(u * 6.28) * 4 + (hash(i, j) - 0.5) * 4) * SCALE;
      const hem = i <= 1 || i >= COLS - 2 || j >= ROWS - 3;                              // the embroidered border: heavier, stiffer
      const m = (0.45 + 0.55 * wd / W_FULL) * (hem ? 1.7 : 1);
      w0[q] = 1 / m;
      drag[q] = (0.8 + 0.4 * hash(j, i)) * (i === 0 || i === COLS - 1 ? 1.2 : 1);       // each patch catches the air a little differently
      kb[q] = hem ? 12000 : 9000;                                         // stable while kb * w * H^2 * 64 < 4 (about 14000)
    }
  }
  const A = [], B = [], L = [], At = [];
  const d = (a, b) => Math.hypot(x[a * 3] - x[b * 3], x[a * 3 + 1] - x[b * 3 + 1], x[a * 3 + 2] - x[b * 3 + 2]);
  const add = (a, b, alpha) => { A.push(a); B.push(b); L.push(d(a, b)); At.push(alpha / (H * H)); };
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    const a = idx(i, j);
    if (j + 1 < ROWS) add(a, idx(i, j + 1), 2e-9);                                        // warp: along the length, almost inextensible
    if (i + 1 < COLS) add(a, idx(i + 1, j), 8e-9);                                        // weft: across, a touch of give
    if (i + 1 < COLS && j + 1 < ROWS) { add(a, idx(i + 1, j + 1), 1.2e-6); add(idx(i + 1, j), idx(i, j + 1), 1.2e-6); }   // shear: bias-cut silk drapes easily
  }
  // interleave so the Gauss-Seidel sweep has no direction bias
  const order = A.map((_, n) => n).sort((a, b) => ((a * 2654435761) % 4093) - ((b * 2654435761) % 4093));
  nC = A.length; cA = new Int32Array(nC); cB = new Int32Array(nC); cL = new Float32Array(nC); cAt = new Float32Array(nC);
  order.forEach((o, n) => { cA[n] = A[o]; cB[n] = B[o]; cL[n] = L[o]; cAt[n] = At[o]; });
  // anti-collapse: points two apart along either thread never come closer than 45% of their rest distance
  const MA = [], MB = [], ML = [];
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    if (i + 2 < COLS) { MA.push(idx(i, j)); MB.push(idx(i + 2, j)); ML.push(d(idx(i, j), idx(i + 2, j)) * 0.45); }
    if (j + 2 < ROWS) { MA.push(idx(i, j)); MB.push(idx(i, j + 2)); ML.push(d(idx(i, j), idx(i, j + 2)) * 0.45); }
  }
  nM = MA.length; mA = Int32Array.from(MA); mB = Int32Array.from(MB); mL = Float32Array.from(ML);
  w.set(w0); for (let i = 0; i < COLS; i++) w[idx(i, 0)] = 0;
  buildDrape();
}

/* ---------- the dupatta's life: held -> flying -> wrapped -> returning -> held ---------- */
let mode = "held", flyT = 0, wrap = 0, wrapOn = false, flip = false, settle = 0, time = 0, frameNo = 0, base = 0;
const centre = { x: 0, y: 0, vx: 0, vy: 0 };
function updateCentre() {
  let sx = 0, sy = 0; for (let q = 0; q < N; q++) { sx += x[q * 3]; sy += x[q * 3 + 1]; }
  const nx = sx / N, ny = sy / N;
  centre.vx = (nx - centre.x) / STEP * 0.35 + centre.vx * 0.65; centre.vy = (ny - centre.y) / STEP * 0.35 + centre.vy * 0.65; centre.x = nx; centre.y = ny;
}
function release() {
  mode = "flying"; flyT = 0; updateCentre(); centre.vx = centre.vy = 0;
  for (let i = 0; i < COLS; i++) w[idx(i, 0)] = w0[idx(i, 0)];
  for (let q = 0; q < N; q++) { const k = q * 3, jj = Math.floor(q / COLS) / (ROWS - 1); v[k] += -170 - 120 * jj; v[k + 1] += -300 + 150 * jj; }   // the toss
}
function chooseFlip() {
  let a = 0, b = 0;
  for (let q = 0; q < N; q += 7) { const k = q * 3, m = idx(COLS - 1 - q % COLS, (q / COLS) | 0) * 3;
    a += (x[k] - tgt[k]) ** 2 + (x[k + 2] - tgt[k + 2]) ** 2; b += (x[k] - tgt[m]) ** 2 + (x[k + 2] - tgt[m + 2]) ** 2; }
  return b < a;
}
function down() {
  if (mode === "held") release();
  else if (mode === "wrapped") { mode = "returning"; flyT = 0; wrapOn = false; kick = 1.8; }
  else gust = Math.min(1.6, gust + 0.8);
}

/* ---------- forces, once per step ---------- */
function normals() {
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    const a = idx(i, j) * 3, r = idx(Math.min(i + 1, COLS - 1), j) * 3, l = idx(Math.max(i - 1, 0), j) * 3,
          dd = idx(i, Math.min(j + 1, ROWS - 1)) * 3, u = idx(i, Math.max(j - 1, 0)) * 3;
    const ax = x[r] - x[l], ay = x[r + 1] - x[l + 1], az = x[r + 2] - x[l + 2], bx = x[dd] - x[u], by = x[dd + 1] - x[u + 1], bz = x[dd + 2] - x[u + 2];
    const nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx, m = Math.hypot(nx, ny, nz) || 1;
    nrm[a] = nx / m; nrm[a + 1] = ny / m; nrm[a + 2] = nz / m;
  }
}
let ax = 0, ay = 0;
function forces(t) {
  const strength = Math.max(0, windSlider) * (REDUCE ? 0.5 : 1), swell = 0.6 + 0.4 * noise(t * 0.55, 1.3), flutter = noise(t * 2.2, 4.1);
  gust *= 0.985; kick *= 0.96;
  base = strength * (0.9 + 1.5 * swell) + gust * 1.8 + kick * 2.4;
  const WS = 0.5, wx = -470 * WS * base, wy = -400 * WS * base * (0.8 + 0.5 * flutter), wz = 140 * WS * base * noise(t * 0.8, 7.7);
  const free = mode === "flying" || mode === "returning";
  ax = ANCHOR.x + Math.sin(t * 0.7) * 4 * SCALE; ay = ANCHOR.y + Math.sin(t * 0.93) * 6 * SCALE - Math.min(14, base * 5) * SCALE;
  let gx = 0, gy = 0;
  if (mode === "flying") {
    const arc = Math.max(0, 1 - flyT / 1.25), Tx = BODY[0][1] + 110 * arc, Ty = HEAD_Y + 20 - 150 * arc;
    gx = (Tx - centre.x) * 3.4 - centre.vx * 3.3; gy = (Ty - centre.y) * 3.4 - centre.vy * 3.3;
  } else if (mode === "returning") {
    const Ty = ay - (flyT < 1.2 ? 130 * (1 - flyT / 1.2) : 0);
    gx = (ax - centre.x) * 3.2 - centre.vx * 3.2; gy = (Ty - centre.y) * 3.2 - centre.vy * 3.2;
  }
  normals();
  for (let q = 0; q < N; q++) {
    const k = q * 3, j = (q / COLS) | 0, i = q % COLS, wq = w0[q];
    const loc = smooth(0, 1, (wrap * 1.6 - j / (ROWS - 1) * 0.75) * 1.4), fr = (free ? 0.3 : 1) * (1 - 0.92 * loc);
    const vx = v[k], vy = v[k + 1], vz = v[k + 2], px = x[k], py = x[k + 1];
    // the wind is a field that travels across the cloth: bands of stronger and weaker air sweep through it
    const band = 1 + 0.35 * Math.sin(px * 0.013 + t * 1.9 + Math.sin(py * 0.011 - t * 0.7)) * Math.sin(py * 0.017 - t * 1.3);
    const rx = wx * fr * band - vx, ry = wy * fr * band - vy, rz = wz * fr * band - vz;
    const dn = rx * nrm[k] + ry * nrm[k + 1] + rz * nrm[k + 2], c = drag[q] * wq;
    let fx = (rx * 1.5 + nrm[k] * dn * 0.72) * c, fy = (ry * 1.5 + nrm[k + 1] * dn * 0.72) * c + GRAVITY, fz = (rz * 0.9 + nrm[k + 2] * dn * 0.72) * c;
    if (loc > 0) {   // lying on him: drawn straight onto his surface, then slid round into its drape; critically damped
      const tk = flip ? idx(COLS - 1 - i, j) * 3 : k;
      const [bx, A, B] = tentAt(py), th = Math.atan2((px - bx) / A, x[k + 2] / B), sx = bx + A * Math.sin(th), sz = B * Math.cos(th);
      const uw = 0.2 + 0.8 * settle * settle * (3 - 2 * settle), Tx = sx + (tgt[tk] - sx) * uw, Tz = sz + (tgt[tk + 2] - sz) * uw;
      const ks = 70 * loc * loc, kd = 2 * Math.sqrt(ks) * 1.05;
      fx += (Tx - px) * ks - vx * kd; fy += (tgt[tk + 1] - py) * ks * 0.8 - vy * kd; fz += (Tz - x[k + 2]) * ks - vz * kd;
    }
    if (free) {
      const ph = t * 2.6 + j * 0.2 + i * 0.62, amp = SCALE * 3 * (0.3 + j / ROWS) * (0.7 + 0.6 * drag[q]);
      fx += gx + Math.sin(ph) * 120 * amp; fy += gy - GRAVITY * 0.78 + Math.cos(ph * 0.8 + i) * 90 * amp; fz += Math.sin(ph * 1.3 + i * 0.9) * 340 * amp;
      const k0 = Math.min(1, flyT / 0.5) * (mode === "flying" ? 1 : 0.6), dx = centre.x - px, dy = centre.y - py, dd = Math.hypot(dx, dy) || 1, over = Math.max(0, dd - 150);
      fx += dx / dd * over * 4 * k0; fy += dy / dd * over * 4 * k0;
      const spin = Math.sin(t * 1.7 + 0.6) * 1.1 * k0; fx += -(py - centre.y) * spin * 6; fy += (px - centre.x) * spin * 6;
      if (mode === "returning" && j === 0) { fx += (ax - px) * 40; fy += (ay + (i / (COLS - 1) - 0.5) * W_TOP - py) * 40; }
    }
    if (ptr && loc < 0.5) { const dx = px - ptr.x, dy = py - ptr.y, d2 = dx * dx + dy * dy; if (d2 < 14000 * SCALE) { const f = (1 - d2 / (14000 * SCALE)) * 5200 * SCALE, d = Math.sqrt(d2) || 1; fx += dx / d * f + ptrVel.x * 30 * SCALE; fy += dy / d * f + ptrVel.y * 30 * SCALE; fz += f * 0.35; } }
    acc[k] = fx; acc[k + 1] = fy; acc[k + 2] = fz;
  }
}

/* ---------- the XPBD substep ---------- */
function bending() {
  // curvature of the weave at each point, then its divergence: a smooth bending force that never kinks
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    const q = idx(i, j), k = q * 3;
    const l = i > 0 ? k - 3 : k, r = i < COLS - 1 ? k + 3 : k, u = j > 0 ? k - COLS * 3 : k, d = j < ROWS - 1 ? k + COLS * 3 : k;
    for (let c = 0; c < 3; c++) K[k + c] = x[l + c] + x[r + c] + x[u + c] + x[d + c] - 4 * x[k + c];
  }
  for (let j = 0; j < ROWS; j++) for (let i = 0; i < COLS; i++) {
    const q = idx(i, j), wq = w[q]; if (wq === 0) continue;
    const k = q * 3, l = i > 0 ? k - 3 : k, r = i < COLS - 1 ? k + 3 : k, u = j > 0 ? k - COLS * 3 : k, d = j < ROWS - 1 ? k + COLS * 3 : k;
    const s = kb[q] * wq * H;
    for (let c = 0; c < 3; c++) v[k + c] -= s * (K[l + c] + K[r + c] + K[u + c] + K[d + c] - 4 * K[k + c]);
  }
}
function bodyCollide(str) {
  for (let q = 0; q < N; q++) {
    contact[q] = 0;
    if (w[q] === 0) continue;
    const k = q * 3, y = x[k + 1]; if (y < BODY[0][0] || y > FEET_Y) continue;
    const f = (y - BODY[0][0]) / 6, i = Math.min(BODY.length - 2, f | 0), t = f - i, A = SLICE[i], B = SLICE[i + 1];
    const bx = A[0] + (B[0] - A[0]) * t, a = A[1] + (B[1] - A[1]) * t, b = A[2] + (B[2] - A[2]) * t;
    const ex = (x[k] - bx) / a, ez = x[k + 2] / b, rr = Math.hypot(ex, ez);
    if (rr >= 1 || rr < 1e-4) continue;
    const m = 1 + (1 / rr - 1) * str;
    x[k] = bx + ex * m * a; x[k + 2] = ez * m * b; contact[q] = 1;
  }
}
function substep(held, wrapping) {
  bending();
  const damp = Math.exp(-1.0 * H);
  for (let q = 0; q < N; q++) {
    const k = q * 3;
    p[k] = x[k]; p[k + 1] = x[k + 1]; p[k + 2] = x[k + 2];
    if (w[q] === 0) continue;
    v[k] = (v[k] + acc[k] * H) * damp; v[k + 1] = (v[k + 1] + acc[k + 1] * H) * damp; v[k + 2] = (v[k + 2] + acc[k + 2] * H) * damp;
    x[k] += v[k] * H; x[k + 1] += v[k + 1] * H; x[k + 2] += v[k + 2] * H;
  }
  if (held) for (let i = 0; i < COLS; i++) { const k = idx(i, 0) * 3; x[k] = ax; x[k + 1] = ay + (i / (COLS - 1) - 0.5) * W_TOP; x[k + 2] = Math.sin(i * 0.9) * 3 * SCALE; }
  // stretch and shear: one compliant Gauss-Seidel pass
  for (let c = 0; c < nC; c++) {
    const a = cA[c], b = cB[c], wa = w[a], wb = w[b], ws = wa + wb; if (ws === 0) continue;
    const ka = a * 3, kb3 = b * 3, dx = x[kb3] - x[ka], dy = x[kb3 + 1] - x[ka + 1], dz = x[kb3 + 2] - x[ka + 2];
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz); if (d < 1e-6) continue;
    const s = -(d - cL[c]) / (ws + cAt[c]) / d;
    x[ka] -= wa * s * dx; x[ka + 1] -= wa * s * dy; x[ka + 2] -= wa * s * dz;
    x[kb3] += wb * s * dx; x[kb3 + 1] += wb * s * dy; x[kb3 + 2] += wb * s * dz;
  }
  // degeneration guard: no collapsed or inverted cells
  for (let c = 0; c < nM; c++) {
    const a = mA[c], b = mB[c], ka = a * 3, kb3 = b * 3, dx = x[kb3] - x[ka], dy = x[kb3 + 1] - x[ka + 1], dz = x[kb3 + 2] - x[ka + 2];
    const d2 = dx * dx + dy * dy + dz * dz, L = mL[c]; if (d2 >= L * L) continue;
    const wa = w[a], wb = w[b], ws = wa + wb; if (ws === 0) continue;
    const d = Math.sqrt(d2) || 1e-6, s = (L - d) / ws / d;
    x[ka] -= wa * s * dx; x[ka + 1] -= wa * s * dy; x[ka + 2] -= wa * s * dz;
    x[kb3] += wb * s * dx; x[kb3 + 1] += wb * s * dy; x[kb3 + 2] += wb * s * dz;
  }
  if (wrapping) bodyCollide(Math.min(1, wrap * 3));
  const zl = 420 * SCALE;
  for (let q = 0; q < N; q++) {
    const k = q * 3;
    if (x[k + 1] > 930) x[k + 1] = 930; if (x[k + 2] > zl) x[k + 2] = zl; if (x[k + 2] < -zl) x[k + 2] = -zl;
    const f = contact[q] ? 0.82 : 1;                                          // silk on cotton: friction where it touches him
    v[k] = (x[k] - p[k]) / H * f; v[k + 1] = (x[k + 1] - p[k + 1]) / H * f; v[k + 2] = (x[k + 2] - p[k + 2]) / H * f;
  }
}

/* layers of silk push apart: a spatial hash over the points, once per step */
const CELL = 9, THICK = 6.5, TB = 16384, cellOf = new Int32Array(N), start = new Int32Array(TB + 1), sorted = new Int32Array(N);
const cellKey = (cx, cy, cz) => (((cx * 73856093) ^ (cy * 19349663) ^ (cz * 83492791)) >>> 0) & (TB - 1);
function selfCollide() {
  // counting-sort the points into hash buckets: flat arrays, no allocation
  start.fill(0);
  for (let q = 0; q < N; q++) { const c = cellKey(Math.floor(x[q * 3] / CELL), Math.floor(x[q * 3 + 1] / CELL), Math.floor(x[q * 3 + 2] / CELL)); cellOf[q] = c; start[c + 1]++; }
  for (let c = 0; c < TB; c++) start[c + 1] += start[c];
  const fill = start.slice(0, TB);
  for (let q = 0; q < N; q++) sorted[fill[cellOf[q]]++] = q;
  const T2 = THICK * THICK;
  for (let q = 0; q < N; q++) {
    const X = x[q * 3], Y = x[q * 3 + 1], Z = x[q * 3 + 2], ci = q % COLS, cj = (q / COLS) | 0;
    const cx = Math.floor(X / CELL), cy = Math.floor(Y / CELL), cz = Math.floor(Z / CELL);
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) {
      const c = cellKey(cx + dx, cy + dy, cz + dz);
      for (let n = start[c], e = start[c + 1]; n < e; n++) {
        const o = sorted[n]; if (o <= q) continue;
        const ex = x[o * 3] - X, ey = x[o * 3 + 1] - Y, ez = x[o * 3 + 2] - Z, d2 = ex * ex + ey * ey + ez * ez;
        if (d2 >= T2 || d2 < 1e-6) continue;
        if (Math.abs(o % COLS - ci) <= 3 && Math.abs(((o / COLS) | 0) - cj) <= 3) continue;   // neighbours on the same sheet are the constraints' job
        const wa = w[q], wb = w[o], ws = wa + wb; if (ws === 0) continue;
        const d = Math.sqrt(d2), s = (THICK - d) / d / ws;
        x[q * 3] -= ex * s * wa; x[q * 3 + 1] -= ey * s * wa; x[q * 3 + 2] -= ez * s * wa;
        x[o * 3] += ex * s * wb; x[o * 3 + 1] += ey * s * wb; x[o * 3 + 2] += ez * s * wb;
      }
    }
  }
}

function step() {
  time += STEP;
  if (mode === "flying") {
    flyT += STEP; updateCentre();
    if ((Math.hypot(centre.x - BODY[0][1], centre.y - (HEAD_Y + 30)) < 170 && flyT > 0.8) || flyT > 2.2) { mode = "wrapped"; wrapOn = true; flip = chooseFlip(); }
  } else if (mode === "returning") {
    flyT += STEP; updateCentre();
    let near = true; for (let i = 0; i < COLS; i++) { const k = idx(i, 0) * 3; if (Math.hypot(x[k] - ANCHOR.x, x[k + 1] - ANCHOR.y) > 36) near = false; }
    if (near || flyT > 6) { mode = "held"; for (let i = 0; i < COLS; i++) w[idx(i, 0)] = 0; }
  }
  wrap = wrapOn ? Math.min(1, wrap + STEP / 1.9) : Math.max(0, wrap - STEP / 0.7);
  settle = wrapOn ? Math.min(1, settle + STEP / 2.6) : 0;
  forces(time);
  const held = mode === "held", wrapping = wrap > 0.01;
  for (let s = 0; s < SUB; s++) substep(held, wrapping);
  if (mode !== "held" || wrap > 0.02) selfCollide();
}

/* ---------- messages ---------- */
let stepMs = 0, accT = 0, prev = new Float32Array(N * 3);
function tick(dt) {
  accT += Math.min(0.05, dt);
  let n = 0;
  const t0 = performance.now();
  while (accT >= STEP && n < 2) { prev.set(x); step(); accT -= STEP; n++; }
  if (n) stepMs = stepMs * 0.9 + (performance.now() - t0) / n * 0.1;
  if (n) {                                                                    // keep each step well under a frame
    if (stepMs > 9) { slowFor++; fastFor = 0; } else if (stepMs < 4.5) { fastFor++; slowFor = 0; } else { slowFor = fastFor = 0; }
    if (slowFor > 8 && SUB > 4) { SUB--; H = STEP / SUB; slowFor = 0; }
    else if (fastFor > 240 && SUB < 8) { SUB++; H = STEP / SUB; fastFor = 0; }
  }
  if (accT > STEP) accT = STEP * 0.5;                                        // a slow device skips ahead gently instead of falling behind
  const a = new Float32Array(prev), b = new Float32Array(x);
  postMessage({ type: "frame", a, b, alpha: accT / STEP, mode, wrap, centre, stepMs }, [a.buffer, b.buffer]);
}
self.onmessage = (e) => {
  const m = e.data;
  if (m.type === "init") {
    SCALE = m.SCALE; ANCHOR = m.ANCHOR; REDUCE = m.reduce; GRAVITY = 820 * SCALE;
    build();
    for (let i = 0; i < 180; i++) { prev.set(x); step(); }                     // let it settle before the first frame
    prev.set(x);
    postMessage({ type: "ready", COLS, ROWS, LENGTH, W_TOP, W_FULL });
    tick(0);
  } else if (m.type === "tick") tick(m.dt);
  else if (m.type === "down") down();
  else if (m.type === "wind") windSlider = m.v;
  else if (m.type === "pointer") {
    if (m.p && ptr) { ptrVel.x = m.p.x - ptr.x; ptrVel.y = m.p.y - ptr.y; gust = Math.min(1.6, gust + Math.hypot(ptrVel.x, ptrVel.y) * 0.004); }
    else if (!m.p) { ptrVel.x = ptrVel.y = 0; }
    ptr = m.p;
  }
};
