import { DISCIPLINE_META, escapeHtml } from '../scoring.js';
import {
  ARCHITECTURE_META,
  PARADIGM_META,
  RANK_BY_OPTIONS,
  formatVolume,
} from '../modelAnalytics.js';

function getMetricValue(row, sortBy) {
  switch (sortBy) {
    case 'volume':
      return row.volume;
    case 'avgImpact':
      return row.avgImpact;
    case 'peakImpact':
      return row.peakImpact;
    case 'verified':
      return row.verifiedCount;
    case 'autonomous':
      return row.autonomousCount;
    case 'yearsUnsolved':
      return row.yearsUnsolved;
    case 'cumulativeImpact':
    default:
      return row.cumulativeImpact;
  }
}

function formatMetricValue(val, sortBy) {
  if (sortBy === 'volume' || sortBy === 'verified' || sortBy === 'autonomous') {
    return formatVolume(val);
  }
  if (sortBy === 'yearsUnsolved') {
    return `${Math.round(val).toLocaleString('en-US')} yrs`;
  }
  if (sortBy === 'cumulativeImpact') {
    return Math.round(val).toLocaleString('en-US');
  }
  return val.toFixed(1);
}

/**
 * Interactive SVG Volume × Impact Quadrant Bubble Map.
 * Uses a square-root X scale so single-breakthrough landmark specialists (AlphaFold 2,
 * RFdiffusion, EQP) and 20+ breakthrough model families remain simultaneously legible.
 */
export function renderModelQuadrantChart(rows, opts = {}) {
  const yAxisMode = opts.quadrantY === 'peakImpact' ? 'peakImpact' : 'avgImpact';
  const yAxisLabel = yAxisMode === 'peakImpact' ? 'Peak Breakthrough Impact' : 'Average Impact Score';

  if (!rows.length) {
    return `
      <div class="empty-state" style="margin: 0; border: none;">
        <h3 class="empty-state__title">No AI systems match the active filters</h3>
        <p class="empty-state__text">Broaden your discipline, paradigm, era, or minimum-volume filter to populate the landscape.</p>
      </div>
    `;
  }

  const width = 1040;
  const height = 430;
  const margin = { top: 36, right: 44, bottom: 52, left: 60 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const maxVol = Math.max(4, ...rows.map((r) => r.volume));
  const maxCum = Math.max(100, ...rows.map((r) => r.cumulativeImpact));
  const yVals = rows.map((r) => (yAxisMode === 'peakImpact' ? r.peakImpact : r.avgImpact));
  const minY = Math.max(60, Math.floor((Math.min(...yVals) - 3) / 5) * 5);
  const maxY = Math.min(100, Math.ceil((Math.max(...yVals) + 2) / 5) * 5);
  const spanY = Math.max(8, maxY - minY);

  // Sqrt scale on X keeps 1..30 spread evenly with crisp visual hierarchy
  const sqrtMin = Math.sqrt(0.35);
  const sqrtMax = Math.sqrt(maxVol * 1.15);
  const scaleX = (vol) => {
    const frac = (Math.sqrt(Math.max(0.35, vol)) - sqrtMin) / Math.max(0.01, sqrtMax - sqrtMin);
    return margin.left + frac * innerW;
  };
  const scaleY = (val) => {
    const clamped = Math.max(minY, Math.min(maxY, val));
    return margin.top + innerH - ((clamped - minY) / spanY) * innerH;
  };
  const scaleR = (cum) => {
    const frac = Math.sqrt(Math.max(0, cum) / maxCum);
    return 6.5 + frac * 17.5;
  };

  // X ticks nicely chosen for sqrt scale
  const candidateTicks = [1, 2, 4, 6, 10, 15, 20, 25, 30, 35, 45];
  const xTicks = candidateTicks.filter((t) => t <= maxVol * 1.08);
  if (!xTicks.length) xTicks.push(1);

  const yStep = spanY <= 16 ? 2 : 5;
  const yTicks = [];
  for (let v = Math.ceil(minY / yStep) * yStep; v <= maxY; v += yStep) {
    yTicks.push(v);
  }

  // Reference lines: volume >= 3 ("Multi-Breakthrough Workhorses") & weighted mean impact
  const refVol = Math.min(maxVol * 0.45, 3);
  const refX = scaleX(refVol);
  const meanY = yVals.reduce((s, v) => s + v, 0) / yVals.length;
  const refY = scaleY(meanY);

  // Compute deterministic non-overlapping coordinates for bubbles sharing identical (volume, y)
  const sortedForDraw = [...rows].sort((a, b) => b.cumulativeImpact - a.cumulativeImpact);
  const bucketSeen = new Map();
  const points = sortedForDraw.map((row) => {
    const yVal = yAxisMode === 'peakImpact' ? row.peakImpact : row.avgImpact;
    const key = `${row.volume.toFixed(1)}_${Math.round(yVal * 2)}`;
    const idx = bucketSeen.get(key) || 0;
    bucketSeen.set(key, idx + 1);
    const jitterAngle = idx * 2.39996;
    const jitterR = idx === 0 ? 0 : Math.min(18, 6 + idx * 3.5);
    const cx = Math.max(
      margin.left + 10,
      Math.min(margin.left + innerW - 10, scaleX(row.volume) + Math.cos(jitterAngle) * jitterR)
    );
    const cy = Math.max(
      margin.top + 10,
      Math.min(margin.top + innerH - 10, scaleY(yVal) + Math.sin(jitterAngle) * (jitterR * 0.65))
    );
    const r = scaleR(row.cumulativeImpact);
    const archMeta =
      ARCHITECTURE_META[row.dominantArchitecture] ||
      ARCHITECTURE_META['Domain Science Neural Net'];
    const paradigmMeta =
      PARADIGM_META[row.dominantParadigm] || PARADIGM_META['Neural / Deep Learning'];
    return { row, cx, cy, r, yVal, archMeta, paradigmMeta };
  });

  // Label top contributors + top high-impact specialists + top symbolic AI without collisions
  const labelPriorityIds = new Set();
  points.slice(0, 7).forEach((p) => labelPriorityIds.add(p.row.id));
  [...points]
    .sort((a, b) => b.yVal - a.yVal)
    .slice(0, 5)
    .forEach((p) => labelPriorityIds.add(p.row.id));
  const topSymbolic = points.find((p) => p.row.dominantParadigm === 'Symbolic / Classical');
  if (topSymbolic) labelPriorityIds.add(topSymbolic.row.id);

  const placedLabels = [];
  const labelSvg = [];
  const candidates = points.filter((p) => labelPriorityIds.has(p.row.id));

  for (const pt of candidates) {
    const rawLabel = pt.row.name
      .replace(/\s*\([^)]*\)$/, '')
      .replace(/\s+Lineage$/, '')
      .replace(/\s+Structural Suite$/, '');
    const text = rawLabel.length > 24 ? `${rawLabel.slice(0, 22)}…` : rawLabel;
    const estW = text.length * 7.2 + 12;
    const estH = 15;
    const offsets = [
      { dx: 0, dy: -(pt.r + 8), anchor: 'middle' },
      { dx: pt.r + 8, dy: 4, anchor: 'start' },
      { dx: -(pt.r + 8), dy: 4, anchor: 'end' },
      { dx: 0, dy: pt.r + 15, anchor: 'middle' },
      { dx: pt.r + 6, dy: -(pt.r + 4), anchor: 'start' },
      { dx: -(pt.r + 6), dy: -(pt.r + 4), anchor: 'end' },
    ];
    for (const off of offsets) {
      const lx = pt.cx + off.dx;
      const ly = pt.cy + off.dy;
      const x0 = off.anchor === 'start' ? lx : off.anchor === 'end' ? lx - estW : lx - estW / 2;
      const x1 = x0 + estW;
      const y0 = ly - estH + 3;
      const y1 = ly + 3;
      if (x0 < margin.left + 2 || x1 > width - margin.right - 2) continue;
      if (y0 < margin.top + 18 || y1 > margin.top + innerH - 18) continue;
      const hitsLabel = placedLabels.some(
        (b) => !(x1 + 5 < b.x0 || x0 - 5 > b.x1 || y1 + 4 < b.y0 || y0 - 4 > b.y1)
      );
      if (hitsLabel) continue;
      const hitsBubble = points.some((other) => {
        const padR = other.r + (other.row.verifiedCount > 0 ? 5 : 2.5);
        const nearestX = Math.max(x0, Math.min(other.cx, x1));
        const nearestY = Math.max(y0, Math.min(other.cy, y1));
        return Math.hypot(other.cx - nearestX, other.cy - nearestY) < padR;
      });
      if (hitsBubble) continue;
      placedLabels.push({ x0, x1, y0, y1 });
      labelSvg.push(`
        <text
          x="${lx.toFixed(1)}"
          y="${ly.toFixed(1)}"
          text-anchor="${off.anchor}"
          class="viz-node-label"
          pointer-events="none"
        >${escapeHtml(text)}</text>
      `);
      break;
    }
  }

  return `
    <div class="viz-legend" aria-label="Architecture class color key">
      ${Object.entries(ARCHITECTURE_META)
        .map(
          ([name, meta]) => `
        <span class="viz-legend__item">
          <span class="viz-legend__dot" style="background: ${meta.colorVar};"></span>
          <span>${escapeHtml(meta.shortLabel)}</span>
        </span>
      `
        )
        .join('')}
      <span class="viz-legend__item" style="margin-left: auto;">
        <span class="viz-legend__ring"></span>
        <span>Bubble size = Cumulative Impact · Outer ring = Formally Verified proofs</span>
      </span>
    </div>

    <div class="viz-stage">
      <svg
        class="viz-svg"
        id="models-chart-svg"
        data-chart-mode="quadrant"
        viewBox="0 0 ${width} ${height}"
        role="img"
        aria-label="Volume versus ${escapeHtml(yAxisLabel)} scatter chart of AI systems"
      >
        <!-- Subtle quadrant shading -->
        <rect
          x="${refX.toFixed(1)}"
          y="${margin.top}"
          width="${Math.max(0, margin.left + innerW - refX).toFixed(1)}"
          height="${Math.max(0, refY - margin.top).toFixed(1)}"
          fill="var(--accent-primary-soft)"
          opacity="0.45"
        />

        <!-- Horizontal gridlines -->
        ${yTicks
          .map((v) => {
            const y = scaleY(v);
            return `
              <line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
              <text x="${margin.left - 10}" y="${(y + 3.5).toFixed(1)}" text-anchor="end" class="viz-axis-tick">${v}</text>
            `;
          })
          .join('')}

        <!-- Vertical gridlines -->
        ${xTicks
          .map((t) => {
            const x = scaleX(t);
            return `
              <line x1="${x.toFixed(1)}" y1="${margin.top}" x2="${x.toFixed(1)}" y2="${margin.top + innerH}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
              <text x="${x.toFixed(1)}" y="${margin.top + innerH + 18}" text-anchor="middle" class="viz-axis-tick">${t}</text>
            `;
          })
          .join('')}

        <!-- Reference quadrant guides -->
        <line
          x1="${refX.toFixed(1)}"
          y1="${margin.top}"
          x2="${refX.toFixed(1)}"
          y2="${margin.top + innerH}"
          stroke="var(--border-strong)"
          stroke-dasharray="5 4"
        />
        <line
          x1="${margin.left}"
          y1="${refY.toFixed(1)}"
          x2="${width - margin.right}"
          y2="${refY.toFixed(1)}"
          stroke="var(--border-strong)"
          stroke-dasharray="5 4"
        />

        <!-- Quadrant corner labels -->
        <text x="${margin.left + 8}" y="${margin.top + 15}" class="models-quad-label">
          HIGH-IMPACT SPECIALISTS
        </text>
        <text x="${width - margin.right - 8}" y="${margin.top + 15}" text-anchor="end" class="models-quad-label models-quad-label--accent">
          FRONTIER HIGH-VOLUME LEADERS
        </text>
        <text x="${margin.left + 8}" y="${margin.top + innerH - 8}" class="models-quad-label">
          PIONEERS &amp; TARGETED TOOLS
        </text>

        <!-- Axes -->
        <line x1="${margin.left}" y1="${margin.top + innerH}" x2="${width - margin.right}" y2="${margin.top + innerH}" stroke="var(--border-strong)" />
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + innerH}" stroke="var(--border-strong)" />

        <text
          x="${margin.left + innerW / 2}"
          y="${height - 10}"
          text-anchor="middle"
          class="viz-axis-label"
        >Breakthrough Volume (${opts.attribution === 'full' ? 'Full Co-Credit Count' : 'Fractional Share'} · √ scale)</text>
        <text
          x="16"
          y="${margin.top + innerH / 2}"
          text-anchor="middle"
          transform="rotate(-90 16 ${margin.top + innerH / 2})"
          class="viz-axis-label"
        >${escapeHtml(yAxisLabel)} (0–100)</text>

        <!-- Bubbles (largest drawn first so smaller specialists remain clickable) -->
        <g>
          ${points
            .map((pt) => {
              const hasVerified = pt.row.verifiedCount > 0;
              const isSymbolic = pt.row.dominantParadigm === 'Symbolic / Classical';
              return `
                <g
                  class="scatter-node models-bubble"
                  data-model-id="${escapeHtml(pt.row.id)}"
                  tabindex="0"
                  role="button"
                  aria-label="${escapeHtml(pt.row.name)}: Volume ${formatVolume(pt.row.volume)}, ${escapeHtml(yAxisLabel)} ${pt.yVal.toFixed(1)}"
                >
                  ${
                    hasVerified
                      ? `<circle cx="${pt.cx.toFixed(1)}" cy="${pt.cy.toFixed(1)}" r="${(pt.r + 3.5).toFixed(1)}" fill="none" stroke="var(--status-verified)" stroke-width="1.6" stroke-dasharray="3 2" opacity="0.88" />`
                      : ''
                  }
                  ${
                    isSymbolic
                      ? `<rect x="${(pt.cx - pt.r).toFixed(1)}" y="${(pt.cy - pt.r).toFixed(1)}" width="${(pt.r * 2).toFixed(1)}" height="${(pt.r * 2).toFixed(1)}" rx="2" transform="rotate(45 ${pt.cx.toFixed(1)} ${pt.cy.toFixed(1)})" fill="${pt.archMeta.colorVar}" fill-opacity="0.88" stroke="var(--bg-surface)" stroke-width="1.5" />`
                      : `<circle cx="${pt.cx.toFixed(1)}" cy="${pt.cy.toFixed(1)}" r="${pt.r.toFixed(1)}" fill="${pt.archMeta.colorVar}" fill-opacity="0.84" stroke="var(--bg-surface)" stroke-width="1.6" />`
                  }
                </g>
              `;
            })
            .join('')}
        </g>

        <!-- Labels -->
        <g>${labelSvg.join('')}</g>
      </svg>
    </div>
    <div class="viz-hint-bar">
      <span>Showing <strong>${rows.length}</strong> ranked ${rows.length === 1 ? 'entry' : 'entries'} · Mean ${escapeHtml(yAxisLabel)}: <strong>${meanY.toFixed(1)}</strong></span>
      <span>Hover any bubble for breakdown · Click to inspect &amp; expand its breakthrough ledger below</span>
    </div>
  `;
}

/**
 * Interactive SVG Horizontal Ranked Comparison Bar Chart (Top 15 entities by active sort metric).
 */
export function renderModelBarChart(rows, opts = {}) {
  const sortBy = opts.sortBy || 'cumulativeImpact';
  const metricMeta = RANK_BY_OPTIONS.find((o) => o.id === sortBy) || RANK_BY_OPTIONS[0];
  const topRows = rows.slice(0, 15);

  if (!topRows.length) {
    return `
      <div class="empty-state" style="margin: 0; border: none;">
        <h3 class="empty-state__title">No AI systems match the active filters</h3>
        <p class="empty-state__text">Adjust filters above to compare top contributors.</p>
      </div>
    `;
  }

  const width = 1040;
  const rowH = 30;
  const margin = { top: 24, right: 112, bottom: 38, left: 268 };
  const innerW = width - margin.left - margin.right;
  const innerH = topRows.length * rowH;
  const height = margin.top + innerH + margin.bottom;

  const isScoreMetric = sortBy === 'avgImpact' || sortBy === 'peakImpact';
  const isStackedDiscipline = sortBy === 'cumulativeImpact' || sortBy === 'volume';
  const rawMax = Math.max(...topRows.map((r) => getMetricValue(r, sortBy)), 1);
  const maxVal = isScoreMetric ? 100 : rawMax * 1.08;
  const minVal = isScoreMetric ? 60 : 0;
  const span = Math.max(1, maxVal - minVal);

  const scaleW = (val) => Math.max(2, ((Math.max(minVal, val) - minVal) / span) * innerW);

  const tickCount = 5;
  const xTicks = [];
  for (let i = 0; i <= tickCount; i += 1) {
    const v = minVal + (span * i) / tickCount;
    xTicks.push(v);
  }

  return `
    <div class="viz-legend" aria-label="Bar chart legend">
      ${
        isStackedDiscipline
          ? Object.entries(DISCIPLINE_META)
              .map(
                ([name, meta]) => `
              <span class="viz-legend__item">
                <span class="viz-legend__dot" style="background: ${meta.colorVar};"></span>
                <span>${escapeHtml(name)}</span>
              </span>
            `
              )
              .join('')
          : Object.entries(ARCHITECTURE_META)
              .map(
                ([name, meta]) => `
              <span class="viz-legend__item">
                <span class="viz-legend__dot" style="background: ${meta.colorVar};"></span>
                <span>${escapeHtml(meta.shortLabel)}</span>
              </span>
            `
              )
              .join('')
      }
      <span class="viz-legend__item" style="margin-left: auto;">
        <span>Top ${topRows.length} ranked by <strong>${escapeHtml(metricMeta.label)}</strong></span>
      </span>
    </div>

    <div class="viz-stage">
      <svg
        class="viz-svg"
        id="models-chart-svg"
        data-chart-mode="bars"
        viewBox="0 0 ${width} ${height}"
        role="img"
        aria-label="Top ${topRows.length} AI systems ranked by ${escapeHtml(metricMeta.label)}"
      >
        <!-- Vertical gridlines -->
        ${xTicks
          .map((v) => {
            const x = margin.left + ((v - minVal) / span) * innerW;
            const label =
              sortBy === 'yearsUnsolved' || sortBy === 'cumulativeImpact'
                ? Math.round(v).toLocaleString('en-US')
                : isScoreMetric
                  ? Math.round(v)
                  : v.toFixed(v < 10 ? 1 : 0);
            return `
              <line x1="${x.toFixed(1)}" y1="${margin.top}" x2="${x.toFixed(1)}" y2="${margin.top + innerH}" stroke="var(--border-subtle)" stroke-dasharray="3 3" />
              <text x="${x.toFixed(1)}" y="${margin.top + innerH + 18}" text-anchor="middle" class="viz-axis-tick">${label}</text>
            `;
          })
          .join('')}

        <!-- Left baseline -->
        <line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + innerH}" stroke="var(--border-strong)" />

        <!-- Bars -->
        ${topRows
          .map((row, idx) => {
            const y = margin.top + idx * rowH;
            const barY = y + 5;
            const barH = rowH - 10;
            const val = getMetricValue(row, sortBy);
            const totalW = val > 0 ? scaleW(val) : 0;
            const archMeta =
              ARCHITECTURE_META[row.dominantArchitecture] ||
              ARCHITECTURE_META['Domain Science Neural Net'];
            const shortName = row.name.length > 32 ? `${row.name.slice(0, 30)}…` : row.name;

            let barSegments = '';
            if (isStackedDiscipline && totalW > 0 && row.disciplineBreakdown.length) {
              let cursorX = margin.left;
              barSegments = row.disciplineBreakdown
                .map((seg, sIdx) => {
                  const segW = Math.max(1.5, (seg.pct / 100) * totalW);
                  const rx = sIdx === row.disciplineBreakdown.length - 1 ? 3 : 0;
                  const rect = `<rect x="${cursorX.toFixed(1)}" y="${barY}" width="${segW.toFixed(1)}" height="${barH}" rx="${rx}" fill="${seg.colorVar}" fill-opacity="0.88" />`;
                  cursorX += segW;
                  return rect;
                })
                .join('');
            } else if (totalW > 0) {
              barSegments = `<rect x="${margin.left}" y="${barY}" width="${totalW.toFixed(1)}" height="${barH}" rx="3" fill="${archMeta.colorVar}" fill-opacity="0.88" />`;
            }

            return `
              <g
                class="models-bar-row"
                data-model-id="${escapeHtml(row.id)}"
                tabindex="0"
                role="button"
                aria-label="Rank ${row.rank} ${escapeHtml(row.name)}: ${formatMetricValue(val, sortBy)}"
              >
                <rect x="0" y="${y}" width="${width}" height="${rowH}" fill="transparent" class="models-bar-row__hit" />
                <text x="20" y="${y + 19}" class="models-bar-rank">#${row.rank}</text>
                <text x="${margin.left - 12}" y="${y + 19}" text-anchor="end" class="models-bar-label">${escapeHtml(shortName)}</text>
                ${barSegments}
                <text x="${(margin.left + totalW + 8).toFixed(1)}" y="${y + 19}" class="models-bar-val">${escapeHtml(formatMetricValue(val, sortBy))}</text>
              </g>
            `;
          })
          .join('')}
      </svg>
    </div>
    <div class="viz-hint-bar">
      <span>Comparing top <strong>${topRows.length}</strong> of ${rows.length} entries by <strong>${escapeHtml(metricMeta.label)}</strong></span>
      <span>Click any bar to jump to &amp; expand its breakthrough contributions</span>
    </div>
  `;
}

export function bindModelChartInteractions(svg, rowMap, opts, callbacks) {
  if (!svg) return;
  const { showTooltip, hideTooltip, onSelectModel } = callbacks;

  function renderTooltipHtml(row) {
    const discSummary = row.disciplineBreakdown
      .slice(0, 3)
      .map((d) => `${escapeHtml(d.discipline)} (${Math.round(d.pct)}%)`)
      .join(' · ');
    return `
      <div class="viz-tooltip__title">#${row.rank} ${escapeHtml(row.name)}</div>
      <div class="viz-tooltip__meta">${escapeHtml(row.primaryLab)} · ${escapeHtml(row.dominantArchitecture)} · ${row.firstYear === row.lastYear ? row.firstYear : `${row.firstYear}–${row.lastYear}`}</div>
      <div>
        <span class="viz-tooltip__score">Cum. Impact ${Math.round(row.cumulativeImpact).toLocaleString('en-US')}</span>
        · Vol <strong>${formatVolume(row.volume)}</strong>${row.rawCount !== row.volume ? ` (${row.rawCount} total)` : ''}
        · Avg <strong>${row.avgImpact.toFixed(1)}</strong>
        · Peak <strong>${row.peakImpact.toFixed(1)}</strong>
      </div>
      <div class="viz-tooltip__meta" style="margin-top: 4px; margin-bottom: 0;">
        ${row.verifiedCount > 0 ? `${formatVolume(row.verifiedCount)} formally verified · ` : ''}${row.autonomousRate}% autonomous${discSummary ? ` · ${discSummary}` : ''}
      </div>
    `;
  }

  svg.addEventListener('mousemove', (ev) => {
    const target = ev.target && ev.target.closest ? ev.target.closest('[data-model-id]') : null;
    if (!target) {
      hideTooltip();
      return;
    }
    const row = rowMap.get(target.dataset.modelId);
    if (!row) {
      hideTooltip();
      return;
    }
    showTooltip(ev, renderTooltipHtml(row));
  });

  svg.addEventListener('mouseleave', hideTooltip);

  svg.addEventListener('click', (ev) => {
    const target = ev.target && ev.target.closest ? ev.target.closest('[data-model-id]') : null;
    if (!target) return;
    hideTooltip();
    onSelectModel(target.dataset.modelId);
  });

  svg.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const target = ev.target && ev.target.closest ? ev.target.closest('[data-model-id]') : null;
    if (!target) return;
    ev.preventDefault();
    onSelectModel(target.dataset.modelId);
  });
}
