import { create } from 'zustand';
import type { MeetingConfig } from '../types/admin';

interface MeetingConfigState {
  config: MeetingConfig;
  updateConfig: (config: MeetingConfig) => void;
  generateMeetingUrl: () => Promise<string>;
}

const defaultConfig: MeetingConfig = {
  provider: 'jitsi-meet',
  settings: {
    domain: 'meet.jit.si',
    roomPrefix: 'ri-fp-',
  },
  enabled: false,
};

export const useMeetingConfigStore = create<MeetingConfigState>((set, get) => ({
  config: defaultConfig,
  
  updateConfig: (config) => {
    set({ config });
    localStorage.setItem('meetingConfig', JSON.stringify(config));
  },
  
  generateMeetingUrl: async () => {
    const { config } = get();
    
    if (!config.enabled) {
      throw new Error('Video meetings are not enabled');
    }

    if (config.provider === 'jitsi-meet') {
      const roomName = `${config.settings.roomPrefix}${Date.now()}`;
      return `https://${config.settings.domain}/${roomName}`;
    }

    if (config.provider === 'google-meet') {
      // Here you would implement Google Calendar API integration
      // For now, return a mock URL
      return 'https://meet.google.com/mock-meeting';
    }

    throw new Error('Invalid meeting provider');
  },
}));