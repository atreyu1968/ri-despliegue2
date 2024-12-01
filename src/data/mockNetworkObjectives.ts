import type { NetworkObjective } from '../types/masterRecords';

export const mockNetworkObjectives: NetworkObjective[] = [
  {
    id: '1',
    code: 'OBJ-2024-01',
    name: 'Implementación de metodologías ágiles',
    description: 'Incorporar metodologías ágiles en la gestión de proyectos educativos',
    priority: 'high',
    isActive: true,
  },
  {
    id: '2',
    code: 'OBJ-2024-02',
    name: 'Digitalización de procesos',
    description: 'Digitalizar los procesos administrativos y educativos',
    priority: 'medium',
    isActive: true,
  },
  {
    id: '3',
    code: 'OBJ-2024-03',
    name: 'Sostenibilidad ambiental',
    description: 'Implementar prácticas sostenibles en los centros educativos',
    priority: 'medium',
    isActive: false,
  },
  {
    id: '4',
    code: 'OBJ-2024-04',
    name: 'Internacionalización',
    description: 'Fomentar la participación en proyectos internacionales',
    priority: 'high',
    isActive: true,
  },
  {
    id: '5',
    code: 'OBJ-2024-05',
    name: 'Innovación educativa',
    description: 'Implementar nuevas metodologías de enseñanza-aprendizaje',
    priority: 'high',
    isActive: true,
  }
];