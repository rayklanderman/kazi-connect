
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Jobs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Find Jobs</h1>
        
        {/* Search box */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 rounded-md border border-slate-200 text-kazi-darkText focus:outline-none focus:ring-2 focus:ring-kazi-orange"
                  placeholder="Job title, skill, or company" 
                />
              </div>
              <Button className="bg-kazi-orange text-white hover:bg-kazi-orange/90">
                <Search className="mr-2 h-4 w-4" /> Find Jobs
              </Button>
            </div>
          </div>
        </div>
        
        {/* Job listings placeholder */}
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <p className="text-lg font-semibold">Software Developer - Nairobi</p>
          <p className="text-gray-600 mb-3">TechHub Kenya</p>
          <p className="text-sm text-gray-500 mb-4">
            Seeking a talented software developer to join our innovative team. 
            This position requires strong programming skills in JavaScript and React.
          </p>
          <Button variant="outline" className="text-kazi-blue border-kazi-blue hover:bg-kazi-blue/10">
            View Details
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-lg font-semibold">Marketing Associate - Mombasa</p>
          <p className="text-gray-600 mb-3">Coastal Brands Ltd</p>
          <p className="text-sm text-gray-500 mb-4">
            Join our marketing team to help create and execute digital campaigns 
            for various clients in the hospitality and tourism sector.
          </p>
          <Button variant="outline" className="text-kazi-blue border-kazi-blue hover:bg-kazi-blue/10">
            View Details
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
