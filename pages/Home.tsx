import React, { useRef, useState } from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/WhyPlacemein';
import HowItWorks from '../components/HowItWorks';
import Offerings from '../components/Offerings';
import Roles from '../components/Roles';
import ContactForm from '../components/ContactForm';
import FAQ from '../components/FAQ';
import { Audience } from '../types';

interface HomeProps {
  onContactClick: () => void;
  contactRef: React.RefObject<HTMLElement>;
}

const Home: React.FC<HomeProps> = ({ onContactClick, contactRef }) => {
  const howItWorksRef = useRef<HTMLElement>(null);
  const [activePersonaId, setActivePersonaId] = useState<string>('student');

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Hero 
        activeTab={activePersonaId}
        setActiveTab={setActivePersonaId}
        onGetInTouchClick={onContactClick} 
        onHowItWorksClick={scrollToHowItWorks}
      />
      <AboutSection activePersonaId={activePersonaId} />
      <HowItWorks ref={howItWorksRef} />
      <Offerings />
      <Roles />
      <ContactForm ref={contactRef} selectedAudience={Audience.Students} />
      <FAQ />
    </>
  );
};

export default Home;