export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  quarters: Quarter[];
}

export interface Quarter {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type AcademicYearFormData = Omit<AcademicYear, 'id' | 'quarters'>;