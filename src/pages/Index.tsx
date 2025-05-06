import React from 'react';

import Hero from '@/components/Hero';
import JobCard from '@/components/JobCard';
import ProfileCard from '@/components/ProfileCard';
import FeatureHighlight from '@/components/FeatureHighlight';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BriefcaseIcon, 
  Brain, 
  UserCheck, 
  Medal,
  ArrowRight,
  Sparkles, 
  CheckCircle,
  Filter,
  LayoutGrid,
  LayoutList
} from 'lucide-react';

const Index = () => {
  // Mock data for job listings
  const jobListings = [
    {
      title: "Frontend Developer",
      company: "TechConnect Kenya",
      location: "Nairobi",
      jobType: "Full-time",
      salary: "KSh 70,000 - 90,000",
      postedAt: "Posted 2 days ago",
      matchScore: 92,
      skills: ["JavaScript", "React", "UI/UX"],
      isRecommended: true
    },
    {
      title: "Digital Marketing Specialist",
      company: "MarketPlus",
      location: "Mombasa",
      jobType: "Full-time",
      salary: "KSh 50,000 - 65,000",
      postedAt: "Posted 1 week ago",
      matchScore: 78,
      skills: ["Social Media", "SEO", "Content Creation"]
    },
    {
      title: "Customer Service Representative",
      company: "Safaricom",
      location: "Nairobi",
      jobType: "Part-time",
      salary: "KSh 30,000 - 40,000",
      postedAt: "Posted 3 days ago",
      matchScore: 65,
      skills: ["Communication", "Problem Solving", "MS Office"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <Hero />
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How KaziConnect Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform uses advanced AI to match your skills and preferences with the perfect job opportunities in Kenya.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureHighlight 
              icon={UserCheck}
              title="Create Your Profile"
              description="Sign up and build your comprehensive profile to showcase your skills, education, and career preferences."
              color="bg-blue-100 text-kazi-blue"
            />
            <FeatureHighlight 
              icon={Brain}
              title="AI-Powered Matching"
              description="Our intelligent system analyzes your profile and matches you with relevant job opportunities based on your unique qualifications."
              color="bg-purple-100 text-kazi-purple"
            />
            <FeatureHighlight 
              icon={BriefcaseIcon}
              title="Apply with Confidence"
              description="Apply to jobs with a clear understanding of how well your skills match the requirements, increasing your chances of success."
              color="bg-orange-100 text-kazi-orange"
            />
          </div>
        </div>
      </section>
      
      {/* Dashboard Preview Section */}
      <section className="py-16 bg-kazi-lightBg">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Personalized Job Dashboard</h2>
            <p className="text-slate-600 max-w-3xl">
              Experience a tailored job search with our intelligent matching system. See how your skills align with job requirements and get personalized recommendations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileCard />
              
              <Card className="mt-6 border border-slate-200">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-md mb-3 flex items-center">
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Job Type</label>
                      <select className="w-full border border-slate-200 rounded-md p-2 text-sm">
                        <option>All Types</option>
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Location</label>
                      <select className="w-full border border-slate-200 rounded-md p-2 text-sm">
                        <option>All Kenya</option>
                        <option>Nairobi</option>
                        <option>Mombasa</option>
                        <option>Kisumu</option>
                        <option>Nakuru</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Experience Level</label>
                      <select className="w-full border border-slate-200 rounded-md p-2 text-sm">
                        <option>All Levels</option>
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-slate-700 block mb-1">Salary Range</label>
                      <select className="w-full border border-slate-200 rounded-md p-2 text-sm">
                        <option>Any Salary</option>
                        <option>KSh 0 - 30,000</option>
                        <option>KSh 30,000 - 60,000</option>
                        <option>KSh 60,000 - 100,000</option>
                        <option>KSh 100,000+</option>
                      </select>
                    </div>
                    
                    <Button className="w-full">Apply Filters</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg border border-slate-200 mb-6">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center">
                      <Sparkles className="h-5 w-5 text-kazi-orange mr-2" /> 
                      Recommended For You
                    </h3>
                    <p className="text-sm text-slate-500">Based on your profile and preferences</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <LayoutList className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-4">
                    {jobListings.map((job, index) => (
                      <JobCard key={index} {...job} />
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button variant="outline" className="mx-auto">
                      View More Jobs <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section (Simplified Wireframe) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Hear from young Kenyans who found their dream jobs through KaziConnect.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial Cards (wireframe placeholders) */}
            {[1, 2, 3].map((item) => (
              <Card key={item} className="text-center p-6">
                <div className="h-16 w-16 bg-slate-200 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">User Name</h3>
                <p className="text-sm text-slate-500 mb-4">Position, Company</p>
                <p className="text-slate-600 text-sm italic">
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. KaziConnect helped me find my dream job within weeks."
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 bg-kazi-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Perfect Job Match?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join thousands of Kenyan youth who have found meaningful employment through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button className="bg-white text-kazi-blue hover:bg-slate-100">
              Create Free Account
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>
        </div>
      </section>
      
      {/* Accessibility Features */}
      <section className="py-16 bg-kazi-lightBg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Accessible For Everyone</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              We believe in making job opportunities accessible to all Kenyan youth, regardless of abilities.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Accessibility features */}
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-kazi-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Screen Reader Compatible</h3>
                  <p className="text-sm text-slate-600">Fully optimized for screen readers and assistive technologies.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-kazi-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Sign Language Support</h3>
                  <p className="text-sm text-slate-600">Video tutorials with sign language interpretation available.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-kazi-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Text-to-Speech</h3>
                  <p className="text-sm text-slate-600">Audio readouts of job descriptions and application processes.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-slate-200">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <CheckCircle className="h-5 w-5 text-kazi-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">Keyboard Navigation</h3>
                  <p className="text-sm text-slate-600">Complete keyboard control for all platform features.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      

    </div>
  );
};

export default Index;
