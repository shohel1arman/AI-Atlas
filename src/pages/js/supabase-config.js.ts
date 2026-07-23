import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = () => {
  const config = {
    url: import.meta.env.PUBLIC_SUPABASE_URL || '',
    anonKey: import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '',
  };

  return new Response(`window.ATLAS_SUPABASE = ${JSON.stringify(config)};\n`, {
    headers: { 'Content-Type': 'application/javascript; charset=utf-8' },
  });
};
