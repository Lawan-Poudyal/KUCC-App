import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';

// load env immediately
dotenv.config();

// config/supabase.js (BACKEND ONLY)

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
       detectSessionInUrl: false
    },
     global: {
      headers: {
        'x-application-name': 'kucc-admin-backend'
      },
       fetch: (url, options = {}) => {
        // Custom fetch with 30-second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.error('[SUPABASE] Request timeout after 30s:', url);
          controller.abort();
        }, 30000);

        return fetch(url, {
          ...options,
          signal: controller.signal,
        }).finally(() => {
          clearTimeout(timeoutId);
        });
      },
    },
  }
);
// Test connection on startup
console.log('🔗 Supabase client initialized');