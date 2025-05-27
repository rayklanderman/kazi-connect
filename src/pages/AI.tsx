import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { aiService } from '@/lib/services/ai.service';
import { useToast } from '@/components/ui/use-toast';
import { BrainCog, Sparkles, Copy, CheckCircle, AlertCircle, Loader2, FileText, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumeAnalyzer } from '@/components/ai/ResumeAnalyzer';

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

export default function AI() {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('resume');
  const { toast } = useToast();

  const handleGenerateQuestions = async () => {
    if (!selectedRole) return;
    
    setIsGenerating(true);
    setError(null);
    setCopied(false);
    
    try {
      const generatedQuestions = await aiService.generateInterviewQuestions(selectedRole);
      setQuestions(generatedQuestions);
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to generate interview questions');
      toast({
        title: 'Error',
        description: 'Failed to generate interview questions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyQuestions = () => {
    const questionsText = questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n');
    navigator.clipboard.writeText(questionsText);
    setCopied(true);
    toast({
      title: 'Copied',
      description: 'Questions copied to clipboard',
    });
    
    // Reset copied state after 3 seconds
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-[var(--kenya-green)]/10 to-[var(--kenya-black)]/5 rounded-xl p-6 md:p-10 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--kenya-black)]">AI Career Assistant</h1>
            <p className="text-muted-foreground mb-6 max-w-2xl">
              Leverage AI to enhance your job search with resume analysis, interview preparation, and personalized career insights.
            </p>
          </div>
          <div className="bg-white p-3 rounded-full shadow-md">
            <BrainCog className="h-16 w-16 text-[var(--kenya-green)]" />
          </div>
        </div>

        <Tabs defaultValue="resume" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-6 bg-[var(--kenya-green)]/10">
            <TabsTrigger 
              value="resume" 
              className="data-[state=active]:bg-[var(--kenya-green)] data-[state=active]:text-white flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Resume Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="interview" 
              className="data-[state=active]:bg-[var(--kenya-green)] data-[state=active]:text-white flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Interview Prep
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resume" className="mt-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ResumeAnalyzer />
            </div>
          </TabsContent>

          <TabsContent value="interview" className="mt-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-2 text-[var(--kenya-black)]">
                    Select Job Role
                  </label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]">
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
                </div>

                <Button
                  onClick={handleGenerateQuestions}
                  disabled={!selectedRole || isGenerating}
                  className="w-full bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Interview Questions
                    </>
                  )}
                </Button>
              </div>

              {/* Questions display */}
              {questions.length > 0 && (
                <div className="mt-6 pt-6 border-t border-[var(--kenya-green)]/10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-[var(--kenya-green)]" />
                      <h2 className="text-xl font-semibold text-[var(--kenya-black)]">Interview Questions for {selectedRole}</h2>
                    </div>
                    <div className="text-sm text-muted-foreground">{questions.length} questions generated</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {questions.map((question, index) => (
                      <div 
                        key={index} 
                        className="p-4 bg-[var(--kenya-green)]/5 rounded-md border-l-2 border-l-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/10 transition-colors"
                      >
                        <p className="font-medium text-[var(--kenya-black)]">{`${index + 1}. ${question}`}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button 
                      variant="outline" 
                      onClick={handleCopyQuestions}
                      className="border-[var(--kenya-green)] text-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/10 gap-2"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Copied to Clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy All Questions
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Error display */}
              {error && (
                <div className="mt-6 bg-[var(--kenya-red)]/10 text-[var(--kenya-red)] p-4 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Error generating questions</p>
                    <p className="text-sm mt-1">Please try again later or select a different job role.</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
