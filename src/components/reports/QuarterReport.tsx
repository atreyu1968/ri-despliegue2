import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import CenterReport from './CenterReport';
import type { Action } from '../../types/action';
import type { Center } from '../../types/masterRecords';

interface QuarterReportProps {
  quarterId: string;
  actions: Action[];
  centers: Center[];
}

const QuarterReport: React.FC<QuarterReportProps> = ({ quarterId, actions, centers }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { activeYear } = useAcademicYearStore();

  const quarter = activeYear?.quarters.find(q => q.id === quarterId);
  const quarterActions = actions.filter(action => action.quarter === quarterId);

  // Totales del trimestre
  const totalActions = quarterActions.length;
  const totalStudents = quarterActions.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = quarterActions.reduce((sum, action) => sum + action.teacherParticipants, 0);

  if (!quarter || quarterActions.length === 0) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <h4 className="font-medium">{quarter.name}</h4>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{totalActions} acciones</span>
          <span>{totalStudents} estudiantes</span>
          <span>{totalTeachers} profesores</span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t">
          {/* Resumen del trimestre */}
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-4">
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
            </div>
          </div>

          {/* Reporte por centros */}
          <div className="p-4 space-y-4">
            {centers.map(center => (
              <CenterReport
                key={center.id}
                center={center}
                actions={quarterActions.filter(action => action.center === center.name)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuarterReport;