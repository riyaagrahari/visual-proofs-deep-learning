import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section } from "../layout/Section";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";
import { Card, cx } from "../ui/Card";
import { VISION_PILLARS } from "../../data/vision";

export function Vision() {
  const [openId, setOpenId] = useState<string | null>(VISION_PILLARS[0].id);

  return (
    <Section id="vision">
      <SectionHeading
        index="01"
        eyebrow="Vision & Objectives"
        title="Five capabilities, one worldview"
        description="Every downstream decision — data, cleaning, tokenizer, training and evaluation — is justified by one of these five pillars. Each states why it matters, what data it demands, and how we will measure it."
      />

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {VISION_PILLARS.map((p, i) => {
          const open = openId === p.id;
          const Icon = p.icon;
          return (
            <Reveal
              key={p.id}
              delay={i * 0.06}
              className={cx(open && "md:col-span-2 lg:col-span-3")}
            >
              <Card
                as="button"
                hover={!open}
                onClick={() => setOpenId(open ? null : p.id)}
                className={cx("h-full p-6 transition-colors", open && "border-accent-indigo/40")}
              >
                <div className={cx("flex gap-5", open && "flex-col lg:flex-row lg:items-start")}>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span
                          className={cx(
                            "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-ink",
                            p.accent,
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <h3 className="mt-4 text-lg font-semibold text-white">{p.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{p.tagline}</p>
                      </div>
                      <ChevronDown
                        className={cx(
                          "h-5 w-5 shrink-0 text-white/40 transition-transform duration-300",
                          open && "rotate-180",
                        )}
                      />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden lg:flex-[2]"
                      >
                        <div className="grid gap-4 pt-2 sm:grid-cols-3 lg:pt-0">
                          <Detail label="Why it matters" text={p.why} />
                          <Detail label="Data implications" text={p.data} />
                          <Detail label="Evaluation" text={p.evaluation} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function Detail({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan/70">
        {label}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">{text}</p>
    </div>
  );
}
