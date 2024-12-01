import React from 'react';
import { Pencil, Trash2, Calendar, Hash, Users } from 'lucide-react';
import type { RegistrationCode } from '../../types/registrationCode';

interface RegistrationCodeListProps {
  codes: RegistrationCode[];
  onEdit: (code: RegistrationCode) => void;
  onDelete: (id: string) => void;
}

const RegistrationCodeList: React.FC<RegistrationCodeListProps> = ({ codes, onEdit, onDelete }) => {
  const getRoleName = (role: RegistrationCode['role']) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'general_coordinator':
        return 'Coordinador General';
      case 'subnet_coordinator':
        return 'Coordinador de Subred';
      case 'manager':
        return 'Gestor';
      default:
        return role;
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString('es-ES');

  return (
    <div className="space-y-4">
      {codes.map((code) => (
        <div key={code.id} className="bg-white border rounded-lg shadow-sm hover:shadow transition-shadow">
          <div className="grid grid-cols-12 gap-4 p-4">
            <div className="col-span-3">
              <div className="flex items-center text-sm font-medium text-gray-900 mb-1">
                <Hash className="w-4 h-4 mr-1" />
                <span>{code.code}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                <span>{getRoleName(code.role)}</span>
              </div>
            </div>
            
            <div className="col-span-3">
              <div className="text-sm text-gray-600">
                Usos: {code.usedCount} / {code.maxUses}
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Expira: {formatDate(code.expirationDate)}</span>
              </div>
            </div>
            
            <div className="col-span-4">
              <div className={`text-sm ${code.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {code.isActive ? 'Activo' : 'Inactivo'}
              </div>
              <div className="text-sm text-gray-500">
                Creado: {formatDate(code.createdAt)}
              </div>
            </div>

            <div className="col-span-2 flex items-center justify-end space-x-2">
              <button
                onClick={() => onEdit(code)}
                className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(code.id)}
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

export default RegistrationCodeList;