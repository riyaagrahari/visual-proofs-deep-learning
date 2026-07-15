import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";
import { FERTILITY_TARGETS, FERTILITY_NARRATIVE, type FertilityTarget } from "../../data/fertility";

const CATEGORY_STYLE: Record<FertilityTarget["category"], { label: string; color: string }> = {
  language: { label: "Language", color: "#22d3ee" },
  code: { label: "Code", color: "#6366f1" },
  science: { label: "Science", color: "#818cf8" },
  math: { label: "Math", color: "#3b82f6" },
  agentic: { label: "Agentic", color: "#a78bfa" },
};

const MIN = 1.0;
const MAX = 1.3;

export function FertilityTargets() {
  const sorted = [...FERTILITY_TARGETS].sort((a, b) => a.target - b.target);

  return (
    <Section id="fertility">
      <SectionHeading
        index="06"
        eyebrow="Fertility Targets"
        title="Per-domain compression goals"
        description={FERTILITY_NARRATIVE}
      />

      <Reveal className="mt-14">
        <div className="glass overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
                  <th className="px-5 py-4 font-semibold">Domain</th>
                  <th className="px-5 py-4 font-semibold">Type</th>
                  <th className="px-5 py-4 font-semibold">Target</th>
                  <th className="px-5 py-4 font-semibold">Relative compression</th>
                  <th className="hidden px-5 py-4 font-semibold lg:table-cell">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((t) => {
                  const style = CATEGORY_STYLE[t.category];
                  const pct = ((t.target - MIN) / (MAX - MIN)) * 100;
                  return (
                    <tr key={t.domain} className="border-b border-white/5 transition-colors hover:bg-white/[0.03]">
                      <td className="px-5 py-4 font-semibold text-white">{t.domain}</td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs"
                          style={{ borderColor: `${style.color}55`, color: style.color }}
                        >
                          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: style.color }} />
                          {style.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-200">{t.target.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${100 - pct}%`,
                                background: `linear-gradient(90deg, ${style.color}, #6366f1)`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-white/40">
                            {t.target <= 1.1 ? "tight" : t.target <= 1.18 ? "strong" : "balanced"}
                          </span>
                        </div>
                      </td>
                      <td className="hidden max-w-md px-5 py-4 text-slate-400 lg:table-cell">{t.rationale}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      <Reveal className="mt-6" delay={0.1}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Callout title="Symbolic domains anchor the floor" body="Code and mathematics reuse a tiny token alphabet, so reserved keyword/operator tokens push fertility to ~1.05 — the cheapest content in the corpus." />
          <Callout title="Dravidian languages set the ceiling" body="Agglutinative Telugu, Tamil, Kannada and Malayalam generate many surface forms per root, so 1.20–1.23 is honest, not a failure." />
          <Callout title="Balance beats a single hero number" body="A tight 1.05–1.23 spread means no script is starved to make English look good — the model feels equally fluent everywhere." />
        </div>
      </Reveal>
    </Section>
  );
}

function Callout({ title, body }: { title: string; body: string }) {
  return (
    <div className={cx("glass glass-hover rounded-2xl p-5")}>
      <h4 className="text-sm font-semibold text-white">{title}</h4>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
    </div>
  );
}
