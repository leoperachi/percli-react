// Example usage of HTTP Service
import HttpService from '../services/httpService';
import NetworkService from '../services/networkService';
import type {
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types';

// Example: Authentication functions
export const authService = {
  // Login user
  async login(credentials: LoginRequest) {
    try {
      // Check network connectivity before making request
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.login(
        credentials.email,
        credentials.password,
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Register user
  async register(userData: RegisterRequest) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.register(
        userData.email,
        userData.password,
        userData.name,
      );

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData: ChangePasswordRequest) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
      );

      if (response.success) {
        return true;
      } else {
        throw new Error(response.error || 'Password change failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  async logout() {
    try {
      return true;
    } catch (error) {
      // Even if logout fails on server, clear local data
      return true;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    return await HttpService.isAuthenticated();
  },

  // Get stored user data
  async getStoredUserData() {
    return await HttpService.getStoredUserData();
  },
};

// Example: User profile functions
export const userService = {
  // Get user profile
  async getProfile() {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.getUserProfile();

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get profile');
      }
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userData: UpdateProfileRequest) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.updateUserProfile(userData);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      throw error;
    }
  },
};

// Example: Generic API calls
export const apiService = {
  // Generic GET request
  async get<T>(url: string) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.get<T>(url);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Request failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Generic POST request
  async post<T, TData = unknown>(url: string, data: TData) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.post<T>(url, data);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Request failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Generic PUT request
  async put<T, TData = unknown>(url: string, data: TData) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.put<T>(url, data);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Request failed');
      }
    } catch (error) {
      throw error;
    }
  },

  // Generic DELETE request
  async delete<T>(url: string) {
    try {
      if (!NetworkService.isConnected()) {
        throw new Error('No internet connection');
      }

      const response = await HttpService.delete<T>(url);

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Request failed');
      }
    } catch (error) {
      throw error;
    }
  },
};

// Example: Network monitoring
export const networkService = {
  // Subscribe to network status changes
  subscribeToNetworkChanges(callback: (isConnected: boolean) => void) {
    return NetworkService.subscribe(status => {
      callback(status.isConnected);
    });
  },

  // Get current network status
  getNetworkStatus() {
    return NetworkService.getNetworkStatus();
  },

  // Check if connected
  isConnected() {
    return NetworkService.isConnected();
  },

  // Get detailed network info
  async getDetailedInfo() {
    return await NetworkService.getDetailedNetworkInfo();
  },
};

// Export logger service
export { logger } from './loggerService';
export { LogAnalyzer } from './logAnalyzer';
