import React from 'react';

export const PanelistSkeleton: React.FC = () => {
  return (
    <>
      {[1, 2, 3].map((num) => (
        <div 
          key={num}
          className="flex flex-col bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm animate-pulse"
        >
          {/* Badge Placeholder */}
          <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center relative">
            <div className="w-24 h-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <div className="absolute top-4 right-4 bg-zinc-300 dark:bg-zinc-700 w-20 h-5 rounded-full" />
          </div>
          
          {/* Info placeholders */}
          <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
            <div className="space-y-2">
              {/* Name */}
              <div className="h-5 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4" />
              {/* Designation */}
              <div className="h-3.5 bg-zinc-300 dark:bg-zinc-700 rounded w-1/2" />
              {/* Company */}
              <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-2/5" />
            </div>
            
            {/* Bio line */}
            <div className="border-t border-gray-100 dark:border-zinc-800/80 pt-4 space-y-2 flex-grow">
              <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-full" />
              <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-5/6" />
              <div className="h-3 bg-zinc-300 dark:bg-zinc-700 rounded w-4/6" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PanelistSkeleton;
