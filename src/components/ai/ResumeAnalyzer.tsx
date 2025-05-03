import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { aiService } from '@/lib/services/ai.service';
import { Loader2 } from 'lucide-react';

export function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async () => {
    try {
      setIsLoading(true);
      const result = await aiService.analyzeResume(resumeText);
      setAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardDescription>
            Paste your resume below and get AI-powered insights and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="min-h-[200px]"
          />
          <Button
            onClick={handleAnalyze}
            disabled={!resumeText || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Analyze Resume'
            )}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Key Strengths</h3>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.strengths.map((strength: string, i: number) => (
                  <li key={i}>{strength}</li>
                ))}
              </ul>
              <Button
                className="mt-2"
                variant="secondary"
                onClick={async () => {
                  // Add strengths to bio
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  const bio = analysis.strengths.join("; ");
                  await supabase.from('profiles').update({ bio }).eq('id', user.id);
                  alert('Strengths added to your bio!');
                }}
              >
                Add Strengths to Bio
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.weaknesses.map((weakness: string, i: number) => (
                  <li key={i}>{weakness}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Suggested Improvements</h3>
              <ul className="list-disc pl-4 space-y-1">
                {analysis.suggestedImprovements.map((suggestion: string, i: number) => (
                  <li key={i}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Skills Identified</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keySkills.map((skill: string, i: number) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <Button
                className="mt-2"
                variant="secondary"
                onClick={async () => {
                  // Add all skills to profile
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) return;
                  // Get current skills
                  const { data: profile } = await supabase.from('profiles').select('skills').eq('id', user.id).single();
                  const currentSkills = profile?.skills || [];
                  const newSkills = Array.from(new Set([...currentSkills, ...analysis.keySkills]));
                  await supabase.from('profiles').update({ skills: newSkills }).eq('id', user.id);
                  alert('Skills added to your profile!');
                }}
              >
                Add All Skills to Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
