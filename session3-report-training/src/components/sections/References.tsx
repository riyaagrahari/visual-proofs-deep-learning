import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { REFERENCES } from "../../data/references";

export function References() {
  return (
    <Section id="references" className="pb-32">
      <SectionHeading
        index="09"
        eyebrow="References"
        title="Standing on prior work"
        description="This proposal synthesizes established results in scaling, data curation, tokenization, alignment and multilingual evaluation."
      />

      <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {REFERENCES.map((r, i) => (
          <Reveal key={r.label} delay={i * 0.03}>
            <div className="glass glass-hover flex items-start gap-3 rounded-xl p-4">
              <span className="font-mono text-xs text-accent-cyan/60">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <div className="text-sm font-semibold text-white">{r.label}</div>
                <div className="mt-0.5 text-xs leading-relaxed text-slate-400">{r.note}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-white/40">
            An academic systems-design proposal — no model was trained. Built with React, TypeScript,
            Tailwind, Framer Motion & Recharts.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
