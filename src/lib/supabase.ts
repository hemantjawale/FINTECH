import { createClient } from '@supabase/supabase-js';

// In a real app we'd use import.meta.env, but these are placeholders since none were provided.
// The user should replace these with their own Supabase keys later.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock_anon_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
