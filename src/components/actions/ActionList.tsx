import React from 'react';
import { Pencil, Trash2, MapPin, Users, Star, Clock, Image as ImageIcon, FileText, ExternalLink, Network, AlertCircle, Calendar } from 'lucide-react';
import type { Action } from '../../types/action';

interface ActionListProps {
  actions: Action[];
  onEdit: (action: Action) => void;
  onDelete: (id: string) => void;
  canEdit: (action: Action) => boolean;
}

const ActionList: React.FC<ActionListProps> = ({ actions, onEdit, onDelete, canEdit }) => {
  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <div 
          key={action.id} 
          className={`bg-white border rounded-lg shadow-sm hover:shadow transition-shadow ${
            action.isImported && !action.importErrors?.length && !action.isIncomplete ? 'border-l-4 border-l-blue-500' : ''
          } ${action.importErrors?.length ? 'border-l-4 border-l-red-500' : ''} ${
            action.isIncomplete ? 'border-l-4 border-l-yellow-500' : ''
          }`}
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">{action.name}</h3>
                  {action.isImported && !action.importErrors?.length && !action.isIncomplete && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      Importado
                    </span>
                  )}
                  {action.importErrors?.length && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                      Errores de Importación
                    </span>
                  )}
                  {action.isIncomplete && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">
                      Incompleto
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{action.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    <Network className="w-4 h-4 mr-1" />
                    <span>{action.network}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {(action.imageUrl || action.documentUrl) && (
                  <div className="flex space-x-2">
                    {action.imageUrl && (
                      <button
                        onClick={() => window.open(action.imageUrl!, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        title="Ver imagen"
                      >
                        <ImageIcon className="w-4 h-4" />
                      </button>
                    )}
                    {action.documentUrl && (
                      <button
                        onClick={() => window.open(action.documentUrl!, '_blank')}
                        className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        title={`Ver documento${action.documentName ? `: ${action.documentName}` : ''}`}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
                
                {canEdit(action) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(action)}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(action.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {action.importErrors?.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2 text-red-600 mb-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Errores a corregir:</span>
                </div>
                <ul className="space-y-1">
                  {action.importErrors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600">
                      {error.field}: {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {action.isIncomplete && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2 text-yellow-600">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Esta acción está incompleta. Por favor, complete todos los campos requeridos.
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(action.startDate)} - {formatDate(action.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{action.quarter}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-1" />
                  <span>
                    {action.studentParticipants} estudiantes, {action.teacherParticipants} profesores
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end text-sm text-gray-600 mb-2">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  <span>Valoración: {action.rating}/5</span>
                </div>
                <div className="text-sm text-gray-500">
                  Creado por: {action.createdBy}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              {action.description}
            </div>

            <div className="border-t pt-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium text-gray-700">Departamentos:</span>
                  <span className="ml-2 text-gray-600">{action.departments.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Familias Profesionales:</span>
                  <span className="ml-2 text-gray-600">{action.professionalFamilies.join(', ')}</span>
                </div>
              </div>
            </div>

            {action.comments && (
              <div className="border-t mt-4 pt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Comentarios:</span>{' '}
                  {action.comments}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      {actions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay acciones registradas
        </div>
      )}
    </div>
  );
};

export default ActionList;