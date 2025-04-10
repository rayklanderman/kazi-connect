import { supabase } from '../config/supabase';

export interface Company {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  industry: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  location: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCompanyData {
  name: string;
  description: string;
  logo?: string;
  website?: string;
  industry: string;
  size: Company['size'];
  location: string;
}

export const companiesService = {
  async getCompanies() {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getCompany(id: string) {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createCompany(company: CreateCompanyData) {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCompany(id: string, company: Partial<CreateCompanyData>) {
    const { data, error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCompany(id: string) {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};
