import type { Permission } from './permission';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: {
    permissionId: string;
    actions: ('create' | 'read' | 'update' | 'delete')[];
  }[];
  level: 1 | 2 | 3;
  isSystem?: boolean;
}

export interface EmailConfig {
  provider: 'smtp' | 'sendgrid' | 'ses';
  settings: {
    host?: string;
    port?: number;
    secure?: boolean;
    username?: string;
    password?: string;
    apiKey?: string;
    region?: string;
    fromName: string;
    fromEmail: string;
  };
  enabled: boolean;
}

export interface BrandingConfig {
  logoUrl: string | null;
  faviconUrl: string | null;
  font: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface MeetingConfig {
  provider: 'google-meet' | 'jitsi-meet';
  settings: {
    // Google Meet settings
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    // Jitsi Meet settings
    domain?: string;
    roomPrefix?: string;
  };
  enabled: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}