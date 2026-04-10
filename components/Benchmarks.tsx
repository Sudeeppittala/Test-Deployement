import React from 'react';

const Benchmarks: React.FC = () => {
  return (
    <div className="w-full py-12 border-y border-gray-200 dark:border-zinc-800 bg-white dark:bg-black shadow-sm">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tracking-tighter text-primary dark:text-primary-light">10,000+</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mt-1">Offers Won</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tracking-tighter text-primary dark:text-primary-light">85%</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mt-1">Placement Rate</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tracking-tighter text-primary dark:text-primary-light">48hrs</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mt-1">Avg. Hire Time</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-black tracking-tighter text-primary dark:text-primary-light">5x</span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mt-1">ROI for Partners</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Benchmarks;
