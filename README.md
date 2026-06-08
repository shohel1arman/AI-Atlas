# AI Atlas

An interactive, animated platform for learning AI, ML, mathematics, and data engineering —
built so every concept is something you can **touch, tune, and watch move**.

This repository is a **working foundation**, not a finished product. It ships with:

- A production-grade Vite + React + TypeScript setup
- A clean, scalable architecture where each learning module plugs in via a registry
- One **fully live, interactive** module (Gradient Descent) as proof the architecture holds
- Nine scaffolded module slots ready to be built out one at a time

> Honest status: the 10-module, RAG-chatbot, WebGL-everything vision in the original brief is a
> multi-month build. This repo gets you **live and extensible today**, then you grow it module by
> module. See "Roadmap" below.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into /dist
npm run preview    # serve the production build locally
```

Requires Node 18+.

---

## Architecture

```
src/
├─ main.tsx                 # React entry + router
├─ App.tsx                  # Routes; resolves a slug -> lazy playground or stub
├─ index.css                # Design tokens + global styles (one place for theming)
├─ modules/
│  ├─ types.ts              # ModuleDef contract
│  └─ registry.ts           # ★ SINGLE SOURCE OF TRUTH for every module
├─ components/              # Sidebar, TopBar, ComingSoon (all driven by the registry)
├─ hooks/
│  └─ useAnimationFrame.ts  # shared rAF loop primitive
└─ playgrounds/
   └─ GradientDescent/
      ├─ engine.ts          # pure math (no React, unit-testable)
      └─ GradientDescentPlayground.tsx  # Canvas UI
```

**The key idea:** the sidebar, the home grid, and the router are all generated from
`src/modules/registry.ts`. Nothing is hard-coded in three places.

### Adding a new live module

1. Create `src/playgrounds/MyThing/MyThingPlayground.tsx` with a `default` export.
2. In `registry.ts`, find the matching entry, set `status: "live"`, and add:
   ```ts
   load: () => import("@/playgrounds/MyThing/MyThingPlayground"),
   ```
3. Done. It's automatically code-split, lazy-loaded, routed, and listed.

Keep the *math* in a separate `engine.ts` (pure functions) and the *rendering* in the component.
The Gradient Descent module is the reference pattern — copy its shape.

---

## Deploy to Netlify

`netlify.toml` is already configured (build → `dist`, SPA redirect for client routing).

**Option A — connect GitHub (recommended, auto-deploys on push):**

1. Push this repo to GitHub (see below).
2. Go to <https://app.netlify.com> → **Add new site → Import an existing project**.
3. Pick your GitHub repo. Netlify reads `netlify.toml` automatically:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click **Deploy**. Every `git push` now redeploys.

**Option B — drag & drop (no GitHub):**

```bash
npm run build
# then drag the /dist folder onto https://app.netlify.com/drop
```

---

## Push to GitHub

```bash
cd ai-atlas
git init
git add .
git commit -m "AI Atlas: foundation + live gradient descent module"
git branch -M main
# create an empty repo at github.com/new (no README/license), then:
git remote add origin https://github.com/<you>/ai-atlas.git
git push -u origin main
```

---

## Roadmap (build order)

The registry (`src/modules/registry.ts`) now mirrors the master-spec lab structure
(Math Lab → Data Analysis → Machine Learning → Deep Learning → Transformers → Agents →
Generative AI → XAI & MLOps → Research).

Live so far (7):

1. ✅ Vectors & Dot Product (Math Lab)
2. ✅ Linear Algebra — 2×2 transforms (Math Lab)
3. ✅ Gaussian Distribution — live sampling (Math Lab)
4. ✅ Optimization Landscape — contours + GD (Math Lab)
5. ✅ Gradient Descent — 1-D line fit (Math Lab)
6. ✅ K-Means Clustering (Machine Learning)
7. ✅ Neural Net Trainer — real backprop (Deep Learning)

Next: finish Math Lab (eigenvectors), then deepen Machine Learning (logistic regression,
decision trees, KNN), then CNN/convolution, then self-attention. Each "live" module is
~120–250 lines split into a pure `engine.ts` + a Canvas component — that's the unit of work.
Expect a few solid modules per focused session, building toward the full spec.

When auth + the chatbot are needed: migrate to Next.js + Supabase (the only pieces that
require a backend), wire one auth provider, then build the assistant as semantic search +
retrieval over the module content that exists by then.

### "Create their credential" (user accounts)

Real auth needs a backend or auth service — don't half-build it. Standard options:

- **Netlify Identity** — simplest if you're already on Netlify.
- **Supabase Auth** — email/OAuth + a Postgres DB to store progress; generous free tier.
- **Clerk** — drop-in React components, fastest to wire up.

Pick one and it becomes the next milestone — happy to wire it in.

---

## Tech

React 18 · TypeScript (strict) · Vite 5 · React Router 6 · HTML5 Canvas · SVG.
Heavier visualization libs (D3, Three.js) are intentionally **not** added yet — pull them in per
module only when that module needs them, so the base bundle stays small.
