import React from 'react';
import { LogOut, User, Calendar } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { activeYear } = useAcademicYearStore();

  return (
    <header className="bg-blue-900 text-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src="https://i.postimg.cc/YGjF7w3Z/logo-ateca.png"
            alt="Logo"
            className="h-12 w-auto brightness-0 invert"
          />
          <h1 className="text-xl font-semibold">
            Red de Innovación FP
          </h1>
        </div>

        <div className="flex items-center space-x-6">
          {activeYear && (
            <div className="flex items-center space-x-2 bg-blue-800 px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{activeYear.name}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span className="font-medium">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 hover:text-blue-200 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;