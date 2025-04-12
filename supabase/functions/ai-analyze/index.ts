// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

// Deno runtime types
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  keySkills: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Log request details
    console.log('Request method:', req.method);

    // Health check endpoint
    if (req.method === 'GET') {
      const apiKey = Deno.env.get('XAI_API_KEY');
      return new Response(
        JSON.stringify({ 
          status: 'ok',
          hasApiKey: !!apiKey,
          keyLength: apiKey ? apiKey.length : 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get request body
    const text = await req.text();
    if (!text) {
      throw new Error('Empty request body');
    }
    
    const body = JSON.parse(text);
    if (!body.messages || !Array.isArray(body.messages)) {
      throw new Error('Invalid request: messages array is required');
    }

    // Get API key
    const apiKey = Deno.env.get('XAI_API_KEY');
    if (!apiKey) {
      throw new Error('XAI_API_KEY not configured');
    }

    // Call xAI API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'grok-3-mini-beta',
        messages: body.messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const xaiResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(`xAI API error (${response.status}): ${JSON.stringify(xaiResponse)}`);
    }

    if (!xaiResponse.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from xAI API');
    }

    // Parse the AI response
    const content = xaiResponse.choices[0].message.content;
    let result;
    
    try {
      // Try to parse the content as JSON
      result = JSON.parse(content);

      // Check if this is a resume analysis response
      if (typeof result === 'object' && result !== null &&
          ('strengths' in result || 'weaknesses' in result || 
           'suggestedImprovements' in result || 'keySkills' in result)) {
        // Validate and ensure all required fields exist
        result = {
          strengths: Array.isArray(result.strengths) ? result.strengths : [],
          weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
          suggestedImprovements: Array.isArray(result.suggestedImprovements) ? result.suggestedImprovements : [],
          keySkills: Array.isArray(result.keySkills) ? result.keySkills : []
        };
      }
      // Check if this is an array response (interview questions)
      else if (Array.isArray(result)) {
        result = result.map(item => String(item));
      }
      else {
        throw new Error('Response format not recognized');
      }
    } catch (e) {
      console.error('Parse error:', e);
      console.log('Raw content:', content);
      
      // Try to extract an array from the content if it's interview questions
      if (content.includes('[') && content.includes(']')) {
        try {
          const match = content.match(/\[([\s\S]*)\]/);
          if (match) {
            const items = match[1]
              .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
              .map(item => item.trim().replace(/^["']|["']$/g, ''))
              .filter(item => item.length > 0);
            if (items.length > 0) {
              return new Response(
                JSON.stringify(items),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
              );
            }
          }
        } catch (arrayError) {
          console.error('Array extraction failed:', arrayError);
        }
      }
      
      throw new Error(`Failed to parse AI response: ${e.message}`);
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
