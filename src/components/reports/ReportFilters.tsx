import React, { useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import { useAcademicYearStore } from '../../stores/academicYearStore';
import { useAuthStore } from '../../stores/authStore';
import type { ReportFilters as FilterType } from '../../types/report';

interface ReportFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFiltersChange }) => {
  const { user } = useAuthStore();
  const { networks, centers, departments, families, objectives } = useMasterRecordsStore();
  const { activeYear } = useAcademicYearStore();

  // Initialize filters with all active objectives
  useEffect(() => {
    const activeObjectives = objectives.filter(obj => obj.isActive).map(obj => obj.id);
    if (!filters.objectives && activeObjectives.length > 0) {
      onFiltersChange({ ...filters, objectives: activeObjectives });
    }
  }, [objectives]);

  const handleFilterChange = (key: keyof FilterType, value: string | string[] | undefined) => {
    // If value is empty or undefined, remove the filter to show all records
    const newFilters = { ...filters };
    
    if (!value || (Array.isArray(value) && value.length === 0)) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }

    // Special handling for network/center relationship
    if (key === 'network') {
      delete newFilters.center; // Reset center when network changes
    }

    onFiltersChange(newFilters);
  };

  // Get available centers based on network selection
  const getAvailableCenters = () => {
    return centers.filter(center => {
      if (filters.network && center.network !== filters.network) return false;
      if (user?.role === 'subnet_coordinator' && center.network !== user.network) return false;
      return true;
    });
  };

  // Get active objectives
  const activeObjectives = objectives.filter(obj => obj.isActive);

  return (
    <dialog id="filters-dialog" className="modal p-0 rounded-lg shadow-xl">
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Filtros del Informe</h3>
          </div>
          <button
            onClick={() => (document.getElementById('filters-dialog') as HTMLDialogElement)?.close()}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form method="dialog" className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Red
              </label>
              <select
                value={filters.network || ''}
                onChange={(e) => handleFilterChange('network', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las redes</option>
                {networks.map(network => (
                  <option key={network.id} value={network.code}>
                    {network.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro
              </label>
              <select
                value={filters.center || ''}
                onChange={(e) => handleFilterChange('center', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los centros</option>
                {getAvailableCenters().map(center => (
                  <option key={center.id} value={center.name}>
                    {center.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trimestre
              </label>
              <select
                value={filters.quarter || ''}
                onChange={(e) => handleFilterChange('quarter', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los trimestres</option>
                {activeYear?.quarters.map(quarter => (
                  <option key={quarter.id} value={quarter.id}>
                    {quarter.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                value={filters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los departamentos</option>
                {departments.map(department => (
                  <option key={department.id} value={department.code}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Familia Profesional
              </label>
              <select
                value={filters.family || ''}
                onChange={(e) => handleFilterChange('family', e.target.value || undefined)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todas las familias</option>
                {families.map(family => (
                  <option key={family.id} value={family.code}>
                    {family.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivos
              </label>
              <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
                {activeObjectives.map(objective => (
                  <label key={objective.id} className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={(filters.objectives || []).includes(objective.id)}
                      onChange={(e) => {
                        const currentObjectives = filters.objectives || [];
                        const newObjectives = e.target.checked
                          ? [...currentObjectives, objective.id]
                          : currentObjectives.filter(id => id !== objective.id);
                        handleFilterChange('objectives', newObjectives.length > 0 ? newObjectives : undefined);
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{objective.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          objective.priority === 'high' ? 'bg-red-100 text-red-700' :
                          objective.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {objective.priority === 'high' ? 'Alta' :
                           objective.priority === 'medium' ? 'Media' : 'Baja'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{objective.description}</p>
                    </div>
                  </label>
                ))}
                {activeObjectives.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No hay objetivos activos disponibles
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => onFiltersChange({})}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border rounded-md"
            >
              Limpiar Filtros
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              Aplicar Filtros
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default ReportFilters;