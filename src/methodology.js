import {
  DIMENSIONS,
  DISCIPLINE_META,
  WEIGHT_PRESETS,
  escapeHtml,
  formatDate,
  rankBreakthroughs,
} from './scoring.js';
import { renderStatusBadge } from './components/Leaderboard.js';
import { renderNavbar } from './components/Navbar.js';
import {
  loadInitialTheme,
  applyTheme,
  subscribeThemeSync,
} from './theme.js';

const REPO_URL = 'https://github.com/bob138/novum-index';
let dataset = null;
let DEFAULT_WEIGHTS = { foundational: 35, ripple: 30, verification: 20, velocity: 15 };

let currentTheme = loadInitialTheme();

const RUBRIC_BANDS = {
  foundational: [
    ['95–100', 'Resolves a Millennium-tier or century-scale open problem, or creates a new foundational paradigm.'],
    ['85–94', 'Settles a major decades-old conjecture, overturns a longstanding barrier, or breaks a core scientific limit.'],
    ['75–84', 'Substantive conceptual advance, novel scientific discovery, or key structural theorem opening a sub-area.'],
    ['50–74', 'Meaningful partial result, specialized proof, or scoped methodological milestone.'],
  ],
  ripple: [
    ['90–100', 'Immediately reshapes multiple disciplines, clinical medicine, cryptography, or global scientific tooling.'],
    ['80–89', 'Strong downstream catalytic impact across adjacent subfields, engineering, or industrial research roadmaps.'],
    ['70–79', 'Deep impact within its home specialty with targeted cross-field spillover.'],
    ['50–69', 'High theoretical interest with primarily intra-disciplinary downstream applications.'],
  ],
  verification: [
    ['95–100', 'Machine-checked formal proof (e.g., Lean 4 / Mathlib kernel or Coq) with accepted definitions, or peer-reviewed & independently replicated.'],
    ['85–94', 'Formally verified pending human exposition, or published in a top peer-reviewed journal (<em>Nature</em>, <em>Science</em>, <em>Cell</em>) with strong telemetry.'],
    ['65–84', 'Reproduced with caveats, or machine-checked amid active community debate over scope, priority, or framing.'],
    ['50–64', 'Credible early preprint, GitHub release, or social-media proof still undergoing independent expert audit.'],
  ],
  velocity: [
    ['90–100', 'Compresses multi-decade or century-scale timelines into hours, days, or weeks via AI reasoning or formal synthesis.'],
    ['80–89', 'Major unexpected acceleration over historical pace (e.g., orders-of-magnitude screening or proof-search compression).'],
    ['70–79', 'Clear acceleration over manual workflows while still requiring substantial domain scaffolding or compute.'],
    ['50–69', 'Important pioneering automation proof-of-concept with modest throughput relative to modern foundation models.'],
  ],
};

const TIER_DEFINITIONS = [
  {
    status: 'Formally Verified',
    summary:
      'Backed by a machine-checked formal proof or verified certificate (such as Lean 4 / Mathlib, Coq, or an exact algebraic/DRAT verifier).',
    nuance:
      'Formal verification guarantees logical validity relative to the formal definitions encoded in the proof assistant. Any open questions regarding definition alignment, axiomatic assumptions, or human readability are documented candidly in each entry’s Verification Notes & Caveats.',
  },
  {
    status: 'Peer-Reviewed',
    summary:
      'Published in a refereed scientific journal or top conference (e.g., Nature, Science, Cell, PNAS, NeurIPS), officially graded by competition committees (e.g., IMO), or independently audited and accepted by named domain experts.',
    nuance:
      'Peer review confirms community vetting and reproducibility standards; preclinical or deployment caveats (such as translational toxicity or hardware scaling limits) remain explicitly tracked.',
  },
  {
    status: 'Preprint / Active Review',
    summary:
      'Credible breakthrough released via arXiv, a public GitHub/Lean repository, a lab technical report, or a primary researcher announcement on X that is currently undergoing independent expert refereeing.',
    nuance:
      'Because frontier AI discoveries now appear online months before journal print, tracking active-review entries transparently is essential to measuring the real-time acceleration curve—without conflating them with certified theorems.',
  },
  {
    status: 'Contested / Partial',
    summary:
      'Notable AI scientific claim or formalization accompanied by active scholarly disagreement over scope, problem framing, priority, or partiality of the result.',
    nuance:
      'Rather than silently omitting high-profile debates or inflating their rigor, contested entries carry explicit Verification & Rigor penalties and documented community counter-arguments.',
  },
];

const PARADIGM_DEFINITIONS = [
  {
    key: 'Symbolic / Classical',
    era: '1969 – 2020',
    colorVar: 'var(--ink-muted)',
    summary:
      'Automated theorem provers (SAM V, AURA, EQP, OTTER, FINDER), expert systems (Meta-DENDRAL, MYCIN, PROSPECTOR), inductive logic & robot scientists (Golem, Adam, Eve), symbolic regression (Eureqa, SINDy), formal proof assistants (Coq, HOL Light), SAT solvers (Glucose, Cube-and-Conquer), and exact game solvers (Chinook, Cepheus).',
  },
  {
    key: 'Neural / Deep Learning',
    era: '1988 – 2026',
    colorVar: 'var(--disc-cs)',
    summary:
      'From early scientific neural pioneers (Qian–Sejnowski, PHD, Behler–Parrinello potentials, DeepBind, DeepSEA, RaptorX-Contact, Carleo–Troyer NQS, DeepVariant, AlphaFold 1, SpliceAI, D³M) to modern foundation models (AlphaFold 2/3, GNoME, Evo 2, MatterGen, GPT-5.2 gluon amplitudes).',
  },
  {
    key: 'Neuro-Symbolic',
    era: '2014 – 2026',
    colorVar: 'var(--disc-math)',
    summary:
      'Neural models tightly coupled to symbolic deduction engines, formal proof kernels (Lean 4 / Mathlib, Coq, SMT), MCTS, knowledge graphs, or automated programmatic evaluators (e.g., IBM KnIT, 3N-MCTS, AI Feynman, FunSearch, AlphaGeometry, AlphaProof, AlphaEvolve, Claude/GPT/Gemini Lean pipelines).',
  },
];

function renderMethodologyPage() {
  applyTheme(currentTheme);

  const ranked = rankBreakthroughs(dataset.breakthroughs, DEFAULT_WEIGHTS);
  const totalCount = ranked.length;
  const openProblems = ranked.filter((b) => typeof b.yearsUnsolved === 'number' && b.yearsUnsolved > 0);
  const totalOpenYears = openProblems.reduce((sum, b) => sum + b.yearsUnsolved, 0);
  const pairedTimeItems = ranked
    .filter((b) => b.yearsUnsolved && b.aiTimeToSolve)
    .sort((a, b) => b.yearsUnsolved - a.yearsUnsolved);
  const anchors = ranked
    .filter((b) => b.isAnchor)
    .sort((a, b) => a.date.localeCompare(b.date));

  const countByStatus = {};
  const countByParadigm = {};
  const countByRole = {};
  for (const item of ranked) {
    countByStatus[item.verificationStatus] = (countByStatus[item.verificationStatus] || 0) + 1;
    countByParadigm[item.aiParadigm] = (countByParadigm[item.aiParadigm] || 0) + 1;
    countByRole[item.aiRole] = (countByRole[item.aiRole] || 0) + 1;
  }

  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderNavbar({ activePage: 'methodology', theme: currentTheme, editionLabel: `Edition ${dataset.meta.lastUpdated}` })}

    <section class="hero meth-hero">
      <div class="container">
        <p class="hero__kicker">Open Methodology &amp; Epistemic Framework · Edition ${escapeHtml(dataset.meta.lastUpdated)}</p>
        <h1 class="hero__title meth-hero__title">
          How Novum Index curates, verifies, and <em>transparently</em> ranks AI-driven science.
        </h1>
        <p class="hero__lead meth-hero__lead">
          Named after <em>novum</em>—Latin for “the genuinely new thing,” honoring Francis Bacon’s 1620 <em>Novum Organum</em> as artificial intelligence becomes science’s new instrument—Novum Index governs every score, verification tier, paradigm tag, and time-compression figure with an explicit, auditable rubric that readers can override live.
        </p>

        <nav class="meth-toc" aria-label="Methodology sections">
          <a href="#scope">1. Scope &amp; Inclusion</a>
          <a href="#rubric">2. 4-Axis Scoring Rubric</a>
          <a href="#presets">3. Weight Presets</a>
          <a href="#verification">4. Verification Tiers</a>
          <a href="#paradigms">5. AI Paradigm &amp; Role</a>
          <a href="#time-compression">6. Human vs. AI Time</a>
          <a href="#anchors">7. Calibration Anchors</a>
          <a href="#visualizations">8. Visualizations</a>
          <a href="#governance">9. Open Governance</a>
        </nav>
      </div>
    </section>

    <main class="workspace">
      <div class="container meth-layout">
        <!-- 1. Scope & Inclusion -->
        <section class="meth-section" id="scope" aria-labelledby="h-scope">
          <div class="meth-section__eyebrow">Section 01</div>
          <h2 class="meth-section__title" id="h-scope">Scope, Inclusion Criteria &amp; Open-Internet Tracking</h2>
          <p class="meth-prose">
            <strong>Novum Index exclusively tracks AI-assisted and AI-led scientific breakthroughs.</strong> Exclusively human discoveries—however monumental—are intentionally out of scope. This strict focus allows the index to isolate and measure the rate at which artificial intelligence contributes to human scientific knowledge and to visualize the paradigm shift from early symbolic provers to modern neural and neuro-symbolic systems.
          </p>

          <div class="meth-two-col">
            <div class="meth-card">
              <h3>What Qualifies for Inclusion</h3>
              <ul class="meth-list">
                <li><strong>Substantive scientific advance:</strong> Resolution or refutation of a named conjecture, a new mathematical/algorithmic bound, a novel biological/chemical/physical discovery, or a verified scientific foundation model unlocking downstream discoveries.</li>
                <li><strong>Documented AI contribution:</strong> Every entry must specify both an <code>aiRole</code> (<code>AI-Assisted</code> or <code>Autonomous AI</code>), an architectural <code>aiParadigm</code>, and a concrete <code>aiSystem</code> (e.g., AlphaFold 2, Chemprop, GPT-6.2 Astra + Lean 4).</li>
                <li><strong>Primary verifiable source:</strong> Backed by at least one inspectable URL—a journal DOI, arXiv preprint, GitHub/Lean proof repository, lab technical report, or primary researcher announcement on X linking to the proof or code.</li>
              </ul>
            </div>

            <div class="meth-card">
              <h3>Why We Track Pre-Publication Open-Internet Results</h3>
              <ul class="meth-list">
                <li><strong>Eliminating publication lag:</strong> Traditional journal refereeing often takes 6–24 months. During the 2025–2026 wave, major Lean-verified disproofs and AI-discovered results increasingly land directly on GitHub, arXiv, and X (for example, Cinna Davis’s Lean-verified disproof of the Caiolo–Ferroni–Hoster conjecture).</li>
                <li><strong>Epistemic separation, not exclusion:</strong> Early releases are logged immediately with explicit <code>Preprint / Active Review</code> or <code>Formally Verified</code> tiers and candid caveats—never conflated with peer-reviewed consensus.</li>
                <li><strong>What is excluded:</strong> Purely human work, generic LLM benchmark increments without a scientific result, game-playing AI (e.g., Go/Chess), and unverified social claims lacking inspectable proofs, code, or data.</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 2. 4-Axis Scoring Rubric -->
        <section class="meth-section" id="rubric" aria-labelledby="h-rubric">
          <div class="meth-section__eyebrow">Section 02</div>
          <h2 class="meth-section__title" id="h-rubric">The Four-Axis Impact Scoring Rubric</h2>
          <p class="meth-prose">
            Every breakthrough is scored from <code>0</code> to <code>100</code> on four orthogonal dimensions, each accompanied by an entry-specific written justification in its entry record under <code>data/entries/&lt;year&gt;/&lt;id&gt;.json</code>. Composite scores are computed dynamically client-side as a normalized weighted mean, rounded to one decimal place:
          </p>

          <div class="meth-formula-box" role="region" aria-label="Composite Impact Index formula">
            <div class="meth-formula__eq">
              <span class="meth-formula__lhs">Impact</span>
              <span class="meth-formula__op">=</span>
              <span class="meth-formula__frac">
                <span class="meth-formula__num">w<sub>depth</sub>·s<sub>depth</sub> + w<sub>ripple</sub>·s<sub>ripple</sub> + w<sub>rigor</sub>·s<sub>rigor</sub> + w<sub>velocity</sub>·s<sub>velocity</sub></span>
                <span class="meth-formula__den">w<sub>depth</sub> + w<sub>ripple</sub> + w<sub>rigor</sub> + w<sub>velocity</sub></span>
              </span>
            </div>
            <p class="meth-formula__note">
              Default weights: <strong>35%</strong> Foundational Depth · <strong>25%</strong> Cross-Field Ripple · <strong>20%</strong> Verification &amp; Rigor · <strong>20%</strong> Discovery Velocity. Ties break first by Foundational Depth (descending), then by announcement date (most recent first).
            </p>
          </div>

          <div class="meth-rubric-grid">
            ${DIMENSIONS.map(
              (d) => `
              <article class="meth-card">
                <div class="meth-rubric-card__head">
                  <h3>${escapeHtml(d.label)}</h3>
                  <span class="time-tag">${DEFAULT_WEIGHTS[d.key]}% default</span>
                </div>
                <p class="meth-card__desc">${escapeHtml(d.description)}</p>
                <dl class="meth-bands">
                  ${RUBRIC_BANDS[d.key]
                    .map(
                      ([band, desc]) => `
                    <div class="meth-band-row">
                      <dt class="mono">${band}</dt>
                      <dd>${desc}</dd>
                    </div>
                  `
                    )
                    .join('')}
                </dl>
              </article>
            `
            ).join('')}
          </div>
        </section>

        <!-- 3. Weight Presets -->
        <section class="meth-section" id="presets" aria-labelledby="h-presets">
          <div class="meth-section__eyebrow">Section 03</div>
          <h2 class="meth-section__title" id="h-presets">Interactive Weight Presets &amp; Shareable Rubrics</h2>
          <p class="meth-prose">
            Because a pure mathematician, a biomedical researcher, and an AI capabilities analyst legitimately weight rigor, ripple, and speed differently, the index ships with four transparent presets—plus full slider control encoded directly into shareable URLs (<code>?w=D,R,V,A</code>). Click any preset below to launch the live leaderboard with those weights applied:
          </p>

          <div class="meth-table-wrap">
            <table class="meth-table">
              <thead>
                <tr>
                  <th>Preset</th>
                  <th>Depth</th>
                  <th>Ripple</th>
                  <th>Rigor</th>
                  <th>Velocity</th>
                  <th>Perspective</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                ${WEIGHT_PRESETS.map((p) => {
                  const wStr = `${p.weights.foundational},${p.weights.ripple},${p.weights.verification},${p.weights.velocity}`;
                  return `
                    <tr>
                      <td><strong>${escapeHtml(p.label)}</strong></td>
                      <td class="mono">${p.weights.foundational}%</td>
                      <td class="mono">${p.weights.ripple}%</td>
                      <td class="mono">${p.weights.verification}%</td>
                      <td class="mono">${p.weights.velocity}%</td>
                      <td>${escapeHtml(p.description)}</td>
                      <td><a class="meth-link" href="./?w=${wStr}">Open →</a></td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 4. Verification Tiers -->
        <section class="meth-section" id="verification" aria-labelledby="h-verification">
          <div class="meth-section__eyebrow">Section 04</div>
          <h2 class="meth-section__title" id="h-verification">Epistemic Verification Tiers (Live Index Breakdown)</h2>
          <p class="meth-prose">
            Every breakthrough carries one of four verification tiers reflecting current scientific consensus as of <code>${escapeHtml(dataset.meta.lastUpdated)}</code>. Entries are upgraded or downgraded via pull request as preprints complete peer review, proofs are independently checked in Lean, or flaws emerge during audit.
          </p>

          <div class="meth-tier-grid">
            ${TIER_DEFINITIONS.map((t) => {
              const cnt = countByStatus[t.status] || 0;
              const pct = Math.round((cnt / Math.max(1, totalCount)) * 100);
              return `
                <article class="meth-card">
                  <div class="meth-rubric-card__head">
                    ${renderStatusBadge(t.status)}
                    <span class="mono meth-count-pill">${cnt} entries (${pct}%)</span>
                  </div>
                  <p class="meth-prose-sm" style="margin-top: 0.7rem;">${escapeHtml(t.summary)}</p>
                  <p class="meth-prose-muted">${escapeHtml(t.nuance)}</p>
                </article>
              `;
            }).join('')}
          </div>
        </section>

        <!-- 5. AI Paradigm & Provenance Taxonomy -->
        <section class="meth-section" id="paradigms" aria-labelledby="h-paradigms">
          <div class="meth-section__eyebrow">Section 05</div>
          <h2 class="meth-section__title" id="h-paradigms">AI Paradigm &amp; Autonomy Taxonomy</h2>
          <p class="meth-prose">
            To avoid conflating pre-deep-learning symbolic theorem provers with modern neural networks—while still illuminating how rapidly neural and hybrid systems eclipsed the symbolist approach—every breakthrough is classified along two independent axes: <strong>AI Paradigm</strong> (<code>aiParadigm</code>) and <strong>AI Role</strong> (<code>aiRole</code>).
          </p>

          <div class="meth-rubric-grid meth-rubric-grid--three">
            ${PARADIGM_DEFINITIONS.map((p) => {
              const cnt = countByParadigm[p.key] || 0;
              const pct = Math.round((cnt / Math.max(1, totalCount)) * 100);
              return `
                <article class="meth-card">
                  <div class="meth-rubric-card__head">
                    <h3 style="display:flex;align-items:center;gap:0.45rem;">
                      <span class="disc-tag__dot" style="background:${p.colorVar};width:9px;height:9px;"></span>
                      ${escapeHtml(p.key)}
                    </h3>
                    <span class="mono meth-count-pill">${cnt} (${pct}%)</span>
                  </div>
                  <div class="mono" style="font-size:0.72rem;color:var(--ink-muted);margin:0.2rem 0 0.55rem;">Era: ${p.era}</div>
                  <p class="meth-prose-sm">${escapeHtml(p.summary)}</p>
                  <a class="meth-link" style="display:inline-block;margin-top:0.65rem;" href="./?paradigm=${encodeURIComponent(p.key)}">Filter index →</a>
                </article>
              `;
            }).join('')}
          </div>

          <div class="meth-two-col" style="margin-top: 1rem;">
            <div class="meth-card">
              <div class="meth-rubric-card__head">
                <h3>Autonomous AI</h3>
                <span class="mono meth-count-pill">${countByRole['Autonomous AI'] || 0} entries (${Math.round(((countByRole['Autonomous AI'] || 0) / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <p class="meth-prose-sm" style="margin-top:0.5rem;">
                Discoveries produced primarily by autonomous AI search, evolutionary coding loops, or multi-agent reasoning systems with minimal step-by-step human mathematical or experimental steering (e.g., EQP, AlphaTensor, FunSearch, AlphaEvolve, GPT-6 Astra’s Köthe disproof, Claude’s black-hole physics and ART enzyme discoveries).
              </p>
            </div>
            <div class="meth-card">
              <div class="meth-rubric-card__head">
                <h3>AI-Assisted</h3>
                <span class="mono meth-count-pill">${countByRole['AI-Assisted'] || 0} entries (${Math.round(((countByRole['AI-Assisted'] || 0) / Math.max(1, totalCount)) * 100)}%)</span>
              </div>
              <p class="meth-prose-sm" style="margin-top:0.5rem;">
                Human scientists and mathematicians actively formulating, steering, debugging, or experimentally validating discoveries powered by frontier AI models or specialized scientific neural architectures (e.g., Halicin, AlphaFold 2/3, Alpöge &amp; Claude on the Riemann Hypothesis, Cinna Davis on Caiolo–Ferroni–Hoster).
              </p>
            </div>
          </div>
        </section>

        <!-- 6. Human Years Unsolved vs. AI Time -->
        <section class="meth-section" id="time-compression" aria-labelledby="h-time">
          <div class="meth-section__eyebrow">Section 06</div>
          <h2 class="meth-section__title" id="h-time">Human Years Unsolved vs. AI Time-to-Solution</h2>
          <p class="meth-prose">
            To quantify discovery acceleration concretely, Novum Index tracks two strictly conservative temporal fields:
          </p>
          <ul class="meth-list meth-list--wide">
            <li><strong><code>yearsUnsolved</code> (${totalOpenYears.toLocaleString('en-US')}+ combined years across ${openProblems.length} open problems):</strong> Populated <em>only</em> when a breakthrough resolves or breaks a well-defined, named open scientific or mathematical problem, measured from the year it was formally posed until resolution. We intentionally set <code>yearsUnsolved: null</code> for formalizations of already-proven theorems (such as Fermat’s Last Theorem or Viazovska’s sphere packing) and general-purpose scientific platforms so the cumulative human-years total is never inflated.</li>
            <li><strong><code>aiTimeToSolve</code>:</strong> Populated <em>only</em> when primary sources explicitly document the AI runtime or human–AI turnaround (e.g., <code>16 hours</code>, <code>1 weekend</code>, <code>6 weeks</code>). Where turnaround is undocumented or spans multi-year architecture R&amp;D, this field is left <code>null</code> rather than estimated.</li>
          </ul>

          <div class="meth-table-wrap">
            <table class="meth-table">
              <thead>
                <tr>
                  <th>Breakthrough</th>
                  <th>Human Wait</th>
                  <th>AI Time</th>
                  <th>Paradigm</th>
                  <th>Verification</th>
                </tr>
              </thead>
              <tbody>
                ${pairedTimeItems
                  .map(
                    (b) => `
                  <tr>
                    <td><a class="meth-link" href="./#breakthrough/${encodeURIComponent(b.id)}">${escapeHtml(b.shortTitle.replace(' (Anchor)', ''))}</a></td>
                    <td class="mono">${b.yearsUnsolved} yrs open</td>
                    <td><span class="time-tag">${escapeHtml(b.aiTimeToSolve)}</span></td>
                    <td class="mono" style="font-size:0.74rem;color:var(--ink-secondary);">${escapeHtml(b.aiParadigm)}</td>
                    <td>${renderStatusBadge(b.verificationStatus)}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 7. Historical Pioneers & Calibration Anchors -->
        <section class="meth-section" id="anchors" aria-labelledby="h-anchors">
          <div class="meth-section__eyebrow">Section 07</div>
          <h2 class="meth-section__title" id="h-anchors">Historical Pioneers &amp; Calibration Anchors (1969–2023)</h2>
          <p class="meth-prose">
            Fast-moving waves suffer from recency and selection bias. To keep composite scores calibrated on an absolute scale—and to ensure the pre-wave baseline cannot be accused of under-counting earlier eras—the index maintains an exhaustive <strong>${anchors.length} historical anchor milestones</strong> (<code>isAnchor: true</code>): <strong>${anchors.filter((a) => a.date < '2020-01-01').length} pre-2020 pioneers (1969–2019)</strong> spanning both <em>Symbolic / Classical AI</em> (SAM V, Meta-DENDRAL, MYCIN, AURA, PROSPECTOR, Graffiti, Golem, FINDER/MGTP, EQP, OTTER, Coq Four Color &amp; Feit–Thompson, NASA ST5, Chinook, Adam, Eureqa, Erdős Discrepancy SAT, Flyspeck, Cepheus, Eve, SINDy, Boolean Pythagorean Triples, Schur Number Five) and <em>Early Neural / ML Science</em> (Qian–Sejnowski, PHD, Behler–Parrinello potentials, Baldi LHC, IBM KnIT, DeepBind, DeepSEA, Dark Reactions, Gulshan, RaptorX-Contact, Esteva, Carleo–Troyer NQS, Hezaveh lensing, Kepler-90i, 3N-MCTS, Moorfields OCT, DeepVariant, AlphaFold 1, SpliceAI, D³M, GENTRL), plus <strong>${anchors.filter((a) => a.date >= '2020-01-01').length} early 2020–2023 landmarks</strong> (starting with Halicin, FermiNet, and AlphaFold 2).
          </p>
          <p class="meth-prose" style="margin-top:0.75rem;">
            <strong>Strict AI-Only Boundary:</strong> To preserve scientific integrity, we intentionally exclude milestones that relied on custom non-AI brute-force computation or numerical verification without AI reasoning/learning (e.g., Appel &amp; Haken’s 1976 Fortran Four Color search, Lam et al.’s 1989 Cray-1A projective-plane search, and Tucker’s 1999 interval-arithmetic Lorenz proof), as well as symbolic AI systems that only rediscovered known textbook laws or theorems (e.g., Logic Theorist 1956, BACON 1981). Every 2024–2026 score is benchmarked against these ${anchors.length} anchors—with AlphaFold 2 (<code>98.3</code>) setting the upper reference ceiling for multi-disciplinary paradigm shifts.
          </p>

          <div class="meth-table-wrap">
            <table class="meth-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Anchor Milestone</th>
                  <th>Discipline</th>
                  <th>Paradigm</th>
                  <th style="text-align:right;">Impact</th>
                </tr>
              </thead>
              <tbody>
                ${anchors
                  .map((a) => {
                    const disc = DISCIPLINE_META[a.discipline];
                    return `
                    <tr>
                      <td class="mono" style="white-space:nowrap;">${formatDate(a.date)}</td>
                      <td><a class="meth-link" href="./#breakthrough/${encodeURIComponent(a.id)}">${escapeHtml(a.title)}</a></td>
                      <td><span class="disc-tag" style="color:${disc.colorVar};background:${disc.bgVar};"><span class="disc-tag__dot" style="background:${disc.colorVar};"></span>${escapeHtml(disc.short)}</span></td>
                      <td class="mono" style="font-size:0.74rem;color:var(--ink-secondary);">${escapeHtml(a.aiParadigm)}</td>
                      <td class="mono" style="text-align:right;font-weight:600;">${a.compositeScore.toFixed(1)}</td>
                    </tr>
                  `;
                  })
                  .join('')}
              </tbody>
            </table>
          </div>
        </section>

        <!-- 8. Visualizations -->
        <section class="meth-section" id="visualizations" aria-labelledby="h-viz">
          <div class="meth-section__eyebrow">Section 08</div>
          <h2 class="meth-section__title" id="h-viz">How Each Visualization Encodes the Data</h2>
          <div class="meth-two-col">
            <div class="meth-card">
              <h3>Impact Index (Leaderboard)</h3>
              <p class="meth-prose-sm">Ranks all matching breakthroughs live from your active weights, with one-click switching to reverse-chronological (<code>Most Recent</code>) or chronological order. Mini vertical bars visualize each entry’s 4 sub-scores (<code>D · R · V · A</code>) inline.</p>
              <a class="meth-link" href="./">Open Impact Index →</a>
            </div>
            <div class="meth-card">
              <h3>Impact × Time Map</h3>
              <p class="meth-prose-sm">Plots announcement date against composite Impact (or any individual sub-score) with interactive box-zoom, pan mode, time presets (including <code>Q4 2026</code>), <code>Split</code> vs. <code>Linear</code> time scaling, and <code>Auto</code> vs. <code>0–100</code> Y-scaling. Symbolic pioneers appear as diamonds (<code>◆</code>); neural &amp; neuro-symbolic milestones as circles (<code>●</code>); outer rings denote formal verification.</p>
              <a class="meth-link" href="./?view=timeline">Open Impact × Time Map →</a>
            </div>
            <div class="meth-card">
              <h3>Acceleration Curve</h3>
              <p class="meth-prose-sm">Pairs stacked breakthrough bars (grouped <strong>By Paradigm</strong>, <strong>By AI Role</strong>, or <strong>By Discipline</strong>) with a cumulative curve supporting <code>Linear</code> or <code>Log</code> right-axis scaling, switchable cadence (<code>Era + Qtr</code>, <code>Annual</code>, <code>2024–26 Qtr</code>, <code>2026 Monthly</code>), and cumulative <code>Count</code>, <code>Human Yrs</code>, or <code>Impact Sum</code> overlays.</p>
              <a class="meth-link" href="./?view=velocity">Open Acceleration Curve →</a>
            </div>
            <div class="meth-card">
              <h3>Influence Graph (Catalyst DAG)</h3>
              <p class="meth-prose-sm">Maps documented causal dependencies (<code>enables</code> edges) across five chronological columns with smooth pan &amp; zoom and <code>Full Chain</code> vs. <code>1-Hop</code> highlighting, tracing how earlier architectures and provers unlocked downstream breakthroughs.</p>
              <a class="meth-link" href="./?view=lineage">Open Influence Graph →</a>
            </div>
          </div>
        </section>

        <!-- 9. Open Governance & Reproducibility -->
        <section class="meth-section" id="governance" aria-labelledby="h-gov">
          <div class="meth-section__eyebrow">Section 09</div>
          <h2 class="meth-section__title" id="h-gov">Schema Validation, Audits &amp; Open-Source Governance</h2>
          <p class="meth-prose">
            Every breakthrough lives as its own human-readable JSON file under <code>data/entries/&lt;year&gt;/&lt;id&gt;.json</code> alongside <code>data/meta.json</code> (MIT License), compiled at build time into a lightweight edge index plus lazy-loaded per-entry dossiers and a single-file open-data download (<code>/data/breakthroughs.json</code>). Every commit and pull request is automatically validated by GitHub Actions against <code>data/schema.json</code> via <code>scripts/validate-data.mjs</code>—enforcing valid ISO dates, strict AI-only provenance, required <code>aiParadigm</code> and <code>aiSystem</code> fields, bounded 0–100 sub-scores, primary source URLs, and referential integrity across every <code>enables</code> lineage edge.
          </p>
          <div class="meth-cta-row">
            <a class="nav-btn nav-btn--primary" href="${REPO_URL}/issues/new?template=submit-breakthrough.yml" target="_blank" rel="noopener noreferrer">Submit a New AI-Enabled Breakthrough</a>
            <a class="nav-btn" href="${REPO_URL}/issues/new?template=challenge-score.yml" target="_blank" rel="noopener noreferrer">Challenge / Update a Score or Audit Status</a>
            <a class="nav-btn" href="${REPO_URL}/tree/main/data/entries" target="_blank" rel="noopener noreferrer">Browse Entry Files</a>
            <a class="nav-btn" href="./data/breakthroughs.json" target="_blank" rel="noopener noreferrer">Download Full JSON</a>
            <a class="nav-btn" href="./">← Return to Live Index</a>
          </div>
        </section>
      </div>
    </main>

    <footer class="site-footer">
      <div class="container site-footer__inner">
        <div>
          <strong>Novum Index</strong> · Open-source AI-for-science ledger (MIT License) · Updated ${escapeHtml(dataset.meta.lastUpdated)}
        </div>
        <div class="site-footer__links">
          <a href="./">Live Index</a>
          <a href="./models.html">AI Systems &amp; Models</a>
          <a href="${REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub Repository</a>
          <a href="${REPO_URL}/blob/main/METHODOLOGY.md" target="_blank" rel="noopener noreferrer">Methodology Markdown</a>
          <a href="${REPO_URL}/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contribute Data</a>
        </div>
      </div>
    </footer>
  `;
}

export function mountMethodologyPage(loadedDataset) {
  dataset = loadedDataset;
  DEFAULT_WEIGHTS = { ...dataset.meta.defaultWeights };
  currentTheme = loadInitialTheme();
  applyTheme(currentTheme);

  const controller = new AbortController();
  const { signal } = controller;
  const app = document.getElementById('app');

  renderMethodologyPage();

  app?.addEventListener(
    'click',
    (e) => {
      const themeBtn = e.target.closest('#theme-toggle-btn');
      if (themeBtn) {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(currentTheme, { persist: true });
        if (dataset) renderMethodologyPage();
      }
    },
    { signal }
  );

  subscribeThemeSync(
    (nextTheme) => {
      if (nextTheme === currentTheme) return;
      currentTheme = nextTheme;
      if (dataset) renderMethodologyPage();
    },
    { signal }
  );

  return () => {
    controller.abort();
  };
}
