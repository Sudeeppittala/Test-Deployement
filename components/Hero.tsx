import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Logo from './Logo';

interface Persona {
  id: string;
  category: string;
  subtext: string;
  headline: string;
  bullets: string[];
  cta: string;
  path: string;
  stats: { value: string; label: string }[];
}

const PERSONAS: Persona[] = [
  {
    id: 'student',
    category: "Job Seekers",
    subtext: "Structured opportunity access.",
    headline: "Opportunity Guarantee Program",
    bullets: [
      "Readiness support",
      "Guided access to opportunities",
      "Structured placement journey"
    ],
    cta: "Start Now",
    path: "/students",
    stats: [
      { value: "10,000+", label: "Offers Won" },
      { value: "3,000+", label: "Careers Launched" },
      { value: "160+", label: "Hiring Partners" }
    ]
  },
  {
    id: 'college',
    category: "Colleges",
    subtext: "Opportunity Guarantee Partnership",
    headline: "Enable better student outcomes.",
    bullets: [
      "Opportunity Guarantee support",
      "Drive management",
      "Employability coordination"
    ],
    cta: "Book Consultation",
    path: "/colleges",
    stats: [
      { value: "50+", label: "Partner Institutes" },
      { value: "85%", label: "Placement Rate" },
      { value: "200+", label: "Drives Conducted" }
    ]
  },
  {
    id: 'corporate',
    category: "Corporates",
    subtext: "Pre-vetted freshers & pros.",
    headline: "Build your dream team.",
    bullets: [
      "Day-one productive talent",
      "Zero hiring friction",
      "Role-specific assessments"
    ],
    cta: "Get Talent",
    path: "/hiring",
    stats: [
      { value: "48hrs", label: "Avg. Time to Hire" },
      { value: "90%", label: "Retention Rate" },
      { value: "50k+", label: "Pre-vetted Candidates" }
    ]
  },
  {
    id: 'institute',
    category: "Ed-Techs / Institutes",
    subtext: "Plug into our drive network.",
    headline: "More value for students.",
    bullets: [
      "Shared placement drives",
      "Curriculum alignment",
      "Higher placement rates"
    ],
    cta: "Partner Up",
    path: "/partners",
    stats: [
      { value: "20+", label: "Ed-Tech Partners" },
      { value: "5x", label: "ROI on Placements" },
      { value: "100%", label: "Curriculum Alignment" }
    ]
  }
];

interface HeroProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  onGetInTouchClick: () => void;
  onHowItWorksClick: () => void;
  onLearnMoreClick?: (id: string) => void;
}

const Hero: React.FC<HeroProps> = ({ activeTab, setActiveTab, onGetInTouchClick, onHowItWorksClick, onLearnMoreClick }) => {
  const navigate = useNavigate();
  const activePersona = PERSONAS.find(p => p.id === activeTab) || PERSONAS[0];

  const handleLearnMore = () => {
    if (onLearnMoreClick) {
      onLearnMoreClick(activeTab);
    } else {
      navigate(activePersona.path);
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-32 pb-24 px-6 lg:px-12 relative overflow-hidden bg-slate-50 dark:bg-black">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        
        {/* Main Headline area */}
        <div className="mb-20 max-w-4xl relative animate-fade-in">
          {/* Floating Pill (Option B) */}
          <div 
            onClick={() => navigate('/roundtable')}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary-light text-sm font-semibold mb-6 hover:bg-primary/20 cursor-pointer transition-colors group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Learn about our HR Roundtable Edition 1</span>
            <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
          </div>

          <h1 className="font-sans font-semibold text-5xl md:text-6xl lg:text-7xl text-primary dark:text-primary-light tracking-tight leading-[1.1] mb-6">
            The hiring engine <br/>
            <span className="text-slate-900 dark:text-white">for everyone.</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:items-stretch">
          
          {/* LEFT: Persona Selector Grid */}
          <div className="lg:w-5/12 grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {PERSONAS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveTab(p.id)}
                className={`text-left p-8 rounded-2xl transition-all duration-500 ease-out-expo border group relative overflow-hidden ${
                  activeTab === p.id 
                  ? 'active-card dark:border-primary dark:bg-zinc-900' 
                  : 'bg-white dark:bg-zinc-900 border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                <div className={`text-xl font-bold mb-2 relative z-10 ${activeTab === p.id ? 'text-primary dark:text-primary-light' : 'text-slate-900 dark:text-white'}`}>
                  {p.category}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors relative z-10">
                  {p.subtext}
                </div>
                {/* Subtle sheen effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 dark:via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </button>
            ))}
          </div>

          {/* RIGHT: Dynamic Panel */}
          <div className="lg:w-7/12 relative opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            {/* Added key to force re-animation on tab change, but refined the animation class in global css */}
            <div className="h-full glass-panel dark:bg-zinc-900/90 dark:border-zinc-800 rounded-3xl p-10 md:p-16 flex flex-col justify-center animate-slide-up shadow-2xl shadow-primary/5 relative overflow-hidden" key={activeTab}>
              
              <div className="absolute -top-10 -right-10 w-64 h-64 opacity-20 pointer-events-none animate-float">
                <Logo variant="hero" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-10 leading-tight tracking-tight">
                  {activePersona.headline}
                </h2>

                <ul className="space-y-6 mb-10">
                  {activePersona.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-4 animate-slide-in-right" style={{ animationDelay: `${0.1 * i}s` }}>
                      <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent dark:text-accent-light font-black text-xs shrink-0">
                        ✓
                      </div>
                      <span className="text-lg text-slate-700 dark:text-gray-300 font-medium">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="grid grid-cols-3 gap-4 mb-10 border-t border-slate-200 dark:border-zinc-800 pt-8">
                  {activePersona.stats.map((stat, i) => (
                    <div key={i} className="flex flex-col animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                      <span className="text-3xl font-bold text-primary dark:text-primary-light mb-1">{stat.value}</span>
                      <span className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Button onClick={onGetInTouchClick} className="w-full sm:w-auto px-10 py-4 text-lg bg-primary hover:bg-primary-dark text-white rounded-full transition-transform hover:scale-105 shadow-xl shadow-primary/20 font-semibold">
                    {activePersona.cta}
                  </Button>
                  <button 
                    onClick={handleLearnMore}
                    className="text-slate-500 dark:text-gray-400 font-bold hover:text-primary dark:hover:text-primary-light transition-colors flex items-center gap-2 group p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800"
                  >
                    Learn More 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
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