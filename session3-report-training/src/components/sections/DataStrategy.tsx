import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";
import { DATA_MIX, TRAINING_DATA_PHASES } from "../../data/dataStrategy";

export function DataStrategy() {
  const [activeId, setActiveId] = useState(DATA_MIX[0].id);
  const active = DATA_MIX.find((d) => d.id === activeId)!;

  return (
    <Section id="data">
      <SectionHeading
        index="02"
        eyebrow="Data Strategy"
        title="A deliberate 100% mix"
        description="Token budget is the model's most precious resource. This mix trades raw web volume for a heavier, higher-signal allocation to code, science and Indic content than English-centric models. Click any category to see sources, risks and how it is cleaned."
      />

      {/* Stacked distribution bar */}
      <Reveal className="mt-14">
        <div className="flex h-14 w-full overflow-hidden rounded-2xl border border-white/10">
          {DATA_MIX.map((d) => (
            <motion.button
              key={d.id}
              onClick={() => setActiveId(d.id)}
              initial={{ width: 0 }}
              whileInView={{ width: `${d.share}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={cx(
                "group relative h-full transition-opacity",
                activeId === d.id ? "opacity-100" : "opacity-45 hover:opacity-80",
              )}
              style={{ backgroundColor: d.color }}
              aria-label={`${d.name} ${d.share}%`}
            >
              {d.share >= 10 && (
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-ink/90">
                  {d.share}%
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Category list */}
        <Reveal>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {DATA_MIX.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveId(d.id)}
                className={cx(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition",
                  activeId === d.id
                    ? "border-white/20 bg-white/[0.06]"
                    : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]",
                )}
              >
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="flex-1 text-sm font-medium text-white">{d.name}</span>
                <span className="font-mono text-sm text-white/50">{d.share}%</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Detail panel */}
        <Reveal delay={0.1}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="glass h-full rounded-2xl p-7"
            >
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded-md" style={{ backgroundColor: active.color }} />
                <h3 className="text-xl font-semibold text-white">{active.name}</h3>
                <span className="ml-auto rounded-full border border-white/10 px-3 py-1 font-mono text-sm text-white/70">
                  {active.share}%
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <Field label="Sources" text={active.sources} />
                <Field label="Why included" text={active.why} />
                <Field label="Risks" text={active.risks} accent="text-amber-300/80" />
                <Field label="Cleaning strategy" text={active.cleaning} />
                <Field label="Capability contribution" text={active.capability} accent="text-accent-cyan/80" />
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>
      </div>

      {/* Post-training phases */}
      <Reveal className="mt-20">
        <h3 className="text-center text-sm font-semibold uppercase tracking-[0.28em] text-white/50">
          Data across the training lifecycle
        </h3>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {TRAINING_DATA_PHASES.map((phase, i) => (
          <Reveal key={phase.id} delay={i * 0.08}>
            <div className="glass glass-hover h-full rounded-2xl p-6">
              <div className="flex items-baseline justify-between">
                <h4 className="text-lg font-semibold text-white">{phase.title}</h4>
                <span className="font-mono text-[10px] text-accent-cyan/70">0{i + 1}</span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{phase.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{phase.purpose}</p>
              <ul className="mt-4 space-y-2">
                {phase.examples.map((ex) => (
                  <li key={ex} className="flex items-start gap-2 text-sm text-slate-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-indigo" />
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function Field({ label, text, accent }: { label: string; text: string; accent?: string }) {
  return (
    <div>
      <div className={cx("text-[11px] font-semibold uppercase tracking-wider", accent ?? "text-white/50")}>
        {label}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}
