export interface FertilityTarget {
  domain: string;
  target: number;
  category: "language" | "code" | "science" | "math" | "agentic";
  rationale: string;
}

export const FERTILITY_TARGETS: FertilityTarget[] = [
  { domain: "English", target: 1.1, category: "language", rationale: "Largest, most compressible corpus; anchors the vocabulary's efficient core." },
  { domain: "Code", target: 1.05, category: "code", rationale: "Highly repetitive tokens/keywords compress extremely well; low fertility keeps context budget for long files." },
  { domain: "Mathematics", target: 1.05, category: "math", rationale: "Small symbol alphabet with reserved LaTeX/operator tokens yields very tight encoding." },
  { domain: "Science", target: 1.08, category: "science", rationale: "Technical vocabulary plus notation; slightly higher than pure math due to prose." },
  { domain: "Agentic Tasks", target: 1.08, category: "agentic", rationale: "Reserved tool-call, JSON and role tokens make structured trajectories cheap to represent." },
  { domain: "Hindi", target: 1.18, category: "language", rationale: "Devanagari with rich conjuncts; strong dedicated vocabulary share keeps it near English." },
  { domain: "Bengali", target: 1.18, category: "language", rationale: "High-resource script with substantial curated data supports a low target." },
  { domain: "Marathi", target: 1.18, category: "language", rationale: "Shares Devanagari with Hindi, benefiting from cross-lingual subword reuse." },
  { domain: "Telugu", target: 1.2, category: "language", rationale: "Agglutinative with many surface forms; more subwords per word than Devanagari." },
  { domain: "Tamil", target: 1.2, category: "language", rationale: "Agglutinative morphology inflates word forms; balanced against vocabulary budget." },
  { domain: "Kannada", target: 1.22, category: "language", rationale: "Lower-resource script; fewer merges available, so a slightly higher target is realistic." },
  { domain: "Gujarati", target: 1.22, category: "language", rationale: "Moderate resource level; target set to protect balance without over-spending vocab." },
  { domain: "Malayalam", target: 1.23, category: "language", rationale: "Highly agglutinative with long compounds; the hardest Indic target under a shared vocab." },
];

export const FERTILITY_NARRATIVE =
  "Targets are set by data availability and morphological complexity, then balanced against a fixed 131,072-token budget. Latin-script and symbolic domains (code, math) compress best and anchor the low end; agglutinative Dravidian languages (Telugu, Tamil, Kannada, Malayalam) sit highest because more subwords are needed per word. Crucially, the spread is kept tight — no language is starved so that another can shine — which is what makes the model feel equally fluent across scripts.";
