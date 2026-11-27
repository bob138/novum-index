import { escapeHtml } from '../scoring.js';
import { renderNavbar } from './Navbar.js';

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
    ${renderNavbar({ activePage: 'index', theme, editionLabel: `Edition ${meta.lastUpdated}` })}

    <section class="hero" id="top">
      <div class="container">
        <div class="hero__grid">
          <div>
            <p class="hero__kicker">Open-Source AI-for-Science Ledger · 1969–2026 Paradigm &amp; Acceleration Tracker</p>
            <h1 class="hero__title">
              Tracking the <em>exponential</em> rise of AI in scientific discovery.
            </h1>
            <p class="hero__lead">
              From five decades of pre-2020 symbolic provers and early neural pioneers (1969–2019) through AlphaFold 2 and today’s surge of autonomous neuro-symbolic discoveries—transparently verified, paradigm-tagged, and impact-ranked.
            </p>
          </div>
          <figure class="hero__artwork">
            <img
              src="./og-card.jpg"
              alt="Cartographic geometric illustration representing mathematical curves, lattices, and scientific discovery arcs"
              loading="eager"
            />
            <figcaption class="hero__artwork-caption">
              <span>PLATE I · NOVUM INDEX</span>
              <span>MIT LICENSE</span>
            </figcaption>
          </figure>
        </div>

        <div class="pulse-strip" aria-label="Index overview metrics">
          <div class="pulse-stat">
            <div class="pulse-stat__value">${totalCount}</div>
            <div class="pulse-stat__label">AI-Enabled Breakthroughs</div>
            <div class="pulse-stat__note">${waveCount} wave · ${earlyNeuralCount} early neural · ${pioneerCount} pre-2020</div>
          </div>
          <div class="pulse-stat">
            <div class="pulse-stat__value">${totalOpenYears.toLocaleString('en-US')}+ yrs</div>
            <div class="pulse-stat__label">Human Years Unsolved</div>
            <div class="pulse-stat__note">${openProblemCount} open problems · hrs–wks via AI</div>
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
