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
      persistSession: false
    }
  }
);
