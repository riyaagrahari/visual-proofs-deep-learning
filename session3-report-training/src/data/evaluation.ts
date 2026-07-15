import { Braces, Sigma, FlaskConical, BookOpen, Bot, Languages, type LucideIcon } from "lucide-react";

export interface Benchmark {
  name: string;
  measures: string;
  matters: string;
  success: string;
}

export interface BenchmarkGroup {
  id: string;
  title: string;
  icon: LucideIcon;
  accent: string;
  benchmarks: Benchmark[];
}

export const BENCHMARK_GROUPS: BenchmarkGroup[] = [
  {
    id: "coding",
    title: "Coding",
    icon: Braces,
    accent: "from-cyan-400 to-blue-500",
    benchmarks: [
      { name: "HumanEval+", measures: "Functional correctness of standalone function synthesis with expanded tests.", matters: "Baseline signal for code generation quality and regression tracking.", success: "≥ 85% pass@1 on the hardened test set." },
      { name: "LiveCodeBench", measures: "Contest problems released after the training cutoff — contamination-resistant.", matters: "Tests genuine problem-solving, not memorized solutions.", success: "Top-tier open-weight performance on post-cutoff splits." },
      { name: "SWE-bench Verified", measures: "Resolving real GitHub issues via multi-file patches against a test harness.", matters: "The closest proxy to real software-engineering agency.", success: "≥ 40% resolved, competitive with frontier open models." },
    ],
  },
  {
    id: "math",
    title: "Mathematics",
    icon: Sigma,
    accent: "from-blue-400 to-indigo-500",
    benchmarks: [
      { name: "GSM8K", measures: "Grade-school multi-step arithmetic word problems.", matters: "Sanity check for reliable step-by-step reasoning.", success: "≥ 92% with chain-of-thought." },
      { name: "MATH", measures: "Competition mathematics across algebra, geometry and number theory.", matters: "Stresses symbolic manipulation and long derivations.", success: "≥ 60% exact-match answer accuracy." },
      { name: "AIME", measures: "Olympiad-qualifier problems demanding creative multi-step proofs.", matters: "Ceiling test for frontier mathematical reasoning.", success: "Meaningful non-trivial solve rate under sampling." },
    ],
  },
  {
    id: "science",
    title: "Science",
    icon: FlaskConical,
    accent: "from-indigo-400 to-violet-500",
    benchmarks: [
      { name: "GPQA", measures: "Graduate-level, Google-proof questions in physics, chemistry and biology.", matters: "Probes deep, expert-level scientific reasoning beyond recall.", success: "Above strong-baseline accuracy on the Diamond subset." },
    ],
  },
  {
    id: "general",
    title: "General Knowledge",
    icon: BookOpen,
    accent: "from-sky-400 to-cyan-500",
    benchmarks: [
      { name: "MMLU-Pro", measures: "Robust, reasoning-heavy multitask understanding across 57+ subjects.", matters: "Broad competence signal that is harder to game than original MMLU.", success: "Competitive with leading open-weight models of similar scale." },
    ],
  },
  {
    id: "agentic",
    title: "Agentic",
    icon: Bot,
    accent: "from-violet-400 to-fuchsia-500",
    benchmarks: [
      { name: "ToolBench", measures: "Correct API/tool selection and argument construction across many tools.", matters: "Foundation of reliable tool-augmented behaviour.", success: "High tool-selection and call-validity rates." },
      { name: "BrowserBench", measures: "Multi-step web navigation and information gathering.", matters: "Tests long-horizon planning and observation grounding.", success: "Strong task-completion on held-out sites." },
    ],
  },
  {
    id: "indic",
    title: "Indic",
    icon: Languages,
    accent: "from-emerald-400 to-cyan-500",
    benchmarks: [
      { name: "FLORES-200", measures: "Translation quality across Indic ↔ English directions.", matters: "Objective cross-lingual fidelity signal.", success: "State-of-the-art open chrF++/BLEU on Indic pairs." },
      { name: "BharatBench", measures: "India-grounded knowledge and reasoning across languages.", matters: "Directly validates the India-first objective.", success: "Best-in-class accuracy across all covered languages." },
      { name: "Native Human Evaluation", measures: "Fluency, cultural correctness and helpfulness judged by native speakers.", matters: "The only true test of Indic mastery — benchmarks alone miss nuance.", success: "≥ 4.3/5 mean native-speaker rating across languages." },
    ],
  },
];
