import React from 'react';
import { Copy } from 'lucide-react';
import { useActionsStore } from '../../../stores/actionsStore';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import ChartContainer from '../charts/ChartContainer';
import ParticipationChart from '../charts/ParticipationChart';
import NetworkChart from '../charts/NetworkChart';
import DepartmentChart from '../charts/DepartmentChart';
import ObjectiveChart from '../charts/ObjectiveChart';
import { copyChartToClipboard } from '../../../utils/chartUtils';

interface ReportChartsProps {
  filters: {
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

const ReportCharts: React.FC<ReportChartsProps> = ({ filters = {} }) => {
  const { actions } = useActionsStore();
  const { departments, families, objectives } = useMasterRecordsStore();

  // Filtrar acciones según los filtros aplicados
  const filteredActions = React.useMemo(() => {
    return actions.filter(action => {
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

  const handleCopyChart = async (chartId: string) => {
    const success = await copyChartToClipboard(chartId);
    if (success) {
      // Mostrar notificación de éxito
      alert('Gráfico copiado al portapapeles');
    } else {
      // Mostrar notificación de error
      alert('Error al copiar el gráfico');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Visualización de Datos
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {filteredActions.length} acciones encontradas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Participación */}
        <div className="bg-white rounded-lg shadow">
          <ChartContainer
            id="participation-chart"
            title="Participación"
            description="Distribución de estudiantes y profesores"
            onCopy={() => handleCopyChart('participation-chart')}
          >
            <ParticipationChart data={filteredActions} />
          </ChartContainer>
        </div>

        {/* Redes */}
        <div className="bg-white rounded-lg shadow">
          <ChartContainer
            id="network-chart"
            title="Distribución por Red"
            description="Acciones por red de innovación"
            onCopy={() => handleCopyChart('network-chart')}
          >
            <NetworkChart data={filteredActions} />
          </ChartContainer>
        </div>

        {/* Departamentos */}
        <div className="bg-white rounded-lg shadow">
          <ChartContainer
            id="department-chart"
            title="Distribución por Departamento"
            description="Acciones por departamento"
            onCopy={() => handleCopyChart('department-chart')}
          >
            <DepartmentChart data={filteredActions} />
          </ChartContainer>
        </div>

        {/* Objetivos */}
        <div className="bg-white rounded-lg shadow">
          <ChartContainer
            id="objective-chart"
            title="Cumplimiento de Objetivos"
            description="Acciones por objetivo estratégico"
            onCopy={() => handleCopyChart('objective-chart')}
          >
            <ObjectiveChart data={filteredActions} />
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default ReportCharts;