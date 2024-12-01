import React from 'react';
import { Copy } from 'lucide-react';
import { copyChartToClipboard } from '../../utils/chartUtils';

interface ChartContainerProps {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ id, title, description, children }) => {
  const [copying, setCopying] = React.useState(false);
  const [copySuccess, setCopySuccess] = React.useState(false);

  const handleCopy = async () => {
    setCopying(true);
    const success = await copyChartToClipboard(id);
    setCopySuccess(success);
    setTimeout(() => setCopySuccess(false), 2000);
    setCopying(false);
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <button
          onClick={handleCopy}
          disabled={copying}
          className={`p-2 rounded-lg transition-colors ${
            copySuccess
              ? 'bg-green-50 text-green-600'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
          title="Copiar gráfico"
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>
      <div id={id} className="bg-white p-4 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default ChartContainer;