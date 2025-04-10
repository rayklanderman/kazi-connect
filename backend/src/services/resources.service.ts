import { supabase } from '../config/supabase';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool';
  url: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateResourceData {
  title: string;
  description: string;
  type: Resource['type'];
  url: string;
  tags?: string[];
}

export const resourcesService = {
  async getResources() {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getResourcesByType(type: Resource['type']) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('type', type)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getResource(id: string) {
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createResource(resource: CreateResourceData) {
    const { data, error } = await supabase
      .from('resources')
      .insert([resource])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateResource(id: string, resource: Partial<CreateResourceData>) {
    const { data, error } = await supabase
      .from('resources')
      .update(resource)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteResource(id: string) {
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
