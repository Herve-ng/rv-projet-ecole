import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Header = ({ title }) => {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Administrateur'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
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
