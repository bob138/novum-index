# The Frontier Index

**An open-source interactive website tracking, visualizing, and transparently impact-ranking the exponential rise of AI-assisted and AI-led breakthroughs across Mathematics, Computer Science, Physics, Biology, and Chemistry/Materials.**

> Rapidly advancing AI reasoning models, autonomous multi-agent loops, and formal proof assistants (Lean 4) have triggered an exponential surge in scientific output—with major results increasingly posted directly to GitHub, arXiv, and X well before traditional journal publication. **The Frontier Index** tracks exclusively AI-assisted and AI-led discoveries, separating machine-verified theorems and replicated discoveries from early preprints and contested claims.

![The Frontier Index Editorial Cover](./public/og-card.jpg)

## Features

- **AI-Only Impact, Paradigm & Chronological Tracker**: Curates 68 AI-assisted and autonomous AI breakthroughs across 5 core disciplines—contrasting 3 pre-2020 symbolic AI pioneers (Robbins Conjecture 1996, Robot Scientist Adam 2009, Boolean Pythagorean Triples 2016) and 8 early neural anchors (2020–2023, starting with Halicin and AlphaFold 2) against 57 breakthroughs from the 2024–2026 neural and neuro-symbolic wave.
- **Interactive Rubric Weight Tuner**: Adjust the four scoring weights live (or try presets like *Strict Formalists*, *Real-World Ripple*, or *AI Inflection*) and copy a shareable URL encoding your exact custom ranking.
- **Explicit Verification Tiers & Early Open-Internet Tracking**: Every milestone is labeled `Formally Verified`, `Peer-Reviewed`, `Preprint / Active Review`, or `Contested / Partial` alongside candid caveats—capturing both *Nature* landmarks and newly posted X/GitHub/Lean discoveries (such as the Lean-verified disproof of the Caiolo–Ferroni–Hoster conjecture).
- **Interactive Data Visualizations**:
  - **AI Impact × Time Landscape**: Interactive scatter map contrasting 2020–2023 AI anchors against the dense 2024–2026 wave and Q4 2026 surge.
  - **AI Scientific Acceleration & Cumulative Growth Curve**: Annual 2020–2023 anchors + quarterly 2024–2026 cadence bars (`AI-Assisted` vs. `Autonomous AI`, or by Discipline) paired with the cumulative AI breakthrough growth curve.
  - **AI-for-Science Catalyst Network**: 4-column chronological DAG tracing how 2020–2023 AI anchors and 2024–2025 foundations catalyzed 2026 breakthroughs.
- **Deep-Dive Breakthrough Dossiers**: Click any entry for plain-English + technical summaries, written rationale for every sub-score, lineage navigation, primary source links (including arXiv, Lean repos, and X announcements), and direct `#breakthrough/<id>` share links.
- **Editorial Craft**: Archival warm-paper light theme + obsidian dark mode, responsive layout, zero heavy framework dependencies.

## Quick Start

```bash
npm install
npm run validate   # Validates data/breakthroughs.json against the schema & lineage graph
npm run dev        # Starts local Vite dev server
npm run build      # Builds static production bundle to dist/
```

## Contributing a Breakthrough or Challenging a Score

This project is open source and designed for community curation:

- **No coding required**: Open a [Submit a Breakthrough](../../issues/new?template=submit-breakthrough.yml) or [Challenge a Score / Verification Status](../../issues/new?template=challenge-score.yml) issue.
- **Pull requests**: Edit [`data/breakthroughs.json`](./data/breakthroughs.json), run `npm run validate`, and open a PR. See [CONTRIBUTING.md](./CONTRIBUTING.md) and [METHODOLOGY.md](./METHODOLOGY.md) for full guidelines.

## Deploying to GitHub Pages

This repository includes `.github/workflows/deploy.yml`. Once pushed to GitHub, enable **Settings → Pages → Source: GitHub Actions**, and every push to `main` automatically validates the dataset and publishes the live site.

## License

[MIT](./LICENSE)
