// Mirrors backend/api/schemas.py exactly -- the frontend never invents a
// field or computes a statistic itself; everything shown is whatever the
// API returned from running the actual tokenizer.

export interface LanguageStatistics {
  language: string;
  total_tokens: number;
  /** Faithful-unit count: contiguous letter/mark/number runs + each visible
   * non-space punctuation/symbol char (the assignment's fertility denominator). */
  total_words: number;
  /** Fertility = total_tokens / faithful units. */
  ratio: number;
}

export interface StatisticsResponse {
  vocab_size: number;
  languages: LanguageStatistics[];
  largest_ratio: number;
  smallest_ratio: number;
  difference: number;
  /** Either a plain number, or the literal string "Infinity" when
   * difference === 0 -- see backend/bpe/evaluation.py. */
  assignment_score: number | string;
}

export interface TokenizeResponse {
  pretokens: string[];
  tokens: string[];
  ids: number[];
  decoded_text: string;
}

export interface HealthResponse {
  status: string;
  tokenizer_trained: boolean;
}
