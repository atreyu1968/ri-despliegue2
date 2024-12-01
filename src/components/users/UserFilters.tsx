import React from 'react';
import { Filter } from 'lucide-react';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import type { UserRole } from '../../types/user';

interface UserFilters {
  role?: UserRole;
  network?: string;
  center?: string;
  search?: string;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
  userRole?: UserRole;
  userNetwork?: string;
}

const UserFilters: React.FC<UserFiltersProps> = ({ 
  filters, 
  onFiltersChange,
  userRole,
  userNetwork
}) => {
  const { networks, centers } = useMasterRecordsStore();

  // Filter available networks based on user role
  const availableNetworks = networks.filter(network => {
    if (userRole === 'admin' || userRole === 'general_coordinator') return true;
    if (userRole === 'subnet_coordinator') return network.code === userNetwork;
    return false;
  });

  // Filter available centers based on selected network
  const availableCenters = centers.filter(center => {
    if (!filters.network) return true;
    return center.network === filters.network;
  });

  return (
    <dialog id="filters-dialog" className="modal p-0 rounded-lg shadow-xl">
      <div className="bg-white w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-medium">Filtros de Usuarios</h3>
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
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value || undefined })}
                placeholder="Buscar por nombre, email o código Medusa..."
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {(userRole === 'admin' || userRole === 'general_coordinator') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <select
                  value={filters.role || ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    role: e.target.value as UserRole || undefined 
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="general_coordinator">Coordinador General</option>
                  <option value="subnet_coordinator">Coordinador de Red</option>
                  <option value="manager">Gestor</option>
                </select>
              </div>
            )}

            {availableNetworks.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Red
                </label>
                <select
                  value={filters.network || ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    network: e.target.value || undefined,
                    center: undefined // Reset center when network changes
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todas las redes</option>
                  {availableNetworks.map(network => (
                    <option key={network.id} value={network.code}>
                      {network.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {availableCenters.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Centro
                </label>
                <select
                  value={filters.center || ''}
                  onChange={(e) => onFiltersChange({ 
                    ...filters, 
                    center: e.target.value || undefined 
                  })}
                  className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los centros</option>
                  {availableCenters.map(center => (
                    <option key={center.id} value={center.name}>
                      {center.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
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

export default UserFilters;