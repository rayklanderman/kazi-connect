import { supabase } from '../supabase';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  industry: string;
  website?: string;
  location: string;
  created_at: string;
}

export const companiesService = {
  getCompanies: async (): Promise<Company[]> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  getCompany: async (id: string): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Company not found');
    }

    return data;
  },

  createCompany: async (company: Omit<Company, 'id' | 'created_at'>): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .insert([company])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Failed to create company');
    }

    return data;
  },

  updateCompany: async (id: string, company: Partial<Omit<Company, 'id' | 'created_at'>>): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Company not found');
    }

    return data;
  },

  deleteCompany: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};
