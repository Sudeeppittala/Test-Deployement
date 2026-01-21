
import React from 'react';
import Button from './ui/Button';
import Logo from './Logo';

interface Persona {
  id: string;
  category: string;
  subtext: string;
  headline: string;
  bullets: string[];
  cta: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'student',
    category: "Get Hired",
    subtext: "25 interviews. Guaranteed.",
    headline: "Launch your career fast.",
    bullets: [
      "Direct access to top startups",
      "90-day sprint training",
      "We fix your portfolio"
    ],
    cta: "Start Now"
  },
  {
    id: 'corporate',
    category: "Hire Talent",
    subtext: "Pre-vetted freshers & pros.",
    headline: "Build your dream team.",
    bullets: [
      "Day-one productive talent",
      "Zero hiring friction",
      "Role-specific assessments"
    ],
    cta: "Get Talent"
  },
  {
    id: 'college',
    category: "For Colleges",
    subtext: "We manage your placements.",
    headline: "Placement ops on autopilot.",
    bullets: [
      "We run the placement cell",
      "Real-time student dashboards",
      "500+ corporate partners"
    ],
    cta: "Book Pilot"
  },
  {
    id: 'institute',
    category: "For Institutes",
    subtext: "Plug into our drive network.",
    headline: "More value for students.",
    bullets: [
      "Shared placement drives",
      "Curriculum alignment",
      "Higher placement rates"
    ],
    cta: "Partner Up"
  }
];

interface HeroProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onGetInTouchClick: () => void;
  onHowItWorksClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ activeTab, setActiveTab, onGetInTouchClick }) => {
  const activePersona = PERSONAS.find(p => p.id === activeTab) || PERSONAS[0];

  return (
    <section className="min-h-screen flex items-center pt-32 pb-24 px-6 lg:px-12 relative overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Main Headline area */}
        <div className="mb-20 max-w-4xl relative">
          <h1 className="font-sans font-semibold text-6xl md:text-7xl lg:text-8xl text-primary tracking-tight leading-[0.95] mb-6">
            The hiring engine <br/>
            <span className="text-slate-900">for everyone.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-xl font-normal leading-relaxed">
            We bridge the gap between education and employment with a seamless, high-performance operational layer.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
          
          {/* LEFT: Simplified Persona Grid */}
          <div className="lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`text-left p-8 rounded-2xl transition-all duration-300 border group ${
                  activeTab === p.id 
                  ? 'active-card' 
                  : 'bg-white border-transparent hover:border-gray-200'
                }`}
              >
                <div className={`text-xl font-bold mb-2 ${activeTab === p.id ? 'text-primary' : 'text-slate-900'}`}>
                  {p.category}
                </div>
                <div className="text-sm text-gray-500 font-medium group-hover:text-gray-700 transition-colors">
                  {p.subtext}
                </div>
              </button>
            ))}
          </div>

          {/* RIGHT: Dynamic Panel */}
          <div className="lg:w-7/12 relative">
            <div className="h-full glass-panel rounded-3xl p-10 md:p-16 flex flex-col justify-center animate-slide-up shadow-2xl shadow-primary/5 relative overflow-hidden" key={activeTab}>
              
              {/* 3D Logo placed as a premium watermark/element in the background of the card */}
              {/* Increased opacity from opacity-10 to opacity-20 */}
              <div className="absolute -top-10 -right-10 w-64 h-64 opacity-20 pointer-events-none animate-float">
                <Logo variant="hero" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-10 leading-tight tracking-tight">
                  {activePersona.headline}
                </h2>

                <ul className="space-y-6 mb-12">
                  {activePersona.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent font-black text-xs">
                        ✓
                      </div>
                      <span className="text-lg text-slate-700 font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div>
                  <Button onClick={onGetInTouchClick} className="px-10 py-4 text-lg bg-primary hover:bg-primary-dark text-white rounded-full transition-transform hover:scale-105 shadow-xl shadow-primary/20 font-semibold">
                    {activePersona.cta}
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
