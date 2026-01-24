
import React from 'react';
import { Audience } from '../types';

const offeringsData = {
  [Audience.Colleges]: {
    title: 'For Colleges',
    points: [
      "3-Month Placement Pilot",
      "Managed Placement Drives",
      "Student Outcome Dashboard",
      "Zero-Headache Ops",
    ],
  },
  [Audience.Students]: {
    title: 'For Students',
    points: [
      "Job in 90 Days",
      "Resume Overhaul",
      "Mock Interviews",
      "Guaranteed Opportunities",
    ],
  },
  [Audience.Corporates]: {
    title: 'For Corporates',
    points: [
      "Hire Pre-vetted Talent",
      "Pooled Campus Drives",
      "Immediate Shortlists",
      "Full Coordination",
    ],
  },
};

const CheckIcon = () => (
    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const OfferingCard: React.FC<{ title: string; points: string[] }> = ({ title, points }) => (
  <div className="bg-white p-10 rounded-xl border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-500">
    <h3 className="text-3xl font-sans font-bold tracking-tight text-slate-900 mb-8">{title}</h3>
    <ul className="space-y-4">
      {points.map((point, index) => (
        <li key={index} className="flex items-start">
            <CheckIcon />
            <span className="ml-3 text-gray-600 font-medium">{point}</span>
        </li>
      ))}
    </ul>
  </div>
);

const Offerings: React.FC = () => {
  return (
    <section className="py-32 px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="font-sans font-bold tracking-tight text-4xl md:text-5xl text-slate-900 text-center mb-20">
          Tailored Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <OfferingCard title={offeringsData[Audience.Colleges].title} points={offeringsData[Audience.Colleges].points} />
          <OfferingCard title={offeringsData[Audience.Students].title} points={offeringsData[Audience.Students].points} />
          <OfferingCard title={offeringsData[Audience.Corporates].title} points={offeringsData[Audience.Corporates].points} />
        </div>
      </div>
    </section>
  );
};

export default Offerings;
