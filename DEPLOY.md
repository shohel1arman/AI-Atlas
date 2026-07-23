# Deploying AI Atlas

AI Atlas is a statically generated Astro application. Netlify builds the 17 native Astro routes and publishes `dist/`.

## Netlify

1. Connect the repository to Netlify.
2. Keep the build command as `npm run build` and the publish directory as `dist`.
3. Optionally add `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` for accounts and cloud progress.
4. Deploy.

The required build settings are already defined in `netlify.toml`. Without Supabase environment variables, every module and playground remains available and progress stays in the visitor's browser.

## Local production check

```bash
npm install
npm run build
npm run preview
```
