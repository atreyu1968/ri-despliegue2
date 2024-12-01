import React, { useRef, useState } from 'react';
import { X, Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { useAuthStore } from '../../stores/authStore';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { Action } from '../../types/action';

interface ImportError {
  row: number;
  field: string;
  message: string;
  data: any;
}

interface ImportStats {
  total: number;
  success: number;
  errors: number;
  timestamp: string;
}

interface ImportActionsProps {
  onImport: (actions: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  onClose: () => void;
}

const ImportActions: React.FC<ImportActionsProps> = ({ onImport, onClose }) => {
  const { user } = useAuthStore();
  const { centers, networks } = useMasterRecordsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [stats, setStats] = useState<ImportStats | null>(null);

  const validateField = (value: any, field: string, row: number): ImportError | null => {
    switch (field) {
      case 'center':
        if (!value) return null; // Allow empty value for partial import
        const centerExists = centers.some(c => c.name === value);
        if (!centerExists) {
          return {
            row,
            field,
            message: 'El centro no existe en los registros maestros',
            data: value,
          };
        }
        break;
      case 'network':
        if (!value) return null; // Allow empty value for partial import
        const networkExists = networks.some(n => n.code === value);
        if (!networkExists) {
          return {
            row,
            field,
            message: 'La red no existe en los registros maestros',
            data: value,
          };
        }
        break;
      case 'startDate':
      case 'endDate':
        if (!value) return null; // Allow empty value for partial import
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          return {
            row,
            field,
            message: 'Formato de fecha inválido (YYYY-MM-DD)',
            data: value,
          };
        }
        break;
      case 'studentParticipants':
      case 'teacherParticipants':
        if (!value) return null; // Allow empty value for partial import
        const num = parseInt(value);
        if (isNaN(num) || num < 0) {
          return {
            row,
            field,
            message: 'Debe ser un número positivo',
            data: value,
          };
        }
        break;
      case 'rating':
        if (!value) return null; // Allow empty value for partial import
        const rating = parseInt(value);
        if (isNaN(rating) || rating < 1 || rating > 5) {
          return {
            row,
            field,
            message: 'La valoración debe estar entre 1 y 5',
            data: value,
          };
        }
        break;
    }
    return null;
  };

  const validateAction = (row: any, index: number): ImportError[] => {
    const errors: ImportError[] = [];
    const rowNum = index + 2; // +2 because Excel rows start at 1 and we have a header

    // Validate each field independently
    Object.entries(row).forEach(([field, value]) => {
      const error = validateField(value, field, rowNum);
      if (error) {
        errors.push(error);
      }
    });

    // Validate center-network relationship
    if (row.center && row.network) {
      const center = centers.find(c => c.name === row.center);
      if (center && center.network !== row.network) {
        errors.push({
          row: rowNum,
          field: 'center',
          message: 'El centro no pertenece a la red especificada',
          data: row.center,
        });
      }
    }

    // Validate date range
    if (row.startDate && row.endDate) {
      const start = new Date(row.startDate);
      const end = new Date(row.endDate);
      if (end < start) {
        errors.push({
          row: rowNum,
          field: 'endDate',
          message: 'La fecha de fin debe ser posterior a la fecha de inicio',
          data: row.endDate,
        });
      }
    }

    return errors;
  };

  const downloadTemplate = () => {
    const template = [{
      name: 'Nombre de la acción',
      location: 'Ubicación',
      description: 'Descripción detallada',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      departments: 'DEP-INF,DEP-ADM',
      professionalFamilies: 'INF,ADM',
      selectedGroups: 'DAW1,DAW2',
      studentParticipants: 20,
      teacherParticipants: 2,
      rating: 5,
      comments: 'Comentarios opcionales',
      network: 'RED-INNOVA-1',
      center: 'CIFP César Manrique',
      quarter: '1-2',
      objectives: '1,2,3',
    }];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla');
    XLSX.writeFile(wb, 'plantilla_acciones.xlsx');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setErrors([]);
    setStats(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Validate all rows
          const allErrors: ImportError[] = [];
          const actionsToImport: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>[] = [];

          jsonData.forEach((row: any, index) => {
            const rowErrors = validateAction(row, index);
            
            // Transform data, keeping only valid fields
            const action: Omit<Action, 'id' | 'createdAt' | 'updatedAt'> = {
              name: row.name || '',
              location: row.location || '',
              description: row.description || '',
              startDate: row.startDate || new Date().toISOString().split('T')[0],
              endDate: row.endDate || new Date().toISOString().split('T')[0],
              departments: row.departments?.split(',').map((d: string) => d.trim()) || [],
              professionalFamilies: row.professionalFamilies?.split(',').map((f: string) => f.trim()) || [],
              selectedGroups: row.selectedGroups?.split(',').map((g: string) => g.trim()) || [],
              studentParticipants: parseInt(row.studentParticipants) || 0,
              teacherParticipants: parseInt(row.teacherParticipants) || 0,
              rating: parseInt(row.rating) || 5,
              comments: row.comments || '',
              network: row.network || '',
              center: row.center || '',
              quarter: row.quarter || '',
              objectives: row.objectives?.split(',').map((o: string) => o.trim()) || [],
              createdBy: user?.id || '',
              isImported: true,
              importErrors: rowErrors.length > 0 ? rowErrors.map(err => ({
                field: err.field,
                message: err.message,
              })) : undefined,
              isIncomplete: Object.values(row).some(value => !value),
            };
            
            actionsToImport.push(action);
            if (rowErrors.length > 0) {
              allErrors.push(...rowErrors);
            }
          });

          setErrors(allErrors);
          setStats({
            total: jsonData.length,
            success: actionsToImport.filter(a => !a.importErrors && !a.isIncomplete).length,
            errors: allErrors.length,
            timestamp: new Date().toISOString(),
          });

          // Import all actions, including those with errors or incomplete fields
          if (actionsToImport.length > 0) {
            onImport(actionsToImport);
          }
        } catch (error) {
          console.error('Error processing file:', error);
          setErrors([{
            row: 0,
            field: 'file',
            message: 'Error al procesar el archivo',
            data: null,
          }]);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error reading file:', error);
      setErrors([{
        row: 0,
        field: 'file',
        message: 'Error al leer el archivo',
        data: null,
      }]);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Importar Acciones</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <Download className="w-5 h-5" />
              <span>Descargar Plantilla</span>
            </button>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                <span>{importing ? 'Importando...' : 'Seleccionar Archivo'}</span>
              </button>
            </div>
          </div>

          {stats && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen de Importación</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xl font-semibold">{stats.total}</div>
                </div>
                <div>
                  <div className="text-sm text-green-600">Correctos</div>
                  <div className="text-xl font-semibold text-green-600">{stats.success}</div>
                </div>
                <div>
                  <div className="text-sm text-red-600">Con Errores</div>
                  <div className="text-xl font-semibold text-red-600">{stats.errors}</div>
                </div>
              </div>
            </div>
          )}

          {errors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-2 text-red-600 mb-2">
                <AlertCircle className="w-5 h-5" />
                <h3 className="font-medium">Errores de Validación</h3>
              </div>
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-600">
                    Fila {error.row}: {error.message} ({error.field})
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p className="mb-2">Instrucciones:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Descarga la plantilla Excel para ver el formato requerido</li>
              <li>Los registros con campos vacíos se importarán como incompletos</li>
              <li>Los registros con errores se marcarán para su corrección</li>
              <li>Las fechas deben estar en formato YYYY-MM-DD</li>
              <li>Las listas (departamentos, familias, etc.) deben separarse por comas</li>
              <li>El centro debe existir en los registros maestros y pertenecer a la red especificada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportActions;