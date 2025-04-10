import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { CreateCompletionRequest } from 'https://esm.sh/openai@3.1.0';

const GROK2_API_KEY = Deno.env.get('GROK2_API_KEY') ?? '';
const GROK2_API_URL = 'https://api.grok2.ai/v1/completions';

serve(async (req) => {
  try {
    const { prompt } = await req.json();

    const completionRequest: CreateCompletionRequest = {
      model: 'grok2-large',
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    };

    const response = await fetch(GROK2_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK2_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionRequest),
    });

    const result = await response.json();

    // Parse AI response into array of questions
    const aiText = result.choices[0].text;
    const questions = aiText.split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\d+\.\s*/, ''));

    return new Response(JSON.stringify({ questions }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
