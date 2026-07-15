export interface TrainingStage {
  id: string;
  title: string;
  tag: string;
  input: string;
  output: string;
  objective: string;
  necessity: string;
}

export const TRAINING_STAGES: TrainingStage[] = [
  {
    id: "pretrain",
    title: "Pre-training",
    tag: "Self-supervised · ~9T tokens",
    input: "Curated, deduplicated multilingual + code + math corpus with a curriculum schedule.",
    output: "A base model with broad knowledge and latent reasoning ability.",
    objective: "Next-token prediction (causal LM) with capability-annealed data mixing.",
    necessity: "Everything downstream is a small refinement of what is learned here — capability that is absent from pre-training is expensive or impossible to add later.",
  },
  {
    id: "sft",
    title: "Supervised Fine-Tuning",
    tag: "Instruction tuning · ~2M dialogues",
    input: "High-quality multilingual instructions, tool-call traces and verified chain-of-thought.",
    output: "An instruction-following chat model that reasons step-by-step and uses tools.",
    objective: "Supervised loss on curated responses; format, refusal and tool-call schemas learned here.",
    necessity: "Converts raw next-token ability into helpful, controllable behaviour and establishes the interaction contract.",
  },
  {
    id: "dpo",
    title: "Preference Optimization",
    tag: "DPO / RLHF · preference pairs",
    input: "Human preference pairs plus AI-assisted preference labels across helpfulness and harmlessness.",
    output: "A model whose outputs are ranked closer to human preference.",
    objective: "Direct Preference Optimization (with PPO fallback) to raise preferred-response likelihood.",
    necessity: "SFT teaches one 'correct' answer; preference optimization teaches the far richer signal of which of two good answers is better.",
  },
  {
    id: "agentic",
    title: "Agentic Alignment",
    tag: "RLVR · verifiable rewards",
    input: "Tool/coding/math tasks with programmatic verifiers (tests pass, answer correct, task complete).",
    output: "Reliable multi-step planning, tool use and self-correction.",
    objective: "Reinforcement learning from verifiable rewards on task end-state, not surface text.",
    necessity: "Long-horizon agentic skill only emerges when the reward measures outcomes; imitation alone cannot teach recovery from failure.",
  },
  {
    id: "safety",
    title: "Safety Alignment",
    tag: "Red-team · policy tuning",
    input: "Adversarial prompts, red-team transcripts and multilingual safety policies.",
    output: "Calibrated refusals, jailbreak resistance and reduced harmful outputs.",
    objective: "Targeted preference + adversarial training against a written safety spec.",
    necessity: "Deployment in a multilingual, high-stakes context demands safety that holds across languages and adversarial pressure.",
  },
  {
    id: "eval",
    title: "Evaluation",
    tag: "Gated release",
    input: "Contamination-controlled benchmarks, native Indic human eval and agentic task suites.",
    output: "A go/no-go decision and a capability report card.",
    objective: "Measure against the stated objectives before any checkpoint ships.",
    necessity: "Closes the loop — every prior stage is only justified by measured improvement on the objectives.",
  },
];
