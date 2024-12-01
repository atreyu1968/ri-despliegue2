import React from 'react';
import { Users, Calendar, Target, Building2 } from 'lucide-react';
import type { Action } from '../../../types/action';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';

interface DataSummaryProps {
  data: Action[];
}

const DataSummary: React.FC<DataSummaryProps> = ({ data }) => {
  const { departments, families, objectives } = useMasterRecordsStore();

  // Calcular estadísticas
  const totalActions = data.length;
  const totalStudents = data.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = data.reduce((sum, action) => sum + action.teacherParticipants, 0);
  
  const uniqueDepartments = new Set(
    data.flatMap(action => action.departments)
  ).size;
  
  const uniqueFamilies = new Set(
    data.flatMap(action => action.professionalFamilies)
  ).size;
  
  const uniqueObjectives = new Set(
    data.flatMap(action => action.objectives)
  ).size;

  const averageRating = data.reduce((sum, action) => sum + action.rating, 0) / totalActions;

  const stats = [
    {
      name: 'Total Acciones',
      value: totalActions,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      name: 'Participantes',
      value: `${totalStudents} estudiantes, ${totalTeachers} profesores`,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      name: 'Departamentos',
      value: uniqueDepartments,
      icon: Building2,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      name: 'Objetivos',
      value: uniqueObjectives,
      icon: Target,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow p-4 border border-gray-200"
        >
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">{stat.name}</p>
              <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataSummary;