# Contributing to The Frontier Index

We welcome scientists, mathematicians, engineers, and curious readers to help keep **The Frontier Index** accurate, balanced, and up to date!

## Option 1: Open a GitHub Issue (No Code Needed)

- **Nominate a new breakthrough**: Use the [Submit a Breakthrough](./.github/ISSUE_TEMPLATE/submit-breakthrough.yml) form.
- **Update verification status or debate a score**: Use the [Challenge / Update a Score](./.github/ISSUE_TEMPLATE/challenge-score.yml) form (e.g., when a preprint completes peer review or an independent audit uncovers a flaw).

## Option 2: Submit a Pull Request

All index data lives in [`data/breakthroughs.json`](./data/breakthroughs.json) and is validated against [`data/schema.json`](./data/schema.json).

1. Fork this repository and create a new branch (`git checkout -b add-my-breakthrough`).
2. Add or edit an entry in `data/breakthroughs.json`, ensuring:
   - Every claim is backed by at least one **primary verifiable URL** (arXiv, DOI/PubMed, official Lean verification statement, or lab paper).
   - `verificationStatus` accurately reflects current community consensus—do not mark unreviewed preprints as `Peer-Reviewed` or `Formally Verified`.
   - `caveats` candidly notes open limitations, scope boundaries, or pending audits.
   - `scoreRationale` justifies each of the four 0–100 sub-scores (see [METHODOLOGY.md](./METHODOLOGY.md)).
   - Update `meta.lastUpdated` to today's date (`YYYY-MM-DD`).
3. Validate locally:
   ```bash
   npm install
   npm run validate
   npm run build
   ```
4. Open a pull request describing the breakthrough, primary sources, and scoring rationale. GitHub Actions will automatically run `npm run validate` and `npm run build` on your PR.
