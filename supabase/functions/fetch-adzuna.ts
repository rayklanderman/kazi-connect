// Supabase Edge Function: fetch-adzuna
// Proxies job search requests from the frontend to the Adzuna API, solving CORS and hiding credentials.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Read Adzuna credentials from environment variables set in Supabase
const ADZUNA_APP_ID = Deno.env.get('ADZUNA_APP_ID');
const ADZUNA_APP_KEY = Deno.env.get('ADZUNA_APP_KEY');

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { country = 'ke', params = {} } = await req.json();
    // Build Adzuna API URL
    const searchParams = new URLSearchParams({
      app_id: ADZUNA_APP_ID ?? '',
      app_key: ADZUNA_APP_KEY ?? '',
      results_per_page: params.results_per_page?.toString() || '20',
      'content-type': 'application/json',
      ...params // allow extra Adzuna params (e.g., what, where)
    });
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${searchParams.toString()}`;
    const adzunaRes = await fetch(url, { method: 'GET' });
    const data = await adzunaRes.json();
    return new Response(JSON.stringify(data), {
      status: adzunaRes.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch Adzuna jobs', details: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
