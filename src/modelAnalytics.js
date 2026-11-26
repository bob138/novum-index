import { DISCIPLINE_META } from './scoring.js';

export const ARCHITECTURE_META = {
  'Neuro-Symbolic LLM + Verifier': {
    shortLabel: 'Neuro-Symbolic AI',
    colorVar: 'var(--accent-warm)',
    bgVar: 'var(--accent-warm-soft)',
    description: 'Neural models & reasoning LLMs paired with Lean 4, Coq, MCTS, symbolic regression, or lab tools.',
  },
  'Frontier Reasoning LLM': {
    shortLabel: 'Reasoning LLM',
    colorVar: 'var(--disc-math)',
    bgVar: 'var(--disc-math-bg)',
    description: 'General-purpose frontier reasoning models and multi-agent language model fleets.',
  },
  'Bio & Genomic Neural Net': {
    shortLabel: 'Bio / Genomic NN',
    colorVar: 'var(--disc-bio)',
    bgVar: 'var(--disc-bio-bg)',
    description: 'Specialized protein, antibody, structural-biology, and genomic foundation models.',
  },
  'Domain Science Neural Net': {
    shortLabel: 'Domain Science NN',
    colorVar: 'var(--disc-cs)',
    bgVar: 'var(--disc-cs-bg)',
    description: 'Physics, materials, chemistry, weather, and quantum neural networks (GNNs, diffusion, PINNs).',
  },
  'Deep RL & Evolutionary Agent': {
    shortLabel: 'Deep RL / Evolve',
    colorVar: 'var(--disc-chem)',
    bgVar: 'var(--disc-chem-bg)',
    description: 'AlphaZero-style reinforcement learning and LLM-guided evolutionary program synthesis.',
  },
  'Classical Symbolic & SAT AI': {
    shortLabel: 'Symbolic / SAT AI',
    colorVar: 'var(--ink-muted)',
    bgVar: 'var(--bg-surface-alt)',
    description: 'Pre-deep-learning automated theorem provers, SAT solvers, logic robotics, and expert systems.',
  },
};

export const PARADIGM_META = {
  'Neural / Deep Learning': {
    shortLabel: 'Neural / Deep Learning',
    colorVar: 'var(--disc-math)',
    bgVar: 'var(--disc-math-bg)',
  },
  'Neuro-Symbolic': {
    shortLabel: 'Neuro-Symbolic',
    colorVar: 'var(--accent-warm)',
    bgVar: 'var(--accent-warm-soft)',
  },
  'Symbolic / Classical': {
    shortLabel: 'Symbolic / Classical',
    colorVar: 'var(--ink-muted)',
    bgVar: 'var(--bg-surface-alt)',
  },
};

export const GROUP_BY_OPTIONS = [
  { id: 'family', label: 'Model Families' },
  { id: 'model', label: 'Specific Models' },
  { id: 'architecture', label: 'Architecture Classes' },
  { id: 'lab', label: 'Research Labs' },
];

export const RANK_BY_OPTIONS = [
  { id: 'cumulativeImpact', label: 'Cumulative Impact', shortLabel: 'Cum. Impact' },
  { id: 'volume', label: 'Breakthrough Volume', shortLabel: 'Volume' },
  { id: 'avgImpact', label: 'Average Impact', shortLabel: 'Avg Impact' },
  { id: 'peakImpact', label: 'Peak Breakthrough', shortLabel: 'Peak Score' },
  { id: 'verified', label: 'Formally Verified', shortLabel: 'Verified' },
  { id: 'autonomous', label: 'Autonomous AI-Led', shortLabel: 'Autonomous' },
  { id: 'yearsUnsolved', label: 'Years Unsolved Cracked', shortLabel: 'Yrs Unsolved' },
];

/**
 * Explicit multi-model and high-precision attributions for entries where multiple
 * AI systems jointly produced, co-solved, or independently reproduced a breakthrough,
 * or where substring matching could be ambiguous.
 */
const EXPLICIT_ATTRIBUTIONS = {
  'google-cogentic-factoring-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-argon-cogentic',
      modelName: 'Gemini 3.1 Pro / 4 Argon (Cogentic)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'null-cone-quantum-gravity-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'deepmind-mass-spec-skills-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-antigravity-skills',
      modelName: 'Gemini + Mass Spec Skills (Antigravity)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'hadwiger-covering-3d-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-carbon',
      modelName: 'Gemini 4 Carbon (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'caiolo-ferroni-hoster-disproof-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Co-Lead',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Co-Lead',
    },
  ],
  'valiant-vp-vnp-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-internal-research',
      modelName: 'Claude Internal Research & Lean 4',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Independent Co-Proof',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Independent Co-Proof',
    },
  ],
  'sharp-topological-overlap-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Primary',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Assisted',
    },
  ],
  'eth-refutation-claim-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Co-Solved',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-internal-research',
      modelName: 'Claude Internal Research & Lean 4',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Independent Verification',
    },
  ],
  'lattice-standard-model-chiral-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Primary',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Follow-Up Proof',
    },
  ],
  'borsuk-conjecture-dim63-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-series',
      modelName: 'GPT-5.2 / 5.5 Pro',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Primary',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-internal-research',
      modelName: 'Claude Internal Research & Lean 4',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Independent Reproduction',
    },
  ],
  'erdos-728-gpt52-aristotle-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-series',
      modelName: 'GPT-5.2 / 5.5 Pro',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Proof Strategy',
    },
    {
      familyId: 'harmonic-aristotle',
      familyName: 'Harmonic Aristotle',
      modelId: 'harmonic-aristotle',
      modelName: 'Harmonic Aristotle (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Harmonic',
      roleNote: 'Lean Formalization',
    },
  ],
  'imo-2025-gold-natural-language': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-deep-think',
      modelName: 'Gemini Deep Think / Aletheia',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Google DeepMind & Research',
      roleNote: 'Co-Gold',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Co-Gold',
    },
  ],
  'alphaevolve-67-math-problems-2025': [
    {
      familyId: 'alphaevolve-funsearch',
      familyName: 'AlphaEvolve & FunSearch',
      modelId: 'alphaevolve',
      modelName: 'AlphaEvolve',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
      roleNote: 'Evolutionary Search',
    },
    {
      familyId: 'alphaproof-alphageometry',
      familyName: 'AlphaProof & AlphaGeometry',
      modelId: 'alphaproof',
      modelName: 'AlphaProof',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
      roleNote: 'Lean Verification',
    },
  ],
  'virtual-lab-nanobodies-2025': [
    {
      familyId: 'virtual-lab',
      familyName: 'The Virtual Lab (Stanford / CZ Biohub)',
      modelId: 'virtual-lab',
      modelName: 'The Virtual Lab (Multi-Agent LLM + ESM/AF)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Stanford / CZ Biohub',
    },
  ],
  'sub-100k-qubit-qec-2026': [
    {
      familyId: 'qec-circuit-synthesis',
      familyName: 'AI QEC Circuit & Code Synthesis',
      modelId: 'qec-circuit-synthesis',
      modelName: 'AI Circuit & QEC Code Synthesis',
      architecture: 'Domain Science Neural Net',
      lab: 'Google Quantum AI / IBM / Academic',
    },
  ],
  'unstable-singularities-pinns-2025': [
    {
      familyId: 'high-precision-pinns',
      familyName: 'High-Precision PINNs',
      modelId: 'high-precision-pinns',
      modelName: 'High-Precision PINNs + Gauss–Newton',
      architecture: 'Domain Science Neural Net',
      lab: 'NYU / Google DeepMind / Brown',
    },
  ],
  'coscientist-autonomous-chemistry-2023': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'coscientist-gpt4',
      modelName: 'Coscientist (GPT-4 + Cloud Lab)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Carnegie Mellon University',
    },
  ],
  'erdos-1196-gpt54-gauss-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-4-pro',
      modelName: 'GPT-5.4 Pro',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Proof Discovery',
    },
    {
      familyId: 'gauss-math-inc',
      familyName: 'Gauss (Math, Inc.)',
      modelId: 'gauss-math-inc',
      modelName: 'Gauss Autoformalization Agent',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Math, Inc.',
      roleNote: 'Lean 4 Formalization',
    },
  ],
  'bindcraft-oneshot-binders-2025': [
    {
      familyId: 'bindcraft-epfl',
      familyName: 'BindCraft (EPFL)',
      modelId: 'bindcraft',
      modelName: 'BindCraft (AF2 Backprop + ProteinMPNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'EPFL',
    },
  ],
  'z-diophantine-in-q-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Initial Proof & Quartic',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Auditing & Reductions',
    },
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-carbon',
      modelName: 'Gemini 4 Carbon (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
      roleNote: '229-Var Detector',
    },
  ],
  'bounded-prime-gaps-212-182-2026': [
    {
      familyId: 'axiomprover',
      familyName: 'AxiomProver (Axiom Math)',
      modelId: 'axiomprover',
      modelName: 'AxiomProver Multi-Agent Swarm',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Axiom Math',
      roleNote: '212 Lean Certificate',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: '186 & 182 Conditional Lean',
    },
  ],
  'qma2-qma-oracle-separation-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-6-sol',
      modelName: 'GPT-5.6 Sol / Pro',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Quantum Oracle & No-Disentanglers',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Classical Oracle',
    },
  ],
  'mckean-boltzmann-entropy-disproof-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-6-sol',
      modelName: 'GPT-5.6 Sol / Pro',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Proof Discovery',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-code-agents',
      modelName: 'Claude Code Agents',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Rewrite & Verification',
    },
  ],
  'quantum-parallel-repetition-astra10-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: '10-Problem Lean Release',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: '5/10 24h Reproduction',
    },
  ],
  'imo-2026-perfect-42-lean-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: '42/42 in 1.8h',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-6-sol',
      modelName: 'GPT-5.6 Sol / Pro',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Full Lean 4 P1–P6',
    },
    {
      familyId: 'moonshot-kimi',
      familyName: 'Moonshot Kimi Lineage',
      modelId: 'kimi-k3',
      modelName: 'Kimi K3',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Moonshot AI',
      roleNote: '42/42 + P6 Proof',
    },
  ],
  'zeta-5-irrationality-lean-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: '29.4K-Line Lean Formalization',
    },
  ],
};

/**
 * Deterministically classifies every breakthrough in data/breakthroughs.json into
 * one or more attributed AI systems with normalized family, specific model,
 * architecture class, and developer lab metadata.
 */
export function classifyBreakthroughSystems(item) {
  if (EXPLICIT_ATTRIBUTIONS[item.id]) {
    return EXPLICIT_ATTRIBUTIONS[item.id];
  }

  const s = (item.aiSystem || '').toLowerCase();
  const isNeuroSym = item.aiParadigm === 'Neuro-Symbolic';
  const llmArch = isNeuroSym ? 'Neuro-Symbolic LLM + Verifier' : 'Frontier Reasoning LLM';

  // OpenAI GPT Lineage
  if (s.includes('gpt-6')) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'gpt-6-astra',
        modelName: 'GPT-6 / 6.2 Astra',
        architecture: llmArch,
        lab: 'OpenAI',
      },
    ];
  }
  if (s.includes('gpt-5.6')) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'gpt-5-6-sol',
        modelName: 'GPT-5.6 Sol / Pro',
        architecture: llmArch,
        lab: 'OpenAI',
      },
    ];
  }
  if (s.includes('gpt-5.2') || s.includes('gpt-5.5')) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'gpt-5-series',
        modelName: 'GPT-5.2 / 5.5 Pro',
        architecture: llmArch,
        lab: 'OpenAI',
      },
    ];
  }
  if (
    s.includes('openai internal') ||
    s.includes('openai frontier')
  ) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'openai-internal-math',
        modelName: 'OpenAI Internal Frontier Math',
        architecture: llmArch,
        lab: 'OpenAI',
      },
    ];
  }
  if (s.includes('openai codex')) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'openai-codex-agent',
        modelName: 'OpenAI Codex Agent',
        architecture: llmArch,
        lab: 'OpenAI',
      },
    ];
  }
  if (s.includes('openai chatgpt')) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'openai-chatgpt-reasoning',
        modelName: 'OpenAI ChatGPT (Reasoning)',
        architecture: llmArch,
        lab: 'OpenAI',
      },
    ];
  }

  // Anthropic Claude Lineage
  if (s.includes('claude mythos')) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-mythos-5',
        modelName: 'Claude Mythos 5 + OpenEvolve',
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Anthropic',
      },
    ];
  }
  if (s.includes('claude fable')) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-fable-5',
        modelName: 'Claude Fable 5 / 5.2',
        architecture: llmArch,
        lab: 'Anthropic',
      },
    ];
  }
  if (s.includes('claude opus 5.5')) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-opus-5-5',
        modelName: 'Claude Opus 5.5',
        architecture: llmArch,
        lab: 'Anthropic',
      },
    ];
  }
  if (s.includes('claude opus 4.6')) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-opus-4-6',
        modelName: 'Claude Opus 4.6',
        architecture: llmArch,
        lab: 'Anthropic',
      },
    ];
  }
  if (s.includes('claude opus 4.5')) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-opus-4-5',
        modelName: 'Claude Opus 4.5 + Claude Code',
        architecture: llmArch,
        lab: 'Anthropic',
      },
    ];
  }
  if (s.includes('claude biology') || s.includes('biology research lab')) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-biology-agents',
        modelName: 'Claude Biology Research Agents',
        architecture: 'Frontier Reasoning LLM',
        lab: 'Anthropic',
      },
    ];
  }
  if (
    s.includes('claude') ||
    s.includes('unreleased anthropic') ||
    s.includes('anthropic clique')
  ) {
    return [
      {
        familyId: 'anthropic-claude',
        familyName: 'Anthropic Claude Lineage',
        modelId: 'claude-internal-research',
        modelName: 'Claude Internal Research & Lean 4',
        architecture: llmArch,
        lab: 'Anthropic',
      },
    ];
  }

  // Google Gemini & Gemma Lineage
  if (s.includes('gemini 4')) {
    return [
      {
        familyId: 'google-gemini',
        familyName: 'Google Gemini & Gemma',
        modelId: 'gemini-4-series',
        modelName: 'Gemini 4 (Argon / Agent Teams)',
        architecture: llmArch,
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('aletheia') || s.includes('deep think')) {
    return [
      {
        familyId: 'google-gemini',
        familyName: 'Google Gemini & Gemma',
        modelId: 'gemini-deep-think',
        modelName: 'Gemini Deep Think / Aletheia',
        architecture: llmArch,
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('google ai co-scientist')) {
    return [
      {
        familyId: 'google-gemini',
        familyName: 'Google Gemini & Gemma',
        modelId: 'google-ai-coscientist',
        modelName: 'Google AI Co-Scientist (Gemini 2.0)',
        architecture: 'Frontier Reasoning LLM',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('c2s-scale')) {
    return [
      {
        familyId: 'google-gemini',
        familyName: 'Google Gemini & Gemma',
        modelId: 'c2s-scale-gemma',
        modelName: 'C2S-Scale 27B (Gemma)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // AlphaFold Structural Biology Lineage
  if (s.includes('alphafold 2')) {
    return [
      {
        familyId: 'alphafold',
        familyName: 'AlphaFold Structural Suite',
        modelId: 'alphafold-2',
        modelName: 'AlphaFold 2',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('alphafold 3')) {
    return [
      {
        familyId: 'alphafold',
        familyName: 'AlphaFold Structural Suite',
        modelId: 'alphafold-3',
        modelName: 'AlphaFold 3',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('alphamissense')) {
    return [
      {
        familyId: 'alphafold',
        familyName: 'AlphaFold Structural Suite',
        modelId: 'alphamissense',
        modelName: 'AlphaMissense',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('alphaproteo')) {
    return [
      {
        familyId: 'alphafold',
        familyName: 'AlphaFold Structural Suite',
        modelId: 'alphaproteo',
        modelName: 'AlphaProteo',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // AlphaGenome Lineage
  if (s.includes('alphagenome')) {
    const isV2 = s.includes('alphagenome 2');
    return [
      {
        familyId: 'alphagenome',
        familyName: 'AlphaGenome Regulatory Suite',
        modelId: isV2 ? 'alphagenome-2' : 'alphagenome-1',
        modelName: isV2 ? 'AlphaGenome 2' : 'AlphaGenome',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // AlphaProof & AlphaGeometry Lineage
  if (
    s.includes('alphaproof') ||
    s.includes('alphageometry') ||
    s.includes('formal proof search agent')
  ) {
    let modelId = 'alphaproof';
    let modelName = 'AlphaProof & AlphaGeometry 2';
    if (s.includes('alphaproof code')) {
      modelId = 'alphaproof-code';
      modelName = 'AlphaProof Code';
    } else if (s.includes('alphageometry') && !s.includes('alphaproof')) {
      modelId = 'alphageometry';
      modelName = 'AlphaGeometry';
    } else if (s.includes('formal proof search agent')) {
      modelId = 'deepmind-formal-proof-agent';
      modelName = 'DeepMind Formal Proof Search Agent';
    }
    return [
      {
        familyId: 'alphaproof-alphageometry',
        familyName: 'AlphaProof & AlphaGeometry',
        modelId,
        modelName,
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // AlphaEvolve & FunSearch Evolutionary Lineage
  if (s.includes('alphaevolve') || s.includes('funsearch')) {
    const isFun = s.includes('funsearch');
    return [
      {
        familyId: 'alphaevolve-funsearch',
        familyName: 'AlphaEvolve & FunSearch',
        modelId: isFun ? 'funsearch' : 'alphaevolve',
        modelName: isFun ? 'FunSearch' : 'AlphaEvolve',
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // DeepMind AlphaZero / Deep RL Lineage
  if (
    s.includes('alphatensor') ||
    s.includes('alphadev') ||
    s.includes('alphachip') ||
    s.includes('deep rl magnetic')
  ) {
    const label = item.aiSystem.split('(')[0].trim();
    return [
      {
        familyId: 'deepmind-deep-rl',
        familyName: 'DeepMind Deep RL (AlphaZero Lineage)',
        modelId: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        modelName: label,
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // Standalone Google DeepMind Domain Science Neural Nets
  if (s.includes('gnome')) {
    return [
      {
        familyId: 'gnome',
        familyName: 'GNoME (Graph Neural Materials)',
        modelId: 'gnome',
        modelName: 'GNoME',
        architecture: 'Domain Science Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('graphcast')) {
    return [
      {
        familyId: 'graphcast-gencast',
        familyName: 'GraphCast & GenCast',
        modelId: 'graphcast-gencast',
        modelName: 'GraphCast (GNN) & GenCast (Diffusion)',
        architecture: 'Domain Science Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('alphaqubit')) {
    return [
      {
        familyId: 'alphaqubit',
        familyName: 'AlphaQubit',
        modelId: 'alphaqubit',
        modelName: 'AlphaQubit (Neural QEC Decoder)',
        architecture: 'Domain Science Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('ferminet')) {
    return [
      {
        familyId: 'ferminet',
        familyName: 'FermiNet',
        modelId: 'ferminet',
        modelName: 'FermiNet (Neural Wavefunction)',
        architecture: 'Domain Science Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('attribution neural')) {
    return [
      {
        familyId: 'deepmind-knot-nn',
        familyName: 'DeepMind Attribution Neural Nets',
        modelId: 'deepmind-knot-nn',
        modelName: 'DeepMind Attribution Neural Nets',
        architecture: 'Domain Science Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // Dedicated Formal Verification & Autoformalization Systems
  if (s.includes('gauss autoformalization')) {
    return [
      {
        familyId: 'gauss-math-inc',
        familyName: 'Gauss (Math, Inc.)',
        modelId: 'gauss-math-inc',
        modelName: 'Gauss Autoformalization Agent',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'Math, Inc.',
      },
    ];
  }
  if (s.includes('axiomprover')) {
    return [
      {
        familyId: 'axiomprover',
        familyName: 'AxiomProver (Axiom Math)',
        modelId: 'axiomprover',
        modelName: 'AxiomProver Multi-Agent Swarm',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'Axiom Math',
      },
    ];
  }

  // Bio / Chemistry / Materials / Physics / Astronomy Specialized Neural Nets
  if (s.includes('gpt-4b micro')) {
    return [
      {
        familyId: 'openai-gpt',
        familyName: 'OpenAI GPT Lineage',
        modelId: 'gpt-4b-micro',
        modelName: 'GPT-4b micro (Biology LLM)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'OpenAI',
      },
    ];
  }
  if (s.includes('mit collins lab generative')) {
    return [
      {
        familyId: 'mit-collins-antibiotics-ai',
        familyName: 'MIT Collins Antibiotics-AI & Chemprop',
        modelId: 'mit-generative-antibiotics',
        modelName: 'MIT Generative Fragment/Atom Antibiotic AI',
        architecture: 'Domain Science Neural Net',
        lab: 'MIT / Broad / McMaster',
      },
    ];
  }
  if (s.includes('explainable substructure gnn')) {
    return [
      {
        familyId: 'mit-collins-antibiotics-ai',
        familyName: 'MIT Collins Antibiotics-AI & Chemprop',
        modelId: 'chemprop-explainable-gnn',
        modelName: 'Chemprop Explainable Substructure GNN',
        architecture: 'Domain Science Neural Net',
        lab: 'MIT / Broad / McMaster',
      },
    ];
  }
  if (s.includes('chemprop')) {
    return [
      {
        familyId: 'mit-collins-antibiotics-ai',
        familyName: 'MIT Collins Antibiotics-AI & Chemprop',
        modelId: 'chemprop-gnn',
        modelName: 'Chemprop Directed MPNN',
        architecture: 'Domain Science Neural Net',
        lab: 'MIT / Broad / McMaster',
      },
    ];
  }
  if (s.includes('rfantibody')) {
    return [
      {
        familyId: 'rosettafold-rfdiffusion',
        familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
        modelId: 'rfantibody',
        modelName: 'RFantibody (Fine-Tuned RFdiffusion)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'University of Washington (IPD)',
      },
    ];
  }
  if (s.includes('rfdiffusion')) {
    return [
      {
        familyId: 'rosettafold-rfdiffusion',
        familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
        modelId: 'rfdiffusion',
        modelName: 'RFdiffusion (SE(3) Diffusion)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'University of Washington (IPD)',
      },
    ];
  }
  if (s.includes('rosettafold')) {
    return [
      {
        familyId: 'rosettafold-rfdiffusion',
        familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
        modelId: 'rosettafold',
        modelName: 'RoseTTAFold (3-Track SE(3) Network)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'University of Washington (IPD)',
      },
    ];
  }
  if (s.includes('esmfold')) {
    return [
      {
        familyId: 'esm-suite',
        familyName: 'ESM Protein Language Suite (Meta / EvoScale)',
        modelId: 'esmfold',
        modelName: 'ESMFold (15B ESM-2 PLM)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Meta FAIR',
      },
    ];
  }
  if (s.includes('esm3')) {
    return [
      {
        familyId: 'esm-suite',
        familyName: 'ESM Protein Language Suite (Meta / EvoScale)',
        modelId: 'esm3',
        modelName: 'ESM3 (98B Multimodal PLM)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'EvolutionaryScale / Arc',
      },
    ];
  }
  if (s.includes('evo 1 & evo 2')) {
    return [
      {
        familyId: 'evo-suite',
        familyName: 'Evo Genome Suite (Arc Institute)',
        modelId: 'evo-phage-generator',
        modelName: 'Evo 1 & Evo 2 Phage Generator',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Arc Institute / Stanford / NVIDIA',
      },
    ];
  }
  if (s.includes('evo 2')) {
    return [
      {
        familyId: 'evo-suite',
        familyName: 'Evo Genome Suite (Arc Institute)',
        modelId: 'evo-2',
        modelName: 'Evo 2 (StripedHyena 2)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Arc Institute / Stanford / NVIDIA',
      },
    ];
  }
  if (s.includes('pharma.ai')) {
    return [
      {
        familyId: 'insilico-pharma-ai',
        familyName: 'Insilico Medicine Pharma.AI & GENTRL',
        modelId: 'insilico-pharma-ai',
        modelName: 'Pharma.AI (PandaOmics + Chemistry42)',
        architecture: 'Domain Science Neural Net',
        lab: 'Insilico Medicine',
      },
    ];
  }
  if (s.includes('gentrl')) {
    return [
      {
        familyId: 'insilico-pharma-ai',
        familyName: 'Insilico Medicine Pharma.AI & GENTRL',
        modelId: 'gentrl',
        modelName: 'GENTRL (Generative Tensorial RL)',
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Insilico Medicine',
      },
    ];
  }
  if (s.includes('flood-filling networks')) {
    return [
      {
        familyId: 'google-flood-filling-nets',
        familyName: 'Google Flood-Filling Networks (Connectomics)',
        modelId: 'google-ffn',
        modelName: 'Flood-Filling Networks (FFNs) + Synapse CNNs',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('astronet')) {
    return [
      {
        familyId: 'astronet-cnn',
        familyName: 'AstroNet Exoplanet CNN (Google / NASA)',
        modelId: 'astronet-cnn',
        modelName: 'AstroNet Deep Transit CNN',
        architecture: 'Domain Science Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('princeton / pppl')) {
    return [
      {
        familyId: 'princeton-fusion-rl',
        familyName: 'Princeton / PPPL Fusion Deep RL',
        modelId: 'diii-d-tearing-rl',
        modelName: 'DIII-D Tearing-Avoidance DRL',
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Princeton / PPPL',
      },
    ];
  }
  if (s.includes('aurora')) {
    return [
      {
        familyId: 'microsoft-aurora',
        familyName: 'Aurora Earth System (Microsoft Research)',
        modelId: 'microsoft-aurora',
        modelName: 'Aurora (3D Swin Transformer)',
        architecture: 'Domain Science Neural Net',
        lab: 'Microsoft Research',
      },
    ];
  }
  if (s.includes('azure quantum elements')) {
    return [
      {
        familyId: 'azure-quantum-elements',
        familyName: 'Azure Quantum Elements (Microsoft / PNNL)',
        modelId: 'azure-quantum-elements',
        modelName: 'Azure Quantum Elements AI + DFT',
        architecture: 'Domain Science Neural Net',
        lab: 'Microsoft Research',
      },
    ];
  }
  if (s.includes('primo')) {
    return [
      {
        familyId: 'primo-ml',
        familyName: 'PRIMO Black-Hole ML (IAS / NOIRLab)',
        modelId: 'primo-ml',
        modelName: 'PRIMO Dictionary-Learning ML',
        architecture: 'Domain Science Neural Net',
        lab: 'IAS / NOIRLab',
      },
    ];
  }
  if (s.includes('ai feynman')) {
    return [
      {
        familyId: 'ai-feynman',
        familyName: 'AI Feynman (MIT Symbolic Regression)',
        modelId: 'ai-feynman',
        modelName: 'AI Feynman (Neural + Symmetry Search)',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'MIT',
      },
    ];
  }
  if (s.includes('3n-mcts')) {
    return [
      {
        familyId: 'segler-3n-mcts',
        familyName: '3N-MCTS Retrosynthesis (Segler et al.)',
        modelId: 'segler-3n-mcts',
        modelName: '3N-MCTS (3 Neural Nets + MCTS)',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'University of Münster',
      },
    ];
  }
  if (s.includes('boltzgen')) {
    return [
      {
        familyId: 'boltz-suite',
        familyName: 'Boltz Biomolecular Suite (MIT)',
        modelId: 'boltzgen',
        modelName: 'BoltzGen All-Atom Binder Model',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'MIT CSAIL / Jameel Clinic',
      },
    ];
  }
  if (s.includes('boltz-2')) {
    return [
      {
        familyId: 'boltz-suite',
        familyName: 'Boltz Biomolecular Suite (MIT)',
        modelId: 'boltz-2',
        modelName: 'Boltz-2 Biomolecular Model',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'MIT CSAIL / Recursion',
      },
    ];
  }
  if (s.includes('chai-2')) {
    return [
      {
        familyId: 'chai-2',
        familyName: 'Chai-2 (Chai Discovery)',
        modelId: 'chai-2',
        modelName: 'Chai-2 Generative Antibody Model',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Chai Discovery',
      },
    ];
  }
  if (s.includes('profluent')) {
    return [
      {
        familyId: 'opencrispr-plm',
        familyName: 'OpenCRISPR PLM (Profluent)',
        modelId: 'opencrispr-plm',
        modelName: 'Profluent CRISPR Protein LM',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Profluent Bio',
      },
    ];
  }
  if (s.includes('mattergen')) {
    return [
      {
        familyId: 'mattergen',
        familyName: 'MatterGen (Microsoft Research)',
        modelId: 'mattergen',
        modelName: 'MatterGen Materials Diffusion',
        architecture: 'Domain Science Neural Net',
        lab: 'Microsoft Research',
      },
    ];
  }
  if (s.includes('meta ai symbolic')) {
    return [
      {
        familyId: 'meta-fair-symbolic',
        familyName: 'Meta FAIR Symbolic Transformer',
        modelId: 'meta-fair-symbolic',
        modelName: 'Meta AI Seq2Seq Lyapunov Transformer',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'Meta FAIR',
      },
    ];
  }
  if (s.includes('a-lab')) {
    return [
      {
        familyId: 'berkeley-a-lab',
        familyName: 'Berkeley A-Lab (LBNL)',
        modelId: 'berkeley-a-lab',
        modelName: 'A-Lab NLP + Active-Learning Robotics',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'Lawrence Berkeley National Lab',
      },
    ];
  }
  if (s.includes('bioemu')) {
    return [
      {
        familyId: 'microsoft-bioemu',
        familyName: 'BioEmu (Microsoft Research)',
        modelId: 'bioemu-1',
        modelName: 'BioEmu-1 Protein Equilibrium Emulator',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Microsoft Research',
      },
    ];
  }
  if (s.includes('elementsclaw')) {
    return [
      {
        familyId: 'elementsclaw',
        familyName: 'ElementsClaw (LAM + LLM)',
        modelId: 'elementsclaw',
        modelName: 'ElementsClaw (LAM + LLM Orchestrator)',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'ElementsClaw Research',
      },
    ];
  }
  if (s.includes('emory physics-tailored') || s.includes('dusty-plasma')) {
    return [
      {
        familyId: 'emory-dusty-plasma-nn',
        familyName: 'Emory Dusty-Plasma Neural Net',
        modelId: 'emory-dusty-plasma-nn',
        modelName: 'Symmetry-Constrained Dusty-Plasma NN',
        architecture: 'Domain Science Neural Net',
        lab: 'Emory University',
      },
    ];
  }
  if (s.includes('mathdiscoveries')) {
    return [
      {
        familyId: 'mathdiscoveries-agents',
        familyName: 'MathDiscoveries AI Agents',
        modelId: 'mathdiscoveries-agents',
        modelName: 'MathDiscoveries Research Agents (Lean 4)',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'MathDiscoveries (Independent)',
      },
    ];
  }
  if (s.includes('frontier reasoning llms')) {
    return [
      {
        familyId: 'stanford-atomic-ai',
        familyName: 'Frontier LLM Quantum Proofs (Stanford)',
        modelId: 'stanford-atomic-ai',
        modelName: 'Frontier Reasoning LLMs + Spectral Bounds',
        architecture: 'Frontier Reasoning LLM',
        lab: 'Stanford University',
      },
    ];
  }
  if (s.includes('vesuvius challenge')) {
    return [
      {
        familyId: 'vesuvius-ink-models',
        familyName: 'Vesuvius Challenge 3D Ink Models',
        modelId: 'vesuvius-3d-unet-dino',
        modelName: '3D U-Net & 3D DINO Ink-Detection Suite',
        architecture: 'Domain Science Neural Net',
        lab: 'Vesuvius Challenge / Univ. of Kentucky',
      },
    ];
  }

  // Automated SAT Solvers (Cube-and-Conquer / CaDiCaL — Heule Group)
  if (s.includes('sat solver') || s.includes('cadical')) {
    const isCadical = s.includes('cadical');
    return [
      {
        familyId: 'automated-sat-solvers',
        familyName: 'Automated SAT Solvers (Cube-and-Conquer / CaDiCaL)',
        modelId: isCadical ? 'cadical-sat-solver' : 'cube-and-conquer-sat',
        modelName: isCadical ? 'CaDiCaL SAT Solver (DRAT)' : 'Cube-and-Conquer SAT Solver (DRAT)',
        architecture: 'Classical Symbolic & SAT AI',
        lab: 'UT Austin / CMU (Heule Group)',
      },
    ];
  }

  // Symbolic / Classical Pioneers (1976–2021)
  if (item.aiParadigm === 'Symbolic / Classical') {
    const cleanName = item.aiSystem.split('(')[0].trim();
    const slug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return [
      {
        familyId: slug,
        familyName: cleanName,
        modelId: slug,
        modelName: cleanName,
        architecture: 'Classical Symbolic & SAT AI',
        lab: item.institutions?.[0] || 'Academic / Independent',
      },
    ];
  }

  // Fallback (should never trigger for validated dataset)
  const fallbackName = item.aiSystem || 'Unspecified AI System';
  const fallbackId = fallbackName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return [
    {
      familyId: fallbackId,
      familyName: fallbackName,
      modelId: fallbackId,
      modelName: fallbackName,
      architecture: 'Domain Science Neural Net',
      lab: item.institutions?.[0] || 'Independent Research',
    },
  ];
}

function getEntityKey(groupBy, attr) {
  if (groupBy === 'model') return { id: attr.modelId, name: attr.modelName };
  if (groupBy === 'architecture') return { id: attr.architecture, name: attr.architecture };
  if (groupBy === 'lab') return { id: attr.lab, name: attr.lab };
  return { id: attr.familyId, name: attr.familyName };
}

/**
 * Aggregates ranked breakthroughs into an AI Systems / Models leaderboard under
 * the chosen grouping lens, attribution method, and ranking metric.
 */
export function aggregateModelRankings(rankedItems, opts = {}) {
  const groupBy = opts.groupBy || 'family';
  const attribution = opts.attribution === 'full' ? 'full' : 'fractional';
  const sortBy = opts.sortBy || 'cumulativeImpact';
  const minBreakthroughs = Number(opts.minBreakthroughs) || 1;
  const search = (opts.search || '').trim().toLowerCase();

  const buckets = new Map();

  for (const item of rankedItems) {
    const rawAttrs = classifyBreakthroughSystems(item);
    // Deduplicate if two distinct models in a joint entry collapse to the same group key (e.g., Lab or Family)
    const perKey = new Map();
    const rawShare = 1 / rawAttrs.length;

    for (const attr of rawAttrs) {
      const { id, name } = getEntityKey(groupBy, attr);
      if (!perKey.has(id)) {
        perKey.set(id, {
          id,
          name,
          share: 0,
          attrs: [],
        });
      }
      const entry = perKey.get(id);
      entry.share += rawShare;
      entry.attrs.push(attr);
    }

    for (const [keyId, grouped] of perKey.entries()) {
      const credit = attribution === 'full' ? 1 : grouped.share;
      if (!buckets.has(keyId)) {
        buckets.set(keyId, {
          id: keyId,
          name: grouped.name,
          labs: new Map(),
          architectures: new Map(),
          paradigms: new Map(),
          disciplines: new Map(),
          subModels: new Set(),
          breakthroughs: [],
          rawCount: 0,
          shareCount: 0,
          cumulativeImpact: 0,
          weightedScoreSum: 0,
          rawScoreSum: 0,
          peakImpact: 0,
          peakBreakthrough: null,
          verifiedCount: 0,
          peerReviewedCount: 0,
          autonomousCount: 0,
          yearsUnsolved: 0,
          firstYear: Infinity,
          lastYear: -Infinity,
          coAttributedCount: 0,
        });
      }

      const b = buckets.get(keyId);
      const year = Number(item.date.slice(0, 4));
      const score = item.compositeScore;

      b.rawCount += 1;
      b.shareCount += credit;
      b.cumulativeImpact += score * credit;
      b.weightedScoreSum += score * credit;
      b.rawScoreSum += score;
      if (grouped.share < 0.999) b.coAttributedCount += 1;

      if (
        score > b.peakImpact ||
        (score === b.peakImpact &&
          b.peakBreakthrough &&
          item.scores.foundational > b.peakBreakthrough.scores.foundational)
      ) {
        b.peakImpact = score;
        b.peakBreakthrough = item;
      }

      if (item.verificationStatus === 'Formally Verified') b.verifiedCount += credit;
      if (item.verificationStatus === 'Peer-Reviewed') b.peerReviewedCount += credit;
      if (item.aiRole === 'Autonomous AI') b.autonomousCount += credit;
      if (typeof item.yearsUnsolved === 'number' && item.yearsUnsolved > 0) {
        b.yearsUnsolved += item.yearsUnsolved * credit;
      }

      if (year < b.firstYear) b.firstYear = year;
      if (year > b.lastYear) b.lastYear = year;

      b.paradigms.set(item.aiParadigm, (b.paradigms.get(item.aiParadigm) || 0) + credit);
      b.disciplines.set(item.discipline, (b.disciplines.get(item.discipline) || 0) + credit);

      for (const a of grouped.attrs) {
        b.labs.set(a.lab, (b.labs.get(a.lab) || 0) + credit / grouped.attrs.length);
        b.architectures.set(
          a.architecture,
          (b.architectures.get(a.architecture) || 0) + credit / grouped.attrs.length
        );
        b.subModels.add(a.modelName);
      }

      b.breakthroughs.push({
        item,
        credit,
        isCoAttributed: grouped.share < 0.999,
        roleNotes: grouped.attrs.map((a) => a.roleNote).filter(Boolean),
        modelNames: [...new Set(grouped.attrs.map((a) => a.modelName))],
      });
    }
  }

  let rows = [...buckets.values()].map((b) => {
    const avgImpact = b.shareCount > 0 ? b.weightedScoreSum / b.shareCount : 0;
    const dominantParadigm = [...b.paradigms.entries()].sort((a, c) => c[1] - a[1])[0]?.[0] || 'Neural / Deep Learning';
    const dominantArchitecture =
      [...b.architectures.entries()].sort((a, c) => c[1] - a[1])[0]?.[0] || 'Domain Science Neural Net';
    const primaryLab = [...b.labs.entries()].sort((a, c) => c[1] - a[1])[0]?.[0] || 'Independent';
    const labList = [...b.labs.entries()].sort((a, c) => c[1] - a[1]).map(([k]) => k);
    const disciplineBreakdown = Object.keys(DISCIPLINE_META)
      .map((disc) => ({
        discipline: disc,
        value: b.disciplines.get(disc) || 0,
        pct: b.shareCount > 0 ? ((b.disciplines.get(disc) || 0) / b.shareCount) * 100 : 0,
        colorVar: DISCIPLINE_META[disc].colorVar,
      }))
      .filter((d) => d.value > 0);

    b.breakthroughs.sort(
      (a, c) =>
        c.item.compositeScore - a.item.compositeScore ||
        c.item.date.localeCompare(a.item.date)
    );

    return {
      id: b.id,
      name: b.name,
      primaryLab,
      labs: labList,
      dominantArchitecture,
      dominantParadigm,
      paradigmCount: b.paradigms.size,
      subModels: [...b.subModels],
      volume: Number(b.shareCount.toFixed(2)),
      rawCount: b.rawCount,
      coAttributedCount: b.coAttributedCount,
      cumulativeImpact: Number(b.cumulativeImpact.toFixed(1)),
      avgImpact: Number(avgImpact.toFixed(1)),
      peakImpact: Number(b.peakImpact.toFixed(1)),
      peakBreakthrough: b.peakBreakthrough,
      verifiedCount: Number(b.verifiedCount.toFixed(2)),
      peerReviewedCount: Number(b.peerReviewedCount.toFixed(2)),
      verifiedRate: b.shareCount > 0 ? Math.round((b.verifiedCount / b.shareCount) * 100) : 0,
      autonomousCount: Number(b.autonomousCount.toFixed(2)),
      autonomousRate: b.shareCount > 0 ? Math.round((b.autonomousCount / b.shareCount) * 100) : 0,
      yearsUnsolved: Math.round(b.yearsUnsolved),
      firstYear: b.firstYear,
      lastYear: b.lastYear,
      disciplineBreakdown,
      breakthroughs: b.breakthroughs,
    };
  });

  if (minBreakthroughs > 1) {
    rows = rows.filter((r) => r.rawCount >= minBreakthroughs);
  }

  if (search) {
    rows = rows.filter((r) => {
      const hay = [
        r.name,
        r.primaryLab,
        ...r.labs,
        r.dominantArchitecture,
        r.dominantParadigm,
        ...r.subModels,
        ...r.breakthroughs.map((x) => `${x.item.title} ${x.item.shortTitle} ${x.item.aiSystem || ''}`),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(search);
    });
  }

  const metricGetter = {
    cumulativeImpact: (r) => r.cumulativeImpact,
    volume: (r) => r.volume,
    avgImpact: (r) => r.avgImpact,
    peakImpact: (r) => r.peakImpact,
    verified: (r) => r.verifiedCount,
    autonomous: (r) => r.autonomousCount,
    yearsUnsolved: (r) => r.yearsUnsolved,
  }[sortBy] || ((r) => r.cumulativeImpact);

  rows.sort((a, b) => {
    const diff = metricGetter(b) - metricGetter(a);
    if (Math.abs(diff) > 1e-6) return diff;
    if (b.cumulativeImpact !== a.cumulativeImpact) return b.cumulativeImpact - a.cumulativeImpact;
    return b.peakImpact - a.peakImpact;
  });

  return rows.map((row, idx) => ({
    ...row,
    rank: idx + 1,
  }));
}

/**
 * Computes head-to-head metrics across the three top-level AI paradigms:
 * Neural / Deep Learning, Neuro-Symbolic, and Symbolic / Classical.
 */
export function computeParadigmComparison(rankedItems) {
  const order = ['Neural / Deep Learning', 'Neuro-Symbolic', 'Symbolic / Classical'];
  const totalCount = rankedItems.length;
  const totalImpact = rankedItems.reduce((sum, i) => sum + i.compositeScore, 0);

  return order.map((key) => {
    const subset = rankedItems.filter((i) => i.aiParadigm === key);
    const count = subset.length;
    const cumImpact = subset.reduce((sum, i) => sum + i.compositeScore, 0);
    const avgImpact = count > 0 ? cumImpact / count : 0;
    const peakItem = subset.reduce(
      (best, cur) => (!best || cur.compositeScore > best.compositeScore ? cur : best),
      null
    );
    const verifiedCount = subset.filter((i) => i.verificationStatus === 'Formally Verified').length;
    const autonomousCount = subset.filter((i) => i.aiRole === 'Autonomous AI').length;
    const yearsUnsolved = subset.reduce(
      (sum, i) => sum + (typeof i.yearsUnsolved === 'number' && i.yearsUnsolved > 0 ? i.yearsUnsolved : 0),
      0
    );
    const years = subset.map((i) => Number(i.date.slice(0, 4)));
    const firstYear = years.length ? Math.min(...years) : null;
    const lastYear = years.length ? Math.max(...years) : null;

    return {
      key,
      meta: PARADIGM_META[key],
      count,
      volumePct: totalCount > 0 ? (count / totalCount) * 100 : 0,
      cumulativeImpact: Number(cumImpact.toFixed(1)),
      impactPct: totalImpact > 0 ? (cumImpact / totalImpact) * 100 : 0,
      avgImpact: Number(avgImpact.toFixed(1)),
      peakImpact: peakItem ? Number(peakItem.compositeScore.toFixed(1)) : 0,
      peakItem,
      verifiedCount,
      verifiedRate: count > 0 ? Math.round((verifiedCount / count) * 100) : 0,
      autonomousCount,
      autonomousRate: count > 0 ? Math.round((autonomousCount / count) * 100) : 0,
      yearsUnsolved,
      firstYear,
      lastYear,
    };
  });
}

export function formatVolume(val) {
  return Math.abs(val - Math.round(val)) < 0.05 ? String(Math.round(val)) : val.toFixed(1);
}
