import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { companiesService, type Company } from '@/lib/services/companies.service';
import { useToast } from '@/components/ui/use-toast';

export default function Companies() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: companies, isLoading, error } = useQuery<Company[], Error>({
    queryKey: ['companies'],
    queryFn: companiesService.getCompanies,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch companies',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Only include companies with a valid website/career/vacancy link
  const filteredCompanies = companies?.filter((company) =>
    (company.website && company.website.startsWith('http')) &&
    (company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Companies</h1>

        {/* Search box */}
        <div className="relative max-w-2xl">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                className="pl-10"
                placeholder="Search by company name or industry"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company listings */}
      {isLoading ? (
        <div>Loading companies...</div>
      ) : error ? (
        <div className="text-destructive">Error loading companies</div>
      ) : filteredCompanies?.length === 0 ? (
        <div>No companies found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies?.map((company) => (
            <div
              key={company.id}
              className="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{company.name}</h3>
                    <p className="text-muted-foreground">{company.industry}</p>
                  </div>
                  <img
                    src={company.logo && company.logo.trim() !== '' ? company.logo : '/default-logo.png'}
                    alt={`${company.name} logo`}
                    className="w-12 h-12 object-contain"
                    style={{ background: '#fff' }}
                    onError={(e) => {
                      // Only set to default if not already the default
                      if (!e.currentTarget.src.endsWith('/default-logo.png')) {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/default-logo.png';
                      }
                    }}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {company.size || 'Size not specified'}
                  </span>
                  {company.website ? (
                    <Button variant="outline" asChild>
                      <a href={company.website} target="_blank" rel="noopener noreferrer">
                        Visit Site
                      </a>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>Visit Site</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
