import type { Network, Center, ProfessionalFamily, Department, NetworkObjective } from '../types/masterRecords';
import { mockNetworkObjectives } from './mockNetworkObjectives';

export const mockNetworks: Network[] = [
  {
    id: '1',
    code: 'RED-INNOVA-1',
    name: 'Red de Innovación Principal',
    description: 'Red principal de centros de formación profesional',
    centerCount: 3,
    headquarterId: '1',
    associatedCenterIds: ['2'],
  },
  {
    id: '2',
    code: 'RED-INNOVA-2',
    name: 'Red de Innovación Secundaria',
    description: 'Red secundaria de centros especializados',
    centerCount: 2,
    headquarterId: null,
    associatedCenterIds: [],
  },
];

export const mockCenters: Center[] = [
  {
    id: '1',
    code: 'CIFP-001',
    name: 'CIFP César Manrique',
    network: 'RED-INNOVA-1',
    address: 'Av. Principal, 123',
    municipality: 'Santa Cruz',
    province: 'Santa Cruz de Tenerife',
    island: 'Tenerife',
    phone: '922123456',
    email: 'cifp.cesarmanrique@edu.es',
  },
  {
    id: '2',
    code: 'CIFP-002',
    name: 'CIFP San Cristóbal',
    network: 'RED-INNOVA-1',
    address: 'C/ Secundaria, 45',
    municipality: 'Las Palmas',
    province: 'Las Palmas',
    island: 'Gran Canaria',
    phone: '928654321',
    email: 'cifp.sancristobal@edu.es',
  },
];

export const mockFamilies: ProfessionalFamily[] = [
  {
    id: '1',
    code: 'INF',
    name: 'Informática y Comunicaciones',
    description: 'Familia profesional de tecnologías de la información',
    studies: [
      {
        id: '1-1',
        code: 'DAW',
        name: 'Desarrollo de Aplicaciones Web',
        level: 'higher',
        groups: [
          {
            id: '1-1-1',
            code: 'DAW1M',
            name: 'DAW 1º Mañana',
            shift: 'morning',
            year: 1,
            studyId: '1-1',
          },
          {
            id: '1-1-2',
            code: 'DAW2M',
            name: 'DAW 2º Mañana',
            shift: 'morning',
            year: 2,
            studyId: '1-1',
          },
        ],
      },
      {
        id: '1-2',
        code: 'DAM',
        name: 'Desarrollo de Aplicaciones Multiplataforma',
        level: 'higher',
        groups: [
          {
            id: '1-2-1',
            code: 'DAM1T',
            name: 'DAM 1º Tarde',
            shift: 'afternoon',
            year: 1,
            studyId: '1-2',
          },
          {
            id: '1-2-2',
            code: 'DAM2T',
            name: 'DAM 2º Tarde',
            shift: 'afternoon',
            year: 2,
            studyId: '1-2',
          },
        ],
      },
    ],
  },
  {
    id: '2',
    code: 'ADM',
    name: 'Administración y Gestión',
    description: 'Familia profesional de administración',
    studies: [
      {
        id: '2-1',
        code: 'ADG',
        name: 'Administración y Finanzas',
        level: 'higher',
        groups: [
          {
            id: '2-1-1',
            code: 'ADG1M',
            name: 'ADG 1º Mañana',
            shift: 'morning',
            year: 1,
            studyId: '2-1',
          },
          {
            id: '2-1-2',
            code: 'ADG2M',
            name: 'ADG 2º Mañana',
            shift: 'morning',
            year: 2,
            studyId: '2-1',
          },
        ],
      },
    ],
  },
];

export const mockDepartments: Department[] = [
  {
    id: '1',
    code: 'DEP-INF',
    name: 'Departamento de Informática',
    description: 'Departamento responsable de las enseñanzas de informática',
    headTeacher: 'Juan Pérez',
    email: 'dpto.informatica@edu.es',
  },
  {
    id: '2',
    code: 'DEP-ADM',
    name: 'Departamento de Administración',
    description: 'Departamento responsable de las enseñanzas de administración',
    headTeacher: 'María García',
    email: 'dpto.administracion@edu.es',
  },
];

// Exportamos los objetivos de la red
export const mockObjectives: NetworkObjective[] = mockNetworkObjectives;