import React, { useState } from 'react';
import { cn } from '../lib/utils';

interface NBButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warn' | 'error' | 'ok' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NBButton: React.FC<NBButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  onClick,
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Add click effect
    setIsClicked(true);
    
    // Reset after animation
    setTimeout(() => setIsClicked(false), 1500);
    
    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  const variantStyles = {
    primary: isClicked 
      ? 'bg-green-500 text-white shadow-lg scale-105' 
      : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95',
    secondary: isClicked
      ? 'bg-green-500 text-white shadow-lg scale-105'
      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:scale-105 active:scale-95',
    accent: isClicked
      ? 'bg-green-500 text-white shadow-lg scale-105'
      : 'bg-accent text-accent-foreground hover:bg-accent/80 hover:scale-105 active:scale-95',
    warn: isClicked
      ? 'bg-green-500 text-white shadow-lg scale-105'
      : 'bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 active:scale-95',
    error: isClicked
      ? 'bg-green-500 text-white shadow-lg scale-105'
      : 'bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95',
    ok: isClicked
      ? 'bg-green-600 text-white shadow-lg scale-105'
      : 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 active:scale-95',
    ghost: isClicked
      ? 'bg-gray-100 text-gray-900 shadow-lg scale-105'
      : 'bg-transparent text-gray-700 hover:bg-gray-100 hover:scale-105 active:scale-95'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
      
      {/* Success ripple effect */}
      {isClicked && (
        <div className="absolute inset-0 bg-green-400 opacity-30 animate-ping rounded-md"></div>
      )}
    </button>
  );
};
