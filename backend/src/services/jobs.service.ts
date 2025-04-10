import { supabase } from '../config/supabase';

export interface Job {
  id: string;
  title: string;
  company_id: string;
  description: string;
  requirements: string[];
  location: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface CreateJobData {
  title: string;
  company_id: string;
  description: string;
  requirements?: string[];
  location: string;
  salary_min: number;
  salary_max: number;
  salary_currency?: string;
  type: Job['type'];
  status?: Job['status'];
}

export const jobsService = {
  async getJobs() {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          name,
          logo
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getJob(id: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          name,
          logo,
          industry,
          size,
          location,
          website
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createJob(job: CreateJobData) {
    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateJob(id: string, job: Partial<CreateJobData>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJob(id: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
