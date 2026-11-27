import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import dataset from '../data/breakthroughs.json';
import {
  DIMENSIONS,
  WEIGHT_PRESETS,
  escapeHtml,
  formatDate,
  rankBreakthroughs,
} from './scoring.js';
import { renderHeader } from './components/Header.js';
import { renderFilterBar } from './components/FilterBar.js';
import { renderRubricTuner } from './components/RubricTuner.js';
import { renderLeaderboard } from './components/Leaderboard.js';
import { renderDossierModal } from './components/DossierModal.js';
import {
  renderTimelineScatter,
  bindScatterInteractions,
} from './visualizations/TimelineScatter.js';
import {
  renderVelocityChart,
  bindVelocityInteractions,
} from './visualizations/VelocityChart.js';
import {
  renderLineageGraph,
  bindLineageInteractions,
} from './visualizations/LineageGraph.js';
import {
  loadInitialTheme,
  applyTheme,
  subscribeThemeSync,
} from './theme.js';

const REPO_URL = 'https://github.com/bob138/novum-index';
const DEFAULT_WEIGHTS = { ...dataset.meta.defaultWeights };

const state = {
  theme: loadInitialTheme(),
  view: 'leaderboard',
  tunerOpen: false,
  mobileFiltersOpen: false,
  discipline: 'all',
  paradigm: 'all',
  aiRole: 'all',
  status: 'all',
  year: 'all',
  sortBy: 'impact',
  search: '',
  weights: { ...DEFAULT_WEIGHTS },
  activeDossierId: null,
  scatter: {
    preset: 'all',
    timeScale: 'split',
    yMode: 'auto',
    yMetric: 'composite',
    interactionMode: 'zoom',
    customZoom: null,
  },
  velocity: {
    groupBy: 'paradigm',
    granularity: 'default',
    barMode: 'count',
    yScale: 'linear',
    curveMetric: 'count',
  },
  lineage: {
    chainDepth: 'full',
    scope: 'hubs',
  },
};

let toastTimer = null;

function isCustomWeights(weights) {
  return DIMENSIONS.some(
    (d) => Math.round(weights[d.key]) !== Math.round(DEFAULT_WEIGHTS[d.key])
  );
}

function hydrateStateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const viewParam = params.get('view');
  if (['leaderboard', 'timeline', 'velocity', 'lineage'].includes(viewParam)) {
    state.view = viewParam;
  }

  const wParam = params.get('w');
  if (wParam) {
    const parts = wParam.split(',').map((n) => Number(n));
    if (parts.length === 4 && parts.every((n) => Number.isFinite(n) && n >= 0 && n <= 100)) {
      state.weights = {
        foundational: parts[0],
        ripple: parts[1],
        verification: parts[2],
        velocity: parts[3],
      };
      if (isCustomWeights(state.weights)) {
        state.tunerOpen = true;
      }
    }
  }

  const discParam = params.get('discipline');
  if (discParam) state.discipline = discParam;

  const paradigmParam = params.get('paradigm');
  if (
    ['modern', 'Neural / Deep Learning', 'Neuro-Symbolic', 'Symbolic / Classical'].includes(
      paradigmParam
    )
  ) {
    state.paradigm = paradigmParam;
  }

  const sortParam = params.get('sort');
  if (['impact', 'newest', 'oldest'].includes(sortParam)) {
    state.sortBy = sortParam;
  }

  const hash = window.location.hash;
  if (hash.startsWith('#breakthrough/')) {
    const id = decodeURIComponent(hash.slice('#breakthrough/'.length));
    if (dataset.breakthroughs.some((b) => b.id === id)) {
      state.activeDossierId = id;
    }
  }
}

function syncUrl() {
  const url = new URL(window.location.href);
  if (state.view !== 'leaderboard') {
    url.searchParams.set('view', state.view);
  } else {
    url.searchParams.delete('view');
  }

  if (isCustomWeights(state.weights)) {
    url.searchParams.set(
      'w',
      DIMENSIONS.map((d) => Math.round(state.weights[d.key])).join(',')
    );
  } else {
    url.searchParams.delete('w');
  }

  if (state.discipline !== 'all') {
    url.searchParams.set('discipline', state.discipline);
  } else {
    url.searchParams.delete('discipline');
  }

  if (state.paradigm !== 'all') {
    url.searchParams.set('paradigm', state.paradigm);
  } else {
    url.searchParams.delete('paradigm');
  }

  if (state.sortBy !== 'impact') {
    url.searchParams.set('sort', state.sortBy);
  } else {
    url.searchParams.delete('sort');
  }

  if (state.activeDossierId) {
    url.hash = `#breakthrough/${encodeURIComponent(state.activeDossierId)}`;
  } else if (url.hash.startsWith('#breakthrough/')) {
    url.hash = '';
  }

  try {
    window.history.replaceState(null, '', url.toString());
  } catch {
    // Ignore SecurityError in sandboxed/file:// preview contexts
  }
}

function filterBreakthroughs(ranked) {
  const q = state.search.trim().toLowerCase();
  const filtered = ranked.filter((item) => {
    if (state.discipline !== 'all' && item.discipline !== state.discipline) return false;
    if (state.paradigm === 'modern' && item.aiParadigm === 'Symbolic / Classical') return false;
    if (
      state.paradigm !== 'all' &&
      state.paradigm !== 'modern' &&
      item.aiParadigm !== state.paradigm
    ) {
      return false;
    }
    if (state.aiRole !== 'all' && item.aiRole !== state.aiRole) return false;
    if (state.status !== 'all' && item.verificationStatus !== state.status) return false;
    if (state.year === 'pre-2020' && item.date >= '2020-01-01') return false;
    if (state.year === 'anchors' && (item.date < '2020-01-01' || item.date >= '2024-01-01')) {
      return false;
    }
    if (state.year === '2024-2026' && item.date < '2024-01-01') return false;
    if (
      state.year !== 'all' &&
      state.year !== 'pre-2020' &&
      state.year !== 'anchors' &&
      state.year !== '2024-2026' &&
      !item.date.startsWith(state.year)
    ) {
      return false;
    }

    if (q) {
      const haystack = [
        item.title,
        item.shortTitle,
        item.discipline,
        item.whyItMatters,
        item.summary,
        item.aiRole,
        item.aiParadigm || '',
        item.aiSystem || '',
        ...item.subfields,
        ...item.contributors,
        ...item.institutions,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  if (state.sortBy === 'newest') {
    return [...filtered].sort(
      (a, b) => b.date.localeCompare(a.date) || b.compositeScore - a.compositeScore
    );
  }
  if (state.sortBy === 'oldest') {
    return [...filtered].sort(
      (a, b) => a.date.localeCompare(b.date) || b.compositeScore - a.compositeScore
    );
  }
  return filtered;
}

function renderMethodologyFooter() {
  return `
    <section class="methodology-callout" aria-labelledby="methodology-callout-heading">
      <div>
        <p class="hero__kicker" style="margin-bottom: 0.25rem;">Open Methodology &amp; Epistemic Rigor</p>
        <h2 id="methodology-callout-heading" class="methodology-callout__title">How breakthroughs are vetted, classified by AI paradigm, and scored</h2>
        <p class="methodology-callout__desc">
          Inspect the full 4-axis impact rubric, verification tiers, Symbolic vs. Neural vs. Neuro-Symbolic taxonomy, Human Years Unsolved accounting, and calibration anchors.
        </p>
      </div>
      <a href="./methodology.html" class="nav-btn nav-btn--primary methodology-callout__cta">Read Full Methodology →</a>
    </section>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div>
          <strong>The Novum Index</strong> · Open-source AI-for-science ledger (MIT License) · Updated ${escapeHtml(dataset.meta.lastUpdated)}
        </div>
        <div class="site-footer__links">
          <a href="./models.html">AI Systems &amp; Models</a>
          <a href="./methodology.html">Full Methodology</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          <a href="${REPO_URL}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute Data</a>
          <a href="${REPO_URL}/issues/new?template=submit-breakthrough.yml" target="_blank" rel="noopener noreferrer">Submit Breakthrough</a>
        </div>
      </div>
    </footer>
  `;
}

function showToast(message) {
  let el = document.getElementById('novum-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'novum-toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('toast--visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove('toast--visible');
  }, 2600);
}

async function copyToClipboard(text, successMsg) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    showToast('Copy failed — you can copy the URL directly from your address bar.');
  }
}

function ensureTooltip() {
  let tip = document.getElementById('viz-tooltip');
  if (!tip) {
    tip = document.createElement('div');
    tip.id = 'viz-tooltip';
    tip.className = 'viz-tooltip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
  }
  return tip;
}

function hideTooltip() {
  const tip = document.getElementById('viz-tooltip');
  if (tip) tip.classList.remove('viz-tooltip--visible');
}

function showTooltip(ev, html) {
  const tip = ensureTooltip();
  tip.innerHTML = html;
  tip.classList.add('viz-tooltip--visible');
  const tipW = tip.offsetWidth || 290;
  const tipH = tip.offsetHeight || 110;
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

function bindActiveViewInteractions(filtered, rankedMap) {
  if (state.view === 'timeline') {
    bindScatterInteractions(
      document.getElementById('timeline-scatter-svg'),
      filtered,
      rankedMap,
      state.scatter,
      {
        showTooltip,
        hideTooltip,
        onZoomChange: (zoomBox) => {
          state.scatter.customZoom = zoomBox;
          renderResultsOnly();
        },
        onReset: () => {
          state.scatter.customZoom = null;
          state.scatter.preset = 'all';
          renderResultsOnly();
        },
      }
    );
  } else if (state.view === 'velocity') {
    bindVelocityInteractions(
      document.getElementById('velocity-chart-svg'),
      filtered,
      state.velocity,
      { showTooltip, hideTooltip }
    );
  } else if (state.view === 'lineage') {
    bindLineageInteractions(document.getElementById('lineage-graph-svg'), rankedMap, {
      showTooltip,
      hideTooltip,
    });
  }
}

function renderActiveView(filtered, allRanked) {
  switch (state.view) {
    case 'timeline':
      return renderTimelineScatter(filtered, state.scatter);
    case 'velocity':
      return renderVelocityChart(filtered, state.velocity);
    case 'lineage':
      return renderLineageGraph(filtered, allRanked, state.lineage);
    case 'leaderboard':
    default:
      return renderLeaderboard(filtered, allRanked.length, state.sortBy);
  }
}

function renderApp({ preserveSearchFocus = false } = {}) {
  applyTheme(state.theme);
  syncUrl();
  hideTooltip();

  const searchSelStart = preserveSearchFocus
    ? document.getElementById('search-input')?.selectionStart
    : null;

  const allRanked = rankBreakthroughs(dataset.breakthroughs, state.weights);
  const filtered = filterBreakthroughs(allRanked);
  const rankedMap = new Map(allRanked.map((b) => [b.id, b]));
  const activeDossier = state.activeDossierId ? rankedMap.get(state.activeDossierId) : null;

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader(dataset.meta, allRanked, state.theme)}

    <main class="workspace">
      <div class="container">
        ${renderFilterBar(state, allRanked, isCustomWeights(state.weights))}
        ${renderRubricTuner(state.weights, state.tunerOpen)}

        <div id="view-stage">
          ${renderActiveView(filtered, allRanked)}
        </div>

        ${renderMethodologyFooter()}
      </div>
    </main>

    ${renderDossierModal(activeDossier, allRanked, state.weights, filtered)}
  `;

  // Bind dynamic SVG interactions
  bindActiveViewInteractions(filtered, rankedMap);

  // Restore search focus smoothly during typing
  if (preserveSearchFocus) {
    const input = document.getElementById('search-input');
    if (input) {
      input.focus();
      if (typeof searchSelStart === 'number') {
        input.setSelectionRange(searchSelStart, searchSelStart);
      }
    }
  }

  // Lock body scroll when dossier drawer is open
  document.body.style.overflow = activeDossier ? 'hidden' : '';
}

function renderResultsOnly() {
  syncUrl();
  hideTooltip();
  const allRanked = rankBreakthroughs(dataset.breakthroughs, state.weights);
  const filtered = filterBreakthroughs(allRanked);
  const rankedMap = new Map(allRanked.map((b) => [b.id, b]));

  const stage = document.getElementById('view-stage');
  if (stage) {
    stage.innerHTML = renderActiveView(filtered, allRanked);
    bindActiveViewInteractions(filtered, rankedMap);
  }
}

function attachGlobalListeners() {
  const app = document.getElementById('app');

  app.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle-btn');
    if (themeBtn) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(state.theme, { persist: true });
      renderApp();
      return;
    }

    const tabBtn = e.target.closest('[data-view]');
    if (tabBtn) {
      state.view = tabBtn.dataset.view;
      renderApp();
      return;
    }

    const tunerBtn = e.target.closest('#tuner-toggle-btn');
    if (tunerBtn) {
      state.tunerOpen = !state.tunerOpen;
      renderApp();
      return;
    }

    const mobileFiltersBtn = e.target.closest('#mobile-filters-toggle-btn');
    if (mobileFiltersBtn) {
      state.mobileFiltersOpen = !state.mobileFiltersOpen;
      renderApp();
      return;
    }

    const discBtn = e.target.closest('[data-discipline]');
    if (discBtn) {
      state.discipline = discBtn.dataset.discipline;
      renderApp();
      return;
    }

    const clearBtn = e.target.closest('#clear-filters-btn');
    if (clearBtn) {
      state.discipline = 'all';
      state.paradigm = 'all';
      state.aiRole = 'all';
      state.status = 'all';
      state.year = 'all';
      state.sortBy = 'impact';
      state.search = '';
      state.scatter.customZoom = null;
      state.scatter.preset = 'all';
      renderApp();
      return;
    }

    const presetBtn = e.target.closest('[data-preset]');
    if (presetBtn) {
      const preset = WEIGHT_PRESETS.find((p) => p.id === presetBtn.dataset.preset);
      if (preset) {
        state.weights = { ...preset.weights };
        renderApp();
        showToast(`Applied "${preset.label}" rubric weights`);
      }
      return;
    }

    const copyRubricBtn = e.target.closest('#copy-rubric-link-btn');
    if (copyRubricBtn) {
      syncUrl();
      copyToClipboard(
        window.location.href,
        'Copied shareable link with your active rubric weights'
      );
      return;
    }

    // Impact × Time Scatter controls
    const scatterPresetBtn = e.target.closest('[data-scatter-preset]');
    if (scatterPresetBtn) {
      state.scatter.preset = scatterPresetBtn.dataset.scatterPreset;
      state.scatter.customZoom = null;
      renderResultsOnly();
      return;
    }

    const scatterScaleBtn = e.target.closest('[data-scatter-timescale]');
    if (scatterScaleBtn) {
      state.scatter.timeScale = scatterScaleBtn.dataset.scatterTimescale;
      state.scatter.preset = 'all';
      state.scatter.customZoom = null;
      renderResultsOnly();
      return;
    }

    const scatterYModeBtn = e.target.closest('[data-scatter-ymode]');
    if (scatterYModeBtn) {
      state.scatter.yMode = scatterYModeBtn.dataset.scatterYmode;
      if (state.scatter.customZoom) {
        state.scatter.customZoom = {
          tMin: state.scatter.customZoom.tMin,
          tMax: state.scatter.customZoom.tMax,
          yMin: state.scatter.yMode === 'full' ? 0 : undefined,
          yMax: state.scatter.yMode === 'full' ? 100 : undefined,
        };
      }
      renderResultsOnly();
      return;
    }

    const scatterModeBtn = e.target.closest('[data-scatter-mode]');
    if (scatterModeBtn) {
      state.scatter.interactionMode = scatterModeBtn.dataset.scatterMode;
      renderResultsOnly();
      return;
    }

    const scatterZoomBtn = e.target.closest('[data-scatter-zoom]');
    if (scatterZoomBtn) {
      const action = scatterZoomBtn.dataset.scatterZoom;
      if (action === 'reset') {
        state.scatter.customZoom = null;
        state.scatter.preset = 'all';
        renderResultsOnly();
        return;
      }
      const svg = document.getElementById('timeline-scatter-svg');
      if (svg) {
        const isSplit = svg.dataset.splitMode === '1';
        const curTMin = isSplit && action === 'in'
          ? Date.parse('2013-01-01T00:00:00Z')
          : Number(svg.dataset.tMin);
        const curTMax = Number(svg.dataset.tMax);
        const curYMin = Number(svg.dataset.yMin);
        const curYMax = Number(svg.dataset.yMax);
        const factor = action === 'in' ? 1 / 1.55 : 1.55;
        const midT = (curTMin + curTMax) / 2;
        const midY = (curYMin + curYMax) / 2;
        const newHalfT = Math.max(86400000 * 5, ((curTMax - curTMin) * factor) / 2);
        const newHalfY = Math.max(3, Math.min(50, ((curYMax - curYMin) * factor) / 2));

        const minBound = Date.parse('1966-01-01T00:00:00Z');
        const maxBound = Date.parse('2027-02-01T00:00:00Z');
        const fullModernSpan = Date.parse('2026-12-20T00:00:00Z') - Date.parse('2013-01-01T00:00:00Z');

        if (action === 'out' && newHalfT * 2 >= fullModernSpan * 0.96 && newHalfY * 2 >= 26) {
          state.scatter.customZoom = null;
          state.scatter.preset = 'all';
        } else {
          state.scatter.customZoom = {
            tMin: Math.max(minBound, midT - newHalfT),
            tMax: Math.min(maxBound, midT + newHalfT),
            yMin: Math.max(0, Math.floor(midY - newHalfY)),
            yMax: Math.min(100, Math.ceil(midY + newHalfY)),
          };
        }
        renderResultsOnly();
      }
      return;
    }

    // Acceleration Curve controls
    const velBtn = e.target.closest('[data-velocity-group]');
    if (velBtn) {
      state.velocity.groupBy = velBtn.dataset.velocityGroup;
      renderResultsOnly();
      return;
    }

    const velBarBtn = e.target.closest('[data-velocity-barmode]');
    if (velBarBtn) {
      state.velocity.barMode = velBarBtn.dataset.velocityBarmode;
      renderResultsOnly();
      return;
    }

    const velGranBtn = e.target.closest('[data-velocity-granularity]');
    if (velGranBtn) {
      state.velocity.granularity = velGranBtn.dataset.velocityGranularity;
      renderResultsOnly();
      return;
    }

    const velScaleBtn = e.target.closest('[data-velocity-scale]');
    if (velScaleBtn) {
      state.velocity.yScale = velScaleBtn.dataset.velocityScale;
      renderResultsOnly();
      return;
    }

    const velCurveBtn = e.target.closest('[data-velocity-curve]');
    if (velCurveBtn) {
      state.velocity.curveMetric = velCurveBtn.dataset.velocityCurve;
      renderResultsOnly();
      return;
    }

    // Lineage Graph controls
    const lineageScopeBtn = e.target.closest('[data-lineage-scope]');
    if (lineageScopeBtn) {
      state.lineage.scope = lineageScopeBtn.dataset.lineageScope;
      renderResultsOnly();
      return;
    }

    const lineageDepthBtn = e.target.closest('[data-lineage-depth]');
    if (lineageDepthBtn) {
      state.lineage.chainDepth = lineageDepthBtn.dataset.lineageDepth;
      renderResultsOnly();
      return;
    }

    const shareBtn = e.target.closest('#dossier-share-btn');
    if (shareBtn) {
      const id = shareBtn.dataset.shareId;
      const item = dataset.breakthroughs.find((b) => b.id === id);
      syncUrl();
      const snippet = item
        ? `${item.title} — ${item.whyItMatters} ${window.location.href}`
        : window.location.href;
      copyToClipboard(snippet, 'Copied breakthrough link & summary for sharing');
      return;
    }

    const closeBtn = e.target.closest('#dossier-close-btn');
    if (closeBtn || e.target.id === 'dossier-backdrop') {
      state.activeDossierId = null;
      renderApp();
      return;
    }

    const openTrigger = e.target.closest('[data-open-dossier]');
    if (openTrigger) {
      const parentSvg = openTrigger.closest('svg');
      if (parentSvg && parentSvg.dataset.justDragged === '1') {
        return;
      }
      state.activeDossierId = openTrigger.dataset.openDossier;
      renderApp();
    }
  });

  app.addEventListener('change', (e) => {
    if (e.target.id === 'filter-paradigm') {
      state.paradigm = e.target.value;
      renderApp();
    } else if (e.target.id === 'filter-ai-role') {
      state.aiRole = e.target.value;
      renderApp();
    } else if (e.target.id === 'filter-status') {
      state.status = e.target.value;
      renderApp();
    } else if (e.target.id === 'filter-year') {
      state.year = e.target.value;
      renderApp();
    } else if (e.target.id === 'sort-by') {
      state.sortBy = e.target.value;
      renderApp();
    } else if (e.target.id === 'scatter-y-metric') {
      state.scatter.yMetric = e.target.value;
      if (state.scatter.customZoom) {
        state.scatter.customZoom = {
          tMin: state.scatter.customZoom.tMin,
          tMax: state.scatter.customZoom.tMax,
        };
      }
      renderResultsOnly();
    }
  });

  app.addEventListener('input', (e) => {
    if (e.target.id === 'search-input') {
      state.search = e.target.value;
      renderApp({ preserveSearchFocus: true });
      return;
    }

    if (e.target.matches('[data-weight-key]')) {
      const key = e.target.dataset.weightKey;
      state.weights[key] = Number(e.target.value);

      // Update live normalized percentage labels without destroying slider drag focus
      const total = DIMENSIONS.reduce((s, d) => s + Math.max(0, state.weights[d.key]), 0);
      for (const d of DIMENSIONS) {
        const lbl = document.getElementById(`weight-val-${d.key}`);
        if (lbl) {
          const pct = total > 0 ? Math.round((state.weights[d.key] / total) * 100) : 25;
          lbl.textContent = `${pct}%`;
        }
      }
      renderResultsOnly();
    }
  });

  // Keyboard shortcuts: Escape closes dossier, ←/→ steps dossiers, '/' focuses search, Enter/Space activates SVG nodes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.activeDossierId) {
      state.activeDossierId = null;
      renderApp();
      return;
    }

    if (
      state.activeDossierId &&
      (e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      document.activeElement?.tagName !== 'INPUT' &&
      document.activeElement?.tagName !== 'TEXTAREA' &&
      document.activeElement?.tagName !== 'SELECT'
    ) {
      const btn = document.getElementById(
        e.key === 'ArrowLeft' ? 'dossier-prev-btn' : 'dossier-next-btn'
      );
      const nextId = btn?.dataset?.openDossier;
      if (nextId) {
        e.preventDefault();
        state.activeDossierId = nextId;
        renderApp();
        const dialog = document.getElementById('dossier-dialog');
        if (dialog) dialog.scrollTop = 0;
      }
      return;
    }

    if (
      e.key === '/' &&
      !state.activeDossierId &&
      document.activeElement?.tagName !== 'INPUT' &&
      document.activeElement?.tagName !== 'TEXTAREA'
    ) {
      const input = document.getElementById('search-input');
      if (input) {
        e.preventDefault();
        input.focus();
      }
      return;
    }

    if (
      (e.key === 'Enter' || e.key === ' ') &&
      document.activeElement?.hasAttribute('data-open-dossier') &&
      document.activeElement.tagName !== 'BUTTON'
    ) {
      e.preventDefault();
      state.activeDossierId = document.activeElement.dataset.openDossier;
      renderApp();
    }
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash.startsWith('#breakthrough/')) {
      const id = decodeURIComponent(hash.slice('#breakthrough/'.length));
      if (dataset.breakthroughs.some((b) => b.id === id) && state.activeDossierId !== id) {
        state.activeDossierId = id;
        renderApp();
      }
    } else if (state.activeDossierId) {
      state.activeDossierId = null;
      renderApp();
    }
  });

  subscribeThemeSync((nextTheme) => {
    if (nextTheme === state.theme) return;
    state.theme = nextTheme;
    renderApp();
  });
}

hydrateStateFromUrl();
attachGlobalListeners();
renderApp();
