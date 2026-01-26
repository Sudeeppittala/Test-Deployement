import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from './ui/Button';
import Logo from './Logo';

interface HeaderProps {
  onGetInTouchClick: () => void;
  onLogoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetInTouchClick }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'For Students', path: '/students' },
    { label: 'For Colleges', path: '/colleges' },
    { label: 'For Corporates', path: '/hiring' },
    { label: 'For Partners', path: '/partners' },
  ];

  return (
    <>
      <header className="py-4 px-6 md:px-12 fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center cursor-pointer" onClick={() => setIsMobileMenuOpen(false)}>
            <Logo variant="header" className="h-10 md:h-14 w-auto" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-bold tracking-wide text-slate-600">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`hover:text-primary transition-colors duration-200 ${currentPath === link.path ? 'text-primary' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button onClick={onGetInTouchClick} variant="primary" className="hidden md:block text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md font-medium">
              Get in touch
            </Button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-slate-600 p-2 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-fade-in overflow-y-auto">
          <nav className="flex flex-col space-y-6 text-lg font-bold text-slate-800">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`border-b border-gray-100 pb-4 ${currentPath === link.path ? 'text-primary' : 'text-slate-600'}`}
              >
                {link.label}
              </Link>
            ))}
            <Button onClick={() => { onGetInTouchClick(); setIsMobileMenuOpen(false); }} variant="primary" className="w-full mt-4">
              Get in touch
            </Button>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;