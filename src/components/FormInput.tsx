import React from 'react';
import { UseFormRegister, FieldError } from 'react-hook-form';
import { cn } from '../lib/utils';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'password';
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  required = false,
  className
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
        {...register(name, { required: required ? `${label} is required` : false })}
      />
      {error && (
        <p className="text-sm text-destructive font-medium">
          {error.message}
        </p>
      )}
    </div>
  );
};
