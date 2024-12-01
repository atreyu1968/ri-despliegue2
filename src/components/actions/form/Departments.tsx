import React from 'react';
import { Building2, Plus, Trash2, AlertCircle } from 'lucide-react';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface DepartmentsProps {
  data: Partial<Action>;
  onChange: (data: Partial<Action>) => void;
}

const Departments: React.FC<DepartmentsProps> = ({ data, onChange }) => {
  const { departments } = useMasterRecordsStore();
  const [selectedDepartment, setSelectedDepartment] = React.useState('');

  const handleAddDepartment = () => {
    if (selectedDepartment && !data.departments?.includes(selectedDepartment)) {
      onChange({
        departments: [...(data.departments || []), selectedDepartment],
      });
      setSelectedDepartment('');
    }
  };

  const handleRemoveDepartment = (deptCode: string) => {
    onChange({
      departments: data.departments?.filter(d => d !== deptCode) || [],
    });
  };

  const selectedDepartments = departments.filter(
    dept => data.departments?.includes(dept.code)
  );

  const availableDepartments = departments.filter(
    dept => !data.departments?.includes(dept.code)
  );

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Departamentos
        </label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Seleccionar departamento...</option>
              {availableDepartments.map(dept => (
                <option key={dept.id} value={dept.code}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleAddDepartment}
            disabled={!selectedDepartment}
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {availableDepartments.length === 0 && !selectedDepartments.length && (
          <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>No hay departamentos disponibles en el registro maestro</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {selectedDepartments.map((dept) => (
          <div
            key={dept.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <div>
              <div className="font-medium text-sm">{dept.name}</div>
              <div className="text-xs text-gray-500">{dept.code}</div>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveDepartment(dept.code)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {selectedDepartments.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No hay departamentos seleccionados
          </p>
        )}
      </div>
    </div>
  );
};

export default Departments;