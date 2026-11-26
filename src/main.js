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
import { renderLeaderboard, renderStatusBadge } from './components/Leaderboard.js';
import { renderDossierModal } from './components/DossierModal.js';
import { renderTimelineScatter } from './visualizations/TimelineScatter.js';
import { renderVelocityChart } from './visualizations/VelocityChart.js';
import {
  renderLineageGraph,
  bindLineageInteractions,
} from './visualizations/LineageGraph.js';

const REPO_URL = 'https://github.com/bob138/frontier-index';
const DEFAULT_WEIGHTS = { ...dataset.meta.defaultWeights };

const state = {
  theme: loadInitialTheme(),
  view: 'leaderboard',
  velocityGroup: 'aiRole',
  tunerOpen: false,
  discipline: 'all',
  aiRole: 'all',
  status: 'all',
  year: 'all',
  sortBy: 'impact',
  search: '',
  weights: { ...DEFAULT_WEIGHTS },
  activeDossierId: null,
};

let toastTimer = null;

function loadInitialTheme() {
  try {
    const saved = localStorage.getItem('frontier-index-theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // ignore storage errors
  }
  return 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('frontier-index-theme', theme);
  } catch {
    // ignore
  }
}

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
    if (state.aiRole !== 'all' && item.aiRole !== state.aiRole) return false;
    if (state.status !== 'all' && item.verificationStatus !== state.status) return false;
    if (state.year === 'anchors' && !item.isAnchor) return false;
    if (state.year === '2024-2026' && item.isAnchor) return false;
    if (
      state.year !== 'all' &&
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
    <section class="methodology-band" id="methodology" aria-labelledby="methodology-heading">
      <div class="methodology-band__grid">
        <div>
          <p class="hero__kicker" style="margin-bottom: 0.45rem;">Open Methodology &amp; Epistemic Rigor</p>
          <h2 id="methodology-heading">Tracking the AI acceleration curve—from Nature papers to X &amp; GitHub</h2>
          <p style="margin-bottom: 0.9rem;">
            <strong>The Frontier Index</strong> exclusively tracks AI-assisted and AI-led breakthroughs across Mathematics, Computer Science, Physics, Biology, and Materials to visualize the rate at which AI expands human knowledge. Because frontier discoveries now land on GitHub, arXiv, and X months before journal publication, we include unrefereed and Lean-verified open-internet results alongside peer-reviewed landmarks—tagged with explicit verification tiers so readers never confuse a preprint with a certified theorem.
          </p>
          <p>
            Every entry lives in a single schema-validated JSON file (<code>data/breakthroughs.json</code>) scored across <strong>Foundational Depth</strong>, <strong>Cross-Field Ripple</strong>, <strong>Verification &amp; Rigor</strong>, and <strong>Discovery Velocity</strong>. Open a PR or GitHub issue anytime to log a newly posted AI breakthrough or update an entry’s audit status.
          </p>
        </div>

        <div class="methodology-tiers">
          <div class="methodology-tier">
            ${renderStatusBadge('Formally Verified')}
            <span>Machine-checked formal proof or verified artifact (e.g., Lean 4 / Mathlib kernel or exact algebraic verifier).</span>
          </div>
          <div class="methodology-tier">
            ${renderStatusBadge('Peer-Reviewed')}
            <span>Published in a refereed venue (e.g., Nature, PNAS), officially graded, or independently verified by domain specialists.</span>
          </div>
          <div class="methodology-tier">
            ${renderStatusBadge('Preprint / Active Review')}
            <span>Credible preprint, GitHub release, or social-media announcement currently undergoing independent expert audit.</span>
          </div>
          <div class="methodology-tier">
            ${renderStatusBadge('Contested / Partial')}
            <span>Notable AI result with active community controversy over scope, priority, or framing—explicitly documented.</span>
          </div>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div>
          <strong>The Frontier Index</strong> · Open-source scientific breakthrough ledger (MIT License) · Updated ${escapeHtml(dataset.meta.lastUpdated)}
        </div>
        <div class="site-footer__links">
          <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          <a href="${REPO_URL}/blob/main/METHODOLOGY.md" target="_blank" rel="noopener noreferrer">Rubric Documentation</a>
          <a href="${REPO_URL}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute Data</a>
          <a href="${REPO_URL}/issues/new?template=submit-breakthrough.yml" target="_blank" rel="noopener noreferrer">Submit Breakthrough</a>
        </div>
      </div>
    </footer>
  `;
}

function showToast(message) {
  let el = document.getElementById('frontier-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'frontier-toast';
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

function bindScatterTooltips(rankedMap) {
  const svg = document.getElementById('timeline-scatter-svg');
  if (!svg) return;
  const tip = ensureTooltip();

  svg.querySelectorAll('[data-tooltip-id]').forEach((node) => {
    const show = (ev) => {
      const item = rankedMap.get(node.dataset.tooltipId);
      if (!item) return;
      tip.innerHTML = `
        <div class="viz-tooltip__title">${escapeHtml(item.title)}</div>
        <div class="viz-tooltip__meta">${escapeHtml(item.discipline)} · ${formatDate(item.date)} · ${escapeHtml(item.verificationStatus)}</div>
        <div>
          <span class="viz-tooltip__score">Impact ${item.compositeScore.toFixed(1)}/100</span>
          · ${escapeHtml(item.aiRole)}${item.aiSystem ? ` (${escapeHtml(item.aiSystem)})` : ''}
        </div>
      `;
      const x = Math.min(window.innerWidth - 320, Math.max(12, ev.clientX + 14));
      const y = Math.min(window.innerHeight - 130, Math.max(12, ev.clientY - 12));
      tip.style.left = `${x}px`;
      tip.style.top = `${y}px`;
      tip.classList.add('viz-tooltip--visible');
    };

    node.addEventListener('mouseenter', show);
    node.addEventListener('mousemove', show);
    node.addEventListener('mouseleave', hideTooltip);
  });
}

function renderActiveView(filtered, allRanked) {
  switch (state.view) {
    case 'timeline':
      return renderTimelineScatter(filtered);
    case 'velocity':
      return renderVelocityChart(filtered, state.velocityGroup);
    case 'lineage':
      return renderLineageGraph(filtered, allRanked);
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

    ${renderDossierModal(activeDossier, allRanked, state.weights)}
  `;

  // Bind dynamic SVG interactions
  if (state.view === 'timeline') {
    bindScatterTooltips(rankedMap);
  } else if (state.view === 'lineage') {
    bindLineageInteractions(document.getElementById('lineage-graph-svg'));
  }

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
    if (state.view === 'timeline') {
      bindScatterTooltips(rankedMap);
    } else if (state.view === 'lineage') {
      bindLineageInteractions(document.getElementById('lineage-graph-svg'));
    }
  }
}

function attachGlobalListeners() {
  const app = document.getElementById('app');

  app.addEventListener('click', (e) => {
    const themeBtn = e.target.closest('#theme-toggle-btn');
    if (themeBtn) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
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

    const discBtn = e.target.closest('[data-discipline]');
    if (discBtn) {
      state.discipline = discBtn.dataset.discipline;
      renderApp();
      return;
    }

    const clearBtn = e.target.closest('#clear-filters-btn');
    if (clearBtn) {
      state.discipline = 'all';
      state.aiRole = 'all';
      state.status = 'all';
      state.year = 'all';
      state.sortBy = 'impact';
      state.search = '';
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

    const velBtn = e.target.closest('[data-velocity-group]');
    if (velBtn) {
      state.velocityGroup = velBtn.dataset.velocityGroup;
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
      state.activeDossierId = openTrigger.dataset.openDossier;
      renderApp();
    }
  });

  app.addEventListener('change', (e) => {
    if (e.target.id === 'filter-ai-role') {
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

  // Keyboard shortcuts: Escape closes dossier, '/' focuses search, Enter/Space activates SVG nodes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.activeDossierId) {
      state.activeDossierId = null;
      renderApp();
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
}

hydrateStateFromUrl();
attachGlobalListeners();
renderApp();
