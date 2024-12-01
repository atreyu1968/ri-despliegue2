import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { Action } from '../../types/action';
import type { Center } from '../../types/masterRecords';

interface CenterReportProps {
  center: Center;
  actions: Action[];
}

const CenterReport: React.FC<CenterReportProps> = ({ center, actions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { departments, families, objectives } = useMasterRecordsStore();

  // Totales del centro
  const totalActions = actions.length;
  const totalStudents = actions.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = actions.reduce((sum, action) => sum + action.teacherParticipants, 0);

  // Valoración media
  const averageRating = actions.reduce((sum, action) => sum + action.rating, 0) / totalActions;

  // Estadísticas por departamento
  const departmentStats = departments
    .map(dept => {
      const deptActions = actions.filter(action => action.departments.includes(dept.code));
      return {
        name: dept.name,
        count: deptActions.length,
        percentage: (deptActions.length / totalActions) * 100,
        students: deptActions.reduce((sum, action) => sum + action.studentParticipants, 0),
        teachers: deptActions.reduce((sum, action) => sum + action.teacherParticipants, 0),
      };
    })
    .filter(stat => stat.count > 0);

  // Estadísticas por familia profesional
  const familyStats = families
    .map(family => {
      const familyActions = actions.filter(action => action.professionalFamilies.includes(family.code));
      return {
        name: family.name,
        count: familyActions.length,
        percentage: (familyActions.length / totalActions) * 100,
        students: familyActions.reduce((sum, action) => sum + action.studentParticipants, 0),
        teachers: familyActions.reduce((sum, action) => sum + action.teacherParticipants, 0),
      };
    })
    .filter(stat => stat.count > 0);

  // Estadísticas por objetivo
  const objectiveStats = objectives
    .filter(obj => obj.isActive)
    .map(objective => {
      const objActions = actions.filter(action => action.objectives.includes(objective.id));
      return {
        name: objective.name,
        count: objActions.length,
        percentage: (objActions.length / totalActions) * 100,
        students: objActions.reduce((sum, action) => sum + action.studentParticipants, 0),
        teachers: objActions.reduce((sum, action) => sum + action.teacherParticipants, 0),
        priority: objective.priority,
      };
    })
    .filter(stat => stat.count > 0);

  if (actions.length === 0) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <h5 className="font-medium">{center.name}</h5>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{totalActions} acciones</span>
          <span>{totalStudents} estudiantes</span>
          <span>{totalTeachers} profesores</span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t p-4">
          <div className="space-y-6">
            {/* Resumen del centro */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total Acciones</div>
                <div className="text-xl font-semibold">{totalActions}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Estudiantes</div>
                <div className="text-xl font-semibold">{totalStudents}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Profesores</div>
                <div className="text-xl font-semibold">{totalTeachers}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Valoración Media</div>
                <div className="text-xl font-semibold">{averageRating.toFixed(1)}</div>
              </div>
            </div>

            {/* Estadísticas por departamento */}
            {departmentStats.length > 0 && (
              <div>
                <h6 className="text-sm font-medium text-gray-700 mb-2">Por Departamentos</h6>
                <div className="space-y-2">
                  {departmentStats.map(stat => (
                    <div key={stat.name} className="bg-gray-50 p-3 rounded-lg">
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
            )}

            {/* Estadísticas por familia profesional */}
            {familyStats.length > 0 && (
              <div>
                <h6 className="text-sm font-medium text-gray-700 mb-2">Por Familias Profesionales</h6>
                <div className="space-y-2">
                  {familyStats.map(stat => (
                    <div key={stat.name} className="bg-gray-50 p-3 rounded-lg">
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
            )}

            {/* Estadísticas por objetivo */}
            {objectiveStats.length > 0 && (
              <div>
                <h6 className="text-sm font-medium text-gray-700 mb-2">Por Objetivos</h6>
                <div className="space-y-2">
                  {objectiveStats.map(stat => (
                    <div key={stat.name} className="bg-gray-50 p-3 rounded-lg">
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterReport;