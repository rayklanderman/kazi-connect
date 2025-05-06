import { supabase } from '../supabase';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool';
  created_at: string;
}

export interface CreateResourceData {
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool';
}

export const resourcesService = {
  getResources: async (): Promise<Resource[]> => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('title', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  getResource: async (id: string): Promise<Resource> => {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Resource not found');
    }

    return data;
  },

  createResource: async (resourceData: CreateResourceData): Promise<Resource> => {
    const { data, error } = await supabase
      .from('resources')
      .insert([resourceData])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create resource');
    }

    return data;
  },

  updateResource: async (id: string, resourceData: Partial<CreateResourceData>): Promise<Resource> => {
    const { data, error } = await supabase
      .from('resources')
      .update(resourceData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Resource not found');
    }

    return data;
  },

  deleteResource: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
