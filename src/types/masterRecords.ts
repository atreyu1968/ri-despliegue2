export interface Network {
  id: string;
  code: string;
  name: string;
  description: string;
  centerCount: number;
  headquarterId: string | null;
  associatedCenterIds: string[];
}

export interface Center {
  id: string;
  code: string;
  name: string;
  network: string;
  address: string;
  municipality: string;
  province: string;
  island: string;
  phone: string;
  email: string;
}

export interface ProfessionalFamily {
  id: string;
  code: string;
  name: string;
  description: string;
  studies: Study[];
}

export interface Study {
  id: string;
  code: string;
  name: string;
  level: 'basic' | 'medium' | 'higher';
  groups: Group[];
}

export interface Group {
  id: string;
  code: string;
  name: string;
  shift: 'morning' | 'afternoon' | 'evening';
  year: 1 | 2;
  studyId: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  headTeacher: string;
  email: string;
}

export interface NetworkObjective {
  id: string;
  code: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  isActive: boolean;
}