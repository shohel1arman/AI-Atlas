# Auth & Progress Tracking (Supabase)

AI Atlas supports optional **email/password accounts** and **per-lesson progress tracking**.
Anonymous visitors can use the entire application; their completion is stored locally. Signed-in progress is synced to Supabase and shown on the Astro dashboard at `/atlas/`.

## What you need to do (3 steps)

### 1. Run the database schema
In your Supabase project → **SQL Editor** → **New query** → paste the contents of
[`supabase/schema.sql`](supabase/schema.sql) → **Run**.

This creates two tables with Row-Level Security so each user can only read/write their own data:
- `profiles` — one row per user (auto-created on signup via a trigger)
- `progress` — one row per completed lesson `(user_id, module, lesson)`

### 2. Add your project keys
Copy `.env.example` to `.env` and add the public values from **Project Settings → API**:

```bash
PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 3. (Optional) turn off email confirmation for quick testing
By default Supabase emails a confirmation link on signup. To let accounts sign in immediately:
**Authentication → Providers → Email → disable "Confirm email"**. Leave it on for production.

### 4. Allow the site URLs
**Authentication → URL Configuration:**

- **Site URL:** `https://aiat1as.netlify.app`
- **Redirect URLs** (add each): `https://aiat1as.netlify.app/**` and `http://localhost:4321/**`

The `/**` wildcards let auth redirect back to any page.

## How it works

| Piece | File |
|---|---|
| Generated browser config | `src/pages/js/supabase-config.js.ts` |
| Login / signup page | `src/pages/auth.astro` |
| Optional auth and progress API | `public/js/atlas-app.js` |
| Module → lesson map | `public/js/modules-manifest.js` |
| Dashboard rendering | `src/pages/atlas.astro` |
| Database + RLS | `supabase/schema.sql` |

- **Authentication is optional:** signed-out visitors remain in the learning experience and use local progress. Signing in adds cross-device Supabase sync.
- **Progress is recorded two ways** (you chose both):
  - **Auto** — clicking any control inside a lesson's playground marks that lesson complete.
  - **Manual** — a "Mark this lesson complete" toggle is injected at the top of each lesson;
    click it to set or unset completion.
- **Dashboard:** each module card and the "Pick up where you left off" hero read live progress;
  module % = completed lessons ÷ total lessons for that module.

## Test locally

```bash
npm run dev
# open http://localhost:4321/auth/
```
