// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import OpenAI from 'https://deno.land/x/openai@1.4.2/mod.ts';

// Deno runtime types
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const XAI_API_KEY = Deno.env.get('XAI_API_KEY') ?? '';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') ?? '';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    // Initialize OpenAI
    const openai = new OpenAI(OPENAI_API_KEY);

    // Call OpenAI API
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    // Extract the response
    const responseText = completion.choices[0].message?.content || '';

    // Try to parse as JSON if possible
    try {
      const jsonResponse = JSON.parse(responseText);
      return new Response(JSON.stringify(jsonResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch {
      // If not JSON, return as is
      return new Response(responseText, {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
