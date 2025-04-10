import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { resourcesService, type Resource } from '@/lib/services';
import { useToast } from '@/components/ui/use-toast';
import { Book, Video, FileText, Globe, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type ResourceType = 'all' | 'article' | 'video' | 'template' | 'guide';

export default function Resources() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ResourceType>('all');

  const { data: resources, isLoading, error } = useQuery<Resource[], Error>({
    queryKey: ['resources'],
    queryFn: resourcesService.getResources,
  });

  if (error) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to fetch resources',
      variant: 'destructive',
    });
  }

  const filteredResources = resources?.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || resource.type === selectedType;

    return matchesSearch && matchesType;
  });

  const resourceTypeIcons = {
    article: Book,
    video: Video,
    template: FileText,
    guide: Globe,
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">Career Resources</h1>
          <p className="text-lg mb-8">
            Explore our collection of resources designed to help you develop your skills, 
            prepare for interviews, and advance your career.
          </p>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              className="pl-10"
              placeholder="Search resources by title or description"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as ResourceType)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="article">Articles</TabsTrigger>
              <TabsTrigger value="video">Videos</TabsTrigger>
              <TabsTrigger value="template">Templates</TabsTrigger>
              <TabsTrigger value="guide">Guides</TabsTrigger>
            </TabsList>
          </Tabs>
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
            {filteredResources?.map((resource) => {
              const Icon = resourceTypeIcons[resource.type];
              return (
                <Card key={resource._id}>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {Icon && <Icon className="h-5 w-5 text-primary" />}
                      <Badge variant="secondary">{resource.type}</Badge>
                    </div>
                    <CardTitle>{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        View Resource
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
