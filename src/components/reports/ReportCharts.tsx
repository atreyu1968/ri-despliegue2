import React from 'react';
import { Card } from '@tremor/react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { Action } from '../../types/action';
import ChartContainer from './ChartContainer';
import ChartToggle from './ChartToggle';
import ParticipationChart from './ParticipationChart';
import RatingChart from './RatingChart';
import NetworkChart from './NetworkChart';
import CenterChart from './CenterChart';
import QuarterChart from './QuarterChart';
import ObjectiveChart from './ObjectiveChart';
import DepartmentChart from './DepartmentChart';

interface ReportChartsProps {
  actions: Action[];
}

const ReportCharts: React.FC<ReportChartsProps> = ({ actions }) => {
  const [chartTypes, setChartTypes] = React.useState({
    participation: 'bar' as const,
    rating: 'bar' as const,
    department: 'bar' as const,
    network: 'bar' as const,
    center: 'bar' as const,
    quarter: 'bar' as const,
    objective: 'bar' as const,
  });

  const handleChartTypeChange = (chart: keyof typeof chartTypes, type: 'bar' | 'pie') => {
    setChartTypes(prev => ({ ...prev, [chart]: type }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <ChartContainer
          id="participation-chart"
          title="Participación por Tipo"
          description="Distribución de estudiantes y profesores"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.participation}
              onChange={(type) => handleChartTypeChange('participation', type)}
            />
          </div>
          <ParticipationChart actions={actions} type={chartTypes.participation} />
        </ChartContainer>
      </Card>

      <Card>
        <ChartContainer
          id="rating-chart"
          title="Valoración Media"
          description="Puntuación media de las acciones"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.rating}
              onChange={(type) => handleChartTypeChange('rating', type)}
            />
          </div>
          <RatingChart actions={actions} type={chartTypes.rating} />
        </ChartContainer>
      </Card>

      <Card>
        <ChartContainer
          id="network-chart"
          title="Participación por Red"
          description="Distribución por redes de innovación"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.network}
              onChange={(type) => handleChartTypeChange('network', type)}
            />
          </div>
          <NetworkChart actions={actions} type={chartTypes.network} />
        </ChartContainer>
      </Card>

      <Card>
        <ChartContainer
          id="center-chart"
          title="Participación por Centro"
          description="Distribución por centros educativos"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.center}
              onChange={(type) => handleChartTypeChange('center', type)}
            />
          </div>
          <CenterChart actions={actions} type={chartTypes.center} />
        </ChartContainer>
      </Card>

      <Card>
        <ChartContainer
          id="quarter-chart"
          title="Participación por Trimestre"
          description="Distribución temporal de acciones"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.quarter}
              onChange={(type) => handleChartTypeChange('quarter', type)}
            />
          </div>
          <QuarterChart actions={actions} type={chartTypes.quarter} />
        </ChartContainer>
      </Card>

      <Card>
        <ChartContainer
          id="department-chart"
          title="Participación por Departamento"
          description="Distribución por departamentos"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.department}
              onChange={(type) => handleChartTypeChange('department', type)}
            />
          </div>
          <DepartmentChart actions={actions} type={chartTypes.department} />
        </ChartContainer>
      </Card>

      <Card className="md:col-span-2">
        <ChartContainer
          id="objective-chart"
          title="Cumplimiento de Objetivos"
          description="Distribución por objetivos estratégicos"
        >
          <div className="flex justify-end mb-4">
            <ChartToggle
              type={chartTypes.objective}
              onChange={(type) => handleChartTypeChange('objective', type)}
            />
          </div>
          <ObjectiveChart actions={actions} type={chartTypes.objective} />
        </ChartContainer>
      </Card>
    </div>
  );
};

export default ReportCharts;