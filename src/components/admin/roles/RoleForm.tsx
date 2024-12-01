import React, { useState } from 'react';
import { X, Shield, Check } from 'lucide-react';
import { systemPermissions } from '../../../data/permissions';
import type { Role, Permission } from '../../../types/admin';

interface RoleFormProps {
  onSubmit: (data: Omit<Role, 'id'>) => void;
  onClose: () => void;
  initialData?: Role;
}

const RoleForm: React.FC<RoleFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [formData, setFormData] = useState<Omit<Role, 'id'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    level: initialData?.level || 3,
    permissions: initialData?.permissions || [],
  });

  const handlePermissionChange = (
    permissionId: string,
    action: Permission['actions'][number],
    checked: boolean
  ) => {
    setFormData(prev => {
      const permissions = [...prev.permissions];
      const permissionIndex = permissions.findIndex(p => p.permissionId === permissionId);

      if (permissionIndex === -1 && checked) {
        permissions.push({
          permissionId,
          actions: [action],
        });
      } else if (permissionIndex !== -1) {
        const actions = permissions[permissionIndex].actions;
        if (checked && !actions.includes(action)) {
          permissions[permissionIndex] = {
            ...permissions[permissionIndex],
            actions: [...actions, action],
          };
        } else if (!checked) {
          permissions[permissionIndex] = {
            ...permissions[permissionIndex],
            actions: actions.filter(a => a !== action),
          };
          if (permissions[permissionIndex].actions.length === 0) {
            permissions.splice(permissionIndex, 1);
          }
        }
      }

      return { ...prev, permissions };
    });
  };

  const hasPermission = (permissionId: string, action: Permission['actions'][number]) => {
    const permission = formData.permissions.find(p => p.permissionId === permissionId);
    return permission?.actions.includes(action) || false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleToggleAllActions = (permissionId: string, checked: boolean) => {
    const permission = systemPermissions.find(p => p.id === permissionId);
    if (!permission) return;

    setFormData(prev => {
      const permissions = [...prev.permissions];
      const permissionIndex = permissions.findIndex(p => p.permissionId === permissionId);

      if (checked) {
        if (permissionIndex === -1) {
          permissions.push({
            permissionId,
            actions: [...permission.actions],
          });
        } else {
          permissions[permissionIndex] = {
            permissionId,
            actions: [...permission.actions],
          };
        }
      } else {
        if (permissionIndex !== -1) {
          permissions.splice(permissionIndex, 1);
        }
      }

      return { ...prev, permissions };
    });
  };

  const allActionsSelected = (permissionId: string) => {
    const permission = systemPermissions.find(p => p.id === permissionId);
    if (!permission) return false;

    const currentPermission = formData.permissions.find(p => p.permissionId === permissionId);
    if (!currentPermission) return false;

    return permission.actions.every(action => currentPermission.actions.includes(action));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Editar' : 'Nuevo'} Rol
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                Nivel
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  level: parseInt(e.target.value) as Role['level']
                }))}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value={3}>Nivel 3 (Básico)</option>
                <option value={2}>Nivel 2 (Intermedio)</option>
                <option value={1}>Nivel 1 (Avanzado)</option>
              </select>
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
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Permisos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Módulo
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ver
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crear
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Editar
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eliminar
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Todo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {systemPermissions.map(permission => (
                    <tr key={permission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Shield className="w-5 h-5 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {permission.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {permission.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      {['read', 'create', 'update', 'delete'].map(action => (
                        <td key={action} className="px-6 py-4 whitespace-nowrap text-center">
                          {permission.actions.includes(action as any) && (
                            <label className="inline-flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={hasPermission(permission.id, action as any)}
                                onChange={(e) => handlePermissionChange(
                                  permission.id,
                                  action as any,
                                  e.target.checked
                                )}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </label>
                          )}
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <label className="inline-flex items-center justify-center">
                          <input
                            type="checkbox"
                            checked={allActionsSelected(permission.id)}
                            onChange={(e) => handleToggleAllActions(permission.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              {initialData ? 'Guardar Cambios' : 'Crear Rol'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;