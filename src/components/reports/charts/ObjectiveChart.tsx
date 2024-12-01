import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface ObjectiveChartProps {
  data: Action[];
}

const ObjectiveChart: React.FC<ObjectiveChartProps> = ({ data }) => {
  const { objectives } = useMasterRecordsStore();
  const activeObjectives = objectives.filter(obj => obj.isActive);

  const chartData = activeObjectives
    .map(objective => {
      const objActions = data.filter(action => 
        action.objectives.includes(objective.id)
      );
      return {
        name: objective.name,
        value: objActions.length,
        priority: objective.priority,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  const getColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip formatter={(value: number) => value.toLocaleString()} />
        <Bar 
          dataKey="value" 
          fill="#3b82f6"
          shape={(props: any) => {
            const { fill, x, y, width, height } = props;
            const item = chartData[props.index];
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={getColor(item.priority)}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ObjectiveChart;