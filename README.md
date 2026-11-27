# The Novum Index

**An open-source interactive index tracking, verifying, and visualizing the exponential rise of AI-assisted and AI-led breakthroughs across Mathematics, Computer Science, Physics, Biology, and Chemistry/Materials.**

> Named after *novum* (Latin for *"the genuinely new thing"*, honoring Francis Bacon’s 1620 *Novum Organum* as AI becomes science’s new instrument), **The Novum Index** exclusively tracks AI-assisted and AI-led discoveries—separating machine-verified theorems and peer-reviewed landmarks from early preprints and contested claims posted directly to GitHub, arXiv, and X.

![The Novum Index Editorial Cover](./public/og-card.jpg)

## Features

- **AI-Only Impact, Paradigm & Chronological Tracker**: Curates 186 AI-enabled scientific breakthroughs (AI-assisted and autonomous) across 5 core disciplines and 57 years (1969–2026)—contrasting an exhaustive 44-entry pre-2020 baseline of symbolic theorem provers, expert systems, SAT solvers, and early neural pioneers (SAM V 1969 through AlphaFold 1 & SpliceAI 2019) and 23 early 2020–2023 landmarks (Halicin, FermiNet, AlphaFold 2) against 119 breakthroughs from the 2024–2026 neural and neuro-symbolic wave.
- **AI Systems & Model Rankings Ledger (`models.html`)**: Compares cumulative impact, breakthrough volume, average quality, peak discoveries, formal verification rates, and autonomy across model families, specific neural networks, neuro-symbolic provers, labs, and classical symbolic AIs with Nature Index–style fractional (`1/k`) credit.
- **Interactive Rubric Weight Tuner**: Adjust the four scoring weights live (or try presets like *Strict Formalists*, *Real-World Ripple*, or *AI Inflection*) and copy a shareable URL encoding your exact custom ranking.
- **Explicit Verification Tiers & Early Open-Internet Tracking**: Every milestone is labeled `Formally Verified`, `Peer-Reviewed`, `Preprint / Active Review`, or `Contested / Partial` alongside candid caveats—capturing both *Nature* landmarks and newly posted X/GitHub/Lean discoveries (such as the Lean-verified disproof of the Caiolo–Ferroni–Hoster conjecture).
- **Interactive Data Visualizations**:
  - **AI Impact × Time Landscape**: Interactive scatter map with drag-to-box-zoom, pan mode, time zoom presets (including `Q4 2026`), `Split` vs. `Linear` time axis, selectable Y-axis metrics, `Auto` vs. `0–100` Y-scaling, live crosshairs, and legend highlighting.
  - **AI Scientific Acceleration & Paradigm Shift Curve**: Stacked bars + cumulative growth curve with switchable cadence (`Era + Qtr`, `Annual`, `2024–26 Qtr`, `2026 Monthly`), `Linear` vs. `Log` scale, cumulative metric toggles (`Count`, `Human Yrs`, `Impact Sum`), and rich column tooltips.
  - **AI-for-Science Catalyst Network**: 5-column chronological DAG with smooth pan & zoom, `Full Chain` vs. `1-Hop` transitive lineage highlighting, and floating node previews.
- **Deep-Dive Breakthrough Dossiers**: Click any entry for plain-English + technical summaries, written rationale for every sub-score, lineage navigation, primary source links (including arXiv, Lean repos, and X announcements), and direct `#breakthrough/<id>` share links.
- **Editorial Craft**: Archival warm-paper light theme + true OLED black dark mode (defaulting to OS theme preference), responsive layout, zero heavy framework dependencies.

## Quick Start

```bash
npm install
npm run validate   # Validates data/meta.json & data/entries/<year>/<id>.json against the schema & lineage graph
npm run dev        # Compiles split static JSON to public/data/ and starts local Vite dev server
npm run build      # Compiles public/data/ (index.json + per-entry dossiers + breakthroughs.json) and builds dist/
```

## Contributing a Breakthrough or Challenging a Score

This project is open source and designed for community curation:

- **No coding required**: Open a [Submit a Breakthrough](../../issues/new?template=submit-breakthrough.yml) or [Challenge a Score / Verification Status](../../issues/new?template=challenge-score.yml) issue.
- **Pull requests**: Add or edit a single file under [`data/entries/`](./data/entries/) (`data/entries/<year>/<id>.json`), update [`data/meta.json`](./data/meta.json), run `npm run validate`, and open a PR. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [METHODOLOGY.md](./METHODOLOGY.md) for full guidelines.

## Deploying to Cloudflare Workers

Live site: **[novumindex.org](https://novumindex.org/)**

This repository is deployed via **Cloudflare Workers Static Assets** configured in [`wrangler.jsonc`](./wrangler.jsonc) (`assets.directory: "./dist"`, custom domains `novumindex.org` and `www.novumindex.org`). At build time, `scripts/build-data.mjs` compiles `data/entries/` into a lightweight edge index (`/data/index.json`), lazy-loaded per-entry dossiers (`/data/dossiers/<id>.json`), and a combined MIT open-data snapshot (`/data/breakthroughs.json`). GitHub Actions (`.github/workflows/ci.yml`) validates all entries and verifies the Vite build on every push and pull request.

```bash
npm run validate && npm run build
npx wrangler deploy
```

## License

[MIT](./LICENSE)
