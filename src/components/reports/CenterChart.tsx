import React from 'react';
import { BarChart, DonutChart } from '@tremor/react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { Action } from '../../types/action';

interface CenterChartProps {
  actions: Action[];
  type: 'bar' | 'pie';
}

const CenterChart: React.FC<CenterChartProps> = ({ actions, type }) => {
  const { centers } = useMasterRecordsStore();
  const total = actions.length;

  const data = centers.map(center => {
    const count = actions.filter(action => action.center === center.name).length;
    return {
      name: center.name,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    };
  });

  if (type === 'bar') {
    return (
      <BarChart
        data={data}
        index="name"
        categories={['value']}
        colors={['green']}
        valueFormatter={(value) => value.toLocaleString()}
        yAxisWidth={48}
        showLegend={false}
        className="h-72"
      />
    );
  }

  return (
    <DonutChart
      data={data}
      index="name"
      category="percentage"
      valueFormatter={(value) => `${value.toFixed(1)}%`}
      colors={['green', 'emerald', 'teal']}
      className="h-72"
    />
  );
};

export default CenterChart;