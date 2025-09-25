import React from 'react';
import { cn } from '../lib/utils';

interface NBCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'warn' | 'error' | 'ok';
  onClick?: () => void;
}

export const NBCard: React.FC<NBCardProps> = ({ 
  children, 
  className, 
  variant = 'default',
  onClick 
}) => {
  const variantStyles = {
    default: 'bg-gradient-to-br from-white/95 to-pink-50/80 border-pink-200',
    accent: 'bg-gradient-to-br from-purple-50/90 to-blue-50/90 border-purple-200',
    warn: 'bg-gradient-to-br from-yellow-50/90 to-orange-50/90 border-yellow-300 text-orange-700',
    error: 'bg-gradient-to-br from-red-50/90 to-pink-50/90 border-red-300 text-red-700',
    ok: 'bg-gradient-to-br from-green-50/90 to-emerald-50/90 border-green-300 text-green-700'
  };

  return (
    <div 
      className={cn(
        'rounded-2xl border-2 p-6 transition-all hover:shadow-xl backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
