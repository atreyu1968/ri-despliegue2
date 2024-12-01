import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface NetworkChartProps {
  data: Action[];
}

const NetworkChart: React.FC<NetworkChartProps> = ({ data }) => {
  const { networks } = useMasterRecordsStore();

  const chartData = networks
    .map(network => {
      const networkActions = data.filter(action => action.network === network.code);
      return {
        name: network.name,
        value: networkActions.length,
      };
    })
    .filter(item => item.value > 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Tooltip formatter={(value: number) => value.toLocaleString()} />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default NetworkChart;