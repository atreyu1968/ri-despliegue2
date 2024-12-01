import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface DepartmentChartProps {
  data: Action[];
}

const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  const { departments } = useMasterRecordsStore();

  const chartData = departments
    .map(department => {
      const deptActions = data.filter(action => 
        action.departments.includes(department.code)
      );
      return {
        name: department.name,
        value: deptActions.length,
      };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip formatter={(value: number) => value.toLocaleString()} />
        <Bar dataKey="value" fill="#9333ea" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DepartmentChart;