import { createClient } from '@supabase/supabase-js';

// Vite must prefix environment variables with VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safety check (helps debug misconfigured .env)
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        "❌ Missing Supabase ENV variables. Check VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env"
    );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
