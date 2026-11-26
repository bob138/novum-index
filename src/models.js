import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import dataset from '../data/breakthroughs.json';
import {
  DISCIPLINE_META,
  WEIGHT_PRESETS,
  escapeHtml,
  formatDate,
  rankBreakthroughs,
} from './scoring.js';
import {
  ARCHITECTURE_META,
  GROUP_BY_OPTIONS,
  PARADIGM_META,
  RANK_BY_OPTIONS,
  aggregateModelRankings,
  computeParadigmComparison,
  formatVolume,
} from './modelAnalytics.js';
import {
  renderModelBarChart,
  renderModelQuadrantChart,
  bindModelChartInteractions,
} from './visualizations/ModelCharts.js';
import { renderStatusBadge } from './components/Leaderboard.js';

const REPO_URL = 'https://github.com/bob138/novum-index';
const THEME_STORAGE_KEY = 'novum-index-theme-pref';
const LEGACY_THEME_STORAGE_KEY = 'frontier-index-theme-pref';

function getSystemTheme() {
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch {
    // ignore
  }
  return 'light';
}

function getSavedThemePreference() {
  try {
    const saved =
      localStorage.getItem(THEME_STORAGE_KEY) ||
      localStorage.getItem(LEGACY_THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore
  }
  return null;
}

const state = {
  theme: getSavedThemePreference() || getSystemTheme(),
  groupBy: 'family',
  sortBy: 'cumulativeImpact',
  attribution: 'fractional',
  paradigm: 'all',
  discipline: 'all',
  era: 'all',
  minBreakthroughs: 1,
  rubricPreset: 'balanced',
  chartView: 'quadrant',
  quadrantY: 'avgImpact',
  paradigmBarMetric: 'impact',
  search: '',
  expandedIds: new Set(),
};

function applyTheme(theme, { persist = false } = {}) {
  document.documentElement.setAttribute('data-theme', theme);
  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }
}

function hydrateStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const group = params.get('group');
  if (GROUP_BY_OPTIONS.some((o) => o.id === group)) state.groupBy = group;

  const sort = params.get('sort');
  if (RANK_BY_OPTIONS.some((o) => o.id === sort)) state.sortBy = sort;

  const attr = params.get('attr');
  if (attr === 'fractional' || attr === 'full') state.attribution = attr;

  const paradigm = params.get('paradigm');
  if (
    ['Neural / Deep Learning', 'Neuro-Symbolic', 'Symbolic / Classical'].includes(paradigm)
  ) {
    state.paradigm = paradigm;
  }

  const discipline = params.get('discipline');
  if (discipline && DISCIPLINE_META[discipline]) state.discipline = discipline;

  const era = params.get('era');
  if (['all', '2024-2026', '2020-2023', 'pre-2020'].includes(era)) state.era = era;

  const preset = params.get('preset');
  if (WEIGHT_PRESETS.some((p) => p.id === preset)) state.rubricPreset = preset;

  if (params.get('min') === '2') state.minBreakthroughs = 2;
}

function syncUrl() {
  const url = new URL(window.location.href);
  const setOrDelete = (key, val, defVal) => {
    if (val !== defVal) url.searchParams.set(key, String(val));
    else url.searchParams.delete(key);
  };
  setOrDelete('group', state.groupBy, 'family');
  setOrDelete('sort', state.sortBy, 'cumulativeImpact');
  setOrDelete('attr', state.attribution, 'fractional');
  setOrDelete('paradigm', state.paradigm, 'all');
  setOrDelete('discipline', state.discipline, 'all');
  setOrDelete('era', state.era, 'all');
  setOrDelete('preset', state.rubricPreset, 'balanced');
  setOrDelete('min', state.minBreakthroughs, 1);

  try {
    window.history.replaceState(null, '', url.toString());
  } catch {
    // ignore
  }
}

function getActiveWeights() {
  const preset = WEIGHT_PRESETS.find((p) => p.id === state.rubricPreset);
  return preset ? { ...preset.weights } : { ...dataset.meta.defaultWeights };
}

function filterBreakthroughsForModels(ranked) {
  return ranked.filter((item) => {
    if (state.paradigm !== 'all' && item.aiParadigm !== state.paradigm) return false;
    if (state.discipline !== 'all' && item.discipline !== state.discipline) return false;
    if (state.era === '2024-2026' && item.date < '2024-01-01') return false;
    if (state.era === '2020-2023' && (item.date < '2020-01-01' || item.date >= '2024-01-01')) {
      return false;
    }
    if (state.era === 'pre-2020' && item.date >= '2020-01-01') return false;
    return true;
  });
}

function ensureTooltip() {
  let el = document.getElementById('viz-floating-tooltip');
  if (!el) {
    el = document.createElement('div');
    el.id = 'viz-floating-tooltip';
    el.className = 'viz-tooltip';
    el.setAttribute('role', 'tooltip');
    document.body.appendChild(el);
  }
  return el;
}

function hideTooltip() {
  const tip = document.getElementById('viz-floating-tooltip');
  if (tip) tip.classList.remove('viz-tooltip--visible');
}

function showTooltip(ev, html) {
  const tip = ensureTooltip();
  tip.innerHTML = html;
  tip.classList.add('viz-tooltip--visible');
  const tipW = tip.offsetWidth || 310;
  const tipH = tip.offsetHeight || 120;
  const x =
    ev.clientX + 14 + tipW > window.innerWidth - 12
      ? Math.max(12, ev.clientX - tipW - 14)
      : Math.max(12, ev.clientX + 14);
  const y =
    ev.clientY - 12 + tipH > window.innerHeight - 12
      ? Math.max(12, window.innerHeight - tipH - 12)
      : Math.max(12, ev.clientY - 12);
  tip.style.left = `${x}px`;
  tip.style.top = `${y}px`;
}

function renderPulseStrip(allRows, filteredBreakthroughs, allRanked) {
  const famCount = aggregateModelRankings(allRanked, { groupBy: 'family' }).length;
  const modCount = aggregateModelRankings(allRanked, { groupBy: 'model' }).length;

  const byCum = [...allRows].sort((a, b) => b.cumulativeImpact - a.cumulativeImpact);
  const topCum = byCum[0] || null;

  const byPeak = [...allRows].sort(
    (a, b) => b.peakImpact - a.peakImpact || b.cumulativeImpact - a.cumulativeImpact
  );
  const topPeak = byPeak[0] || null;

  const byVerified = [...allRows].sort(
    (a, b) => b.verifiedCount - a.verifiedCount || b.cumulativeImpact - a.cumulativeImpact
  );
  const topVerified = byVerified[0] && byVerified[0].verifiedCount > 0 ? byVerified[0] : null;

  const byAvgMulti = allRows
    .filter((r) => r.rawCount >= 2)
    .sort((a, b) => b.avgImpact - a.avgImpact || b.volume - a.volume);
  const topAvgMulti = byAvgMulti[0] || allRows[0] || null;

  const short = (str, n = 22) => {
    if (!str) return '—';
    const clean = str
      .replace(/\s*\([^)]*\)$/, '')
      .replace(/\s+Lineage$/, '')
      .replace(/\s+Structural Suite$/, ' Suite')
      .replace(/\s+Regulatory Suite$/, '')
      .replace(/\s+& Research$/, '');
    return clean.length > n ? `${clean.slice(0, n - 1)}…` : clean;
  };

  return `
    <div class="pulse-strip" aria-label="AI Systems overview metrics">
      <div class="pulse-stat">
        <div class="pulse-stat__value">${allRows.length}</div>
        <div class="pulse-stat__label">${escapeHtml(GROUP_BY_OPTIONS.find((g) => g.id === state.groupBy)?.label || 'Entries')} Ranked</div>
        <div class="pulse-stat__note">${famCount} families · ${modCount} systems · ${filteredBreakthroughs.length} results</div>
      </div>
      <div class="pulse-stat">
        <div class="pulse-stat__value models-stat-title">${escapeHtml(short(topCum?.name, 20))}</div>
        <div class="pulse-stat__label">#1 Cumulative Impact</div>
        <div class="pulse-stat__note">${topCum ? `${Math.round(topCum.cumulativeImpact).toLocaleString('en-US')} pts · ${formatVolume(topCum.volume)} vol` : 'No matching systems'}</div>
      </div>
      <div class="pulse-stat">
        <div class="pulse-stat__value models-stat-title">${escapeHtml(short(topPeak?.name, 20))}</div>
        <div class="pulse-stat__label">#1 Peak Breakthrough</div>
        <div class="pulse-stat__note">${topPeak ? `${topPeak.peakImpact.toFixed(1)}/100 · ${escapeHtml(short(topPeak.peakBreakthrough?.shortTitle, 24))}` : '—'}</div>
      </div>
      <div class="pulse-stat">
        <div class="pulse-stat__value models-stat-title">${escapeHtml(short(topVerified?.name, 20))}</div>
        <div class="pulse-stat__label">#1 Formal Verification</div>
        <div class="pulse-stat__note">${topVerified ? `${formatVolume(topVerified.verifiedCount)} Lean/Coq/SAT proofs (${topVerified.verifiedRate}%)` : '0 formal proofs in filter'}</div>
      </div>
      <div class="pulse-stat">
        <div class="pulse-stat__value models-stat-title">${escapeHtml(short(topAvgMulti?.name, 20))}</div>
        <div class="pulse-stat__label">Top Avg Impact (2+ Hits)</div>
        <div class="pulse-stat__note">${topAvgMulti ? `${topAvgMulti.avgImpact.toFixed(1)} avg across ${formatVolume(topAvgMulti.volume)} results` : '—'}</div>
      </div>
    </div>
  `;
}

function renderParadigmStrip(filteredBreakthroughs) {
  const comparison = computeParadigmComparison(filteredBreakthroughs);
  const useImpact = state.paradigmBarMetric === 'impact';

  return `
    <section class="models-paradigm-section" aria-labelledby="paradigm-compare-heading">
      <div class="models-section-head">
        <div>
          <h2 id="paradigm-compare-heading" class="models-section-title">Paradigm Share: Neural Nets vs. Neuro-Symbolic vs. Symbolic AI</h2>
          <p class="models-section-sub">Click any paradigm card to filter the rankings below. Compares volume, cumulative impact, mean rigor, formal verification, and autonomy.</p>
        </div>
        <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Paradigm bar share metric">
          <button type="button" data-paradigm-bar="impact" aria-pressed="${useImpact ? 'true' : 'false'}">Impact Share</button>
          <button type="button" data-paradigm-bar="volume" aria-pressed="${!useImpact ? 'true' : 'false'}">Volume Share</button>
        </div>
      </div>

      <div class="models-share-bar" role="img" aria-label="Proportional share across AI paradigms">
        ${comparison
          .map((p) => {
            const pct = useImpact ? p.impactPct : p.volumePct;
            if (pct <= 0) return '';
            return `
              <div
                class="models-share-bar__seg"
                style="width: ${pct.toFixed(2)}%; background: ${p.meta.colorVar};"
                title="${escapeHtml(p.key)}: ${pct.toFixed(1)}% (${p.count} breakthroughs, ${Math.round(p.cumulativeImpact).toLocaleString('en-US')} cumulative pts)"
              >
                ${pct >= 11 ? `<span>${pct.toFixed(0)}%</span>` : ''}
              </div>
            `;
          })
          .join('')}
      </div>

      <div class="models-paradigm-grid">
        ${comparison
          .map((p) => {
            const isSelected = state.paradigm === p.key;
            const eraStr =
              p.firstYear && p.lastYear
                ? p.firstYear === p.lastYear
                  ? String(p.firstYear)
                  : `${p.firstYear}–${p.lastYear}`
                : '—';
            return `
              <button
                type="button"
                class="models-paradigm-card ${isSelected ? 'models-paradigm-card--active' : ''}"
                data-toggle-paradigm="${escapeHtml(p.key)}"
                aria-pressed="${isSelected ? 'true' : 'false'}"
              >
                <div class="models-paradigm-card__top">
                  <span class="models-paradigm-card__name">
                    <span class="viz-legend__dot" style="background: ${p.meta.colorVar};"></span>
                    ${escapeHtml(p.key)}
                  </span>
                  <span class="models-paradigm-card__era">${eraStr}</span>
                </div>
                <div class="models-paradigm-card__hero">
                  <span class="models-paradigm-card__count">${p.count}</span>
                  <span class="models-paradigm-card__pct">${p.volumePct.toFixed(1)}% vol · ${Math.round(p.cumulativeImpact).toLocaleString('en-US')} cum. pts</span>
                </div>
                <div class="models-paradigm-card__metrics">
                  <span>Avg <strong>${p.avgImpact.toFixed(1)}</strong></span>
                  <span>Peak <strong>${p.peakImpact.toFixed(1)}</strong></span>
                  <span>Verified <strong>${p.verifiedRate}%</strong></span>
                  <span>Autonomous <strong>${p.autonomousRate}%</strong></span>
                </div>
                ${
                  p.peakItem
                    ? `<div class="models-paradigm-card__peak">Top result: ${escapeHtml(p.peakItem.shortTitle)}</div>`
                    : ''
                }
              </button>
            `;
          })
          .join('')}
      </div>
    </section>
  `;
}

function renderControlsBar(allBreakthroughs) {
  const hasFilters =
    state.paradigm !== 'all' ||
    state.discipline !== 'all' ||
    state.era !== 'all' ||
    state.minBreakthroughs > 1 ||
    state.rubricPreset !== 'balanced' ||
    state.search.trim() !== '';

  return `
    <div class="controls-bar models-controls-bar">
      <div class="controls-bar__top">
        <div class="view-tabs" role="tablist" aria-label="Grouping lens">
          ${GROUP_BY_OPTIONS.map(
            (g) => `
            <button
              type="button"
              role="tab"
              class="view-tab"
              data-group-by="${g.id}"
              aria-selected="${state.groupBy === g.id ? 'true' : 'false'}"
            >
              <span>${escapeHtml(g.label)}</span>
            </button>
          `
          ).join('')}
        </div>

        <div class="controls-bar__right models-attr-group">
          <span class="viz-ctrl-label" title="Fractional (1/k) splits multi-model papers cleanly so shares sum to exact breakthrough totals (Nature Index style). Full Co-Credit awards 1.0 to every contributing system.">Attribution</span>
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Multi-model attribution mode">
            <button
              type="button"
              data-attribution="fractional"
              aria-pressed="${state.attribution === 'fractional' ? 'true' : 'false'}"
              title="Fractional share (1/k on joint breakthroughs) so totals sum cleanly without double-counting"
            >Fractional (1/k)</button>
            <button
              type="button"
              data-attribution="full"
              aria-pressed="${state.attribution === 'full' ? 'true' : 'false'}"
              title="Awards full 1.0 credit to each contributing AI system on joint or independently reproduced breakthroughs"
            >Full Co-Credit</button>
          </div>
        </div>
      </div>

      <div class="models-rank-strip" role="group" aria-label="Rank AI systems by metric">
        <span class="viz-ctrl-label">Rank By</span>
        <div class="models-rank-pills">
          ${RANK_BY_OPTIONS.map(
            (opt) => `
            <button
              type="button"
              class="disc-pill"
              data-sort-by="${opt.id}"
              aria-pressed="${state.sortBy === opt.id ? 'true' : 'false'}"
            >
              <span>${escapeHtml(opt.label)}</span>
            </button>
          `
          ).join('')}
        </div>
      </div>

      <div class="filter-row">
        <div class="search-box">
          <svg class="search-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="search"
            id="models-search-input"
            class="search-box__input"
            placeholder="Search models, labs, architectures, or breakthroughs (e.g., AlphaFold, Claude, GPT-6, EQP)..."
            value="${escapeHtml(state.search)}"
            aria-label="Search AI systems and models"
          />
        </div>

        <select id="models-filter-discipline" class="filter-select" aria-label="Filter by scientific discipline">
          <option value="all" ${state.discipline === 'all' ? 'selected' : ''}>All Disciplines (${allBreakthroughs.length})</option>
          ${Object.keys(DISCIPLINE_META)
            .map(
              (d) =>
                `<option value="${escapeHtml(d)}" ${state.discipline === d ? 'selected' : ''}>${escapeHtml(d)}</option>`
            )
            .join('')}
        </select>

        <select id="models-filter-paradigm" class="filter-select" aria-label="Filter by AI paradigm">
          <option value="all" ${state.paradigm === 'all' ? 'selected' : ''}>All Paradigms</option>
          ${Object.keys(PARADIGM_META)
            .map(
              (p) =>
                `<option value="${escapeHtml(p)}" ${state.paradigm === p ? 'selected' : ''}>${escapeHtml(p)}</option>`
            )
            .join('')}
        </select>

        <select id="models-filter-era" class="filter-select" aria-label="Filter by historical era">
          <option value="all" ${state.era === 'all' ? 'selected' : ''}>All Eras (1969–2026)</option>
          <option value="2024-2026" ${state.era === '2024-2026' ? 'selected' : ''}>2024–2026 Modern Wave</option>
          <option value="2020-2023" ${state.era === '2020-2023' ? 'selected' : ''}>2020–2023 Early Wave</option>
          <option value="pre-2020" ${state.era === 'pre-2020' ? 'selected' : ''}>Pre-2020 Pioneers (1969–2019)</option>
        </select>

        <select id="models-rubric-preset" class="filter-select" aria-label="Impact scoring rubric weights">
          ${WEIGHT_PRESETS.map(
            (p) =>
              `<option value="${p.id}" ${state.rubricPreset === p.id ? 'selected' : ''}>Rubric: ${escapeHtml(p.label)}</option>`
          ).join('')}
        </select>

        <button
          type="button"
          class="disc-pill"
          id="models-min-toggle"
          aria-pressed="${state.minBreakthroughs >= 2 ? 'true' : 'false'}"
          title="Filter to AI systems with 2 or more breakthroughs (useful when ranking by Average Impact)"
        >
          <span>2+ Results Only</span>
        </button>

        <button
          type="button"
          class="clear-btn"
          id="models-clear-filters"
          ${hasFilters ? '' : 'hidden'}
        >Reset Filters</button>
      </div>
    </div>
  `;
}

function renderChartsCard(rows) {
  const isQuad = state.chartView === 'quadrant';
  const groupLabel = GROUP_BY_OPTIONS.find((g) => g.id === state.groupBy)?.label || 'AI Systems';

  return `
    <section class="viz-card models-chart-card" aria-label="AI Systems visual analytics">
      <div class="viz-card__header">
        <div>
          <h2 class="viz-card__title">${isQuad ? `Volume × Impact Landscape (${escapeHtml(groupLabel)})` : `Top 15 Ranked ${escapeHtml(groupLabel)}`}</h2>
          <p class="viz-card__sub">
            ${
              isQuad
                ? 'Separates high-volume frontier workhorses (right) from landmark single-breakthrough specialists like AlphaFold 2, RFdiffusion, and EQP (top-left).'
                : 'Direct ranked comparison across the active metric, color-coded by scientific discipline mix or architecture class.'
            }
          </p>
        </div>
        <div class="viz-subcontrols__group">
          <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Chart view">
            <button type="button" data-chart-view="quadrant" aria-pressed="${isQuad ? 'true' : 'false'}">Volume × Impact Map</button>
            <button type="button" data-chart-view="bars" aria-pressed="${!isQuad ? 'true' : 'false'}">Top 15 Bars</button>
          </div>
          ${
            isQuad
              ? `
                <div class="segmented-ctrl segmented-ctrl--sm" role="group" aria-label="Quadrant Y-axis metric">
                  <button type="button" data-quadrant-y="avgImpact" aria-pressed="${state.quadrantY === 'avgImpact' ? 'true' : 'false'}">Y: Avg Impact</button>
                  <button type="button" data-quadrant-y="peakImpact" aria-pressed="${state.quadrantY === 'peakImpact' ? 'true' : 'false'}">Y: Peak Impact</button>
                </div>
              `
              : ''
          }
        </div>
      </div>

      ${
        isQuad
          ? renderModelQuadrantChart(rows, {
              quadrantY: state.quadrantY,
              attribution: state.attribution,
            })
          : renderModelBarChart(rows, { sortBy: state.sortBy })
      }
    </section>
  `;
}

function renderModelLeaderboard(rows) {
  if (!rows.length) {
    return `
      <div class="empty-state">
        <h3 class="empty-state__title">No matching AI systems</h3>
        <p class="empty-state__text">Try clearing search or relaxing the paradigm, discipline, era, or 2+ results filter.</p>
      </div>
    `;
  }

  const maxCum = Math.max(1, ...rows.map((r) => r.cumulativeImpact));
  const activeRankMeta = RANK_BY_OPTIONS.find((o) => o.id === state.sortBy) || RANK_BY_OPTIONS[0];

  return `
    <section class="models-ledger" aria-labelledby="models-ledger-heading">
      <div class="models-section-head">
        <div>
          <h2 id="models-ledger-heading" class="models-section-title">
            Ranked Ledger · ${rows.length} ${rows.length === 1 ? 'Entry' : 'Entries'} by ${escapeHtml(activeRankMeta.label)}
          </h2>
          <p class="models-section-sub">
            Click any row to expand its complete breakthrough audit trail and open individual dossiers on the main Index.
          </p>
        </div>
        <div class="models-expand-actions">
          <button type="button" class="clear-btn" id="models-expand-top">Expand Top 3</button>
          ${
            state.expandedIds.size > 0
              ? `<button type="button" class="clear-btn" id="models-collapse-all">Collapse All</button>`
              : ''
          }
        </div>
      </div>

      <div class="models-table-wrap">
        <div class="models-table-head" aria-hidden="true">
          <span>Rank</span>
          <span>AI System / Lineage</span>
          <span class="models-col-num">Cum. Impact</span>
          <span class="models-col-num">Volume</span>
          <span class="models-col-num">Avg / Peak</span>
          <span class="models-col-num">Rigor &amp; Autonomy</span>
          <span>Disciplines</span>
        </div>

        <div class="models-rows">
          ${rows
            .map((row) => {
              const isExpanded = state.expandedIds.has(row.id);
              const archMeta =
                ARCHITECTURE_META[row.dominantArchitecture] ||
                ARCHITECTURE_META['Domain Science Neural Net'];
              const cumPct = Math.max(3, (row.cumulativeImpact / maxCum) * 100);
              const eraLabel =
                row.firstYear === row.lastYear ? String(row.firstYear) : `${row.firstYear}–${row.lastYear}`;
              const showLabSub =
                state.groupBy !== 'lab' &&
                row.primaryLab &&
                !row.name.toLowerCase().includes(row.primaryLab.toLowerCase());

              return `
                <article
                  class="models-row-card ${isExpanded ? 'models-row-card--expanded' : ''}"
                  id="model-row-${escapeHtml(row.id)}"
                >
                  <button
                    type="button"
                    class="models-row-trigger"
                    data-expand-model="${escapeHtml(row.id)}"
                    aria-expanded="${isExpanded ? 'true' : 'false'}"
                  >
                    <div class="models-rank-cell">
                      <span class="models-rank-badge ${row.rank <= 3 ? 'models-rank-badge--top' : ''}">#${row.rank}</span>
                    </div>

                    <div class="models-identity-cell">
                      <div class="models-identity-title-line">
                        <span class="models-identity-name">${escapeHtml(row.name)}</span>
                        <span class="models-era-tag">${eraLabel}</span>
                      </div>
                      <div class="models-identity-meta">
                        <span class="models-arch-pill" style="color: ${archMeta.colorVar}; background: ${archMeta.bgVar};">
                          ${escapeHtml(archMeta.shortLabel)}
                        </span>
                        ${
                          showLabSub
                            ? `<span class="models-lab-tag">${escapeHtml(row.primaryLab)}</span>`
                            : ''
                        }
                        ${
                          row.subModels.length > 1 && state.groupBy !== 'model'
                            ? `<span class="models-subcount">${row.subModels.length} distinct systems</span>`
                            : ''
                        }
                      </div>
                      ${
                        row.peakBreakthrough
                          ? `<div class="models-signature">Peak: <strong>${escapeHtml(row.peakBreakthrough.shortTitle)}</strong> (${row.peakImpact.toFixed(1)})</div>`
                          : ''
                      }
                    </div>

                    <div class="models-metric-cell models-col-num">
                      <div class="models-metric-primary ${state.sortBy === 'cumulativeImpact' ? 'models-metric-primary--active' : ''}">
                        ${Math.round(row.cumulativeImpact).toLocaleString('en-US')}
                      </div>
                      <div class="models-inline-bar" aria-hidden="true">
                        <span style="width: ${cumPct.toFixed(1)}%; background: ${archMeta.colorVar};"></span>
                      </div>
                      <div class="models-metric-sub">impact pts</div>
                    </div>

                    <div class="models-metric-cell models-col-num">
                      <div class="models-metric-primary ${state.sortBy === 'volume' ? 'models-metric-primary--active' : ''}">
                        ${formatVolume(row.volume)}
                      </div>
                      <div class="models-metric-sub">
                        ${
                          row.coAttributedCount > 0 && state.attribution === 'fractional'
                            ? `${row.rawCount} total · ${row.coAttributedCount} joint`
                            : row.rawCount === 1
                              ? '1 result'
                              : `${row.rawCount} results`
                        }
                      </div>
                    </div>

                    <div class="models-metric-cell models-col-num">
                      <div class="models-metric-primary ${state.sortBy === 'avgImpact' || state.sortBy === 'peakImpact' ? 'models-metric-primary--active' : ''}">
                        ${row.avgImpact.toFixed(1)}
                        <span class="models-metric-sep">/</span>
                        <span class="models-metric-peak">${row.peakImpact.toFixed(1)}</span>
                      </div>
                      <div class="models-metric-sub">avg / peak</div>
                    </div>

                    <div class="models-metric-cell models-col-num">
                      <div class="models-rigor-chips">
                        <span class="models-mini-chip ${row.verifiedCount > 0 ? 'models-mini-chip--verified' : ''}" title="Formally Verified proofs (${row.verifiedRate}%)">
                          ${formatVolume(row.verifiedCount)} Ver
                        </span>
                        <span class="models-mini-chip" title="Autonomous AI-Led share">
                          ${row.autonomousRate}% Auto
                        </span>
                      </div>
                      <div class="models-metric-sub">
                        ${row.yearsUnsolved > 0 ? `${row.yearsUnsolved.toLocaleString('en-US')} yrs unsolved` : 'New frontier / tooling'}
                      </div>
                    </div>

                    <div class="models-disc-cell">
                      <div class="models-disc-bar" title="${row.disciplineBreakdown.map((d) => `${d.discipline}: ${Math.round(d.pct)}%`).join(' · ')}">
                        ${row.disciplineBreakdown
                          .map(
                            (d) =>
                              `<span style="width: ${d.pct.toFixed(1)}%; background: ${d.colorVar};"></span>`
                          )
                          .join('')}
                      </div>
                      <div class="models-disc-labels">
                        <span>${escapeHtml(row.disciplineBreakdown.slice(0, 2).map((d) => d.discipline.split(' ')[0]).join(' · '))}</span>
                        <span class="models-chevron" aria-hidden="true">${isExpanded ? '▾' : '▸'}</span>
                      </div>
                    </div>
                  </button>

                  ${
                    isExpanded
                      ? `
                        <div class="models-drawer">
                          <div class="models-drawer__header">
                            <span>Attributed Breakthroughs (${row.breakthroughs.length})</span>
                            <span>${state.attribution === 'fractional' ? 'Showing Fractional (1/k) credit shares' : 'Showing Full Co-Credit (1.0 per entry)'}</span>
                          </div>
                          <ul class="models-drawer__list">
                            ${row.breakthroughs
                              .map(({ item, credit, isCoAttributed, roleNotes }) => {
                                const discMeta = DISCIPLINE_META[item.discipline];
                                return `
                                  <li class="models-drawer__item">
                                    <div class="models-drawer__main">
                                      <div class="models-drawer__top">
                                        <span class="viz-legend__dot" style="background: ${discMeta?.colorVar || 'var(--ink-muted)'};"></span>
                                        <a
                                          href="./index.html#breakthrough/${encodeURIComponent(item.id)}"
                                          class="models-drawer__title"
                                        >${escapeHtml(item.title)}</a>
                                        ${renderStatusBadge(item.verificationStatus)}
                                      </div>
                                      <div class="models-drawer__meta">
                                        <span>${formatDate(item.date)}</span>
                                        <span>·</span>
                                        <span>${escapeHtml(item.discipline)}</span>
                                        <span>·</span>
                                        <span>${escapeHtml(item.aiRole)}</span>
                                        <span>·</span>
                                        <span>${escapeHtml(item.aiSystem || '')}</span>
                                        ${
                                          isCoAttributed
                                            ? `<span class="models-credit-badge">Credit: ${formatVolume(credit)}${roleNotes.length ? ` (${escapeHtml(roleNotes[0])})` : ''}</span>`
                                            : ''
                                        }
                                      </div>
                                    </div>
                                    <div class="models-drawer__right">
                                      <span class="models-drawer__score">${item.compositeScore.toFixed(1)}</span>
                                      <a
                                        href="./index.html#breakthrough/${encodeURIComponent(item.id)}"
                                        class="models-drawer__link"
                                      >Dossier →</a>
                                    </div>
                                  </li>
                                `;
                              })
                              .join('')}
                          </ul>
                        </div>
                      `
                      : ''
                  }
                </article>
              `;
            })
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderResultsRegion() {
  const weights = getActiveWeights();
  const allRanked = rankBreakthroughs(dataset.breakthroughs, weights);
  const filteredBreakthroughs = filterBreakthroughsForModels(allRanked);
  const rows = aggregateModelRankings(filteredBreakthroughs, {
    groupBy: state.groupBy,
    attribution: state.attribution,
    sortBy: state.sortBy,
    minBreakthroughs: state.minBreakthroughs,
    search: state.search,
  });

  const pulseEl = document.getElementById('models-pulse-wrap');
  if (pulseEl) {
    pulseEl.innerHTML = renderPulseStrip(rows, filteredBreakthroughs, allRanked);
  }

  const stageEl = document.getElementById('models-results-stage');
  if (stageEl) {
    stageEl.innerHTML = `
      ${renderParadigmStrip(filteredBreakthroughs)}
      ${renderChartsCard(rows)}
      ${renderModelLeaderboard(rows)}
    `;

    const rowMap = new Map(rows.map((r) => [r.id, r]));
    const svg = document.getElementById('models-chart-svg');
    bindModelChartInteractions(svg, rowMap, state, {
      showTooltip,
      hideTooltip,
      onSelectModel: (id) => {
        state.expandedIds.add(id);
        renderResultsRegion();
        const targetEl = document.getElementById(`model-row-${id}`);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      },
    });
  }
}

function renderPage() {
  applyTheme(state.theme);
  syncUrl();

  const weights = getActiveWeights();
  const allRanked = rankBreakthroughs(dataset.breakthroughs, weights);
  const filteredBreakthroughs = filterBreakthroughsForModels(allRanked);
  const rows = aggregateModelRankings(filteredBreakthroughs, {
    groupBy: state.groupBy,
    attribution: state.attribution,
    sortBy: state.sortBy,
    minBreakthroughs: state.minBreakthroughs,
    search: state.search,
  });

  const app = document.getElementById('app');
  app.innerHTML = `
    <header class="site-nav" role="banner">
      <div class="container site-nav__inner">
        <a href="./" class="site-brand">
          <img src="./favicon.svg" alt="" class="site-brand__mark" width="28" height="28" />
          <span class="site-brand__title">The Novum Index</span>
          <span class="site-brand__edition">AI Systems</span>
        </a>
        <nav class="site-nav__actions" aria-label="Site actions">
          <button
            type="button"
            class="nav-btn"
            id="theme-toggle-btn"
            aria-label="Toggle color theme"
            title="Switch between archival paper and obsidian dark mode"
          >
            ${
              state.theme === 'dark'
                ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span>Paper</span>`
                : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span>Dark</span>`
            }
          </button>
          <a href="./" class="nav-btn">
            <span class="nav-submit-full">← Breakthrough Index</span>
            <span class="nav-submit-short">← Index</span>
          </a>
          <a href="./methodology.html" class="nav-btn nav-btn--methodology">Methodology</a>
          <a
            href="${REPO_URL}/issues/new?template=submit-breakthrough.yml"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-btn nav-btn--primary"
          >
            <span class="nav-submit-full">Submit Breakthrough</span>
            <span class="nav-submit-short">Submit</span>
          </a>
        </nav>
      </div>
    </header>

    <section class="hero meth-hero">
      <div class="container">
        <p class="hero__kicker">AI Systems, Neural Nets &amp; Symbolic Provers · 1969–2026 Attribution Ledger</p>
        <h1 class="hero__title meth-hero__title">
          Which AI models and systems are driving the <em>largest</em> scientific impact?
        </h1>
        <p class="hero__lead meth-hero__lead">
          Compare cumulative impact, breakthrough volume, average quality, peak discoveries, formal verification rates, and autonomy across model families, specific neural networks, neuro-symbolic proof agents, research labs, and classical symbolic AIs. Multi-model breakthroughs default to Nature Index–style fractional (<code>1/k</code>) credit so shares always sum cleanly to the exact dataset total.
        </p>

        <div id="models-pulse-wrap">
          ${renderPulseStrip(rows, filteredBreakthroughs, allRanked)}
        </div>
      </div>
    </section>

    <main class="workspace">
      <div class="container">
        ${renderControlsBar(allRanked)}

        <div id="models-results-stage">
          ${renderParadigmStrip(filteredBreakthroughs)}
          ${renderChartsCard(rows)}
          ${renderModelLeaderboard(rows)}
        </div>

        <section class="methodology-callout" aria-labelledby="models-notes-heading">
          <div>
            <p class="hero__kicker" style="margin-bottom: 0.25rem;">Attribution &amp; Accounting Notes</p>
            <h2 id="models-notes-heading" class="methodology-callout__title">How multi-model papers, specialized neural nets, and symbolic provers are credited</h2>
            <p class="methodology-callout__desc">
              <strong>Cumulative Impact</strong> sums each breakthrough’s 4-axis impact score multiplied by its credit share, rewarding both sustained volume and scientific significance. Switch to <strong>Average Impact</strong> or <strong>Peak Breakthrough</strong> to spotlight landmark domain specialists (like AlphaFold 2, RFdiffusion, or EQP) alongside high-volume frontier model lineages. Under <strong>Fractional (1/k)</strong> mode, joint breakthroughs (e.g., GPT-6.2 Astra &amp; Claude Opus 5.5, or Gemini Deep Think &amp; OpenAI at IMO 2025) split credit evenly so totals never double-count.
            </p>
          </div>
          <div class="models-callout-actions">
            <a href="./" class="nav-btn nav-btn--primary">← Breakthrough Index</a>
            <a href="./methodology.html" class="nav-btn">Full Scoring Rubric →</a>
          </div>
        </section>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div>
          <strong>The Novum Index</strong> — AI Systems &amp; Model Attribution · Open-source MIT · Edition ${escapeHtml(dataset.meta.lastUpdated)}
        </div>
        <div class="site-footer__links">
          <a href="./">Breakthrough Index</a>
          <a href="./methodology.html">Methodology</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  `;

  const rowMap = new Map(rows.map((r) => [r.id, r]));
  const svg = document.getElementById('models-chart-svg');
  bindModelChartInteractions(svg, rowMap, state, {
    showTooltip,
    hideTooltip,
    onSelectModel: (id) => {
      state.expandedIds.add(id);
      renderResultsRegion();
      const targetEl = document.getElementById(`model-row-${id}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
  });
}

function attachListeners() {
  const app = document.getElementById('app');

  app.addEventListener('click', (e) => {
    if (e.target.closest('#theme-toggle-btn')) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme, { persist: true });
      renderPage();
      return;
    }

    const groupBtn = e.target.closest('[data-group-by]');
    if (groupBtn) {
      state.groupBy = groupBtn.dataset.groupBy;
      state.expandedIds.clear();
      renderPage();
      return;
    }

    const attrBtn = e.target.closest('[data-attribution]');
    if (attrBtn) {
      state.attribution = attrBtn.dataset.attribution;
      renderPage();
      return;
    }

    const sortBtn = e.target.closest('[data-sort-by]');
    if (sortBtn) {
      state.sortBy = sortBtn.dataset.sortBy;
      renderPage();
      return;
    }

    const chartBtn = e.target.closest('[data-chart-view]');
    if (chartBtn) {
      state.chartView = chartBtn.dataset.chartView;
      renderResultsRegion();
      return;
    }

    const quadYBtn = e.target.closest('[data-quadrant-y]');
    if (quadYBtn) {
      state.quadrantY = quadYBtn.dataset.quadrantY;
      renderResultsRegion();
      return;
    }

    const pBarBtn = e.target.closest('[data-paradigm-bar]');
    if (pBarBtn) {
      state.paradigmBarMetric = pBarBtn.dataset.paradigmBar;
      renderResultsRegion();
      return;
    }

    const toggleParadigmBtn = e.target.closest('[data-toggle-paradigm]');
    if (toggleParadigmBtn) {
      const p = toggleParadigmBtn.dataset.toggleParadigm;
      state.paradigm = state.paradigm === p ? 'all' : p;
      renderPage();
      return;
    }

    if (e.target.closest('#models-min-toggle')) {
      state.minBreakthroughs = state.minBreakthroughs >= 2 ? 1 : 2;
      renderPage();
      return;
    }

    if (e.target.closest('#models-clear-filters')) {
      state.paradigm = 'all';
      state.discipline = 'all';
      state.era = 'all';
      state.minBreakthroughs = 1;
      state.rubricPreset = 'balanced';
      state.search = '';
      renderPage();
      return;
    }

    const expandBtn = e.target.closest('[data-expand-model]');
    if (expandBtn) {
      const id = expandBtn.dataset.expandModel;
      if (state.expandedIds.has(id)) state.expandedIds.delete(id);
      else state.expandedIds.add(id);
      renderResultsRegion();
      return;
    }

    if (e.target.closest('#models-expand-top')) {
      const weights = getActiveWeights();
      const filtered = filterBreakthroughsForModels(
        rankBreakthroughs(dataset.breakthroughs, weights)
      );
      const rows = aggregateModelRankings(filtered, {
        groupBy: state.groupBy,
        attribution: state.attribution,
        sortBy: state.sortBy,
        minBreakthroughs: state.minBreakthroughs,
        search: state.search,
      });
      rows.slice(0, 3).forEach((r) => state.expandedIds.add(r.id));
      renderResultsRegion();
      return;
    }

    if (e.target.closest('#models-collapse-all')) {
      state.expandedIds.clear();
      renderResultsRegion();
    }
  });

  app.addEventListener('change', (e) => {
    if (e.target.id === 'models-filter-discipline') {
      state.discipline = e.target.value;
      renderPage();
    } else if (e.target.id === 'models-filter-paradigm') {
      state.paradigm = e.target.value;
      renderPage();
    } else if (e.target.id === 'models-filter-era') {
      state.era = e.target.value;
      renderPage();
    } else if (e.target.id === 'models-rubric-preset') {
      state.rubricPreset = e.target.value;
      renderPage();
    }
  });

  app.addEventListener('input', (e) => {
    if (e.target.id === 'models-search-input') {
      state.search = e.target.value;
      const clearBtn = document.getElementById('models-clear-filters');
      if (clearBtn) {
        const hasFilters =
          state.paradigm !== 'all' ||
          state.discipline !== 'all' ||
          state.era !== 'all' ||
          state.minBreakthroughs > 1 ||
          state.rubricPreset !== 'balanced' ||
          state.search.trim() !== '';
        clearBtn.hidden = !hasFilters;
      }
      syncUrl();
      renderResultsRegion();
    }
  });
}

hydrateStateFromUrl();
renderPage();
attachListeners();
