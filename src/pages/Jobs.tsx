import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { jobsService, type Job } from '@/lib/services/jobs.service';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function Jobs() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAdzunaJobs = async () => {
    const country = 'za'; // South Africa (forced, Adzuna supported)
    // Get the current session (user must be logged in)
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('User not authenticated');

    const response = await fetch('https://oquszualnojmaqbmsopv.functions.supabase.co/fetch-adzuna', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        country,
        params: { results_per_page: 20 }
      })
    });
    if (!response.ok) throw new Error('Failed to fetch jobs from Adzuna');
    const data = await response.json();
    return data.results.map((job: any) => ({
      id: job.id,
      title: job.title,
      company: { name: job.company.display_name, website: job.redirect_url },
      description: job.description,
      type: job.contract_type || 'N/A',
      location: job.location.display_name,
      salary_range: job.salary_min && job.salary_max ? `${job.salary_min} - ${job.salary_max}` : 'N/A',
      url: job.redirect_url
    }));
  };


  const { data: jobs, isLoading, error } = useQuery<Job[], Error>({
    queryKey: ['jobs'],
    queryFn: fetchAdzunaJobs,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch jobs',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  const filteredJobs = jobs?.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>

        {/* Search box */}
        <div className="relative max-w-2xl">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                className="pl-10"
                placeholder="Search by job title, company, or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Job listings */}
      {isLoading ? (
        <div>Loading jobs...</div>
      ) : error ? (
        <div className="text-destructive">Error loading jobs</div>
      ) : filteredJobs?.length === 0 ? (
        <div>No jobs found</div>
      ) : (
        <div className="space-y-4">
          {filteredJobs?.map((job) => (
            <div
              key={job.id}
              className="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  {job.company?.website ? (
  <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-primary underline">
    {job.company.name}
  </a>
) : (
  <span className="text-muted-foreground">{job.company?.name}</span>
)}
                  <p className="text-sm mt-2">{job.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {job.type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {job.location}
                    </span>
                    {job.salary_range && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {job.salary_range}
                      </span>
                    )}
                  </div>
                </div>
                <Button
  variant="outline"
  asChild
>
  <a href={job.url} target="_blank" rel="noopener noreferrer">
    View Details
  </a>
</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
