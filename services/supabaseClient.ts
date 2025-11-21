import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.info('[Supabase] VITE_SUPABASE_URL =', supabaseUrl || 'undefined');
console.info('[Supabase] VITE_SUPABASE_ANON_KEY =', supabaseKey ? '***present***' : 'undefined');

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
    return Boolean(supabaseUrl && supabaseKey);
}