import { DISCIPLINE_META, escapeHtml } from '../scoring.js';

const VIEWS = [
  {
    id: 'leaderboard',
    label: 'Impact Index',
    icon: `<svg class="view-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  },
  {
    id: 'timeline',
    label: 'Impact × Time Map',
    icon: `<svg class="view-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="15.5" r="2.5"/><circle cx="15" cy="9" r="3"/><circle cx="19" cy="16" r="2"/><path d="M3 3v18h18"/></svg>`,
  },
  {
    id: 'velocity',
    label: 'Acceleration Curve',
    icon: `<svg class="view-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  },
  {
    id: 'lineage',
    label: 'Influence Graph',
    icon: `<svg class="view-tab__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="7.5" y1="7.5" x2="10.5" y2="15.5"/><line x1="16.5" y1="7.5" x2="13.5" y2="15.5"/></svg>`,
  },
];

export function renderFilterBar(state, allItems, isCustomWeights) {
  const countsByDisc = {};
  for (const item of allItems) {
    countsByDisc[item.discipline] = (countsByDisc[item.discipline] || 0) + 1;
  }

  const hasFilters =
    state.discipline !== 'all' ||
    state.paradigm !== 'all' ||
    state.aiRole !== 'all' ||
    state.status !== 'all' ||
    state.year !== 'all' ||
    state.sortBy !== 'impact' ||
    state.search.trim() !== '';

  return `
    <div class="controls-bar">
      <div class="controls-bar__top">
        <div class="view-tabs" role="tablist" aria-label="Index views">
          ${VIEWS.map(
            (v) => `
            <button
              type="button"
              role="tab"
              class="view-tab"
              id="tab-${v.id}"
              data-view="${v.id}"
              aria-selected="${state.view === v.id ? 'true' : 'false'}"
            >
              ${v.icon}
              <span>${v.label}</span>
            </button>
          `
          ).join('')}
        </div>

        <div class="controls-bar__right">
          <button
            type="button"
            class="tuner-toggle"
            id="tuner-toggle-btn"
            aria-expanded="${state.tunerOpen ? 'true' : 'false'}"
            aria-controls="rubric-tuner-panel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
            <span>Tune Ranking Weights</span>
            ${isCustomWeights ? '<span class="tuner-toggle__dot" title="Custom weights active"></span>' : ''}
          </button>
        </div>
      </div>

      <div class="discipline-pills" role="group" aria-label="Filter by discipline">
        <button
          type="button"
          class="disc-pill"
          id="filter-disc-all"
          data-discipline="all"
          aria-pressed="${state.discipline === 'all' ? 'true' : 'false'}"
        >
          <span>All Fields</span>
          <span class="disc-pill__count">${allItems.length}</span>
        </button>
        ${Object.entries(DISCIPLINE_META)
          .map(
            ([name, meta]) => `
          <button
            type="button"
            class="disc-pill"
            id="filter-disc-${meta.key}"
            data-discipline="${escapeHtml(name)}"
            aria-pressed="${state.discipline === name ? 'true' : 'false'}"
          >
            <span class="disc-pill__swatch" style="background: ${meta.colorVar};"></span>
            <span>${escapeHtml(name)}</span>
            <span class="disc-pill__count">${countsByDisc[name] || 0}</span>
          </button>
        `
          )
          .join('')}
      </div>

      <div class="filter-row">
        <div class="search-box">
          <svg class="search-box__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="search"
            id="search-input"
            class="search-box__input"
            placeholder="Search breakthroughs, conjectures, authors, AI models..."
            value="${escapeHtml(state.search)}"
            aria-label="Search breakthroughs"
          />
          <span class="search-box__kbd" aria-hidden="true">/</span>
        </div>

        <select id="filter-paradigm" class="filter-select" aria-label="Filter by AI paradigm">
          <option value="all" ${state.paradigm === 'all' ? 'selected' : ''}>All Paradigms</option>
          <option value="modern" ${state.paradigm === 'modern' ? 'selected' : ''}>Neural &amp; Hybrid (2020+)</option>
          <option value="Neural / Deep Learning" ${state.paradigm === 'Neural / Deep Learning' ? 'selected' : ''}>Neural / Deep Learning</option>
          <option value="Neuro-Symbolic" ${state.paradigm === 'Neuro-Symbolic' ? 'selected' : ''}>Neuro-Symbolic</option>
          <option value="Symbolic / Classical" ${state.paradigm === 'Symbolic / Classical' ? 'selected' : ''}>Symbolic (&lt;2020)</option>
        </select>

        <select id="filter-ai-role" class="filter-select" aria-label="Filter by AI role">
          <option value="all" ${state.aiRole === 'all' ? 'selected' : ''}>All AI Roles</option>
          <option value="Autonomous AI" ${state.aiRole === 'Autonomous AI' ? 'selected' : ''}>Autonomous AI</option>
          <option value="AI-Assisted" ${state.aiRole === 'AI-Assisted' ? 'selected' : ''}>AI-Assisted</option>
        </select>

        <select id="filter-status" class="filter-select" aria-label="Filter by verification status">
          <option value="all" ${state.status === 'all' ? 'selected' : ''}>All Verification</option>
          <option value="Formally Verified" ${state.status === 'Formally Verified' ? 'selected' : ''}>Formally Verified</option>
          <option value="Peer-Reviewed" ${state.status === 'Peer-Reviewed' ? 'selected' : ''}>Peer-Reviewed</option>
          <option value="Preprint / Active Review" ${state.status === 'Preprint / Active Review' ? 'selected' : ''}>Active Review</option>
          <option value="Contested / Partial" ${state.status === 'Contested / Partial' ? 'selected' : ''}>Contested / Partial</option>
        </select>

        <select id="filter-year" class="filter-select" aria-label="Filter by timeframe">
          <option value="all" ${state.year === 'all' ? 'selected' : ''}>All (1996–2026)</option>
          <option value="2024-2026" ${state.year === '2024-2026' ? 'selected' : ''}>2024–2026 Wave</option>
          <option value="anchors" ${state.year === 'anchors' ? 'selected' : ''}>2020–2023 Early Neural</option>
          <option value="pre-2020" ${state.year === 'pre-2020' ? 'selected' : ''}>Pre-2020 Symbolic</option>
          <option value="2026" ${state.year === '2026' ? 'selected' : ''}>2026 Only</option>
          <option value="2025" ${state.year === '2025' ? 'selected' : ''}>2025 Only</option>
          <option value="2024" ${state.year === '2024' ? 'selected' : ''}>2024 Only</option>
        </select>

        <select id="sort-by" class="filter-select" aria-label="Sort breakthroughs">
          <option value="impact" ${state.sortBy === 'impact' ? 'selected' : ''}>Sort: Impact</option>
          <option value="newest" ${state.sortBy === 'newest' ? 'selected' : ''}>Sort: Most Recent</option>
          <option value="oldest" ${state.sortBy === 'oldest' ? 'selected' : ''}>Sort: Chronological</option>
        </select>

        ${
          hasFilters
            ? `<button type="button" class="filter-clear" id="clear-filters-btn">Reset filters</button>`
            : ''
        }
      </div>
    </div>
  `;
}
