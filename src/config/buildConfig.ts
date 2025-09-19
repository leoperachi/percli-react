// Build Configuration
// Este arquivo contém configurações específicas para diferentes ambientes de build

export interface BuildConfig {
  environment: 'development' | 'staging' | 'production';
  apiBaseUrl: string;
  enableLogging: boolean;
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  version: string;
  buildNumber: string;
}

// Configurações para desenvolvimento
const developmentConfig: BuildConfig = {
  environment: 'development',
  apiBaseUrl: 'http://localhost:3000',
  enableLogging: true,
  enableAnalytics: false,
  enableCrashReporting: false,
  version: '1.0.0-dev',
  buildNumber: '1',
};

// Configurações para staging
const stagingConfig: BuildConfig = {
  environment: 'staging',
  apiBaseUrl: 'https://staging-api.pertech.com',
  enableLogging: true,
  enableAnalytics: true,
  enableCrashReporting: true,
  version: '1.0.0-staging',
  buildNumber: '1',
};

// Configurações para produção
const productionConfig: BuildConfig = {
  environment: 'production',
  apiBaseUrl: 'https://api.pertech.com',
  enableLogging: false,
  enableAnalytics: true,
  enableCrashReporting: true,
  version: '1.0.0',
  buildNumber: '1',
};

// Função para determinar a configuração baseada no ambiente
const getBuildConfig = (): BuildConfig => {
  // Em desenvolvimento, sempre usar configuração de desenvolvimento
  if (__DEV__) {
    return developmentConfig;
  }

  // Em produção, você pode usar variáveis de ambiente ou outras lógicas
  // para determinar se é staging ou production
  const buildType = process.env.BUILD_TYPE || 'production';

  switch (buildType) {
    case 'staging':
      return stagingConfig;
    case 'production':
    default:
      return productionConfig;
  }
};

export const BUILD_CONFIG = getBuildConfig();

// Funções auxiliares
export const isDevelopment = () => BUILD_CONFIG.environment === 'development';
export const isStaging = () => BUILD_CONFIG.environment === 'staging';
export const isProduction = () => BUILD_CONFIG.environment === 'production';

// Configurações específicas para diferentes plataformas
export const PLATFORM_CONFIG = {
  ios: {
    bundleIdentifier: 'com.pertech.percli',
    appStoreUrl: 'https://apps.apple.com/app/pertech/id123456789',
  },
  android: {
    packageName: 'com.pertech.percli',
    playStoreUrl:
      'https://play.google.com/store/apps/details?id=com.pertech.percli',
  },
};

// Configurações de recursos
export const FEATURE_FLAGS = {
  enablePushNotifications: isProduction() || isStaging(),
  enableBiometricAuth: true,
  enableDarkMode: true,
  enableOfflineMode: true,
  enableAnalytics: BUILD_CONFIG.enableAnalytics,
  enableCrashReporting: BUILD_CONFIG.enableCrashReporting,
};

// Configurações de segurança
export const SECURITY_CONFIG = {
  enableCertificatePinning: isProduction(),
  enableRootDetection: isProduction(),
  enableDebuggerDetection: isProduction(),
  enableEmulatorDetection: isProduction(),
};

// Configurações de performance
export const PERFORMANCE_CONFIG = {
  enableImageOptimization: true,
  enableCodeSplitting: isProduction(),
  enableLazyLoading: true,
  cacheTimeout: isProduction() ? 300 : 60, // segundos
};

// Configurações de debug
export const DEBUG_CONFIG = {
  enableNetworkLogging: isDevelopment(),
  enableReduxDevTools: isDevelopment(),
  enableReactDevTools: isDevelopment(),
  enableFlipper: isDevelopment(),
};

// Exportar todas as configurações
export const APP_CONFIG = {
  build: BUILD_CONFIG,
  platform: PLATFORM_CONFIG,
  features: FEATURE_FLAGS,
  security: SECURITY_CONFIG,
  performance: PERFORMANCE_CONFIG,
  debug: DEBUG_CONFIG,
};

// Função para obter configuração específica
export const getConfig = <T extends keyof typeof APP_CONFIG>(
  section: T,
): (typeof APP_CONFIG)[T] => {
  return APP_CONFIG[section];
};

// Função para verificar se uma feature está habilitada
export const isFeatureEnabled = (
  feature: keyof typeof FEATURE_FLAGS,
): boolean => {
  return FEATURE_FLAGS[feature];
};

// Função para obter URL da API baseada no ambiente
export const getApiBaseUrl = (): string => {
  return BUILD_CONFIG.apiBaseUrl;
};

// Função para obter informações da versão
export const getVersionInfo = () => {
  return {
    version: BUILD_CONFIG.version,
    buildNumber: BUILD_CONFIG.buildNumber,
    environment: BUILD_CONFIG.environment,
  };
};
