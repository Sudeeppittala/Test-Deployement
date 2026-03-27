import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 text-gray-900 selection:bg-primary/10">
      <ScrollToTop />
      <Header
        onGetInTouchClick={handleScrollToContact}
      />
      <Routes>
        <Route path="/" element={<Home contactRef={contactRef} />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/colleges" element={<CollegesPage />} />
        <Route path="/companies" element={<HiringPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Legal & Company Pages */}
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/compliance" element={<CompliancePage />} />
        <Route path="/philosophy" element={<PhilosophyPage />} />

        {/* Legacy redirects - clean up old URLs for SEO */}
        <Route path="/lander" element={<Navigate to="/" replace />} />

        {/* Catch all redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer
        onNavigate={handleFooterNavigate}
        onGetInTouchClick={handleScrollToContact}
      />
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
