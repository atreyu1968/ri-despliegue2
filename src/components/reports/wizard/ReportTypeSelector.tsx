import React from 'react';
import { FileText, BarChart2, Users, Target } from 'lucide-react';
import type { UserRole } from '../../../types/user';

interface ReportTypeSelectorProps {
  userRole?: UserRole;
  selectedType: string;
  onSelect: (type: string) => void;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  userRole,
  selectedType,
  onSelect,
}) => {
  const reportTypes = [
    {
      id: 'general',
      title: 'Informe General',
      description: 'Resumen completo de todas las acciones y participación',
      icon: FileText,
      roles: ['admin', 'general_coordinator'],
    },
    {
      id: 'network',
      title: 'Informe de Red',
      description: 'Análisis detallado de las acciones por red',
      icon: BarChart2,
      roles: ['admin', 'general_coordinator', 'subnet_coordinator'],
    },
    {
      id: 'center',
      title: 'Informe de Centro',
      description: 'Estadísticas y métricas específicas del centro',
      icon: Users,
      roles: ['admin', 'general_coordinator', 'subnet_coordinator', 'manager'],
    },
    {
      id: 'objectives',
      title: 'Cumplimiento de Objetivos',
      description: 'Análisis del progreso en objetivos estratégicos',
      icon: Target,
      roles: ['admin', 'general_coordinator', 'subnet_coordinator'],
    },
  ];

  // Filtrar tipos de informe según el rol
  const availableTypes = reportTypes.filter(type => 
    !userRole || type.roles.includes(userRole)
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Selecciona el Tipo de Informe
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Elige el tipo de informe que deseas generar según tus necesidades
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {availableTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`relative rounded-lg border p-4 text-left transition-all ${
              selectedType === type.id
                ? 'border-blue-600 ring-2 ring-blue-600'
                : 'border-gray-300 hover:border-blue-500'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg ${
                selectedType === type.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <type.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{type.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{type.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;