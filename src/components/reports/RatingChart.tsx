import React from 'react';
import { BarChart, DonutChart } from '@tremor/react';
import type { Action } from '../../types/action';

interface RatingChartProps {
  actions: Action[];
  type: 'bar' | 'pie';
}

const RatingChart: React.FC<RatingChartProps> = ({ actions, type }) => {
  const total = actions.length;
  const colors = ['red', 'orange', 'yellow', 'lime', 'green'];
  
  const ratingDistribution = Array.from({ length: 5 }, (_, i) => {
    const rating = i + 1;
    const count = actions.filter(action => action.rating === rating).length;
    return {
      name: `${rating} ${rating === 1 ? 'estrella' : 'estrellas'}`,
      value: count,
      percentage: total > 0 ? (count / total) * 100 : 0,
      color: colors[i],
    };
  }).filter(item => item.value > 0);

  if (type === 'bar') {
    return (
      <div>
        <BarChart
          data={ratingDistribution}
          index="name"
          categories={['value']}
          colors={colors}
          valueFormatter={(value) => value.toLocaleString()}
          yAxisWidth={48}
          className="h-72"
        />
        <div className="mt-4 space-y-2">
          {ratingDistribution.map((item, index) => (
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
        data={ratingDistribution}
        index="name"
        category="percentage"
        colors={colors}
        valueFormatter={(value) => `${value.toFixed(1)}%`}
        className="h-72"
        showAnimation={true}
        showTooltip={true}
      />
      <div className="mt-4 space-y-2">
        {ratingDistribution.map((item, index) => (
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

export default RatingChart;