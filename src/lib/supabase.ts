import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string, fallback: string) => {
  const value = import.meta.env[key];
  if (!value || typeof value !== 'string' || value.trim() === '' || value.includes('MY_') || value.includes('TODO')) {
    return fallback;
  }
  return value.trim();
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', 'https://ocflxmmcowirmqwdixlp.supabase.co');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9jZmx4bW1jb3dpcm1xd2RpeGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTM4NDYsImV4cCI6MjA5MDY4OTg0Nn0.RUPALkd_8XPYy7sjDo4RcNK0eQw6ZySARS1672eiuzU');

if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_URL.includes('MY_')) {
  console.warn('Supabase environment variables contain placeholders. Using provided default values.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
