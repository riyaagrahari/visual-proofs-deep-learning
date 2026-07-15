import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";
import { TRAINING_STAGES } from "../../data/training";

export function TrainingPipeline() {
  const [active, setActive] = useState(0);
  const stage = TRAINING_STAGES[active];

  return (
    <Section id="training">
      <SectionHeading
        index="04"
        eyebrow="Training Pipeline"
        title="Six stages, one capability ladder"
        description="Each stage consumes the previous stage's output and adds a distinct capability — from raw next-token prediction to verifiable agentic skill and safety. Select a stage to inspect its contract."
      />

      {/* Horizontal flow */}
      <Reveal className="mt-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
          {TRAINING_STAGES.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-3 md:flex-col">
              <button
                onClick={() => setActive(i)}
                className={cx(
                  "group relative w-full rounded-xl border px-4 py-4 text-left transition md:text-center",
                  active === i
                    ? "border-accent-indigo/50 bg-white/[0.07] shadow-glow"
                    : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]",
                )}
              >
                <div
                  className={cx(
                    "font-mono text-[10px]",
                    active === i ? "text-accent-cyan" : "text-white/40",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-1 text-sm font-semibold leading-tight text-white">{s.title}</div>
                <div className="mt-1 hidden text-[10px] text-white/40 md:block">{s.tag}</div>
                {active === i && (
                  <motion.div
                    layoutId="training-underline"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo"
                  />
                )}
              </button>
              {i < TRAINING_STAGES.length - 1 && (
                <span className="text-white/25 md:rotate-90">→</span>
              )}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Detail */}
      <Reveal className="mt-10" delay={0.05}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-2xl p-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-2xl font-bold text-white">{stage.title}</h3>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-accent-cyan/80">
                {stage.tag}
              </span>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <Block label="Input" text={stage.input} />
              <Block label="Output" text={stage.output} />
              <Block label="Objective" text={stage.objective} />
              <Block label="Why it's necessary" text={stage.necessity} highlight />
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </Section>
  );
}

function Block({ label, text, highlight }: { label: string; text: string; highlight?: boolean }) {
  return (
    <div
      className={cx(
        "rounded-xl border p-5",
        highlight
          ? "border-accent-indigo/25 bg-accent-indigo/[0.06]"
          : "border-white/8 bg-white/[0.02]",
      )}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan/70">
        {label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}
