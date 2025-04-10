import apiClient from '../api';

export interface Job {
  _id: string;
  title: string;
  company: {
    _id: string;
    name: string;
    logo?: string;
  };
  description: string;
  requirements: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'active' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobData {
  title: string;
  company: string; // company ID
  description: string;
  requirements: string[];
  location: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
}

export const jobsService = {
  async getJobs(): Promise<Job[]> {
    const { data } = await apiClient.get<Job[]>('/jobs');
    return data;
  },

  async getJob(id: string): Promise<Job> {
    const { data } = await apiClient.get<Job>(`/jobs/${id}`);
    return data;
  },

  async createJob(jobData: CreateJobData): Promise<Job> {
    const { data } = await apiClient.post<Job>('/jobs', jobData);
    return data;
  },

  async updateJob(id: string, jobData: Partial<CreateJobData>): Promise<Job> {
    const { data } = await apiClient.put<Job>(`/jobs/${id}`, jobData);
    return data;
  },
};
