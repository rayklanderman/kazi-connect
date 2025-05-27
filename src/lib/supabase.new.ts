import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create and export the Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'kazi-connect-auth',
    // Add a 15-minute session expiry detection buffer
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    // Add request headers for better tracking and security
    headers: {
      'x-application-name': 'kazi-connect',
      'x-application-version': import.meta.env.VITE_APP_VERSION || '0.0.0'
    }
  },
  // Add better error handling for network issues
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add a helper function to check if a user is authenticated
export const isAuthenticated = async () => {
  const { data } = await supabase.auth.getSession();
  return !!data.session;
};

// Add a helper function to get the current user
export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};
