import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { cx } from "../ui/Card";
import { CLEANING_STAGES } from "../../data/cleaning";

export function DataCleaning() {
  const [open, setOpen] = useState<string | null>("normalize");

  return (
    <Section id="cleaning">
      <SectionHeading
        index="03"
        eyebrow="Data Cleaning Pipeline"
        title="From raw crawl to training corpus"
        description="Eight deterministic, versioned stages transform messy multilingual data into a reproducible corpus. Each stage is a filter with an explicit trade-off — click to expand the reasoning."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        {/* Pipeline rail */}
        <div className="relative">
          <div className="absolute left-[26px] top-3 bottom-3 w-px bg-gradient-to-b from-accent-cyan/50 via-accent-indigo/40 to-transparent" />
          <ul className="space-y-3">
            {CLEANING_STAGES.map((stage, i) => {
              const on = open === stage.id;
              const Icon = stage.icon;
              return (
                <Reveal key={stage.id} delay={i * 0.05}>
                  <li>
                    <button
                      onClick={() => setOpen(on ? null : stage.id)}
                      className={cx(
                        "relative flex w-full items-center gap-4 rounded-xl border px-4 py-3 text-left transition",
                        on
                          ? "border-accent-indigo/40 bg-white/[0.06]"
                          : "border-white/8 bg-white/[0.02] hover:bg-white/[0.04]",
                      )}
                    >
                      <span
                        className={cx(
                          "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition",
                          on
                            ? "border-accent-cyan/50 bg-gradient-to-br from-accent-cyan/30 to-accent-indigo/30 text-white"
                            : "border-white/10 bg-ink text-white/60",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{stage.title}</div>
                        <div className="text-xs text-white/40">{stage.short}</div>
                      </div>
                      <ChevronRight
                        className={cx(
                          "h-4 w-4 text-white/40 transition-transform",
                          on && "rotate-90 text-accent-cyan",
                        )}
                      />
                    </button>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </div>

        {/* Detail */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <AnimatePresence mode="wait">
            {open ? (
              <StageDetail key={open} id={open} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass flex h-64 items-center justify-center rounded-2xl p-8 text-center text-sm text-white/40"
              >
                Select a stage to read why it exists, the methods used, and its trade-off.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}

function StageDetail({ id }: { id: string }) {
  const stage = CLEANING_STAGES.find((s) => s.id === id)!;
  const Icon = stage.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.35 }}
      className="glass rounded-2xl p-7"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent-cyan/30 to-accent-indigo/30 text-white">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-xl font-semibold text-white">{stage.title}</h3>
      </div>

      <div className="mt-6">
        <Label>Why this stage exists</Label>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{stage.why}</p>
      </div>

      <div className="mt-5">
        <Label>Methods</Label>
        <div className="mt-2 flex flex-wrap gap-2">
          {stage.methods.map((m) => (
            <span
              key={m}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] p-4">
        <Label accent="text-amber-300/80">Trade-off</Label>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{stage.tradeoff}</p>
      </div>
    </motion.div>
  );
}

function Label({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <div className={cx("text-[11px] font-semibold uppercase tracking-wider", accent ?? "text-accent-cyan/70")}>
      {children}
    </div>
  );
}
