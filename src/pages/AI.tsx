import { ResumeAnalyzer } from '@/components/ai/ResumeAnalyzer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import { aiService } from '@/lib/services/ai.service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const commonRoles = [
  'Software Developer',
  'Business Analyst',
  'Project Manager',
  'Data Scientist',
  'UX Designer',
  'Product Manager',
  'HR Manager',
  'Marketing Manager',
  'Sales Manager',
  'Financial Analyst'
];

export default function AIPage() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    if (!selectedRole) return;
    
    try {
      setIsLoading(true);
      const result = await aiService.generateInterviewQuestions(selectedRole);
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
                Generate practice interview questions based on your target job role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a job role" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={!selectedRole || isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Questions'}
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
