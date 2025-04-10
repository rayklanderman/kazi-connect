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
  const { data, error } = await supabase.functions.invoke(functionName, {
    body,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (error) {
    console.error('Function error:', error);
    throw error;
  }

  return data;
};

export const aiService = {
  // Analyze resume and provide feedback
  analyzeResume: async (resumeText: string): Promise<ResumeAnalysis> => {
    try {
      const messages: Message[] = [
        {
          role: 'system',
          content: `You are a professional resume analyzer. Analyze resumes and provide structured feedback in JSON format with the following fields:
          {
            "strengths": ["strength1", "strength2", ...],
            "weaknesses": ["weakness1", "weakness2", ...],
            "suggestedImprovements": ["suggestion1", "suggestion2", ...],
            "keySkills": ["skill1", "skill2", ...]
          }`
        },
        {
          role: 'user',
          content: `Analyze this resume and provide feedback:\n\n${resumeText}`
        }
      ];

      const data = await invokeFunction('ai-analyze', { messages });
      return data;
    } catch (error) {
      console.error('Resume analysis error:', error);
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return {
          strengths: ['Strong technical skills', 'Clear project experience'],
          weaknesses: ['Could improve formatting', 'More quantifiable achievements needed'],
          suggestedImprovements: ['Add metrics to achievements', 'Include more keywords'],
          keySkills: ['React', 'TypeScript', 'Node.js']
        };
      }
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

      const data = await invokeFunction('ai-analyze', { messages });
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
  generateInterviewQuestions: async (jobId: string): Promise<string[]> => {
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
          content: 'You are an expert technical interviewer. Generate relevant interview questions based on job requirements.'
        },
        {
          role: 'user',
          content: `Generate 5 technical interview questions for this role:
          
          Job Title: ${job.title}
          Description: ${job.description}
          Requirements: ${job.requirements}
          
          Return the response as a JSON array of strings.`
        }
      ];

      const data = await invokeFunction('ai-analyze', { messages });
      return data;
    } catch (error) {
      console.error('Interview questions generation error:', error);
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return [
          'What is your experience with React and TypeScript?',
          'Can you explain how you handle state management in large applications?',
          'Tell me about a challenging technical problem you solved recently.',
          'How do you approach testing in your projects?',
          'What is your experience with cloud services like AWS or Azure?'
        ];
      }
      throw error;
    }
  }
};
