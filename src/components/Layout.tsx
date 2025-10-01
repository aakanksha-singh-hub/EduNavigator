import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MainNavbar } from './MainNavbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true 
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <MainNavbar />}
      <main className={`flex-1 ${showNavbar ? 'pt-0' : ''}`}>
        {children}
      </main>
      <footer className="border-t border-blue-200 bg-blue-50 py-3 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <span className="text-gray-900 font-bold">© 2025 EduNavigator</span>
            </div>
            <div className="flex space-x-6">
              {isHomePage ? (
                <>
                  <button 
                    onClick={() => scrollToSection('about')} 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    About
                  </button>
                  <button 
                    onClick={() => scrollToSection('faq')} 
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    FAQ
                  </button>
                </>
              ) : (
                <>
                  <Link to="/#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    About
                  </Link>
                  <Link to="/#faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                    FAQ
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};