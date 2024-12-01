import type { AcademicYear } from '../types/academicYear';

export const mockAcademicYears: AcademicYear[] = [
  {
    id: '1',
    name: 'Curso 2023-2024',
    startDate: '2023-09-01',
    endDate: '2024-06-30',
    isActive: true,
    quarters: [
      {
        id: '1-1',
        name: 'Primer Trimestre',
        startDate: '2023-09-01',
        endDate: '2023-12-22',
        isActive: false,
      },
      {
        id: '1-2',
        name: 'Segundo Trimestre',
        startDate: '2024-01-08',
        endDate: '2024-03-27',
        isActive: true,
      },
      {
        id: '1-3',
        name: 'Tercer Trimestre',
        startDate: '2024-04-08',
        endDate: '2024-06-30',
        isActive: false,
      },
    ],
  },
];