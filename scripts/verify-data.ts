import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function verifyData() {
  try {
    // Get companies count
    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*');
    
    if (companiesError) {
      console.error('Error fetching companies:', companiesError);
      return;
    }

    console.log(`Found ${companies.length} companies:`);
    companies.forEach(company => {
      console.log(`- ${company.name} (${company.industry})`);
    });

    // Get jobs count and details
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          name
        )
      `);
    
    if (jobsError) {
      console.error('Error fetching jobs:', jobsError);
      return;
    }

    console.log(`\nFound ${jobs.length} jobs:`);
    jobs.forEach(job => {
      console.log(`- ${job.title} at ${job.companies?.name} (${job.type}, ${job.status})`);
    });

  } catch (error) {
    console.error('Error verifying data:', error);
  }
}

verifyData();
