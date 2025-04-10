import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

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

async function resetJobsTable() {
  try {
    // Drop existing jobs table
    const { error: dropError } = await supabase.rpc('drop_jobs_table');
    if (dropError) {
      console.error('Error dropping jobs table:', dropError);
      return;
    }

    // Create new jobs table
    const { error: createError } = await supabase.rpc('create_jobs_table');
    if (createError) {
      console.error('Error creating jobs table:', createError);
      return;
    }

    console.log('Jobs table reset successfully');
  } catch (error) {
    console.error('Error resetting jobs table:', error);
  }
}

resetJobsTable();
