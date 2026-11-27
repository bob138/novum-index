import {
  DIMENSIONS,
  DISCIPLINE_META,
  escapeHtml,
  formatDate,
  normalizeWeights,
} from '../scoring.js';
import { renderStatusBadge } from './Leaderboard.js';

const REPO_URL = 'https://github.com/bob138/novum-index';

export function renderDossierModal(item, allRanked, weights, navList = null, detail = null) {
  if (!item) return '';

  const merged = detail ? { ...item, ...detail } : item;
  const hasDetail = Boolean(merged.summary && Array.isArray(merged.sources));

  const disc = DISCIPLINE_META[merged.discipline];
  const norm = normalizeWeights(weights);
  const byId = new Map(allRanked.map((b) => [b.id, b]));

  const enabledBy = allRanked.filter(
    (other) => Array.isArray(other.enables) && other.enables.includes(merged.id)
  );
  const enablesList = (merged.enables || []).map((id) => byId.get(id)).filter(Boolean);

  const list = Array.isArray(navList) && navList.length > 0 ? navList : allRanked;
  const curIdx = list.findIndex((b) => b.id === merged.id);
  const prevItem = curIdx > 0 ? list[curIdx - 1] : null;
  const nextItem = curIdx >= 0 && curIdx < list.length - 1 ? list[curIdx + 1] : null;

  const anchorBadgeText =
    merged.date < '2020-01-01'
      ? 'PRE-2020 PIONEER'
      : merged.isAnchor
        ? '2020–23 ANCHOR'
        : '';

  return `
    <div class="dossier-backdrop" id="dossier-backdrop" role="presentation">
      <aside
        class="dossier"
        id="dossier-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dossier-title"
      >
        <div class="dossier__topbar">
          <span class="dossier__rank-pill">
            RANK #${String(merged.rank).padStart(2, '0')} · IMPACT ${merged.compositeScore.toFixed(1)}/100${anchorBadgeText ? ` · ${anchorBadgeText}` : ''}
          </span>
          <div class="dossier__topbar-actions">
            <div class="dossier__step-group" role="group" aria-label="Step between breakthroughs">
              <button
                type="button"
                class="icon-btn icon-btn--compact"
                id="dossier-prev-btn"
                ${prevItem ? `data-open-dossier="${escapeHtml(prevItem.id)}" title="Previous: ${escapeHtml(prevItem.shortTitle)} (←)"` : 'disabled aria-disabled="true"'}
                aria-label="Previous breakthrough"
              >←</button>
              <button
                type="button"
                class="icon-btn icon-btn--compact"
                id="dossier-next-btn"
                ${nextItem ? `data-open-dossier="${escapeHtml(nextItem.id)}" title="Next: ${escapeHtml(nextItem.shortTitle)} (→)"` : 'disabled aria-disabled="true"'}
                aria-label="Next breakthrough"
              >→</button>
            </div>
            <button
              type="button"
              class="icon-btn"
              id="dossier-share-btn"
              data-share-id="${escapeHtml(merged.id)}"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              <span>Share</span>
            </button>
            <button
              type="button"
              class="icon-btn"
              id="dossier-close-btn"
              aria-label="Close breakthrough dossier"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>Close</span>
            </button>
          </div>
        </div>

        <div class="dossier__body">
          <header>
            <div class="dossier__badges">
              <span class="disc-tag" style="color: ${disc.colorVar}; background: ${disc.bgVar};">
                <span class="disc-tag__dot" style="background: ${disc.colorVar};"></span>
                ${escapeHtml(merged.discipline)}
              </span>
              ${renderStatusBadge(merged.verificationStatus)}
              <span class="ai-tag">${escapeHtml(merged.aiParadigm)} · ${escapeHtml(merged.aiRole)}</span>
              ${
                merged.yearsUnsolved && merged.aiTimeToSolve
                  ? `<span class="time-tag">${merged.yearsUnsolved}y open → ${escapeHtml(merged.aiTimeToSolve)} AI</span>`
                  : merged.yearsUnsolved
                    ? `<span class="time-tag">${merged.yearsUnsolved} years open</span>`
                    : merged.aiTimeToSolve
                      ? `<span class="time-tag">AI: ${escapeHtml(merged.aiTimeToSolve)}</span>`
                      : ''
              }
            </div>
            <h2 class="dossier__title" id="dossier-title">${escapeHtml(merged.title)}</h2>
            <p class="dossier__why">${escapeHtml(merged.whyItMatters)}</p>
          </header>

          <dl class="dossier__meta-grid">
            <div>
              <dt class="dossier__meta-label">Date Announced / Published</dt>
              <dd class="dossier__meta-value mono" style="margin: 0;">${formatDate(merged.date)}</dd>
            </div>
            <div>
              <dt class="dossier__meta-label">AI System &amp; Paradigm</dt>
              <dd class="dossier__meta-value" style="margin: 0;">${escapeHtml(merged.aiSystem || merged.aiRole)} <span style="color: var(--ink-muted);">(${escapeHtml(merged.aiParadigm)})</span></dd>
            </div>
            ${
              merged.yearsUnsolved || merged.aiTimeToSolve
                ? `
            <div style="grid-column: 1 / -1;">
              <dt class="dossier__meta-label">Human Wait vs. AI Time to Solution</dt>
              <dd class="dossier__meta-value mono" style="margin: 0;">${
                merged.yearsUnsolved && merged.aiTimeToSolve
                  ? `${merged.yearsUnsolved} human years unsolved → ${escapeHtml(merged.aiTimeToSolve)} with AI`
                  : merged.yearsUnsolved
                    ? `${merged.yearsUnsolved} human years unsolved prior to this breakthrough`
                    : `${escapeHtml(merged.aiTimeToSolve)} with AI`
              }</dd>
            </div>`
                : ''
            }
            <div>
              <dt class="dossier__meta-label">Key Contributors</dt>
              <dd class="dossier__meta-value" style="margin: 0;">${escapeHtml(merged.contributors.join(', '))}</dd>
            </div>
            <div>
              <dt class="dossier__meta-label">Institutions</dt>
              <dd class="dossier__meta-value" style="margin: 0;">${escapeHtml(merged.institutions.join(', '))}</dd>
            </div>
          </dl>

          ${
            hasDetail
              ? `
          <section>
            <h3 class="dossier__section-title">Overview</h3>
            <p class="dossier__summary">${escapeHtml(merged.summary)}</p>
          </section>

          <section>
            <h3 class="dossier__section-title">Technical Milestones</h3>
            <ul class="dossier__highlights">
              ${merged.technicalHighlights.map((h) => `<li>${escapeHtml(h)}</li>`).join('')}
            </ul>
          </section>

          <section class="dossier__caveat" aria-label="Verification notes and caveats">
            <div class="dossier__caveat-title">Verification Notes &amp; Caveats</div>
            <p>${escapeHtml(merged.caveats)}</p>
          </section>`
              : `
          <section>
            <h3 class="dossier__section-title">Overview</h3>
            <p class="dossier__summary" style="color: var(--ink-muted);">Loading full breakthrough dossier, verification notes, and primary sources…</p>
          </section>`
          }

          <section>
            <h3 class="dossier__section-title">Transparent Impact Breakdown</h3>
            <div class="score-breakdown">
              <div class="score-breakdown__total">
                <div>
                  <strong>Composite Impact Index</strong>
                  <div style="font-size: 0.76rem; color: var(--ink-muted);">Calculated live from your active rubric weights</div>
                </div>
                <span class="score-breakdown__total-val">${merged.compositeScore.toFixed(1)}</span>
              </div>

              ${DIMENSIONS.map((d) => {
                const score = merged.scores[d.key];
                const weightPct = Math.round(norm[d.key] * 100);
                const rationale = merged.scoreRationale?.[d.key];
                return `
                  <div class="score-axis">
                    <div class="score-axis__head">
                      <span>${d.label} <span class="mono" style="color: var(--ink-muted); font-weight: 400;">(${weightPct}% weight)</span></span>
                      <span class="mono">${score}/100</span>
                    </div>
                    <div class="score-axis__bar">
                      <div class="score-axis__fill" style="width: ${score}%; background: ${disc.colorVar};"></div>
                    </div>
                    ${rationale ? `<p class="score-axis__rationale">${escapeHtml(rationale)}</p>` : ''}
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          ${
            enabledBy.length > 0 || enablesList.length > 0
              ? `
            <section>
              <h3 class="dossier__section-title">Knowledge Lineage</h3>
              ${
                enabledBy.length > 0
                  ? `
                <div style="margin-bottom: 0.75rem;">
                  <div style="font-size: 0.78rem; color: var(--ink-muted); margin-bottom: 0.4rem;">Built upon / Catalyzed by:</div>
                  <div class="lineage-chips">
                    ${enabledBy
                      .map(
                        (parent) => `
                      <button type="button" class="lineage-chip" data-open-dossier="${escapeHtml(parent.id)}">
                        <span>←</span>
                        <span>${escapeHtml(parent.shortTitle)}</span>
                      </button>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }
              ${
                enablesList.length > 0
                  ? `
                <div>
                  <div style="font-size: 0.78rem; color: var(--ink-muted); margin-bottom: 0.4rem;">Directly enabled / accelerated:</div>
                  <div class="lineage-chips">
                    ${enablesList
                      .map(
                        (child) => `
                      <button type="button" class="lineage-chip" data-open-dossier="${escapeHtml(child.id)}">
                        <span>→</span>
                        <span>${escapeHtml(child.shortTitle)}</span>
                      </button>
                    `
                      )
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }
            </section>
          `
              : ''
          }

          ${
            hasDetail
              ? `
          <section>
            <h3 class="dossier__section-title">Primary Sources &amp; Verification</h3>
            <div class="source-list">
              ${merged.sources
                .map(
                  (src) => `
                <a
                  href="${escapeHtml(src.url)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="source-link"
                >
                  <span>${escapeHtml(src.label)} ↗</span>
                  <span class="source-link__type">${escapeHtml(src.type)}</span>
                </a>
              `
                )
                .join('')}
            </div>`
              : '<section>'
          }
            <div style="margin-top: 0.85rem; font-size: 0.78rem; color: var(--ink-muted);">
              Disagree with this score or have a verification update?
              <a
                href="${REPO_URL}/issues/new?template=challenge-score.yml&title=${encodeURIComponent(`Score / Status Review: ${item.shortTitle}`)}"
                target="_blank"
                rel="noopener noreferrer"
              >Open a community review on GitHub →</a>
            </div>
          </section>
        </div>
      </aside>
    </div>
  `;
}
