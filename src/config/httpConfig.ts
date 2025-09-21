import { ENV } from './environment';

// HTTP Configuration
export interface HttpConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
}

// API Configuration
export const API_CONFIG = {
  // Base URL for the backend API - now using environment variables
  BASE_URL: ENV.API_BASE_URL,

  // API Endpoints
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      VERIFY_EMAIL: '/auth/verify-email',
    },

    // User endpoints
    USER: {
      PROFILE: '/user/profile',
      UPDATE_PROFILE: '/user/profile',
      DELETE_ACCOUNT: '/user/delete',
      UPLOAD_AVATAR: '/user/avatar',
    },

    // Add more endpoints as needed
    // PRODUCTS: {
    //   LIST: '/api/products',
    //   DETAILS: '/api/products/:id',
    //   CREATE: '/api/products',
    //   UPDATE: '/api/products/:id',
    //   DELETE: '/api/products/:id',
    // },
  },

  // Request timeout in milliseconds
  TIMEOUT: 10000,

  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000, // milliseconds
  },

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

// HTTP Configuration using environment variables
export const getCurrentHttpConfig = (): HttpConfig => {
  return {
    baseURL: ENV.API_BASE_URL,
    timeout: ENV.API_TIMEOUT,
    retryAttempts: ENV.ENVIRONMENT === 'development' ? 3 : 2,
    retryDelay: ENV.ENVIRONMENT === 'development' ? 1000 : 2000,
    enableLogging: ENV.ENABLE_LOGGING,
  };
};

export const HTTP_CONFIG = getCurrentHttpConfig();

// Helper function to build full URL
export const buildUrl = (
  endpoint: string,
  params?: Record<string, string | number>,
): string => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // Replace URL parameters (e.g., :id with actual values)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }

  return url;
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified?: boolean;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    access: string;
    refresh: string;
    expiresIn: number;
  };
}

// Error types
export interface ApiError {
  message: string;
  code?: string | number;
  details?: any;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Request configuration types
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// Upload configuration
export interface UploadConfig {
  maxFileSize: number; // in bytes
  allowedTypes: string[];
  maxFiles: number;
}

export const UPLOAD_CONFIG: UploadConfig = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  maxFiles: 1,
};

// Cache configuration
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // time to live in seconds
  maxSize: number; // maximum number of cached items
}

export const CACHE_CONFIG: CacheConfig = {
  enabled: true,
  ttl: 300, // 5 minutes
  maxSize: 100,
};

// Network status types
export interface NetworkStatus {
  isConnected: boolean;
  connectionType?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  isInternetReachable?: boolean;
}

// Request interceptor types
export interface RequestInterceptor {
  onRequest?: (config: any) => any | Promise<any>;
  onRequestError?: (error: any) => any | Promise<any>;
}

// Response interceptor types
export interface ResponseInterceptor {
  onResponse?: (response: any) => any | Promise<any>;
  onResponseError?: (error: any) => any | Promise<any>;
}
