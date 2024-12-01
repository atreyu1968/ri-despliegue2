import React from 'react';
import { BarChart, DonutChart } from '@tremor/react';
import type { Action } from '../../types/action';

interface ParticipationChartProps {
  actions: Action[];
  type: 'bar' | 'pie';
}

const ParticipationChart: React.FC<ParticipationChartProps> = ({ actions, type }) => {
  const totalStudents = actions.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = actions.reduce((sum, action) => sum + action.teacherParticipants, 0);
  const total = totalStudents + totalTeachers;

  const data = [
    {
      name: 'Estudiantes',
      value: totalStudents,
      percentage: total > 0 ? (totalStudents / total) * 100 : 0,
    },
    {
      name: 'Profesores',
      value: totalTeachers,
      percentage: total > 0 ? (totalTeachers / total) * 100 : 0,
    },
  ].filter(item => item.value > 0);

  if (type === 'bar') {
    return (
      <div>
        <BarChart
          data={data}
          index="name"
          categories={['value']}
          colors={['blue', 'indigo']}
          valueFormatter={(value) => value.toLocaleString()}
          yAxisWidth={48}
          className="h-72"
        />
        <div className="mt-4 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full bg-${index === 0 ? 'blue' : 'indigo'}-500`} />
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
        colors={['blue', 'indigo']}
        valueFormatter={(value) => `${value.toFixed(1)}%`}
        className="h-72"
        showAnimation={true}
        showTooltip={true}
      />
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full bg-${index === 0 ? 'blue' : 'indigo'}-500`} />
              <span>{item.name}</span>
            </div>
            <span>{item.value.toLocaleString()} ({item.percentage.toFixed(1)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipationChart;