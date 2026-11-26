import { escapeHtml } from '../scoring.js';

const REPO_URL = 'https://github.com/bob138/frontier-index';

export function renderHeader(meta, allItems, theme) {
  const totalCount = allItems.length;
  const pioneerCount = allItems.filter((b) => b.date < '2020-01-01').length;
  const earlyNeuralCount = allItems.filter((b) => b.date >= '2020-01-01' && b.date < '2024-01-01').length;
  const waveCount = allItems.filter((b) => b.date >= '2024-01-01').length;
  const formallyVerifiedCount = allItems.filter(
    (b) => b.verificationStatus === 'Formally Verified'
  ).length;
  const autonomousCount = allItems.filter((b) => b.aiRole === 'Autonomous AI').length;
  const assistedCount = totalCount - autonomousCount;
  const autonomousPct = Math.round((autonomousCount / Math.max(1, totalCount)) * 100);
  const count2024 = allItems.filter((b) => b.date.startsWith('2024')).length;
  const count2026 = allItems.filter((b) => b.date.startsWith('2026')).length;
  const accelFactor = count2024 > 0 ? `${(count2026 / count2024).toFixed(1)}×` : `${count2026}`;
  const openProblems = allItems.filter((b) => typeof b.yearsUnsolved === 'number' && b.yearsUnsolved > 0);
  const totalOpenYears = openProblems.reduce((sum, b) => sum + b.yearsUnsolved, 0);
  const openProblemCount = openProblems.length;

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
            <p class="hero__kicker">Open-Source AI-for-Science Ledger · 1996–2026 Paradigm &amp; Acceleration Tracker</p>
            <h1 class="hero__title">
              Tracking the <em>exponential</em> rise of AI in scientific discovery.
            </h1>
            <p class="hero__lead">
              From rare pre-2020 symbolic pioneers to the deep-learning breakout (Halicin, AlphaFold 2) and today’s surge of autonomous neural and neuro-symbolic discoveries posted directly to GitHub, arXiv, and X, The Frontier Index tracks exclusively AI-assisted and AI-led breakthroughs—separating paradigms cleanly while visualizing the curve over time.
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
            <div class="pulse-stat__label">AI Breakthroughs</div>
            <div class="pulse-stat__note">${waveCount} in 2024–26 · ${earlyNeuralCount} in 2020–23 · ${pioneerCount} pre-2020</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${totalOpenYears.toLocaleString('en-US')}+ yrs</div>
            <div class="pulse-stat__label">Human Years Unsolved</div>
            <div class="pulse-stat__note">Across ${openProblemCount} open problems · hrs–wks for AI</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${formallyVerifiedCount}</div>
            <div class="pulse-stat__label">Formally Verified</div>
            <div class="pulse-stat__note">Machine-checked in Lean / proofs</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${autonomousPct}%</div>
            <div class="pulse-stat__label">Autonomous AI-Led</div>
            <div class="pulse-stat__note">${autonomousCount} autonomous · ${assistedCount} AI-assisted</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${accelFactor}</div>
            <div class="pulse-stat__label">2026 vs. 2024 Pace</div>
            <div class="pulse-stat__note">${count2026} in 2026 vs. ${count2024} in 2024</div>
          </div>
        </div>
      </div>
    </section>
  `;
}
