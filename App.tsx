
import React, { useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/WhyPlacemein';
import HowItWorks from './components/HowItWorks';
import Offerings from './components/Offerings';
import Roles from './components/Roles';
import ContactForm from './components/ContactForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { Audience } from './types';

const App: React.FC = () => {
  const contactRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  
  // Lifted state to coordinate Hero, AboutSection (Dynamic Media), and ContactForm
  const [activePersonaId, setActivePersonaId] = useState<string>('student');
  const [selectedAudience, setSelectedAudience] = useState<Audience>(Audience.Students);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Maps the Hero persona ID to the correct Form Audience and scrolls
  const handleHeroCtaClick = () => {
    switch (activePersonaId) {
      case 'student':
        setSelectedAudience(Audience.Students);
        break;
      case 'corporate':
        setSelectedAudience(Audience.Corporates);
        break;
      case 'college':
        setSelectedAudience(Audience.Colleges);
        break;
      case 'institute':
        setSelectedAudience(Audience.Institutes);
        break;
      default:
        setSelectedAudience(Audience.Students);
    }
    scrollToContact();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onGetInTouchClick={scrollToContact} />
      <main>
        <Hero 
          activeTab={activePersonaId}
          setActiveTab={setActivePersonaId}
          onGetInTouchClick={handleHeroCtaClick} 
          onHowItWorksClick={scrollToHowItWorks}
        />
        {/* AboutSection now receives the active persona to show dynamic media */}
        <AboutSection activePersonaId={activePersonaId} />
        <HowItWorks ref={howItWorksRef} />
        <Offerings />
        <Roles />
        {/* ContactForm receives the pre-selected audience */}
        <ContactForm ref={contactRef} selectedAudience={selectedAudience} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;
