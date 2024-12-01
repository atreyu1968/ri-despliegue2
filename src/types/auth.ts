export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationData {
  code: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  phone: string;
  center: string;
  medusaCode: string;
}

export interface RecoveryCode {
  userId: string;
  code: string;
  createdAt: string;
}