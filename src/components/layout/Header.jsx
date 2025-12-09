import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Header = ({ title }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-gradient-to-r from-white to-secondary-50 shadow-md border-b border-secondary-100 sticky top-0 z-10 backdrop-blur-sm bg-opacity-95">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div className="flex items-center space-x-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-secondary-700 to-primary-600 bg-clip-text text-transparent">{title}</h2>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border-2 border-secondary-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-64 bg-white transition-all"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-secondary-600 hover:bg-primary-100 rounded-xl transition-all duration-200 group">
              <Bell className="w-6 h-6 group-hover:text-primary-600 transition-colors" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l-2 border-secondary-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-secondary-700">{user?.name || 'Administrateur'}</p>
                <p className="text-xs text-secondary-500">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center shadow-lg ring-2 ring-primary-200">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
