import { ENV } from './environment';

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
    },

    // Users management endpoints
    USERS: {
      LIST: '/users/',
    },

    // Roles management endpoints
    ROLES: {
      LIST: '/roles/',
    },

    // Chat endpoints
    CHATS: {
      LIST: '/chats/',
      CREATE: '/chats/',
      GET_BY_ID: '/chats/:chatId',
      GET_OR_CREATE_DIRECT: '/chats/direct/:userId',
      UPDATE: '/chats/:chatId',
      UNREAD_COUNT: '/chats/unread-count',
      MESSAGES: '/chats/:chatId/messages',
      SEND_MESSAGE: '/chats/:chatId/messages',
      MARK_READ: '/chats/messages/mark-read',
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

  // Headers
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

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
