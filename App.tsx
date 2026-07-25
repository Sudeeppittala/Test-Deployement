import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import StudentsPage from './pages/StudentsPage';
import CollegesPage from './pages/CollegesPage';
import HiringPage from './pages/HiringPage';
import PartnersPage from './pages/PartnersPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CompliancePage from './pages/CompliancePage';
import PhilosophyPage from './pages/PhilosophyPage';
import CareersPage from './pages/CareersPage';
import AdminPage from './pages/AdminPage';
import EventPage from './pages/EventPage';
import StandardGroupHiringPage from './pages/StandardGroupHiringPage';
import NextITCareersPage from './pages/NextITCareersPage';

const AppContent: React.FC = () => {
  const contactRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isMicrosite = location.pathname.startsWith('/stangroupco') || location.pathname.startsWith('/standard-group');

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
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-100 selection:bg-primary/10">
      <ScrollToTop />
      {!isMicrosite && (
        <Header 
          onGetInTouchClick={handleScrollToContact} 
        />
      )}
      
      <main>
        <Routes>
          <Route path="/" element={<Home onContactClick={handleScrollToContact} contactRef={contactRef} />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/hiring" element={<HiringPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          
          {/* Dedicated hiring microsite for Standard Group of Companies */}
          <Route path="/stangroupco" element={<StandardGroupHiringPage />} />
          <Route path="/standard-group" element={<StandardGroupHiringPage />} />

          {/* Dedicated hiring & student data submission portal for Next IT Solutions */}
          <Route path="/next-it-careers" element={<NextITCareersPage />} />
          <Route path="/next-it-solutions" element={<NextITCareersPage />} />
          <Route path="/next-it-hiring" element={<NextITCareersPage />} />
          <Route path="/next-it" element={<NextITCareersPage />} />
          
          {/* Legal & Company Pages */}
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/compliance" element={<CompliancePage />} />
          <Route path="/philosophy" element={<PhilosophyPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/roundtable" element={<EventPage />} />
          <Route path="/hr-roundtable" element={<EventPage />} />

          {/* Catch all redirect to home */}
          <Route path="*" element={<Home onContactClick={handleScrollToContact} contactRef={contactRef} />} />
        </Routes>
      </main>
      
      {!isMicrosite && <Footer onNavigate={handleFooterNavigate} />}
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
