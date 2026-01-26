import React, { useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import StudentsPage from './pages/StudentsPage';
import CollegesPage from './pages/CollegesPage';
import HiringPage from './pages/HiringPage';
import PartnersPage from './pages/PartnersPage';

const AppContent: React.FC = () => {
  const contactRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const handleScrollToContact = () => {
    // If we are on home page, scroll. If not, navigate home then scroll.
    if (window.location.hash === '#/') {
      contactRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
      setTimeout(() => {
        const contactSection = document.getElementById('main-contact-form');
        contactSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Wrapper for Footer navigation to use router
  const handleFooterNavigate = (page: string) => {
    if (page === 'home') navigate('/');
    else navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/10">
      <ScrollToTop />
      <Header 
        onGetInTouchClick={handleScrollToContact} 
      />
      
      <main>
        <Routes>
          <Route path="/" element={<Home onContactClick={handleScrollToContact} contactRef={contactRef} />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/hiring" element={<HiringPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          {/* Catch all redirect to home */}
          <Route path="*" element={<Home onContactClick={handleScrollToContact} contactRef={contactRef} />} />
        </Routes>
      </main>
      
      <Footer onNavigate={handleFooterNavigate} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;