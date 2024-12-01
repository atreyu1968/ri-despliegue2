import { create } from 'zustand';
import { generateRegistrationCode } from '../utils/codeGenerator';
import type { RegistrationCode, RegistrationCodeTemplate } from '../types/registrationCode';

interface RegistrationCodesState {
  codes: RegistrationCode[];
  setCodes: (codes: RegistrationCode[]) => void;
  generateCode: (template: RegistrationCodeTemplate) => RegistrationCode;
  validateCode: (code: string) => { valid: boolean; role?: RegistrationCode['role'] };
  useCode: (code: string) => boolean;
  cleanExpiredCodes: () => void;
}

export const useRegistrationCodesStore = create<RegistrationCodesState>((set, get) => ({
  codes: [],
  
  setCodes: (codes) => set({ codes }),
  
  generateCode: (template) => {
    const code: RegistrationCode = {
      id: Date.now().toString(),
      code: generateRegistrationCode(),
      role: template.role,
      maxUses: template.maxUses,
      usedCount: 0,
      isActive: true,
      network: template.network,
      center: template.center,
      createdAt: new Date().toISOString(),
      expirationDate: new Date(Date.now() + template.validityDays * 24 * 60 * 60 * 1000).toISOString(),
    };

    set(state => ({
      codes: [...state.codes, code]
    }));

    return code;
  },

  validateCode: (code) => {
    const { codes } = get();
    const registrationCode = codes.find(c => c.code === code);

    if (!registrationCode) {
      return { valid: false };
    }

    const isExpired = new Date(registrationCode.expirationDate) < new Date();
    const isMaxUsesReached = registrationCode.usedCount >= registrationCode.maxUses;

    if (isExpired || isMaxUsesReached || !registrationCode.isActive) {
      return { valid: false };
    }

    return { 
      valid: true, 
      role: registrationCode.role,
      network: registrationCode.network,
      center: registrationCode.center
    };
  },

  useCode: (code) => {
    const { codes } = get();
    const registrationCode = codes.find(c => c.code === code);

    if (!registrationCode) {
      return false;
    }

    const isExpired = new Date(registrationCode.expirationDate) < new Date();
    const isMaxUsesReached = registrationCode.usedCount >= registrationCode.maxUses;

    if (isExpired || isMaxUsesReached || !registrationCode.isActive) {
      return false;
    }

    set(state => ({
      codes: state.codes.map(c => 
        c.id === registrationCode.id 
          ? { ...c, usedCount: c.usedCount + 1 }
          : c
      )
    }));

    return true;
  },

  cleanExpiredCodes: () => {
    set(state => ({
      codes: state.codes.filter(code => {
        const isExpired = new Date(code.expirationDate) < new Date();
        const isMaxUsesReached = code.usedCount >= code.maxUses;
        return !isExpired && !isMaxUsesReached;
      })
    }));
  },
}));