import React from 'react';
import { Menu, Bell, Sun, Moon, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/helpers';

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed top-0 right-0 left-0 lg:left-64 z-20 bg-white dark:bg-gray-800 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 ml-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Welcome back, {user?.fullName.split(' ')[0]}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(new Date().toISOString())}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.fullName}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};