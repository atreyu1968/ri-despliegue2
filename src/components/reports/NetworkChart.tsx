import React from 'react';
import { BarChart, DonutChart } from '@tremor/react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { Action } from '../../types/action';

interface NetworkChartProps {
  actions: Action[];
  type: 'bar' | 'pie';
}

const NetworkChart: React.FC<NetworkChartProps> = ({ actions, type }) => {
  const { networks } = useMasterRecordsStore();
  const total = actions.length;
  const colors = ['blue', 'indigo', 'cyan', 'sky', 'teal'];

  const data = networks.map((network, index) => {
    const count = actions.filter(action => action.network === network.code).length;
    return {
      name: network.name,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: colors[index % colors.length],
    };
  }).filter(item => item.value > 0);

  if (type === 'bar') {
    return (
      <div>
        <BarChart
          data={data}
          index="name"
          categories={['value']}
          colors={colors}
          valueFormatter={(value) => value.toLocaleString()}
          yAxisWidth={48}
          className="h-72"
        />
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
                <span>{item.name}</span>
              </div>
              <span>{item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <DonutChart
        data={data}
        index="name"
        category="percentage"
        colors={colors}
        valueFormatter={(value) => `${value.toFixed(1)}%`}
        className="h-72"
        showAnimation={true}
        showTooltip={true}
      />
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-${item.color}-500`} />
              <span>{item.name}</span>
            </div>
            <span>{item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkChart;