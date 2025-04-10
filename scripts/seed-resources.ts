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

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedResources() {
  console.log('Starting resources data seeding...');

  try {
    const resources = [
      {
        title: 'How to Ace Your Technical Interview',
        description: 'A comprehensive guide to preparing for and succeeding in technical interviews.',
        url: 'https://example.com/tech-interview-guide',
        type: 'article'
      },
      {
        title: 'Building a Professional Developer Portfolio',
        description: 'Learn how to create a standout portfolio that showcases your skills.',
        url: 'https://example.com/portfolio-guide',
        type: 'course'
      },
      {
        title: 'Modern JavaScript Fundamentals',
        description: 'Master the core concepts of modern JavaScript programming.',
        url: 'https://example.com/js-fundamentals',
        type: 'video'
      },
      {
        title: 'The Complete Guide to React',
        description: 'Everything you need to know about building applications with React.',
        url: 'https://example.com/react-guide',
        type: 'book'
      },
      {
        title: 'VS Code Productivity Tips',
        description: 'Essential VS Code extensions and shortcuts for developers.',
        url: 'https://example.com/vscode-tips',
        type: 'tool'
      }
    ];

    for (const resource of resources) {
      const { data, error } = await supabase
        .from('resources')
        .insert([resource])
        .select()
        .single();

      if (error) {
        console.error(`Error inserting resource ${resource.title}:`, error);
        continue;
      }

      console.log(`Created resource: ${data.title}`);
    }

    console.log('Resources data seeding completed successfully');
  } catch (error) {
    console.error('Error seeding resources:', error);
  }
}

seedResources();
