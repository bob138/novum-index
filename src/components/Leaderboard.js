import {
  DIMENSIONS,
  DISCIPLINE_META,
  STATUS_META,
  escapeHtml,
  formatDate,
} from '../scoring.js';

function statusIcon(status) {
  switch (status) {
    case 'Formally Verified':
      return `<svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
    case 'Peer-Reviewed':
      return `<svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
    case 'Preprint / Active Review':
      return `<svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
    default:
      return `<svg class="status-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
  }
}

export function renderStatusBadge(status) {
  const meta = STATUS_META[status] || STATUS_META['Preprint / Active Review'];
  return `
    <span
      class="status-badge"
      style="color: ${meta.colorVar}; background: ${meta.bgVar};"
      title="${escapeHtml(status)}"
    >
      ${statusIcon(status)}
      <span>${escapeHtml(meta.short)}</span>
    </span>
  `;
}

export function renderLeaderboard(items, totalCount, sortBy = 'impact') {
  if (items.length === 0) {
    return `
      <div class="leaderboard">
        <div class="empty-state">
          <h3>No breakthroughs match your current filters</h3>
          <p>Try broadening the discipline, verification tier, or search query.</p>
        </div>
      </div>
    `;
  }

  const sortLabel =
    sortBy === 'newest'
      ? 'Sorted by most recent'
      : sortBy === 'oldest'
        ? 'Sorted chronologically'
        : 'Ranked by composite Impact Index';

  return `
    <div class="results-meta">
      <span>Showing <strong class="mono">${items.length}</strong> of <span class="mono">${totalCount}</span> AI breakthroughs · ${sortLabel}</span>
      <span>Click any entry to inspect its dossier, score rationale &amp; primary sources</span>
    </div>

    <div class="leaderboard" role="region" aria-label="Ranked AI breakthroughs leaderboard">
      <div class="leaderboard__head" aria-hidden="true">
        <span>Rank</span>
        <span>Breakthrough &amp; Significance</span>
        <span>Verification</span>
        <span class="col-breakdown">D · R · V · A</span>
        <span style="text-align: right;">Impact Score</span>
      </div>

      ${items
        .map((item) => {
          const disc = DISCIPLINE_META[item.discipline];
          const rankPad = String(item.rank).padStart(2, '0');
          const leadInst = item.institutions.slice(0, 2).join(' · ');
          const metaLine = item.aiSystem ? `${leadInst} · ${item.aiSystem}` : leadInst;

          return `
          <button
            type="button"
            class="leaderboard__row"
            id="row-${escapeHtml(item.id)}"
            data-open-dossier="${escapeHtml(item.id)}"
          >
            <div class="rank-cell">
              <span class="rank-num ${item.rank <= 3 ? 'rank-num--top' : ''}">#${rankPad}</span>
              ${
                item.yearsUnsolved
                  ? `<span class="rank-years" title="Years open before this breakthrough">${item.yearsUnsolved}y open</span>`
                  : ''
              }
            </div>

            <div class="entry-cell">
              <div class="entry-cell__top">
                <span class="disc-tag" style="color: ${disc.colorVar}; background: ${disc.bgVar};">
                  <span class="disc-tag__dot" style="background: ${disc.colorVar};"></span>
                  ${escapeHtml(item.discipline)}
                </span>
                ${item.isAnchor ? '<span class="anchor-tag" title="2020–2023 historical calibration benchmark">Calibration Anchor</span>' : ''}
                <span class="ai-tag">${escapeHtml(item.aiRole)}</span>
                <span class="entry-cell__date">${formatDate(item.date)}</span>
              </div>
              <div class="entry-cell__title">${escapeHtml(item.title)}</div>
              <p class="entry-cell__why">${escapeHtml(item.whyItMatters)}</p>
              <div class="entry-cell__contributors">${escapeHtml(metaLine)}</div>
            </div>

            <div class="col-status">
              ${renderStatusBadge(item.verificationStatus)}
            </div>

            <div class="col-breakdown" title="Foundational Depth / Cross-Field Ripple / Verification / Velocity">
              <div class="mini-bars">
                ${DIMENSIONS.map((d) => {
                  const val = item.scores[d.key];
                  const letter = d.key === 'foundational' ? 'D' : d.key === 'ripple' ? 'R' : d.key === 'verification' ? 'V' : 'A';
                  return `
                    <div class="mini-bar-col">
                      <div class="mini-bar-track">
                        <div class="mini-bar-fill" style="height: ${val}%; background: ${disc.colorVar}; opacity: ${0.42 + (val / 100) * 0.58};"></div>
                      </div>
                      <span class="mini-bar-lbl">${letter}</span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <div class="col-score">
              <div class="score-cell">
                <div class="score-cell__number">
                  ${item.compositeScore.toFixed(1)}<span class="score-cell__max">/100</span>
                </div>
                <div class="score-bar" aria-hidden="true">
                  <div class="score-bar__fill" style="width: ${item.compositeScore}%; background: ${disc.colorVar};"></div>
                </div>
              </div>
            </div>
          </button>
        `;
        })
        .join('')}
    </div>
  `;
}
