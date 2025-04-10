import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: resolve(__dirname, '.env') });

// Initialize Supabase client with service role key
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Import sources
import { sources } from './seed-sources.js';

const getRandomItem = <T>(array: readonly T[]): T => 
  array[Math.floor(Math.random() * array.length)];

const generateDescription = (title: string, company: string, location: string) => `
We are looking for a ${title} to join our team at ${company} in ${location}. 
The ideal candidate will have strong skills in their field and a passion for excellence.
`;

const generateRequirements = (industry: string) => [
  'Bachelor\'s degree in a relevant field',
  `${getRandomItem([2, 3, 4, 5])}+ years of experience in ${industry}`,
  'Strong communication and interpersonal skills',
  'Ability to work independently and in a team',
  'Excellent problem-solving abilities'
];

async function seedFallbackData() {
  try {
    // Sample company names
    const companyNames = [
      'Pesapal',
      'Craft Silicon',
      'Ushahidi',
      'Jumo World',
      'Samasource',
      'Sanergy',
      'Mobius Motors',
      'Kobo360',
      'Kytabu',
      'Fuzu'
    ];

    // Sample job titles
    const jobTitles = [
      'Software Engineer',
      'Account Manager',
      'Marketing Specialist',
      'Operations Manager',
      'Financial Analyst',
      'HR Manager',
      'Sales Representative',
      'Project Manager',
      'Business Analyst',
      'Product Manager'
    ];

    console.log('Starting fallback data seeding...');

    // Insert companies
    for (const name of companyNames) {
      const company = {
        name,
        description: `${name} is a leading company in the ${getRandomItem([...sources.industries])} sector.`,
        industry: getRandomItem([...sources.industries]),
        size: getRandomItem([...sources.companySizes]),
        location: getRandomItem([...sources.locations]),
        website: `https://www.${name.toLowerCase().replace(/\s+/g, '')}.co.ke`
      };

      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([company])
        .select()
        .single();

      if (companyError) {
        console.error(`Error inserting company ${name}:`, companyError);
        continue;
      }

      console.log(`Created company: ${name}`);

      // Create 2-4 jobs for each company
      const numJobs = Math.floor(Math.random() * 3) + 2;
      for (let i = 0; i < numJobs; i++) {
        const title = getRandomItem(jobTitles);
        const location = getRandomItem([...sources.locations]);
        const salaryRange = getRandomItem([...sources.salaryRanges]);

        const job = {
          title,
          company_id: companyData.id,
          description: generateDescription(title, name, location),
          requirements: generateRequirements(company.industry),
          type: getRandomItem([...sources.jobTypes]) as 'full-time' | 'part-time' | 'contract' | 'internship',
          location,
          salary_range: `KES ${salaryRange.min} - ${salaryRange.max}`,
          status: 'active' as 'active' | 'closed'
        };

        // Insert job
        const { error: jobError } = await supabase.from('jobs').insert(job);
        if (jobError) {
          console.error(`Error inserting job ${title} for ${name}:`, jobError);
          continue;
        }

        console.log(`Created job: ${title} for ${name}`);
      }
    }

    console.log('Fallback data seeding completed successfully');
  } catch (error) {
    console.error('Error in fallback seeding:', error);
  }
}

// Run the seeding
seedFallbackData();
