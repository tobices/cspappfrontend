import { Menu, Moon, Sun } from 'lucide-react';
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDate } from '../../utils/helpers';
import { Notifications } from '../ui/Notifications';
import { UserMenu } from '../ui/UserMenu';

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
            Welcome back, {user?.fullName?.split(' ')[0]}!
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

          <Notifications />

          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  );
};