import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  ClipboardList,
  FileSpreadsheet,
  Eye,
  Settings,
  PlaySquare,
  Telescope,
  HelpCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import SidebarBranding from './SidebarBranding';

const Sidebar = () => {
  const { user } = useAuthStore();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Cursos Académicos', path: '/academic-years' },
    { icon: ClipboardList, label: 'Registros Maestros', path: '/master-records' },
    { icon: Users, label: 'Usuarios', path: '/users' },
    { icon: PlaySquare, label: 'Acciones', path: '/actions' },
    { icon: FileSpreadsheet, label: 'Informes', path: '/reports' },
    { icon: Telescope, label: 'Observatorio', path: '/observatory' },
    { icon: HelpCircle, label: 'Ayuda', path: '/help' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ icon: Settings, label: 'Administración', path: '/admin' });
  }

  return (
    <aside className="bg-gray-800 text-white w-64 flex-shrink-0 flex flex-col h-full">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-xl font-bold">Red de Innovación FP</h2>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      
      <SidebarBranding />
    </aside>
  );
};

export default Sidebar;