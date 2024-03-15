import 'dotenv/config'
import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_SERVICE_KEY || !process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_SERVICE_KEY or SUPABASE_URL is not defined in the environment variables.');
}

const key = process.env.SUPABASE_SERVICE_KEY
const connectionString = process.env.SUPABASE_URL;

let supabase;
try {
    supabase = createClient(connectionString, key);

    if (supabase.auth && supabase.storage) {
        console.log('Connection successful!')
    } else {
        console.log('Connection failed.')
    }
} catch (err) {
    console.log(err)
}

module.exports = supabase;

