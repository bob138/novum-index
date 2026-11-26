# Scoring & Verification Methodology

Ranking scientific breakthroughs across pure mathematics, theoretical computer science, experimental physics, biology, and materials science is inherently imperfect. **The Novum Index** (named after *novum*—Latin for *"the genuinely new thing"*, honoring Francis Bacon’s 1620 *Novum Organum* as AI becomes science’s new instrument) makes those judgments explicit, auditable, and customizable rather than hiding them behind a black-box score.

## 1. The Four Impact Dimensions (0–100 Each)

Every breakthrough receives an integer score from `0` to `100` on four orthogonal dimensions, each accompanied by a written rationale in `data/breakthroughs.json`:

| Dimension | Default Weight | Anchoring Criteria |
| :--- | :---: | :--- |
| **Foundational Depth** (`foundational`) | **35%** | `95–100`: Resolves a Millennium-tier or century-scale landmark problem, or establishes a new foundational paradigm.<br>`85–94`: Solves a major decades-old conjecture or breaks a core theoretical/experimental threshold.<br>`75–84`: Significant conceptual advance opening a new sub-area or method. |
| **Cross-Field Ripple** (`ripple`) | **25%** | `90–100`: Immediately reshapes multiple disciplines, clinical medicine, global cryptography, or core computational tooling.<br>`80–89`: Strong downstream impact across adjacent subfields or industrial roadmaps.<br>`70–79`: Deep within its home specialty with targeted cross-field spillover. |
| **Verification & Rigor** (`verification`) | **20%** | `95–100`: Machine-checked formal proof (e.g., Lean 4 / Mathlib) with accepted definitions, or peer-reviewed & independently replicated.<br>`85–94`: Formally verified pending human exposition, or high-trust peer-reviewed venue with strong experimental telemetry.<br>`65–84`: Replicated with caveats, or Lean-checked amid active scope/priority controversy.<br>`50–64`: Credible early preprint/formalization still awaiting independent community audit. |
| **Discovery Velocity** (`velocity`) | **20%** | `90–100`: Compresses multi-decade or century-scale expected timelines into weeks/months via new AI, formal, or algorithmic methods.<br>`80–89`: Major unexpected acceleration over historical pace.<br>`70–79`: Culmination of steady, long-term human research craftsmanship. |

### Composite Formula

$$\text{Impact} = \frac{\sum_{i} w_i \cdot s_i}{\sum_{i} w_i}$$

Readers can override the weights $w_i$ interactively via the **Tune Ranking Weights** panel and share custom-weighted leaderboards via URL parameters (`?w=35,25,20,20`).

## 2. Verification Tiers

To maintain epistemic clarity during the rapid 2025–2026 wave of AI-generated research, every entry carries one of four explicit tiers:

1. **Formally Verified**: Backed by a machine-checked proof or formal artifact (e.g., Lean 4 kernel verified by independent maintainers, or exact algebraic/programmatic verification). *Note: Formal verification confirms logical validity relative to formal definitions; any remaining human-readability or definition-alignment caveats are always noted explicitly.*
2. **Peer-Reviewed**: Published in a refereed scientific journal or top-tier conference (e.g., *Nature*, *PNAS*, *NeurIPS*), officially graded by competition organizers (e.g., IMO), or independently verified and digested by named domain specialists.
3. **Preprint / Active Review**: Credible announcement accompanied by a public manuscript, GitHub repository, or X thread currently undergoing independent expert refereeing. Because frontier AI results increasingly appear online months before journal publication, capturing these early discoveries transparently is a core goal of the index.
4. **Contested / Partial**: Notable AI discovery or formal result subject to active scholarly dispute over scope, priority, specification framing, or novelty claims.

## 3. Scope, AI Paradigm & Provenance Taxonomy

**The Novum Index exclusively tracks breakthroughs with substantive AI involvement** (`AI-Assisted` or `Autonomous AI`) in order to measure and visualize the accelerating rate of AI contributions to scientific knowledge. Purely human breakthroughs—however landmark—are intentionally excluded.

### AI Paradigm (`aiParadigm`)
To contrast classical symbolic systems with modern deep learning without muddying the neural-era curve, every entry is tagged with one of three paradigms:
- **Symbolic / Classical** (1976–2019): Pre-deep-learning rule-induction systems (`Meta-DENDRAL`), automated conjecturing (`Graffiti`), theorem provers (`EQP`), SAT solvers (`Cube-and-Conquer`), and abductive logic lab robotics (`Adam`).
- **Neural / Deep Learning** (2020–2026): Deep graph neural networks, transformers, diffusion models, reinforcement learning, PINNs, and frontier LLMs operating without a formal proof kernel (e.g., Halicin, AlphaFold 2/3, GNoME, Evo 2, MatterGen).
- **Neuro-Symbolic** (2023–2026): Neural models coupled directly to symbolic deduction engines, formal proof kernels (Lean 4 / Mathlib, SMT), or programmatic evaluators (e.g., FunSearch, AlphaGeometry, AlphaProof, AlphaEvolve, Claude/GPT/Gemini Lean pipelines).

### AI Role (`aiRole`)
- **AI-Assisted**: Human researchers directing, collaborating with, or validating discoveries made using frontier AI models or specialized scientific AI architectures (e.g., Meta-DENDRAL, Halicin, AlphaFold 2/3, Claude Fable 5, Gemini 4 Carbon, GPT-6.2 Astra).
- **Autonomous AI**: Results discovered primarily via autonomous AI search, multi-agent reasoning, or evolutionary coding loops with minimal step-by-step human guidance (e.g., Graffiti, EQP, AlphaTensor, AlphaDev, FunSearch, AlphaEvolve, GPT-6 Astra's Köthe disproof, Claude's black-hole physics & ART enzyme discoveries).

## 4. Human Years Unsolved vs. AI Time-to-Solution

- `yearsUnsolved`: Recorded strictly for named open mathematical or scientific problems from the year formally posed until resolution (`null` for formalizations of already-proven theorems like Fermat's Last Theorem or general-purpose platforms so totals are never inflated).
- `aiTimeToSolve`: Recorded strictly when primary sources document the AI runtime or human–AI turnaround (e.g., `16 hours`, `1 weekend`, `6 weeks`); left `null` otherwise.

## 5. Historical Pioneers & Calibration Anchors (1976–2023)

To anchor the exponential acceleration curve and prevent recency inflation across the 2024–2026 wave, The Novum Index includes **13 historical anchor milestones** (`isAnchor: true`):
- **5 Pre-2020 Symbolic Pioneers (1976–2016)**: **Meta-DENDRAL (1976)**, **Graffiti (1986)**, **Robbins Conjecture (`EQP`, 1996)**, **Robot Scientist "Adam" (2009)**, and **Boolean Pythagorean Triples (`SAT`, 2016)**.
- **8 Early Neural Anchors (2020–2023)**: **Halicin Antibiotic Discovery (Feb 2020)**, **AlphaFold 2 (Nov 2020)**, **DeepMind Knot Theory (2021)**, **Tokamak RL Plasma Control (2022)**, **AlphaTensor (2022)**, **AlphaDev (2023)**, **GNoME (2023)**, and **FunSearch (2023)**.

See the interactive methodology page at [`https://bob138.github.io/novum-index/methodology.html`](https://bob138.github.io/novum-index/methodology.html) for live index distributions, anchor tables, and clickable weight-preset links.

