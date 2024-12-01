import React, { useState, useRef } from 'react';
import { FileSpreadsheet, FileText, Download, Check } from 'lucide-react';
import { exportToExcel } from '../../../utils/exportUtils';
import { generatePDF } from '../../../utils/pdfGenerator';
import { useActionsStore } from '../../../stores/actionsStore';
import { toPng } from 'html-to-image';

interface ReportExportProps {
  config: {
    type: string;
    filters: any;
    format: string;
  };
  onFormatChange: (format: string) => void;
}

const ReportExport: React.FC<ReportExportProps> = ({ config, onFormatChange }) => {
  const { actions } = useActionsStore();
  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      // Filter actions based on config
      const filteredActions = actions.filter(action => {
        if (config.filters.startDate && action.startDate < config.filters.startDate) return false;
        if (config.filters.endDate && action.endDate > config.filters.endDate) return false;
        if (config.filters.network && action.network !== config.filters.network) return false;
        if (config.filters.center && action.center !== config.filters.center) return false;
        if (config.filters.quarter && action.quarter !== config.filters.quarter) return false;
        if (config.filters.department && !action.departments.includes(config.filters.department)) return false;
        if (config.filters.family && !action.professionalFamilies.includes(config.filters.family)) return false;
        if (config.filters.objectives?.length && !config.filters.objectives.some(obj => action.objectives.includes(obj))) return false;
        return true;
      });

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `informe_${config.type}_${timestamp}`;

      // Get chart images
      const chartImages: { [key: string]: string } = {};
      const chartIds = ['participation-chart', 'network-chart', 'department-chart', 'objective-chart'];
      
      for (const id of chartIds) {
        const element = document.getElementById(id);
        if (element) {
          try {
            const dataUrl = await toPng(element, {
              backgroundColor: '#ffffff',
              quality: 1.0,
              pixelRatio: 2,
            });
            chartImages[id] = dataUrl;
          } catch (err) {
            console.error(`Error capturing chart ${id}:`, err);
          }
        }
      }

      // Export based on format
      if (config.format === 'excel') {
        const success = await exportToExcel(filteredActions, config.filters, filename);
        if (!success) {
          throw new Error('Error exporting to Excel');
        }
      } else if (config.format === 'pdf') {
        await generatePDF(filteredActions, config.filters, chartImages);
      }

      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Error al exportar el informe. Por favor, inténtelo de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Exportar Informe
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Selecciona el formato de exportación
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onFormatChange('excel')}
          className={`relative rounded-lg border p-4 text-left transition-all ${
            config.format === 'excel'
              ? 'border-blue-600 ring-2 ring-blue-600'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              config.format === 'excel' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Excel</h3>
              <p className="mt-1 text-sm text-gray-500">
                Exportar a Microsoft Excel (.xlsx)
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => onFormatChange('pdf')}
          className={`relative rounded-lg border p-4 text-left transition-all ${
            config.format === 'pdf'
              ? 'border-blue-600 ring-2 ring-blue-600'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              config.format === 'pdf' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">PDF</h3>
              <p className="mt-1 text-sm text-gray-500">
                Exportar a PDF con gráficos
              </p>
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExport}
          disabled={exporting}
          className={`
            flex items-center space-x-2 px-6 py-3 text-white rounded-lg
            transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
            ${exported
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
            }
            ${exporting ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {exported ? (
            <>
              <Check className="w-5 h-5" />
              <span>¡Exportado!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>{exporting ? 'Exportando...' : 'Exportar Informe'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportExport;