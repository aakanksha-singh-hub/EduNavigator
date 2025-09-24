import React from 'react';
import { cn } from '../lib/utils';

interface NBCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'warn' | 'error' | 'ok';
}

export const NBCard: React.FC<NBCardProps> = ({ 
  children, 
  className, 
  variant = 'default' 
}) => {
  const variantStyles = {
    default: 'bg-card border-border',
    accent: 'bg-accent border-accent text-accent-foreground',
    warn: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/20 text-red-400',
    ok: 'bg-green-500/10 border-green-500/20 text-green-400'
  };

  return (
    <div 
      className={cn(
        'rounded-lg border p-6 transition-all hover:shadow-lg',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
};
