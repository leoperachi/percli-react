// Environment Configuration
export interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  ENVIRONMENT: 'development' | 'staging' | 'production';
  APP_NAME: string;
  APP_VERSION: string;
}

// Get configuration with hardcoded values for now
const getConfig = (): EnvironmentConfig => {
  // For Android emulator, always use 10.0.2.2
  // For iOS simulator, use localhost
  // For production, use production URL
  const getApiUrl = () => {
    if (!__DEV__) return 'https://api.percli.com'; // Production URL

    // For now, always use emulator IP for development
    // This can be changed later based on platform detection
    return 'http://192.168.0.101:3000'; // Android emulator IP
  };

  return {
    API_BASE_URL: getApiUrl(),
    API_TIMEOUT: 10000,
    ENABLE_LOGGING: __DEV__,
    ENVIRONMENT: __DEV__ ? 'development' : 'production',
    APP_NAME: 'Percli',
    APP_VERSION: '1.0.0',
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
