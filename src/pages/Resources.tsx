import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resourcesService, type Resource } from '@/lib/services/resources.service';
import { useToast } from '@/components/ui/use-toast';

export default function Resources() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resources, isLoading, error } = useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: resourcesService.getResources,
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch resources',
        variant: 'destructive',
      });
    }
  });

  const filteredResources = resources?.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Learning Resources</h1>

        {/* Search box */}
        <div className="relative max-w-2xl">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                className="pl-10"
                placeholder="Search by title, description, or type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource listings */}
      {isLoading ? (
        <div>Loading resources...</div>
      ) : error ? (
        <div className="text-destructive">Error loading resources</div>
      ) : filteredResources?.length === 0 ? (
        <div>No resources found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources?.map((resource) => (
            <div
              key={resource.id}
              className="bg-card rounded-lg shadow p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {resource.description}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {resource.type}
                  </span>
                  <Button variant="outline" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      View Resource
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
