import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { RegistrationCode } from '../../../types/registrationCode';

interface RegistrationCodeFormProps {
  onSubmit: (role: RegistrationCode['role'], maxUses: number, validityDays: number) => void;
  onClose: () => void;
}

const RegistrationCodeForm: React.FC<RegistrationCodeFormProps> = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    role: 'manager' as RegistrationCode['role'],
    maxUses: 1,
    validityDays: 7,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData.role, formData.maxUses, formData.validityDays);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Generar Código de Registro</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                role: e.target.value as RegistrationCode['role'] 
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="manager">Gestor</option>
              <option value="subnet_coordinator">Coordinador de Subred</option>
              <option value="general_coordinator">Coordinador General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número Máximo de Usos
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.maxUses}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                maxUses: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Días de Validez
            </label>
            <select
              value={formData.validityDays}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                validityDays: parseInt(e.target.value) 
              }))}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="7">7 días</option>
              <option value="15">15 días</option>
              <option value="30">30 días</option>
            </select>
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
              Generar Código
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationCodeForm;