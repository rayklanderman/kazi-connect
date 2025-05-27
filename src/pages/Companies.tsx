import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Building2, MapPin, Globe, Users, Briefcase } from 'lucide-react';
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
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-[var(--kenya-green)]/10 to-[var(--kenya-black)]/5 rounded-xl p-6 md:p-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--kenya-black)]">Top Kenyan Employers</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">Discover leading companies in Kenya and explore career opportunities with top employers across various industries.</p>
        
        {/* Search box */}
        <div className="relative max-w-2xl">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
              <Input
                type="text"
                className="pl-10 border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                placeholder="Search by company name or industry"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Company listings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[var(--kenya-black)]">Featured Companies</h2>
          <div className="text-sm text-muted-foreground">
            {filteredCompanies?.length || 0} companies found
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[var(--kenya-green)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading top Kenyan employers...</p>
          </div>
        ) : error ? (
          <div className="bg-[var(--kenya-red)]/10 text-[var(--kenya-red)] p-4 rounded-lg">
            <p className="font-medium">Error loading companies</p>
            <p className="text-sm mt-1">Please try again later or contact support if the problem persists.</p>
          </div>
        ) : filteredCompanies?.length === 0 ? (
          <div className="bg-[var(--kenya-black)]/5 p-8 rounded-lg text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No companies found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies?.map((company) => (
              <div
                key={company.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-l-[var(--kenya-green)]"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--kenya-black)] hover:text-[var(--kenya-green)] transition-colors">{company.name}</h3>
                      <div className="flex items-center mt-1">
                        <Briefcase className="h-4 w-4 text-[var(--kenya-green)] mr-1" />
                        <span className="text-muted-foreground">{company.industry}</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-full p-1 shadow-sm border border-[var(--kenya-green)]/10">
                      <img
                        src={company.logo && company.logo.trim() !== '' ? company.logo : '/default-logo.png'}
                        alt={`${company.name} logo`}
                        className="w-14 h-14 object-contain"
                        onError={(e) => {
                          // Only set to default if not already the default
                          if (!e.currentTarget.src.endsWith('/default-logo.png')) {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/default-logo.png';
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {company.size && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="h-4 w-4 mr-2 text-[var(--kenya-green)]" />
                        <span>{company.size}</span>
                      </div>
                    )}
                    
                    {company.location && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 text-[var(--kenya-green)]" />
                        <span>{company.location || 'Kenya'}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    {company.website ? (
                      <Button 
                        className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white gap-2"
                        asChild
                      >
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" /> Visit Website
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" disabled>
                        <Globe className="h-4 w-4 mr-2" /> Visit Website
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
