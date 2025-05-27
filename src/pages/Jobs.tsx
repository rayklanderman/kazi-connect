import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Briefcase, MapPin, Building2, Filter, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { jobsService, type Job } from '@/lib/services/jobs.service';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';

export default function Jobs() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
    onSettled: () => {
      // This ensures we always get the loading state correctly
      console.log('Jobs query settled');
    }
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
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Hero section */}
        <div className="bg-gradient-to-r from-[var(--kenya-green)]/10 to-[var(--kenya-black)]/5 rounded-xl p-6 md:p-10 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--kenya-black)]">Find Your Dream Job in Kenya</h1>
          <p className="text-muted-foreground mb-6 max-w-2xl">Browse through hundreds of opportunities from top Kenyan employers and international companies with a presence in Kenya.</p>
          
          {/* Search box */}
          <div className="relative max-w-4xl">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
                <Input
                  type="text"
                  className="pl-10 border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                  placeholder="Search by job title, company, or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button 
                className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="mr-2 h-4 w-4" /> Filters
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Expandable filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-white rounded-lg shadow-md border border-[var(--kenya-green)]/20 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="">All Locations</option>
                    <option value="nairobi">Nairobi</option>
                    <option value="mombasa">Mombasa</option>
                    <option value="kisumu">Kisumu</option>
                    <option value="nakuru">Nakuru</option>
                    <option value="eldoret">Eldoret</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                  <select className="w-full rounded-md border border-gray-300 p-2">
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job listings section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[var(--kenya-black)]">Available Opportunities</h2>
            <div className="text-sm text-muted-foreground">
              {filteredJobs?.length || 0} jobs found
            </div>
          </div>
          
          {/* Job listings */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-[var(--kenya-green)] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Loading opportunities from across Kenya...</p>
            </div>
          ) : error ? (
            <div className="bg-[var(--kenya-red)]/10 text-[var(--kenya-red)] p-4 rounded-lg">
              <p className="font-medium">Error loading jobs</p>
              <p className="text-sm mt-1">Please try again later or contact support if the problem persists.</p>
            </div>
          ) : filteredJobs?.length === 0 ? (
            <div className="bg-[var(--kenya-black)]/5 p-8 rounded-lg text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or check back later for new opportunities.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {filteredJobs?.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-l-[var(--kenya-green)]"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--kenya-black)] hover:text-[var(--kenya-green)] transition-colors">
                          {job.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Building2 className="h-4 w-4 text-[var(--kenya-green)] mr-1" />
                          {job.company?.website ? (
                            <a href={job.company.website} target="_blank" rel="noopener noreferrer" className="text-[var(--kenya-green)] hover:underline">
                              {job.company.name}
                            </a>
                          ) : (
                            <span className="text-muted-foreground">{job.company?.name}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center mt-1 text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        
                        <p className="text-sm mt-4 text-muted-foreground line-clamp-3">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="inline-flex items-center rounded-full bg-[var(--kenya-green)]/10 px-2 py-1 text-xs font-medium text-[var(--kenya-green)]">
                            <Briefcase className="h-3 w-3 mr-1" /> {job.type}
                          </span>
                          {job.salary_range && (
                            <span className="inline-flex items-center rounded-full bg-[var(--kenya-black)]/10 px-2 py-1 text-xs font-medium text-[var(--kenya-black)]">
                              {job.salary_range}
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full bg-[var(--kenya-red)]/10 px-2 py-1 text-xs font-medium text-[var(--kenya-red)]">
                            <Clock className="h-3 w-3 mr-1" /> New
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button
                        className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white"
                        asChild
                      >
                        <a href={job.url} target="_blank" rel="noopener noreferrer">
                          View Details
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination placeholder */}
          {filteredJobs && filteredJobs.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button size="sm" className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Next
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
  );
}
