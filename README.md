# AI Atlas

An Astro-based interactive learning platform for AI, machine learning, mathematics, and data engineering. Every user-facing route is now a native Astro page while preserving the established interface, animations, and playground behavior.

## Current architecture

- Native Astro routes for the landing page, learning dashboard, authentication, and all 14 modules
- Shared module and lesson registry in `src/data/modules.ts`
- Direct static assets under `public/styles`, `public/js`, and `public/assets`
- Anonymous progress stored locally in the browser
- Optional Supabase authentication and cross-device progress sync
- Clean routes such as `/atlas/` and `/modules/machine-learning/`

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

The production build is written to `dist/`. Netlify is configured to run `npm run build` and publish that directory.

## Optional authentication

Copy `.env.example` to `.env` and provide the public Supabase project values:

```bash
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Without these values, the whole learning experience still works and progress stays in `localStorage`. When a visitor signs in, local completed lessons are merged with their Supabase `progress` rows. The existing schema is documented in `SUPABASE.md` and defined in `supabase/schema.sql`.

## Architecture

```text
src/
├── data/modules.ts      # Module and lesson registry
├── lib/                 # Progress and optional Supabase clients
├── pages/               # Native Astro pages and module routes
└── styles/              # Single Astro-managed visual system

public/
├── assets/              # Images and visual assets
└── js/                  # Shared shell, progress, and playground behavior
```
