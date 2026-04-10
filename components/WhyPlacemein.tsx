import React from 'react';
import Logo from './Logo';
import ScrollReveal from './ui/ScrollReveal';
import CountUp from './ui/CountUp';

interface ContentData {
  headline: React.ReactNode;
  description: string;
  stat1Value: number;
  stat1Suffix: string;
  stat1Label: string;
  stat2Value: number;
  stat2Suffix: string;
  stat2Label: string;
  imageUrl: string;
}

const CONTENT_MAP: Record<string, ContentData> = {
  student: {
    headline: <>Your personal <br/><span className="text-slate-900 dark:text-white">career launchpad.</span></>,
    description: "Finding a job shouldn't be a lottery. We provide the mentorship, the training, and the guaranteed interviews you need to crack high-paying tech roles.",
    stat1Value: 90,
    stat1Suffix: " Days",
    stat1Label: "Program Duration",
    stat2Value: 25,
    stat2Suffix: "+",
    stat2Label: "Guaranteed Drives",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600" 
  },
  corporate: {
    headline: <>The ultimate <br/><span className="text-slate-900 dark:text-white">talent pipeline.</span></>,
    description: "Stop sifting through thousands of irrelevant resumes. We give you a pre-screened pipeline of role-ready developers who can ship code on Day 1.",
    stat1Value: 48,
    stat1Suffix: " Hrs",
    stat1Label: "To Shortlist",
    stat2Value: 0,
    stat2Suffix: "",
    stat2Label: "Hiring Friction",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600"
  },
  college: {
    headline: <>We run your <br/><span className="text-slate-900 dark:text-white">placement cell.</span></>,
    description: "Traditional hiring is noisy. We act as the silent engine that connects colleges, students, and companies. No friction, just results.",
    stat1Value: 90,
    stat1Suffix: "%",
    stat1Label: "Less Ops Work",
    stat2Value: 500,
    stat2Suffix: "+",
    stat2Label: "Corporate Partners",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600"
  },
  institute: {
    headline: <>Empower your <br/><span className="text-slate-900 dark:text-white">curriculum.</span></>,
    description: "Great training needs great outcomes. Plug into our placement network to offer your students guaranteed interview opportunities upon course completion.",
    stat1Value: 2,
    stat1Suffix: "x",
    stat1Label: "Placement Rate",
    stat2Value: 1,
    stat2Suffix: "",
    stat2Label: "Day 1 Industry Ready", // Customized label to fit number logic
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600"
  }
};

interface AboutSectionProps {
  activePersonaId: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ activePersonaId }) => {
  const content = CONTENT_MAP[activePersonaId] || CONTENT_MAP['student'];

  return (
    <section className="py-32 px-6 bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800 relative overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute -left-20 top-40 opacity-[0.03] dark:opacity-[0.01] pointer-events-none rotate-12 transition-opacity duration-1000">
        <Logo variant="watermark" width={600} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center" key={activePersonaId}>
          
          <div>
            <ScrollReveal animation="fade-up">
              <h2 className="font-sans font-bold text-5xl md:text-6xl text-primary dark:text-primary-light mb-8 leading-[1.1] tracking-tight">
                {content.headline}
              </h2>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={0.1}>
              <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-12 font-normal">
                {content.description}
              </p>
            </ScrollReveal>
            
            <div className="flex gap-12">
              <ScrollReveal animation="fade-up" delay={0.2}>
                <div>
                  <div className="font-sans font-bold text-5xl text-slate-900 dark:text-white mb-2 tracking-tight">
                    <CountUp end={content.stat1Value} suffix={content.stat1Suffix} />
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{content.stat1Label}</div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-up" delay={0.3}>
                <div>
                  <div className="font-sans font-bold text-5xl text-slate-900 dark:text-white mb-2 tracking-tight">
                    <CountUp end={content.stat2Value} suffix={content.stat2Suffix} />
                  </div>
                  <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{content.stat2Label}</div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal animation="scale-up" delay={0.2} duration={1}>
            <div className="relative group cursor-default">
               <div className="aspect-[4/3] bg-gray-100 dark:bg-zinc-900 rounded-3xl overflow-hidden relative shadow-2xl">
                  {/* Loading skeleton placeholder */}
                  <div className="absolute inset-0 skeleton z-20 transition-opacity duration-500 pointer-events-none opacity-0" />
                  
                  <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                  <img 
                    src={content.imageUrl}
                    className="object-cover w-full h-full transform transition-transform duration-1000 ease-out group-hover:scale-105"
                    alt={`Placemein ${activePersonaId} context`}
                    loading="lazy"
                  />
               </div>
               {/* Decorative blob */}
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl -z-10 animate-pulse-slow"></div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;