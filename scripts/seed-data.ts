import { chromium } from 'playwright';
import { supabase } from '../src/lib/supabase';

interface JobData {
  title: string;
  company_id: string;
  description: string;
  requirements: string[];
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  location: string;
  salary?: {
    currency: string;
    min: number;
    max: number;
  };
  status: 'active' | 'closed';
}

interface CompanyData {
  name: string;
  logo?: string;
  description: string;
  size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  industry: string;
  website?: string;
  location: string;
}

async function scrapeJobs(page: number = 1): Promise<{ jobs: JobData[], companies: CompanyData[] }> {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // BrighterMonday Kenya jobs page
  await page.goto(`https://www.brightermonday.co.ke/jobs?page=${page}`);

  const jobs: JobData[] = [];
  const companies: CompanyData[] = new Map();

  // Extract job listings
  const listings = await page.$$('div[data-job-listing]');
  
  for (const listing of listings) {
    try {
      const title = await listing.$eval('h3', el => el.textContent?.trim() || '');
      const companyName = await listing.$eval('[data-company-name]', el => el.textContent?.trim() || '');
      const location = await listing.$eval('[data-location]', el => el.textContent?.trim() || '');
      const type = await listing.$eval('[data-job-type]', el => el.textContent?.toLowerCase() || 'full-time');
      
      // Click to get full job details
      await listing.click();
      await page.waitForSelector('[data-job-description]');
      
      const description = await page.$eval('[data-job-description]', el => el.textContent?.trim() || '');
      const requirements = await page.$$eval('[data-requirements] li', els => 
        els.map(el => el.textContent?.trim() || '')
      );

      // Get company details
      const companyLogo = await listing.$eval('img[data-company-logo]', el => el.getAttribute('src') || undefined);
      const industry = await page.$eval('[data-company-industry]', el => el.textContent?.trim() || 'Technology');
      
      // Add company if not already added
      if (!companies.has(companyName)) {
        companies.set(companyName, {
          name: companyName,
          logo: companyLogo,
          description: `${companyName} is a company based in ${location}.`,
          size: '11-50',
          industry,
          location: 'Nairobi, Kenya',
        });
      }

      jobs.push({
        title,
        company_id: '', // Will be set after company is created
        description,
        requirements,
        type: type as 'full-time',
        location,
        status: 'active',
      });
    } catch (error) {
      console.error('Error processing job listing:', error);
    }
  }

  await browser.close();
  return { 
    jobs, 
    companies: Array.from(companies.values())
  };
}

async function seedDatabase() {
  try {
    // Scrape first 5 pages
    for (let page = 1; page <= 5; page++) {
      const { jobs, companies } = await scrapeJobs(page);
      
      // Insert companies
      for (const company of companies) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .insert([company])
          .select()
          .single();

        if (companyError) {
          console.error('Error inserting company:', companyError);
          continue;
        }

        // Insert jobs for this company
        const companyJobs = jobs.filter(job => 
          job.title.toLowerCase().includes(company.name.toLowerCase())
        );

        for (const job of companyJobs) {
          job.company_id = companyData.id;
          const { error: jobError } = await supabase
            .from('jobs')
            .insert([job]);

          if (jobError) {
            console.error('Error inserting job:', jobError);
          }
        }
      }

      console.log(`Processed page ${page}`);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding
seedDatabase();
