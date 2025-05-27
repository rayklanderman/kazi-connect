import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  session: any | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<{ confirmEmail: boolean }>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isAuthenticated: false,

      signIn: async (email: string, password: string) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            if (error.message.includes('Email not confirmed')) {
              throw new Error(
                'Please check your email for a confirmation link to activate your account.'
              );
            }
            throw new Error(error.message);
          }

          if (!data?.user) {
            throw new Error('No user data returned');
          }

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            throw new Error('Failed to fetch user profile');
          }

          set({
            user: {
              id: data.user.id,
              email: data.user.email!,
              name: profile.name,
              role: profile.role,
            },
            session: data.session,
            isAuthenticated: true,
          });
        } catch (error: any) {
          const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
          if (isDebugMode) {
            console.error('Sign in error:', error);
          }
          throw error;
        }
      },

      signUp: async (email: string, password: string, name: string) => {
        try {
          // Step 1: Sign up the user
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            throw new Error(error.message);
          }

          if (!data?.user) {
            throw new Error('No user data returned');
          }

          // Step 2: Create the user profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: data.user.id,
                name,
                role: 'user',
              },
            ], {
              onConflict: 'id'
            });

          if (profileError) {
            const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
            if (isDebugMode) {
              console.error('Profile creation error:', profileError);
            }
            // Don't throw here, as the user is already created
          }

          // Check if email confirmation is required
          const confirmEmail = data.session === null;

          // Only set the auth state if email confirmation is not required
          if (!confirmEmail) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                name,
                role: 'user',
              },
              session: data.session,
              isAuthenticated: true,
            });
          }

          return { confirmEmail };
        } catch (error: any) {
          const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
          if (isDebugMode) {
            console.error('Sign up error:', error);
          }
          throw error;
        }
      },

      signOut: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) {
            throw new Error(error.message);
          }

          set({
            user: null,
            session: null,
            isAuthenticated: false,
          });
        } catch (error: any) {
          const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
          if (isDebugMode) {
            console.error('Sign out error:', error);
          }
          throw error;
        }
      },

      getSession: async () => {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            throw new Error(error.message);
          }

          if (session) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profileError) {
              throw new Error('Failed to fetch user profile');
            }

            set({
              user: {
                id: session.user.id,
                email: session.user.email!,
                name: profile.name,
                role: profile.role,
              },
              session,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          const isDebugMode = import.meta.env.VITE_DEBUG_MODE === 'true';
          if (isDebugMode) {
            console.error('Get session error:', error);
          }
          // Don't throw here to allow the app to continue even if session retrieval fails
          // This prevents login loops when there are temporary auth issues
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
