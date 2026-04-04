import React from 'react';
import { cn } from '../../utils/helpers';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  className,
  rows = 4,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={cn(
          'w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg',
          'focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'dark:bg-gray-700 dark:text-white transition-all duration-200',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};