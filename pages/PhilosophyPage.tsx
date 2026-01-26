import React, { useEffect } from 'react';

const PhilosophyPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-slate-900 text-white py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="font-sans font-bold text-5xl md:text-7xl mb-8 tracking-tight leading-tight">
            Democratizing the <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-white">career trajectory.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl leading-relaxed">
            We believe that talent is universally distributed, but opportunity is not. Placemein exists to fix the broken bridge between education and employment.
          </p>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">The Problem</h2>
            <h3 className="font-sans font-bold text-4xl text-slate-900 mb-6">The "Unemployable" Myth</h3>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed">
              Every year, thousands of graduates are labeled "unemployable" not because they lack potential, but because they lack direction. Colleges struggle with operational overhead, and companies struggle with signal-to-noise ratios.
            </p>
            <p className="text-lg text-gray-500 leading-relaxed">
              The result? A massive deadlock where jobs remain open and graduates remain unemployed.
            </p>
          </div>
          <div className="bg-slate-50 p-10 rounded-3xl border border-gray-100">
             <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-4">Our Approach</h2>
             <h3 className="font-sans font-bold text-2xl text-slate-900 mb-4">Outcome-Obsessed Operations</h3>
             <ul className="space-y-4">
               <li className="flex gap-4">
                 <span className="font-bold text-primary">01.</span>
                 <p className="text-gray-600">We don't just "train"; we engineer profiles for specific roles.</p>
               </li>
               <li className="flex gap-4">
                 <span className="font-bold text-primary">02.</span>
                 <p className="text-gray-600">We don't just "refer"; we manage the entire logistics of the hiring drive.</p>
               </li>
               <li className="flex gap-4">
                 <span className="font-bold text-primary">03.</span>
                 <p className="text-gray-600">We remove friction. For the student, the college, and the recruiter.</p>
               </li>
             </ul>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-32 px-6 bg-slate-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-sans font-bold text-4xl text-slate-900 text-center mb-16">Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Radical Transparency", desc: "No hidden fees. No fake promises. We are clear about what we can deliver and what we expect from you." },
              { title: "Speed is a Feature", desc: "Careers shouldn't wait. We optimize for the fastest route from 'application' to 'offer letter'." },
              { title: "Meritocracy First", desc: "It doesn't matter which college you go to. If you have the skills, we will get you the interview." }
            ].map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-xl text-slate-900 mb-4">{val.title}</h3>
                <p className="text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PhilosophyPage;