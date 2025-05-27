import React, { useEffect, useState } from "react";
import { aiService } from "../lib/services/ai.service";
import { supabase } from '@/lib/supabase';
import { jobsService, Job } from '@/lib/services/jobs.service';
import { Button } from '@/components/ui/button';

interface MatchResult {
  job: Job;
  score: number;
  explanation?: string;
}

export default function JobMatch() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Fetch user profile and jobs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setUserProfile(profile);
        // Fetch applied/saved jobs
        const [appliedRes, savedRes] = await Promise.all([
          supabase.from('applied_jobs').select('job_id').eq('user_id', user.id),
          supabase.from('saved_jobs').select('job_id').eq('user_id', user.id)
        ]);
        setAppliedJobs(appliedRes.data ? appliedRes.data.map((r: any) => r.job_id) : []);
        setSavedJobs(savedRes.data ? savedRes.data.map((r: any) => r.job_id) : []);
        // Fetch jobs from Adzuna
        const country = 'za'; // South Africa (forced, Adzuna supported)
        // Get the current session (user must be logged in)
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('User not authenticated');
        const jobsResponse = await fetch('https://oquszualnojmaqbmsopv.functions.supabase.co/fetch-adzuna', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            country: 'za',
            params: { results_per_page: 20 }
          })
        });
        if (!jobsResponse.ok) throw new Error('Failed to fetch jobs from Adzuna');
        const adzunaData = await jobsResponse.json();
        const jobsList = adzunaData.results.map((job: any) => ({
          id: job.id,
          title: job.title,
          company: { name: job.company.display_name, website: job.redirect_url },
          description: job.description,
          type: job.contract_type || 'N/A',
          location: job.location.display_name,
          salary_range: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : 'N/A',
          url: job.redirect_url
        }));
        // Call xai API (aiService.matchWithJob) for each job
        const results: MatchResult[] = [];
        for (const job of jobsList) {
          // If the job does not have a company_id, assume it's from Adzuna (external), skip AI matching
          if (!job.company_id) {
            // fallback: match by skills only
            let skillMatch = false;
            let explanation = 'Matched by skills.';
            const skillsToCheck = (profile?.skills || []).map(s => s.trim().toLowerCase()).filter(Boolean);
            const jobText = (job.title + ' ' + job.description).toLowerCase();
            if (skillsToCheck.length > 0) {
              for (const skill of skillsToCheck) {
                const skillTokens = skill.split(' ');
                for (const token of skillTokens) {
                  if (token && jobText.includes(token)) {
                    skillMatch = true;
                    explanation = `Matched by skill keyword: ${token}`;
                    break;
                  }
                }
                if (skillMatch) break;
              }
            }
            const score = skillMatch ? 0.75 : 0.5; // Simple scoring for external jobs
            results.push({ job, score, explanation });
          } else {
            try {
              // For internal jobs, use AI matching
              const resumeText = profile?.resume_text || '';
              if (resumeText) {
                const match = await aiService.matchWithJob(resumeText, job.id);
                results.push({
                  job,
                  score: match.score / 100,
                  explanation: match.recommendation
                });
              } else {
                // If no resume, fallback to simple matching
                let skillMatch = false;
                let explanation = 'No resume provided. Matched by job title.';
                
                if (profile?.skills && profile.skills.length > 0) {
                  const jobText = (job.title + ' ' + job.description).toLowerCase();
                  for (const skill of profile.skills) {
                    if (jobText.includes(skill.toLowerCase())) {
                      skillMatch = true;
                      explanation = `Matched by skill: ${skill}`;
                      break;
                    }
                  }
                }
                
                results.push({
                  job,
                  score: skillMatch ? 0.7 : 0.5,
                  explanation
                });
              }
            } catch (err) {
              // If matching fails, add with a default score
              results.push({
                job,
                score: 0.5,
                explanation: 'Could not analyze match. Basic recommendation.'
              });
            }
          }
        }
        
        // Sort by match score (highest first)
        results.sort((a, b) => b.score - a.score);
        setMatches(results);
        setJobs(jobsList);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Job Match</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && matches.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No job matches found. Please check back later or update your profile with more skills.</p>
        </div>
      )}
      
      {!loading && matches.length > 0 && (
        <div className="space-y-6">
          {matches.map(({ job, score, explanation }) => (
            <div 
              key={job.id} 
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                  <p className="text-gray-600 mb-2">{job.company.name} • {job.location}</p>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700">Match Explanation:</h3>
                    <p className="text-gray-600">{explanation || 'No specific reason provided'}</p>
                  </div>
                  
                  <div className="mb-2">
                    <h3 className="font-semibold text-gray-700">Job Description:</h3>
                    <p className="text-gray-600 line-clamp-3">{job.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.type && job.type !== 'N/A' && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {job.type}
                      </span>
                    )}
                    {job.salary_range && job.salary_range !== 'N/A' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {job.salary_range}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end min-w-[90px]">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-2xl font-bold text-green-600 drop-shadow"
                      aria-label={`Match score: ${Math.round(score * 100)} percent`}
                    >
                      {Math.round(score * 100)}%
                    </span>
                    <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  {job.url ? (
                    <Button
                      variant="default"
                      className="mt-2 w-full md:w-auto"
                      aria-label={`View details for ${job.title}`}
                      tabIndex={0}
                      asChild
                    >
                      <a href={job.url} target="_blank" rel="noopener noreferrer">View Details</a>
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="mt-2 w-full md:w-auto"
                      aria-label={`View details for ${job.title}`}
                      tabIndex={0}
                      disabled
                    >
                      View Details
                    </Button>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant={appliedJobs.includes(job.id) ? 'secondary' : 'outline'}
                      onClick={async () => {
                        if (!userProfile) return;
                        // If Adzuna job (no company_id), disable apply, only allow view details
                        if (!job.company_id) return;
                        try {
                          await jobsService.applyToJob(userProfile.id, job);
                          setAppliedJobs([...appliedJobs, job.id]);
                          setActionMsg('Job applied successfully!');
                        } catch (err: any) {
                          setActionMsg(err.message || 'Failed to apply');
                        }
                      }}
                      disabled={!job.company_id || appliedJobs.includes(job.id)}
                    >
                      {!job.company_id ? 'Apply (External)' : appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                    </Button>
                    <Button
                      variant={savedJobs.includes(job.id) ? 'secondary' : 'outline'}
                      onClick={async () => {
                        if (!userProfile) return;
                        try {
                          await jobsService.saveJob(userProfile.id, job);
                          setSavedJobs([...savedJobs, job.id]);
                          setActionMsg('Job saved!');
                        } catch (err: any) {
                          setActionMsg(err.message || 'Failed to save');
                        }
                      }}
                      disabled={savedJobs.includes(job.id)}
                    >
                      {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {actionMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded shadow z-50">
          {actionMsg}
          <button className="ml-4 text-green-900 font-bold" onClick={() => setActionMsg(null)}>&times;</button>
        </div>
      )}
      {/* TODO: Add African branding, illustrations, and further UI polish */}
    </div>
  );
}
