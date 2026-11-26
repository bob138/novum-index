# The Frontier Index

**An open-source interactive website tracking, visualizing, and transparently impact-ranking the most significant breakthroughs across Mathematics, Computer Science, Physics, Biology, and Chemistry/Materials.**

> Rapidly advancing AI reasoning models, formal proof assistants (Lean 4), and foundational human insight have triggered a historic acceleration in scientific output. **The Frontier Index** cuts through the noise—separating machine-verified theorems and replicated discoveries from early preprints and contested claims.

![The Frontier Index Editorial Cover](./public/og-card.jpg)

## Features

- **Transparent Impact Leaderboard**: Ranks 33 curated breakthroughs across 5 core disciplines—27 from the 2024–2026 wave calibrated against 6 landmark 2020–2023 anchors (AlphaFold 2, AlphaTensor, NIF Fusion Ignition, Aperiodic Monotile, GNoME, and FunSearch)—using a 4-axis Composite Impact Index (**Foundational Depth**, **Cross-Field Ripple**, **Verification & Rigor**, and **Discovery Velocity**).
- **Interactive Rubric Weight Tuner**: Adjust the four scoring weights live (or try presets like *Strict Formalists*, *Real-World Ripple*, or *AI Inflection*) and copy a shareable URL encoding your exact custom ranking.
- **Explicit Verification Tiers**: Every milestone is labeled `Formally Verified`, `Peer-Reviewed`, `Preprint / Active Review`, or `Contested / Partial` alongside candid caveats.
- **Interactive Data Visualizations**:
  - **Impact × Time Landscape**: Interactive scatter map contrasting 2020–2023 anchors against the 2024–2026 compression and Q4 2026 surge.
  - **Acceleration & Cumulative Impact Curve**: Annual anchors + quarterly discovery cadence grouped by AI Provenance (`Human` / `AI-Assisted` / `Autonomous AI`) or Discipline.
  - **Cross-Field Influence Graph**: 4-column chronological DAG tracing how 2020–2023 anchors and 2024–2025 foundations catalyzed 2026 breakthroughs.
- **Deep-Dive Breakthrough Dossiers**: Click any entry for plain-English + technical summaries, written rationale for every sub-score, lineage navigation, primary source links, and direct `#breakthrough/<id>` share links.
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
