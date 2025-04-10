
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Companies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Browse Companies</h1>
        
        {/* Company listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-14 w-14 rounded-md bg-blue-100 flex items-center justify-center mb-4">
              <div className="h-8 w-8 rounded-full bg-kazi-blue"></div>
            </div>
            <p className="text-lg font-semibold mb-1">TechHub Kenya</p>
            <p className="text-gray-600 mb-2">Technology</p>
            <p className="text-sm text-gray-500 mb-4">
              A leading technology company specializing in software development and IT solutions.
            </p>
            <Button variant="outline" className="text-kazi-blue border-kazi-blue hover:bg-kazi-blue/10">
              View Company
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-14 w-14 rounded-md bg-orange-100 flex items-center justify-center mb-4">
              <div className="h-8 w-8 rounded-full bg-kazi-orange"></div>
            </div>
            <p className="text-lg font-semibold mb-1">Coastal Brands Ltd</p>
            <p className="text-gray-600 mb-2">Marketing</p>
            <p className="text-sm text-gray-500 mb-4">
              Marketing agency specializing in hospitality and tourism sectors along the Kenyan coast.
            </p>
            <Button variant="outline" className="text-kazi-blue border-kazi-blue hover:bg-kazi-blue/10">
              View Company
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-14 w-14 rounded-md bg-purple-100 flex items-center justify-center mb-4">
              <div className="h-8 w-8 rounded-full bg-accent"></div>
            </div>
            <p className="text-lg font-semibold mb-1">EduTech Solutions</p>
            <p className="text-gray-600 mb-2">Education</p>
            <p className="text-sm text-gray-500 mb-4">
              Educational technology company developing digital learning tools for schools across East Africa.
            </p>
            <Button variant="outline" className="text-kazi-blue border-kazi-blue hover:bg-kazi-blue/10">
              View Company
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Companies;
