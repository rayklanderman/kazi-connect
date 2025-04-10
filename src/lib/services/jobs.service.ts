import { supabase } from '../supabase';

export interface Salary {
  currency: string;
  min: number;
  max: number;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
}

export interface Job {
  id: string;
  title: string;
  company?: Company;
  company_id?: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  salary_range?: string;
  status: 'active' | 'closed';
  created_at: string;
}

export interface CreateJobData {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  location: string;
  salary_range: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export const jobsService = {
  getJobs: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies (
          id,
          name,
          logo
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  getJob: async (id: string): Promise<Job> => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        company:companies (
          id,
          name,
          logo
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Job not found');
    }

    return data;
  },

  createJob: async (jobData: CreateJobData): Promise<Job> => {
    const job: Omit<Job, 'id' | 'created_at' | 'company'> = {
      title: jobData.title,
      company_id: jobData.company,
      description: jobData.description,
      requirements: jobData.requirements,
      location: jobData.location,
      salary_range: jobData.salary_range,
      type: jobData.type,
      status: 'active',
    };

    const { data, error } = await supabase
      .from('jobs')
      .insert([job])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create job');
    }

    return data;
  },

  updateJob: async (id: string, jobData: Partial<CreateJobData>): Promise<Job> => {
    const job: Partial<Omit<Job, 'company'>> = {
      title: jobData.title,
      company_id: jobData.company,
      description: jobData.description,
      requirements: jobData.requirements,
      location: jobData.location,
      salary_range: jobData.salary_range,
      type: jobData.type,
    };

    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Job not found');
    }

    return data;
  },

  deleteJob: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
