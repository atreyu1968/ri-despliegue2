import { create } from 'zustand';
import { systemRoles, systemPermissions } from '../data/permissions';
import type { Role, Permission, AuditLog } from '../types/admin';

interface RolesState {
  roles: Role[];
  permissions: Permission[];
  auditLogs: AuditLog[];
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  updateRolePermissions: (roleId: string, permissions: Role['permissions']) => void;
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
}

export const useRolesStore = create<RolesState>((set) => ({
  roles: systemRoles,
  permissions: systemPermissions,
  auditLogs: [],
  
  addRole: (roleData) => set((state) => ({
    roles: [...state.roles, { 
      ...roleData, 
      id: `role-${Date.now()}`,
      isSystem: false,
    }],
  })),
  
  updateRole: (id, roleData) => set((state) => ({
    roles: state.roles.map((role) =>
      role.id === id ? { ...role, ...roleData } : role
    ),
  })),
  
  deleteRole: (id) => set((state) => ({
    roles: state.roles.filter((role) => role.id !== id),
  })),

  updateRolePermissions: (roleId, permissions) => set((state) => ({
    roles: state.roles.map((role) =>
      role.id === roleId ? { ...role, permissions } : role
    ),
  })),
  
  addAuditLog: (logData) => set((state) => ({
    auditLogs: [
      {
        ...logData,
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
      },
      ...state.auditLogs,
    ],
  })),
}));