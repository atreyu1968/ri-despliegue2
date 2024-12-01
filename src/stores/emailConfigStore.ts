import { create } from 'zustand';
import type { EmailConfig } from '../types/admin';

interface EmailConfigState {
  config: EmailConfig;
  updateConfig: (config: EmailConfig) => void;
  testConnection: () => Promise<boolean>;
}

const defaultConfig: EmailConfig = {
  provider: 'smtp',
  settings: {
    host: '',
    port: 587,
    secure: true,
    username: '',
    password: '',
    fromName: 'Red de Innovación FP',
    fromEmail: 'noreply@redinnovacionfp.es',
  },
  enabled: false,
};

export const useEmailConfigStore = create<EmailConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    // En producción, esto se guardaría en una base de datos
    localStorage.setItem('emailConfig', JSON.stringify(config));
  },
  
  testConnection: async () => {
    const { config } = get();
    
    try {
      // Simular prueba de conexión
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En producción, aquí se probaría la conexión real
      return true;
    } catch (error) {
      console.error('Error testing email connection:', error);
      return false;
    }
  },
}));