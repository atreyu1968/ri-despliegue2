import React from 'react';
import { Calendar, Building2, Network, Users, Target, Globe } from 'lucide-react';
import { useAcademicYearStore } from '../../../stores/academicYearStore';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import { useAuthStore } from '../../../stores/authStore';
import type { ReportFilters as FilterType } from '../../../types/report';

interface ReportFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFiltersChange }) => {
  const { user } = useAuthStore();
  const { networks, centers, departments, families, objectives, ods } = useMasterRecordsStore();
  const { activeYear } = useAcademicYearStore();

  // Initialize filters with all active objectives and ODS
  React.useEffect(() => {
    const activeObjectives = objectives.filter(obj => obj.isActive).map(obj => obj.id);
    const activeODS = ods.filter(obj => obj.isActive).map(obj => obj.id);
    
    if (!filters.objectives && activeObjectives.length > 0) {
      onFiltersChange({ 
        ...filters, 
        objectives: activeObjectives,
        ods: activeODS
      });
    }
  }, [objectives, ods]);

  // Get active objectives and ODS
  const activeObjectives = objectives.filter(obj => obj.isActive);
  const activeODS = ods.filter(obj => obj.isActive);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Configurar Filtros del Informe
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Personaliza los filtros según la información que necesitas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Periodo */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span>Periodo</span>
            </div>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Red */}
        {(user?.role === 'admin' || user?.role === 'general_coordinator') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Network className="w-5 h-5 text-gray-400" />
                <span>Red</span>
              </div>
            </label>
            <select
              value={filters.network || ''}
              onChange={(e) => onFiltersChange({ 
                ...filters, 
                network: e.target.value,
                center: undefined // Reset center when network changes
              })}
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
        )}

        {/* Centro */}
        {(user?.role !== 'manager' || filters.type === 'center') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <span>Centro</span>
              </div>
            </label>
            <select
              value={filters.center || ''}
              onChange={(e) => onFiltersChange({ ...filters, center: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={user?.role === 'manager'}
            >
              <option value="">Todos los centros</option>
              {centers
                .filter(center => !filters.network || center.network === filters.network)
                .map(center => (
                  <option key={center.id} value={center.name}>
                    {center.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Trimestre */}
        {activeYear && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>Trimestre</span>
              </div>
            </label>
            <select
              value={filters.quarter || ''}
              onChange={(e) => onFiltersChange({ ...filters, quarter: e.target.value })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los trimestres</option>
              {activeYear.quarters.map(quarter => (
                <option key={quarter.id} value={quarter.id}>
                  {quarter.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Departamento */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span>Departamento</span>
            </div>
          </label>
          <select
            value={filters.department || ''}
            onChange={(e) => onFiltersChange({ ...filters, department: e.target.value })}
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

        {/* Familia Profesional */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span>Familia Profesional</span>
            </div>
          </label>
          <select
            value={filters.family || ''}
            onChange={(e) => onFiltersChange({ ...filters, family: e.target.value })}
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

        {/* Objetivos */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-gray-400" />
              <span>Objetivos</span>
            </div>
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
                    onFiltersChange({ ...filters, objectives: newObjectives });
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
          </div>
        </div>

        {/* ODS */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-gray-400" />
              <span>Objetivos de Desarrollo Sostenible (ODS)</span>
            </div>
          </label>
          <div className="space-y-2 border rounded-lg p-4 bg-gray-50">
            {activeODS.map(ods => (
              <label key={ods.id} className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={(filters.ods || []).includes(ods.id)}
                  onChange={(e) => {
                    const currentODS = filters.ods || [];
                    const newODS = e.target.checked
                      ? [...currentODS, ods.id]
                      : currentODS.filter(id => id !== ods.id);
                    onFiltersChange({ ...filters, ods: newODS });
                  }}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{ods.name}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{ods.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;