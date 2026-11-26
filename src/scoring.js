/**
 * The Frontier Index — Dynamic Impact Scoring & Presets Engine
 *
 * Computes composite 0–100 impact scores from four transparent dimensions:
 *   - foundational: Foundational Depth
 *   - ripple:       Cross-Field Ripple
 *   - verification: Verification & Rigor
 *   - velocity:     Discovery Velocity
 */

export const DIMENSIONS = [
  {
    key: 'foundational',
    label: 'Foundational Depth',
    shortLabel: 'Depth',
    description: 'Resolves a landmark open problem, overturns core assumptions, or establishes a new paradigm.',
  },
  {
    key: 'ripple',
    label: 'Cross-Field Ripple',
    shortLabel: 'Ripple',
    description: 'Unlocks downstream breakthroughs, cryptography, medicine, computation, or engineering.',
  },
  {
    key: 'verification',
    label: 'Verification & Rigor',
    shortLabel: 'Rigor',
    description: 'Machine-checked Lean proof or peer-reviewed replication vs. unverified or contested preprint.',
  },
  {
    key: 'velocity',
    label: 'Discovery Velocity',
    shortLabel: 'Velocity',
    description: 'Magnitude of acceleration relative to historical pace (e.g., AI compressing decades into weeks).',
  },
];

export const WEIGHT_PRESETS = [
  {
    id: 'balanced',
    label: 'Editorial Default',
    description: 'Balanced emphasis on foundational depth with strong rigor and cross-field impact.',
    weights: { foundational: 35, ripple: 25, verification: 20, velocity: 20 },
  },
  {
    id: 'formalist',
    label: 'Strict Formalists',
    description: 'Prioritizes machine-verified proofs and replicated consensus over early preprints.',
    weights: { foundational: 30, ripple: 15, verification: 45, velocity: 10 },
  },
  {
    id: 'applied',
    label: 'Real-World Ripple',
    description: 'Rewards discoveries reshaping medicine, security, hardware, and everyday science.',
    weights: { foundational: 20, ripple: 50, verification: 15, velocity: 15 },
  },
  {
    id: 'acceleration',
    label: 'AI Inflection',
    description: 'Highlights breakthroughs demonstrating the sharpest compression in time-to-discovery.',
    weights: { foundational: 25, ripple: 20, verification: 10, velocity: 45 },
  },
];

export const DISCIPLINE_META = {
  Mathematics: {
    key: 'math',
    short: 'Math',
    colorVar: 'var(--disc-math)',
    bgVar: 'var(--disc-math-bg)',
  },
  'Computer Science & AI': {
    key: 'cs',
    short: 'CS & AI',
    colorVar: 'var(--disc-cs)',
    bgVar: 'var(--disc-cs-bg)',
  },
  'Physics & Quantum': {
    key: 'physics',
    short: 'Physics',
    colorVar: 'var(--disc-physics)',
    bgVar: 'var(--disc-physics-bg)',
  },
  'Biology & Medicine': {
    key: 'bio',
    short: 'Biology',
    colorVar: 'var(--disc-bio)',
    bgVar: 'var(--disc-bio-bg)',
  },
  'Chemistry & Materials': {
    key: 'chem',
    short: 'Chem & Mat',
    colorVar: 'var(--disc-chem)',
    bgVar: 'var(--disc-chem-bg)',
  },
};

export const STATUS_META = {
  'Formally Verified': {
    key: 'verified',
    short: 'Formally Verified',
    colorVar: 'var(--status-verified)',
    bgVar: 'var(--status-verified-bg)',
  },
  'Peer-Reviewed': {
    key: 'reviewed',
    short: 'Peer-Reviewed',
    colorVar: 'var(--status-reviewed)',
    bgVar: 'var(--status-reviewed-bg)',
  },
  'Preprint / Active Review': {
    key: 'preprint',
    short: 'Active Review',
    colorVar: 'var(--status-preprint)',
    bgVar: 'var(--status-preprint-bg)',
  },
  'Contested / Partial': {
    key: 'contested',
    short: 'Contested / Partial',
    colorVar: 'var(--status-contested)',
    bgVar: 'var(--status-contested-bg)',
  },
};

/**
 * Normalize an arbitrary weights object so positive weights sum to 1.
 */
export function normalizeWeights(weights) {
  const total = DIMENSIONS.reduce((acc, d) => acc + Math.max(0, Number(weights[d.key]) || 0), 0);
  if (total <= 0) {
    return { foundational: 0.35, ripple: 0.25, verification: 0.2, velocity: 0.2 };
  }
  const out = {};
  for (const d of DIMENSIONS) {
    out[d.key] = Math.max(0, Number(weights[d.key]) || 0) / total;
  }
  return out;
}

/**
 * Compute weighted composite score (0–100, rounded to 1 decimal).
 */
export function computeCompositeScore(scores, weights) {
  const w = normalizeWeights(weights);
  const raw =
    scores.foundational * w.foundational +
    scores.ripple * w.ripple +
    scores.verification * w.verification +
    scores.velocity * w.velocity;
  return Math.round(raw * 10) / 10;
}

/**
 * Return a ranked copy of breakthroughs sorted by composite score (desc),
 * breaking ties by date (desc) then foundational depth (desc).
 */
export function rankBreakthroughs(items, weights) {
  const scored = items.map((item) => ({
    ...item,
    compositeScore: computeCompositeScore(item.scores, weights),
  }));

  scored.sort((a, b) => {
    if (b.compositeScore !== a.compositeScore) return b.compositeScore - a.compositeScore;
    if (b.scores.foundational !== a.scores.foundational) {
      return b.scores.foundational - a.scores.foundational;
    }
    return b.date.localeCompare(a.date);
  });

  return scored.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));
}

export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatMonthYear(isoDate) {
  const [y, m] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, 1));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
