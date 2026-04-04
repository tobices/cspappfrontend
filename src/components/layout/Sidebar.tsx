import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Heart, 
  History, 
  Calendar,
  Users,
  Wallet,
  Mail,
  Church,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/helpers';

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  const memberLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'My Profile' },
    { to: '/donate', icon: Heart, label: 'Make Donation' },
    { to: '/donation-history', icon: History, label: 'Donation History' },
    { to: '/events', icon: Calendar, label: 'Events' },
  ];

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { to: '/admin/members', icon: Users, label: 'Members' },
    { to: '/admin/donations', icon: Wallet, label: 'Donations' },
    { to: '/admin/events', icon: Calendar, label: 'Events' },
    { to: '/admin/comms', icon: Mail, label: 'Communications' },
    { to: '/admin/profile', icon: User, label: 'My Profile' },
  ];

  const links = isAdmin ? adminLinks : memberLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      <div className="flex items-center justify-center p-6 border-b border-gray-200 dark:border-gray-700">
        <Church className="w-8 h-8 text-gold-600" />
        <span className="ml-2 text-xl font-bold text-primary-600 dark:text-primary-400">CSPAPP</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )
            }
          >
            <link.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </div>

      {/* Mobile Sidebar Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 z-50 lg:hidden animate-slide-up">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
};