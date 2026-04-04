import React from 'react';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            © {currentYear} CSPAPP. Built with 
            <Heart className="w-3 h-3 text-red-500 fill-current" /> 
            for the Kingdom.
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            Developed by{' '}
            <a
              href="https://webixhost.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-200 hover:underline"
            >
              WebixHost
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};