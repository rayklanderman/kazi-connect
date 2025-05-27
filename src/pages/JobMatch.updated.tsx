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
      {/* African-inspired heading */}
      <h1 className="heading-african text-3xl font-bold mb-8">Find Your Perfect Job Match</h1>
      
      {/* African-inspired decorative element */}
      <div className="w-full h-2 bg-gradient-sunset rounded-full mb-8"></div>
      
      {/* Loading state with African-inspired animation */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-pulse-african rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-4 text-earth-african font-medium">Finding your perfect matches...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {!loading && !error && matches.length === 0 && (
        <div className="bg-pattern-dots bg-earth-50 border-l-4 border-earth-500 text-earth-800 p-6 rounded-lg mb-6 shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="font-medium">No job matches found.</p>
              <p className="mt-1 text-sm">Please check back later or update your profile with more skills.</p>
            </div>
          </div>
        </div>
      )}
      
      {!loading && matches.length > 0 && (
        <div className="space-y-8">
          {/* African-inspired section heading */}
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-gradient-sunset"></div>
            <h2 className="text-xl font-semibold text-earth-african">Your Top Matches</h2>
            <div className="h-px flex-1 bg-gradient-sunset"></div>
          </div>
          
          {matches.map(({ job, score, explanation }) => (
            <div 
              key={job.id} 
              className="card-african bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 text-neutral-900">{job.title}</h2>
                  <p className="text-neutral-600 mb-3 flex items-center">
                    <svg className="h-4 w-4 mr-1 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {job.company.name} 
                    <span className="mx-2">•</span>
                    <svg className="h-4 w-4 mr-1 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </p>
                  
                  <div className="mb-4 bg-pattern-zigzag bg-opacity-10 p-4 rounded-lg border border-primary-100">
                    <h3 className="font-semibold text-primary-800 flex items-center mb-2">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Match Analysis:
                    </h3>
                    <p className="text-neutral-700">{explanation || 'No specific reason provided'}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-semibold text-neutral-700 flex items-center mb-2">
                      <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Job Description:
                    </h3>
                    <p className="text-neutral-600 line-clamp-3">{job.description}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.type && job.type !== 'N/A' && (
                      <span className="badge-african badge-african-primary">
                        {job.type}
                      </span>
                    )}
                    {job.salary_range && job.salary_range !== 'N/A' && (
                      <span className="badge-african badge-african-accent">
                        {job.salary_range}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-end min-w-[120px]">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {/* Circular progress indicator with African-inspired colors */}
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          className="text-neutral-200"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${Math.round(score * 100)}, 100`}
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <text x="18" y="20.5" className="text-2xl font-bold" textAnchor="middle" fill="var(--color-primary-800)">
                          {Math.round(score * 100)}%
                        </text>
                      </svg>
                    </div>
                  </div>
                  
                  {job.url ? (
                    <Button
                      className="btn-primary-african w-full md:w-auto mb-2"
                      aria-label={`View details for ${job.title}`}
                      tabIndex={0}
                      asChild
                    >
                      <a href={job.url} target="_blank" rel="noopener noreferrer">View Details</a>
                    </Button>
                  ) : (
                    <Button
                      className="btn-primary-african w-full md:w-auto mb-2"
                      aria-label={`View details for ${job.title}`}
                      tabIndex={0}
                      disabled
                    >
                      View Details
                    </Button>
                  )}
                  
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button
                      variant={appliedJobs.includes(job.id) ? 'secondary' : 'outline'}
                      className={appliedJobs.includes(job.id) ? 'bg-earth-100 text-earth-800' : ''}
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
                      className={savedJobs.includes(job.id) ? 'bg-accent-100 text-accent-800' : ''}
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
      
      {/* African-inspired notification */}
      {actionMsg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gradient-savanna text-earth-900 px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse-african">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {actionMsg}
            <button 
              className="ml-4 text-earth-900 hover:text-primary-800 font-bold" 
              onClick={() => setActionMsg(null)}
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      
      {/* African-inspired decorative footer element */}
      <div className="mt-12 w-full h-4 bg-pattern-diamonds opacity-20"></div>
    </div>
  );
}
