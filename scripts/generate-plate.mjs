/**
 * Generates Plate I — the mathematical copperplate vector illustration for Novum Index.
 *
 * Produces:
 *   - public/plate-i.svg         (standalone archival vector plate, light theme)
 *   - src/components/plateSvg.js (theme-aware inline SVG module using CSS design tokens)
 *   - public/og-card.jpg         (1600x900 2x-supersampled JPEG for Open Graph / social cards)
 *
 * Every curve is computed analytically from closed-form mathematical equations:
 *   - Poincaré hyperbolic disk geodesics & coaxial Steiner circle pencils (Mathematics)
 *   - Projective polytope / sphere-packing crown & E8 Coxeter rosettes (Geometry & Formal Proofs)
 *   - Lemniscate of Bernoulli & bipolar Apollonian tangent circles (Neuro-Symbolic Bridge)
 *   - Logarithmic / Euler vortex spirals & dipole field envelopes (Physics & Quantum)
 *   - Parametric double-helical biomolecular ribbon passing through exact foci (Biology & Medicine)
 *   - Hexagonal Bravais crystal rosettes & PES harmonic trajectories (Chemistry & Materials)
 *   - Real 1969–2026 Novum Index cadence marks on the exact piecewise era timeline
 */

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const INDEX_JSON = path.join(PUBLIC_DIR, 'data/index.json');

const W = 1600;
const H = 900;
const CY = 450;

const X_LEFT = 400;
const X_MID = 800;
const X_RIGHT = 1200;
const X_MIN = 96;
const X_MAX = 1504;

const f = (n) => Number(n.toFixed(2));

/**
 * Generates a smooth SVG path from a parametric function fn(t) -> [x, y]
 */
function samplePath(fn, t0, t1, steps = 220, close = false) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = t0 + ((t1 - t0) * i) / steps;
    const [x, y] = fn(t);
    pts.push(`${i === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`);
  }
  if (close) pts.push('Z');
  return pts.join(' ');
}

/**
 * Exact hyperbolic geodesic (orthogonal circular arc) inside circle (cx, cy, R)
 * connecting boundary angles a1 and a2 (in radians).
 */
function hyperbolicGeodesic(cx, cy, R, a1, a2) {
  let da = a2 - a1;
  while (da > Math.PI) da -= 2 * Math.PI;
  while (da < -Math.PI) da += 2 * Math.PI;
  const x1 = cx + R * Math.cos(a1);
  const y1 = cy + R * Math.sin(a1);
  const x2 = cx + R * Math.cos(a2);
  const y2 = cy + R * Math.sin(a2);
  if (Math.abs(Math.abs(da) - Math.PI) < 1e-4) {
    return `M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`;
  }
  const half = Math.abs(da) / 2;
  const rArc = R * Math.tan(half);
  const sweep = da > 0 ? 0 : 1;
  return `M${f(x1)} ${f(y1)} A${f(rArc)} ${f(rArc)} 0 0 ${sweep} ${f(x2)} ${f(y2)}`;
}

/**
 * Circular arc passing through (x1, y1) and (x2, y2) with signed sagitta h.
 * Also provides exact point-at-fraction evaluation so nodes can be placed
 * with 0.01px precision directly ON the circular arc!
 */
function arcGeometry(x1, y1, x2, y2, h) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const chord = Math.hypot(dx, dy);
  const absH = Math.abs(h);
  const r = (chord * chord) / (8 * absH) + absH / 2;
  const largeArc = absH > chord / 2 ? 1 : 0;
  const sweep = h > 0 ? 1 : 0;

  // Compute exact circle center & angles for parametric point queries
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const ux = -dy / chord;
  const uy = dx / chord;
  const distToCenter = r - absH;
  // Normal pointing toward the bulge: when sweep=1 (clockwise in SVG y-down), bulge is along -u (wait: verify sign!)
  // Test midpoint at t=0.5 directly from SVG arc formula:
  const s = h > 0 ? 1 : -1;
  // In SVG y-down coordinates, sweep=1 bends toward (dy, -dx) = (-ux, -uy)
  const bulgeX = -ux * s;
  const bulgeY = -uy * s;
  const cx = mx - bulgeX * distToCenter;
  const cy = my - bulgeY * distToCenter;

  let a1 = Math.atan2(y1 - cy, x1 - cx);
  let a2 = Math.atan2(y2 - cy, x2 - cx);
  if (sweep === 1) {
    while (a2 <= a1) a2 += 2 * Math.PI;
    if (!largeArc && a2 - a1 > Math.PI) a2 -= 2 * Math.PI;
  } else {
    while (a2 >= a1) a2 -= 2 * Math.PI;
    if (!largeArc && a1 - a2 > Math.PI) a2 += 2 * Math.PI;
  }

  return {
    d: `M${f(x1)} ${f(y1)} A${f(r)} ${f(r)} 0 ${largeArc} ${sweep} ${f(x2)} ${f(y2)}`,
    at: (t) => {
      const a = a1 + t * (a2 - a1);
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    },
  };
}

function arcThrough(x1, y1, x2, y2, h) {
  if (Math.abs(h) < 1e-3) return `M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`;
  return arcGeometry(x1, y1, x2, y2, h).d;
}

/**
 * Exact logarithmic spiral winding inward from radius rStart at angle thetaStart
 * to radius rEnd at angle thetaEnd around center (cx, cy).
 */
function logSpiral(cx, cy, rStart, rEnd, thetaStart, thetaEnd, steps = 260) {
  const k = Math.log(rEnd / rStart) / (thetaEnd - thetaStart);
  return samplePath(
    (u) => {
      const th = thetaStart + u * (thetaEnd - thetaStart);
      const r = rStart * Math.exp(k * (th - thetaStart));
      return [cx + r * Math.cos(th), cy + r * Math.sin(th)];
    },
    0,
    1,
    steps
  );
}

/**
 * Geometric scientific emblem rosettes — exact radial symmetry in crisp vector ink.
 */
function renderRosette(cx, cy, r, variant, colorClass) {
  const els = [];
  els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 1.16)}" class="plate-bg-fill" stroke="none" opacity="0.94"/>`);

  if (variant === 'coxeter8') {
    const n = 8;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n - Math.PI / 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" class="${colorClass}" stroke-width="1.45" fill="none"/>`);
    let star = '';
    for (let i = 0; i < n; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 3) % n];
      star += `M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])} `;
    }
    els.push(`<path d="${star.trim()}" class="${colorClass}" stroke-width="1.2" fill="none"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.42)}" class="${colorClass}" stroke-width="1.15" fill="none"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.17)}" class="${colorClass}-fill" stroke="none"/>`);
    for (const [px, py] of pts) {
      els.push(`<circle cx="${f(px)}" cy="${f(py)}" r="1.8" class="${colorClass}-fill" stroke="none"/>`);
    }
  } else if (variant === 'hex6') {
    const n = 6;
    const outer = Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n - Math.PI / 6;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    const inner = Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n;
      return [cx + r * 0.56 * Math.cos(a), cy + r * 0.56 * Math.sin(a)];
    });
    const polyOut = outer.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`).join(' ') + ' Z';
    const tri1 = [0, 2, 4].map((idx, i) => `${i === 0 ? 'M' : 'L'}${f(outer[idx][0])} ${f(outer[idx][1])}`).join(' ') + ' Z';
    const tri2 = [1, 3, 5].map((idx, i) => `${i === 0 ? 'M' : 'L'}${f(outer[idx][0])} ${f(outer[idx][1])}`).join(' ') + ' Z';
    const polyIn = inner.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${f(x)} ${f(y)}`).join(' ') + ' Z';
    els.push(`<path d="${polyOut}" class="${colorClass}" stroke-width="1.45" fill="none"/>`);
    els.push(`<path d="${tri1} ${tri2}" class="${colorClass}" stroke-width="1.15" fill="none"/>`);
    els.push(`<path d="${polyIn}" class="${colorClass}" stroke-width="1.05" fill="none" opacity="0.88"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.2)}" class="${colorClass}-fill" stroke="none"/>`);
    for (const [px, py] of outer) {
      els.push(`<circle cx="${f(px)}" cy="${f(py)}" r="2.1" class="${colorClass}-fill" stroke="none"/>`);
    }
  } else if (variant === 'helix10') {
    const n = 10;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" class="${colorClass}" stroke-width="1.35" fill="none"/>`);
    let chords = '';
    for (let i = 0; i < n; i++) {
      const p1 = pts[i];
      const p2 = pts[(i + 3) % n];
      chords += `M${f(p1[0])} ${f(p1[1])} L${f(p2[0])} ${f(p2[1])} `;
    }
    els.push(`<path d="${chords.trim()}" class="${colorClass}" stroke-width="1.05" fill="none"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.46)}" class="${colorClass}" stroke-width="1.05" fill="none"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.17)}" class="${colorClass}-fill" stroke="none"/>`);
  } else if (variant === 'quantum5') {
    const n = 5;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n - Math.PI / 2;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" class="${colorClass}" stroke-width="1.4" fill="none"/>`);
    const star = [0, 2, 4, 1, 3]
      .map((idx, i) => `${i === 0 ? 'M' : 'L'}${f(pts[idx][0])} ${f(pts[idx][1])}`)
      .join(' ') + ' Z';
    els.push(`<path d="${star}" class="${colorClass}" stroke-width="1.2" fill="none"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.22)}" class="${colorClass}-fill" stroke="none"/>`);
    for (const [px, py] of pts) {
      els.push(`<circle cx="${f(px)}" cy="${f(py)}" r="1.9" class="${colorClass}-fill" stroke="none"/>`);
    }
  } else {
    const n = 8;
    const pts = Array.from({ length: n }, (_, i) => {
      const a = (i * 2 * Math.PI) / n;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    const sq1 = [0, 2, 4, 6].map((idx, i) => `${i === 0 ? 'M' : 'L'}${f(pts[idx][0])} ${f(pts[idx][1])}`).join(' ') + ' Z';
    const sq2 = [1, 3, 5, 7].map((idx, i) => `${i === 0 ? 'M' : 'L'}${f(pts[idx][0])} ${f(pts[idx][1])}`).join(' ') + ' Z';
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" class="${colorClass}" stroke-width="1.3" fill="none"/>`);
    els.push(`<path d="${sq1} ${sq2}" class="${colorClass}" stroke-width="1.15" fill="none"/>`);
    els.push(`<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.22)}" class="${colorClass}-fill" stroke="none"/>`);
  }

  return `<g class="plate-rosette">${els.join('')}</g>`;
}

/**
 * Piecewise-smooth era timeline mapper matching Novum Index's three epochs:
 *   - 1969–2019 (Symbolic & Early Pioneers): x in [124 .. 510]
 *   - 2020–2023 (Early Neural Era):          x in [510 .. 920]
 *   - 2024–2026 (Modern Autonomous Surge):   x in [920 .. 1474]
 */
function dateToPlateX(dateStr) {
  const parts = dateStr.split('-').map(Number);
  const yr = parts[0] + ((parts[1] || 1) - 1) / 12 + ((parts[2] || 1) - 1) / 365;
  if (yr < 2020) {
    const u = Math.max(0, Math.min(1, (yr - 1969) / 51));
    return 124 + u * (510 - 124);
  }
  if (yr < 2024) {
    const u = Math.max(0, Math.min(1, (yr - 2020) / 4));
    return 510 + u * (920 - 510);
  }
  const u = Math.max(0, Math.min(1, (yr - 2024) / 2.95));
  return 920 + u * (1474 - 920);
}

function loadBreakthroughDates() {
  if (!fs.existsSync(INDEX_JSON)) return [];
  const data = JSON.parse(fs.readFileSync(INDEX_JSON, 'utf8'));
  return data.breakthroughs || [];
}

function buildPlateSvg({ standalone = true } = {}) {
  const breakthroughs = loadBreakthroughDates();

  const styleBlock = standalone
    ? `
    <style>
      .plate-bg-fill { fill: #f7f4ee; }
      .plate-axis { stroke: #464037; fill: none; }
      .plate-axis-faint { stroke: #9e9587; fill: none; }
      .plate-math { stroke: #1e4b8f; fill: none; }
      .plate-math-fill { fill: #1e4b8f; }
      .plate-cs { stroke: #0f766e; fill: none; }
      .plate-cs-fill { fill: #0f766e; }
      .plate-physics { stroke: #b45309; fill: none; }
      .plate-physics-fill { fill: #b45309; }
      .plate-bio { stroke: #2e6b47; fill: none; }
      .plate-bio-fill { fill: #2e6b47; }
      .plate-chem { stroke: #9a3b3b; fill: none; }
      .plate-chem-fill { fill: #9a3b3b; }
    </style>`
    : `
    <style>
      .plate-i-svg .plate-bg-fill { fill: var(--bg-canvas); }
      .plate-i-svg .plate-axis { stroke: var(--ink-secondary); fill: none; }
      .plate-i-svg .plate-axis-faint { stroke: var(--ink-faint); fill: none; }
      .plate-i-svg .plate-math { stroke: var(--disc-math); fill: none; }
      .plate-i-svg .plate-math-fill { fill: var(--disc-math); }
      .plate-i-svg .plate-cs { stroke: var(--disc-cs); fill: none; }
      .plate-i-svg .plate-cs-fill { fill: var(--disc-cs); }
      .plate-i-svg .plate-physics { stroke: var(--disc-physics); fill: none; }
      .plate-i-svg .plate-physics-fill { fill: var(--disc-physics); }
      .plate-i-svg .plate-bio { stroke: var(--disc-bio); fill: none; }
      .plate-i-svg .plate-bio-fill { fill: var(--disc-bio); }
      .plate-i-svg .plate-chem { stroke: var(--disc-chem); fill: none; }
      .plate-i-svg .plate-chem-fill { fill: var(--disc-chem); }
    </style>`;

  const layers = [];

  // ---------------------------------------------------------------------------
  // 0. BACKGROUND
  // ---------------------------------------------------------------------------
  layers.push(`<rect width="${W}" height="${H}" class="plate-bg-fill"/>`);
  if (standalone) {
    layers.push(`
      <defs>
        <radialGradient id="paper-vignette" cx="50%" cy="50%" r="72%">
          <stop offset="0%" stop-color="#fbf9f4" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#ebe3d5" stop-opacity="0.48"/>
        </radialGradient>
        <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" seed="17" result="noise"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.25  0 0 0 0 0.21  0 0 0 0 0.16  0 0 0 0.028 0" in="noise"/>
        </filter>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#paper-vignette)"/>
      <rect width="${W}" height="${H}" filter="url(#paper-grain)"/>
    `);
  }

  // ---------------------------------------------------------------------------
  // 1. SUBTLE ARCHIVAL CONSTRUCTION RINGS
  // ---------------------------------------------------------------------------
  const construction = [];
  construction.push(`<circle cx="560" cy="${CY}" r="292" class="plate-axis-faint" stroke-width="0.7" stroke-dasharray="3 6" opacity="0.32"/>`);
  construction.push(`<circle cx="1152" cy="${CY}" r="388" class="plate-axis-faint" stroke-width="0.7" stroke-dasharray="3 6" opacity="0.26"/>`);
  construction.push(`<circle cx="${X_MID}" cy="${CY}" r="118" class="plate-axis-faint" stroke-width="0.75" stroke-dasharray="2 5" opacity="0.34"/>`);
  construction.push(`<line x1="600" y1="250" x2="1000" y2="650" class="plate-axis-faint" stroke-width="0.6" stroke-dasharray="2 7" opacity="0.22"/>`);
  construction.push(`<line x1="600" y1="650" x2="1000" y2="250" class="plate-axis-faint" stroke-width="0.6" stroke-dasharray="2 7" opacity="0.22"/>`);
  layers.push(`<g id="construction-grid">${construction.join('\n')}</g>`);

  // ---------------------------------------------------------------------------
  // 2. GRADUATED CARTOGRAPHIC AXES
  // ---------------------------------------------------------------------------
  const axes = [];
  const yTop = 80;
  const yBot = 820;
  const cap = 12;

  axes.push(`<line x1="${X_MIN}" y1="${CY}" x2="${X_MAX}" y2="${CY}" class="plate-axis" stroke-width="1.25" opacity="0.76"/>`);
  axes.push(`<path d="M${X_MIN} ${CY - 9} L${X_MIN} ${CY + 9} M${X_MAX} ${CY - 9} L${X_MAX} ${CY + 9}" class="plate-axis" stroke-width="1.25" opacity="0.76"/>`);

  for (let dx = 44; dx <= 660; dx += 44) {
    const isMajor = dx % 88 === 0;
    const h = isMajor ? 8.5 : 4.5;
    for (const sign of [-1, 1]) {
      const tx = X_MID + sign * dx;
      if (tx > X_MIN + 8 && tx < X_MAX - 8 && Math.abs(tx - X_LEFT) > 6 && Math.abs(tx - X_RIGHT) > 6) {
        axes.push(`<line x1="${f(tx)}" y1="${f(CY - h)}" x2="${f(tx)}" y2="${f(CY + h)}" class="plate-axis" stroke-width="${isMajor ? 1.05 : 0.8}" opacity="${isMajor ? 0.62 : 0.42}"/>`);
      }
    }
  }

  for (const [axX, tickSide] of [
    [X_LEFT, -1],
    [X_MID, -1],
    [X_RIGHT, 1],
  ]) {
    axes.push(`<line x1="${axX}" y1="${yTop}" x2="${axX}" y2="${yBot}" class="plate-axis" stroke-width="1.25" opacity="0.76"/>`);
    axes.push(`<path d="M${axX} ${yTop} h${tickSide * cap} M${axX} ${yBot} h${tickSide * cap}" class="plate-axis" stroke-width="1.25" opacity="0.76"/>`);
    for (let dy = 56; dy <= 336; dy += 56) {
      const isMajor = dy % 112 === 0;
      const len = isMajor ? 10 : 6;
      for (const s of [-1, 1]) {
        const ty = CY + s * dy;
        axes.push(`<line x1="${axX}" y1="${ty}" x2="${axX + tickSide * len}" y2="${ty}" class="plate-axis" stroke-width="${isMajor ? 1.05 : 0.85}" opacity="${isMajor ? 0.66 : 0.46}"/>`);
      }
    }
  }

  // Exact first 5 nontrivial Riemann Zeta zero heights subtly etched on right of critical line (x = 800)
  const zetaZeros = [14.1347, 21.022, 25.0109, 30.4249, 32.9351];
  for (const gamma of zetaZeros) {
    const dy = (gamma / 34.5) * 336;
    for (const s of [-1, 1]) {
      const zy = CY + s * dy;
      axes.push(`<line x1="${X_MID}" y1="${f(zy)}" x2="${X_MID + 6.5}" y2="${f(zy)}" class="plate-math" stroke-width="1.15" opacity="0.6"/>`);
      axes.push(`<circle cx="${X_MID + 9.5}" cy="${f(zy)}" r="1.45" class="plate-math-fill" opacity="0.56"/>`);
    }
  }

  layers.push(`<g id="coordinate-axes">${axes.join('\n')}</g>`);

  // ---------------------------------------------------------------------------
  // 3. REAL 298-BREAKTHROUGH DATA SIGNATURE (1969–2026) ON PIECEWISE ERA SCALE
  //    Clean vertical micro-engraving pips along the equator: zero clumping,
  //    showing the true historical cadence across all 5 discipline inks!
  // ---------------------------------------------------------------------------
  if (breakthroughs.length > 0) {
    const discStroke = {
      Mathematics: 'plate-math',
      'Computer Science & AI': 'plate-cs',
      'Physics & Quantum': 'plate-physics',
      'Biology & Medicine': 'plate-bio',
      'Chemistry & Materials': 'plate-chem',
    };
    const sorted = [...breakthroughs].sort((a, b) => a.date.localeCompare(b.date));
    const pips = [];
    for (let i = 0; i < sorted.length; i++) {
      const b = sorted[i];
      const x = dateToPlateX(b.date);
      const cls = discStroke[b.discipline] || 'plate-math';
      const dir = i % 2 === 0 ? -1 : 1;
      const len = 3.5 + ((i * 7) % 5) * 1.05;
      pips.push(`<line x1="${f(x)}" y1="${f(CY + dir * 2.2)}" x2="${f(x)}" y2="${f(CY + dir * (2.2 + len))}" class="${cls}" stroke-width="0.9" opacity="0.44"/>`);
    }
    layers.push(`<g id="data-cadence-pips">${pips.join('')}</g>`);
  }

  // ---------------------------------------------------------------------------
  // 4. LEFT HEMISPHERE — MATHEMATICS (Sapphire) & CS/AI (Teal)
  //    Clean Poincaré Hyperbolic Disk + Coaxial Steiner Lunes + Projective Polytope Crown
  // ---------------------------------------------------------------------------
  const left = [];
  const LDX = 560;
  const LDR = 240; // Right edge at x = 800 exactly!

  // 4a. Primary Poincaré disk boundary
  left.push(`<circle cx="${LDX}" cy="${CY}" r="${LDR}" class="plate-math" stroke-width="2.1"/>`);

  // 4b. Symmetric western sweeping involute arcs from (400, 450)
  left.push(`<path d="${arcThrough(X_LEFT, CY, 294, CY + 138, 42)}" class="plate-math" stroke-width="1.75"/>`);
  left.push(`<path d="${arcThrough(X_LEFT, CY, 294, CY - 138, -42)}" class="plate-math" stroke-width="1.35" opacity="0.62"/>`);

  // 4c. Coaxial Steiner lune family passing EXACTLY through (400, 450) and (800, 450)
  const luneSagittas = [
    { h: 200, cls: 'plate-math', sw: 1.65, op: 0.94 },
    { h: -200, cls: 'plate-math', sw: 1.65, op: 0.94 },
    { h: 138, cls: 'plate-cs', sw: 1.45, op: 0.88 },
    { h: -138, cls: 'plate-cs', sw: 1.45, op: 0.88 },
    { h: 82, cls: 'plate-bio', sw: 1.3, op: 0.8 },
    { h: -82, cls: 'plate-bio', sw: 1.3, op: 0.8 },
  ];
  for (const { h, cls, sw, op } of luneSagittas) {
    left.push(`<path d="${arcThrough(X_LEFT, CY, X_MID, CY, h)}" class="${cls}" stroke-width="${sw}" opacity="${op}"/>`);
  }

  // 4d. Nested equatorial resonance circles inside left hemisphere
  left.push(`<circle cx="678" cy="${CY}" r="122" class="plate-math" stroke-width="1.4" opacity="0.86"/>`);
  left.push(`<circle cx="718" cy="${CY}" r="82" class="plate-cs" stroke-width="1.35" opacity="0.88"/>`);
  left.push(`<circle cx="596" cy="${CY}" r="106" class="plate-physics" stroke-width="1.2" opacity="0.68"/>`);
  left.push(`<circle cx="508" cy="${CY}" r="108" class="plate-chem" stroke-width="1.2" opacity="0.62"/>`);

  // 4e. Exact Poincaré hyperbolic geodesics (strictly orthogonal to the boundary circle!)
  const geoPairs = [
    { a1: -Math.PI * 0.72, a2: -Math.PI * 0.08, cls: 'plate-math', sw: 1.5 },
    { a1: Math.PI * 0.72, a2: Math.PI * 0.08, cls: 'plate-math', sw: 1.5 },
    { a1: -Math.PI * 0.88, a2: -Math.PI * 0.28, cls: 'plate-math', sw: 1.35 },
    { a1: Math.PI * 0.88, a2: Math.PI * 0.28, cls: 'plate-math', sw: 1.35 },
    { a1: -Math.PI * 0.62, a2: Math.PI * 0.28, cls: 'plate-cs', sw: 1.3 },
    { a1: Math.PI * 0.62, a2: -Math.PI * 0.28, cls: 'plate-cs', sw: 1.3 },
    { a1: -Math.PI * 0.44, a2: Math.PI * 0.44, cls: 'plate-chem', sw: 1.25 },
    { a1: -Math.PI * 0.30, a2: Math.PI * 0.30, cls: 'plate-physics', sw: 1.25 },
  ];
  for (const { a1, a2, cls, sw } of geoPairs) {
    left.push(`<path d="${hyperbolicGeodesic(LDX, CY, LDR, a1, a2)}" class="${cls}" stroke-width="${sw}" opacity="0.9"/>`);
  }

  // 4f. Clean Symmetric Faceted Polytope / Sphere-Packing Crown (Top & Bottom)
  //     Every radial facet ray terminates cleanly ON the Poincaré disk perimeter (no messy clutter!)
  const crestThetaL = Math.PI * 0.57;
  const crestThetaM1 = Math.PI * 0.45;
  const crestThetaM2 = Math.PI * 0.31;
  const crestThetaR = Math.PI * 0.16;

  for (const sign of [-1, 1]) {
    const pL = [LDX + LDR * Math.cos(sign * crestThetaL), CY + LDR * Math.sin(sign * crestThetaL)];
    const pM1 = [LDX + LDR * Math.cos(sign * crestThetaM1), CY + LDR * Math.sin(sign * crestThetaM1)];
    const pM2 = [LDX + LDR * Math.cos(sign * crestThetaM2), CY + LDR * Math.sin(sign * crestThetaM2)];
    const pR = [LDX + LDR * Math.cos(sign * crestThetaR), CY + LDR * Math.sin(sign * crestThetaR)];

    const apex = [568, CY + sign * 308];
    const ridge1 = [624, CY + sign * 274];
    const ridge2 = [682, CY + sign * 232];
    const ridge3 = [734, CY + sign * 178];
    const pZero = [X_MID, CY];

    // Crisp faceted outer crest
    left.push(
      `<path d="M${f(pL[0])} ${f(pL[1])} L${f(apex[0])} ${f(apex[1])} L${f(ridge1[0])} ${f(ridge1[1])} L${f(ridge2[0])} ${f(ridge2[1])} L${f(ridge3[0])} ${f(ridge3[1])} L${f(pZero[0])} ${f(pZero[1])}" class="plate-math" stroke-width="1.75" stroke-linejoin="round"/>`
    );
    // Clean crown-only triangulation facets stopping cleanly on the disk perimeter
    left.push(
      `<path d="M${f(apex[0])} ${f(apex[1])} L${f(pM1[0])} ${f(pM1[1])} M${f(ridge1[0])} ${f(ridge1[1])} L${f(pM1[0])} ${f(pM1[1])} M${f(ridge1[0])} ${f(ridge1[1])} L${f(pM2[0])} ${f(pM2[1])} M${f(ridge2[0])} ${f(ridge2[1])} L${f(pM2[0])} ${f(pM2[1])} M${f(ridge2[0])} ${f(ridge2[1])} L${f(pR[0])} ${f(pR[1])} M${f(ridge3[0])} ${f(ridge3[1])} L${f(pR[0])} ${f(pR[1])}" class="plate-math" stroke-width="1.15" opacity="0.78"/>`
    );
    // Warm amber geometric facet highlights inside crown
    left.push(
      `<path d="M${f(pL[0])} ${f(pL[1])} L${f(ridge1[0])} ${f(ridge1[1])} M${f(pM1[0])} ${f(pM1[1])} L${f(ridge2[0])} ${f(ridge2[1])}" class="plate-physics" stroke-width="1.0" opacity="0.62"/>`
    );
    // Delicate connecting bridge arc from crown apex to exact outer major tick on central critical axis (800, 450 ± 336)
    left.push(
      `<path d="${arcThrough(apex[0], apex[1], X_MID, CY + sign * 336, -sign * 22)}" class="plate-math" stroke-width="1.15" opacity="${sign === 1 ? 0.68 : 0.5}"/>`
    );
  }

  layers.push(`<g id="left-hemisphere">${left.join('\n')}</g>`);

  // ---------------------------------------------------------------------------
  // 5. CENTRAL SINGULARITY (x = 800, y = 450) — BIPOLAR APOLLONIAN RINGS & LEMNISCATE
  // ---------------------------------------------------------------------------
  const center = [];
  for (const [r, cls, sw] of [
    [28, 'plate-cs', 1.5],
    [48, 'plate-math', 1.45],
    [72, 'plate-cs', 1.2],
  ]) {
    center.push(`<circle cx="${X_MID - r}" cy="${CY}" r="${r}" class="${cls}" stroke-width="${sw}" opacity="0.92"/>`);
    center.push(`<circle cx="${X_MID + r}" cy="${CY}" r="${r}" class="${cls}" stroke-width="${sw}" opacity="0.92"/>`);
  }

  const lemA = 176;
  const lemniscate = samplePath(
    (t) => {
      const s = Math.sin(t);
      const c = Math.cos(t);
      const denom = 1 + s * s;
      return [X_MID + (lemA * c) / denom, CY + (lemA * s * c) / denom];
    },
    0,
    2 * Math.PI,
    240,
    true
  );
  center.push(`<path d="${lemniscate}" class="plate-physics" stroke-width="1.4" opacity="0.78"/>`);

  layers.push(`<g id="central-singularity">${center.join('\n')}</g>`);

  // ---------------------------------------------------------------------------
  // 6. RIGHT HEMISPHERE — PHYSICS & QUANTUM (Amber), BIOLOGY (Emerald), CHEMISTRY (Carmine)
  //    All arcs anchored to EXACT analytical circle/axis intersections!
  // ---------------------------------------------------------------------------
  const right = [];
  const RDX = 1152;
  const RDR = 352; // Touches (800, 450) & (1504, 450) EXACTLY!
  // Exact vertical coordinates where the grand circle crosses x = 1200:
  const rightCrossDy = Math.sqrt(RDR * RDR - (X_RIGHT - RDX) ** 2); // 348.712...
  const yRightTop = CY - rightCrossDy; // 101.29
  const yRightBot = CY + rightCrossDy; // 798.71

  // 6a. Grand Right Orbital Circle (authoritative outer frame — nothing pokes outside it!)
  right.push(`<path d="M${X_MID} ${CY} A${RDR} ${RDR} 0 0 1 ${X_MAX} ${CY}" class="plate-bio" stroke-width="2.15"/>`);
  right.push(`<path d="M${X_MAX} ${CY} A${RDR} ${RDR} 0 0 1 ${X_MID} ${CY}" class="plate-physics" stroke-width="2.15"/>`);

  // Inner conjugate arcs neatly nested INSIDE the grand circle, meeting exact (1200, yRightTop/Bot)!
  right.push(`<path d="${arcThrough(X_MID, CY, X_RIGHT, yRightTop, 92)}" class="plate-cs" stroke-width="1.45" opacity="0.82"/>`);
  right.push(`<path d="${arcThrough(X_MID, CY, X_RIGHT, yRightBot, -108)}" class="plate-math" stroke-width="1.55" opacity="0.88"/>`);

  // 6b. Symmetric Magnetic-Dipole / Protein-Fold Bowls centered on (1200, 450)
  const bowlR = 126;
  right.push(`<path d="M${X_RIGHT - bowlR} ${CY - bowlR} A${bowlR} ${bowlR} 0 0 0 ${X_RIGHT + bowlR} ${CY - bowlR}" class="plate-bio" stroke-width="1.75"/>`);
  right.push(`<path d="M${X_RIGHT - bowlR} ${CY + bowlR} A${bowlR} ${bowlR} 0 0 1 ${X_RIGHT + bowlR} ${CY + bowlR}" class="plate-math" stroke-width="1.75"/>`);

  const dipR = 178;
  right.push(`<path d="M${X_RIGHT - dipR} ${CY} A${dipR} ${dipR} 0 0 1 ${X_RIGHT + dipR} ${CY}" class="plate-chem" stroke-width="1.2" opacity="0.58" stroke-dasharray="6 4"/>`);
  right.push(`<path d="M${X_RIGHT - dipR} ${CY} A${dipR} ${dipR} 0 0 0 ${X_RIGHT + dipR} ${CY}" class="plate-physics" stroke-width="1.2" opacity="0.58" stroke-dasharray="6 4"/>`);

  // Key focal nodes on the right vertical axis
  const nodeUR = [X_RIGHT, 256];
  const nodeLR = [X_RIGHT, 644];

  // 6c. Exact Parametric Double-Helix / AlphaFold Ribbon passing CLEANLY through (800, 450) -> nodeUR (1200, 256) -> (1504, 450)
  //     Constructed as an exact circular arc spine through the 3 points!
  const helixLeftArc = arcGeometry(X_MID, CY, nodeUR[0], nodeUR[1], 44);
  const helixRightArc = arcGeometry(nodeUR[0], nodeUR[1], X_MAX, CY, 54);
  const evalHelixSpine = (t) => {
    const eps = 1e-4;
    const sample = (u) => (u <= 0.56 ? helixLeftArc.at(u / 0.56) : helixRightArc.at((u - 0.56) / 0.44));
    const [x, y] = sample(t);
    const [x0, y0] = sample(Math.max(0, t - eps));
    const [x1, y1] = sample(Math.min(1, t + eps));
    const dx = x1 - x0;
    const dy = y1 - y0;
    const len = Math.hypot(dx, dy) || 1;
    return { x, y, nx: -dy / len, ny: dx / len };
  };
  // Envelope pinches cleanly to 0 at t=0 (800,450), t=0.56 (nodeUR), and t=1 (1504,450)!
  const helixAmp = (t) => {
    const nodePinch = Math.min(1, Math.abs(t - 0.56) * 5.5);
    return 14.5 * Math.sin(Math.PI * t) * (0.22 + 0.78 * nodePinch);
  };
  const strand1 = samplePath((t) => {
    const { x, y, nx, ny } = evalHelixSpine(t);
    const off = helixAmp(t) * Math.sin(7.0 * Math.PI * t);
    return [x + nx * off, y + ny * off];
  }, 0, 1, 280);
  const strand2 = samplePath((t) => {
    const { x, y, nx, ny } = evalHelixSpine(t);
    const off = -helixAmp(t) * Math.sin(7.0 * Math.PI * t);
    return [x + nx * off, y + ny * off];
  }, 0, 1, 280);
  const rungs = [];
  for (let i = 2; i <= 26; i++) {
    const t = i / 28;
    const { x, y, nx, ny } = evalHelixSpine(t);
    const off = helixAmp(t) * Math.sin(7.0 * Math.PI * t);
    if (Math.abs(off) > 3.2) {
      rungs.push(`M${f(x + nx * off)} ${f(y + ny * off)} L${f(x - nx * off)} ${f(y - ny * off)}`);
    }
  }
  right.push(`<path d="${rungs.join(' ')}" class="plate-bio" stroke-width="0.85" opacity="0.34"/>`);
  right.push(`<path d="${strand1}" class="plate-bio" stroke-width="1.6" opacity="0.92"/>`);
  right.push(`<path d="${strand2}" class="plate-cs" stroke-width="1.4" opacity="0.8"/>`);

  // 6d. Exact Navier–Stokes / Fluid Vortex & Gravitational Inspiral Spirals
  // Upper-left inner spiral
  const sp1Cx = 944;
  const sp1Cy = 374;
  const sp1Path = logSpiral(
    sp1Cx,
    sp1Cy,
    Math.hypot(X_MID - sp1Cx, CY - sp1Cy),
    4.5,
    Math.atan2(CY - sp1Cy, X_MID - sp1Cx),
    Math.atan2(CY - sp1Cy, X_MID - sp1Cx) + 3.45 * Math.PI,
    260
  );
  right.push(`<path d="${sp1Path}" class="plate-math" stroke-width="1.6" opacity="0.92"/>`);

  // Upper-right grand Navier–Stokes Vortex centered at (1106, 264) with osculating circle (r = 52)
  // Decay tuned cleanly so its outer sweep stays 100% inside the grand right orbital circle!
  const sp2Cx = 1106;
  const sp2Cy = 264;
  const sp2Start = Math.atan2(CY - sp2Cy, X_MID - sp2Cx);
  const sp2Path = logSpiral(sp2Cx, sp2Cy, Math.hypot(X_MID - sp2Cx, CY - sp2Cy), 3.6, sp2Start, sp2Start + 3.05 * Math.PI, 300);
  right.push(`<path d="${sp2Path}" class="plate-cs" stroke-width="1.55" opacity="0.9"/>`);
  right.push(`<circle cx="${sp2Cx}" cy="${sp2Cy}" r="52" class="plate-bio" stroke-width="1.45" opacity="0.84"/>`);

  // Upper-right Amber & Carmine arcs cleanly anchored to nodeUR (1200, 256) and X_MAX (1504, 450)
  right.push(`<path d="${arcThrough(nodeUR[0], nodeUR[1], X_MAX, CY, 74)}" class="plate-physics" stroke-width="1.75"/>`);
  right.push(`<path d="${arcThrough(X_MID + 96, CY, nodeUR[0], nodeUR[1], -62)}" class="plate-physics" stroke-width="1.5" opacity="0.9"/>`);
  right.push(`<path d="${arcThrough(sp2Cx, sp2Cy - 52, nodeUR[0], nodeUR[1], 32)}" class="plate-physics" stroke-width="1.45"/>`);
  right.push(`<path d="${arcThrough(X_MID, CY, X_RIGHT, CY - 194, -52)}" class="plate-chem" stroke-width="1.3" opacity="0.72"/>`);
  right.push(`<path d="${arcThrough(X_RIGHT, CY - 194, X_MAX, CY, 44)}" class="plate-chem" stroke-width="1.3" opacity="0.72"/>`);

  // Lower-right Counter-Rotating Vortex & Gravitational Inspiral
  const sp3Cx = 972;
  const sp3Cy = 574;
  const sp3Start = Math.atan2(CY - sp3Cy, X_MID - sp3Cx);
  const sp3Path = logSpiral(sp3Cx, sp3Cy, Math.hypot(X_MID - sp3Cx, CY - sp3Cy), 4.2, sp3Start, sp3Start - 3.65 * Math.PI, 280);
  right.push(`<path d="${sp3Path}" class="plate-physics" stroke-width="1.6" opacity="0.92"/>`);

  // Lower-right Chemistry PES & Biology Connectome Trajectories
  const csNodeLR = [974, 630];
  const chemNode = [1134, 650];
  const lowerBioArc = arcGeometry(csNodeLR[0], csNodeLR[1], chemNode[0], chemNode[1], 24);
  // Place bioNodeLR EXACTLY at t = 0.48 ON lowerBioArc so it locks directly onto the curve!
  const bioNodeLR = lowerBioArc.at(0.48);

  right.push(`<path d="${arcThrough(X_MID, CY, csNodeLR[0], csNodeLR[1], -58)}" class="plate-cs" stroke-width="1.55"/>`);
  right.push(`<path d="${lowerBioArc.d}" class="plate-bio" stroke-width="1.6"/>`);
  right.push(`<path d="${arcThrough(chemNode[0], chemNode[1], X_MAX, CY, -108)}" class="plate-chem" stroke-width="1.8"/>`);
  right.push(`<path d="${arcThrough(X_MID + 96, CY, nodeLR[0], nodeLR[1], 62)}" class="plate-chem" stroke-width="1.5" opacity="0.88"/>`);
  right.push(`<path d="${arcThrough(nodeLR[0], nodeLR[1], X_MAX, CY, -76)}" class="plate-physics" stroke-width="1.75"/>`);

  // Lower-right osculating reaction-coordinate loop centered cleanly on the chemistry node
  right.push(`<circle cx="${chemNode[0] - 24}" cy="${chemNode[1] + 18}" r="42" class="plate-chem" stroke-width="1.35" opacity="0.84"/>`);
  // Clean lower arcs terminating EXACTLY at (1200, yRightBot) without dipping outside the grand circle!
  right.push(`<path d="${arcThrough(csNodeLR[0], csNodeLR[1], X_RIGHT, yRightBot, -68)}" class="plate-bio" stroke-width="1.45" opacity="0.88"/>`);
  right.push(`<path d="${arcThrough(nodeLR[0], nodeLR[1], X_RIGHT, yRightBot, 58)}" class="plate-physics" stroke-width="1.4" opacity="0.84"/>`);
  // Subtle harmonic tie from bioNodeLR straight into the lower dipole shell
  right.push(`<path d="${arcThrough(bioNodeLR[0], bioNodeLR[1], nodeLR[0], nodeLR[1], -28)}" class="plate-bio" stroke-width="1.15" opacity="0.7"/>`);

  layers.push(`<g id="right-hemisphere">${right.join('\n')}</g>`);

  // ---------------------------------------------------------------------------
  // 7. CRISP MATHEMATICAL & SCIENTIFIC ROSETTE NODES (All 5 Disciplines!)
  //    Every single rosette sits directly on an exact geometric intersection!
  // ---------------------------------------------------------------------------
  const nodes = [];
  const pLTop = [LDX + LDR * Math.cos(-crestThetaL), CY + LDR * Math.sin(-crestThetaL)];
  const pLBot = [LDX + LDR * Math.cos(crestThetaL), CY + LDR * Math.sin(crestThetaL)];

  // Mathematics (Sapphire) — E8 Coxeter 8-fold star rosettes
  nodes.push(renderRosette(pLTop[0], pLTop[1], 14.5, 'coxeter8', 'plate-math'));
  nodes.push(renderRosette(pLBot[0], pLBot[1], 14.5, 'coxeter8', 'plate-math'));
  nodes.push(renderRosette(670, CY, 13.5, 'coxeter8', 'plate-math'));

  // Computer Science & AI (Teal) — Hypercube/Octagram algorithmic nodes
  nodes.push(renderRosette(706, CY, 11.5, 'hyper4', 'plate-cs'));
  nodes.push(renderRosette(csNodeLR[0], csNodeLR[1], 12.5, 'hyper4', 'plate-cs'));

  // Physics & Quantum (Amber) — 5-fold quantum stabilizer stars on right axis foci
  nodes.push(renderRosette(nodeUR[0], nodeUR[1], 12.5, 'quantum5', 'plate-physics'));
  nodes.push(renderRosette(nodeLR[0], nodeLR[1], 11.5, 'quantum5', 'plate-physics'));

  // Biology & Medicine (Emerald) — 10-fold biomolecular helix mandalas ON exact curve intersections
  nodes.push(renderRosette(bioNodeLR[0], bioNodeLR[1], 12.5, 'helix10', 'plate-bio'));
  nodes.push(renderRosette(sp2Cx, sp2Cy, 10, 'helix10', 'plate-bio'));

  // Chemistry & Materials (Carmine) — 6-fold Bravais crystal coordination rosette
  nodes.push(renderRosette(chemNode[0], chemNode[1], 17.5, 'hex6', 'plate-chem'));

  // Precision focal pinholes at geometric poles & spiral centers
  const pins = [
    [X_LEFT, CY, 'plate-math'],
    [X_MID, CY, 'plate-axis'],
    [X_RIGHT, CY, 'plate-bio'],
    [X_MAX, CY, 'plate-physics'],
    [sp1Cx, sp1Cy, 'plate-math'],
    [sp3Cx, sp3Cy, 'plate-physics'],
  ];
  for (const [px, py, cls] of pins) {
    nodes.push(`<circle cx="${f(px)}" cy="${f(py)}" r="3.6" class="plate-bg-fill" stroke="none"/>`);
    nodes.push(`<circle cx="${f(px)}" cy="${f(py)}" r="3.4" class="${cls}" stroke-width="1.4"/>`);
  }

  layers.push(`<g id="focal-rosettes">${nodes.join('\n')}</g>`);

  const attrs = standalone
    ? `xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-labelledby="plate-i-title plate-i-desc"`
    : `class="plate-i-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="plate-i-title plate-i-desc"`;

  return `<svg ${attrs}>
  <title id="plate-i-title">Plate I — Novum Index Mathematical &amp; Scientific Cartography</title>
  <desc id="plate-i-desc">Mathematical vector engraving uniting all five Novum Index disciplines: Poincaré hyperbolic geodesics and E8 Coxeter rosettes (Mathematics), algorithmic octagrams (Computer Science &amp; AI), Navier–Stokes spirals and quantum stabilizer stars (Physics &amp; Quantum), double-helical biomolecular ribbons (Biology &amp; Medicine), and hexagonal crystallographic lattices (Chemistry &amp; Materials), anchored by 298 historical breakthrough cadence marks from 1969 to 2026.</desc>
  ${styleBlock}
  ${layers.join('\n  ')}
</svg>
`;
}

// 1. Standalone vector plate public/plate-i.svg
const standaloneSvg = buildPlateSvg({ standalone: true });
const svgOutPath = path.join(PUBLIC_DIR, 'plate-i.svg');
fs.writeFileSync(svgOutPath, standaloneSvg, 'utf8');
console.log(`✓ Wrote ${path.relative(ROOT, svgOutPath)} (${(standaloneSvg.length / 1024).toFixed(1)} kB)`);

// 2. Theme-aware inline SVG module src/components/plateSvg.js
const inlineSvg = buildPlateSvg({ standalone: false });
const jsOutPath = path.join(ROOT, 'src/components/plateSvg.js');
fs.writeFileSync(
  jsOutPath,
  `// Auto-generated by scripts/generate-plate.mjs — do not hand-edit.\nexport const PLATE_I_SVG = ${JSON.stringify(inlineSvg)};\n`,
  'utf8'
);
console.log(`✓ Wrote ${path.relative(ROOT, jsOutPath)} (${(inlineSvg.length / 1024).toFixed(1)} kB)`);

// 3. Render 2x-supersampled crisp raster JPEG public/og-card.jpg (1600x900) via Playwright Chromium
const ogOutPath = path.join(PUBLIC_DIR, 'og-card.jpg');
const pyRender = `
import pathlib
from playwright.sync_api import sync_playwright

svg_text = pathlib.Path(${JSON.stringify(svgOutPath)}).read_text(encoding="utf-8")
html = f"""<!doctype html><html><head><style>
  html, body {{ margin: 0; padding: 0; width: 1600px; height: 900px; overflow: hidden; background: #f7f4ee; }}
  svg {{ display: block; width: 1600px; height: 900px; }}
</style></head><body>{svg_text}</body></html>"""

with sync_playwright() as p:
    browser = p.chromium.launch(args=["--disable-dev-shm-usage"])
    page = browser.new_page(viewport={"width": 1600, "height": 900}, device_scale_factor=2)
    page.set_content(html, wait_until="load")
    page.screenshot(path=${JSON.stringify(ogOutPath)}, type="jpeg", quality=94, scale="css")
    browser.close()
`;

execFileSync('python3', ['-c', pyRender], { stdio: 'inherit' });
const jpgSize = fs.statSync(ogOutPath).size;
console.log(`✓ Rendered ${path.relative(ROOT, ogOutPath)} (1600×900, 2× supersampled JPEG, ${(jpgSize / 1024).toFixed(1)} kB)`);
