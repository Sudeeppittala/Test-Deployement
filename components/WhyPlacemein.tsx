
import React from 'react';
import Logo from './Logo';

interface ContentData {
  headline: React.ReactNode;
  description: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  imageUrl: string;
}

const CONTENT_MAP: Record<string, ContentData> = {
  student: {
    headline: <>Your personal <br/><span className="text-slate-900">career launchpad.</span></>,
    description: "Finding a job shouldn't be a lottery. We provide the mentorship, the training, and the guaranteed interviews you need to crack high-paying tech roles.",
    stat1Value: "90 Days",
    stat1Label: "Program Duration",
    stat2Value: "25+",
    stat2Label: "Guaranteed Drives",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600" 
  },
  corporate: {
    headline: <>The ultimate <br/><span className="text-slate-900">talent pipeline.</span></>,
    description: "Stop sifting through thousands of irrelevant resumes. We give you a pre-screened pipeline of role-ready developers who can ship code on Day 1.",
    stat1Value: "48 Hrs",
    stat1Label: "To Shortlist",
    stat2Value: "Zero",
    stat2Label: "Hiring Friction",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1600"
  },
  college: {
    headline: <>We run your <br/><span className="text-slate-900">placement cell.</span></>,
    description: "Traditional hiring is noisy. We act as the silent engine that connects colleges, students, and companies. No friction, just results.",
    stat1Value: "90%",
    stat1Label: "Less Ops Work",
    stat2Value: "500+",
    stat2Label: "Corporate Partners",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1600"
  },
  institute: {
    headline: <>Empower your <br/><span className="text-slate-900">curriculum.</span></>,
    description: "Great training needs great outcomes. Plug into our placement network to offer your students guaranteed interview opportunities upon course completion.",
    stat1Value: "2x",
    stat1Label: "Placement Rate",
    stat2Value: "Day 1",
    stat2Label: "Industry Ready",
    imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1600"
  }
};

interface AboutSectionProps {
  activePersonaId: string;
}

const AboutSection: React.FC<AboutSectionProps> = ({ activePersonaId }) => {
  const content = CONTENT_MAP[activePersonaId] || CONTENT_MAP['student'];

  return (
    <section className="py-32 px-6 bg-white border-t border-gray-100 relative overflow-hidden">
      
      {/* Background Watermark */}
      <div className="absolute -left-20 top-40 opacity-[0.03] pointer-events-none rotate-12">
        <Logo variant="watermark" width={600} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-24 items-center animate-fade-in" key={activePersonaId}>
          
          <div>
            <h2 className="font-sans font-bold text-5xl md:text-6xl text-primary mb-8 leading-[1.1] tracking-tight">
              {content.headline}
            </h2>
            <p className="text-xl text-gray-500 leading-relaxed mb-12 font-normal">
              {content.description}
            </p>
            
            <div className="flex gap-12">
              <div>
                <div className="font-sans font-bold text-5xl text-slate-900 mb-2 tracking-tight">{content.stat1Value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{content.stat1Label}</div>
              </div>
              <div>
                <div className="font-sans font-bold text-5xl text-slate-900 mb-2 tracking-tight">{content.stat2Value}</div>
                <div className="text-sm font-bold uppercase tracking-widest text-gray-400">{content.stat2Label}</div>
              </div>
            </div>
          </div>

          <div className="relative group">
             <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden relative shadow-2xl">
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <img 
                  src={content.imageUrl}
                  className="object-cover w-full h-full transform transition-transform duration-1000 ease-out group-hover:scale-105"
                  alt={`Placemein ${activePersonaId} context`}
                />
             </div>
             {/* Decorative blob */}
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-2xl -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
