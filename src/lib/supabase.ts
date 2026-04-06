import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ocflxmmcowirmqwdixlp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZmx4bW1jb3dpcm1xd2RpeGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTM4NDYsImV4cCI6MjA5MDY4OTg0Nn0.RUPALkd_8XPYy7sjDo4RcNK0eQw6ZySARS1672eiuzU';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Supabase environment variables are missing in import.meta.env. Using provided default values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
