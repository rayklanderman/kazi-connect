import apiClient from '../api';

export interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'guide';
  url: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const resourcesService = {
  async getResources(): Promise<Resource[]> {
    const { data } = await apiClient.get<Resource[]>('/resources');
    return data;
  },

  async getResource(id: string): Promise<Resource> {
    const { data } = await apiClient.get<Resource>(`/resources/${id}`);
    return data;
  },

  async createResource(resourceData: Omit<Resource, '_id' | 'createdAt' | 'updatedAt'>): Promise<Resource> {
    const { data } = await apiClient.post<Resource>('/resources', resourceData);
    return data;
  },

  async updateResource(id: string, resourceData: Partial<Resource>): Promise<Resource> {
    const { data } = await apiClient.put<Resource>(`/resources/${id}`, resourceData);
    return data;
  },

  async deleteResource(id: string): Promise<void> {
    await apiClient.delete(`/resources/${id}`);
  },
};
