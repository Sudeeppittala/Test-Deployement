import React from 'react';
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

  const navLinks = [
    { label: 'For Students', path: '/students' },
    { label: 'For Colleges', path: '/colleges' },
    { label: 'For Corporates', path: '/hiring' },
    { label: 'For Partners', path: '/partners' },
  ];

  return (
    <header className="py-4 px-6 md:px-12 fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center cursor-pointer">
          <Logo variant="header" className="h-10 md:h-14 w-auto" />
        </Link>
        
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
          <Button onClick={onGetInTouchClick} variant="primary" className="text-sm px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md font-medium">
            Get in touch
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;