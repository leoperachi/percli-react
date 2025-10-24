import {
  API_BASE_URL,
  API_TIMEOUT,
  ENVIRONMENT,
  ENABLE_LOGGING,
  APP_NAME,
  APP_VERSION,
} from '@env';

// Environment Configuration
export interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  APP_NAME: string;
  APP_VERSION: string;
}

// Get configuration from .env file
const getConfig = (): EnvironmentConfig => {
  return {
    API_BASE_URL: API_BASE_URL || 'http://localhost:3000',
    API_TIMEOUT: Number(API_TIMEOUT) || 10000,
    ENABLE_LOGGING: ENABLE_LOGGING === 'true',
    ENVIRONMENT: (ENVIRONMENT as EnvironmentConfig['ENVIRONMENT']) || 'development',
    APP_NAME: APP_NAME || 'Percli',
    APP_VERSION: APP_VERSION || '1.0.0',
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
  }
};

export const logError = (...args: any[]) => {
  if (ENV.ENABLE_LOGGING) {
  }
};
