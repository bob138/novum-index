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
      familyName: 'Physics-Informed Neural Networks (PINNs)',
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
  'imo-2025-formal-gold-aristotle-seed-2025': [
    {
      familyId: 'harmonic-aristotle',
      familyName: 'Harmonic Aristotle',
      modelId: 'harmonic-aristotle',
      modelName: 'Harmonic Aristotle (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Harmonic',
      roleNote: 'Formal IMO Gold',
    },
    {
      familyId: 'bytedance-seed-prover',
      familyName: 'ByteDance Seed-Prover',
      modelId: 'bytedance-seed-prover',
      modelName: 'ByteDance Seed-Prover (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'ByteDance Seed',
      roleNote: 'Formal IMO Gold (5/6)',
    },
  ],
  'chemcrow-autonomous-chemistry-agent-2024': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'chemcrow-gpt4',
      modelName: 'ChemCrow (GPT-4 + 18 Chemistry Tools)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'EPFL / University of Rochester',
    },
  ],
  'baker-calcium-ion-channels-2025': [
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'rfdiffusion',
      modelName: 'RFdiffusion (SE(3) Diffusion)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
    },
  ],
  'courtade-kumar-conjecture-lean-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-argon-teamwork',
      modelName: 'Gemini 4 Argon (Antigravity /teamwork)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'weil-conjectures-lean-teamwork-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-argon-teamwork',
      modelName: 'Gemini 4 Argon (Antigravity /teamwork)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'antigravity-teamwork-duodiscover-systems-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-argon-teamwork',
      modelName: 'Gemini 4 Argon (Antigravity /teamwork)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  '3d-self-correcting-quantum-memory-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-series',
      modelName: 'Gemini 4 (Argon / Agent Teams)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'big-sleep-autonomous-zeroday-2024': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'big-sleep-gemini',
      modelName: 'Big Sleep (Gemini 1.5 Pro Security Agent)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'alphago-go-mastery-2016': [
    {
      familyId: 'deepmind-deep-rl',
      familyName: 'DeepMind Deep RL (AlphaZero & DiscoRL)',
      modelId: 'alphago',
      modelName: 'AlphaGo (Policy/Value CNNs + MCTS)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'alphazero-general-selfplay-2018': [
    {
      familyId: 'deepmind-deep-rl',
      familyName: 'DeepMind Deep RL (AlphaZero & DiscoRL)',
      modelId: 'alphazero',
      modelName: 'AlphaZero & AlphaGo Zero (Self-Play RL)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'muzero-learned-world-model-2020': [
    {
      familyId: 'deepmind-deep-rl',
      familyName: 'DeepMind Deep RL (AlphaZero & DiscoRL)',
      modelId: 'muzero',
      modelName: 'MuZero (Latent World Model + MCTS)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'deepnash-stratego-gt-rl-2022': [
    {
      familyId: 'deepmind-deep-rl',
      familyName: 'DeepMind Deep RL (AlphaZero & DiscoRL)',
      modelId: 'deepnash',
      modelName: 'DeepNash (R-NaD Game-Theoretic RL)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'lion-optimizer-program-search-2023': [
    {
      familyId: 'alphaevolve-funsearch',
      familyName: 'AlphaEvolve & FunSearch',
      modelId: 'lion-program-search',
      modelName: 'Symbolic Evolutionary Program Search (Lion)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'pluribus-six-player-poker-2019': [
    {
      familyId: 'pluribus-cicero',
      familyName: 'Pluribus & Cicero (Game-Theoretic AI)',
      modelId: 'pluribus',
      modelName: 'Pluribus (MCCFR + Depth-Limited Search)',
      architecture: 'Classical Symbolic & SAT AI',
      lab: 'Carnegie Mellon / Meta FAIR',
    },
  ],
  'cicero-diplomacy-strategic-lm-2022': [
    {
      familyId: 'pluribus-cicero',
      familyName: 'Pluribus & Cicero (Game-Theoretic AI)',
      modelId: 'cicero',
      modelName: 'Cicero (piKL Strategic Planner + Dialogue LLM)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Meta FAIR',
    },
  ],
  'alphafold-nuclear-pore-complex-2022': [
    {
      familyId: 'alphafold',
      familyName: 'AlphaFold Structural Suite',
      modelId: 'alphafold-2',
      modelName: 'AlphaFold 2',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'alphafold-fertilization-complex-2024': [
    {
      familyId: 'alphafold',
      familyName: 'AlphaFold Structural Suite',
      modelId: 'alphafold-multimer',
      modelName: 'AlphaFold-Multimer',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'proteinmpnn-sequence-design-2022': [
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'proteinmpnn',
      modelName: 'ProteinMPNN (Inverse Folding GNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
    },
  ],
  'rosettafold-all-atom-2024': [
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'rosettafold-all-atom',
      modelName: 'RoseTTAFold All-Atom & RFdiffusionAA',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
    },
  ],
  'rfdiffusion-antivenom-binders-2025': [
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'rfdiffusion',
      modelName: 'RFdiffusion + ProteinMPNN',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
    },
  ],
  'enformer-gene-expression-2021': [
    {
      familyId: 'alphagenome',
      familyName: 'AlphaGenome Regulatory Suite',
      modelId: 'enformer',
      modelName: 'Enformer (200 kb Genomic Transformer)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'evo-1-genome-scale-design-2024': [
    {
      familyId: 'evo-suite',
      familyName: 'Evo Genome Suite (Arc Institute)',
      modelId: 'evo-1',
      modelName: 'Evo 1 (7B StripedHyena DNA Model)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Arc Institute / Stanford / NVIDIA',
    },
  ],
  'google-health-mammography-ai-2020': [
    {
      familyId: 'google-clinical-vision',
      familyName: 'Google Clinical Imaging Deep Learning',
      modelId: 'google-health-mammography',
      modelName: 'Google Health Mammography Ensemble CNN',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'cryodrgn-heterogeneous-cryoem-2021': [
    {
      familyId: 'cryodrgn',
      familyName: 'CryoDRGN (MIT)',
      modelId: 'cryodrgn',
      modelName: 'CryoDRGN (Coordinate Neural Volume VAE)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Massachusetts Institute of Technology',
    },
  ],
  'masif-surface-protein-design-2023': [
    {
      familyId: 'masif-epfl',
      familyName: 'MaSIF Surface Geometric AI (EPFL)',
      modelId: 'masif-seed',
      modelName: 'MaSIF-seed (Molecular Surface GDL)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'EPFL',
    },
  ],
  'geneformer-network-biology-2023': [
    {
      familyId: 'geneformer',
      familyName: 'Geneformer (Broad / Harvard)',
      modelId: 'geneformer',
      modelName: 'Geneformer (30M-Cell Single-Cell Transformer)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Broad Institute / Harvard',
    },
  ],
  'stanford-speech-neuroprosthesis-2023': [
    {
      familyId: 'braingate-speech-bci',
      familyName: 'Deep-Learning Speech Neuroprostheses (BrainGate)',
      modelId: 'stanford-speech-bci',
      modelName: 'Stanford RNN + LM Speech BCI',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Stanford University',
    },
  ],
  'ucdavis-speech-bci-nejm-2024': [
    {
      familyId: 'braingate-speech-bci',
      familyName: 'Deep-Learning Speech Neuroprostheses (BrainGate)',
      modelId: 'ucdavis-speech-bci',
      modelName: 'UC Davis Self-Calibrating Speech BCI',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of California, Davis',
    },
  ],
  'evescape-viral-immune-escape-2023': [
    {
      familyId: 'evescape',
      familyName: 'EVEscape (Harvard / Oxford)',
      modelId: 'evescape',
      modelName: 'EVEscape (Generative Viral Evolution Model)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Harvard Medical School / Oxford',
    },
  ],
  'ampsphere-apex-microbiome-antibiotics-2024': [
    {
      familyId: 'apex-ampsphere',
      familyName: 'APEX & AMPSphere Peptide AI (UPenn)',
      modelId: 'apex-ampsphere',
      modelName: 'Macrel & APEX Deep Peptide Miners',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Pennsylvania',
    },
  ],
  'chief-pathology-foundation-2024': [
    {
      familyId: 'chief-pathology',
      familyName: 'CHIEF Pathology Foundation Model (Harvard)',
      modelId: 'chief-pathology',
      modelName: 'CHIEF (Pan-Cancer Histopathology AI)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Harvard Medical School',
    },
  ],
  'ai-designed-dna-enhancers-2024': [
    {
      familyId: 'malinois-coda',
      familyName: 'Malinois & CODA Regulatory Design (Broad / JAX)',
      modelId: 'malinois-coda',
      modelName: 'Malinois CNN + CODA Enhancer Optimizer',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Broad Institute / JAX / Yale',
    },
  ],
  'microns-mouse-cortex-connectome-2025': [
    {
      familyId: 'microns-connectomics',
      familyName: 'MICrONS Cortical Connectomics AI',
      modelId: 'microns-connectomics',
      modelName: 'MICrONS 3D EM Segmentation & Synapse AI',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Princeton / Allen Institute / Baylor',
    },
  ],
  'chalmers-neurosymbolic-ai-scientist-2026': [
    {
      familyId: 'robot-scientist',
      familyName: 'Robot Scientist Series (Adam & Eve)',
      modelId: 'chalmers-ilp-llm-scientist',
      modelName: 'Chalmers Hybrid LLM + ILP Robot Scientist',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Chalmers University of Technology',
    },
  ],
  'autodna-autonomous-biomolecular-lab-2026': [
    {
      familyId: 'autodna-sjtu',
      familyName: 'AutoDNA Autonomous Bio-Lab (SJTU)',
      modelId: 'autodna-sjtu',
      modelName: 'AutoDNA (6-Agent AI-Native Laboratory)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Shanghai Jiao Tong University',
    },
  ],
  'cu-al-co2-electrocatalyst-2020': [
    {
      familyId: 'gaspy-catalyst-ml',
      familyName: 'GASpy Active-ML Catalysis (Toronto / CMU)',
      modelId: 'gaspy-catalyst-ml',
      modelName: 'GASpy Active-Learning DFT Surrogate',
      architecture: 'Domain Science Neural Net',
      lab: 'University of Toronto / CMU',
    },
  ],
  'mobile-robotic-chemist-2020': [
    {
      familyId: 'liverpool-robotic-chemist',
      familyName: 'Liverpool Mobile Robotic Chemist',
      modelId: 'liverpool-robotic-chemist',
      modelName: 'Mobile Robotic Chemist (Batched Bayesian Opt.)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'University of Liverpool',
    },
  ],
  'paulinet-quantum-chemistry-2020': [
    {
      familyId: 'paulinet',
      familyName: 'PauliNet (FU Berlin)',
      modelId: 'paulinet',
      modelName: 'PauliNet (Neural Slater–Jastrow VMC)',
      architecture: 'Domain Science Neural Net',
      lab: 'Freie Universität Berlin',
    },
  ],
  'dm21-neural-density-functional-2021': [
    {
      familyId: 'deepmind-dm21',
      familyName: 'DeepMind DM21 Neural DFT',
      modelId: 'deepmind-dm21',
      modelName: 'DM21 Neural Exchange-Correlation Functional',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'fast-petase-mutcompute-2022': [
    {
      familyId: 'mutcompute',
      familyName: 'MutCompute 3D-CNN (UT Austin)',
      modelId: 'mutcompute',
      modelName: 'MutCompute (3D Microenvironment CNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Texas at Austin',
    },
  ],
  'nequip-equivariant-potentials-2022': [
    {
      familyId: 'equivariant-mlip',
      familyName: 'Equivariant ML Interatomic Potentials (NequIP / MACE)',
      modelId: 'nequip',
      modelName: 'NequIP (E(3)-Equivariant GNN)',
      architecture: 'Domain Science Neural Net',
      lab: 'Harvard University',
    },
  ],
  'mace-mp0-materials-foundation-2023': [
    {
      familyId: 'equivariant-mlip',
      familyName: 'Equivariant ML Interatomic Potentials (NequIP / MACE)',
      modelId: 'mace-mp-0',
      modelName: 'MACE-MP-0 (89-Element Equivariant Foundation MLIP)',
      architecture: 'Domain Science Neural Net',
      lab: 'University of Cambridge / LBNL',
    },
  ],
  'invar-high-entropy-alloys-2022': [
    {
      familyId: 'hea-gad-mpie',
      familyName: 'HEA-GAD Active-ML Metallurgy (MPIE)',
      modelId: 'hea-gad-mpie',
      modelName: 'HEA-GAD Wasserstein Autoencoder + Active Learning',
      architecture: 'Domain Science Neural Net',
      lab: 'Max-Planck-Institut für Eisenforschung',
    },
  ],
  'diffdock-molecular-docking-2023': [
    {
      familyId: 'diffdock-mit',
      familyName: 'DiffDock Molecular Diffusion (MIT)',
      modelId: 'diffdock',
      modelName: 'DiffDock (SE(3) Torsional Diffusion)',
      architecture: 'Domain Science Neural Net',
      lab: 'Massachusetts Institute of Technology',
    },
  ],
  'delocalized-sdl-organic-lasers-2024': [
    {
      familyId: 'delocalized-sdl',
      familyName: 'Delocalized Self-Driving Labs Consortium',
      modelId: 'delocalized-sdl',
      modelName: 'Asynchronous Multi-Lab Cloud AI Orchestrator',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'University of Toronto / UIUC / UBC / Glasgow',
    },
  ],
  'pinns-physics-informed-nn-2019': [
    {
      familyId: 'high-precision-pinns',
      familyName: 'Physics-Informed Neural Networks (PINNs)',
      modelId: 'pinns-raissi',
      modelName: 'Physics-Informed Neural Networks (PINNs)',
      architecture: 'Domain Science Neural Net',
      lab: 'Brown University / UPenn',
    },
  ],
  'deepmind-glassy-dynamics-gnn-2020': [
    {
      familyId: 'deepmind-physics-gnn',
      familyName: 'DeepMind Physics Graph Networks',
      modelId: 'deepmind-glassy-gnn',
      modelName: 'DeepMind Glassy-Dynamics GNN',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'fourier-neural-operator-2021': [
    {
      familyId: 'neural-operators-fno',
      familyName: 'Fourier Neural Operator (Caltech)',
      modelId: 'fno',
      modelName: 'Fourier Neural Operator (FNO)',
      architecture: 'Domain Science Neural Net',
      lab: 'California Institute of Technology',
    },
  ],
  'dingo-gravitational-waves-2021': [
    {
      familyId: 'dingo-gw',
      familyName: 'DINGO Gravitational-Wave AI (MPI)',
      modelId: 'dingo-gw',
      modelName: 'DINGO (Normalizing-Flow Posterior Estimation)',
      architecture: 'Domain Science Neural Net',
      lab: 'Max Planck Institute (MPI-IS / AEI)',
    },
  ],
  'exominer-301-exoplanets-2022': [
    {
      familyId: 'nasa-exominer',
      familyName: 'NASA ExoMiner Transit AI',
      modelId: 'nasa-exominer',
      modelName: 'ExoMiner (Explainable Deep Transit Network)',
      architecture: 'Domain Science Neural Net',
      lab: 'NASA Ames Research Center',
    },
  ],
  'pangu-weather-3d-ai-2023': [
    {
      familyId: 'pangu-weather',
      familyName: 'Pangu-Weather (Huawei Cloud)',
      modelId: 'pangu-weather',
      modelName: 'Pangu-Weather (3D Earth Transformer)',
      architecture: 'Domain Science Neural Net',
      lab: 'Huawei Cloud',
    },
  ],
  'btsbot-autonomous-supernova-2023': [
    {
      familyId: 'btsbot-ztf',
      familyName: 'BTSbot Autonomous Observatory AI (Northwestern / ZTF)',
      modelId: 'btsbot-ztf',
      modelName: 'BTSbot + SNIascore Robotic Transient AI',
      architecture: 'Domain Science Neural Net',
      lab: 'Northwestern University / Caltech',
    },
  ],
  'neuralgcm-hybrid-climate-2024': [
    {
      familyId: 'graphcast-gencast',
      familyName: 'GraphCast & GenCast',
      modelId: 'neuralgcm',
      modelName: 'NeuralGCM (Differentiable Hybrid Climate GCM)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'aardvark-end-to-end-weather-2025': [
    {
      familyId: 'aardvark-weather',
      familyName: 'Aardvark Weather (Cambridge / Turing)',
      modelId: 'aardvark-weather',
      modelName: 'Aardvark Weather (End-to-End Observational AI)',
      architecture: 'Domain Science Neural Net',
      lab: 'University of Cambridge / Turing / Microsoft',
    },
  ],
  'wagner-rl-graph-conjectures-2021': [
    {
      familyId: 'patternboost-wagner-rl',
      familyName: 'PatternBoost & Combinatorial Deep RL',
      modelId: 'wagner-cem-rl',
      modelName: 'Deep Cross-Entropy RL (Wagner)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Tel Aviv University',
    },
  ],
  'patternboost-hypercube-conjecture-2024': [
    {
      familyId: 'patternboost-wagner-rl',
      familyName: 'PatternBoost & Combinatorial Deep RL',
      modelId: 'patternboost',
      modelName: 'PatternBoost (Transformer + Local Search)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Meta FAIR / DeepMind / UW–Madison',
    },
  ],
  'alphaproof-nexus-ghz-nogo-2026': [
    {
      familyId: 'alphaproof-alphageometry',
      familyName: 'AlphaProof & AlphaGeometry',
      modelId: 'alphaproof-nexus',
      modelName: 'AlphaProof Nexus (Formal Conjectures + Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'otoc-1d-classical-simulation-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'qip2-equals-pspace-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-chatgpt-reasoning',
      modelName: 'OpenAI ChatGPT (Reasoning)',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'vector-dihedral-coset-quantum-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-6-sol',
      modelName: 'GPT-5.6 Sol / Pro',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Main Algorithm',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Improvement',
    },
  ],
  'adiabatic-quantum-advantage-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 Luna / Astra / 6.1 Sol',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Main Strategy & Proof',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5 / 5.5',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Proof Assistance',
    },
  ],
  'gibbs-states-markov-property-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Primary Proof',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5 / 5.5',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Proof Assistance',
    },
  ],
  'quantum-switch-impossibility-lean-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'OpenAI GPT Models (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Proof & Lean',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-internal-research',
      modelName: 'Anthropic Claude Models (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Proof & Lean',
    },
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-series',
      modelName: 'Google Gemini Models (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
      roleNote: 'Proof & Lean',
    },
  ],
  'epoch-oeis-open-147-conjectures-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'OEIS Open Leader',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'OEIS Open Co-Leader',
    },
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-series',
      modelName: 'Gemini 3.1 Pro / 4',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
      roleNote: 'Evaluated Suite',
    },
  ],
  'am-automated-mathematician-1977': [
    {
      familyId: 'lenat-am',
      familyName: 'Automated Mathematician (AM)',
      modelId: 'lenat-am',
      modelName: 'AM (Lisp Heuristic Concept Discovery)',
      architecture: 'Classical Symbolic & SAT AI',
      lab: 'Stanford University',
    },
  ],
  'deeplabcut-markerless-pose-2018': [
    {
      familyId: 'deeplabcut',
      familyName: 'DeepLabCut (Harvard / EPFL)',
      modelId: 'deeplabcut',
      modelName: 'DeepLabCut (Transfer-Learned Pose CNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Harvard / EPFL / Tübingen',
    },
  ],
  'deepmind-aki-prediction-2019': [
    {
      familyId: 'google-clinical-vision',
      familyName: 'Google Clinical Imaging Deep Learning',
      modelId: 'deepmind-aki-rnn',
      modelName: 'DeepMind EHR Acute Kidney Injury RNN',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'cellpose-generalist-segmentation-2020': [
    {
      familyId: 'cellpose-janelia',
      familyName: 'Cellpose (HHMI Janelia)',
      modelId: 'cellpose',
      modelName: 'Cellpose (Spatial Gradient-Flow U-Net)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'HHMI Janelia Research Campus',
    },
  ],
  'sybil-lung-cancer-risk-2023': [
    {
      familyId: 'mit-sybil',
      familyName: 'Sybil Oncology AI (MIT / MGH)',
      modelId: 'sybil-3d-cnn',
      modelName: 'Sybil (3D LDCT Risk CNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'MIT / MGH',
    },
  ],
  'epfl-brain-spine-interface-2023': [
    {
      familyId: 'epfl-brain-spine',
      familyName: 'EPFL Brain–Spine Interface AI',
      modelId: 'epfl-bsi-decoder',
      modelName: 'Adaptive ECoG-to-EES Neural Decoder',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'EPFL / CHUV / CEA-Leti',
    },
  ],
  'ucsf-speech-avatar-bci-2023': [
    {
      familyId: 'braingate-speech-bci',
      familyName: 'Deep-Learning Speech Neuroprostheses (BrainGate)',
      modelId: 'ucsf-speech-avatar-bci',
      modelName: 'UCSF Multimodal ECoG Speech & Avatar BCI',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'UCSF / UC Berkeley',
    },
  ],
  'retfound-retinal-foundation-2023': [
    {
      familyId: 'retfound-ucl',
      familyName: 'RETFound (UCL / Moorfields)',
      modelId: 'retfound-mae',
      modelName: 'RETFound (Self-Supervised Retinal ViT)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'UCL / Moorfields Eye Hospital',
    },
  ],
  'h01-human-cortex-connectome-2024': [
    {
      familyId: 'google-flood-filling-nets',
      familyName: 'Google Flood-Filling Networks (Connectomics)',
      modelId: 'google-ffn-h01',
      modelName: 'Google Flood-Filling Networks (H01 Human Cortex)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google Research / Harvard',
    },
  ],
  'isodde-drug-design-engine-2026': [
    {
      familyId: 'alphafold',
      familyName: 'AlphaFold Structural Suite',
      modelId: 'isodde-isomorphic',
      modelName: 'IsoDDE (Isomorphic Labs Drug Design Engine)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Isomorphic Labs / Google DeepMind',
    },
  ],
  'deepmd-quantum-molecular-dynamics-2018': [
    {
      familyId: 'deepmd-princeton',
      familyName: 'DeePMD (Princeton / Peking)',
      modelId: 'deepmd',
      modelName: 'Deep Potential Molecular Dynamics (DeePMD)',
      architecture: 'Domain Science Neural Net',
      lab: 'Princeton / Peking University',
    },
  ],
  'mit-ai-robotic-flow-synthesis-2019': [
    {
      familyId: 'mit-askcos-synthesis',
      familyName: 'MIT ASKCOS & Robotic Flow Synthesis',
      modelId: 'mit-askcos-flow',
      modelName: 'ASKCOS Neural Retrosynthesis + Robotic Flow',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'MIT',
    },
  ],
  'molecular-transformer-reaction-ai-2019': [
    {
      familyId: 'ibm-molecular-transformer',
      familyName: 'Molecular Transformer (IBM RXN)',
      modelId: 'molecular-transformer',
      modelName: 'Molecular Transformer (IBM RXN)',
      architecture: 'Domain Science Neural Net',
      lab: 'IBM Research Zurich / Univ. of Bern',
    },
  ],
  'closed-loop-battery-fast-charging-2020': [
    {
      familyId: 'stanford-tri-battery-ai',
      familyName: 'Closed-Loop Battery AI (Stanford / MIT / TRI)',
      modelId: 'closed-loop-battery-bo',
      modelName: 'Early-Cycle ML + Closed-Loop Bayesian Optimization',
      architecture: 'Domain Science Neural Net',
      lab: 'Stanford / MIT / TRI',
    },
  ],
  'chgnet-charge-informed-mlip-2023': [
    {
      familyId: 'equivariant-mlip',
      familyName: 'Equivariant ML Interatomic Potentials (NequIP / MACE)',
      modelId: 'chgnet',
      modelName: 'CHGNet (Charge-Informed Universal GNN)',
      architecture: 'Domain Science Neural Net',
      lab: 'UC Berkeley / LBNL',
    },
  ],
  'mattersim-mt-materials-foundation-2026': [
    {
      familyId: 'mattergen',
      familyName: 'MatterGen (Microsoft Research)',
      modelId: 'mattersim-mt',
      modelName: 'MatterSim-MT (Multi-Task Materials Foundation)',
      architecture: 'Domain Science Neural Net',
      lab: 'Microsoft Research',
    },
  ],
  'frb-121102-cnn-discovery-2018': [
    {
      familyId: 'breakthrough-listen-cnn',
      familyName: 'Breakthrough Listen Radio-Transient CNN',
      modelId: 'frb-121102-cnn',
      modelName: 'Breakthrough Listen Deep CNN (FRB 121102)',
      architecture: 'Domain Science Neural Net',
      lab: 'UC Berkeley / Breakthrough Listen',
    },
  ],
  'eqtransformer-earthquake-ai-2020': [
    {
      familyId: 'eqtransformer-stanford',
      familyName: 'EQTransformer (Stanford Seismology)',
      modelId: 'eqtransformer',
      modelName: 'EQTransformer (Hierarchical Seismic Attention)',
      architecture: 'Domain Science Neural Net',
      lab: 'Stanford University',
    },
  ],
  'fourcastnet-global-weather-ai-2022': [
    {
      familyId: 'neural-operators-fno',
      familyName: 'Fourier Neural Operator (Caltech)',
      modelId: 'fourcastnet-afno',
      modelName: 'FourCastNet (Adaptive Fourier Neural Operator)',
      architecture: 'Domain Science Neural Net',
      lab: 'NVIDIA / LBNL / Caltech',
    },
  ],
  'hubble-1031-asteroids-ai-2024': [
    {
      familyId: 'esa-hubble-asteroid-ai',
      familyName: 'Hubble Asteroid Hunter AI (ESA / Google)',
      modelId: 'hubble-asteroid-cnn',
      modelName: 'Google Cloud AutoML Asteroid-Trail Detector',
      architecture: 'Domain Science Neural Net',
      lab: 'ESA / Zooniverse / Google Cloud',
    },
  ],
  'minsr-deep-neural-quantum-states-2024': [
    {
      familyId: 'carleo-troyer-nqs',
      familyName: 'Neural-Network Quantum States (NQS)',
      modelId: 'minsr-deep-nqs',
      modelName: 'MinSR Deep Neural Quantum States (Augsburg)',
      architecture: 'Domain Science Neural Net',
      lab: 'University of Augsburg',
    },
  ],
  'rl-qec-willow-2026': [
    {
      familyId: 'alphaqubit',
      familyName: 'AlphaQubit',
      modelId: 'willow-rl-qec',
      modelName: 'Willow RL Quantum Error Correction Controller',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'exact-quantum-composed-functions-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'qma-qcma-hierarchy-separation-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'neural-architecture-search-rl-2017': [
    {
      familyId: 'google-brain-nas',
      familyName: 'Neural Architecture Search (Google Brain)',
      modelId: 'nas-rl-controller',
      modelName: 'NAS (REINFORCE Architecture Controller)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'alphastar-starcraft2-marl-2019': [
    {
      familyId: 'deepmind-deep-rl',
      familyName: 'DeepMind Deep RL (AlphaZero & DiscoRL)',
      modelId: 'alphastar',
      modelName: 'AlphaStar (League Multi-Agent RL)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Google DeepMind & Research',
    },
  ],
  'gt-sophy-racing-rl-2022': [
    {
      familyId: 'sony-gt-sophy',
      familyName: 'GT Sophy (Sony AI)',
      modelId: 'gt-sophy-qrsac',
      modelName: 'GT Sophy (QR-SAC Deep RL)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Sony AI / Polyphony Digital',
    },
  ],
  'alphacode-competitive-programming-2022': [
    {
      familyId: 'alphaevolve-funsearch',
      familyName: 'AlphaEvolve & FunSearch',
      modelId: 'alphacode',
      modelName: 'AlphaCode (41B Code Transformer + Execution Filter)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'swift-champion-drone-racing-2023': [
    {
      familyId: 'uzh-swift-drone',
      familyName: 'Swift Drone Racing RL (UZH / Intel)',
      modelId: 'swift-drone-rl',
      modelName: 'Swift (Onboard Vision + Residual-Physics Deep RL)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'University of Zurich / Intel',
    },
  ],
  'non-commutative-binomial-gemini-2026': [
    {
      familyId: 'google-gemini',
      familyName: 'Google Gemini & Gemma',
      modelId: 'gemini-4-carbon-agent',
      modelName: 'Gemini 4 Carbon (Agentic Proof Search)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind & Research',
    },
  ],
  'openai-chip-design-rtl-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'weight-space-programming-2026': [
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
      roleNote: 'Independent Replication',
    },
  ],
  'fpras-mixed-volumes-gurvits-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'molrsi-self-improving-discovery-2026': [
    {
      familyId: 'mit-collins-antibiotics-ai',
      familyName: 'MIT Collins Antibiotics-AI & Chemprop',
      modelId: 'molrsi-agent',
      modelName: 'MolRSI (Recursive Self-Improving MCTS Agent)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Broad Institute / MIT / Northeastern',
    },
  ],
  'regenerating-codes-tradeoff-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'claude-scorpion-antivenom-binders-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-science-agent',
      modelName: 'Claude Science Multi-Agent Research Model',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
    },
  ],
  'subseasonal-weather-ai-nature-2026': [
    {
      familyId: 'microsoft-aurora',
      familyName: 'Aurora Earth System (Microsoft Research)',
      modelId: 'subseasonal-prob-bias-ml',
      modelName: 'Probabilistic Bias Correction ML (MSR / MIT / ECMWF)',
      architecture: 'Domain Science Neural Net',
      lab: 'Microsoft Research',
    },
  ],
  'claude-uv-sky-map-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-science-agent',
      modelName: 'Claude Science Multi-Agent Research Model',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
    },
  ],
  'ucsf-speech-gesture-bci-2026': [
    {
      familyId: 'braingate-speech-bci',
      familyName: 'Deep-Learning Speech Neuroprostheses (BrainGate)',
      modelId: 'ucsf-speech-gesture-bci',
      modelName: 'UCSF Parallel ECoG Speech & Gesture BCI',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'UCSF / UC Berkeley',
    },
  ],
  'mitospace-4d-virtual-cell-2026': [
    {
      familyId: 'mitospace-ucsd',
      familyName: 'MitoSpace 4D Microscopy AI (UC San Diego)',
      modelId: 'mitospace-4d',
      modelName: 'MitoSpace (4D Contrastive Foundation Model)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'UC San Diego',
    },
  ],
  'weathernext-3-raw-obs-2026': [
    {
      familyId: 'graphcast-gencast',
      familyName: 'GraphCast & GenCast',
      modelId: 'weathernext-3',
      modelName: 'WeatherNext 3 (Raw-Observation 0.1° Global Model)',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'weathernext-cyclones-nature-2026': [
    {
      familyId: 'graphcast-gencast',
      familyName: 'GraphCast & GenCast',
      modelId: 'weathernext-cyclones',
      modelName: 'WeatherNext Cyclones (Functional Generative Network)',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'uce-universal-cell-embedding-2026': [
    {
      familyId: 'virtual-cell-atlases',
      familyName: 'Universal Virtual Cell Models (UCE / State / TranscriptFormer)',
      modelId: 'uce-foundation',
      modelName: 'Universal Cell Embedding (UCE)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Stanford / CZ Biohub / Arc Institute',
    },
  ],
  'transcriptformer-112m-cells-2026': [
    {
      familyId: 'virtual-cell-atlases',
      familyName: 'Universal Virtual Cell Models (UCE / State / TranscriptFormer)',
      modelId: 'transcriptformer',
      modelName: 'TranscriptFormer (112M-Cell Evolutionary Atlas)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Chan Zuckerberg Initiative / Stanford',
    },
  ],
  'masai-mammography-ai-rct-2026': [
    {
      familyId: 'masai-clinical-mammography',
      familyName: 'MASAI Clinical Mammography AI (Lund / ScreenPoint)',
      modelId: 'transpara-masai',
      modelName: 'Transpara AI Mammography Triage (MASAI RCT)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Lund University / Skåne University Hospital',
    },
  ],
  'sleepfm-multimodal-disease-2026': [
    {
      familyId: 'sleepfm-stanford',
      familyName: 'SleepFM Clinical Foundation Model (Stanford)',
      modelId: 'sleepfm',
      modelName: 'SleepFM (Multimodal Contrastive PSG Model)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Stanford University',
    },
  ],
  'sargent-acidic-oer-catalyst-ai-2026': [
    {
      familyId: 'gaspy-catalyst-ml',
      familyName: 'GASpy Active-ML Catalysis (Toronto / CMU)',
      modelId: 'mixed-accel-oer-ml',
      modelName: 'Mixed-Acceleration Active-Learning OER Platform',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'University of Toronto',
    },
  ],
  'nicheformer-spatial-omics-2025': [
    {
      familyId: 'nicheformer-helmholtz',
      familyName: 'Nicheformer Spatial-Omics AI (Helmholtz Munich)',
      modelId: 'nicheformer',
      modelName: 'Nicheformer (110M-Cell Spatial Transformer)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Helmholtz Munich / TUM',
    },
  ],
  'alphaearth-foundations-2025': [
    {
      familyId: 'alphaearth-foundations',
      familyName: 'AlphaEarth Foundations (Google DeepMind)',
      modelId: 'alphaearth-foundations',
      modelName: 'AlphaEarth Foundations (Planetary Embedding Field)',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'arc-state-virtual-cell-2025': [
    {
      familyId: 'virtual-cell-atlases',
      familyName: 'Universal Virtual Cell Models (UCE / State / TranscriptFormer)',
      modelId: 'arc-state',
      modelName: 'State (Arc Institute Virtual Cell Perturbation Model)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Arc Institute',
    },
  ],
  'ether0-chemistry-reasoning-2025': [
    {
      familyId: 'futurehouse-edison',
      familyName: 'FutureHouse / Edison AI Scientists (Robin & Kosmos)',
      modelId: 'ether0-24b',
      modelName: 'ether0 (24B RL Chemistry Reasoning Model)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'FutureHouse / Edison Scientific',
    },
  ],
  'period-maps-cst-conjecture-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Discovered C_st Counterexamples',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Local Criterion Proof Assistance',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Local Criterion Proof Assistance',
    },
  ],
  'qora-quantum-control-nv-2026': [
    {
      familyId: 'qora-quantum-scientist',
      familyName: 'QORA Quantum Control AI (WashU)',
      modelId: 'qora-nv-scientist',
      modelName: 'QORA (Autonomous NV-Center AI Scientist)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Washington University in St. Louis',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Core Reasoning Engine in QORA',
    },
  ],
  'algebraic-world-model-lean-2026': [
    {
      familyId: 'algebraic-world-model',
      familyName: 'Algebraic World Model (Tsinghua IIIS)',
      modelId: 'awm-lean-4',
      modelName: 'Algebraic World Model (AWM + Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Tsinghua University (IIIS)',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5',
      modelName: 'Claude Opus 5',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'Rule Induction & Proof Synthesis',
    },
  ],
  'plasma-erdos-173-lean-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Codex + Lean 4 Proof (Plasma AI)',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Claude Code + Lean 4 Proof (Plasma AI)',
    },
  ],
  'plasma-erdos-111-lean-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Codex + Lean 4 Proof (Plasma AI)',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Claude Code + Lean 4 Proof (Plasma AI)',
    },
  ],
  'multiple-unicast-disproof-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Reed–Solomon PG(2,9) Counterexample',
    },
  ],
  'linear-hadwiger-conjecture-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Linear Hadwiger Proof Discovery',
    },
  ],
  'vericontest-rust-lean-claude-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-opus-5-5',
      modelName: 'Claude Opus 5.5',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
      roleNote: 'Rust-Prover + Lean 4 (1,325 Proofs)',
    },
  ],
  'hadwiger-nelson-plane-6colors-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: '70-Module Lean 4 + Comparator Proof',
    },
  ],
  'cannons-conjecture-lean-openai-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Lean 4 + Comparator Modulus Proof',
    },
  ],
  'approval-committee-core-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
      roleNote: 'Harmonic-Entropy Core+ Idea',
    },
  ],
  'eternal-domination-disproof-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: '243-Vertex Graph + Lean 4 Proof',
    },
  ],
  'erdos-1-disproof-gpt6-lean-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
      roleNote: 'Autonomous Lean 4 Disproof (27.1 hrs)',
    },
  ],
  'caratheodory-conjecture-claude-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-internal-research',
      modelName: 'Claude Internal Research & Lean 4',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'C^∞ Support-Function Verification',
    },
  ],
  'slac-agentic-xray-scientist-2026': [
    {
      familyId: 'slac-xray-scientist',
      familyName: 'SLAC MCP Agentic X-Ray Scientist',
      modelId: 'slac-mcp-xray-agent',
      modelName: 'SLAC MCP Agentic X-Ray Scientist',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'SLAC National Accelerator Laboratory / Stanford',
    },
  ],
  'erdos-593-1177-aristotle-lean-2026': [
    {
      familyId: 'harmonic-aristotle',
      familyName: 'Harmonic Aristotle',
      modelId: 'harmonic-aristotle',
      modelName: 'Harmonic Aristotle (Lean 4)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Harmonic',
      roleNote: 'Zero-Sorry Lean 4 Formalization',
    },
  ],
  'jfc-autonomous-hep-lund-plane-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-code-agents',
      modelName: 'Claude Code Agents',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
      roleNote: 'JFC Autonomous HEP Pipeline (MIT/IAIFI)',
    },
  ],
  'metadesign-quantum-experiments-2026': [
    {
      familyId: 'metadesign-quantum',
      familyName: 'MetaDesign Quantum Optics AI (MPI)',
      modelId: 'metadesign-transformer',
      modelName: 'MetaDesign (Symbolic Seq2Seq Transformer)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Max Planck Institute for the Science of Light',
    },
  ],
  'axiomprover-chen-gendron-fel-2026': [
    {
      familyId: 'axiomprover',
      familyName: 'AxiomProver (Axiom Math)',
      modelId: 'axiomprover',
      modelName: 'AxiomProver Multi-Agent Swarm',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Axiom Math',
      roleNote: 'Fel & Chen–Gendron Lean 4 Proofs',
    },
  ],
  'lucaprot-161979-rna-viruses-2024': [
    {
      familyId: 'lucaprot-alibaba',
      familyName: 'LucaProt Viral Discovery AI (Alibaba / SYSU)',
      modelId: 'lucaprot-cell-2024',
      modelName: 'LucaProt (Sequence + Structure RdRP Classifier)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Alibaba Cloud Apsara Lab / Sun Yat-sen University',
    },
  ],
  'tencent-oridtp-dual-peptides-2026': [
    {
      familyId: 'tencent-oridtp',
      familyName: 'ORIDTP Dual-Target Peptide AI (Tencent)',
      modelId: 'oridtp-nature-2026',
      modelName: 'ORIDTP (Transfer + Dual-Target RL Peptide Designer)',
      architecture: 'Deep RL & Evolutionary Agent',
      lab: 'Tencent AI for Life Sciences Lab',
    },
  ],
  'riff-diff-de-novo-enzymes-2025': [
    {
      familyId: 'riff-diff-tugraz',
      familyName: 'Riff-Diff Enzyme Scaffolding AI (TU Graz)',
      modelId: 'riff-diff-nature-2025',
      modelName: 'Riff-Diff (Catalytic Motif Scaffolding Diffusion)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Graz University of Technology',
    },
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'rfdiffusion',
      modelName: 'RFdiffusion (SE(3) Diffusion)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
      roleNote: 'Backbone Diffusion Engine',
    },
  ],
  'apex-archaeasins-antibiotics-2025': [
    {
      familyId: 'apex-ampsphere',
      familyName: 'APEX & AMPSphere Peptide AI (UPenn)',
      modelId: 'apex-1-1-archaeasins',
      modelName: 'APEX 1.1 (Archaeome Antibiotic Miner)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Pennsylvania',
    },
  ],
  'darpa-aixcc-autonomous-cyber-2025': [
    {
      familyId: 'darpa-aixcc-crs',
      familyName: 'DARPA AIxCC Cyber Reasoning Systems',
      modelId: 'aixcc-team-atlanta-crs',
      modelName: 'Team Atlanta & AIxCC Autonomous CRSs',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'DARPA / Georgia Tech / Samsung / KAIST / POSTECH',
    },
  ],
  'pmhc-cancer-minibinders-science-2025': [
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'rfdiffusion',
      modelName: 'RFdiffusion (SE(3) Diffusion)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
      roleNote: 'De Novo pMHC Minibinder Scaffolding',
    },
    {
      familyId: 'rosettafold-rfdiffusion',
      familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
      modelId: 'proteinmpnn',
      modelName: 'ProteinMPNN (Inverse Folding GNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Washington (IPD)',
      roleNote: 'Sequence Design',
    },
    {
      familyId: 'alphafold',
      familyName: 'AlphaFold Structural Suite',
      modelId: 'alphafold-2',
      modelName: 'AlphaFold 2',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Google DeepMind & Research',
      roleNote: 'In Silico Structural Filtering',
    },
  ],
  'deepmind-aeneas-ancient-texts-2025': [
    {
      familyId: 'deepmind-aeneas',
      familyName: 'Aeneas Multimodal Epigraphy AI (DeepMind)',
      modelId: 'aeneas-nature-2025',
      modelName: 'Aeneas (Multimodal Epigraphic Transformer)',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'thermal-meta-emitters-nature-2025': [
    {
      familyId: 'sjtu-uta-thermal-ml',
      familyName: 'Three-Plane Thermal Metamaterial AI (SJTU / UT Austin)',
      modelId: 'three-plane-meta-emitter-ml',
      modelName: 'Three-Plane Sparse-Data ML Inverse Designer',
      architecture: 'Domain Science Neural Net',
      lab: 'Shanghai Jiao Tong University / UT Austin / NUS',
    },
  ],
  'ml-ductile-fenicoalta-alloy-2025': [
    {
      familyId: 'xjtu-alloy-active-ml',
      familyName: 'Active-ML High-Entropy Alloy AI (XJTU)',
      modelId: 'xjtu-fenicoalta-ml',
      modelName: 'Domain-Knowledge Active ML Alloy Loop',
      architecture: 'Domain Science Neural Net',
      lab: 'Xi’an Jiaotong University',
    },
  ],
  'perovskite-htm-inverse-design-2024': [
    {
      familyId: 'hiern-kit-solar-ai',
      familyName: 'Closed-Loop Perovskite Inverse-Design AI (HI-ERN / KIT)',
      modelId: 'perovskite-bayesian-htm',
      modelName: 'High-Throughput Bayesian Organic Semiconductor AI',
      architecture: 'Domain Science Neural Net',
      lab: 'HI-ERN / FAU / KIT / UNIST',
    },
  ],
  'mit-lion-lnp-gene-therapy-2024': [
    {
      familyId: 'mit-lion-lnp',
      familyName: 'MIT LiON Lipid Nanoparticle AI',
      modelId: 'mit-lion-dmpnn',
      modelName: 'LiON (Directed MPNN Ionizable Lipid Designer)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'MIT',
    },
  ],
  'fastglioma-brain-surgery-ai-2024': [
    {
      familyId: 'fastglioma-umich',
      familyName: 'FastGlioma Surgical Foundation AI (U-M / UCSF)',
      modelId: 'fastglioma-srh',
      modelName: 'FastGlioma (Self-Supervised Optical Foundation Model)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Michigan / UCSF',
    },
  ],
  'txgnn-rare-disease-repurposing-2024': [
    {
      familyId: 'harvard-txgnn',
      familyName: 'TxGNN Drug Repurposing Foundation AI (Harvard)',
      modelId: 'txgnn-kg-gnn',
      modelName: 'TxGNN (17,080-Disease Medical Knowledge Graph GNN)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Harvard Medical School / Stanford',
    },
  ],
  'deepmind-excited-states-nn-2024': [
    {
      familyId: 'ferminet',
      familyName: 'FermiNet',
      modelId: 'ferminet-psiformer-nes',
      modelName: 'FermiNet & Psiformer (Natural Excited States VMC)',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'prov-gigapath-pathology-ai-2024': [
    {
      familyId: 'microsoft-prov-gigapath',
      familyName: 'Prov-GigaPath Pathology AI (Microsoft / Providence)',
      modelId: 'prov-gigapath-1b',
      modelName: 'Prov-GigaPath (1.1B LongNet Slide Transformer)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Microsoft Research / Providence Genomics',
    },
  ],
  'google-flood-hub-ungauged-2024': [
    {
      familyId: 'google-flood-hub',
      familyName: 'Google Flood Hub Hydrological AI',
      modelId: 'google-flood-lstm',
      modelName: 'Google Flood Hub LSTM Global Hydrology Model',
      architecture: 'Domain Science Neural Net',
      lab: 'Google DeepMind & Research',
    },
  ],
  'foldseek-cluster-protein-universe-2023': [
    {
      familyId: 'foldseek-steinegger',
      familyName: 'Foldseek Structural Search & Clustering AI (SNU / ETH)',
      modelId: 'foldseek-cluster-3di',
      modelName: 'Foldseek Cluster (3Di Structural Alphabet)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Seoul National University / ETH Zürich / EMBL-EBI',
    },
  ],
  'chematica-synthia-natural-products-2020': [
    {
      familyId: 'chematica-synthia',
      familyName: 'Chematica / Synthia Retrosynthesis AI (PAS / UNIST)',
      modelId: 'chematica-synthia-2020',
      modelName: 'Chematica / Synthia (Causal + AI Retrosynthesis)',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Polish Academy of Sciences / UNIST / Northwestern',
    },
  ],
  'frnn-tokamak-disruption-2019': [
    {
      familyId: 'princeton-fusion-rl',
      familyName: 'Princeton / PPPL Fusion Deep RL',
      modelId: 'frnn-disruption-predictor',
      modelName: 'FRNN (Fusion Recurrent Neural Network)',
      architecture: 'Domain Science Neural Net',
      lab: 'Princeton / PPPL',
    },
  ],
  'discovery-learning-battery-life-2026': [
    {
      familyId: 'umich-nus-discovery-learning',
      familyName: 'Discovery Learning Battery AI (U-M / NUS / Farasis)',
      modelId: 'discovery-learning-battery',
      modelName: 'Discovery Learning (Active + Physics-Guided + Zero-Shot ML)',
      architecture: 'Domain Science Neural Net',
      lab: 'University of Michigan / NUS / Farasis Energy',
    },
  ],
  'delphi-2m-disease-trajectories-2025': [
    {
      familyId: 'delphi-2m-embl',
      familyName: 'Delphi-2M Disease-Trajectory Transformer (EMBL-EBI / DKFZ)',
      modelId: 'delphi-2m',
      modelName: 'Delphi-2M (1,000-Disease Generative Health Transformer)',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'EMBL-EBI / DKFZ / University of Copenhagen',
    },
  ],
  'fmri-semantic-language-decoder-2023': [
    {
      familyId: 'utaustin-fmri-decoder',
      familyName: 'Non-Invasive fMRI Semantic Brain Decoder (UT Austin)',
      modelId: 'fmri-gpt-semantic-decoder',
      modelName: 'fMRI + GPT Continuous Semantic Language Decoder',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'University of Texas at Austin',
    },
  ],
  'handwriting-brain-to-text-bci-2021': [
    {
      familyId: 'braingate-speech-bci',
      familyName: 'Deep-Learning Speech Neuroprostheses (BrainGate)',
      modelId: 'stanford-handwriting-bci',
      modelName: 'Stanford / BrainGate RNN Handwriting BCI',
      architecture: 'Bio & Genomic Neural Net',
      lab: 'Stanford University',
    },
  ],
  'deterministic-subexp-dlp-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'deepmind-rsa1024-cryptanalysis-agents-2026': [
    {
      familyId: 'deepmind-cryptanalysis-agents',
      familyName: 'Google DeepMind Cryptanalysis Agents',
      modelId: 'deepmind-rsa1024-agent-harness',
      modelName: 'DeepMind Two-Agent Cryptanalysis Harness + Lean 4',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Google DeepMind',
    },
  ],
  'rsa-896-factored-claude-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-code-agents',
      modelName: 'Claude Code Agents',
      architecture: 'Frontier Reasoning LLM',
      lab: 'Anthropic',
    },
  ],
  'logcfl-unambiguous-gpt62-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Frontier Reasoning LLM',
      lab: 'OpenAI',
    },
  ],
  'quasi-riemann-hypothesis-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'unique-games-conjecture-openai-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'catalans-constant-irrational-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'kaplansky-conjectures-disproof-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'openai-internal-math',
      modelName: 'OpenAI Internal Frontier Math',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'absolute-galois-group-q2-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-series',
      modelName: 'GPT-5.2 / 5.5 Pro',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'inverse-galois-mathieu-m23-2026': [
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
    },
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-6-sol',
      modelName: 'GPT-5.6 Sol / Pro',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'genus-2-curve-rational-points-record-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
    {
      familyId: 'anthropic-claude',
      familyName: 'Anthropic Claude Lineage',
      modelId: 'claude-fable-5',
      modelName: 'Claude Fable 5 / 5.2',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'Anthropic',
    },
  ],
  'short-superpermutations-8-9-10-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-5-6-sol',
      modelName: 'GPT-5.6 Sol / Pro',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
    },
  ],
  'n-conjecture-n4-disproof-gpt6-2026': [
    {
      familyId: 'openai-gpt',
      familyName: 'OpenAI GPT Lineage',
      modelId: 'gpt-6-astra',
      modelName: 'GPT-6 / 6.2 Astra',
      architecture: 'Neuro-Symbolic LLM + Verifier',
      lab: 'OpenAI',
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
  if (s.includes('alphafold 1')) {
    return [
      {
        familyId: 'alphafold',
        familyName: 'AlphaFold Structural Suite',
        modelId: 'alphafold-1',
        modelName: 'AlphaFold 1 (CASP13)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
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
    s.includes('discorl') ||
    s.includes('deep rl magnetic')
  ) {
    const label = item.aiSystem.split('(')[0].trim();
    return [
      {
        familyId: 'deepmind-deep-rl',
        familyName: 'DeepMind Deep RL (AlphaZero & DiscoRL)',
        modelId: label.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        modelName: label,
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Google DeepMind & Research',
      },
    ];
  }

  // Standalone Google DeepMind Domain Science Neural Nets & Clinical AI
  if (s.includes('amie (')) {
    return [
      {
        familyId: 'google-amie',
        familyName: 'Google AMIE Clinical AI',
        modelId: 'google-amie',
        modelName: 'AMIE (Diagnostic Clinical LLM)',
        architecture: 'Frontier Reasoning LLM',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
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
  if (s.includes('graphcast') || s.includes('gencast')) {
    const isGenCast = s.includes('gencast') && !s.includes('graphcast');
    return [
      {
        familyId: 'graphcast-gencast',
        familyName: 'GraphCast & GenCast',
        modelId: isGenCast ? 'gencast' : 'graphcast',
        modelName: isGenCast ? 'GenCast (Diffusion Ensemble)' : 'GraphCast (Multi-Mesh GNN)',
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
  if (s.includes('rfdiffusion3')) {
    return [
      {
        familyId: 'rosettafold-rfdiffusion',
        familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
        modelId: 'rfdiffusion3',
        modelName: 'RFdiffusion3 (All-Atom Diffusion)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'University of Washington (IPD)',
      },
    ];
  }
  if (s.includes('rfdiffusion2')) {
    return [
      {
        familyId: 'rosettafold-rfdiffusion',
        familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
        modelId: 'rfdiffusion2',
        modelName: 'RFdiffusion2 (Atom-Level Flow Matching)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'University of Washington (IPD)',
      },
    ];
  }
  if (s.includes('rfdiffusion + placer')) {
    return [
      {
        familyId: 'rosettafold-rfdiffusion',
        familyName: 'RoseTTAFold & RFdiffusion (UW IPD)',
        modelId: 'rfdiffusion-placer',
        modelName: 'RFdiffusion + PLACER (Enzyme Design)',
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
  if (s.includes('robin (crow') || s.includes('kosmos (world-model')) {
    const isKosmos = s.includes('kosmos');
    return [
      {
        familyId: 'futurehouse-edison',
        familyName: 'FutureHouse / Edison AI Scientists (Robin & Kosmos)',
        modelId: isKosmos ? 'edison-kosmos' : 'futurehouse-robin',
        modelName: isKosmos ? 'Kosmos (World-Model AI Scientist)' : 'Robin (Crow, Falcon & Finch)',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'FutureHouse / Edison Scientific',
      },
    ];
  }
  if (s.includes('progen (')) {
    return [
      {
        familyId: 'progen-plm',
        familyName: 'ProGen Protein LM (Salesforce / Profluent)',
        modelId: 'progen-1-2b',
        modelName: 'ProGen (1.2B Protein LM)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Salesforce Research / Profluent Bio',
      },
    ];
  }
  if (s.includes('crossbreeding neural network')) {
    return [
      {
        familyId: 'ibs-cbnn',
        familyName: 'Crossbreeding Neural Network (IBS / SNU)',
        modelId: 'ibs-cbnn',
        modelName: 'CBNN Cross-Material Catalyst AI',
        architecture: 'Domain Science Neural Net',
        lab: 'Institute for Basic Science / SNU',
      },
    ];
  }
  if (s.includes('universal model for atoms')) {
    return [
      {
        familyId: 'meta-fair-uma',
        familyName: 'Meta FAIR UMA / OMol25',
        modelId: 'meta-fair-uma',
        modelName: 'UMA (Universal Model for Atoms)',
        architecture: 'Domain Science Neural Net',
        lab: 'Meta FAIR',
      },
    ];
  }
  if (s.includes('urania (')) {
    return [
      {
        familyId: 'urania-ligo-ai',
        familyName: 'Urania Optical Discovery AI (MPL / Caltech)',
        modelId: 'urania-uifo',
        modelName: 'Urania (Differentiable Interferometer AI)',
        architecture: 'Domain Science Neural Net',
        lab: 'Max Planck Institute / Caltech LIGO',
      },
    ];
  }
  if (s.includes('packingstar')) {
    return [
      {
        familyId: 'packingstar-rl',
        familyName: 'PackingStar Game-Theoretic RL',
        modelId: 'packingstar-rl',
        modelName: 'PackingStar (Two-Player Kissing RL)',
        architecture: 'Deep RL & Evolutionary Agent',
        lab: 'Peking University',
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

  // Pre-2020 Early Neural & Clinical / Genomic / Physics AI Pioneers (1988–2019)
  if (s.includes('qian–sejnowski') || s.includes('qian-sejnowski')) {
    return [
      {
        familyId: 'early-protein-nns',
        familyName: 'Early Protein Structure Neural Nets (Qian–Sejnowski / PHD)',
        modelId: 'qian-sejnowski-nn',
        modelName: 'Qian–Sejnowski Feedforward Protein NN',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Johns Hopkins University',
      },
    ];
  }
  if (s.includes('phd (profile-fed')) {
    return [
      {
        familyId: 'early-protein-nns',
        familyName: 'Early Protein Structure Neural Nets (Qian–Sejnowski / PHD)',
        modelId: 'phd-protein-nn',
        modelName: 'PHD Evolutionary-Profile Neural Net',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'EMBL Heidelberg',
      },
    ];
  }
  if (s.includes('raptorx-contact')) {
    return [
      {
        familyId: 'raptorx-contact',
        familyName: 'RaptorX-Contact (2D Deep ResNet)',
        modelId: 'raptorx-contact-resnet',
        modelName: 'RaptorX-Contact (1D+2D Deep ResNet)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Toyota Technological Institute at Chicago',
      },
    ];
  }
  if (s.includes('deepbind')) {
    return [
      {
        familyId: 'deepbind',
        familyName: 'DeepBind Genomic CNN',
        modelId: 'deepbind-cnn',
        modelName: 'DeepBind CNN',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'University of Toronto',
      },
    ];
  }
  if (s.includes('deepsea')) {
    return [
      {
        familyId: 'deepsea',
        familyName: 'DeepSEA Genomic CNN',
        modelId: 'deepsea-cnn',
        modelName: 'DeepSEA Multi-Task CNN',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Princeton University',
      },
    ];
  }
  if (s.includes('deepvariant')) {
    return [
      {
        familyId: 'google-deepvariant',
        familyName: 'Google DeepVariant',
        modelId: 'deepvariant-cnn',
        modelName: 'DeepVariant Genomic CNN',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('spliceai')) {
    return [
      {
        familyId: 'illumina-spliceai',
        familyName: 'Illumina SpliceAI',
        modelId: 'spliceai-dilated-cnn',
        modelName: 'SpliceAI (32-Layer Dilated CNN)',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Illumina AI Lab',
      },
    ];
  }
  if (s.includes('inception-v3 retinal cnn')) {
    return [
      {
        familyId: 'google-clinical-vision',
        familyName: 'Google Clinical Imaging Deep Learning',
        modelId: 'google-retinal-inception-v3',
        modelName: 'Google Diabetic Retinopathy CNN',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('deepmind 3d u-net')) {
    return [
      {
        familyId: 'google-clinical-vision',
        familyName: 'Google Clinical Imaging Deep Learning',
        modelId: 'deepmind-moorfields-3d-oct',
        modelName: 'DeepMind 3D U-Net OCT Triage',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Google DeepMind & Research',
      },
    ];
  }
  if (s.includes('inception-v3 dermatology cnn')) {
    return [
      {
        familyId: 'stanford-clinical-vision',
        familyName: 'Stanford Clinical Dermatology CNN',
        modelId: 'stanford-dermatology-cnn',
        modelName: 'Stanford Skin Cancer Inception-v3 CNN',
        architecture: 'Bio & Genomic Neural Net',
        lab: 'Stanford University',
      },
    ];
  }
  if (s.includes('ibm watson') || s.includes('knit')) {
    return [
      {
        familyId: 'ibm-watson-knit',
        familyName: 'IBM Watson / KnIT',
        modelId: 'ibm-watson-knit',
        modelName: 'IBM Watson KnIT (Knowledge Integration Toolkit)',
        architecture: 'Neuro-Symbolic LLM + Verifier',
        lab: 'IBM Research',
      },
    ];
  }
  if (s.includes('behler–parrinello') || s.includes('behler-parrinello')) {
    return [
      {
        familyId: 'behler-parrinello-bpnn',
        familyName: 'Behler–Parrinello Neural Potentials',
        modelId: 'behler-parrinello-bpnn',
        modelName: 'Behler–Parrinello Symmetry-Function NN',
        architecture: 'Domain Science Neural Net',
        lab: 'ETH Zurich',
      },
    ];
  }
  if (s.includes('higgs / susy')) {
    return [
      {
        familyId: 'uci-lhc-dnn',
        familyName: 'UCI LHC Particle Discovery DNN',
        modelId: 'uci-lhc-dnn',
        modelName: 'Baldi–Sadowski–Whiteson LHC Deep NN',
        architecture: 'Domain Science Neural Net',
        lab: 'UC Irvine',
      },
    ];
  }
  if (s.includes('dark reactions')) {
    return [
      {
        familyId: 'dark-reactions-ml',
        familyName: 'Dark Reactions Materials ML',
        modelId: 'dark-reactions-svm-tree',
        modelName: 'Dark Reactions SVM & Decision-Tree ML',
        architecture: 'Domain Science Neural Net',
        lab: 'Haverford College / Purdue',
      },
    ];
  }
  if (s.includes('neural-network quantum states')) {
    return [
      {
        familyId: 'carleo-troyer-nqs',
        familyName: 'Neural-Network Quantum States (NQS)',
        modelId: 'carleo-troyer-rbm-nqs',
        modelName: 'Carleo–Troyer RBM Quantum Wavefunction',
        architecture: 'Domain Science Neural Net',
        lab: 'ETH Zurich',
      },
    ];
  }
  if (s.includes('strong-lensing deep cnn')) {
    return [
      {
        familyId: 'stanford-lensing-cnn',
        familyName: 'Stanford KIPAC Strong-Lensing CNN',
        modelId: 'hezaveh-lensing-cnn',
        modelName: 'Hezaveh Strong-Lensing CNN Ensemble',
        architecture: 'Domain Science Neural Net',
        lab: 'Stanford University',
      },
    ];
  }
  if (s.includes('d³m') || s.includes('deep density displacement')) {
    return [
      {
        familyId: 'flatiron-d3m',
        familyName: 'Flatiron / CMU D³M Cosmology NN',
        modelId: 'd3m-3d-unet',
        modelName: 'D³M 3D Cosmic Structure U-Net',
        architecture: 'Domain Science Neural Net',
        lab: 'Flatiron Institute / CMU',
      },
    ];
  }

  // Cohesive Pre-2020 Symbolic & Formal Reasoning Dynasties
  if (s.includes('aura / niutp') || s.includes('otter (argonne') || s.startsWith('eqp')) {
    const isAura = s.includes('aura');
    const isOtter = s.includes('otter');
    return [
      {
        familyId: 'argonne-atp',
        familyName: 'Argonne Automated Theorem Provers (AURA / EQP / OTTER)',
        modelId: isAura ? 'argonne-aura' : isOtter ? 'argonne-otter' : 'argonne-eqp',
        modelName: isAura ? 'AURA / NIUTP Prover' : isOtter ? 'OTTER Equational Prover' : 'EQP Equational Prover',
        architecture: 'Classical Symbolic & SAT AI',
        lab: 'Argonne National Laboratory',
      },
    ];
  }
  if (s.includes('coq proof assistant')) {
    const isMathComp = s.includes('mathematical components');
    return [
      {
        familyId: 'coq-proof-assistant',
        familyName: 'Coq Symbolic Proof Assistant (SSReflect / MathComp)',
        modelId: isMathComp ? 'coq-mathcomp' : 'coq-ssreflect',
        modelName: isMathComp ? 'Coq + Mathematical Components' : 'Coq + SSReflect',
        architecture: 'Classical Symbolic & SAT AI',
        lab: 'Microsoft Research–INRIA',
      },
    ];
  }
  if (s.includes('robot scientist adam') || s.includes('robot scientist eve')) {
    const isEve = s.includes('eve');
    return [
      {
        familyId: 'robot-scientist',
        familyName: 'Robot Scientist Series (Adam & Eve)',
        modelId: isEve ? 'robot-scientist-eve' : 'robot-scientist-adam',
        modelName: isEve ? 'Robot Scientist Eve' : 'Robot Scientist Adam',
        architecture: 'Classical Symbolic & SAT AI',
        lab: isEve ? 'University of Cambridge / Manchester' : 'Aberystwyth University',
      },
    ];
  }

  // Automated SAT Solvers (Konev–Lisitsa Liverpool + Heule Group UT Austin / CMU)
  if (s.includes('sat solver') || s.includes('cadical')) {
    if (s.includes('glucose & plingeling')) {
      return [
        {
          familyId: 'automated-sat-solvers',
          familyName: 'Automated SAT Solvers (DRUP / DRAT)',
          modelId: 'glucose-plingeling-sat',
          modelName: 'Glucose / Plingeling SAT Solvers (DRUP)',
          architecture: 'Classical Symbolic & SAT AI',
          lab: 'University of Liverpool',
        },
      ];
    }
    const isCadical = s.includes('cadical');
    return [
      {
        familyId: 'automated-sat-solvers',
        familyName: 'Automated SAT Solvers (DRUP / DRAT)',
        modelId: isCadical ? 'cadical-sat-solver' : 'cube-and-conquer-sat',
        modelName: isCadical ? 'CaDiCaL SAT Solver (DRAT)' : 'Cube-and-Conquer SAT Solver (DRAT)',
        architecture: 'Classical Symbolic & SAT AI',
        lab: 'UT Austin / CMU (Heule Group)',
      },
    ];
  }

  // Symbolic / Classical Pioneers (1969–2021)
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
