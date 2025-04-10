import apiClient from '../api';

export interface Company {
  _id: string;
  name: string;
  industry: string;
  description: string;
  logo?: string;
  location: string;
  website?: string;
  size?: string;
  founded?: number;
}

export const companiesService = {
  async getCompanies(): Promise<Company[]> {
    const { data } = await apiClient.get<Company[]>('/companies');
    return data;
  },

  async getCompany(id: string): Promise<Company> {
    const { data } = await apiClient.get<Company>(`/companies/${id}`);
    return data;
  },

  async createCompany(companyData: Omit<Company, '_id'>): Promise<Company> {
    const { data } = await apiClient.post<Company>('/companies', companyData);
    return data;
  },

  async updateCompany(id: string, companyData: Partial<Company>): Promise<Company> {
    const { data } = await apiClient.put<Company>(`/companies/${id}`, companyData);
    return data;
  },

  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`/companies/${id}`);
  },
};
