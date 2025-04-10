
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Briefcase, MapPin, Clock, ArrowRight } from "lucide-react";
import MatchScore from './MatchScore';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  jobType: string;
  salary?: string;
  postedAt: string;
  matchScore: number;
  skills: string[];
  isRecommended?: boolean;
}

const JobCard = ({
  title,
  company,
  location,
  jobType,
  salary,
  postedAt,
  matchScore,
  skills,
  isRecommended
}: JobCardProps) => {
  return (
    <Card className={`overflow-hidden border ${isRecommended ? 'border-kazi-orange/30 bg-orange-50/30' : 'border-slate-200'}`}>
      {isRecommended && (
        <div className="bg-kazi-orange text-white text-xs font-medium py-1 px-3 text-center">
          AI Recommended
        </div>
      )}
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-kazi-darkText">{title}</h3>
            <p className="text-slate-600 mb-2">{company}</p>
            
            <div className="flex flex-wrap gap-2 mb-3 mt-3 text-sm text-slate-500">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {location}
              </div>
              <div className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1" /> {jobType}
              </div>
              {salary && (
                <div className="flex items-center">
                  <span className="font-medium text-kazi-darkText">{salary}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 my-3">
              {skills.map((skill, index) => (
                <Badge variant="secondary" key={index} className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="ml-4">
            <MatchScore score={matchScore} />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-slate-50 p-4 flex items-center justify-between">
        <div className="flex items-center text-xs text-slate-500">
          <Clock className="h-3 w-3 mr-1" />
          {postedAt}
        </div>
        <Button size="sm" className="text-xs">
          View Job <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
