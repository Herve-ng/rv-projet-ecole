import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Archive,
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
    { icon: Archive, label: 'Archives', path: '/archives' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-gradient-to-b from-secondary-700 to-secondary-900 h-screen shadow-2xl fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-secondary-600">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">École Manager</h1>
          </div>
        </div>
        <p className="text-xs text-secondary-200 pl-13">Système de gestion scolaire</p>
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
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                      : 'text-secondary-100 hover:bg-secondary-600 hover:text-white'
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
      <div className="p-4 border-t border-secondary-600">
        <button
          onClick={logout}
          className="flex items-center w-full px-4 py-3 text-secondary-100 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
