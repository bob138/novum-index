import { DISCIPLINE_META, escapeHtml } from '../scoring.js';

const ANCHOR_PERIODS = [
  { id: '2020-21', label: '2020–21', start: '2020-01-01', end: '2021-12-31', isAnchorBucket: true },
  { id: '2022', label: '2022', start: '2022-01-01', end: '2022-12-31', isAnchorBucket: true },
  { id: '2023', label: '2023', start: '2023-01-01', end: '2023-12-31', isAnchorBucket: true },
];

const WAVE_QUARTERS = [
  { id: '2024-Q2', label: 'Q2 24', start: '2024-04-01', end: '2024-06-30', isAnchorBucket: false },
  { id: '2024-Q3', label: 'Q3 24', start: '2024-07-01', end: '2024-09-30', isAnchorBucket: false },
  { id: '2024-Q4', label: 'Q4 24', start: '2024-10-01', end: '2024-12-31', isAnchorBucket: false },
  { id: '2025-Q1', label: 'Q1 25', start: '2025-01-01', end: '2025-03-31', isAnchorBucket: false },
  { id: '2025-Q2', label: 'Q2 25', start: '2025-04-01', end: '2025-06-30', isAnchorBucket: false },
  { id: '2025-Q3', label: 'Q3 25', start: '2025-07-01', end: '2025-09-30', isAnchorBucket: false },
  { id: '2025-Q4', label: 'Q4 25', start: '2025-10-01', end: '2025-12-31', isAnchorBucket: false },
  { id: '2026-Q1', label: 'Q1 26', start: '2026-01-01', end: '2026-03-31', isAnchorBucket: false },
  { id: '2026-Q2', label: 'Q2 26', start: '2026-04-01', end: '2026-06-30', isAnchorBucket: false },
  { id: '2026-Q3', label: 'Q3 26', start: '2026-07-01', end: '2026-09-30', isAnchorBucket: false },
  { id: '2026-Q4', label: 'Q4 26*', start: '2026-10-01', end: '2026-12-31', isAnchorBucket: false },
];

const AI_SERIES = [
  { key: 'Human', label: 'Human', colorVar: 'var(--ink-secondary)' },
  { key: 'AI-Assisted', label: 'AI-Assisted', colorVar: 'var(--disc-cs)' },
  { key: 'Autonomous AI', label: 'Autonomous AI', colorVar: 'var(--disc-physics)' },
];

export function renderVelocityChart(items, groupBy = 'aiRole') {
  const width = 1040;
  const height = 435;
  const margin = { top: 38, right: 64, bottom: 52, left: 54 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const hasAnchors = items.some((b) => b.date < '2024-01-01');
  const hasWave = items.some((b) => b.date >= '2024-01-01');
  const periods = hasAnchors
    ? hasWave
      ? [...ANCHOR_PERIODS, ...WAVE_QUARTERS]
      : ANCHOR_PERIODS
    : WAVE_QUARTERS;

  const series =
    groupBy === 'discipline'
      ? Object.entries(DISCIPLINE_META).map(([name, meta]) => ({
          key: name,
          label: meta.short,
          colorVar: meta.colorVar,
        }))
      : AI_SERIES;

  let cumulativeImpact = 0;
  const buckets = periods.map((p) => {
    const inP = items.filter((b) => b.date >= p.start && b.date <= p.end);
    const counts = {};
    for (const s of series) counts[s.key] = 0;
    for (const b of inP) {
      const k = groupBy === 'discipline' ? b.discipline : b.aiRole;
      counts[k] = (counts[k] || 0) + 1;
      cumulativeImpact += b.compositeScore;
    }
    return {
      ...p,
      total: inP.length,
      counts,
      cumulativeImpact: Math.round(cumulativeImpact),
    };
  });

  const maxBar = Math.max(4, ...buckets.map((b) => b.total));
  const maxCum = Math.max(100, buckets[buckets.length - 1]?.cumulativeImpact || 100);

  const slotW = innerW / buckets.length;
  const barW = Math.min(44, slotW * 0.58);

  const yBar = (val) => margin.top + innerH - (val / maxBar) * innerH;
  const yCum = (val) => margin.top + innerH - (val / maxCum) * innerH;

  const linePoints = buckets.map((b, idx) => ({
    x: margin.left + idx * slotW + slotW / 2,
    y: yCum(b.cumulativeImpact),
    val: b.cumulativeImpact,
    label: b.label,
  }));

  const linePath = linePoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const dividerX = hasAnchors && hasWave ? margin.left + ANCHOR_PERIODS.length * slotW : null;

  const count2024 = items.filter((b) => b.date.startsWith('2024')).length;
  const count2026 = items.filter((b) => b.date.startsWith('2026')).length;
  const ai2026 = items.filter((b) => b.date.startsWith('2026') && b.aiRole !== 'Human').length;
  const ai2026Pct = count2026 ? Math.round((ai2026 / count2026) * 100) : 0;
  const h2_2026 = items.filter((b) => b.date >= '2026-07-01').length;

  const yBarTicks = [];
  const step = maxBar <= 6 ? 1 : 2;
  for (let v = 0; v <= maxBar; v += step) yBarTicks.push(v);

  return `
    <div class="viz-card">
      <div class="viz-card__header">
        <div>
          <h2 class="viz-card__title">Breakthrough Acceleration &amp; Cumulative Impact</h2>
          <p class="viz-card__desc">
            Annual 2020–2023 calibration anchors alongside quarterly 2024–2026 breakthrough cadence (bars) and cumulative composite impact (line), revealing the steep H2 2026 inflection.
          </p>
        </div>

        <div class="segmented-ctrl" role="group" aria-label="Group acceleration bars by">
          <button
            type="button"
            id="vel-group-ai"
            data-velocity-group="aiRole"
            aria-pressed="${groupBy === 'aiRole' ? 'true' : 'false'}"
          >By AI Provenance</button>
          <button
            type="button"
            id="vel-group-disc"
            data-velocity-group="discipline"
            aria-pressed="${groupBy === 'discipline' ? 'true' : 'false'}"
          >By Discipline</button>
        </div>
      </div>

      <div class="viz-legend">
        ${series
          .map(
            (s) => `
          <span class="viz-legend__item">
            <span class="viz-legend__dot" style="background: ${s.colorVar};"></span>
            <span>${escapeHtml(s.label)}</span>
          </span>
        `
          )
          .join('')}
        <span class="viz-legend__item" style="margin-left: auto;">
          <span style="display:inline-block;width:16px;height:2.5px;background:var(--accent-primary);border-radius:2px;"></span>
          <span>Cumulative Impact Index (right axis)</span>
        </span>
      </div>

      <div class="viz-stage">
        <svg
          class="viz-svg"
          id="velocity-chart-svg"
          viewBox="0 0 ${width} ${height}"
          role="img"
          aria-label="Stacked bar and cumulative line chart showing acceleration of scientific breakthroughs from 2020 anchors through late 2026"
        >
          ${
            dividerX !== null
              ? `
            <rect
              x="${margin.left}"
              y="${margin.top}"
              width="${(dividerX - margin.left).toFixed(1)}"
              height="${innerH}"
              fill="var(--bg-surface-alt)"
              opacity="0.45"
            />
            <line
              x1="${dividerX.toFixed(1)}"
              y1="${margin.top}"
              x2="${dividerX.toFixed(1)}"
              y2="${margin.top + innerH}"
              stroke="var(--border-strong)"
              stroke-width="1.2"
              stroke-dasharray="4 4"
            />
            <text
              x="${(margin.left + (dividerX - margin.left) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
            >Annual Anchors</text>
            <text
              x="${(dividerX + (width - margin.right - dividerX) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
            >Quarterly Breakthrough Cadence (2024–2026)</text>
          `
              : ''
          }

          <!-- Grid lines & Left Axis -->
          ${yBarTicks
            .map((v) => {
              const y = yBar(v);
              return `
              <line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" class="viz-grid-line" />
              <text x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="viz-axis-label">${v}</text>
            `;
            })
            .join('')}

          <!-- Right Axis labels (Cumulative Impact) -->
          ${[0, 0.25, 0.5, 0.75, 1]
            .map((frac) => {
              const val = Math.round(maxCum * frac);
              const y = yCum(val);
              return `
              <text x="${width - margin.right + 10}" y="${(y + 4).toFixed(1)}" text-anchor="start" class="viz-axis-label" style="fill: var(--accent-primary);">${val}</text>
            `;
            })
            .join('')}

          <!-- Stacked Bars -->
          ${buckets
            .map((b, idx) => {
              const xCenter = margin.left + idx * slotW + slotW / 2;
              const xLeft = xCenter - barW / 2;
              let acc = 0;
              const rects = series
                .map((s) => {
                  const cnt = b.counts[s.key] || 0;
                  if (cnt === 0) return '';
                  const yBottom = yBar(acc);
                  acc += cnt;
                  const yTop = yBar(acc);
                  const h = Math.max(2, yBottom - yTop);
                  return `
                    <rect
                      x="${xLeft.toFixed(1)}"
                      y="${yTop.toFixed(1)}"
                      width="${barW.toFixed(1)}"
                      height="${h.toFixed(1)}"
                      fill="${s.colorVar}"
                      fill-opacity="${b.isAnchorBucket ? '0.68' : '0.88'}"
                      rx="2"
                    >
                      <title>${escapeHtml(b.label)} — ${escapeHtml(s.label)}: ${cnt} breakthrough(s)</title>
                    </rect>
                  `;
                })
                .join('');

              return `
                <g>
                  ${rects}
                  ${
                    b.total > 0
                      ? `<text x="${xCenter.toFixed(1)}" y="${(yBar(b.total) - 7).toFixed(1)}" text-anchor="middle" class="viz-axis-label" style="font-weight:600;fill:var(--ink-primary);">${b.total}</text>`
                      : ''
                  }
                  <text x="${xCenter.toFixed(1)}" y="${margin.top + innerH + 22}" text-anchor="middle" class="viz-axis-label">${b.label}</text>
                </g>
              `;
            })
            .join('')}

          <!-- Cumulative Impact Curve -->
          <path
            d="${linePath}"
            fill="none"
            stroke="var(--accent-primary)"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          ${linePoints
            .map(
              (pt) => `
            <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="3.8" fill="var(--bg-surface)" stroke="var(--accent-primary)" stroke-width="2.2">
              <title>${pt.label}: Cumulative Impact ${pt.val}</title>
            </circle>
          `
            )
            .join('')}

          <!-- Baseline & Axis Titles -->
          <line x1="${margin.left}" y1="${margin.top + innerH}" x2="${width - margin.right}" y2="${margin.top + innerH}" class="viz-axis-line" />
          <text x="15" y="${margin.top + innerH / 2}" text-anchor="middle" transform="rotate(-90 15 ${margin.top + innerH / 2})" class="viz-axis-label">BREAKTHROUGHS / PERIOD</text>
          <text x="${width - 14}" y="${margin.top + innerH / 2}" text-anchor="middle" transform="rotate(90 ${width - 14} ${margin.top + innerH / 2})" class="viz-axis-label" style="fill: var(--accent-primary);">CUMULATIVE IMPACT</text>
          <text x="${width - margin.right}" y="${height - 8}" text-anchor="end" class="viz-axis-label" style="font-size:10px;">*Q4 2026 reflects data through Nov 25, 2026</text>
        </svg>
      </div>

      <div class="viz-callout-grid">
        <div>
          <div class="viz-callout__num">${h2_2026} milestones</div>
          <div class="viz-callout__text">Published in H2 2026 alone (Jul – Nov 25), representing ${items.length ? Math.round((h2_2026 / items.length) * 100) : 0}% of the filtered index.</div>
        </div>
        <div>
          <div class="viz-callout__num">${ai2026Pct}% AI-involved</div>
          <div class="viz-callout__text">Share of 2026 breakthroughs using AI assistance or autonomous discovery (${ai2026} of ${count2026}).</div>
        </div>
        <div>
          <div class="viz-callout__num">${count2024 ? (count2026 / count2024).toFixed(1) + '×' : count2026}</div>
          <div class="viz-callout__text">2026 vs. 2024 breakthrough cadence (${count2026} in 2026 vs. ${count2024} in 2024 within active filters).</div>
        </div>
      </div>
    </div>
  `;
}
