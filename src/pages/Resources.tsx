import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, BookOpen, ExternalLink, Tag, FileText, Video, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resourcesService, type Resource } from '@/lib/services/resources.service';
import { useToast } from '@/components/ui/use-toast';

export default function Resources() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: resources, isLoading, error } = useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: resourcesService.getResources
  });
  
  // Handle error separately
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch resources',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Filter resources based on search query
  const filteredResources = resources ? resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.type.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Hero section */}
      <div className="bg-gradient-to-r from-[var(--kenya-green)]/10 to-[var(--kenya-black)]/5 rounded-xl p-6 md:p-10 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--kenya-black)]">Career Resources</h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">Explore our collection of resources to help you grow professionally in the Kenyan job market. From interview tips to industry insights, we've got you covered.</p>
        
        {/* Search box */}
        <div className="relative max-w-2xl">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--kenya-green)]" />
              <Input
                type="text"
                className="pl-10 border-[var(--kenya-green)]/20 focus:border-[var(--kenya-green)] focus:ring-[var(--kenya-green)]"
                placeholder="Search by title, description, or type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource listings */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-[var(--kenya-black)]">Available Resources</h2>
          <div className="text-sm text-muted-foreground">
            {filteredResources?.length || 0} resources found
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-[var(--kenya-green)] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-muted-foreground">Loading career resources...</p>
          </div>
        ) : error ? (
          <div className="bg-[var(--kenya-red)]/10 text-[var(--kenya-red)] p-4 rounded-lg">
            <p className="font-medium">Error loading resources</p>
            <p className="text-sm mt-1">Please try again later or contact support if the problem persists.</p>
          </div>
        ) : filteredResources?.length === 0 ? (
          <div className="bg-[var(--kenya-black)]/5 p-8 rounded-lg text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No resources found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources?.map((resource) => {
              // Determine icon based on resource type
              let TypeIcon = BookOpen;
              if (resource.type.toLowerCase().includes('video')) TypeIcon = Video;
              else if (resource.type.toLowerCase().includes('article')) TypeIcon = FileText;
              else if (resource.type.toLowerCase().includes('website')) TypeIcon = Globe;
              
              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-l-4 border-l-[var(--kenya-green)]"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="bg-[var(--kenya-green)]/10 p-2 rounded-lg">
                        <TypeIcon className="h-6 w-6 text-[var(--kenya-green)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--kenya-black)] hover:text-[var(--kenya-green)] transition-colors">
                          {resource.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <Tag className="h-3 w-3 text-[var(--kenya-green)] mr-1" />
                          <span className="text-xs text-[var(--kenya-green)]">{resource.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        className="bg-[var(--kenya-green)] hover:bg-[var(--kenya-green)]/90 text-white gap-2"
                        asChild
                      >
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" /> View Resource
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
