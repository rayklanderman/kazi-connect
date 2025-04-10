
import React from 'react';
import { Button } from "@/components/ui/button";
import { SearchIcon, BriefcaseIcon } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-kazi-blue to-kazi-purple text-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">
            Find Your Perfect Career Match in Kenya
          </h1>
          <p className="text-lg md:text-xl mb-8 text-slate-100">
            Our AI-powered platform connects talented youth with jobs that match their skills, education, and interests.
          </p>
          
          {/* Search box */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 rounded-md text-kazi-darkText focus:outline-none focus:ring-2 focus:ring-kazi-orange"
                  placeholder="Job title, skill, or company" 
                />
              </div>
              <Button className="bg-kazi-orange text-white hover:bg-kazi-orange/90">
                <SearchIcon className="mr-2 h-4 w-4" /> Find Jobs
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">Software Developer</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Marketing</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Customer Service</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Accounting</span>
            <span className="bg-white/20 px-3 py-1 rounded-full">Design</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
