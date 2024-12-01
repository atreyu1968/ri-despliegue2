import React from 'react';
import DataTable from '../preview/DataTable';
import DataSummary from '../preview/DataSummary';
import type { Action } from '../../../types/action';
import { useActionsStore } from '../../../stores/actionsStore';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';

interface ReportPreviewProps {
  filters?: {
    startDate?: string;
    endDate?: string;
    network?: string;
    center?: string;
    quarter?: string;
    department?: string;
    family?: string;
    objectives?: string[];
  };
}

const ReportPreview: React.FC<ReportPreviewProps> = ({ filters = {} }) => {
  const { actions } = useActionsStore();
  const { departments, families, objectives } = useMasterRecordsStore();

  // Filtrar acciones según los filtros aplicados
  const filteredActions = React.useMemo(() => {
    return actions.filter(action => {
      // Si no hay filtros, mostrar todas las acciones
      if (Object.keys(filters).length === 0) return true;

      // Aplicar filtros solo si están definidos
      if (filters.startDate && action.startDate < filters.startDate) return false;
      if (filters.endDate && action.endDate > filters.endDate) return false;
      if (filters.network && action.network !== filters.network) return false;
      if (filters.center && action.center !== filters.center) return false;
      if (filters.quarter && action.quarter !== filters.quarter) return false;
      if (filters.department && !action.departments.includes(filters.department)) return false;
      if (filters.family && !action.professionalFamilies.includes(filters.family)) return false;
      if (filters.objectives?.length && !action.objectives.some(obj => filters.objectives?.includes(obj))) return false;

      return true;
    });
  }, [actions, filters]);

  // Definir columnas para la tabla
  const columns = [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
    },
    {
      key: 'startDate',
      label: 'Fecha Inicio',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'endDate',
      label: 'Fecha Fin',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
    {
      key: 'center',
      label: 'Centro',
      sortable: true,
    },
    {
      key: 'departments',
      label: 'Departamentos',
      render: (value: string[]) => value
        .map(code => departments.find(d => d.code === code)?.name || code)
        .join(', '),
    },
    {
      key: 'studentParticipants',
      label: 'Estudiantes',
      sortable: true,
    },
    {
      key: 'teacherParticipants',
      label: 'Profesores',
      sortable: true,
    },
    {
      key: 'rating',
      label: 'Valoración',
      sortable: true,
      render: (value: number) => '⭐'.repeat(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Vista Previa del Informe
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {filteredActions.length} acciones encontradas
        </p>
      </div>

      {/* Resumen de datos */}
      <DataSummary data={filteredActions} />

      {/* Tabla de datos */}
      <DataTable
        data={filteredActions}
        columns={columns}
        pageSize={10}
      />
    </div>
  );
};

export default ReportPreview;