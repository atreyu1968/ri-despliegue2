import React from 'react';
import { Pencil, Trash2, Building2 } from 'lucide-react';
import type { Network } from '../../types/masterRecords';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';

interface NetworkListProps {
  networks: Network[];
  onEdit: (network: Network) => void;
  onDelete: (id: string) => void;
}

const NetworkList: React.FC<NetworkListProps> = ({ networks, onEdit, onDelete }) => {
  const { centers } = useMasterRecordsStore();

  const getHeadquarterName = (headquarterId: string | null) => {
    if (!headquarterId) return 'No asignado';
    const center = centers.find(c => c.id === headquarterId);
    return center?.name || 'Centro no encontrado';
  };

  return (
    <div className="space-y-4">
      {networks.map((network) => (
        <div key={network.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <div className="font-medium text-gray-900">{network.name}</div>
              <div className="text-sm text-gray-500">{network.code}</div>
            </div>
            
            <div className="col-span-3">
              <div className="text-sm font-medium text-gray-700">Centro Sede</div>
              <div className="text-sm text-gray-600">{getHeadquarterName(network.headquarterId)}</div>
            </div>
            
            <div className="col-span-4">
              <div className="text-sm font-medium text-gray-700">Centros Asociados</div>
              <div className="text-sm text-gray-600">
                {network.associatedCenterIds.length > 0 
                  ? network.associatedCenterIds.map(id => 
                      centers.find(c => c.id === id)?.name
                    ).join(', ')
                  : 'Sin centros asociados'
                }
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => onEdit(network)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(network.id)}
                className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NetworkList;