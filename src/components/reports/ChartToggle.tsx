import React from 'react';
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from 'lucide-react';

interface ChartToggleProps {
  type: 'bar' | 'pie';
  onChange: (type: 'bar' | 'pie') => void;
}

const ChartToggle: React.FC<ChartToggleProps> = ({ type, onChange }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onChange('bar')}
        className={`p-1.5 rounded ${
          type === 'bar' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Gráfico de barras"
      >
        <BarChartIcon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onChange('pie')}
        className={`p-1.5 rounded ${
          type === 'pie' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
        }`}
        title="Gráfico circular"
      >
        <PieChartIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChartToggle;