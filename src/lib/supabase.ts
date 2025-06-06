import { createClient } from '@supabase/supabase-js';

/**
 * Secure Supabase client configuration with proper environment variable handling,
 * authentication flow, and security headers.
 */

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate URL format to prevent security issues
const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'https:'; // Ensure HTTPS only
  } catch (e) {
    return false;
  }
};

if (!isValidUrl(supabaseUrl)) {
  throw new Error('Invalid Supabase URL. Must be a valid HTTPS URL.');
}

// Create and export the Supabase client with enhanced security configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'kazi-connect-auth',
    // Use PKCE flow for enhanced security
    detectSessionInUrl: true,
    flowType: 'pkce'
    // Note: cookieOptions removed as it's not supported in the current version
  },
  global: {
    // Add request headers for better tracking and security
    headers: {
      'x-application-name': 'kazi-connect',
      'x-application-version': import.meta.env.VITE_APP_VERSION || '0.0.0',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'DENY'
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
