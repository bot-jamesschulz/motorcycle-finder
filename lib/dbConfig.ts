import 'dotenv/config'
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types'

let Supabase: SupabaseClient<Database> | undefined;

try { 
    console.log('Keys', process.env.SUPABASE_SERVICE_KEY, process.env.SUPABASE_URL)
    if (!process.env.SUPABASE_SERVICE_KEY || !process.env.SUPABASE_URL) {
        throw new Error('SUPABASE_SERVICE_KEY or SUPABASE_URL is not defined in the environment variables.');
    }
     
    const key = process.env.SUPABASE_SERVICE_KEY
    const connectionString = process.env.SUPABASE_URL;

    Supabase = createClient<Database>(connectionString, key);
} catch (err) {
    console.log('Error connecting to supbase', err)
}

export default Supabase;

