// Environment Configuration

export interface EnvironmentConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  ENABLE_LOGGING: boolean;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}

// Development environment
const developmentConfig: EnvironmentConfig = {
  API_BASE_URL: 'http://192.168.0.101:8085',
  API_TIMEOUT: 10000,
  ENABLE_LOGGING: true,
  ENVIRONMENT: 'development',
};

// Staging environment
const stagingConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://staging-api.pertech.com',
  API_TIMEOUT: 15000,
  ENABLE_LOGGING: true,
  ENVIRONMENT: 'staging',
};

// Production environment
const productionConfig: EnvironmentConfig = {
  API_BASE_URL: 'https://api.pertech.com',
  API_TIMEOUT: 15000,
  ENABLE_LOGGING: false,
  ENVIRONMENT: 'production',
};

// Determine current environment based on __DEV__ flag
const getCurrentConfig = (): EnvironmentConfig => {
  if (__DEV__) {
    return developmentConfig;
  }

  // You can add more logic here to determine staging vs production
  // For example, based on build configuration or environment variables
  return productionConfig;
};

export const ENV = getCurrentConfig();

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