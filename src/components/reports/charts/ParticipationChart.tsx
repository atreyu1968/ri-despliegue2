import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { Action } from '../../../types/action';

interface ParticipationChartProps {
  data: Action[];
}

const COLORS = ['#3b82f6', '#6366f1'];

const ParticipationChart: React.FC<ParticipationChartProps> = ({ data }) => {
  const totalStudents = data.reduce((sum, action) => sum + action.studentParticipants, 0);
  const totalTeachers = data.reduce((sum, action) => sum + action.teacherParticipants, 0);

  const chartData = [
    { name: 'Estudiantes', value: totalStudents },
    { name: 'Profesores', value: totalTeachers },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => value.toLocaleString()}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ParticipationChart;