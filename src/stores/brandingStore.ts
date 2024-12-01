import { create } from 'zustand';
import type { BrandingConfig } from '../types/admin';

interface BrandingState {
  config: BrandingConfig;
  updateConfig: (config: BrandingConfig) => void;
}

const defaultLogo = "https://www3.gobiernodecanarias.org/medusa/mediateca/ecoescuela/wp-content/uploads/sites/2/2013/11/Logo-Gobierno-de-Canarias.png";
const defaultFavicon = "https://i.postimg.cc/BXFxt40G/favicon.png";

export const useBrandingStore = create<BrandingState>((set) => ({
  config: {
    logoUrl: defaultLogo,
    faviconUrl: defaultFavicon,
    font: 'inter',
    colors: {
      primary: '#2563eb',
      secondary: '#4b5563',
      accent: '#8b5cf6',
    },
  },
  updateConfig: (config) => set({ config }),
}));