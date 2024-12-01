import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import type { User } from '../../types/user';
import { useMasterRecordsStore } from '../../stores/masterRecordsStore';
import { mockCenters } from '../../data/mockMasterRecords';

interface UserFormProps {
  onSubmit: (data: Omit<User, 'id'>) => void;
  onClose: () => void;
  initialData?: User;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, onClose, initialData }) => {
  const { centers, setCenters } = useMasterRecordsStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<Omit<User, 'id'>>({
    name: initialData?.name || '',
    lastName: initialData?.lastName || '',
    medusaCode: initialData?.medusaCode || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    center: initialData?.center || '',
    network: initialData?.network || '',
    role: initialData?.role || 'manager',
    imageUrl: initialData?.imageUrl,
  });
  const [previewUrl, setPreviewUrl] = useState<string>(initialData?.imageUrl || '');

  // Initialize centers from mock data when component mounts
  useEffect(() => {
    if (centers.length === 0) {
      setCenters(mockCenters);
    }
  }, [centers.length, setCenters]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCenterChange = (centerName: string) => {
    const selectedCenter = centers.find(c => c.name === centerName);
    setFormData(prev => ({
      ...prev,
      center: centerName,
      network: selectedCenter?.network || '',
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter centers based on role
  const availableCenters = centers.filter(center => {
    if (formData.role === 'admin') return true;
    if (formData.role === 'general_coordinator') return true;
    if (formData.role === 'subnet_coordinator') {
      // For subnet coordinators, only show centers from their network
      if (initialData?.network) {
        return center.network === initialData.network;
      }
      return true;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar' : 'Nuevo'} Usuario
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex items-center space-x-4">
              <div className="relative">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Vista previa"
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Foto de perfil</p>
                <p className="text-sm text-gray-500">
                  Haga clic en el botón para subir una imagen
                </p>
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código Medusa
              </label>
              <input
                type="text"
                value={formData.medusaCode}
                onChange={(e) => setFormData(prev => ({ ...prev, medusaCode: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as User['role'] }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="manager">Gestor</option>
                <option value="subnet_coordinator">Coordinador de Subred</option>
                <option value="general_coordinator">Coordinador General</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono móvil
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centro
              </label>
              <select
                value={formData.center}
                onChange={(e) => handleCenterChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccionar centro</option>
                {availableCenters.map(center => (
                  <option key={center.id} value={center.name}>
                    {center.name} ({center.network})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Red
              </label>
              <input
                type="text"
                value={formData.network}
                className="w-full px-3 py-2 border rounded-md bg-gray-50 text-gray-500"
                disabled
              />
              <p className="mt-1 text-sm text-gray-500">
                La red se asigna automáticamente según el centro seleccionado
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
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
              {initialData ? 'Guardar Cambios' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;