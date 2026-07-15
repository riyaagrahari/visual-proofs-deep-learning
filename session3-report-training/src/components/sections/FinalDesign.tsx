import { motion } from "framer-motion";
import { Database, Filter, Binary, Layers, MessagesSquare, ShieldCheck, Cpu } from "lucide-react";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";

const FLOW = [
  { label: "Data", icon: Database },
  { label: "Data Cleaning", icon: Filter },
  { label: "Tokenizer", icon: Binary },
  { label: "Pre-training", icon: Layers },
  { label: "Post-training", icon: MessagesSquare },
  { label: "Alignment", icon: ShieldCheck },
];

const PRIMARY = ["Coding", "Agentic Reasoning", "Indic Languages", "Science", "Mathematics"];
const SECONDARY = ["Long Context", "Multilingual Reasoning", "Tool Use", "Factuality"];

export function FinalDesign() {
  return (
    <Section id="architecture">
      <SectionHeading
        index="08"
        eyebrow="Final Architecture Decisions"
        title="The system, end to end"
        description="Every prior section collapses into a single pipeline and a small set of committed decisions. This is the proposal in one view."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
        {/* Infographic flow */}
        <Reveal>
          <div className="glass rounded-3xl p-8">
            <div className="flex flex-col items-center">
              {FLOW.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="flex w-full flex-col items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="flex w-full max-w-sm items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/25 to-accent-indigo/25 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-semibold text-white">{step.label}</span>
                      <span className="ml-auto font-mono text-[10px] text-white/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </motion.div>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.15, duration: 0.3 }}
                      className="h-6 w-px origin-top bg-gradient-to-b from-accent-indigo/60 to-accent-cyan/30"
                    />
                  </div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-accent-indigo/40 bg-gradient-to-br from-accent-indigo/20 to-accent-cyan/15 px-5 py-5 text-center"
              >
                <Cpu className="mx-auto h-6 w-6 text-accent-cyan" />
                <div className="mt-2 text-base font-bold text-white">
                  40B India-First Foundation Model
                </div>
                <div className="mt-1 text-xs text-white/60">Multilingual · Agentic · Code-native</div>
              </motion.div>
            </div>
          </div>
        </Reveal>

        {/* Decisions */}
        <div className="space-y-4">
          <Reveal>
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Model size" value="40B" note="Dense, decoder-only" />
              <StatCard label="Vocabulary" value="131,072" note="2¹⁷ tokens" />
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="glass rounded-2xl p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-cyan/80">
                Primary priorities
              </h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {PRIMARY.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-accent-indigo/30 bg-accent-indigo/10 px-3.5 py-1.5 text-sm font-medium text-white"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="glass rounded-2xl p-6">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                Secondary priorities
              </h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {SECONDARY.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className={cx("glass rounded-2xl p-6 text-sm leading-relaxed text-slate-400")}>
              <span className="font-semibold text-white">Design thesis.</span> A 40B dense model is
              large enough for frontier reasoning yet small enough to serve affordably across India.
              Paired with a 131K multilingual-first tokenizer and a code/Indic-heavy data mix, it is
              engineered to punch above its size on the capabilities that matter here — not to chase
              a single leaderboard.
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function StatCard({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="glass glass-hover rounded-2xl p-6">
      <div className="text-xs uppercase tracking-wider text-white/50">{label}</div>
      <div className="mt-2 text-3xl font-extrabold text-white">{value}</div>
      <div className="mt-1 text-xs text-white/40">{note}</div>
    </div>
  );
}
