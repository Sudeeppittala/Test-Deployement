
import React, { useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/WhyPlacemein';
import HowItWorks from './components/HowItWorks';
import Offerings from './components/Offerings';
import Roles from './components/Roles';
import ContactForm from './components/ContactForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

const App: React.FC = () => {
  const contactRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);

  const scrollToContact = () => {
    contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onGetInTouchClick={scrollToContact} />
      <main>
        <Hero 
          onGetInTouchClick={scrollToContact} 
          onHowItWorksClick={scrollToHowItWorks}
        />
        <AboutSection />
        <HowItWorks ref={howItWorksRef} />
        <Offerings />
        <Roles />
        <ContactForm ref={contactRef} />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default App;
