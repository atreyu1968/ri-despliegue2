export interface RegistrationCode {
  id: string;
  code: string;
  role: 'admin' | 'general_coordinator' | 'subnet_coordinator' | 'manager';
  expirationDate: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  network?: string;
  center?: string;
}

export interface RegistrationCodeTemplate {
  role: RegistrationCode['role'];
  maxUses: number;
  validityDays: number;
  network?: string;
  center?: string;
}