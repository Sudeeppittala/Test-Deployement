import React, { useEffect } from 'react';
import { PersonaContent, Audience } from '../types';
import Button from './ui/Button';
import AccordionItem from './ui/Accordion';
import Logo from './Logo';
import ContactForm from './ContactForm';

interface PersonaPageProps {
  content: PersonaContent;
  audience: Audience;
  onCtaClick?: () => void;
}

const PersonaPage: React.FC<PersonaPageProps> = ({ content, audience, onCtaClick }) => {
  // Use scroll to top from wrapper usually, but reinforcing here
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [content.id]);

  const handleInternalCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const formElement = document.getElementById('persona-contact-form');
      formElement?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="pt-24 animate-fade-in">
      {/* Hero Section */}
      <section className="py-24 px-6 md:px-12 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-20 right-[-10%] opacity-[0.05] pointer-events-none rotate-12">
          <Logo variant="watermark" width={600} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <h1 className="font-sans font-bold text-6xl md:text-7xl text-primary tracking-tight leading-tight mb-8">
              {content.hero.headline}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 mb-12 font-medium leading-relaxed">
              {content.hero.subheadline}
            </p>
            <Button onClick={handleInternalCta} className="px-10 py-5 text-lg rounded-full shadow-2xl shadow-primary/20 font-bold">
              {content.hero.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* Who this is for & How it Helps */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-10 border-b border-primary/10 pb-4 inline-block">Who this is for</h2>
            <ul className="space-y-6">
              {content.whoThisIsFor.map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-1">✓</div>
                  <span className="text-xl text-slate-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest text-primary mb-10 border-b border-primary/10 pb-4 inline-block">How Placemein helps you</h2>
            <ul className="space-y-6">
              {content.howWeHelp.map((item, i) => {
                const [title, ...desc] = item.split(':');
                return (
                  <li key={i} className="group">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{title}</h3>
                    <p className="text-slate-500 font-medium">{desc.join(':').trim()}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Connectivity Section (The "Intersection") */}
      <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full animate-float" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="font-sans font-bold text-4xl md:text-5xl tracking-tight mb-6">
              {content.connectivity.title}
            </h2>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
              We sit at the intersection of talent, training, and hiring. Our unique position creates direct value for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {content.connectivity.bullets.map((bullet, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:border-accent/50 transition-all group">
                <div className="text-accent font-black text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Via {bullet.label}</div>
                <p className="text-xl text-slate-200 font-medium leading-relaxed group-hover:text-white">
                  {bullet.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple How it Works */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-sans font-bold text-4xl text-center text-slate-900 mb-20">Simple by design.</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {content.howItWorks.map((step, idx) => (
              <div key={idx} className="relative p-10 bg-slate-50 rounded-3xl border border-gray-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="text-7xl font-sans text-primary/5 font-black absolute top-4 right-8 group-hover:text-primary/10 transition-colors">
                  {step.num}
                </div>
                <h3 className="text-2xl font-sans font-bold text-slate-900 mb-4 relative z-10">{step.title}</h3>
                <p className="text-slate-500 leading-relaxed relative z-10 font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof / Credibility */}
      <section className="py-20 px-6 bg-primary text-white">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-16 gap-y-10">
          {content.proof.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-1.5 h-1.5 bg-accent rounded-full" />
              <span className="text-sm font-black uppercase tracking-[0.2em]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-sans font-bold text-4xl text-slate-900 text-center mb-16">Common Questions</h2>
          <div className="space-y-2">
            {content.faq.map((faq, index) => (
              <AccordionItem key={index} title={faq.question}>
                <p className="text-lg text-slate-500 font-medium leading-relaxed">{faq.answer}</p>
              </AccordionItem>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Contact Form */}
      <div id="persona-contact-form">
        <ContactForm selectedAudience={audience} />
      </div>
    </div>
  );
};

export default PersonaPage;