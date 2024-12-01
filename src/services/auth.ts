import { User } from '../types/user';
import { LoginCredentials, RegistrationData } from '../types/auth';
import { ADMIN_CODE, DEFAULT_ADMIN_USER } from '../config/constants';
import { generateRecoveryCode } from '../utils/codeGenerator';

// Mock storage for demo purposes
const users = new Map<string, { 
  user: User; 
  password: string; 
  recoveryCode?: {
    code: string;
    expiresAt: Date;
    attempts: number;
  }
}>();

// Initialize with admin user
users.set(DEFAULT_ADMIN_USER.id, {
  user: DEFAULT_ADMIN_USER,
  password: 'admin123', // In production, this would be hashed
});

export const authenticateUser = async (credentials: LoginCredentials): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userEntry = Array.from(users.values()).find(
    entry => entry.user.email === credentials.email
  );
  
  if (userEntry && userEntry.password === credentials.password) {
    return userEntry.user;
  }
  
  return null;
};

export const registerUser = async (data: RegistrationData): Promise<User | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingUser = Array.from(users.values()).find(
    entry => entry.user.email === data.email
  );
  
  if (existingUser) {
    throw new Error('Email already registered');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name: data.name,
    lastName: data.lastName,
    medusaCode: data.medusaCode,
    email: data.email,
    phone: data.phone,
    center: data.center,
    network: '',
    role: 'manager',
  };
  
  users.set(newUser.id, {
    user: newUser,
    password: data.password,
  });
  
  return newUser;
};

export const getRecoveryCode = async (email: string): Promise<string | null> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const userEntry = Array.from(users.entries()).find(
    ([_, entry]) => entry.user.email === email
  );

  if (!userEntry) {
    return null;
  }

  const [userId, entry] = userEntry;
  
  // Generate a new recovery code
  const code = generateRecoveryCode();
  
  // Set expiration to 15 minutes from now
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  // Update user entry with recovery code info
  users.set(userId, {
    ...entry,
    recoveryCode: {
      code,
      expiresAt,
      attempts: 0
    }
  });

  // In production, this would send an email
  console.log('Recovery code:', code);
  
  return code;
};

export const verifyRecoveryCode = async (email: string, code: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const userEntry = Array.from(users.entries()).find(
    ([_, entry]) => entry.user.email === email
  );

  if (!userEntry) {
    return false;
  }

  const [userId, entry] = userEntry;
  const recoveryInfo = entry.recoveryCode;

  if (!recoveryInfo) {
    return false;
  }

  // Check if code has expired
  if (new Date() > recoveryInfo.expiresAt) {
    // Remove expired code
    users.set(userId, {
      ...entry,
      recoveryCode: undefined
    });
    return false;
  }

  // Increment attempts
  recoveryInfo.attempts++;

  // Max 3 attempts
  if (recoveryInfo.attempts >= 3) {
    users.set(userId, {
      ...entry,
      recoveryCode: undefined
    });
    return false;
  }

  users.set(userId, {
    ...entry,
    recoveryCode: recoveryInfo
  });

  return code === recoveryInfo.code;
};

export const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const userEntry = Array.from(users.entries()).find(
    ([_, entry]) => entry.user.email === email
  );

  if (!userEntry) {
    return false;
  }

  const [userId, entry] = userEntry;
  const recoveryInfo = entry.recoveryCode;

  if (!recoveryInfo || code !== recoveryInfo.code) {
    return false;
  }

  // Check if code has expired
  if (new Date() > recoveryInfo.expiresAt) {
    users.set(userId, {
      ...entry,
      recoveryCode: undefined
    });
    return false;
  }

  // Update password and remove recovery code
  users.set(userId, {
    ...entry,
    password: newPassword,
    recoveryCode: undefined
  });

  return true;
};