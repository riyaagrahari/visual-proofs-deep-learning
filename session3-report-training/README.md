# Designing an India-First 40B Foundation Model

An interactive, single-page **research report** proposing the systems design for a
**40B-parameter foundation model** — comparable to Gemma-class models — optimized for
**coding, agentic reasoning, science, mathematics, and Indic languages**, with an
India-first worldview.

This is an academic systems-design deliverable: **no model is trained**. The site
communicates the *reasoning and trade-offs* behind data, cleaning, training, tokenizer
and evaluation decisions, presented as a polished, interactive research paper.

## What it covers

| # | Section | Highlights |
|---|---|---|
| 01 | **Vision & Objectives** | Five expandable capability pillars, each with why-it-matters, data implications and evaluation strategy |
| 02 | **Data Strategy** | Interactive 100% data-mix bar; click any category for sources, risks, cleaning and capability contribution; pre-training / SFT / preference phases |
| 03 | **Data Cleaning** | Eight-stage animated pipeline (lang ID → normalization → dedup → quality → safety → code gates → corpus), each with methods and trade-offs |
| 04 | **Training Pipeline** | Six-stage capability ladder (pre-train → SFT → DPO → agentic RLVR → safety → eval) with inputs/outputs/objectives |
| 05 | **Tokenizer Design** | Interactive vocabulary slider (32K–256K) that live-updates fertility, embedding size, memory and cost; fertility-vs-cost chart; recommendation of **131,072** tokens |
| 06 | **Fertility Targets** | Responsive per-domain target table (English 1.10 … Malayalam 1.23, code/math 1.05) with rationale |
| 07 | **Evaluation** | Benchmark cards across Coding, Math, Science, General, Agentic and Indic; click to expand what/why/success |
| 08 | **Final Architecture** | End-to-end infographic + committed decisions (40B, 131K vocab, primary/secondary priorities) |
| 09 | **References** | Concise, well-known sources (Chinchilla, Llama, Gemma, DeepSeek, Qwen, FLORES, HumanEval, SWE-bench, …) |

## Tech stack

- **React 19** + **TypeScript** (strict) + **Vite 6**
- **Tailwind CSS** for the design system (glassmorphism, gradient mesh, dark theme)
- **Framer Motion** for scroll reveals, animated pipelines and transitions
- **Recharts** for the tokenizer trade-off chart
- **Lucide** icons
- Fully static — **no backend** — and Netlify-ready

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # tsc (type-check) + vite production build → dist/
npm run preview    # serve the production build locally
npm run lint       # eslint (if configured)
```

> Note: on networks behind a TLS-intercepting corporate proxy, `npm install` may need
> `NODE_TLS_REJECT_UNAUTHORIZED=0 npm install --strict-ssl=false`.

## Project structure

```
session3-report-training/
├── index.html
├── netlify.toml                 # SPA build + redirect config
├── tailwind.config.js
├── vite.config.ts               # vendor chunk splitting (charts / motion)
└── src/
    ├── App.tsx                  # composes all sections + background + nav
    ├── index.css                # theme tokens, glass utilities, slider, scrollbar
    ├── components/
    │   ├── background/          # NeuralBackground (canvas neural net + gradient mesh)
    │   ├── layout/              # Section, SectionNav (scroll-spy rail + top bar)
    │   ├── ui/                  # Reveal, Card, SectionHeading, AnimatedNumber
    │   └── sections/            # Hero, Vision, DataStrategy, DataCleaning,
    │       │                    #   TrainingPipeline, TokenizerDesign,
    │       └── …                #   FertilityTargets, Evaluation, FinalDesign, References
    ├── data/                    # All report content (typed, single source of truth)
    ├── hooks/                   # useScrollSpy
    └── lib/                     # tokenizerMath (vocab → fertility/memory/cost model)
```

Content lives in `src/data/*` as typed modules, cleanly separated from presentation —
edit the numbers/prose there without touching components.

## Design decisions worth noting

- **Vocabulary = 131,072 (2¹⁷).** The interactive chart shows fertility falling with
  vocab while *effective* compute bottoms out near 128K and rises again as the
  embedding/softmax matrix dominates — that inflection is the recommendation.
- **Tokenizer math is deterministic** (`src/lib/tokenizerMath.ts`): embedding params =
  `vocab × d_model` (tied, d_model = 6144), memory in bf16, and a curated fertility/cost
  curve. Numbers are clearly labelled engineering estimates.
- **Accessibility & performance:** semantic sections, keyboard-focusable interactive
  cards, `prefers-reduced-motion` support (background + reveals), canvas animation pauses
  when the tab is hidden, and vendor code-splitting for faster first paint.

## Deployment (Netlify)

`netlify.toml` is preconfigured:

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect so the single page resolves on any path

Deploy by connecting the repo in Netlify (or `netlify deploy --prod --dir=dist`).
