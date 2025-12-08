import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Élèves', path: '/students' },
    { icon: GraduationCap, label: 'Enseignants', path: '/teachers' },
    { icon: BookOpen, label: 'Classes', path: '/classes' },
    { icon: CreditCard, label: 'Paiements', path: '/payments' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary-600">École Manager</h1>
        <p className="text-sm text-gray-500">Système de gestion</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
