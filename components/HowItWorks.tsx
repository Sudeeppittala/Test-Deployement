import React, { forwardRef } from 'react';
import ScrollReveal from './ui/ScrollReveal';

const STEPS = [
  {
    title: "Diagnose",
    desc: "We look at the data. Who is ready? What skills are missing? We find the gaps instantly.",
    num: "01"
  },
  {
    title: "Train & Source",
    desc: "We identify readiness gaps and support students through the Opportunity Guarantee Program. Curated pipelines for HR.",
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
    <section className="py-32 px-6 bg-slate-50 dark:bg-black" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2 className="font-sans font-bold tracking-tight text-4xl md:text-5xl text-center text-slate-900 dark:text-white mb-20">
            Simple by design.
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-12">
          {STEPS.map((step, idx) => (
            <ScrollReveal key={idx} delay={idx * 0.15} animation="fade-up" className="h-full">
              <div className="relative p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out-expo group h-full">
                <div className="text-6xl font-sans text-gray-100 dark:text-gray-700 font-extrabold absolute top-4 right-6 group-hover:text-primary/10 dark:group-hover:text-primary-light/10 transition-colors duration-500">
                  {step.num}
                </div>
                <h3 className="text-2xl font-sans font-bold text-slate-900 dark:text-white mb-4 relative z-10">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed relative z-10 font-medium">{step.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = 'HowItWorks';

export default HowItWorks;