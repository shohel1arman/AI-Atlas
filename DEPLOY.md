# AI Atlas — your design, deploy-ready

This is your exact AI Atlas design (from Claude Design), verified and packaged for hosting.
It's a static site — plain HTML/CSS/JS, no build step.

## What's here
- `index.html` — landing page
- `app.html` — the module hub (sidebar + all-modules grid)
- `modules/` — all 12 module pages
- `styles/`, `js/`, `assets/` — styles, playground scripts, logo

## Working interactive playgrounds (6)
Mathematics, Machine Learning, Deep Learning, Data Analysis (SQL),
Transformers, and Programming (real Python via Pyodide).

The other 6 pages (ETL, Generative, LLM-Agents, MLOps, Research, XAI) are
content/preview pages — exactly as designed. Making them interactive is the
module-by-module build.

## Deploy (fastest — drag & drop)
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.
3. Live in seconds.

## Deploy via GitHub (so pushes auto-update)
Put these files in a repo and connect it on Netlify. `netlify.toml` is already set
for static hosting (publish = ".", no build command).
