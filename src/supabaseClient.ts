import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials are missing. Check .env for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  throw new Error('Supabase credentials are not set in .env');
}

console.log('Supabase URL loaded:', supabaseUrl?.startsWith('https://') ? supabaseUrl : 'INVALID');
console.log('Supabase anon key loaded:', supabaseAnonKey ? 'present' : 'missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
