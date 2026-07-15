import {
  FileStack,
  Languages,
  Regex,
  CopyCheck,
  Gauge,
  ShieldAlert,
  GitBranch,
  Database,
  type LucideIcon,
} from "lucide-react";

export interface CleaningStage {
  id: string;
  icon: LucideIcon;
  title: string;
  short: string;
  why: string;
  methods: string[];
  tradeoff: string;
}

export const CLEANING_STAGES: CleaningStage[] = [
  {
    id: "raw",
    icon: FileStack,
    title: "Raw Documents",
    short: "Ingest",
    why: "Heterogeneous crawl, code, books and Indic corpora arrive with wildly different encodings, structure and quality.",
    methods: ["Format-aware extraction (HTML/PDF/LaTeX/notebooks)", "Provenance & license tagging", "Content-hash assignment"],
    tradeoff: "Aggressive extraction risks dropping structure (tables, code blocks); we keep structure-preserving parsers even when slower.",
  },
  {
    id: "langid",
    icon: Languages,
    title: "Language Identification",
    short: "Detect",
    why: "Per-language routing is essential to protect Indic share and apply script-specific rules; mislabelled language poisons downstream mixing.",
    methods: ["FastText/CLD3 script + language classifier", "Code-switch (Hinglish) detection", "Confidence thresholds with human-audited samples"],
    tradeoff: "Short and code-mixed texts are hard to classify; we keep low-confidence docs in a review pool rather than silently discarding Indic data.",
  },
  {
    id: "normalize",
    icon: Regex,
    title: "Unicode Normalization",
    short: "Normalize",
    why: "Indic scripts encode the same grapheme many ways; without normalization the tokenizer wastes vocabulary and fertility inflates.",
    methods: ["NFC canonicalization", "Preserve ZWJ/ZWNJ (semantic in Indic scripts)", "Whitespace, quote and digit normalization"],
    tradeoff: "Over-normalizing (e.g. stripping ZWJ) corrupts meaning; we normalize form but never collapse semantically distinct sequences.",
  },
  {
    id: "dedup",
    icon: CopyCheck,
    title: "Deduplication",
    short: "Dedup",
    why: "Duplicates waste compute, memorize verbatim text and skew the distribution toward whatever is most copied online.",
    methods: ["MinHash + LSH near-dedup", "Exact substring/suffix-array dedup", "Cross-split dedup to prevent eval leakage"],
    tradeoff: "Too-aggressive dedup removes legitimately repeated facts/boilerplate structure; thresholds are tuned per-domain (code vs prose).",
  },
  {
    id: "quality",
    icon: Gauge,
    title: "Quality Scoring",
    short: "Score",
    why: "A learned quality signal lets us upweight information-dense text and downweight spam without brittle hand-rules.",
    methods: ["Classifier trained on curated positives", "Perplexity & heuristic features", "Per-language calibrated thresholds"],
    tradeoff: "Quality models inherit annotator bias and can penalise dialectal Indic text; we calibrate per language and keep a diversity floor.",
  },
  {
    id: "safety",
    icon: ShieldAlert,
    title: "Safety & Toxicity Filtering",
    short: "Filter",
    why: "Remove CSAM, extreme toxicity, and high-risk PII before the model ever sees it — cheaper and safer than fixing it post-hoc.",
    methods: ["Multi-lingual toxicity classifiers", "PII detection & redaction", "Hash-based known-illegal-content removal"],
    tradeoff: "Over-filtering erases legitimate discussion of sensitive topics; we tune for precision on illegal content and defer nuance to alignment.",
  },
  {
    id: "code",
    icon: GitBranch,
    title: "Code Repository Filtering",
    short: "Code gate",
    why: "Code needs domain-specific gates: licenses, secrets and machine-generated files that generic text filters miss.",
    methods: ["SPDX license allow-listing", "Secret/key detection", "Static-analysis & test-signal quality gates"],
    tradeoff: "Strict license filtering shrinks volume; we accept less code to eliminate legal and secret-leak risk.",
  },
  {
    id: "corpus",
    icon: Database,
    title: "Training Corpus",
    short: "Ship",
    why: "The curated, mixed, and scheduled corpus that feeds pre-training — versioned and reproducible.",
    methods: ["Domain rebalancing to target mix", "Curriculum ordering & annealing schedule", "Frozen, versioned snapshots"],
    tradeoff: "Any fixed mix is a bet; we snapshot and ablate mixes on small proxies before committing to the full run.",
  },
];
