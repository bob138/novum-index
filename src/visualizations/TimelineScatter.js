import { DISCIPLINE_META, escapeHtml, formatDate } from '../scoring.js';

const DAY_MS = 86400000;
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const SCATTER_Y_METRICS = {
  composite: {
    label: 'Composite Impact',
    axisLabel: 'COMPOSITE IMPACT INDEX (0–100)',
    getValue: (item) => item.compositeScore,
  },
  foundational: {
    label: 'Foundational Depth',
    axisLabel: 'FOUNDATIONAL DEPTH SCORE (0–100)',
    getValue: (item) => item.scores.foundational,
  },
  ripple: {
    label: 'Downstream Ripple',
    axisLabel: 'DOWNSTREAM RIPPLE SCORE (0–100)',
    getValue: (item) => item.scores.ripple,
  },
  verification: {
    label: 'Verification Rigor',
    axisLabel: 'VERIFICATION RIGOR SCORE (0–100)',
    getValue: (item) => item.scores.verification,
  },
  velocity: {
    label: 'Acceleration Velocity',
    axisLabel: 'ACCELERATION VELOCITY SCORE (0–100)',
    getValue: (item) => item.scores.velocity,
  },
};

export const SCATTER_PRESETS = [
  { id: 'all', label: 'All (1976–26)' },
  { id: '2020-2026', label: '2020–26', tMin: '2019-11-01', tMax: '2026-12-20' },
  { id: '2024-2026', label: '2024–26', tMin: '2023-12-01', tMax: '2026-12-20' },
  { id: '2026', label: '2026', tMin: '2025-12-20', tMax: '2026-12-10' },
  { id: 'q4-2026', label: 'Q4 2026', tMin: '2026-09-25', tMax: '2026-12-03' },
];

function toTimestamp(iso) {
  return Date.parse(`${iso}T00:00:00Z`);
}

function buildDynamicXTicks(tMin, tMax) {
  const spanDays = (tMax - tMin) / DAY_MS;
  const ticks = [];
  const startD = new Date(tMin);
  const endD = new Date(tMax);

  if (spanDays > 12000) {
    const startYear = Math.ceil(startD.getUTCFullYear() / 5) * 5;
    for (let y = startYear; y <= endD.getUTCFullYear(); y += 5) {
      const t = Date.UTC(y, 0, 1);
      if (t >= tMin && t <= tMax) ticks.push({ t, label: String(y), major: y % 10 === 0 });
    }
  } else if (spanDays > 4000) {
    const startYear = Math.ceil(startD.getUTCFullYear() / 5) * 5;
    for (let y = startYear; y <= endD.getUTCFullYear(); y += 5) {
      const t = Date.UTC(y, 0, 1);
      if (t >= tMin && t <= tMax) ticks.push({ t, label: String(y), major: true });
    }
  } else if (spanDays > 1200) {
    for (let y = startD.getUTCFullYear(); y <= endD.getUTCFullYear(); y += 1) {
      const t = Date.UTC(y, 0, 1);
      if (t >= tMin && t <= tMax) ticks.push({ t, label: String(y), major: true });
    }
  } else if (spanDays > 450) {
    let y = startD.getUTCFullYear();
    let m = Math.floor(startD.getUTCMonth() / 3) * 3;
    while (true) {
      const t = Date.UTC(y, m, 1);
      if (t > tMax) break;
      if (t >= tMin) {
        const major = m === 0;
        ticks.push({
          t,
          label: major ? String(y) : `${MONTH_SHORT[m]} ${String(y).slice(2)}`,
          major,
        });
      }
      m += 3;
      if (m >= 12) {
        m -= 12;
        y += 1;
      }
    }
  } else if (spanDays > 120) {
    let y = startD.getUTCFullYear();
    let m = startD.getUTCMonth();
    while (true) {
      const t = Date.UTC(y, m, 1);
      if (t > tMax) break;
      if (t >= tMin) {
        const major = m === 0;
        ticks.push({
          t,
          label: `${MONTH_SHORT[m]} ${String(y).slice(2)}`,
          major,
        });
      }
      m += 1;
      if (m >= 12) {
        m = 0;
        y += 1;
      }
    }
  } else if (spanDays > 35) {
    let y = startD.getUTCFullYear();
    let m = startD.getUTCMonth();
    while (true) {
      for (const day of [1, 15]) {
        const t = Date.UTC(y, m, day);
        if (t >= tMin && t <= tMax) {
          ticks.push({
            t,
            label: `${MONTH_SHORT[m]} ${day}`,
            major: day === 1,
          });
        }
      }
      m += 1;
      if (m >= 12) {
        m = 0;
        y += 1;
      }
      if (Date.UTC(y, m, 1) > tMax) break;
    }
  } else {
    const stepDays = Math.max(1, Math.round(spanDays / 6));
    let t = Math.ceil(tMin / DAY_MS) * DAY_MS;
    while (t <= tMax) {
      const d = new Date(t);
      ticks.push({
        t,
        label: `${MONTH_SHORT[d.getUTCMonth()]} ${d.getUTCDate()}`,
        major: d.getUTCDate() === 1,
      });
      t += stepDays * DAY_MS;
    }
  }

  // Thin ticks if too dense
  if (ticks.length > 10) {
    const stride = Math.ceil(ticks.length / 9);
    return ticks.filter((_, i) => i % stride === 0);
  }
  return ticks;
}

function buildDynamicYTicks(minY, maxY) {
  const span = maxY - minY;
  const step = span <= 12 ? 2 : span <= 32 ? 5 : span <= 65 ? 10 : 20;
  const start = Math.ceil(minY / step) * step;
  const ticks = [];
  for (let v = start; v <= maxY + 0.001; v += step) {
    ticks.push(Math.round(v));
  }
  return ticks;
}

function buildScatterSvgContent(items, opts = {}) {
  const timeScale = opts.timeScale === 'linear' ? 'linear' : 'split';
  const yMode = opts.yMode === 'full' ? 'full' : 'auto';
  const yMetricKey = SCATTER_Y_METRICS[opts.yMetric] ? opts.yMetric : 'composite';
  const presetId = opts.preset || 'all';
  const customZoom = opts.customZoom || null;
  const metricMeta = SCATTER_Y_METRICS[yMetricKey];

  const width = 1040;
  const height = 500;
  const margin = { top: 38, right: 42, bottom: 52, left: 58 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const hasPioneers = items.some((i) => i.date < '2020-01-01');
  const hasEarlyAnchors = items.some((i) => i.date >= '2020-01-01' && i.date < '2024-01-01');
  const hasWave = items.some((i) => i.date >= '2024-01-01');
  const hasModern = hasEarlyAnchors || hasWave;

  const activePreset = SCATTER_PRESETS.find((p) => p.id === presetId) || SCATTER_PRESETS[0];
  const isZoomed = Boolean(customZoom) || presetId !== 'all';
  const splitPioneerZone = !isZoomed && timeScale === 'split' && hasPioneers && hasModern;

  const pioneerZoneW = splitPioneerZone ? Math.round(innerW * 0.14) : 0;
  const pioneerGap = splitPioneerZone ? 16 : 0;
  const modernStartX = margin.left + pioneerZoneW + pioneerGap;
  const modernW = innerW - pioneerZoneW - pioneerGap;

  const pioneerMinTime = toTimestamp('1973-01-01');
  const pioneerMaxTime = toTimestamp('2019-12-31');

  let minTime;
  let maxTime;
  if (customZoom) {
    minTime = customZoom.tMin;
    maxTime = customZoom.tMax;
  } else if (presetId !== 'all' && activePreset.tMin && activePreset.tMax) {
    minTime = toTimestamp(activePreset.tMin);
    maxTime = toTimestamp(activePreset.tMax);
  } else if (splitPioneerZone) {
    minTime = toTimestamp('2019-11-01');
    maxTime = hasWave ? toTimestamp('2026-12-20') : toTimestamp('2024-03-01');
  } else if (timeScale === 'linear' && hasPioneers && hasModern) {
    minTime = toTimestamp('1974-06-01');
    maxTime = toTimestamp('2027-02-01');
  } else {
    minTime = hasEarlyAnchors
      ? toTimestamp('2019-11-01')
      : hasWave
        ? toTimestamp('2024-04-01')
        : toTimestamp('1973-01-01');
    maxTime = hasWave
      ? toTimestamp('2026-12-20')
      : hasEarlyAnchors
        ? toTimestamp('2024-03-01')
        : toTimestamp('2019-12-31');
  }

  const visibleItems = items.filter((item) => {
    if (splitPioneerZone) return true;
    const t = toTimestamp(item.date);
    const padT = Math.max(DAY_MS * 3, (maxTime - minTime) * 0.03);
    return t >= minTime - padT && t <= maxTime + padT;
  });

  const ySourceItems = visibleItems.length > 0 ? visibleItems : items;
  const yValues = ySourceItems.map((i) => metricMeta.getValue(i));
  const rawMinY = Math.min(...yValues);
  const rawMaxY = Math.max(...yValues);

  let minY;
  let maxY;
  if (customZoom && Number.isFinite(customZoom.yMin) && Number.isFinite(customZoom.yMax)) {
    minY = Math.max(0, customZoom.yMin);
    maxY = Math.min(100, customZoom.yMax);
  } else if (yMode === 'full') {
    minY = 0;
    maxY = 100;
  } else {
    minY = Math.max(0, Math.floor((rawMinY - 4) / 5) * 5);
    maxY = Math.min(100, Math.ceil((rawMaxY + 2) / 5) * 5);
  }
  const spanY = Math.max(4, maxY - minY);

  const scaleXTime = (t) => {
    if (splitPioneerZone) {
      if (t < toTimestamp('2020-01-01')) {
        const clamped = Math.max(pioneerMinTime, Math.min(pioneerMaxTime, t));
        return margin.left + ((clamped - pioneerMinTime) / (pioneerMaxTime - pioneerMinTime)) * pioneerZoneW;
      }
      return modernStartX + ((t - minTime) / (maxTime - minTime)) * modernW;
    }
    return margin.left + ((t - minTime) / (maxTime - minTime)) * innerW;
  };

  const scaleX = (iso) => scaleXTime(toTimestamp(iso));

  const scaleY = (score) => {
    return margin.top + innerH - ((score - minY) / spanY) * innerH;
  };

  let xTicks;
  if (splitPioneerZone) {
    xTicks = hasWave
      ? [
          { t: toTimestamp('1976-10-01'), label: '’76', major: false },
          { t: toTimestamp('2016-05-03'), label: '’16', major: false },
          { t: toTimestamp('2020-01-01'), label: '2020', major: true },
          { t: toTimestamp('2021-01-01'), label: '2021', major: true },
          { t: toTimestamp('2022-01-01'), label: '2022', major: true },
          { t: toTimestamp('2023-01-01'), label: '2023', major: true },
          { t: toTimestamp('2024-01-01'), label: '2024', major: true },
          { t: toTimestamp('2025-01-01'), label: '2025', major: true },
          { t: toTimestamp('2026-01-01'), label: '2026', major: true },
          { t: toTimestamp('2026-11-25'), label: 'Nov 26', major: false },
        ]
      : [
          { t: toTimestamp('1996-10-10'), label: '1976–2016', major: false },
          { t: toTimestamp('2020-01-01'), label: '2020', major: true },
          { t: toTimestamp('2021-01-01'), label: '2021', major: true },
          { t: toTimestamp('2022-01-01'), label: '2022', major: true },
          { t: toTimestamp('2023-01-01'), label: '2023', major: true },
          { t: toTimestamp('2024-01-01'), label: '2024', major: true },
        ];
  } else {
    xTicks = buildDynamicXTicks(minTime, maxTime);
  }

  const yTicks = buildDynamicYTicks(minY, maxY);

  const isFullLinearSpan = !isZoomed && timeScale === 'linear' && hasPioneers && hasModern;
  const floodT1 = toTimestamp('2026-08-01');
  const floodT2 = toTimestamp('2026-12-05');
  const showFloodBand =
    hasWave &&
    !customZoom &&
    !isFullLinearSpan &&
    presetId !== 'q4-2026' &&
    floodT2 >= minTime &&
    floodT1 <= maxTime;
  const floodX1 = showFloodBand ? Math.max(margin.left, scaleXTime(Math.max(floodT1, minTime))) : null;
  const floodX2 = showFloodBand ? Math.min(width - margin.right, scaleXTime(Math.min(floodT2, maxTime))) : null;

  const pioneerDividerX = splitPioneerZone ? margin.left + pioneerZoneW + pioneerGap / 2 : null;
  const anchorDividerT = toTimestamp('2024-01-15');
  const showAnchorDivider =
    (hasEarlyAnchors || splitPioneerZone) &&
    hasWave &&
    !customZoom &&
    !isFullLinearSpan &&
    (presetId === 'all' || presetId === '2020-2026') &&
    anchorDividerT > minTime &&
    anchorDividerT < maxTime;
  const anchorDividerX = showAnchorDivider ? scaleXTime(anchorDividerT) : null;

  // Deterministic jitter keyed on data coordinates (date + rounded score) so nodes never jump while panning
  const dataBuckets = new Map();
  const jitterById = new Map();
  for (const item of items) {
    const yVal = metricMeta.getValue(item);
    const key = `${item.date}_${Math.round(yVal)}`;
    const count = dataBuckets.get(key) || 0;
    dataBuckets.set(key, count + 1);
    if (count > 0) {
      const angle = count * 2.15;
      const dist = 9 + Math.min(8, Math.floor(count / 3) * 4);
      jitterById.set(item.id, { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist });
    }
  }

  // Filter items within visible viewport (with gentle padding so clipped nodes glide smoothly past borders)
  const padY = Math.max(1.5, spanY * 0.04);
  const inViewportItems = visibleItems.filter((item) => {
    const v = metricMeta.getValue(item);
    return v >= minY - padY && v <= maxY + padY;
  });

  const positioned = inViewportItems.map((item) => {
    const yVal = metricMeta.getValue(item);
    let cx = scaleX(item.date);
    let cy = scaleY(yVal);
    const jitter = jitterById.get(item.id);
    if (jitter) {
      cx += jitter.dx;
      cy += jitter.dy;
    }

    const r =
      6.0 +
      (item.scores.ripple / 100) * 4.8 +
      (item.yearsUnsolved ? Math.min(3.5, item.yearsUnsolved / 45) : 0);

    // Only clamp nodes inside the frame when unzoomed; when zoomed/panned, let SVG clipPath clip smoothly
    if (!isZoomed) {
      cx = Math.max(margin.left + r + 2, Math.min(width - margin.right - r - 2, cx));
      cy = Math.max(margin.top + r + 2, Math.min(margin.top + innerH - r - 2, cy));
    }

    return { item, cx, cy, r, yVal };
  });

  const inBoundsCount = positioned.filter(
    (p) =>
      p.cx >= margin.left - p.r &&
      p.cx <= width - margin.right + p.r &&
      p.cy >= margin.top - p.r &&
      p.cy <= margin.top + innerH + p.r
  ).length;

  // Pick non-overlapping callout labels — allow more labels when zoomed in
  const waveLabelBudget = isZoomed ? 22 : 12;
  const prioritized = [
    ...positioned.filter((p) => p.item.date < '2020-01-01').slice(0, 5),
    ...positioned.filter((p) => p.item.isAnchor && p.item.date >= '2020-01-01').slice(0, 5),
    ...positioned.filter((p) => !p.item.isAnchor).slice(0, waveLabelBudget),
  ];
  const seenPriority = new Set();
  const labelCandidates = prioritized.filter((p) => {
    if (seenPriority.has(p.item.id)) return false;
    seenPriority.add(p.item.id);
    return true;
  });

  const placedLabels = [];
  for (const node of labelCandidates) {
    if (
      node.cx < margin.left + 4 ||
      node.cx > width - margin.right - 4 ||
      node.cy < margin.top + 6 ||
      node.cy > margin.top + innerH - 6
    ) {
      continue;
    }
    const cleanText = node.item.shortTitle
      .replace(' (Anchor)', '')
      .replace('Robbins Conjecture (EQP, 1996)', 'Robbins (1996)')
      .replace('Robot Scientist Adam (2009)', 'Adam (2009)')
      .replace(' (SAT)', ' (2016)');
    const labelW = cleanText.length * 6.2 + 12;
    const labelH = 15;
    const preferredRight = node.cx > width - 220;
    const candidates = preferredRight ? [true, false] : [false, true];

    for (const alignRight of candidates) {
      const lx = alignRight ? node.cx - node.r - 8 : node.cx + node.r + 8;
      const boxLeft = alignRight ? lx - labelW : lx;
      const boxTop = node.cy - labelH / 2;

      if (boxLeft < margin.left + 2 || boxLeft + labelW > width - margin.right - 2) {
        continue;
      }

      const overlapsLabel = placedLabels.some(
        (b) =>
          boxLeft < b.right + 4 &&
          boxLeft + labelW > b.left - 4 &&
          boxTop < b.bottom + 3 &&
          boxTop + labelH > b.top - 3
      );
      if (overlapsLabel) continue;

      const overlapsCircle = positioned.some((other) => {
        if (other.item.id === node.item.id) return false;
        const pad = other.r + 5;
        return (
          other.cx + pad > boxLeft &&
          other.cx - pad < boxLeft + labelW &&
          other.cy + pad > boxTop &&
          other.cy - pad < boxTop + labelH
        );
      });
      if (overlapsCircle) continue;

      placedLabels.push({
        id: node.item.id,
        text: cleanText,
        left: boxLeft,
        right: boxLeft + labelW,
        top: boxTop,
        bottom: boxTop + labelH,
        lx,
        ly: node.cy + 3.5,
        anchor: alignRight ? 'end' : 'start',
      });
      break;
    }
  }
  const labelMap = new Map(placedLabels.map((l) => [l.id, l]));

  const fullSpanMs = toTimestamp('2026-12-20') - toTimestamp('2019-11-01');
  const currentSpanMs = Math.max(DAY_MS, maxTime - minTime);
  const zoomFactor = isZoomed ? Math.max(1, fullSpanMs / currentSpanMs) : 1;

  const innerSvgHtml = `
    <!-- Pre-2020 Symbolic Pioneers Compressed Band -->
    ${
      pioneerDividerX !== null
        ? `
      <rect
        x="${margin.left}"
        y="${margin.top}"
        width="${(pioneerDividerX - margin.left).toFixed(1)}"
        height="${innerH}"
        fill="var(--bg-surface-alt)"
        opacity="0.72"
        pointer-events="none"
      />
      <line
        x1="${pioneerDividerX.toFixed(1)}"
        y1="${margin.top}"
        x2="${pioneerDividerX.toFixed(1)}"
        y2="${margin.top + innerH}"
        stroke="var(--border-strong)"
        stroke-width="1.3"
        stroke-dasharray="3 3"
        pointer-events="none"
      />
      <text
        x="${(margin.left + (pioneerDividerX - margin.left) / 2).toFixed(1)}"
        y="${margin.top - 11}"
        text-anchor="middle"
        class="viz-annotation"
        pointer-events="none"
      >1976–2019 · Symbolic</text>
    `
        : ''
    }

    <!-- Subtle Divider between 2020-2023 Early Neural Anchors and 2024-2026 Wave -->
    ${
      anchorDividerX !== null
        ? `
      <rect
        x="${(pioneerDividerX ?? margin.left).toFixed(1)}"
        y="${margin.top}"
        width="${Math.max(0, anchorDividerX - (pioneerDividerX ?? margin.left)).toFixed(1)}"
        height="${innerH}"
        fill="var(--bg-surface-alt)"
        opacity="0.38"
        pointer-events="none"
      />
      <line
        x1="${anchorDividerX.toFixed(1)}"
        y1="${margin.top}"
        x2="${anchorDividerX.toFixed(1)}"
        y2="${margin.top + innerH}"
        stroke="var(--border-strong)"
        stroke-width="1.2"
        stroke-dasharray="4 4"
        pointer-events="none"
      />
      <text
        x="${((pioneerDividerX ?? margin.left) + (anchorDividerX - (pioneerDividerX ?? margin.left)) / 2).toFixed(1)}"
        y="${margin.top - 11}"
        text-anchor="middle"
        class="viz-annotation"
        pointer-events="none"
      >2020–23 · Early Neural</text>
      <text
        x="${(anchorDividerX + (width - margin.right - anchorDividerX) / 2).toFixed(1)}"
        y="${margin.top - 11}"
        text-anchor="middle"
        class="viz-annotation"
        pointer-events="none"
      >2024–2026 Neural &amp; Neuro-Symbolic Wave</text>
    `
        : ''
    }

    <!-- Shaded Autumn 2026 Acceleration Band -->
    ${
      floodX1 !== null && floodX2 !== null && floodX2 - floodX1 > 8
        ? `
      <rect
        x="${floodX1.toFixed(1)}"
        y="${margin.top}"
        width="${Math.max(18, floodX2 - floodX1).toFixed(1)}"
        height="${innerH}"
        fill="var(--accent-warm-soft)"
        rx="4"
        pointer-events="none"
      />
      <text
        x="${(floodX1 + Math.max(18, floodX2 - floodX1) / 2).toFixed(1)}"
        y="${margin.top + 16}"
        text-anchor="middle"
        class="viz-annotation"
        pointer-events="none"
      >Q4 26 Surge</text>
    `
        : ''
    }

    <!-- Horizontal Grid Lines & Y Axis -->
    ${yTicks
      .map((val) => {
        const y = scaleY(val);
        return `
        <line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" class="viz-grid-line" pointer-events="none" />
        <text x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="viz-axis-label">${val}</text>
      `;
      })
      .join('')}

    <!-- Vertical Year/Month Dividers & X Axis -->
    ${xTicks
      .map((tk) => {
        const x = scaleXTime(tk.t);
        if (x < margin.left - 4 || x > width - margin.right + 4) return '';
        return `
        <line
          x1="${x.toFixed(1)}"
          y1="${margin.top}"
          x2="${x.toFixed(1)}"
          y2="${margin.top + innerH}"
          class="${tk.major ? 'viz-axis-line' : 'viz-grid-line'}"
          opacity="${tk.major ? '0.5' : '0.4'}"
          pointer-events="none"
        />
        <text x="${x.toFixed(1)}" y="${margin.top + innerH + 22}" text-anchor="middle" class="viz-axis-label">${escapeHtml(tk.label)}</text>
      `;
      })
      .join('')}

    <!-- Axes Baseline -->
    <line x1="${margin.left}" y1="${margin.top + innerH}" x2="${width - margin.right}" y2="${margin.top + innerH}" class="viz-axis-line" pointer-events="none" />
    <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + innerH}" class="viz-axis-line" pointer-events="none" />

    <!-- Y Axis Title -->
    <text
      x="16"
      y="${margin.top + innerH / 2}"
      text-anchor="middle"
      transform="rotate(-90 16 ${margin.top + innerH / 2})"
      class="viz-axis-label"
    >${escapeHtml(metricMeta.axisLabel)}</text>

    <!-- Breakthrough Nodes -->
    <g id="scatter-nodes-layer" clip-path="url(#scatter-plot-clip)">
    ${positioned
      .slice()
      .reverse()
      .map(({ item, cx, cy, r, yVal }) => {
        const disc = DISCIPLINE_META[item.discipline];
        const isFormal = item.verificationStatus === 'Formally Verified';
        const isSymbolic = item.aiParadigm === 'Symbolic / Classical';
        const isDisputed =
          item.verificationStatus === 'Contested / Partial' ||
          item.verificationStatus === 'Preprint / Active Review';
        const lbl = labelMap.get(item.id);
        const dHalf = r * 1.12;
        const ringHalf = dHalf + 4.4;
        const diamondPoints = (h) =>
          `${cx.toFixed(1)},${(cy - h).toFixed(1)} ${(cx + h).toFixed(1)},${cy.toFixed(1)} ${cx.toFixed(1)},${(cy + h).toFixed(1)} ${(cx - h).toFixed(1)},${cy.toFixed(1)}`;

        return `
        <g
          class="scatter-node"
          tabindex="0"
          role="button"
          aria-label="${escapeHtml(item.title)}, ${escapeHtml(metricMeta.label)} ${yVal.toFixed(1)}, ${formatDate(item.date)}"
          data-open-dossier="${escapeHtml(item.id)}"
          data-tooltip-id="${escapeHtml(item.id)}"
          data-discipline-name="${escapeHtml(item.discipline)}"
          data-cx="${cx.toFixed(1)}"
          data-cy="${cy.toFixed(1)}"
        >
          ${
            isFormal
              ? isSymbolic
                ? `<polygon points="${diamondPoints(ringHalf)}" fill="none" stroke="${disc.colorVar}" stroke-width="1.5" stroke-linejoin="round" opacity="0.85" pointer-events="none" />`
                : `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r + 3.8).toFixed(1)}" fill="none" stroke="${disc.colorVar}" stroke-width="1.5" opacity="0.85" pointer-events="none" />`
              : ''
          }
          ${
            isSymbolic
              ? `<polygon
                  class="scatter-node__circle"
                  points="${diamondPoints(dHalf)}"
                  fill="${disc.colorVar}"
                  fill-opacity="0.9"
                  stroke="var(--bg-surface)"
                  stroke-width="1.5"
                  stroke-linejoin="round"
                />`
              : `<circle
                  class="scatter-node__circle"
                  cx="${cx.toFixed(1)}"
                  cy="${cy.toFixed(1)}"
                  r="${r.toFixed(1)}"
                  fill="${disc.colorVar}"
                  fill-opacity="${isDisputed ? '0.62' : '0.88'}"
                  stroke="var(--bg-surface)"
                  stroke-width="1.5"
                  ${isDisputed ? 'stroke-dasharray="2.5 2"' : ''}
                />`
          }
          ${
            lbl
              ? `<text x="${lbl.lx.toFixed(1)}" y="${lbl.ly.toFixed(1)}" text-anchor="${lbl.anchor}" class="scatter-node__label">${escapeHtml(lbl.text)}</text>`
              : ''
          }
        </g>
      `;
      })
      .join('')}
    </g>
  `;

  return {
    width,
    height,
    margin,
    innerW,
    innerH,
    minTime,
    maxTime,
    minY,
    maxY,
    isZoomed,
    splitPioneerZone,
    pioneerZoneW,
    pioneerGap,
    pioneerMinTime,
    pioneerMaxTime,
    zoomFactor,
    visibleCount: inBoundsCount,
    innerSvgHtml,
  };
}

export function renderTimelineScatter(items, opts = {}) {
  const timeScale = opts.timeScale === 'linear' ? 'linear' : 'split';
  const yMode = opts.yMode === 'full' ? 'full' : 'auto';
  const yMetricKey = SCATTER_Y_METRICS[opts.yMetric] ? opts.yMetric : 'composite';
  const presetId = opts.preset || 'all';
  const customZoom = opts.customZoom || null;
  const interactionMode = opts.interactionMode === 'pan' ? 'pan' : 'zoom';
  const metricMeta = SCATTER_Y_METRICS[yMetricKey];

  if (items.length === 0) {
    return `
      <div class="viz-card">
        <div class="empty-state">
          <h3>No breakthroughs to plot</h3>
          <p>Adjust your active filters to visualize milestones across time and impact.</p>
        </div>
      </div>
    `;
  }

  const layout = buildScatterSvgContent(items, opts);
  const {
    width,
    height,
    margin,
    innerW,
    innerH,
    minTime,
    maxTime,
    minY,
    maxY,
    isZoomed,
    splitPioneerZone,
    pioneerZoneW,
    pioneerGap,
    pioneerMinTime,
    pioneerMaxTime,
    zoomFactor,
    visibleCount,
    innerSvgHtml,
  } = layout;

  return `
    <div class="viz-card">
      <div class="viz-card__header">
        <div>
          <h2 class="viz-card__title">AI Impact × Time Landscape</h2>
          <p class="viz-card__desc">
            Every breakthrough plotted by date and ${escapeHtml(metricMeta.label)}—drag across the chart to box-zoom or pan live, switch time/Y scales, or click any node for its dossier.
          </p>
        </div>

        <div class="viz-toolbar" aria-label="Impact × Time chart controls">
          <div class="segmented-ctrl" role="group" aria-label="Time zoom presets">
            ${SCATTER_PRESETS.map(
              (p) => `
              <button
                type="button"
                data-scatter-preset="${p.id}"
                aria-pressed="${!customZoom && presetId === p.id ? 'true' : 'false'}"
              >${escapeHtml(p.label)}</button>
            `
            ).join('')}
          </div>
        </div>
      </div>

      <div class="viz-subcontrols">
        <div class="viz-subcontrols__group">
          <span class="viz-ctrl-label">Time Axis</span>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Time axis scaling">
            <button
              type="button"
              data-scatter-timescale="split"
              aria-pressed="${timeScale === 'split' && !isZoomed ? 'true' : 'false'}"
              ${isZoomed ? 'title="Reset zoom to compare Split vs. Linear time axis"' : ''}
            >Split</button>
            <button
              type="button"
              data-scatter-timescale="linear"
              aria-pressed="${timeScale === 'linear' || isZoomed ? 'true' : 'false'}"
            >Linear</button>
          </div>
        </div>

        <div class="viz-subcontrols__group">
          <span class="viz-ctrl-label">Y Axis</span>
          <select id="scatter-y-metric" class="viz-select" aria-label="Y-axis metric">
            ${Object.entries(SCATTER_Y_METRICS)
              .map(
                ([k, m]) =>
                  `<option value="${k}" ${yMetricKey === k ? 'selected' : ''}>${escapeHtml(m.label)}</option>`
              )
              .join('')}
          </select>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Y-axis range">
            <button
              type="button"
              data-scatter-ymode="auto"
              aria-pressed="${yMode === 'auto' && !customZoom ? 'true' : 'false'}"
            >Auto</button>
            <button
              type="button"
              data-scatter-ymode="full"
              aria-pressed="${yMode === 'full' && !customZoom ? 'true' : 'false'}"
            >0–100</button>
          </div>
        </div>

        <div class="viz-subcontrols__group viz-subcontrols__group--right">
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Pointer mode">
            <button
              type="button"
              data-scatter-mode="zoom"
              aria-pressed="${interactionMode === 'zoom' ? 'true' : 'false'}"
              title="Drag across the chart to box-zoom into a region"
            >Box Zoom</button>
            <button
              type="button"
              data-scatter-mode="pan"
              aria-pressed="${interactionMode === 'pan' ? 'true' : 'false'}"
              title="Drag to pan across time and score in real time"
            >Pan</button>
          </div>
          <div class="viz-zoom-controls" role="group" aria-label="Zoom controls">
            <button type="button" class="viz-icon-btn" data-scatter-zoom="in" aria-label="Zoom in" title="Zoom in (+)">+</button>
            <button type="button" class="viz-icon-btn" data-scatter-zoom="out" aria-label="Zoom out" title="Zoom out (−)" ${!isZoomed ? 'disabled' : ''}>−</button>
            <button type="button" class="viz-icon-btn viz-icon-btn--text" data-scatter-zoom="reset" ${!isZoomed ? 'disabled' : ''} title="Reset zoom (or double-click chart)">
              ${isZoomed ? `Reset (${zoomFactor.toFixed(1)}×)` : 'Reset'}
            </button>
          </div>
        </div>
      </div>

      <div class="viz-legend" aria-label="Chart legend">
        ${Object.entries(DISCIPLINE_META)
          .map(
            ([name, meta]) => `
          <span class="viz-legend__item viz-legend__item--interactive" data-legend-discipline="${escapeHtml(name)}" title="Hover to highlight ${escapeHtml(name)}">
            <span class="viz-legend__dot" style="background: ${meta.colorVar};"></span>
            <span>${escapeHtml(name)}</span>
          </span>
        `
          )
          .join('')}
        <span class="viz-legend__item" style="margin-left: auto;">
          <span style="display:inline-block;width:8px;height:8px;background:var(--ink-muted);transform:rotate(45deg);margin-right:2px;"></span>
          <span>Symbolic / Classical</span>
        </span>
        <span class="viz-legend__item">
          <span class="viz-legend__ring"></span>
          <span>Outer ring = Formally Verified</span>
        </span>
      </div>

      <div class="viz-stage viz-stage--interactive ${interactionMode === 'pan' ? 'viz-stage--pan' : 'viz-stage--crosshair'}">
        <svg
          class="viz-svg"
          id="timeline-scatter-svg"
          viewBox="0 0 ${width} ${height}"
          data-margin-left="${margin.left}"
          data-margin-right="${margin.right}"
          data-margin-top="${margin.top}"
          data-margin-bottom="${margin.bottom}"
          data-inner-w="${innerW}"
          data-inner-h="${innerH}"
          data-t-min="${minTime}"
          data-t-max="${maxTime}"
          data-y-min="${minY}"
          data-y-max="${maxY}"
          data-split-pioneer="${splitPioneerZone ? '1' : '0'}"
          data-pioneer-w="${pioneerZoneW}"
          data-pioneer-gap="${pioneerGap}"
          data-pioneer-t-min="${pioneerMinTime}"
          data-pioneer-t-max="${pioneerMaxTime}"
          data-interaction-mode="${interactionMode}"
          role="img"
          aria-label="Scatter plot of AI scientific breakthroughs by date and ${escapeHtml(metricMeta.label)}"
        >
          <defs>
            <clipPath id="scatter-plot-clip">
              <rect x="${margin.left}" y="${margin.top}" width="${innerW}" height="${innerH}" />
            </clipPath>
          </defs>

          <!-- Invisible hit-target for drag zoom / pan -->
          <rect
            id="scatter-canvas-hit"
            x="${margin.left}"
            y="${margin.top}"
            width="${innerW}"
            height="${innerH}"
            fill="transparent"
          />

          <!-- Live-updated plot layer (bands, grid, axes, nodes) -->
          <g id="scatter-dynamic-layer">
            ${innerSvgHtml}
          </g>

          <!-- Dynamic Hover Crosshairs -->
          <g id="scatter-crosshair-layer" pointer-events="none" opacity="0">
            <line id="scatter-crosshair-v" x1="0" y1="${margin.top}" x2="0" y2="${margin.top + innerH}" class="viz-crosshair-line" />
            <line id="scatter-crosshair-h" x1="${margin.left}" y1="0" x2="${width - margin.right}" y2="0" class="viz-crosshair-line" />
          </g>

          <!-- Drag-to-Zoom Selection Rectangle -->
          <rect
            id="scatter-brush-rect"
            class="viz-brush-rect"
            x="0"
            y="0"
            width="0"
            height="0"
            visibility="hidden"
            pointer-events="none"
          />
        </svg>
      </div>

      <div class="viz-hint-bar">
        <span>Showing <strong id="scatter-visible-count">${visibleCount}</strong> of ${items.length} breakthroughs in view</span>
        <span>Drag to ${interactionMode === 'pan' ? 'pan live' : 'box-zoom (Shift+drag to pan)'} · Ctrl/⌘ + scroll to zoom · Double-click to reset</span>
      </div>
    </div>
  `;
}

export function bindScatterInteractions(svg, items, rankedMap, opts, callbacks) {
  if (!svg) return;
  const { showTooltip, hideTooltip, onZoomChange, onReset } = callbacks;

  const mLeft = Number(svg.dataset.marginLeft);
  const mTop = Number(svg.dataset.marginTop);
  const innerW = Number(svg.dataset.innerW);
  const innerH = Number(svg.dataset.innerH);
  const pioneerW = Number(svg.dataset.pioneerW);
  const pioneerGap = Number(svg.dataset.pioneerGap);
  const pioneerTMin = Number(svg.dataset.pioneerTMin);
  const pioneerTMax = Number(svg.dataset.pioneerTMax);
  const mode = svg.dataset.interactionMode || 'zoom';

  let curTMin = Number(svg.dataset.tMin);
  let curTMax = Number(svg.dataset.tMax);
  let curYMin = Number(svg.dataset.yMin);
  let curYMax = Number(svg.dataset.yMax);
  let curSplitPioneer = svg.dataset.splitPioneer === '1';

  const modernStartX = mLeft + pioneerW + pioneerGap;
  const modernW = innerW - pioneerW - pioneerGap;

  const MIN_PAN_T = toTimestamp('1973-01-01');
  const MAX_PAN_T = toTimestamp('2027-06-01');

  const dynamicLayer = svg.querySelector('#scatter-dynamic-layer');
  const crosshairLayer = svg.querySelector('#scatter-crosshair-layer');
  const crosshairV = svg.querySelector('#scatter-crosshair-v');
  const crosshairH = svg.querySelector('#scatter-crosshair-h');
  const brushRect = svg.querySelector('#scatter-brush-rect');
  const card = svg.closest('.viz-card');
  const visibleCountEl = card ? card.querySelector('#scatter-visible-count') : null;
  const resetBtn = card ? card.querySelector('[data-scatter-zoom="reset"]') : null;
  const zoomOutBtn = card ? card.querySelector('[data-scatter-zoom="out"]') : null;
  const splitBtn = card ? card.querySelector('[data-scatter-timescale="split"]') : null;
  const linearBtn = card ? card.querySelector('[data-scatter-timescale="linear"]') : null;
  const yModeBtns = card ? Array.from(card.querySelectorAll('[data-scatter-ymode]')) : [];
  const yMetricMeta = SCATTER_Y_METRICS[opts.yMetric] || SCATTER_Y_METRICS.composite;

  let dragState = null;

  function clientToSvg(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: mLeft, y: mTop };
    const p = pt.matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }

  function invertX(px) {
    if (curSplitPioneer) {
      if (px <= mLeft + pioneerW + pioneerGap / 2) {
        const frac = Math.max(0, Math.min(1, (px - mLeft) / Math.max(1, pioneerW)));
        return pioneerTMin + frac * (pioneerTMax - pioneerTMin);
      }
      const frac = Math.max(0, Math.min(1, (px - modernStartX) / Math.max(1, modernW)));
      return curTMin + frac * (curTMax - curTMin);
    }
    const frac = (px - mLeft) / Math.max(1, innerW);
    return curTMin + frac * (curTMax - curTMin);
  }

  function invertY(py) {
    const frac = 1 - (py - mTop) / Math.max(1, innerH);
    return curYMin + frac * (curYMax - curYMin);
  }

  function hideHoverGuides() {
    if (crosshairLayer) crosshairLayer.setAttribute('opacity', '0');
    hideTooltip();
  }

  function showNodeHover(ev, node) {
    const item = rankedMap.get(node.dataset.tooltipId);
    if (!item) return;
    const val = yMetricMeta.getValue(item);
    if (crosshairLayer && crosshairV && crosshairH) {
      crosshairV.setAttribute('x1', node.dataset.cx);
      crosshairV.setAttribute('x2', node.dataset.cx);
      crosshairH.setAttribute('y1', node.dataset.cy);
      crosshairH.setAttribute('y2', node.dataset.cy);
      crosshairLayer.setAttribute('opacity', '1');
    }
    showTooltip(
      ev,
      `
        <div class="viz-tooltip__title">${escapeHtml(item.title)}</div>
        <div class="viz-tooltip__meta">${escapeHtml(item.discipline)} · ${formatDate(item.date)} · ${escapeHtml(item.verificationStatus)}</div>
        <div>
          <span class="viz-tooltip__score">${escapeHtml(yMetricMeta.label)} ${val.toFixed(1)}/100</span>
          · ${escapeHtml(item.aiParadigm)} · ${escapeHtml(item.aiRole)}${item.aiSystem ? ` (${escapeHtml(item.aiSystem)})` : ''}
        </div>
      `
    );
  }

  // Delegated node hover tooltips + crosshair guides (stays active across live pan re-renders)
  svg.addEventListener('mouseover', (ev) => {
    if (dragState?.active) return;
    const node = ev.target && ev.target.closest ? ev.target.closest('[data-tooltip-id]') : null;
    if (node) showNodeHover(ev, node);
  });

  svg.addEventListener('mousemove', (ev) => {
    if (dragState?.active) return;
    const node = ev.target && ev.target.closest ? ev.target.closest('[data-tooltip-id]') : null;
    if (node) {
      showNodeHover(ev, node);
    } else {
      hideHoverGuides();
    }
  });

  svg.addEventListener('mouseout', (ev) => {
    const node = ev.target && ev.target.closest ? ev.target.closest('[data-tooltip-id]') : null;
    if (!node) return;
    const nextNode =
      ev.relatedTarget && ev.relatedTarget.closest
        ? ev.relatedTarget.closest('[data-tooltip-id]')
        : null;
    if (nextNode !== node) hideHoverGuides();
  });

  svg.addEventListener('mouseleave', hideHoverGuides);

  // Legend hover highlight (queries live nodes dynamically so it works after real-time pan)
  if (card) {
    card.querySelectorAll('[data-legend-discipline]').forEach((el) => {
      const disc = el.dataset.legendDiscipline;
      el.addEventListener('mouseenter', () => {
        svg.querySelectorAll('.scatter-node').forEach((n) => {
          n.style.opacity = n.dataset.disciplineName === disc ? '1' : '0.16';
        });
      });
      el.addEventListener('mouseleave', () => {
        svg.querySelectorAll('.scatter-node').forEach((n) => {
          n.style.opacity = '';
        });
      });
    });
  }

  function computePanZoom(ds, currSvgX, currSvgY) {
    const dxSvg = currSvgX - ds.startSvgX;
    const dySvg = currSvgY - ds.startSvgY;
    const spanT = Math.min(MAX_PAN_T - MIN_PAN_T, ds.baseTMax - ds.baseTMin);
    const spanY = Math.min(100, ds.baseYMax - ds.baseYMin);
    const dt = -(dxSvg / Math.max(1, innerW)) * spanT;
    const dY = (dySvg / Math.max(1, innerH)) * spanY;

    let newTMin = ds.baseTMin + dt;
    let newTMax = newTMin + spanT;
    if (newTMin < MIN_PAN_T) {
      newTMin = MIN_PAN_T;
      newTMax = Math.min(MAX_PAN_T, newTMin + spanT);
    } else if (newTMax > MAX_PAN_T) {
      newTMax = MAX_PAN_T;
      newTMin = Math.max(MIN_PAN_T, newTMax - spanT);
    }

    let newYMin = ds.baseYMin + dY;
    let newYMax = newYMin + spanY;
    if (newYMin < 0) {
      newYMin = 0;
      newYMax = Math.min(100, spanY);
    } else if (newYMax > 100) {
      newYMax = 100;
      newYMin = Math.max(0, 100 - spanY);
    }

    return { tMin: newTMin, tMax: newTMax, yMin: newYMin, yMax: newYMax };
  }

  function applyLivePan(nextZoom) {
    if (!dynamicLayer) return;
    const layout = buildScatterSvgContent(items, { ...opts, customZoom: nextZoom });
    dynamicLayer.innerHTML = layout.innerSvgHtml;

    curTMin = layout.minTime;
    curTMax = layout.maxTime;
    curYMin = layout.minY;
    curYMax = layout.maxY;
    curSplitPioneer = layout.splitPioneerZone;

    svg.dataset.tMin = String(curTMin);
    svg.dataset.tMax = String(curTMax);
    svg.dataset.yMin = String(curYMin);
    svg.dataset.yMax = String(curYMax);
    svg.dataset.splitPioneer = curSplitPioneer ? '1' : '0';

    if (visibleCountEl) visibleCountEl.textContent = String(layout.visibleCount);
    if (resetBtn) {
      resetBtn.disabled = false;
      resetBtn.textContent = `Reset (${layout.zoomFactor.toFixed(1)}×)`;
    }
    if (zoomOutBtn) zoomOutBtn.disabled = false;
    if (splitBtn) splitBtn.setAttribute('aria-pressed', 'false');
    if (linearBtn) linearBtn.setAttribute('aria-pressed', 'true');
    yModeBtns.forEach((btn) => btn.setAttribute('aria-pressed', 'false'));
  }

  // Drag-to-box-zoom or Real-Time Drag-to-Pan
  let panRafId = null;
  let pendingPanZoom = null;

  svg.addEventListener('pointerdown', (ev) => {
    if (ev.button !== 0) return;
    // Let clicks on nodes work naturally unless user drags past threshold
    const start = clientToSvg(ev.clientX, ev.clientY);
    if (
      start.x < mLeft ||
      start.x > mLeft + innerW ||
      start.y < mTop ||
      start.y > mTop + innerH
    ) {
      return;
    }

    const usePan = mode === 'pan' || ev.shiftKey;
    let baseTMin = curTMin;
    let baseTMax = curTMax;

    if (usePan && curSplitPioneer) {
      // Smooth Split-to-Linear handoff anchored directly under the pointer (zero jump on frame 0)
      const focusT = invertX(start.x);
      const frac = Math.max(0, Math.min(1, (start.x - mLeft) / Math.max(1, innerW)));
      const baseSpanT =
        start.x >= modernStartX
          ? Math.min(MAX_PAN_T - MIN_PAN_T, (curTMax - curTMin) * (innerW / Math.max(1, modernW)))
          : MAX_PAN_T - MIN_PAN_T;
      baseTMin = focusT - frac * baseSpanT;
      baseTMax = baseTMin + baseSpanT;
    }

    dragState = {
      startClientX: ev.clientX,
      startClientY: ev.clientY,
      startSvgX: start.x,
      startSvgY: start.y,
      currSvgX: start.x,
      currSvgY: start.y,
      baseTMin,
      baseTMax,
      baseYMin: curYMin,
      baseYMax: curYMax,
      lastAppliedZoom: null,
      active: false,
      usePan,
      pointerId: ev.pointerId,
    };
  });

  const onPointerMove = (ev) => {
    if (!dragState) return;
    const dx = ev.clientX - dragState.startClientX;
    const dy = ev.clientY - dragState.startClientY;
    if (!dragState.active && Math.hypot(dx, dy) > 4) {
      dragState.active = true;
      hideHoverGuides();
      if (dragState.usePan) svg.classList.add('is-panning');
      try {
        svg.setPointerCapture(dragState.pointerId);
      } catch {
        // ignore
      }
    }
    if (!dragState.active) return;

    const curr = clientToSvg(ev.clientX, ev.clientY);

    if (dragState.usePan) {
      dragState.currSvgX = curr.x;
      dragState.currSvgY = curr.y;
      pendingPanZoom = computePanZoom(dragState, curr.x, curr.y);
      if (panRafId === null) {
        panRafId = requestAnimationFrame(() => {
          panRafId = null;
          if (!pendingPanZoom) return;
          const nextZoom = pendingPanZoom;
          pendingPanZoom = null;
          applyLivePan(nextZoom);
          if (dragState) dragState.lastAppliedZoom = nextZoom;
        });
      }
    } else {
      dragState.currSvgX = Math.max(mLeft, Math.min(mLeft + innerW, curr.x));
      dragState.currSvgY = Math.max(mTop, Math.min(mTop + innerH, curr.y));
      if (brushRect) {
        const bx = Math.min(dragState.startSvgX, dragState.currSvgX);
        const by = Math.min(dragState.startSvgY, dragState.currSvgY);
        const bw = Math.abs(dragState.currSvgX - dragState.startSvgX);
        const bh = Math.abs(dragState.currSvgY - dragState.startSvgY);
        brushRect.setAttribute('x', bx.toFixed(1));
        brushRect.setAttribute('y', by.toFixed(1));
        brushRect.setAttribute('width', bw.toFixed(1));
        brushRect.setAttribute('height', bh.toFixed(1));
        brushRect.setAttribute('visibility', 'visible');
      }
    }
  };

  const onPointerUp = () => {
    if (!dragState) return;
    const ds = dragState;
    dragState = null;

    if (panRafId !== null) {
      cancelAnimationFrame(panRafId);
      panRafId = null;
    }
    svg.classList.remove('is-panning');
    try {
      if (svg.hasPointerCapture && svg.hasPointerCapture(ds.pointerId)) {
        svg.releasePointerCapture(ds.pointerId);
      }
    } catch {
      // ignore
    }

    if (brushRect) brushRect.setAttribute('visibility', 'hidden');
    if (!ds.active) {
      pendingPanZoom = null;
      return;
    }

    // Suppress click opening a dossier immediately after a drag gesture
    svg.dataset.justDragged = '1';
    setTimeout(() => {
      delete svg.dataset.justDragged;
    }, 60);

    if (ds.usePan) {
      const finalZoom =
        pendingPanZoom || ds.lastAppliedZoom || computePanZoom(ds, ds.currSvgX, ds.currSvgY);
      pendingPanZoom = null;
      applyLivePan(finalZoom);
      onZoomChange(finalZoom);
      const refreshedSvg = document.getElementById('timeline-scatter-svg');
      if (refreshedSvg) {
        refreshedSvg.dataset.justDragged = '1';
        setTimeout(() => {
          delete refreshedSvg.dataset.justDragged;
        }, 60);
      }
    } else {
      const bw = Math.abs(ds.currSvgX - ds.startSvgX);
      const bh = Math.abs(ds.currSvgY - ds.startSvgY);
      if (bw < 14 && bh < 14) return;

      const x1 = Math.min(ds.startSvgX, ds.currSvgX);
      const x2 = Math.max(ds.startSvgX, ds.currSvgX);
      const y1 = Math.min(ds.startSvgY, ds.currSvgY);
      const y2 = Math.max(ds.startSvgY, ds.currSvgY);

      const newTMin = invertX(x1);
      const newTMax = invertX(x2);
      const newYMax = Math.min(100, invertY(y1));
      const newYMin = Math.max(0, invertY(y2));

      if (newTMax - newTMin < DAY_MS * 3 || newYMax - newYMin < 2) return;
      onZoomChange({
        tMin: newTMin,
        tMax: newTMax,
        yMin: Math.floor(newYMin),
        yMax: Math.ceil(newYMax),
      });
    }
  };

  svg.addEventListener('pointermove', onPointerMove);
  svg.addEventListener('pointerup', onPointerUp);
  svg.addEventListener('pointercancel', onPointerUp);

  // Double-click to reset zoom
  svg.addEventListener('dblclick', () => {
    onReset();
  });

  // Ctrl/Cmd + Wheel zoom around pointer (leaves normal page scroll untouched)
  svg.addEventListener(
    'wheel',
    (ev) => {
      if (!ev.ctrlKey && !ev.metaKey) return;
      ev.preventDefault();
      const pt = clientToSvg(ev.clientX, ev.clientY);
      const factor = ev.deltaY > 0 ? 1.35 : 1 / 1.35;
      const focusT = invertX(Math.max(mLeft, Math.min(mLeft + innerW, pt.x)));
      const focusY = invertY(Math.max(mTop, Math.min(mTop + innerH, pt.y)));

      const newSpanT = Math.max(
        DAY_MS * 10,
        Math.min(MAX_PAN_T - MIN_PAN_T, (curTMax - curTMin) * factor)
      );
      const newSpanY = Math.max(5, Math.min(100, (curYMax - curYMin) * factor));

      const tFrac = Math.max(
        0.05,
        Math.min(0.95, (focusT - curTMin) / Math.max(1, curTMax - curTMin))
      );
      const yFrac = Math.max(
        0.05,
        Math.min(0.95, (focusY - curYMin) / Math.max(1, curYMax - curYMin))
      );

      let newTMin = focusT - tFrac * newSpanT;
      let newTMax = newTMin + newSpanT;
      if (newTMin < MIN_PAN_T) {
        newTMin = MIN_PAN_T;
        newTMax = Math.min(MAX_PAN_T, newTMin + newSpanT);
      } else if (newTMax > MAX_PAN_T) {
        newTMax = MAX_PAN_T;
        newTMin = Math.max(MIN_PAN_T, newTMax - newSpanT);
      }

      let newYMin = focusY - yFrac * newSpanY;
      let newYMax = newYMin + newSpanY;
      if (newYMin < 0) {
        newYMin = 0;
        newYMax = Math.min(100, newSpanY);
      } else if (newYMax > 100) {
        newYMax = 100;
        newYMin = Math.max(0, 100 - newSpanY);
      }

      onZoomChange({ tMin: newTMin, tMax: newTMax, yMin: newYMin, yMax: newYMax });
    },
    { passive: false }
  );
}
