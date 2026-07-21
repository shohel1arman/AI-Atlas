# Auth & Progress Tracking (Supabase)

AI Atlas now has **email/password accounts** and **per-lesson progress tracking**.
Every signed-in student's completion is saved to Supabase and shown on the hub dashboard
(`app.html`). One role: **student** (a `role` column is reserved on `profiles` if you ever
want to add supervisors later).

## What you need to do (3 steps)

### 1. Run the database schema
In your Supabase project → **SQL Editor** → **New query** → paste the contents of
[`supabase/schema.sql`](supabase/schema.sql) → **Run**.

This creates two tables with Row-Level Security so each user can only read/write their own data:
- `profiles` — one row per user (auto-created on signup via a trigger)
- `progress` — one row per completed lesson `(user_id, module, lesson)`

### 2. Add your project keys
Edit [`js/supabase-config.js`](js/supabase-config.js) and paste your values from
**Project Settings → API**:

```js
window.ATLAS_SUPABASE = {
  url:     'https://xxxxxxxx.supabase.co',   // Project URL
  anonKey: 'eyJ...',                          // anon / public key (safe to commit — RLS protects data)
};
```

### 3. (Optional) turn off email confirmation for quick testing
By default Supabase emails a confirmation link on signup. To let accounts sign in immediately:
**Authentication → Providers → Email → disable "Confirm email"**. Leave it on for production.

Also make sure your site URL is allowed: **Authentication → URL Configuration → Site URL**
(e.g. your Netlify URL, and `http://localhost:8000` for local testing).

## How it works

| Piece | File |
|---|---|
| Config (your keys) | `js/supabase-config.js` |
| Login / signup page | `auth.html` |
| Client, auth guard, progress API, tracking | `js/atlas-app.js` |
| Module → lesson map (drives % complete) | `js/modules-manifest.js` |
| Dashboard rendering | `app.html` (inline script) |
| Database + RLS | `supabase/schema.sql` |

- **Auth guard:** `app.html` and every `modules/*.html` require a session; signed-out visitors
  are redirected to `auth.html`. The landing page (`index.html`) stays public.
- **Progress is recorded two ways** (you chose both):
  - **Auto** — clicking any control inside a lesson's playground marks that lesson complete.
  - **Manual** — a "Mark this lesson complete" toggle is injected at the top of each lesson;
    click it to set or unset completion.
- **Dashboard:** each module card and the "Pick up where you left off" hero read live progress;
  module % = completed lessons ÷ total lessons for that module.

## Test locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html → Sign in → create an account
```
