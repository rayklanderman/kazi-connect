import { ResumeAnalyzer } from '@/components/ai/ResumeAnalyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { aiService } from '@/lib/services/ai.service';
import { Input } from '@/components/ui/input';

export default function AIPage() {
  const [jobId, setJobId] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    try {
      setIsLoading(true);
      const result = await aiService.generateInterviewQuestions(jobId);
      setQuestions(result);
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="resume" className="w-full">
        <TabsList>
          <TabsTrigger value="resume">Resume Analysis</TabsTrigger>
          <TabsTrigger value="interview">Interview Prep</TabsTrigger>
        </TabsList>

        <TabsContent value="resume">
          <ResumeAnalyzer />
        </TabsContent>

        <TabsContent value="interview">
          <Card>
            <CardHeader>
              <CardTitle>Interview Preparation</CardTitle>
              <CardDescription>
                Generate practice interview questions based on job requirements. Enter the UUID of a job listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Enter Job UUID"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={!jobId || isLoading}
                >
                  Generate Questions
                </Button>
              </div>

              {questions.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Practice Questions:</h3>
                  <ul className="list-decimal pl-4 space-y-2">
                    {questions.map((question, index) => (
                      <li key={index} className="pl-2">{question}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
