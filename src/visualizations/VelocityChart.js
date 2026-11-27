import { DISCIPLINE_META, escapeHtml } from '../scoring.js';

const ANCHOR_PERIODS = [
  { id: 'pre-2020', label: '< 2020*', start: '1965-01-01', end: '2019-12-31', yearsSpan: 51, isAnchorBucket: true, isPioneerBucket: true },
  { id: '2020', label: '2020', start: '2020-01-01', end: '2020-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2021', label: '2021', start: '2021-01-01', end: '2021-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2022', label: '2022', start: '2022-01-01', end: '2022-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2023', label: '2023', start: '2023-01-01', end: '2023-12-31', yearsSpan: 1, isAnchorBucket: true },
];

const WAVE_QUARTERS = [
  { id: '2024-Q1', label: 'Q1 24', start: '2024-01-01', end: '2024-03-31', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2024-Q2', label: 'Q2 24', start: '2024-04-01', end: '2024-06-30', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2024-Q3', label: 'Q3 24', start: '2024-07-01', end: '2024-09-30', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2024-Q4', label: 'Q4 24', start: '2024-10-01', end: '2024-12-31', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2025-Q1', label: 'Q1 25', start: '2025-01-01', end: '2025-03-31', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2025-Q2', label: 'Q2 25', start: '2025-04-01', end: '2025-06-30', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2025-Q3', label: 'Q3 25', start: '2025-07-01', end: '2025-09-30', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2025-Q4', label: 'Q4 25', start: '2025-10-01', end: '2025-12-31', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2026-Q1', label: 'Q1 26', start: '2026-01-01', end: '2026-03-31', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2026-Q2', label: 'Q2 26', start: '2026-04-01', end: '2026-06-30', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2026-Q3', label: 'Q3 26', start: '2026-07-01', end: '2026-09-30', yearsSpan: 0.25, isAnchorBucket: false },
  { id: '2026-Q4', label: 'Q4 26*', start: '2026-10-01', end: '2026-12-31', yearsSpan: 57 / 365.25, isAnchorBucket: false },
];

const ANNUAL_PERIODS = [
  { id: 'pre-2020', label: '< 2020*', start: '1965-01-01', end: '2019-12-31', yearsSpan: 51, isAnchorBucket: true, isPioneerBucket: true },
  { id: '2020', label: '2020', start: '2020-01-01', end: '2020-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2021', label: '2021', start: '2021-01-01', end: '2021-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2022', label: '2022', start: '2022-01-01', end: '2022-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2023', label: '2023', start: '2023-01-01', end: '2023-12-31', yearsSpan: 1, isAnchorBucket: true },
  { id: '2024', label: '2024', start: '2024-01-01', end: '2024-12-31', yearsSpan: 1, isAnchorBucket: false },
  { id: '2025', label: '2025', start: '2025-01-01', end: '2025-12-31', yearsSpan: 1, isAnchorBucket: false },
  { id: '2026', label: '2026*', start: '2026-01-01', end: '2026-12-31', yearsSpan: 330 / 365.25, isAnchorBucket: false },
];

const MONTHLY_2026_PERIODS = [
  { id: '2026-01', label: 'Jan 26', start: '2026-01-01', end: '2026-01-31', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-02', label: 'Feb 26', start: '2026-02-01', end: '2026-02-28', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-03', label: 'Mar 26', start: '2026-03-01', end: '2026-03-31', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-04', label: 'Apr 26', start: '2026-04-01', end: '2026-04-30', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-05', label: 'May 26', start: '2026-05-01', end: '2026-05-31', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-06', label: 'Jun 26', start: '2026-06-01', end: '2026-06-30', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-07', label: 'Jul 26', start: '2026-07-01', end: '2026-07-31', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-08', label: 'Aug 26', start: '2026-08-01', end: '2026-08-31', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-09', label: 'Sep 26', start: '2026-09-01', end: '2026-09-30', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-10', label: 'Oct 26', start: '2026-10-01', end: '2026-10-31', yearsSpan: 1 / 12, isAnchorBucket: false },
  { id: '2026-11', label: 'Nov 26*', start: '2026-11-01', end: '2026-11-30', yearsSpan: 26 / 365.25, isAnchorBucket: false },
];

const PARADIGM_SERIES = [
  { key: 'Symbolic / Classical', label: 'Symbolic / Classical', colorVar: 'var(--ink-muted)' },
  { key: 'Neural / Deep Learning', label: 'Neural / Deep Learning', colorVar: 'var(--disc-cs)' },
  { key: 'Neuro-Symbolic', label: 'Neuro-Symbolic (Neural + Formal)', colorVar: 'var(--disc-math)' },
];

const AI_SERIES = [
  { key: 'AI-Assisted', label: 'AI-Assisted', colorVar: 'var(--disc-cs)' },
  { key: 'Autonomous AI', label: 'Autonomous AI', colorVar: 'var(--disc-physics)' },
];

const CURVE_METRICS = {
  count: {
    label: 'Count',
    legend: 'Cumulative AI-Enabled Breakthroughs',
    axisLabel: 'CUMULATIVE BREAKTHROUGHS',
    getVal: (b) => b.cumulativeCount,
    format: (v) => String(v),
  },
  years: {
    label: 'Human Yrs',
    legend: 'Cumulative Human Years Unsolved',
    axisLabel: 'CUMULATIVE HUMAN YEARS UNSOLVED',
    getVal: (b) => b.cumulativeYears,
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)),
  },
  impact: {
    label: 'Impact Sum',
    legend: 'Cumulative Impact Index',
    axisLabel: 'CUMULATIVE IMPACT SCORE',
    getVal: (b) => b.cumulativeImpact,
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)),
  },
};

function buildLogTicks(maxVal) {
  const candidates = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];
  const ticks = candidates.filter((v) => v <= maxVal * 1.15);
  if (ticks.length < 2) return [1, Math.max(2, maxVal)];
  // Keep at most 6 evenly spread ticks
  if (ticks.length > 6) {
    return ticks.filter((v) => [1, 10, 100, 1000, 10000].includes(v) || v === ticks[ticks.length - 1]);
  }
  return ticks;
}

export function computeVelocityData(items, opts = {}) {
  const groupBy = opts.groupBy || 'paradigm';
  const granularity = opts.granularity || 'default';

  const hasPioneers = items.some((b) => b.date < '2020-01-01');
  const hasEarlyNeural = items.some((b) => b.date >= '2020-01-01' && b.date < '2024-01-01');
  const hasWave = items.some((b) => b.date >= '2024-01-01');

  let periods;
  let activeAnchorCount = 0;

  if (granularity === 'annual') {
    periods = ANNUAL_PERIODS.filter((p) => !p.isPioneerBucket || hasPioneers);
    activeAnchorCount = periods.filter((p) => p.isAnchorBucket).length;
  } else if (granularity === 'quarterly') {
    periods = WAVE_QUARTERS;
    activeAnchorCount = 0;
  } else if (granularity === 'monthly2026') {
    periods = MONTHLY_2026_PERIODS;
    activeAnchorCount = 0;
  } else {
    const activeAnchorPeriods = ANCHOR_PERIODS.filter((p) => {
      if (p.isPioneerBucket) return hasPioneers;
      return hasEarlyNeural || (hasPioneers && hasWave);
    });
    activeAnchorCount = activeAnchorPeriods.length;
    periods =
      activeAnchorPeriods.length > 0
        ? hasWave
          ? [...activeAnchorPeriods, ...WAVE_QUARTERS]
          : activeAnchorPeriods
        : WAVE_QUARTERS;
  }

  const series =
    groupBy === 'discipline'
      ? Object.entries(DISCIPLINE_META).map(([name, meta]) => ({
          key: name,
          label: meta.short,
          colorVar: meta.colorVar,
        }))
      : groupBy === 'aiRole'
        ? AI_SERIES
        : PARADIGM_SERIES;

  // Baseline cumulative counts prior to the first displayed period (for zoomed windows like Quarterly / Monthly '26)
  const firstStart = periods[0]?.start || '1900-01-01';
  const priorItems = items.filter((b) => b.date < firstStart);
  let cumulativeCount = priorItems.length;
  let cumulativeImpact = priorItems.reduce((s, b) => s + b.compositeScore, 0);
  let cumulativeYears = priorItems.reduce(
    (s, b) => s + (typeof b.yearsUnsolved === 'number' && b.yearsUnsolved > 0 ? b.yearsUnsolved : 0),
    0
  );

  const buckets = periods.map((p) => {
    const inP = items.filter((b) => b.date >= p.start && b.date <= p.end);
    const counts = {};
    for (const s of series) counts[s.key] = 0;
    let periodYears = 0;
    for (const b of inP) {
      const k =
        groupBy === 'discipline'
          ? b.discipline
          : groupBy === 'aiRole'
            ? b.aiRole
            : b.aiParadigm;
      counts[k] = (counts[k] || 0) + 1;
      cumulativeCount += 1;
      cumulativeImpact += b.compositeScore;
      if (typeof b.yearsUnsolved === 'number' && b.yearsUnsolved > 0) {
        cumulativeYears += b.yearsUnsolved;
        periodYears += b.yearsUnsolved;
      }
    }
    const topItems = [...inP]
      .sort((a, b) => b.compositeScore - a.compositeScore)
      .slice(0, 3)
      .map((b) => ({
        title: b.shortTitle.replace(' (Anchor)', ''),
        score: b.compositeScore.toFixed(1),
      }));

    const span = p.yearsSpan || 1;
    const annualizedRate = inP.length / span;

    return {
      ...p,
      total: inP.length,
      annualizedRate,
      counts,
      periodYears,
      cumulativeCount,
      cumulativeYears,
      cumulativeImpact: Math.round(cumulativeImpact),
      topItems,
    };
  });

  return { buckets, series, activeAnchorCount, hasPioneers, hasWave };
}

export function renderVelocityChart(items, opts = {}) {
  const groupBy = typeof opts === 'string' ? opts : opts.groupBy || 'paradigm';
  const granularity = typeof opts === 'string' ? 'default' : opts.granularity || 'default';
  const barMode = typeof opts === 'string' ? 'rate' : opts.barMode === 'count' ? 'count' : 'rate';
  const yScale = typeof opts === 'string' ? 'linear' : opts.yScale === 'log' ? 'log' : 'linear';
  const curveMetricKey =
    typeof opts === 'string'
      ? 'count'
      : CURVE_METRICS[opts.curveMetric]
        ? opts.curveMetric
        : 'count';
  const curveMeta = CURVE_METRICS[curveMetricKey];

  const width = 1060;
  const height = 450;
  const margin = { top: 38, right: 68, bottom: 58, left: 56 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;

  const { buckets, series, activeAnchorCount, hasPioneers, hasWave } = computeVelocityData(items, {
    groupBy,
    granularity,
  });

  const getBucketBarVal = (b) => (barMode === 'rate' ? b.annualizedRate : b.total);
  const rawMaxBar = Math.max(4, ...buckets.map(getBucketBarVal));
  const step =
    rawMaxBar <= 6
      ? 1
      : rawMaxBar <= 12
        ? 2
        : rawMaxBar <= 18
          ? 3
          : rawMaxBar <= 32
            ? 4
            : rawMaxBar <= 64
              ? 8
              : rawMaxBar <= 140
                ? 20
                : rawMaxBar <= 320
                  ? 50
                  : 100;
  let maxBar = Math.ceil(rawMaxBar / step) * step;
  if (rawMaxBar / maxBar > 0.85) maxBar += step;

  const curveVals = buckets.map((b) => curveMeta.getVal(b));
  const maxCum = Math.max(5, ...curveVals);
  const logMax = Math.max(1, Math.log10(maxCum * 1.15));

  const slotW = innerW / Math.max(1, buckets.length);
  const barW = Math.min(44, slotW * 0.58);

  const yBar = (val) => margin.top + innerH - (val / maxBar) * innerH;
  const yCum = (val) => {
    if (yScale === 'log') {
      const clamped = Math.max(1, val);
      const frac = Math.log10(clamped) / logMax;
      return margin.top + innerH - Math.max(0, Math.min(1, frac)) * innerH;
    }
    return margin.top + innerH - (val / maxCum) * innerH;
  };

  const linePoints = buckets.map((b, idx) => {
    const val = curveMeta.getVal(b);
    return {
      x: margin.left + idx * slotW + slotW / 2,
      y: yCum(val),
      val,
      label: b.label,
    };
  });

  const linePath = linePoints
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
    .join(' ');

  const dividerX =
    activeAnchorCount > 0 && activeAnchorCount < buckets.length && hasWave
      ? margin.left + activeAnchorCount * slotW
      : null;

  // Non-redundant curve-specific callouts (Hero Pulse Strip already shows total, open years, and 2026 vs 2024 pace)
  const pre2020Items = items.filter((b) => b.date < '2020-01-01');
  const pre2020Pace = pre2020Items.length / 51;
  const count2026 = items.filter((b) => b.date.startsWith('2026')).length;
  const pace2026 = count2026 / (330 / 365.25);
  const paceMultiplier = pre2020Pace > 0 ? Math.round(pace2026 / pre2020Pace) : 0;

  const q4_2026 = items.filter((b) => b.date >= '2026-10-01');
  const q4NeuroSym = q4_2026.filter((b) => b.aiParadigm === 'Neuro-Symbolic').length;
  const q4NeuroSymPct = q4_2026.length ? Math.round((q4NeuroSym / q4_2026.length) * 100) : 0;

  const auto2026 = items.filter((b) => b.date.startsWith('2026') && b.aiRole === 'Autonomous AI').length;
  const auto2026Pct = count2026 ? Math.round((auto2026 / count2026) * 100) : 0;
  const h2_2026 = items.filter((b) => b.date >= '2026-07-01').length;

  const yBarTicks = [];
  for (let v = 0; v <= maxBar; v += step) yBarTicks.push(v);

  const rightAxisTicks =
    yScale === 'log'
      ? buildLogTicks(maxCum)
      : [0, 0.25, 0.5, 0.75, 1].map((frac) => Math.round(maxCum * frac));

  const footnoteText =
    barMode === 'rate'
      ? '*Bars normalized to annualized breakthroughs/yr (51 yrs for <2020; partial elapsed days for Q4/Nov 2026)'
      : granularity === 'monthly2026'
        ? '*Nov 2026 reflects partial month through Nov 26, 2026 · Cumulative curve includes prior 1969–2025 milestones'
        : granularity === 'quarterly'
          ? '*Q4 2026 reflects partial quarter through Nov 26, 2026 · Cumulative curve includes pre-2024 milestones'
          : granularity === 'annual'
            ? `${hasPioneers ? '*< 2020 hatched bar sums 51 yrs (0.9/yr) · ' : '*'}2026 reflects partial year through Nov 26, 2026`
            : `${hasPioneers ? '*< 2020 hatched bar sums 51 yrs (0.9/yr) · ' : '*'}Q4 2026 reflects partial quarter through Nov 26, 2026`;

  return `
    <div class="viz-card">
      <div class="viz-card__header">
        <div>
          <h2 class="viz-card__title">AI Scientific Acceleration &amp; Paradigm Shift Curve</h2>
          <p class="viz-card__desc">
            Switch between <strong>Pace (/yr)</strong> and <strong>Raw Count</strong> to compare the 51-year pre-2020 baseline fairly against single quarters, or toggle a <strong>Log</strong> right axis.
          </p>
        </div>

        <div class="segmented-ctrl" role="group" aria-label="Group acceleration bars by">
          <button
            type="button"
            id="vel-group-paradigm"
            data-velocity-group="paradigm"
            aria-pressed="${groupBy === 'paradigm' ? 'true' : 'false'}"
          >By Paradigm</button>
          <button
            type="button"
            id="vel-group-ai"
            data-velocity-group="aiRole"
            aria-pressed="${groupBy === 'aiRole' ? 'true' : 'false'}"
          >By AI Role</button>
          <button
            type="button"
            id="vel-group-disc"
            data-velocity-group="discipline"
            aria-pressed="${groupBy === 'discipline' ? 'true' : 'false'}"
          >By Discipline</button>
        </div>
      </div>

      <div class="viz-subcontrols">
        <div class="viz-subcontrols__group">
          <span class="viz-ctrl-label">Cadence</span>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Time cadence">
            <button type="button" data-velocity-granularity="default" aria-pressed="${granularity === 'default' ? 'true' : 'false'}">Era + Qtr</button>
            <button type="button" data-velocity-granularity="annual" aria-pressed="${granularity === 'annual' ? 'true' : 'false'}">Annual</button>
            <button type="button" data-velocity-granularity="quarterly" aria-pressed="${granularity === 'quarterly' ? 'true' : 'false'}">2024–26 Qtr</button>
            <button type="button" data-velocity-granularity="monthly2026" aria-pressed="${granularity === 'monthly2026' ? 'true' : 'false'}">2026 Monthly</button>
          </div>

          <span class="viz-ctrl-label">Bars</span>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Bar display metric">
            <button type="button" data-velocity-barmode="rate" aria-pressed="${barMode === 'rate' ? 'true' : 'false'}" title="Annualized discovery pace (breakthroughs per year) — normalizes 51-year pre-2020 era against single quarters">Pace (/yr)</button>
            <button type="button" data-velocity-barmode="count" aria-pressed="${barMode === 'count' ? 'true' : 'false'}" title="Raw count of breakthroughs per bucket">Raw Count</button>
          </div>
        </div>

        <div class="viz-subcontrols__group viz-subcontrols__group--right">
          <span class="viz-ctrl-label">Curve</span>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Cumulative curve metric">
            ${Object.entries(CURVE_METRICS)
              .map(
                ([k, m]) => `
              <button type="button" data-velocity-curve="${k}" aria-pressed="${curveMetricKey === k ? 'true' : 'false'}">${escapeHtml(m.label)}</button>
            `
              )
              .join('')}
          </div>

          <span class="viz-ctrl-label">Scale</span>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Cumulative curve scale">
            <button type="button" data-velocity-scale="linear" aria-pressed="${yScale === 'linear' ? 'true' : 'false'}">Linear</button>
            <button type="button" data-velocity-scale="log" aria-pressed="${yScale === 'log' ? 'true' : 'false'}" title="Logarithmic scale on right axis — exponential growth appears as a straight line">Log</button>
          </div>
        </div>
      </div>

      <div class="viz-legend">
        ${series
          .map(
            (s) => `
          <span class="viz-legend__item viz-legend__item--interactive" data-vel-legend-series="${escapeHtml(s.key)}" title="Hover to isolate ${escapeHtml(s.label)}">
            <span class="viz-legend__dot" style="background: ${s.colorVar};"></span>
            <span>${escapeHtml(s.label)}</span>
          </span>
        `
          )
          .join('')}
        <span class="viz-legend__item" style="margin-left: auto;">
          <span style="display:inline-block;width:16px;height:2.5px;background:var(--accent-primary);border-radius:2px;"></span>
          <span>${escapeHtml(curveMeta.legend)} (${yScale === 'log' ? 'log ' : ''}right axis)</span>
        </span>
      </div>

      <div class="viz-stage">
        <svg
          class="viz-svg"
          id="velocity-chart-svg"
          viewBox="0 0 ${width} ${height}"
          role="img"
          aria-label="Stacked bar and cumulative line chart showing exponential acceleration of AI-enabled scientific breakthroughs"
        >
          <defs>
            <pattern id="pioneer-bar-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--bg-surface)" stroke-width="2" stroke-opacity="0.38" />
            </pattern>
          </defs>

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
              pointer-events="none"
            />
            <line
              x1="${dividerX.toFixed(1)}"
              y1="${margin.top}"
              x2="${dividerX.toFixed(1)}"
              y2="${margin.top + innerH}"
              stroke="var(--border-strong)"
              stroke-width="1.2"
              stroke-dasharray="4 4"
              pointer-events="none"
            />
            <text
              x="${(margin.left + (dividerX - margin.left) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
              pointer-events="none"
            >${hasPioneers ? 'Pre-2020 Pioneers & 2020–23' : 'Annual Anchors (2020–23)'}</text>
            <text
              x="${(dividerX + (width - margin.right - dividerX) / 2).toFixed(1)}"
              y="${margin.top - 11}"
              text-anchor="middle"
              class="viz-annotation"
              pointer-events="none"
            >${granularity === 'annual' ? '2024–2026 Neural & Neuro-Symbolic Surge' : 'Quarterly AI-Enabled Breakthrough Cadence (2024–2026)'}</text>
          `
              : ''
          }

          <!-- Grid lines & Left Axis -->
          ${yBarTicks
            .map((v) => {
              const y = yBar(v);
              return `
              <line x1="${margin.left}" y1="${y.toFixed(1)}" x2="${width - margin.right}" y2="${y.toFixed(1)}" class="viz-grid-line" pointer-events="none" />
              <text x="${margin.left - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" class="viz-axis-label">${v}</text>
            `;
            })
            .join('')}

          <!-- Right Axis labels (Cumulative Curve) -->
          ${rightAxisTicks
            .map((val) => {
              const y = yCum(val);
              return `
              <text x="${width - margin.right + 10}" y="${(y + 4).toFixed(1)}" text-anchor="start" class="viz-axis-label" style="fill: var(--accent-primary);">${curveMeta.format(val)}</text>
            `;
            })
            .join('')}

          <!-- Column Hover Highlight Bands -->
          ${buckets
            .map((b, idx) => {
              const slotLeft = margin.left + idx * slotW;
              return `
              <rect
                class="vel-col-band"
                data-vel-band="${idx}"
                x="${slotLeft.toFixed(1)}"
                y="${margin.top}"
                width="${slotW.toFixed(1)}"
                height="${innerH}"
                fill="var(--accent-primary)"
                opacity="0"
                pointer-events="none"
              />
            `;
            })
            .join('')}

          <!-- Stacked Bars -->
          ${buckets
            .map((b, idx) => {
              const xCenter = margin.left + idx * slotW + slotW / 2;
              const xLeft = xCenter - barW / 2;
              const scaleDivisor = barMode === 'rate' ? b.yearsSpan || 1 : 1;
              let acc = 0;
              const rects = series
                .map((s) => {
                  const cnt = b.counts[s.key] || 0;
                  if (cnt === 0) return '';
                  const segVal = cnt / scaleDivisor;
                  const yBottom = yBar(acc);
                  acc += segVal;
                  const yTop = yBar(acc);
                  const h = Math.max(2, yBottom - yTop);
                  return `
                    <rect
                      class="vel-bar-seg"
                      data-vel-series="${escapeHtml(s.key)}"
                      x="${xLeft.toFixed(1)}"
                      y="${yTop.toFixed(1)}"
                      width="${barW.toFixed(1)}"
                      height="${h.toFixed(1)}"
                      fill="${s.colorVar}"
                      fill-opacity="${b.isAnchorBucket ? '0.68' : '0.88'}"
                      rx="2"
                      pointer-events="none"
                    />
                  `;
                })
                .join('');

              const hatchOverlay =
                b.isPioneerBucket && barMode === 'count' && b.total > 0
                  ? `<rect x="${xLeft.toFixed(1)}" y="${yBar(b.total).toFixed(1)}" width="${barW.toFixed(1)}" height="${Math.max(2, margin.top + innerH - yBar(b.total)).toFixed(1)}" fill="url(#pioneer-bar-hatch)" rx="2" pointer-events="none" />`
                  : '';

              return `
                <g>
                  ${rects}
                  ${hatchOverlay}
                  <text x="${xCenter.toFixed(1)}" y="${margin.top + innerH + 20}" text-anchor="middle" class="viz-axis-label">${b.label}</text>
                  ${
                    b.isPioneerBucket && barMode === 'count'
                      ? `<text x="${xCenter.toFixed(1)}" y="${margin.top + innerH + 33}" text-anchor="middle" class="viz-axis-label" style="font-size:9px;fill:var(--ink-muted);">(51-yr sum)</text>`
                      : ''
                  }
                </g>
              `;
            })
            .join('')}

          <!-- Cumulative Growth Curve -->
          <path
            d="${linePath}"
            fill="none"
            stroke="var(--accent-primary)"
            stroke-width="2.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            pointer-events="none"
          />
          ${linePoints
            .map(
              (pt, idx) => `
            <circle
              class="vel-curve-dot"
              data-vel-dot="${idx}"
              cx="${pt.x.toFixed(1)}"
              cy="${pt.y.toFixed(1)}"
              r="3.8"
              fill="var(--bg-surface)"
              stroke="var(--accent-primary)"
              stroke-width="2.2"
              pointer-events="none"
            />
          `
            )
            .join('')}

          <!-- Bar Value Labels (rendered above curve with halo & collision avoidance) -->
          ${buckets
            .map((b, idx) => {
              const barVal = getBucketBarVal(b);
              if (barVal <= 0) return '';
              const xCenter = margin.left + idx * slotW + slotW / 2;
              const barTopY = yBar(barVal);
              const curveY = linePoints[idx].y;
              let labelY = barTopY - 7;
              if (Math.abs(labelY - curveY) < 14) {
                if (margin.top + innerH - barTopY > 26) {
                  labelY = barTopY + 14;
                } else {
                  labelY = Math.min(barTopY - 7, curveY - 11);
                }
              }
              const insideBar = labelY > barTopY;
              const formattedVal =
                barMode === 'rate'
                  ? barVal < 10
                    ? barVal.toFixed(1)
                    : String(Math.round(barVal))
                  : String(b.total);
              return `<text x="${xCenter.toFixed(1)}" y="${labelY.toFixed(1)}" text-anchor="middle" class="viz-axis-label" style="font-weight:600;fill:${insideBar ? '#ffffff' : 'var(--ink-primary)'};${insideBar ? '' : 'paint-order:stroke;stroke:var(--bg-surface);stroke-width:3.5px;stroke-linejoin:round;'}pointer-events:none;">${formattedVal}</text>`;
            })
            .join('')}

          <!-- Full-height interactive column hit targets -->
          ${buckets
            .map((b, idx) => {
              const slotLeft = margin.left + idx * slotW;
              return `
              <rect
                class="vel-col-hit"
                data-vel-bucket="${idx}"
                x="${slotLeft.toFixed(1)}"
                y="${margin.top}"
                width="${slotW.toFixed(1)}"
                height="${innerH}"
                fill="transparent"
                tabindex="0"
                role="button"
                aria-label="${escapeHtml(b.label)}: ${b.total} breakthroughs (${b.annualizedRate.toFixed(1)}/yr), ${b.cumulativeCount} cumulative"
              />
            `;
            })
            .join('')}

          <!-- Baseline & Axis Titles -->
          <line x1="${margin.left}" y1="${margin.top + innerH}" x2="${width - margin.right}" y2="${margin.top + innerH}" class="viz-axis-line" pointer-events="none" />
          <text x="15" y="${margin.top + innerH / 2}" text-anchor="middle" transform="rotate(-90 15 ${margin.top + innerH / 2})" class="viz-axis-label">${barMode === 'rate' ? 'ANNUALIZED PACE (BREAKTHROUGHS / YR)' : 'AI-ENABLED BREAKTHROUGHS / PERIOD'}</text>
          <text x="${width - 14}" y="${margin.top + innerH / 2}" text-anchor="middle" transform="rotate(90 ${width - 14} ${margin.top + innerH / 2})" class="viz-axis-label" style="fill: var(--accent-primary);">${escapeHtml(curveMeta.axisLabel)}${yScale === 'log' ? ' (LOG)' : ''}</text>
          <text x="${width - margin.right}" y="${height - 8}" text-anchor="end" class="viz-axis-label" style="font-size:10px;">${escapeHtml(footnoteText)}</text>
        </svg>
      </div>

      <div class="viz-callout-grid">
        <div>
          <div class="viz-callout__num">${paceMultiplier ? `~${paceMultiplier}×` : `${Math.round(pace2026)}/yr`}</div>
          <div class="viz-callout__text">Annualized pace jump from pre-2020 pioneers (${pre2020Pace.toFixed(1)}/yr across 51 yrs) to 2026 (${Math.round(pace2026)}/yr run-rate).</div>
        </div>
        <div>
          <div class="viz-callout__num">${h2_2026} milestones</div>
          <div class="viz-callout__text">Landed in H2 2026 alone (Jul – Nov 26), accounting for ${items.length ? Math.round((h2_2026 / items.length) * 100) : 0}% of active AI-enabled breakthroughs.</div>
        </div>
        <div>
          <div class="viz-callout__num">${q4NeuroSymPct}% neuro-sym</div>
          <div class="viz-callout__text">Share of Q4 2026 breakthroughs pairing neural search with formal verifiers (${q4NeuroSym} of ${q4_2026.length} in Q4).</div>
        </div>
        <div>
          <div class="viz-callout__num">${auto2026Pct}% autonomous</div>
          <div class="viz-callout__text">Share of 2026 breakthroughs led autonomously by AI agents (${auto2026} of ${count2026} within active filters).</div>
        </div>
      </div>
    </div>
  `;
}

export function bindVelocityInteractions(svg, items, opts, callbacks) {
  if (!svg) return;
  const { showTooltip, hideTooltip } = callbacks;
  const { buckets, series } = computeVelocityData(items, opts);

  const bands = Array.from(svg.querySelectorAll('[data-vel-band]'));
  const dots = Array.from(svg.querySelectorAll('[data-vel-dot]'));

  function setHoverCol(idx) {
    bands.forEach((b, i) => b.setAttribute('opacity', i === idx ? '0.09' : '0'));
    dots.forEach((d, i) => d.setAttribute('r', i === idx ? '5.6' : '3.8'));
  }

  svg.querySelectorAll('[data-vel-bucket]').forEach((hit) => {
    const idx = Number(hit.dataset.velBucket);
    const b = buckets[idx];
    if (!b) return;

    const show = (ev) => {
      setHoverCol(idx);
      const breakdown = series
        .filter((s) => (b.counts[s.key] || 0) > 0)
        .map(
          (s) =>
            `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:8px;"><span style="width:7px;height:7px;border-radius:50%;background:${s.colorVar};display:inline-block;"></span>${escapeHtml(s.label.split(' (')[0])}: <strong>${b.counts[s.key]}</strong></span>`
        )
        .join('');

      const topHtml =
        b.topItems.length > 0
          ? `<div class="viz-tooltip__list">${b.topItems
              .map((t) => `<div>• ${escapeHtml(t.title)} <span class="mono" style="opacity:0.7;">(${t.score})</span></div>`)
              .join('')}</div>`
          : '';

      const paceText = b.isPre2020
        ? `${b.annualizedRate.toFixed(1)}/yr across ${b.yearsSpan} yrs`
        : `${b.annualizedRate < 10 ? b.annualizedRate.toFixed(1) : Math.round(b.annualizedRate)}/yr pace`;

      showTooltip(
        ev,
        `
          <div class="viz-tooltip__title">${escapeHtml(b.label)} — ${b.total} breakthrough${b.total === 1 ? '' : 's'}</div>
          <div class="viz-tooltip__meta">Rate: <strong>${paceText}</strong> · Cumulative: ${b.cumulativeCount} total · ${b.cumulativeYears.toLocaleString('en-US')}+ human yrs unsolved</div>
          ${breakdown ? `<div style="margin-bottom:0.35rem;font-size:0.75rem;">${breakdown}</div>` : ''}
          ${topHtml}
        `
      );
    };

    hit.addEventListener('mouseenter', show);
    hit.addEventListener('mousemove', show);
    hit.addEventListener('focus', (ev) => {
      const r = hit.getBoundingClientRect();
      show({ clientX: r.left + r.width / 2, clientY: r.top + 40 });
    });
    hit.addEventListener('mouseleave', () => {
      setHoverCol(-1);
      hideTooltip();
    });
    hit.addEventListener('blur', () => {
      setHoverCol(-1);
      hideTooltip();
    });
  });

  // Legend hover isolation
  const card = svg.closest('.viz-card');
  if (card) {
    const segs = Array.from(svg.querySelectorAll('.vel-bar-seg'));
    card.querySelectorAll('[data-vel-legend-series]').forEach((el) => {
      const key = el.dataset.velLegendSeries;
      el.addEventListener('mouseenter', () => {
        segs.forEach((s) => {
          s.style.opacity = s.dataset.velSeries === key ? '1' : '0.16';
        });
      });
      el.addEventListener('mouseleave', () => {
        segs.forEach((s) => {
          s.style.opacity = '';
        });
      });
    });
  }
}
