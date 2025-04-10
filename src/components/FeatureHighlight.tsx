
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureHighlightProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: string;
}

const FeatureHighlight = ({ 
  icon: Icon, 
  title, 
  description, 
  color = 'bg-blue-100 text-kazi-blue' 
}: FeatureHighlightProps) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className={`${color} p-3 rounded-full mb-4`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
};

export default FeatureHighlight;
