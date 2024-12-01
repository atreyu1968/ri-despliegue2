import React from 'react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import RatingStats from './RatingStats';
import type { Action } from '../../types/action';

interface DetailedStatsProps {
  actions: Action[];
  totalActions: number;
}

const DetailedStats: React.FC<DetailedStatsProps> = ({ actions, totalActions }) => {
  const { departments, families, objectives } = useMasterRecordsStore();

  // Estadísticas por departamento
  const departmentStats = departments.map(dept => {
    const deptActions = actions.filter(action => action.departments.includes(dept.code));
    return {
      name: dept.name,
      code: dept.code,
      count: deptActions.length,
      percentage: (deptActions.length / totalActions) * 100,
      students: deptActions.reduce((sum, action) => sum + action.studentParticipants, 0),
      teachers: deptActions.reduce((sum, action) => sum + action.teacherParticipants, 0),
    };
  }).filter(stat => stat.count > 0);

  // Estadísticas por familia profesional
  const familyStats = families.map(family => {
    const familyActions = actions.filter(action => action.professionalFamilies.includes(family.code));
    return {
      name: family.name,
      code: family.code,
      count: familyActions.length,
      percentage: (familyActions.length / totalActions) * 100,
      students: familyActions.reduce((sum, action) => sum + action.studentParticipants, 0),
      teachers: familyActions.reduce((sum, action) => sum + action.teacherParticipants, 0),
    };
  }).filter(stat => stat.count > 0);

  // Estadísticas por objetivo
  const objectiveStats = objectives
    .filter(obj => obj.isActive)
    .map(objective => {
      const objActions = actions.filter(action => action.objectives.includes(objective.id));
      return {
        name: objective.name,
        id: objective.id,
        count: objActions.length,
        percentage: (objActions.length / totalActions) * 100,
        students: objActions.reduce((sum, action) => sum + action.studentParticipants, 0),
        teachers: objActions.reduce((sum, action) => sum + action.teacherParticipants, 0),
        priority: objective.priority,
      };
    }).filter(stat => stat.count > 0);

  return (
    <div className="space-y-6">
      {/* Valoraciones */}
      <RatingStats actions={actions} />

      {/* Departamentos */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">Departamentos</h6>
        <div className="space-y-2">
          {departmentStats.map(stat => (
            <div key={stat.code} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{stat.name}</span>
                <span className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</span>
              </div>
              <div className="mt-1 text-sm text-gray-600 flex justify-between">
                <span>{stat.count} acciones</span>
                <span>{stat.students} estudiantes, {stat.teachers} profesores</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Familias Profesionales */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">Familias Profesionales</h6>
        <div className="space-y-2">
          {familyStats.map(stat => (
            <div key={stat.code} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{stat.name}</span>
                <span className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</span>
              </div>
              <div className="mt-1 text-sm text-gray-600 flex justify-between">
                <span>{stat.count} acciones</span>
                <span>{stat.students} estudiantes, {stat.teachers} profesores</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objetivos */}
      <div>
        <h6 className="text-sm font-medium text-gray-700 mb-2">Objetivos</h6>
        <div className="space-y-2">
          {objectiveStats.map(stat => (
            <div key={stat.id} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{stat.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    stat.priority === 'high' ? 'bg-red-100 text-red-700' :
                    stat.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {stat.priority === 'high' ? 'Alta' :
                     stat.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">{stat.percentage.toFixed(1)}%</span>
              </div>
              <div className="mt-1 text-sm text-gray-600 flex justify-between">
                <span>{stat.count} acciones</span>
                <span>{stat.students} estudiantes, {stat.teachers} profesores</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedStats;