import React, { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { Network, Center } from '../../types/masterRecords';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';

interface NetworkFormProps {
  onSubmit: (data: Omit<Network, 'id' | 'centerCount'>) => void;
  onClose: () => void;
  initialData?: Network;
}

const NetworkForm: React.FC<NetworkFormProps> = ({ onSubmit, onClose, initialData }) => {
  const { centers, networks } = useMasterRecordsStore();
  const [formData, setFormData] = useState({
    code: initialData?.code || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    headquarterId: initialData?.headquarterId || '',
    associatedCenterIds: initialData?.associatedCenterIds || [],
  });

  // Get centers that are not already assigned to other networks
  const getAvailableCenters = () => {
    return centers.filter(center => {
      // If the center is already in this network (for editing), include it
      if (initialData && (
        center.id === initialData.headquarterId || 
        initialData.associatedCenterIds.includes(center.id)
      )) {
        return true;
      }

      // Check if center is assigned to any other network
      const isAssignedToOtherNetwork = networks.some(network => {
        if (network.id === initialData?.id) return false;
        return network.headquarterId === center.id || 
               network.associatedCenterIds.includes(center.id);
      });

      return !isAssignedToOtherNetwork;
    });
  };

  const availableCenters = getAvailableCenters().filter(center => 
    !formData.associatedCenterIds.includes(center.id) &&
    center.id !== formData.headquarterId
  );

  const associatedCenters = centers.filter(center =>
    formData.associatedCenterIds.includes(center.id)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddCenter = (centerId: string) => {
    setFormData(prev => ({
      ...prev,
      associatedCenterIds: [...prev.associatedCenterIds, centerId],
    }));
  };

  const handleRemoveCenter = (centerId: string) => {
    setFormData(prev => ({
      ...prev,
      associatedCenterIds: prev.associatedCenterIds.filter(id => id !== centerId),
    }));
  };

  const handleHeadquarterChange = (centerId: string) => {
    // If the new headquarter was an associated center, remove it from there
    const newAssociatedCenterIds = formData.associatedCenterIds.filter(id => id !== centerId);
    
    setFormData(prev => ({
      ...prev,
      headquarterId: centerId,
      associatedCenterIds: newAssociatedCenterIds,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar' : 'Nueva'} Red
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro Sede
              </label>
              <select
                value={formData.headquarterId}
                onChange={(e) => handleHeadquarterChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar centro sede</option>
                {getAvailableCenters()
                  .filter(center => !formData.associatedCenterIds.includes(center.id))
                  .map(center => (
                    <option key={center.id} value={center.id}>
                      {center.name}
                    </option>
                  ))
                }
              </select>
              {getAvailableCenters().length === 0 && (
                <p className="mt-1 text-sm text-amber-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  No hay centros disponibles. Todos están asignados a otras redes.
                </p>
              )}
            </div>

            <div className="col-span-2 border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-medium text-gray-700">Centros Asociados</h3>
                <div className="flex items-center space-x-2">
                  <select
                    className="px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddCenter(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    value=""
                  >
                    <option value="">Añadir centro...</option>
                    {availableCenters.map(center => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                {associatedCenters.map(center => (
                  <div
                    key={center.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-sm">{center.name}</div>
                      <div className="text-xs text-gray-500">{center.code}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCenter(center.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {associatedCenters.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay centros asociados
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
            >
              {initialData ? 'Guardar Cambios' : 'Crear Red'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NetworkForm;