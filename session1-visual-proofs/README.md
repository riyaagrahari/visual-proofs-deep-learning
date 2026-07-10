# Visual Proofs of Deep Learning

Four interactive, in-browser experiments that each **prove** a core deep-learning
claim by letting you watch it happen — no hand-waving, no citations. Every model
trains live in your browser with [TensorFlow.js](https://www.tensorflow.org/js);
the visualizations are the argument.

**Live demo:** https://riyaagraharidev.netlify.app/

---

## The four proofs

| # | Route | Claim | The proof you see |
|---|---|---|---|
| 1 | `/relu` | **Activations exist for a reason** | A model with no nonlinearity can only draw a straight boundary, so it can't separate two interleaved rings. Linear + sigmoid gets stuck near **55%**; add a single ReLU hidden layer and the boundary wraps the ring to **~99%** — only the activation changed. |
| 2 | `/depth` | **Depth without nonlinearity is a lie** | Five stacked *linear* layers collapse to a single linear map. A 1-layer and a 5-linear-layer net produce identical accuracy and identical (straight) boundaries. Insert ReLUs and it suddenly solves the ring — and the five weight matrices multiply into exactly one. |
| 3 | `/embeddings` | **Embeddings learn similarity from nothing but next-token** | Trained *only* to predict the next token in a tiny synthetic grammar, the embedding table clusters related tokens. Animals, fruits, and verbs land in their own clusters after a 2D projection — even though similarity was never supplied as a label. |
| 4 | `/generalization` | **Memorization vs. generalization, and data closes the gap** | With 20 / 200 / 2000 training samples, watch the train-vs-test generalization gap shrink as data grows — memorization gives way to generalization. |

---

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **TensorFlow.js** — all models train in-browser, no backend
- **Plotly.js** / **D3** — decision boundaries, embedding scatter plots, loss curves
- **Framer Motion** — transitions
- **Tailwind CSS** — styling
- **React Router** — one page per proof (routes lazy-loaded)

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build      # type-check (tsc -b) + production build to dist/
npm run preview    # serve the production build locally
npm run lint       # eslint
```

## Project structure

```
session1-visual-proofs/
├── src/
│   ├── App.tsx                 # routes: /, /relu, /depth, /embeddings, /generalization
│   ├── pages/                  # one page per proof + Home + NotFound
│   │   ├── ReLUExperiment.tsx
│   │   ├── LinearDepthExperiment.tsx
│   │   ├── EmbeddingExperiment.tsx
│   │   └── GeneralizationExperiment.tsx
│   ├── components/             # Navbar, Hero, ExperimentCard, Footer
│   └── experiments/relu/       # dataset + math/RNG helpers
├── public/
├── netlify.toml                # deploy config
└── vite.config.ts
```

## Deployment

Deployed on Netlify at **https://riyaagraharidev.netlify.app/**. Build settings
(`netlify.toml`): build command `npm run build`, publish directory `dist`, with an
SPA redirect so client-side routes resolve on refresh.
