import React from 'react';
import { Shield } from 'lucide-react';
import { useRolesStore } from '../../stores/rolesStore';
import { systemPermissions } from '../../data/permissions';
import type { Role } from '../../types/admin';

const RolesPermissions = () => {
  const { roles, updateRolePermissions } = useRolesStore();

  const handlePermissionChange = (
    role: Role,
    permissionId: string,
    action: string,
    checked: boolean
  ) => {
    const updatedPermissions = [...role.permissions];
    const permissionIndex = updatedPermissions.findIndex(p => p.permissionId === permissionId);

    if (checked) {
      if (permissionIndex === -1) {
        updatedPermissions.push({
          permissionId,
          actions: [action as any],
        });
      } else {
        const currentActions = updatedPermissions[permissionIndex].actions;
        if (!currentActions.includes(action as any)) {
          updatedPermissions[permissionIndex] = {
            ...updatedPermissions[permissionIndex],
            actions: [...currentActions, action as any],
          };
        }
      }
    } else {
      if (permissionIndex !== -1) {
        const filteredActions = updatedPermissions[permissionIndex].actions
          .filter(a => a !== action);
        
        if (filteredActions.length === 0) {
          updatedPermissions.splice(permissionIndex, 1);
        } else {
          updatedPermissions[permissionIndex] = {
            ...updatedPermissions[permissionIndex],
            actions: filteredActions,
          };
        }
      }
    }

    updateRolePermissions(role.id, updatedPermissions);
  };

  const hasPermission = (role: Role, permissionId: string, action: string) => {
    const permission = role.permissions.find(p => p.permissionId === permissionId);
    return permission?.actions.includes(action as any) || false;
  };

  const handleToggleAllActions = (role: Role, permissionId: string, checked: boolean) => {
    const permission = systemPermissions.find(p => p.id === permissionId);
    if (!permission) return;

    const updatedPermissions = [...role.permissions];
    const permissionIndex = updatedPermissions.findIndex(p => p.permissionId === permissionId);

    if (checked) {
      if (permissionIndex === -1) {
        updatedPermissions.push({
          permissionId,
          actions: [...permission.actions],
        });
      } else {
        updatedPermissions[permissionIndex] = {
          permissionId,
          actions: [...permission.actions],
        };
      }
    } else {
      if (permissionIndex !== -1) {
        updatedPermissions.splice(permissionIndex, 1);
      }
    }

    updateRolePermissions(role.id, updatedPermissions);
  };

  const allActionsSelected = (role: Role, permissionId: string) => {
    const permission = systemPermissions.find(p => p.id === permissionId);
    if (!permission) return false;

    const currentPermission = role.permissions.find(p => p.permissionId === permissionId);
    if (!currentPermission) return false;

    return permission.actions.every(action => 
      currentPermission.actions.includes(action)
    );
  };

  return (
    <div className="space-y-6">
      {roles.map((role) => (
        <div key={role.id} className="bg-white border rounded-lg shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {role.name}
                  </h3>
                  {role.isSystem && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                      Sistema
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {role.description}
                </p>
              </div>
              <Shield className={`w-5 h-5 ${
                role.level === 1 ? 'text-red-500' :
                role.level === 2 ? 'text-yellow-500' :
                'text-green-500'
              }`} />
            </div>

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
                                checked={hasPermission(role, permission.id, action)}
                                onChange={(e) => handlePermissionChange(
                                  role,
                                  permission.id,
                                  action,
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
                            checked={allActionsSelected(role, permission.id)}
                            onChange={(e) => handleToggleAllActions(role, permission.id, e.target.checked)}
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
        </div>
      ))}
    </div>
  );
};

export default RolesPermissions;