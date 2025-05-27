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
  // Validate inputs to prevent injection attacks
  if (!functionName || typeof functionName !== 'string') {
    throw new Error('Invalid function name');
  }
  
  // Only log in development or when debug mode is explicitly enabled
  const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
  const isDev = import.meta.env.MODE === 'development';
  const shouldLog = isDev && isDebugMode;
  
  if (shouldLog) {
    console.log('Invoking function:', functionName);
  }
  
  try {
    // Get the current session to ensure user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Authentication required');
    }
    
    // Use environment variable for the base URL instead of hardcoding
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${functionName}`;
    
    // Set a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
        // Add security headers
        'X-Content-Type-Options': 'nosniff'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const responseText = await response.text();
    
    if (shouldLog) {
      // Don't log if response might contain sensitive data
      if (!responseText.includes('api_key') && !responseText.includes('token')) {
        console.log('Response status:', response.status);
      } else {
        console.log('Response status:', response.status, '(response contains sensitive data, not logging content)');
      }
    }

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      } catch (e) {
        // Don't include full response text in error messages to prevent leaking sensitive data
        throw new Error(`HTTP error ${response.status}: Request failed`);
      }
    }

    try {
      const data = JSON.parse(responseText);
      return data;
    } catch (e) {
      if (shouldLog) {
        console.error('Failed to parse response as JSON');
      }
      return responseText;
    }
  } catch (error) {
    if (shouldLog) {
      // Sanitize error message to prevent leaking sensitive data
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Function error:', errorMessage.includes('api_key') || errorMessage.includes('token') ? 
        'Error contains sensitive data, not logging details' : errorMessage);
    }
    throw error;
  }
};

export const aiService = {
  // Analyze resume and provide feedback
  analyzeResume: async (resumeText: string): Promise<ResumeAnalysis> => {
    // Input validation
    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Invalid resume text provided');
    }

    // Limit input size to prevent abuse
    const maxLength = 50000; // Reasonable limit for a resume
    if (resumeText.length > maxLength) {
      throw new Error(`Resume text too large (${resumeText.length} chars). Maximum allowed is ${maxLength} chars.`);
    }

    try {
      // Sanitize input to prevent XSS or injection attacks
      const sanitizedText = resumeText
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .trim();

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
          Keep each point concise and focused. Do not include any additional fields or explanatory text.
          Never include personal identifiable information (PII) like emails, phone numbers, or addresses in the response.`
        },
        {
          role: 'user',
          content: `Analyze this resume and provide feedback in the exact JSON format specified:\n\n${sanitizedText}`
        }
      ];

      const isDev = import.meta.env.MODE === 'development';
      const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
      const shouldLog = isDev && isDebugMode;
      
      if (shouldLog) {
        console.log('Sending resume analysis request');
      }
      
      const response = await invokeFunction('ai-analyze', { messages });

      // Ensure we have a valid response with all required fields
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from AI service');
      }

      if (!Array.isArray(response.strengths) || !Array.isArray(response.weaknesses) || 
          !Array.isArray(response.suggestedImprovements) || !Array.isArray(response.keySkills)) {
        throw new Error('Response missing required fields');
      }

      // Sanitize output to prevent XSS in the UI
      const sanitizeArray = (arr: string[]) => arr.map(item => 
        typeof item === 'string' ? item.replace(/<[^>]*>/g, '') : item
      );

      return {
        strengths: sanitizeArray(response.strengths),
        weaknesses: sanitizeArray(response.weaknesses),
        suggestedImprovements: sanitizeArray(response.suggestedImprovements),
        keySkills: sanitizeArray(response.keySkills)
      };
    } catch (error) {
      const isDev = import.meta.env.MODE === 'development';
      const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
      const shouldLog = isDev && isDebugMode;
      
      if (shouldLog) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Resume analysis error:', errorMessage);
      }
      throw new Error('Failed to analyze resume. Please try again later.');
    }
  },

  // Match resume with job description
  matchWithJob: async (resumeText: string, jobId: string): Promise<JobMatch> => {
    // Input validation
    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Invalid resume text provided');
    }
    
    if (!jobId || typeof jobId !== 'string') {
      throw new Error('Invalid job ID provided');
    }

    // Limit input size to prevent abuse
    const maxLength = 50000; // Reasonable limit for a resume
    if (resumeText.length > maxLength) {
      throw new Error(`Resume text too large (${resumeText.length} chars). Maximum allowed is ${maxLength} chars.`);
    }

    try {
      // Sanitize inputs
      const sanitizedText = resumeText
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .trim();
      
      // Validate jobId format to prevent SQL injection
      const validJobIdPattern = /^[a-zA-Z0-9-_]+$/;
      if (!validJobIdPattern.test(jobId)) {
        throw new Error('Invalid job ID format');
      }

      const { data: job, error } = await supabase
        .from('jobs')
        .select('id, title, description, requirements')
        .eq('id', jobId)
        .single();

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!job) {
        throw new Error('Job not found');
      }

      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a job matching expert. Compare resumes with job requirements and provide structured feedback in JSON format with the following fields:
          {
            "score": number between 0-100,
            "matchedSkills": ["skill1", "skill2", ...],
            "missingSkills": ["skill1", "skill2", ...],
            "recommendation": "detailed recommendation"
          }
          Never include personal identifiable information (PII) like emails, phone numbers, or addresses in the response.`
        },
        {
          role: 'user',
          content: `Compare this resume with the job requirements:
          
          Resume:
          ${sanitizedText}
          
          Job Title: ${job.title}
          Description: ${job.description}
          Requirements: ${job.requirements}`
        }
      ];

      const isDev = import.meta.env.MODE === 'development';
      const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
      const shouldLog = isDev && isDebugMode;
      
      if (shouldLog) {
        console.log('Sending job matching request');
      }
      
      const data = await invokeFunction('ai-analyze', { messages });
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response from AI service');
      }
      
      // Sanitize output to prevent XSS in the UI
      const sanitizeArray = (arr: string[]) => arr.map(item => 
        typeof item === 'string' ? item.replace(/<[^>]*>/g, '') : item
      );
      
      const sanitizedRecommendation = typeof data.recommendation === 'string' ? 
        data.recommendation.replace(/<[^>]*>/g, '') : '';
      
      return { 
        jobId, 
        score: typeof data.score === 'number' ? data.score : 0,
        matchedSkills: Array.isArray(data.matchedSkills) ? sanitizeArray(data.matchedSkills) : [],
        missingSkills: Array.isArray(data.missingSkills) ? sanitizeArray(data.missingSkills) : [],
        recommendation: sanitizedRecommendation
      };
    } catch (error) {
      const isDev = import.meta.env.MODE === 'development';
      const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
      const shouldLog = isDev && isDebugMode;
      
      if (shouldLog) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Job matching error:', errorMessage);
      }
      
      // Return mock data for development only
      if (isDev) {
        return {
          jobId,
          score: 85,
          matchedSkills: ['React', 'TypeScript', 'Node.js'],
          missingSkills: ['GraphQL', 'AWS'],
          recommendation: 'Good match! Consider learning GraphQL and AWS to be an even stronger candidate.'
        };
      }
      
      throw new Error('Failed to match with job. Please try again later.');
    }
  },

  // Generate practice interview questions
  generateInterviewQuestions: async (jobRole: string): Promise<string[]> => {
    // Input validation
    if (!jobRole || typeof jobRole !== 'string') {
      throw new Error('Invalid job role provided');
    }

    // Limit input size to prevent abuse
    const maxLength = 200; // Reasonable limit for a job role
    if (jobRole.length > maxLength) {
      throw new Error(`Job role text too large (${jobRole.length} chars). Maximum allowed is ${maxLength} chars.`);
    }

    try {
      // Sanitize input to prevent XSS or injection attacks
      const sanitizedJobRole = jobRole
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .trim();

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
          - Experience-based questions
          Never include personal identifiable information or sensitive data in the questions.`
        },
        {
          role: 'user',
          content: `Generate 10 interview questions for a ${sanitizedJobRole} position. Return them as a JSON array of strings.`
        }
      ];

      const isDev = import.meta.env.MODE === 'development';
      const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
      const shouldLog = isDev && isDebugMode;
      
      if (shouldLog) {
        console.log('Sending interview questions request');
      }
      
      const response = await invokeFunction('ai-analyze', { messages });

      if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
      }

      // Sanitize output to prevent XSS in the UI
      const sanitizedQuestions = response.map(question => 
        typeof question === 'string' ? question.replace(/<[^>]*>/g, '') : ''
      ).filter(q => q.length > 0);

      // Ensure we have at least some questions
      if (sanitizedQuestions.length === 0) {
        throw new Error('No valid questions were generated');
      }

      return sanitizedQuestions;
    } catch (error) {
      const isDev = import.meta.env.MODE === 'development';
      const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
      const shouldLog = isDev && isDebugMode;
      
      if (shouldLog) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Interview questions generation error:', errorMessage);
      }
      
      throw new Error('Failed to generate interview questions. Please try again later.');
    }
  }
};
