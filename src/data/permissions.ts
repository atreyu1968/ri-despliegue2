import type { Permission, Role } from '../types/admin';

export const systemPermissions: Permission[] = [
  {
    id: 'users',
    name: 'Usuarios',
    description: 'Gestión de usuarios del sistema',
    module: 'Usuarios',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: 'actions',
    name: 'Acciones',
    description: 'Gestión de acciones y actividades',
    module: 'Acciones',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: 'academic_years',
    name: 'Cursos Académicos',
    description: 'Gestión de cursos académicos',
    module: 'Cursos',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: 'master_records',
    name: 'Registros Maestros',
    description: 'Gestión de registros maestros',
    module: 'Maestros',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: 'reports',
    name: 'Informes',
    description: 'Acceso y generación de informes',
    module: 'Informes',
    actions: ['read'],
  },
  {
    id: 'observatory',
    name: 'Observatorio',
    description: 'Gestión del observatorio de innovación',
    module: 'Observatorio',
    actions: ['create', 'read', 'update', 'delete'],
  },
  {
    id: 'admin',
    name: 'Administración',
    description: 'Funciones administrativas del sistema',
    module: 'Administración',
    actions: ['create', 'read', 'update', 'delete'],
  },
];

export const systemRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Control total del sistema',
    level: 1,
    isSystem: true,
    permissions: systemPermissions.map(p => ({
      permissionId: p.id,
      actions: p.actions,
    })),
  },
  {
    id: 'general_coordinator',
    name: 'Coordinador General',
    description: 'Coordinación general de la red',
    level: 2,
    isSystem: true,
    permissions: [
      {
        permissionId: 'users',
        actions: ['read'],
      },
      {
        permissionId: 'actions',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        permissionId: 'academic_years',
        actions: ['read'],
      },
      {
        permissionId: 'master_records',
        actions: ['read'],
      },
      {
        permissionId: 'reports',
        actions: ['read'],
      },
      {
        permissionId: 'observatory',
        actions: ['create', 'read', 'update', 'delete'],
      },
    ],
  },
  {
    id: 'subnet_coordinator',
    name: 'Coordinador de Subred',
    description: 'Coordinación de una subred específica',
    level: 2,
    isSystem: true,
    permissions: [
      {
        permissionId: 'users',
        actions: ['read'],
      },
      {
        permissionId: 'actions',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        permissionId: 'academic_years',
        actions: ['read'],
      },
      {
        permissionId: 'reports',
        actions: ['read'],
      },
      {
        permissionId: 'observatory',
        actions: ['create', 'read', 'update'],
      },
    ],
  },
  {
    id: 'manager',
    name: 'Gestor',
    description: 'Gestión básica del sistema',
    level: 3,
    isSystem: true,
    permissions: [
      {
        permissionId: 'actions',
        actions: ['create', 'read', 'update'],
      },
      {
        permissionId: 'academic_years',
        actions: ['read'],
      },
      {
        permissionId: 'reports',
        actions: ['read'],
      },
      {
        permissionId: 'observatory',
        actions: ['read'],
      },
    ],
  },
];