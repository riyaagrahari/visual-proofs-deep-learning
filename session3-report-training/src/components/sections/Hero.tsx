import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

const STATS = [
  { value: "40B", label: "Parameters" },
  { value: "131,072", label: "Vocabulary" },
  { value: "10", label: "Indic languages" },
  { value: "~9T", label: "Pre-train tokens" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Hero() {
  const go = () => document.getElementById("vision")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center px-6 pt-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-4xl text-center"
      >
        <motion.div variants={item} className="mb-8 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
            Systems Design Proposal · Foundation Model Architecture
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          Designing an{" "}
          <span className="text-gradient">India-First</span>{" "}
          40B Foundation Model
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg"
        >
          A systems-level proposal for building a multilingual foundation model optimized for
          coding, agentic reasoning, science, mathematics, and Indic languages.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            onClick={go}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-cyan to-accent-indigo px-7 py-3 text-sm font-semibold text-ink shadow-glow transition hover:shadow-[0_0_50px_-8px_rgba(99,102,241,0.8)]"
          >
            Explore the Design
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
          <a
            href="#tokenizer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-7 py-3 text-sm font-medium text-white/80 transition hover:border-white/25 hover:text-white"
          >
            See tokenizer design
          </a>
        </motion.div>

        <motion.div
          variants={item}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-ink/40 px-4 py-5">
              <div className="text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/40">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-8 w-px bg-gradient-to-b from-accent-cyan to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
