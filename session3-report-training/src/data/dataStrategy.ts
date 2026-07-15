export interface DataCategory {
  id: string;
  name: string;
  share: number; // percentage
  color: string;
  sources: string;
  why: string;
  risks: string;
  cleaning: string;
  capability: string;
}

// Sums to 100.
export const DATA_MIX: DataCategory[] = [
  {
    id: "web",
    name: "High-quality Web",
    share: 28,
    color: "#3b82f6",
    sources: "Filtered CommonCrawl, curated web snapshots, and high-signal domains selected by a learned quality classifier.",
    why: "The broad backbone of world knowledge, register diversity and linguistic coverage. Nothing else matches web-scale token volume.",
    risks: "Boilerplate, SEO spam, PII, toxicity, and heavy English skew that can crowd out Indic and code capability.",
    cleaning: "Model-based quality scoring, near-dedup (MinHash/LSH), PII scrubbing, toxicity filtering and per-language rebalancing to protect Indic share.",
    capability: "General knowledge, fluency, common-sense reasoning and instruction-following priors.",
  },
  {
    id: "code",
    name: "Code",
    share: 22,
    color: "#22d3ee",
    sources: "Permissively-licensed GitHub, package registries, competitive-programming solutions, and notebooks with executed outputs.",
    why: "Code is the strongest single driver of reasoning and agentic capability; it also carries structured, verifiable signal.",
    risks: "License contamination, secrets/keys, auto-generated or vendored files, and duplicated forks inflating certain patterns.",
    cleaning: "License allow-listing, secret detection, near-dedup at file and repo level, and static-analysis quality gates; keep FIM spans.",
    capability: "Program synthesis, debugging, tool-use scaffolding and multi-step logical reasoning.",
  },
  {
    id: "books",
    name: "Books",
    share: 12,
    color: "#6366f1",
    sources: "Public-domain and licensed books, long-form non-fiction, and Indic literature in native scripts.",
    why: "Long-range coherence, narrative structure, and deep domain prose that short web text cannot provide.",
    risks: "Copyright exposure and OCR noise in scanned regional-language works.",
    cleaning: "Rights verification, OCR error correction, de-hyphenation, and structure-aware chunking to preserve long context.",
    capability: "Long-context coherence, stylistic range and deep subject knowledge.",
  },
  {
    id: "scimath",
    name: "Science & Math",
    share: 10,
    color: "#818cf8",
    sources: "arXiv (LaTeX-preserved), textbooks, worked-solution sets, and verified chain-of-thought corpora.",
    why: "Directly targets the science/math objective and strengthens symbolic, step-wise reasoning that transfers everywhere.",
    risks: "Equation corruption during extraction and unverifiable or wrong intermediate steps.",
    cleaning: "LaTeX-preserving extraction, math-token normalization, and answer-level verification for reasoning traces.",
    capability: "Quantitative reasoning, derivations and scientific literacy.",
  },
  {
    id: "wiki",
    name: "Wikipedia",
    share: 5,
    color: "#0ea5e9",
    sources: "English + all major Indic-language Wikipedias and Wikidata.",
    why: "Dense, well-structured factual grounding with strong multilingual parallelism.",
    risks: "Coverage gaps and quality variance across smaller Indic editions.",
    cleaning: "Markup stripping, template flattening, and cross-lingual link alignment.",
    capability: "Factual recall and entity grounding across languages.",
  },
  {
    id: "gov",
    name: "Government & Policy",
    share: 5,
    color: "#38bdf8",
    sources: "Gazettes, statutes, judicial opinions, RBI/SEBI circulars, and public policy papers.",
    why: "Core of the India-first worldview: law, civics and regulation the model must reason about correctly.",
    risks: "Formatting noise, jurisdiction ambiguity, and stale/superseded provisions.",
    cleaning: "Structure parsing, date/version tagging, and citation-aware chunking.",
    capability: "Legal, civic and policy reasoning grounded in Indian context.",
  },
  {
    id: "news",
    name: "News",
    share: 5,
    color: "#2dd4bf",
    sources: "Licensed Indian and global news archives across languages.",
    why: "Temporal grounding, current-affairs coverage and regional event knowledge.",
    risks: "Bias, paywalled duplication, and recency-driven distribution shift.",
    cleaning: "Source diversification, dedup, timestamping and bias-aware sampling.",
    capability: "Current-events awareness and India-centric factuality.",
  },
  {
    id: "indic-lit",
    name: "Indic Literature",
    share: 5,
    color: "#34d399",
    sources: "Native-script poetry, prose, folklore and classical works across ten languages.",
    why: "Cultural depth and idiomatic fluency that translated text erases.",
    risks: "Digitization scarcity and OCR noise for low-resource scripts.",
    cleaning: "Unicode NFC normalization, ZWJ/ZWNJ preservation and OCR repair.",
    capability: "Native fluency, cultural grounding and stylistic authenticity.",
  },
  {
    id: "qa",
    name: "Q&A / Forums",
    share: 4,
    color: "#a78bfa",
    sources: "Permissively-licensed technical Q&A, community forums and discussion threads.",
    why: "Natural instruction-response structure and pragmatic, real-world problem framing.",
    risks: "Low-quality answers, snark, and outdated technical advice.",
    cleaning: "Vote/accept-signal weighting, quality scoring and toxicity filtering.",
    capability: "Helpful, practical response style and problem decomposition.",
  },
  {
    id: "synthetic",
    name: "Synthetic Curriculum",
    share: 4,
    color: "#f472b6",
    sources: "Model-generated, verifier-filtered curricula for math, code, tool-use and Indic instructions.",
    why: "Targeted capability injection and coverage of rare skills where organic data is scarce.",
    risks: "Distributional collapse and error amplification if left unverified.",
    cleaning: "Execution/answer verification, diversity constraints and strict dedup against real data.",
    capability: "Reasoning depth, agentic behaviour and low-resource-skill coverage.",
  },
];

export interface PostTrainingStage {
  id: string;
  title: string;
  subtitle: string;
  purpose: string;
  examples: string[];
}

export const TRAINING_DATA_PHASES: PostTrainingStage[] = [
  {
    id: "pretrain",
    title: "Pre-training Data",
    subtitle: "~9T tokens · self-supervised",
    purpose:
      "Build broad world knowledge, language coverage and reasoning priors. Mix is scheduled: heavier web early, upweighted code/math/Indic in the annealing phase to sharpen target capabilities.",
    examples: [
      "Filtered multilingual web + Indic corpora",
      "Deduplicated permissive code with FIM spans",
      "arXiv, textbooks and long-form books",
      "Curriculum-annealed high-quality tail",
    ],
  },
  {
    id: "sft",
    title: "Instruction Tuning Data",
    subtitle: "~2M curated conversations",
    purpose:
      "Teach the model to follow instructions, hold multi-turn dialogue, use tools and reason step-by-step — with deliberate Indic and coding representation rather than English-only SFT.",
    examples: [
      "Human-written multilingual instructions",
      "Verified tool-call and agent trajectories",
      "Chain-of-thought with answer verification",
      "Native Indic task data (not translated)",
    ],
  },
  {
    id: "prefs",
    title: "Preference / RL Alignment",
    subtitle: "Preference pairs + verifiable rewards",
    purpose:
      "Align outputs to human preference, honesty and safety, and push agentic/coding/math skill using programmatic reward signals (tests pass, answer correct, task completed).",
    examples: [
      "Human preference pairs (helpfulness, harmlessness)",
      "RLVR: unit-test and answer-checker rewards",
      "Agentic outcome rewards on task end-state",
      "Indic-native preference annotation",
    ],
  },
];
