import React from 'react';
import { MainNavbar } from './MainNavbar';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true 
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {showNavbar && <MainNavbar />}
      <main className={showNavbar ? 'pt-0' : ''}>
        {children}
      </main>
    </div>
  );
};