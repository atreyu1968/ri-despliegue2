import React, { useRef, useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { read, utils } from 'xlsx';
import type { CsvImportData, ImportError } from '../../types/observatory';

interface CsvImportProps {
  onImport: (data: CsvImportData[]) => void;
  onClose: () => void;
  errors: ImportError[];
}

const CsvImport: React.FC<CsvImportProps> = ({ onImport, onClose, errors }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<CsvImportData[]>([]);
  const [hasPreview, setHasPreview] = useState(false);

  const downloadTemplate = () => {
    const template = [
      {
        type: 'practice',
        network: 'RED-INNOVA-1',
        title: 'Ejemplo de título',
        topic: 'Metodologías Innovadoras',
        description: 'Descripción detallada del registro (mínimo 100 caracteres)',
        resourceUrl: 'https://ejemplo.com/recurso',
        publishDate: '2024-03-20',
        tags: 'etiqueta1,etiqueta2,etiqueta3',
      },
    ];

    const ws = utils.json_to_sheet(template);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Plantilla');
    utils.writeFile(wb, 'plantilla_observatorio.xlsx');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workbook = read(event.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = utils.sheet_to_json(worksheet) as CsvImportData[];
        setPreview(data);
        setHasPreview(true);
      } catch (error) {
        console.error('Error reading file:', error);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    onImport(preview);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Importar Registros</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Plantilla</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Upload className="w-5 h-5" />
              <span>Seleccionar Archivo</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-medium">Errores de Validación</h3>
              </div>
              <ul className="space-y-1 text-sm text-red-600">
                {errors.map((error, index) => (
                  <li key={index}>
                    Fila {error.row}: {error.message} ({error.field})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasPreview && (
            <>
              <div className="border rounded-lg overflow-hidden mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Red
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Título
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Temática
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preview.slice(0, 5).map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.network}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.topic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleImport}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Importar {preview.length} Registros
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CsvImport;