
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import FeatureHighlight from "@/components/FeatureHighlight";
import { Book, Video, FileText, Globe } from 'lucide-react';

const Resources = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Career Resources</h1>
        
        <div className="mb-10">
          <p className="text-lg mb-6">
            Explore our collection of resources designed to help you develop your skills, 
            prepare for interviews, and advance your career.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureHighlight 
              icon={Book} 
              title="Learning Paths" 
              description="Curated guides to help you develop in-demand skills for the Kenyan job market."
              color="bg-blue-100 text-kazi-blue"
            />
            <FeatureHighlight 
              icon={Video} 
              title="Video Tutorials" 
              description="Watch expert-led videos on interview preparation and workplace skills."
              color="bg-orange-100 text-kazi-orange"
            />
            <FeatureHighlight 
              icon={FileText} 
              title="Resume Templates" 
              description="Download professional templates and get tips for crafting standout resumes."
              color="bg-purple-100 text-accent"
            />
            <FeatureHighlight 
              icon={Globe} 
              title="Industry Insights" 
              description="Stay updated with the latest trends and demands in Kenya's job market."
              color="bg-green-100 text-green-600"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Featured Resource</h2>
          <p className="font-medium mb-2">Complete Guide to Technical Interviews</p>
          <p className="text-gray-600 mb-4">
            This comprehensive guide covers everything you need to know about preparing for and 
            excelling in technical interviews for software development roles in Kenya.
          </p>
          <Button className="bg-kazi-blue text-white hover:bg-kazi-blue/90">
            Download Guide
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
