import Config from 'react-native-config';

// Environment Configuration
export interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  APP_NAME: string;
  APP_VERSION: string;
}

// Get configuration from .env file with fallbacks
const getConfig = (): EnvironmentConfig => {
  return {
    API_BASE_URL: Config.API_BASE_URL || 'http://localhost:3000',
    API_TIMEOUT: parseInt(Config.API_TIMEOUT || '10000', 10),
    ENABLE_LOGGING: Config.ENABLE_LOGGING === 'true',
    ENVIRONMENT: (Config.ENVIRONMENT as any) || (__DEV__ ? 'development' : 'production'),
    APP_NAME: Config.APP_NAME || 'Percli',
    APP_VERSION: Config.APP_VERSION || '1.0.0',
  };
};

export const ENV = getConfig();

// Helper functions
export const isDevelopment = () => ENV.ENVIRONMENT === 'development';
export const isStaging = () => ENV.ENVIRONMENT === 'staging';
export const isProduction = () => ENV.ENVIRONMENT === 'production';

// Logging helper
export const log = (...args: any[]) => {
  if (ENV.ENABLE_LOGGING) {
    console.log('[PerTech App]', ...args);
  }
};

export const logError = (...args: any[]) => {
  if (ENV.ENABLE_LOGGING) {
    console.error('[PerTech App Error]', ...args);
  }
};