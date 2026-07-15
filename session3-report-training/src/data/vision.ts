import { Braces, Bot, Languages, Sigma, MapPin, type LucideIcon } from "lucide-react";

export interface VisionPillar {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  why: string;
  data: string;
  evaluation: string;
  accent: string; // tailwind gradient stops
}

export const VISION_PILLARS: VisionPillar[] = [
  {
    id: "coding",
    icon: Braces,
    title: "Coding Excellence",
    tagline: "Repo-scale reasoning, not snippet autocomplete.",
    why: "Code is the highest-leverage capability: it compounds into agentic tool-use, data analysis, and reproducible reasoning. A model that writes, edits and debugs across a real repository unlocks the majority of enterprise value.",
    data: "Permissively-licensed GitHub, fill-in-the-middle spans, PR diffs with review threads, executable notebooks, and synthetic bug→fix trajectories with unit-test verification signals.",
    evaluation: "HumanEval+, LiveCodeBench (contamination-controlled), and SWE-bench Verified for multi-file patch generation against a real test harness.",
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "agentic",
    icon: Bot,
    title: "Agentic Intelligence",
    tagline: "Plan, call tools, recover from failure.",
    why: "Frontier value is shifting from single answers to multi-step task completion. The model must decompose goals, invoke tools/APIs, read observations, and self-correct over long horizons without losing state.",
    data: "Tool-call traces (function schemas + arguments + observations), browser and terminal trajectories, ReAct-style planning transcripts, and rejection-sampled successful task completions.",
    evaluation: "ToolBench for API selection accuracy, BrowserBench for web navigation, and internal long-horizon task suites scored on end-state success, not surface similarity.",
    accent: "from-indigo-400 to-violet-500",
  },
  {
    id: "indic",
    icon: Languages,
    title: "Indic Language Mastery",
    tagline: "Ten scripts, first-class — not translated English.",
    why: "1.4B people are underserved by English-centric models. True mastery means native fluency, script-correct generation, and cultural grounding across Hindi, Telugu, Tamil, Bengali, Marathi, Kannada, Gujarati, Malayalam and more.",
    data: "Native web + literature (not machine-translated), Indian government corpora, transliteration pairs, code-switched Hinglish, and human-authored Indic instruction data.",
    evaluation: "FLORES-200 for translation, native human evaluation for fluency/cultural correctness, and BharatBench for India-grounded knowledge and reasoning.",
    accent: "from-emerald-400 to-cyan-500",
  },
  {
    id: "scimath",
    icon: Sigma,
    title: "Science & Mathematics",
    tagline: "Verifiable, step-by-step, symbol-aware.",
    why: "Math and science are the backbone of rigorous reasoning. Strong symbolic manipulation and multi-step derivation transfer directly into coding, analysis and agentic planning quality.",
    data: "Curated textbooks, arXiv (LaTeX-preserved), peer-reviewed papers, worked-solution datasets, and synthetic chain-of-thought with automatic answer verification.",
    evaluation: "GSM8K and MATH for problem solving, AIME for competition-grade reasoning, and GPQA for graduate-level science.",
    accent: "from-blue-400 to-indigo-500",
  },
  {
    id: "india-first",
    icon: MapPin,
    title: "India-First Worldview",
    tagline: "Local law, geography, policy and context — by default.",
    why: "A model deployed in India must reason correctly about its constitution, statutes, regional geography, festivals, currency, and civic systems — knowledge that is systematically under-represented in Western-centric pre-training.",
    data: "Public government & policy documents, judicial texts, Indian news archives, regional encyclopaedic content, and curated India-centric Q&A.",
    evaluation: "BharatBench knowledge tracks plus expert-authored India-context probes covering law, civics, geography and current affairs.",
    accent: "from-amber-400 to-orange-500",
  },
];
