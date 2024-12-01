import React, { useState } from 'react';
import { Card } from '@tremor/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import QuarterReport from './QuarterReport';
import DetailedStats from './DetailedStats';
import type { Action } from '../../types/action';

interface NetworkReportProps {
  networkCode: string;
  actions: Action[];
}

const NetworkReport: React.FC<NetworkReportProps> = ({ networkCode, actions }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { networks, centers } = useMasterRecordsStore();
  const { activeYear } = useAcademicYearStore();

  const network = networks.find(n => n.code === networkCode);
  const networkActions = actions.filter(action => action.network === networkCode);
  const networkCenters = centers.filter(center => center.network === networkCode);

  // Totales de la red
  const totalActions = networkActions.length;
  const totalStudents = networkActions.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = networkActions.reduce((sum, action) => sum + action.teacherParticipants, 0);

  if (!network || networkActions.length === 0) return null;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <h3 className="text-lg font-medium">{network.name}</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>{totalActions} acciones</span>
          <span>{totalStudents} estudiantes</span>
          <span>{totalTeachers} profesores</span>
        </div>
      </button>

      {isExpanded && (
        <div className="border-t">
          {/* Resumen de la red */}
          <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Total Acciones</div>
                <div className="text-2xl font-semibold">{totalActions}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Estudiantes</div>
                <div className="text-2xl font-semibold">{totalStudents}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Total Profesores</div>
                <div className="text-2xl font-semibold">{totalTeachers}</div>
              </div>
            </div>
          </div>

          {/* Estadísticas detalladas */}
          <div className="p-4 border-t">
            <DetailedStats actions={networkActions} totalActions={totalActions} />
          </div>

          {/* Reporte por trimestres */}
          <div className="p-4 space-y-4 border-t">
            {activeYear?.quarters.map(quarter => (
              <QuarterReport
                key={quarter.id}
                quarterId={quarter.id}
                actions={networkActions}
                centers={networkCenters}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default NetworkReport;