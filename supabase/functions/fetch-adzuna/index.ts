// Supabase Edge Function: fetch-adzuna
// Proxies job search requests from the frontend to the Adzuna API, solving CORS and hiding credentials.
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ADZUNA_APP_ID = Deno.env.get('ADZUNA_APP_ID');
const ADZUNA_APP_KEY = Deno.env.get('ADZUNA_APP_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

serve(async (req: Request) => {
  console.log('--- fetch-adzuna invocation ---');
  console.log('Request method:', req.method);
  try {
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);
    let body;
    try {
      body = JSON.parse(rawBody);
    } catch (parseErr) {
      console.log('Failed to parse JSON body:', parseErr);
      body = {};
    }
    const { country = 'ke', params = {} } = body;
    console.log('Parsed country:', country);
    console.log('Parsed params:', params);
    console.log('Environment variables:');
    for (const [key, value] of Object.entries(Deno.env.toObject())) {
      if (key.startsWith('ADZUNA')) {
        console.log(`${key}: ${key === 'ADZUNA_APP_KEY' ? '***' : value}`);
      }
    }
    const searchParams = new URLSearchParams({
      app_id: ADZUNA_APP_ID ?? '',
      app_key: ADZUNA_APP_KEY ?? '',
      results_per_page: params.results_per_page?.toString() || '20',
      ...params
    });
    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?${searchParams.toString()}`;
    console.log('Adzuna URL:', url);
    if (req.method === 'OPTIONS') {
      // Handle CORS preflight
      return new Response('ok', { headers: corsHeaders });
    }

    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    }

    const adzunaRes = await fetch(url, { method: 'GET' });
    const data = await adzunaRes.json();
    // Debug: Log Adzuna API response status
    console.log('Adzuna API status:', adzunaRes.status);
    if (adzunaRes.status !== 200) {
      console.log('Adzuna API error:', data);
    }
    return new Response(JSON.stringify(data), {
      status: adzunaRes.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.log('Edge Function Error:', e);
    return new Response(JSON.stringify({ error: 'Failed to fetch Adzuna jobs', details: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
