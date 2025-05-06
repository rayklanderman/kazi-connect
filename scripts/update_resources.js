// scripts/update_resources.js
import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  {
    title: 'VS Code Productivity Tips',
    url: 'https://code.visualstudio.com/docs'
  },
  {
    title: 'The Complete Guide to React',
    url: 'https://react.dev/learn'
  },
  {
    title: 'Modern JavaScript Fundamentals',
    url: 'https://javascript.info/'
  },
  {
    title: 'Building a Professional Developer Portfolio',
    url: 'https://www.freecodecamp.org/news/developer-portfolio/'
  },
  {
    title: 'How to Ace Your Technical Interview',
    url: 'https://www.interviewbit.com/guide/'
  }
];

async function updateResources() {
  for (const { title, url } of updates) {
    const { error } = await supabase
      .from('resources')
      .update({ url })
      .eq('title', title);
    if (error) {
      console.error(`Failed to update ${title}:`, error.message);
    } else {
      console.log(`Updated ${title}`);
    }
  }
  process.exit(0);
}

updateResources();
