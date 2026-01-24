
import React, { forwardRef } from 'react';

const STEPS = [
  {
    title: "Diagnose",
    desc: "We look at the data. Who is ready? What skills are missing? We find the gaps instantly.",
    num: "01"
  },
  {
    title: "Train & Source",
    desc: "We fix the gaps. 90-day sprints for students. Curated pipelines for HR.",
    num: "02"
  },
  {
    title: "Placement",
    desc: "The finish line. We schedule the interviews, manage the drives, and get offers signed.",
    num: "03"
  }
];

const HowItWorks = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section className="py-32 px-6 bg-slate-50" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <h2 className="font-sans font-bold tracking-tight text-4xl md:text-5xl text-center text-slate-900 mb-20">
          Simple by design.
        </h2>

        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step, idx) => (
            <div key={idx} className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="text-6xl font-sans text-gray-100 font-extrabold absolute top-4 right-6 group-hover:text-primary/10 transition-colors">
                {step.num}
              </div>
              <h3 className="text-2xl font-sans font-bold text-slate-900 mb-4 relative z-10">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed relative z-10 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;
