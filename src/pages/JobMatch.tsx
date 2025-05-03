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
        setJobs(jobsList);
        // Call xai API (aiService.matchWithJob) for each job
        const results: MatchResult[] = [];
        for (const job of jobsList.slice(0, 10)) { // Limit to 10 for demo
          try {
            const matchResult = await aiService.matchWithJob(profile?.bio || '', job.id);
            results.push({ job, score: matchResult.score / 100, explanation: matchResult.recommendation });
          } catch (err) {
            // fallback if xai fails
            results.push({ job, score: 0, explanation: 'AI match unavailable.' });
          }
        }
        // Sort by score descending
        results.sort((a, b) => b.score - a.score);
        setMatches(results);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch matches');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-8 px-2 max-w-3xl">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-primary drop-shadow-sm">
        Personalized Job Matches
      </h1>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="ml-4 text-lg font-medium text-primary">Finding your best matches...</span>
        </div>
      )}
      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-700 rounded p-3 mb-4 text-center">
          {error}
        </div>
      )}
      {/* No Matches State */}
      {matches.length === 0 && !loading && !error ? (
        <div className="text-center text-gray-600 mt-8">
          <p>No matches found.<br/>Make sure your profile and skills are up to date!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {matches.map(({ job, score, explanation }) => (
            <div
              key={job.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-transform hover:scale-[1.01]"
            >
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-primary mb-1 truncate">{job.title}</h3>
                <p className="text-sm text-gray-500 mb-1 truncate">
  {job.company?.website ? (
    <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
      {job.company.name}
    </a>
  ) : (
    <span className="text-muted-foreground">{job.company?.name}</span>
  )}
</p>
<p className="text-xs text-gray-700 mb-2 line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    {job.type}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {job.location}
                  </span>
                  {job.salary_range && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                      {job.salary_range}
                    </span>
                  )}
                </div>
                {explanation && (
                  <div className="mt-3 text-xs text-gray-800 bg-gray-50 rounded p-2 border border-gray-200">
                    <strong className="text-primary">AI Match Reason:</strong> {explanation}
                  </div>
                )}
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
                    disabled={appliedJobs.includes(job.id)}
                    onClick={async () => {
                      if (!userProfile) return;
                      try {
                        await jobsService.applyToJob(userProfile.id, job.id);
                        setAppliedJobs([...appliedJobs, job.id]);
                        setActionMsg('Job applied successfully!');
                      } catch (err: any) {
                        setActionMsg(err.message || 'Failed to apply');
                      }
                    }}
                  >
                    {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
                  </Button>
                  <Button
                    variant={savedJobs.includes(job.id) ? 'secondary' : 'outline'}
                    disabled={savedJobs.includes(job.id)}
                    onClick={async () => {
                      if (!userProfile) return;
                      try {
                        await jobsService.saveJob(userProfile.id, job.id);
                        setSavedJobs([...savedJobs, job.id]);
                        setActionMsg('Job saved!');
                      } catch (err: any) {
                        setActionMsg(err.message || 'Failed to save');
                      }
                    }}
                  >
                    {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
                  </Button>
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
