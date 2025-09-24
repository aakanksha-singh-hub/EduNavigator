import React from 'react';
import { cn } from '../lib/utils';

interface NBButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warn' | 'error' | 'ok';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NBButton: React.FC<NBButtonProps> = ({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    accent: 'bg-accent text-accent-foreground hover:bg-accent/80',
    warn: 'bg-yellow-500 text-white hover:bg-yellow-600',
    error: 'bg-red-500 text-white hover:bg-red-600',
    ok: 'bg-green-500 text-white hover:bg-green-600'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
