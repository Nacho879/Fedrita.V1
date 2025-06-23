import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dkevgufytjnrdpcpgwmd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrZXZndWZ5dGpucmRwY3Bnd21kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMDIxMjAsImV4cCI6MjA2NDc3ODEyMH0.LQ5wRz_Gk5zggeevSTAd1h9PKLpj536uD0c7HBRkHQw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);