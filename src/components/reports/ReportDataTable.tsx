import React from 'react';
import { Card } from '@tremor/react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import NetworkReport from './NetworkReport';
import DetailedStats from './DetailedStats';
import type { Action } from '../../types/action';

interface ReportDataTableProps {
  actions: Action[];
  showNetworkReports: boolean;
  userNetwork?: string;
  userCenter?: string;
}

const ReportDataTable: React.FC<ReportDataTableProps> = ({ 
  actions, 
  showNetworkReports,
  userNetwork,
  userCenter 
}) => {
  const { networks } = useMasterRecordsStore();

  // Totales generales
  const totalActions = actions.length;
  const totalStudents = actions.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = actions.reduce((sum, action) => sum + action.teacherParticipants, 0);

  // Filter networks based on user permissions
  const visibleNetworks = networks.filter(network => {
    if (!showNetworkReports) return false;
    if (!userNetwork) return true; // Admin or general coordinator
    return network.code === userNetwork; // Subnet coordinator
  });

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <Card>
        <div className="space-y-6">
          <h3 className="text-lg font-medium">
            {userCenter ? 'Resumen del Centro' :
             userNetwork ? 'Resumen de la Red' :
             'Resumen General'}
          </h3>
          
          {/* Métricas principales */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Acciones</div>
              <div className="text-2xl font-semibold">{totalActions}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Estudiantes</div>
              <div className="text-2xl font-semibold">{totalStudents}</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Total Profesores</div>
              <div className="text-2xl font-semibold">{totalTeachers}</div>
            </div>
          </div>

          {/* Estadísticas detalladas */}
          {totalActions > 0 && (
            <div className="border-t pt-6">
              <DetailedStats 
                actions={actions} 
                totalActions={totalActions} 
              />
            </div>
          )}
        </div>
      </Card>

      {/* Reportes por Red */}
      {showNetworkReports && (
        <div className="space-y-4">
          {visibleNetworks.map(network => (
            <NetworkReport
              key={network.id}
              networkCode={network.code}
              actions={actions}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportDataTable;