import React from 'react';
import { Pencil, Trash2, Target, ToggleLeft, ToggleRight } from 'lucide-react';
import type { NetworkObjective } from '../../types/masterRecords';

interface ObjectiveListProps {
  objectives: NetworkObjective[];
  onEdit: (objective: NetworkObjective) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
}

const ObjectiveList: React.FC<ObjectiveListProps> = ({ 
  objectives, 
  onEdit, 
  onDelete,
  onToggleActive 
}) => {
  const getPriorityColor = (priority: NetworkObjective['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="space-y-4">
      {objectives.map((objective) => (
        <div key={objective.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <div className="font-medium text-gray-900">{objective.name}</div>
              <div className="text-sm text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                {objective.code}
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="flex items-center text-sm space-x-2">
                <span className={`px-2 py-0.5 rounded ${getPriorityColor(objective.priority)}`}>
                  {objective.priority === 'high' ? 'Alta' : objective.priority === 'medium' ? 'Media' : 'Baja'}
                </span>
                <span className={`px-2 py-0.5 rounded ${objective.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-600'}`}>
                  {objective.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            
            <div className="col-span-4">
              <div className="text-sm text-gray-600">{objective.description}</div>
            </div>

            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => onToggleActive(objective.id)}
                className={`p-2 rounded-full hover:bg-gray-50 ${
                  objective.isActive ? 'text-green-600' : 'text-gray-400'
                }`}
                title={objective.isActive ? 'Desactivar objetivo' : 'Activar objetivo'}
              >
                {objective.isActive ? (
                  <ToggleRight className="w-6 h-6" />
                ) : (
                  <ToggleLeft className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => onEdit(objective)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(objective.id)}
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

export default ObjectiveList;