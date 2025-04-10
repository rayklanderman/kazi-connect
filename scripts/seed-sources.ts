// Common Kenyan job boards and company directories
export const sources = {
  jobBoards: [
    {
      name: 'BrighterMonday Kenya',
      url: 'https://www.brightermonday.co.ke/jobs',
      selectors: {
        jobListing: 'div[data-job-listing]',
        title: 'h3',
        company: '[data-company-name]',
        location: '[data-location]',
        type: '[data-job-type]',
        description: '[data-job-description]',
        requirements: '[data-requirements] li',
        companyLogo: 'img[data-company-logo]',
        industry: '[data-company-industry]'
      }
    },
    {
      name: 'MyJobMag Kenya',
      url: 'https://www.myjobmag.co.ke/jobs',
      selectors: {
        jobListing: '.job-list-item',
        title: '.job-title',
        company: '.company-name',
        location: '.job-location',
        type: '.job-type',
        description: '.job-description',
        requirements: '.job-requirements li',
        companyLogo: '.company-logo img',
        industry: '.company-industry'
      }
    },
    {
      name: 'Fuzu',
      url: 'https://www.fuzu.com/kenya/jobs',
      selectors: {
        jobListing: '.job-card',
        title: '.job-title',
        company: '.company-name',
        location: '.job-location',
        type: '.employment-type',
        description: '.job-description',
        requirements: '.requirements-list li',
        companyLogo: '.company-logo img',
        industry: '.company-industry'
      }
    }
  ],
  
  // Major Kenyan industries
  industries: [
    'Technology',
    'Finance & Banking',
    'Manufacturing',
    'Agriculture',
    'Healthcare',
    'Education',
    'Retail & E-commerce',
    'Tourism & Hospitality',
    'Construction & Real Estate',
    'Energy & Mining',
    'Telecommunications',
    'Media & Entertainment',
    'NGO & Non-Profit',
    'Logistics & Transportation',
    'Professional Services'
  ],

  // Major Kenyan cities
  locations: [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Thika',
    'Malindi',
    'Kitale',
    'Machakos',
    'Naivasha'
  ],

  // Common job types
  jobTypes: [
    'full-time',
    'part-time',
    'contract',
    'internship'
  ],

  // Company sizes
  companySizes: [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ],

  // Sample salary ranges (in KES)
  salaryRanges: [
    { min: 20000, max: 40000 },
    { min: 40000, max: 80000 },
    { min: 80000, max: 150000 },
    { min: 150000, max: 300000 },
    { min: 300000, max: 500000 },
    { min: 500000, max: 1000000 }
  ]
} as const;
