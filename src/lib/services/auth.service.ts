import apiClient from '../api';
import { useAuthStore } from '../store/auth.store';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    useAuthStore.getState().setAuth(
      { _id: data._id, name: data.name, email: data.email },
      data.token
    );
    return data;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    useAuthStore.getState().setAuth(
      { _id: data._id, name: data.name, email: data.email },
      data.token
    );
    return data;
  },

  logout() {
    useAuthStore.getState().clearAuth();
  },

  isAuthenticated(): boolean {
    return !!useAuthStore.getState().token;
  },
};
