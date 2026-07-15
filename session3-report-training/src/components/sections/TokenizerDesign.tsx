import { useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { Gauge, Cpu, Zap, HardDrive, TerminalSquare, Check } from "lucide-react";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";
import { AnimatedNumber } from "../ui/AnimatedNumber";
import {
  VOCAB_OPTIONS,
  VOCAB_METRICS,
  RECOMMENDED_INDEX,
  computeMetrics,
  D_MODEL,
} from "../../lib/tokenizerMath";

const WHY_POINTS = [
  { icon: Gauge, title: "Fertility", body: "Fewer tokens per word means longer effective context and less compute wasted re-encoding the same meaning." },
  { icon: Cpu, title: "Compression", body: "A denser vocabulary packs more information per token, directly lowering training and serving FLOPs for equal text." },
  { icon: Zap, title: "Multilingual efficiency", body: "A large, well-allocated vocabulary keeps Indic scripts from fragmenting into bytes — the difference between fluency and stutter." },
  { icon: HardDrive, title: "Embedding & memory", body: "Vocabulary size scales the embedding/softmax matrix linearly; too large wastes GPU memory and parameters on rare tokens." },
];

const chartData = VOCAB_METRICS.map((m) => ({
  label: m.label,
  vocab: m.vocab,
  fertility: m.fertility,
  trainCost: m.trainCostIndex,
}));

export function TokenizerDesign() {
  const [idx, setIdx] = useState(RECOMMENDED_INDEX);
  const metrics = computeMetrics(VOCAB_OPTIONS[idx]);
  const isRecommended = idx === RECOMMENDED_INDEX;

  return (
    <Section id="tokenizer">
      <SectionHeading
        index="05"
        eyebrow="Tokenizer Design"
        title="The tokenizer is a model-defining decision"
        description="Before a single parameter is trained, the tokenizer fixes how efficiently every language, code and equation is represented. It silently caps context length, embedding cost and multilingual fairness — so we treat it as a first-class design choice, not an afterthought."
      />

      {/* Why it matters */}
      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_POINTS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <div className="glass glass-hover h-full rounded-2xl p-5">
              <p.icon className="h-5 w-5 text-accent-cyan" />
              <h4 className="mt-3 text-sm font-semibold text-white">{p.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Interactive explorer */}
      <Reveal className="mt-10">
        <div className="glass rounded-3xl p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Slider + metrics */}
            <div>
              <div className="flex items-center justify-between">
                <span className="eyebrow">Vocabulary explorer</span>
                {isRecommended && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 text-xs font-medium text-accent-cyan">
                    <Check className="h-3 w-3" /> Recommended
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-end gap-3">
                <span className="text-5xl font-extrabold tracking-tight text-white">
                  {metrics.label}
                </span>
                <span className="mb-1.5 font-mono text-sm text-white/50">
                  {metrics.vocab.toLocaleString("en-US")} tokens
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={VOCAB_OPTIONS.length - 1}
                step={1}
                value={idx}
                onChange={(e) => setIdx(Number(e.target.value))}
                className="vocab-slider mt-6 w-full"
                aria-label="Vocabulary size"
              />
              <div className="mt-3 flex justify-between">
                {VOCAB_OPTIONS.map((o, i) => (
                  <button
                    key={o.label}
                    onClick={() => setIdx(i)}
                    className={cx(
                      "font-mono text-xs transition",
                      i === idx ? "font-semibold text-white" : "text-white/40 hover:text-white/70",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Metric
                  icon={Gauge}
                  label="Estimated fertility"
                  value={<AnimatedNumber value={metrics.fertility} decimals={2} />}
                  unit="tok/word"
                />
                <Metric
                  icon={Cpu}
                  label="Embedding matrix"
                  value={<AnimatedNumber value={metrics.embeddingParamsM} decimals={0} suffix="M" />}
                  unit={`params · d=${D_MODEL}`}
                />
                <Metric
                  icon={Zap}
                  label="Training efficiency"
                  value={<AnimatedNumber value={metrics.sequenceEfficiency} decimals={0} suffix="%" />}
                  unit="vs 32K baseline"
                />
                <Metric
                  icon={HardDrive}
                  label="Embedding memory"
                  value={<AnimatedNumber value={metrics.embeddingMemoryGB} decimals={2} suffix=" GB" />}
                  unit="bf16"
                />
                <Metric
                  icon={TerminalSquare}
                  label="Train cost index"
                  value={<AnimatedNumber value={metrics.trainCostIndex} decimals={0} />}
                  unit="lower is better"
                />
                <Metric
                  icon={TerminalSquare}
                  label="Inference cost index"
                  value={<AnimatedNumber value={metrics.inferenceCostIndex} decimals={0} />}
                  unit="lower is better"
                />
              </div>
            </div>

            {/* Chart */}
            <div className="flex flex-col">
              <span className="eyebrow">Fertility vs. effective cost</span>
              <p className="mt-2 text-sm text-slate-400">
                Fertility keeps falling with vocabulary, but effective compute bottoms out near 128K
                and rises again as the embedding/softmax matrix dominates. That inflection is the
                recommendation.
              </p>
              <div className="mt-4 h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                    <defs>
                      <linearGradient id="fertGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#22d3ee" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="label" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 12 }} tickLine={false} />
                    <YAxis yAxisId="left" stroke="rgba(255,255,255,0.4)" tick={{ fontSize: 11 }} tickLine={false} domain={[1, 1.5]} />
                    <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.25)" tick={{ fontSize: 11 }} tickLine={false} domain={[80, 105]} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(5,8,22,0.95)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: "#fff" }}
                    />
                    <ReferenceLine
                      yAxisId="left"
                      x={VOCAB_OPTIONS[idx].label}
                      stroke="rgba(99,102,241,0.5)"
                      strokeDasharray="4 4"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="fertility"
                      name="Fertility"
                      stroke="url(#fertGrad)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#22d3ee" }}
                      activeDot={{ r: 6 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="trainCost"
                      name="Train cost index"
                      stroke="rgba(148,163,184,0.8)"
                      strokeWidth={2}
                      strokeDasharray="5 4"
                      dot={{ r: 3 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Recommendation banner */}
      <Reveal className="mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-accent-indigo/30 bg-gradient-to-br from-accent-indigo/15 via-accent-blue/5 to-accent-cyan/10 p-8">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="eyebrow">Final recommendation</span>
              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-4xl font-extrabold text-white sm:text-5xl">131,072</span>
                <span className="text-lg font-medium text-white/60">tokens · 2¹⁷</span>
              </div>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
                A power-of-two vocabulary that hits the cost inflection point: ~1.14 blended
                fertility, ample headroom for ten Indic scripts plus reserved code/math/agentic
                tokens, and an 805M-parameter embedding that stays a modest slice of a 40B model.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <Highlight value="1.14" label="Blended fertility" />
              <Highlight value="805M" label="Embedding params" />
              <Highlight value="2¹⁷" label="GPU-friendly" />
            </div>
          </div>
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-cyan/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </Reveal>

      {/* Comparison table */}
      <Reveal className="mt-10">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                  <th className="px-5 py-4 font-semibold">Vocab</th>
                  <th className="px-5 py-4 font-semibold">Fertility</th>
                  <th className="px-5 py-4 font-semibold">Embedding params</th>
                  <th className="px-5 py-4 font-semibold">Memory (bf16)</th>
                  <th className="px-5 py-4 font-semibold">Train cost</th>
                  <th className="px-5 py-4 font-semibold">Verdict</th>
                </tr>
              </thead>
              <tbody>
                {VOCAB_METRICS.map((m) => (
                  <tr
                    key={m.label}
                    className={cx(
                      "border-b border-white/5 transition-colors",
                      m.recommended ? "bg-accent-indigo/10" : "hover:bg-white/[0.03]",
                    )}
                  >
                    <td className="px-5 py-4 font-mono font-semibold text-white">
                      {m.label}
                      {m.recommended && (
                        <span className="ml-2 rounded-full bg-accent-cyan/20 px-2 py-0.5 text-[10px] font-medium text-accent-cyan">
                          pick
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-300">{m.fertility.toFixed(2)}</td>
                    <td className="px-5 py-4 text-slate-300">{Math.round(m.embeddingParamsM)}M</td>
                    <td className="px-5 py-4 text-slate-300">{m.embeddingMemoryGB.toFixed(2)} GB</td>
                    <td className="px-5 py-4 text-slate-300">{m.trainCostIndex}</td>
                    <td className="px-5 py-4 text-slate-400">{verdict(m.label)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function verdict(label: string): string {
  switch (label) {
    case "32K":
      return "Too small — Indic scripts fragment badly";
    case "64K":
      return "Cheap, but weak multilingual coverage";
    case "96K":
      return "Solid, slightly under-provisioned for 10 scripts";
    case "128K":
      return "Best balance of fertility, cost & fairness";
    case "160K":
      return "Marginal fertility gain, rising memory";
    case "256K":
      return "Lowest fertility, but wasteful embedding cost";
    default:
      return "";
  }
}

function Metric({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: typeof Gauge;
  label: string;
  value: React.ReactNode;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
      <div className="flex items-center gap-2 text-white/50">
        <Icon className="h-3.5 w-3.5" />
        <span className="text-[11px] uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-2 text-xl font-bold text-white">{value}</div>
      <div className="text-[11px] text-white/35">{unit}</div>
    </div>
  );
}

function Highlight({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-white/50">{label}</div>
    </div>
  );
}
