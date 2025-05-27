import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { aiService } from '@/lib/services/ai.service';
import { Loader2, FileText, CheckCircle, AlertTriangle, Sparkles, Plus } from 'lucide-react';

export function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      const result = await aiService.analyzeResume(resumeText);
      setAnalysis(result);
    } catch (error: any) {
      console.error('Analysis error:', error);
      setError(error.message || 'Failed to analyze resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-[var(--kenya-green)]" />
          <h2 className="text-xl font-semibold text-[var(--kenya-black)]">Resume Analysis</h2>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Paste your resume below and get AI-powered insights and suggestions to improve your job applications
        </p>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px] border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!resumeText || isLoading}
            className="w-full bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze Resume
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="mt-4 bg-[var(--kenya-red)]/10 text-[var(--kenya-red)] p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
        
        {successMessage && (
          <div className="mt-4 bg-[var(--kenya-green)]/10 text-[var(--kenya-green)] p-4 rounded-lg flex items-start gap-3">
            <CheckCircle className="h-5 w-5 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}
      </div>

      {analysis && (
        <div className="bg-white rounded-lg p-6 border-t-4 border-t-[var(--kenya-green)] mt-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--kenya-green)]" />
              <h2 className="text-xl font-semibold text-[var(--kenya-black)]">Resume Analysis Results</h2>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-[var(--kenya-green)]/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[var(--kenya-black)] flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[var(--kenya-green)]" />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {analysis.strengths.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-[var(--kenya-green)]/10 text-[var(--kenya-green)] text-xs mt-0.5">{i+1}</div>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-4 bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white gap-2"
                onClick={async () => {
                  try {
                    // Add strengths to bio
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;
                    const bio = analysis.strengths.join("; ");
                    await supabase.from('profiles').update({ bio }).eq('id', user.id);
                    setSuccessMessage('Strengths added to your bio!');
                  } catch (error) {
                    setError('Failed to update bio. Please try again.');
                  }
                }}
              >
                <Plus className="h-4 w-4" /> Add Strengths to Bio
              </Button>
            </div>

            <div className="bg-[var(--kenya-black)]/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[var(--kenya-black)] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[var(--kenya-black)]" />
                Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weakness: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-[var(--kenya-black)]/10 text-[var(--kenya-black)] text-xs mt-0.5">{i+1}</div>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--kenya-green)]/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[var(--kenya-black)] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--kenya-green)]" />
                Suggested Improvements
              </h3>
              <ul className="space-y-2">
                {analysis.suggestedImprovements.map((suggestion: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-[var(--kenya-green)]/10 text-[var(--kenya-green)] text-xs mt-0.5">{i+1}</div>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[var(--kenya-green)]/5 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-[var(--kenya-black)] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--kenya-green)]" />
                Key Skills Identified
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.keySkills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[var(--kenya-green)]/10 text-[var(--kenya-green)] rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Button
                className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white gap-2"
                onClick={async () => {
                  try {
                    // Add all skills to profile
                    const { data: { user } } = await supabase.auth.getUser();
                    if (!user) return;
                    // Get current skills
                    const { data: profile } = await supabase.from('profiles').select('skills').eq('id', user.id).single();
                    const currentSkills = profile?.skills || [];
                    const newSkills = Array.from(new Set([...currentSkills, ...analysis.keySkills]));
                    await supabase.from('profiles').update({ skills: newSkills }).eq('id', user.id);
                    setSuccessMessage('Skills added to your profile!');
                  } catch (error) {
                    setError('Failed to update skills. Please try again.');
                  }
                }}
              >
                <Plus className="h-4 w-4" /> Add All Skills to Profile
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
