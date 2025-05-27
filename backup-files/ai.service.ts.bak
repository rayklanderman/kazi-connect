import { supabase } from '../supabase';

interface JobMatch {
  jobId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: string;
}

interface ResumeAnalysis {
  strengths: string[];
  weaknesses: string[];
  suggestedImprovements: string[];
  keySkills: string[];
}

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const invokeFunction = async (functionName: string, body: any) => {
  console.log('Invoking function:', functionName, 'with body:', body);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(`https://oquszualnojmaqbmsopv.supabase.co/functions/v1/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token || ''}`
      },
      body: JSON.stringify(body)
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      } catch (e) {
        throw new Error(`HTTP error ${response.status}: ${responseText}`);
      }
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Function response:', data);
      return data;
    } catch (e) {
      console.error('Failed to parse response as JSON:', e);
      return responseText;
    }
  } catch (error) {
    console.error('Function error:', error);
    throw error;
  }
};

export const aiService = {
  // Analyze resume and provide feedback
  analyzeResume: async (resumeText: string): Promise<ResumeAnalysis> => {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a professional resume analyzer. Analyze resumes and provide structured feedback in JSON format with exactly these fields:
          {
            "strengths": ["strength1", "strength2", ...],
            "weaknesses": ["weakness1", "weakness2", ...],
            "suggestedImprovements": ["suggestion1", "suggestion2", ...],
            "keySkills": ["skill1", "skill2", ...]
          }
          Keep each point concise and focused. Do not include any additional fields or explanatory text.`
        },
        {
          role: 'user',
          content: `Analyze this resume and provide feedback in the exact JSON format specified:\n\n${resumeText}`
        }
      ];

      console.log('Sending messages to AI:', messages);
      const response = await invokeFunction('ai-analyze', { messages });
      console.log('Received response:', response);

      // Ensure we have a valid response with all required fields
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from AI service');
      }

      if (!Array.isArray(response.strengths) || !Array.isArray(response.weaknesses) || 
          !Array.isArray(response.suggestedImprovements) || !Array.isArray(response.keySkills)) {
        throw new Error('Response missing required fields');
      }

      return {
        strengths: response.strengths,
        weaknesses: response.weaknesses,
        suggestedImprovements: response.suggestedImprovements,
        keySkills: response.keySkills
      };
    } catch (error) {
      console.error('Resume analysis error:', error);
      throw error;
    }
  },

  // Match resume with job description
  matchWithJob: async (resumeText: string, jobId: string): Promise<JobMatch> => {
    try {
      const { data: job } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

      if (!job) throw new Error('Job not found');

      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a job matching expert. Compare resumes with job requirements and provide structured feedback in JSON format with the following fields:
          {
            "score": number between 0-100,
            "matchedSkills": ["skill1", "skill2", ...],
            "missingSkills": ["skill1", "skill2", ...],
            "recommendation": "detailed recommendation"
          }`
        },
        {
          role: 'user',
          content: `Compare this resume with the job requirements:
          
          Resume:
          ${resumeText}
          
          Job Title: ${job.title}
          Description: ${job.description}
          Requirements: ${job.requirements}`
        }
      ];

      console.log('Sending messages to AI:', messages);
      const data = await invokeFunction('ai-analyze', { messages });
      console.log('Received response:', data);
      return { ...data, jobId };
    } catch (error) {
      console.error('Job matching error:', error);
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return {
          jobId,
          score: 85,
          matchedSkills: ['React', 'TypeScript', 'Node.js'],
          missingSkills: ['GraphQL', 'AWS'],
          recommendation: 'Good match! Consider learning GraphQL and AWS to be an even stronger candidate.'
        };
      }
      throw error;
    }
  },

  // Generate practice interview questions
  generateInterviewQuestions: async (jobRole: string): Promise<string[]> => {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `You are an expert technical interviewer. Generate relevant interview questions based on the job role. 
          Focus on both technical and behavioral questions that are commonly asked in interviews.
          Return exactly 10 questions as a JSON array of strings.
          Make the questions specific to the role and include a mix of:
          - Technical skills assessment
          - Problem-solving abilities
          - Role-specific scenarios
          - Behavioral questions
          - Experience-based questions`
        },
        {
          role: 'user',
          content: `Generate 10 interview questions for a ${jobRole} position. Return them as a JSON array of strings.`
        }
      ];

      console.log('Sending messages to AI:', messages);
      const response = await invokeFunction('ai-analyze', { messages });
      console.log('Received response:', response);

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }

      return response;
    } catch (error) {
      console.error('Interview questions generation error:', error);
      throw error;
    }
  }
};
