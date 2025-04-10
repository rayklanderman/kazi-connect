import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import User from '../models/User';
import Job from '../models/Job';
import Company from '../models/Company';
import Resource from '../models/Resource';

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Company.deleteMany({}),
      Resource.deleteMany({}),
    ]);

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'user',
    });

    // Create test companies
    const companies = await Company.create([
      {
        name: 'TechHub Kenya',
        industry: 'Technology',
        description: 'Leading software development company in Kenya',
        location: 'Nairobi',
        size: '51-200',
        website: 'https://techhub.co.ke',
      },
      {
        name: 'Coastal Brands Ltd',
        industry: 'Marketing',
        description: 'Marketing agency specializing in hospitality sector',
        location: 'Mombasa',
        size: '11-50',
        website: 'https://coastalbrands.co.ke',
      },
    ]);

    // Create test jobs
    await Job.create([
      {
        title: 'Senior Software Engineer',
        company: companies[0]._id,
        description: 'Looking for an experienced software engineer to join our team',
        requirements: [
          'Bachelor\'s degree in Computer Science or related field',
          '5+ years of experience in software development',
          'Strong knowledge of JavaScript/TypeScript',
        ],
        type: 'full-time',
        location: 'Nairobi',
        salary: {
          min: 150000,
          max: 250000,
          currency: 'KES',
        },
        status: 'active',
      },
      {
        title: 'Marketing Manager',
        company: companies[1]._id,
        description: 'Seeking a marketing manager to lead our digital campaigns',
        requirements: [
          'Bachelor\'s degree in Marketing or related field',
          '3+ years of experience in digital marketing',
          'Experience with social media marketing',
        ],
        type: 'full-time',
        location: 'Mombasa',
        salary: {
          min: 100000,
          max: 180000,
          currency: 'KES',
        },
        status: 'active',
      },
    ]);

    // Create test resources
    await Resource.create([
      {
        title: 'Complete Guide to Technical Interviews',
        description: 'Comprehensive guide for software development interviews',
        type: 'article',
        url: 'https://example.com/tech-interview-guide',
        tags: ['interviews', 'software development', 'career'],
      },
      {
        title: 'Professional Resume Templates',
        description: 'Collection of modern resume templates',
        type: 'tool',
        url: 'https://example.com/resume-templates',
        tags: ['resume', 'job search', 'career'],
      },
    ]);

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
