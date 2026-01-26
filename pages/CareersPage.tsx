import React, { useEffect } from 'react';
import Button from '../components/ui/Button';

const CareersPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Header */}
      <section className="py-20 px-6 bg-slate-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-sans font-bold text-4xl md:text-5xl text-slate-900 mb-6">Build the engine.</h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            Join the team that is reshaping how India hires. We are a high-performance operations team solving a massive human capital problem.
          </p>
        </div>
      </section>

      {/* Culture */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-sans font-bold text-3xl text-slate-900 mb-6">Why Placemein?</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              We operate at the intersection of education, technology, and operations. Work here is fast-paced, impact-driven, and devoid of bureaucracy.
            </p>
            <ul className="space-y-4 text-gray-600 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Competitive Market Salary
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Performance Bonuses
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Health Insurance Coverage
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                High-Growth Learning Curve
              </li>
            </ul>
          </div>
          <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="font-bold text-2xl mb-4">Our Culture</h3>
               <p className="text-slate-400 mb-6">"We don't confuse motion with progress."</p>
               <p className="text-sm text-slate-300 leading-relaxed">
                 We value outcomes over hours. We respect owners, not just workers. If you see a broken process, you fix it. That's how we scale.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Openings */}
      <section className="py-20 px-6 bg-slate-50" id="openings">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans font-bold text-3xl text-slate-900 mb-10 text-center">Current Openings</h2>
          
          <div className="space-y-4">
            {[
              { role: "Full Stack Developer", type: "Engineering", loc: "Hyderabad / Remote" },
              { role: "Placement Operations Manager", type: "Operations", loc: "Hyderabad" },
              { role: "Corporate Relations Lead", type: "Sales", loc: "Bangalore" },
              { role: "Student Success Coach", type: "Training", loc: "Remote" }
            ].map((job, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-primary/30 transition-all">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{job.role}</h3>
                  <div className="flex gap-4 text-sm text-gray-500 mt-1">
                    <span>{job.type}</span>
                    <span>•</span>
                    <span>{job.loc}</span>
                  </div>
                </div>
                <Button variant="secondary" className="px-6 py-2 text-sm rounded-lg">Apply Now</Button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Don't see your role?</p>
            <a href="mailto:careers@placemein.com" className="text-primary font-bold hover:underline">Email us at careers@placemein.com</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;