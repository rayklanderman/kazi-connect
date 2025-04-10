import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL() {
  try {
    const sql = readFileSync(resolve(__dirname, 'reset-jobs.sql'), 'utf8');
    
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }

    console.log('SQL executed successfully');
  } catch (error) {
    console.error('Error running SQL:', error);
  }
}

runSQL();
