
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Edit, Briefcase, GraduationCap, Award } from "lucide-react";

const ProfileCard = () => {
  return (
    <Card className="border border-slate-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="h-16 w-16 bg-slate-200 rounded-full flex items-center justify-center mr-4">
              <User className="h-8 w-8 text-slate-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-kazi-darkText">John Kamau</h3>
              <p className="text-slate-600">Software Developer</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="h-8">
            <Edit className="h-3 w-3 mr-1" /> Edit
          </Button>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1" /> Skills
            </h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">JavaScript</Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">React</Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">UI/UX</Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">HTML/CSS</Badge>
              <Badge variant="secondary" className="bg-slate-100 text-slate-700">Node.js</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <GraduationCap className="h-4 w-4 mr-1" /> Education
            </h4>
            <div className="text-sm">
              <p className="font-medium">University of Nairobi</p>
              <p className="text-slate-600">BSc Computer Science, 2018-2022</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center">
              <Briefcase className="h-4 w-4 mr-1" /> Experience
            </h4>
            <div className="text-sm">
              <p className="font-medium">Junior Developer</p>
              <p className="text-slate-600">Tech Solutions Ltd, 2022-Present</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <p className="text-sm text-slate-500 mb-2">Profile completion</p>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-kazi-blue h-2 rounded-full" style={{ width: '80%' }}></div>
          </div>
          <p className="text-xs text-slate-500 mt-1">Complete your profile to improve job matches</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
