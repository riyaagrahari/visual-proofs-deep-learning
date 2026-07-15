import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";
import { BENCHMARK_GROUPS } from "../../data/evaluation";

export function Evaluation() {
  const [open, setOpen] = useState<string | null>("SWE-bench Verified");

  return (
    <Section id="evaluation">
      <SectionHeading
        index="07"
        eyebrow="Evaluation Strategy"
        title="Measured against the objectives"
        description="Every objective maps to concrete, contamination-aware benchmarks — plus native human evaluation where automatic metrics fall short. Click any benchmark to see what it measures, why it matters, and the success bar."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {BENCHMARK_GROUPS.map((group, gi) => {
          const Icon = group.icon;
          return (
            <Reveal key={group.id} delay={gi * 0.06}>
              <div className="glass h-full rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <span className={cx("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-ink", group.accent)}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                </div>

                <div className="mt-5 space-y-2">
                  {group.benchmarks.map((b) => {
                    const on = open === b.name;
                    return (
                      <div key={b.name}>
                        <button
                          onClick={() => setOpen(on ? null : b.name)}
                          className={cx(
                            "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition",
                            on
                              ? "border-accent-indigo/40 bg-white/[0.06] text-white"
                              : "border-white/8 bg-white/[0.02] text-slate-300 hover:bg-white/[0.04]",
                          )}
                        >
                          <span className="font-medium">{b.name}</span>
                          <span className={cx("text-lg leading-none text-white/40 transition-transform", on && "rotate-45")}>
                            +
                          </span>
                        </button>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-3 rounded-lg border border-white/8 bg-white/[0.02] p-3 pt-3 mt-2">
                                <Row label="Measures" text={b.measures} />
                                <Row label="Why it matters" text={b.matters} />
                                <Row label="Success criteria" text={b.success} accent />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-8">
        <div className="glass rounded-2xl p-6 text-sm leading-relaxed text-slate-400">
          <span className="font-semibold text-white">Contamination discipline.</span> All
          quantitative benchmarks are run on post-cutoff or held-out splits with n-gram overlap
          checks against the training corpus. Reported numbers are decontaminated; Indic capability
          is never judged by translation metrics alone — native speakers score fluency and cultural
          correctness directly.
        </div>
      </Reveal>
    </Section>
  );
}

function Row({ label, text, accent }: { label: string; text: string; accent?: boolean }) {
  return (
    <div>
      <div className={cx("text-[10px] font-semibold uppercase tracking-wider", accent ? "text-accent-cyan/80" : "text-white/45")}>
        {label}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}
