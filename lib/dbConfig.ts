import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types'

let Supabase: SupabaseClient<Database> | undefined;

try { 
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
        throw new Error('SUPABASE_SERVICE_KEY or SUPABASE_URL is not defined.');
    }
     
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const connectionString = process.env.NEXT_PUBLIC_SUPABASE_URL;

    Supabase = createClient<Database>(connectionString, key);
} catch (err) {
    console.log('Error connecting to supbase', err)
}

export default Supabase;

