// Deterministic, illustrative model of how vocabulary size trades off against
// fertility, embedding cost and compute. Numbers are engineering estimates for
// a ~40B dense model with hidden size 6144 and tied input/output embeddings,
// chosen to reflect the well-known "sweet spot" behaviour: past ~128K, the
// shrinking sequence length no longer offsets the growing embedding/softmax
// matrix, so effective training/inference cost bottoms out and then rises.

export const D_MODEL = 6144; // hidden size of the 40B dense backbone
export const BYTES_PER_PARAM = 2; // bf16

export interface VocabOption {
  label: string;
  vocab: number;
  /** Blended tokens-per-word across web + code + Indic, lower is better. */
  fertility: number;
  /** Relative training compute to consume a fixed text budget (128K = min). */
  trainCostIndex: number;
  /** Relative decode cost per generated character (128K near min). */
  inferenceCostIndex: number;
  recommended?: boolean;
}

export const VOCAB_OPTIONS: VocabOption[] = [
  { label: "32K", vocab: 32768, fertility: 1.42, trainCostIndex: 100, inferenceCostIndex: 100 },
  { label: "64K", vocab: 65536, fertility: 1.27, trainCostIndex: 96, inferenceCostIndex: 95 },
  { label: "96K", vocab: 98304, fertility: 1.19, trainCostIndex: 93, inferenceCostIndex: 92 },
  {
    label: "128K",
    vocab: 131072,
    fertility: 1.14,
    trainCostIndex: 91,
    inferenceCostIndex: 90,
    recommended: true,
  },
  { label: "160K", vocab: 163840, fertility: 1.11, trainCostIndex: 92, inferenceCostIndex: 92 },
  { label: "256K", vocab: 262144, fertility: 1.06, trainCostIndex: 98, inferenceCostIndex: 100 },
];

export const RECOMMENDED_INDEX = VOCAB_OPTIONS.findIndex((o) => o.recommended);

export interface VocabMetrics extends VocabOption {
  embeddingParams: number;
  embeddingParamsM: number; // millions
  embeddingMemoryGB: number;
  /** Transformer-body throughput vs the 32K baseline (fewer tokens = higher). */
  sequenceEfficiency: number;
}

const BASELINE_FERTILITY = VOCAB_OPTIONS[0].fertility;

export function computeMetrics(option: VocabOption): VocabMetrics {
  const embeddingParams = option.vocab * D_MODEL;
  return {
    ...option,
    embeddingParams,
    embeddingParamsM: embeddingParams / 1e6,
    embeddingMemoryGB: (embeddingParams * BYTES_PER_PARAM) / 1e9,
    sequenceEfficiency: (BASELINE_FERTILITY / option.fertility) * 100,
  };
}

export const VOCAB_METRICS: VocabMetrics[] = VOCAB_OPTIONS.map(computeMetrics);

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}
