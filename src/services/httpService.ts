import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENV, log, logError } from '../config/environment';
import { API_CONFIG, ApiResponse } from '../config/api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@pertech_access_token',
  REFRESH_TOKEN: '@pertech_refresh_token',
  USER_DATA: '@pertech_user_data',
} as const;

class HttpService {
  private axiosInstance: AxiosInstance;
  private isRefreshing: boolean = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor() {
    console.log('🌐 [HTTP SERVICE] Initializing with base URL:', ENV.API_BASE_URL);
    
    this.axiosInstance = axios.create({
      baseURL: ENV.API_BASE_URL,
      timeout: ENV.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.axiosInstance.interceptors.request.use(
      async config => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
        log(`Full URL: ${config.baseURL}${config.url}`);
        return config;
      },
      error => {
        logError('Request interceptor error:', error);
        return Promise.reject(error);
      },
    );

    // Response interceptor to handle token refresh
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // If already refreshing, queue the request
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then(() => {
                return this.axiosInstance(originalRequest);
              })
              .catch(err => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshed = await this.refreshToken();
            if (refreshed) {
              // Process failed queue
              this.processQueue(null);
              return this.axiosInstance(originalRequest);
            } else {
              // Refresh failed, clear storage and redirect to login
              await this.clearStorage();
              this.processQueue(
                new Error('Session expired. Please login again.'),
              );
              throw new Error('Session expired. Please login again.');
            }
          } catch (refreshError) {
            this.processQueue(refreshError);
            await this.clearStorage();
            throw refreshError;
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  private processQueue(error: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });

    this.failedQueue = [];
  }

  // Token management methods
  private async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      logError('Error getting access token:', error);
      return null;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      logError('Error getting refresh token:', error);
      return null;
    }
  }

  private async storeTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken),
        AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken),
      ]);
    } catch (error) {
      logError('Error storing tokens:', error);
    }
  }

  private async clearStorage(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      logError('Error clearing storage:', error);
    }
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        return false;
      }

      const response = await axios.post(
        `${ENV.API_BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
        { refreshToken },
        {
          headers: API_CONFIG.HEADERS,
        },
      );

      if (response.data.success && response.data.data) {
        await this.storeTokens(
          response.data.data.tokens.access,
          response.data.data.tokens.refresh,
        );
        return true;
      }

      return false;
    } catch (error) {
      logError('Token refresh failed:', error);
      return false;
    }
  }

  // Generic HTTP methods
  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.get(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.post(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.put(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.patch(url, data, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.axiosInstance.delete(url, config);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse {
    logError('HTTP Request failed:', error);

    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Network error occurred';
      return {
        success: false,
        error: message,
        errors: error.response?.data?.errors,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse> {
    const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    if (response.success && response.data) {
      await this.storeTokens(
        response.data.tokens.access,
        response.data.tokens.refresh,
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.data.user),
      );
    }

    return response;
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<ApiResponse> {
    const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      name,
    });

    if (response.success && response.data) {
      await this.storeTokens(
        response.data.tokens.access,
        response.data.tokens.refresh,
      );
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(response.data.user),
      );
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT);
    await this.clearStorage();
    return response;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.post(API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  // User methods
  async getUserProfile(): Promise<ApiResponse> {
    return this.get(API_CONFIG.ENDPOINTS.USER.PROFILE);
  }

  async updateUserProfile(userData: any): Promise<ApiResponse> {
    return this.put(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, userData);
  }

  // Helper methods
  async getStoredUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      logError('Error getting stored user data:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  }

  // Method to update base URL if needed
  updateBaseURL(newBaseURL: string): void {
    this.axiosInstance.defaults.baseURL = newBaseURL;
  }

  // Method to get current base URL
  getBaseURL(): string {
    return this.axiosInstance.defaults.baseURL || '';
  }
}

export default new HttpService();
