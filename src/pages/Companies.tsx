import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { companiesService, type Company } from '@/lib/services';
import { useToast } from '@/components/ui/use-toast';
import { Search } from 'lucide-react';

export default function Companies() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: companies, isLoading, error } = useQuery<Company[], Error>({
    queryKey: ['companies'],
    queryFn: companiesService.getCompanies,
  });

  if (error) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to fetch companies',
      variant: 'destructive',
    });
  }

  const filteredCompanies = companies?.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Browse Companies</h1>

          {/* Search box */}
          <div className="relative max-w-2xl mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                className="pl-10"
                placeholder="Search by company name, industry, or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                key={company._id}
                className="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <div className="h-14 w-14 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt={company.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-1">{company.name}</h3>
                <p className="text-muted-foreground mb-2">{company.industry}</p>
                <p className="text-sm mb-4">{company.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {company.location}
                  </span>
                  {company.size && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                      {company.size} employees
                    </span>
                  )}
                </div>
                <Button variant="outline" className="w-full">
                  View Company
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
