
import React from 'react';

interface MatchScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

const MatchScore = ({ score, size = 'md' }: MatchScoreProps) => {
  // Convert score to percentage for the CSS variable
  const percentage = `${score}%`;
  
  // Determine color based on score
  let scoreColor = '';
  if (score >= 80) {
    scoreColor = 'bg-kazi-success';
  } else if (score >= 60) {
    scoreColor = 'bg-kazi-warning';
  } else {
    scoreColor = 'bg-kazi-error';
  }
  
  // Determine size classes
  const sizeClasses = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base'
  };
  
  const innerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative ${sizeClasses[size]} rounded-full flex items-center justify-center`}
        style={{ 
          background: `conic-gradient(${scoreColor} ${percentage}, rgba(229, 231, 235, 0.3) 0)` 
        }}
      >
        <div className={`absolute bg-white rounded-full ${innerSizeClasses[size]} flex items-center justify-center font-bold`}>
          {score}%
        </div>
      </div>
      <span className="text-xs font-medium mt-1">Match</span>
    </div>
  );
};

export default MatchScore;
