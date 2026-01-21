
import React from 'react';
import Button from './ui/Button';
import Logo from './Logo';

interface HeaderProps {
  onGetInTouchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetInTouchClick }) => {
  return (
    <header className="py-4 px-6 md:px-12 fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Increased height: h-10 (40px) on mobile, h-14 (56px) on desktop */}
          <Logo variant="header" className="h-10 md:h-14 w-auto" />
        </div>
        
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold tracking-wide text-gray-500">
          <a href="#" className="hover:text-primary transition-colors duration-200">Solutions</a>
          <a href="#" className="hover:text-primary transition-colors duration-200">For Colleges</a>
          <a href="#" className="hover:text-primary transition-colors duration-200">For Students</a>
          <a href="#" className="hover:text-primary transition-colors duration-200">For Corporates</a>
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
