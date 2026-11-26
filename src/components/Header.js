import { escapeHtml } from '../scoring.js';

const REPO_URL = 'https://github.com/bob138/frontier-index';

export function renderHeader(meta, allItems, theme) {
  const totalCount = allItems.length;
  const anchorCount = allItems.filter((b) => b.isAnchor).length;
  const waveCount = totalCount - anchorCount;
  const formallyVerifiedCount = allItems.filter(
    (b) => b.verificationStatus === 'Formally Verified'
  ).length;
  const aiInvolvedCount = allItems.filter((b) => b.aiRole !== 'Human').length;
  const aiSharePct = Math.round((aiInvolvedCount / Math.max(1, totalCount)) * 100);
  const totalOpenYears = allItems.reduce((sum, b) => sum + (b.yearsUnsolved || 0), 0);

  return `
    <header class="site-nav" role="banner">
      <div class="container site-nav__inner">
        <a href="#top" class="site-brand" id="brand-home">
          <img src="./favicon.svg" alt="" class="site-brand__mark" width="28" height="28" />
          <span class="site-brand__title">The Frontier Index</span>
          <span class="site-brand__edition">Edition ${escapeHtml(meta.lastUpdated)}</span>
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
              theme === 'dark'
                ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg><span>Paper</span>`
                : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg><span>Dark</span>`
            }
          </button>
          <a href="#methodology" class="nav-btn nav-btn--methodology" id="nav-methodology">Methodology</a>
          <a
            href="${REPO_URL}/issues/new?template=submit-breakthrough.yml"
            target="_blank"
            rel="noopener noreferrer"
            class="nav-btn nav-btn--primary"
            id="nav-submit-btn"
          >
            <span class="nav-submit-full">Submit Breakthrough</span>
            <span class="nav-submit-short">Submit</span>
          </a>
        </nav>
      </div>
    </header>

    <section class="hero" id="top">
      <div class="container">
        <div class="hero__grid">
          <div>
            <p class="hero__kicker">Open-Source Scientific Ledger · 2024–2026 Wave + 2020–2023 Anchors</p>
            <h1 class="hero__title">
              Tracking the breakthroughs <em>reshaping</em> human knowledge.
            </h1>
            <p class="hero__lead">
              Rapidly advancing AI systems, formal theorem provers, and foundational human insight have unleashed an unprecedented wave of discoveries across Mathematics, Computer Science, Physics, Biology, and Materials. The Frontier Index curates, verifies, and transparently ranks the milestones moving the frontier—calibrated against landmark 2020–2023 anchors like AlphaFold 2.
            </p>
          </div>
          <figure class="hero__artwork">
            <img
              src="./og-card.jpg"
              alt="Cartographic geometric illustration representing mathematical curves, lattices, and scientific discovery arcs"
              loading="eager"
            />
            <figcaption class="hero__artwork-caption">
              <span>PLATE I · FRONTIER INDEX</span>
              <span>MIT LICENSE</span>
            </figcaption>
          </figure>
        </div>

        <div class="pulse-strip" aria-label="Index overview metrics">
          <div class="pulse-stat">
            <div class="pulse-stat__value">${totalCount}</div>
            <div class="pulse-stat__label">Landmark Breakthroughs</div>
            <div class="pulse-stat__note">${waveCount} from 2024–26 · ${anchorCount} calibration anchors</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${formallyVerifiedCount}</div>
            <div class="pulse-stat__label">Formally Verified</div>
            <div class="pulse-stat__note">Machine-checked in Lean / proofs</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${totalOpenYears}+ yrs</div>
            <div class="pulse-stat__label">Open-Problem Age Tackled</div>
            <div class="pulse-stat__note">Combined years across named conjectures</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${aiSharePct}%</div>
            <div class="pulse-stat__label">AI-Assisted or Autonomous</div>
            <div class="pulse-stat__note">${aiInvolvedCount} of ${totalCount} indexed milestones</div>
          </div>
        </div>
      </div>
    </section>
  `;
}
