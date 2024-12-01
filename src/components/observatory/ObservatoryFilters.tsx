import React from 'react';
import { Filter } from 'lucide-react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { ObservatoryFilters as FilterType } from '../../types/observatory';

interface ObservatoryFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
}

const ObservatoryFilters: React.FC<ObservatoryFiltersProps> = ({ filters, onFiltersChange }) => {
  const { networks } = useMasterRecordsStore();

  const topics = [
    'Metodologías Innovadoras',
    'Tecnología Educativa',
    'Sostenibilidad',
    'Emprendimiento',
    'Inclusión',
    'Internacionalización',
    'Desarrollo Profesional',
    'Evaluación',
  ];

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value || undefined })}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los tipos</option>
            <option value="practice">Buenas Prácticas</option>
            <option value="research">Investigaciones</option>
            <option value="resource">Recursos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Red
          </label>
          <select
            value={filters.network || ''}
            onChange={(e) => onFiltersChange({ ...filters, network: e.target.value || undefined })}
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
            Temática
          </label>
          <select
            value={filters.topic || ''}
            onChange={(e) => onFiltersChange({ ...filters, topic: e.target.value || undefined })}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las temáticas</option>
            {topics.map(topic => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Publicación
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value || undefined })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Desde"
            />
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value || undefined })}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Hasta"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservatoryFilters;