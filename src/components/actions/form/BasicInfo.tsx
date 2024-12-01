import React from 'react';
import { Calendar, MapPin, Network, Building2 } from 'lucide-react';
import { useAcademicYearStore } from '../../../stores/academicYearStore';
import { useAuthStore } from '../../../stores/authStore';
import { useMasterRecordsStore } from '../../../stores/masterRecordsStore';
import type { Action } from '../../../types/action';

interface BasicInfoProps {
  data: Partial<Action>;
  onChange: (data: Partial<Action>) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ data, onChange }) => {
  const { user } = useAuthStore();
  const { activeYear } = useAcademicYearStore();
  const { networks, centers } = useMasterRecordsStore();
  const activeQuarters = activeYear?.quarters.filter(q => q.isActive) || [];

  // Get available centers based on network selection
  const getAvailableCenters = () => {
    return centers.filter(center => {
      if (!data.network && !user?.network) return true;
      return center.network === (data.network || user?.network);
    });
  };

  const availableCenters = getAvailableCenters();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Acción
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange({ name: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lugar
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={data.location || ''}
              onChange={(e) => onChange({ location: e.target.value })}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Red
          </label>
          <div className="relative">
            <Network className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={data.network || user?.network || ''}
              onChange={(e) => {
                const value = e.target.value;
                const currentCenter = centers.find(c => c.name === data.center);
                const updatedData: Partial<Action> = {
                  network: value || undefined
                };
                
                if (!currentCenter || currentCenter.network !== value) {
                  updatedData.center = undefined;
                }
                
                onChange(updatedData);
              }}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={user?.role !== 'admin' && user?.role !== 'general_coordinator'}
            >
              <option value="">Seleccionar red</option>
              {networks.map(network => (
                <option key={network.id} value={network.code}>
                  {network.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Centro
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={data.center || ''}
              onChange={(e) => {
                const selectedCenter = centers.find(c => c.name === e.target.value);
                if (selectedCenter) {
                  onChange({
                    center: e.target.value,
                    network: selectedCenter.network
                  });
                }
              }}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={user?.role === 'manager'}
            >
              <option value="">Seleccionar centro</option>
              {availableCenters.map(center => (
                <option key={center.id} value={center.name}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>
          {data.center && !availableCenters.some(c => c.name === data.center) && (
            <p className="mt-1 text-sm text-red-600">
              El centro seleccionado no está disponible. Por favor, seleccione un centro válido.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Inicio
          </label>
          <input
            type="date"
            value={data.startDate || ''}
            onChange={(e) => onChange({ startDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Fin
          </label>
          <input
            type="date"
            value={data.endDate || ''}
            onChange={(e) => onChange({ endDate: e.target.value })}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Trimestre
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <select
              value={data.quarter || ''}
              onChange={(e) => onChange({ quarter: e.target.value })}
              className="pl-10 w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Seleccionar trimestre</option>
              {activeQuarters.map(quarter => (
                <option key={quarter.id} value={quarter.id}>
                  {quarter.name}
                </option>
              ))}
              {activeQuarters.length === 0 && (
                <option value="" disabled>
                  No hay trimestres activos
                </option>
              )}
            </select>
          </div>
          {activeQuarters.length === 0 && (
            <p className="mt-1 text-sm text-amber-600">
              Debe activar un trimestre en el curso académico actual
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;