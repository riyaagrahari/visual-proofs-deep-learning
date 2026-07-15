export interface Reference {
  label: string;
  note: string;
}

export const REFERENCES: Reference[] = [
  { label: "Chinchilla", note: "Compute-optimal scaling of tokens vs parameters." },
  { label: "Llama", note: "Open-weight decoder-only training recipe & data scale." },
  { label: "Gemma", note: "Efficient small–mid foundation models; the comparison target." },
  { label: "DeepSeek", note: "Code/math-centric pre-training and RL from verifiable rewards." },
  { label: "Qwen", note: "Strong multilingual + large-vocabulary tokenizer design." },
  { label: "Mistral", note: "Efficient architectures and high-quality data curation." },
  { label: "PaLM", note: "Large-scale training and emergent reasoning behaviour." },
  { label: "FLAN", note: "Instruction-tuning at scale for zero-shot generalization." },
  { label: "BharatBench", note: "Evaluation suite for Indian-language capabilities." },
  { label: "FLORES-200", note: "Multilingual machine-translation evaluation." },
  { label: "HumanEval", note: "Functional-correctness benchmark for code generation." },
  { label: "SWE-bench", note: "Real-world software-engineering task benchmark." },
];
