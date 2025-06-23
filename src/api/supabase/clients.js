import { supabase } from '../../lib/supabaseClient';

export async function createClient(data) {
  const { data: result, error } = await supabase
    .from('clients')
    .insert([data]);
  return { result, error };
} 