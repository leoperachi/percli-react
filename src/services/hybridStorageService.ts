import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { User, AuthResponse } from '../types';

interface StorageOptions {
  useKeychain?: boolean;
  service?: string;
}

class HybridStorageService {
  private readonly ASYNC_STORAGE_PREFIX = '@percli_app:';
  private readonly KEYCHAIN_SERVICE = 'percli_app';

  private readonly KEYS = {
    USER_DATA: 'user_data',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    AUTH_STATE: 'auth_state',
    STORAGE_METHOD: 'storage_method', // Track which method is being used
  };

  // Store auth data using the best available method
  async setAuthData(authData: AuthResponse, options?: StorageOptions): Promise<boolean> {
    try {
      console.log('🔄 [HYBRID STORAGE] Attempting to store auth data...');
      const { user, tokens } = authData;

      // Try Keychain first (more secure)
      const keychainSuccess = await this.tryKeychainStorage(authData);

      if (keychainSuccess) {
        console.log('✅ [HYBRID STORAGE] Successfully stored in Keychain');
        await this.setStorageMethod('keychain');
        return true;
      }

      // Fallback to AsyncStorage
      console.log('🔄 [HYBRID STORAGE] Keychain failed, using AsyncStorage fallback...');
      const asyncSuccess = await this.tryAsyncStorageStorage(authData);

      if (asyncSuccess) {
        console.log('✅ [HYBRID STORAGE] Successfully stored in AsyncStorage');
        await this.setStorageMethod('async');
        return true;
      }

      console.error('❌ [HYBRID STORAGE] Both storage methods failed');
      return false;
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Critical error in setAuthData:', error);
      return false;
    }
  }

  // Try to store in Keychain with minimal options
  private async tryKeychainStorage(authData: AuthResponse): Promise<boolean> {
    try {
      const { user, tokens } = authData;

      // Handle different token formats from server
      const accessToken = tokens.access || tokens.access_token;
      const refreshToken = tokens.refresh || tokens.refresh_token;

      if (!accessToken || !refreshToken) {
        console.error('🔐 [KEYCHAIN] Missing tokens in auth data:', tokens);
        return false;
      }

      // Use minimal Keychain options to avoid crashes
      const options: Keychain.Options = {
        service: this.KEYCHAIN_SERVICE,
      };

      // Store each piece separately with basic options
      await Keychain.setInternetCredentials(
        `${this.KEYCHAIN_SERVICE}_${this.KEYS.USER_DATA}`,
        user.email,
        JSON.stringify(user),
        options
      );

      await Keychain.setInternetCredentials(
        `${this.KEYCHAIN_SERVICE}_${this.KEYS.ACCESS_TOKEN}`,
        'access_token',
        accessToken,
        options
      );

      await Keychain.setInternetCredentials(
        `${this.KEYCHAIN_SERVICE}_${this.KEYS.REFRESH_TOKEN}`,
        'refresh_token',
        refreshToken,
        options
      );

      await Keychain.setInternetCredentials(
        `${this.KEYCHAIN_SERVICE}_${this.KEYS.AUTH_STATE}`,
        'auth_state',
        'true',
        options
      );

      return true;
    } catch (error) {
      console.error('🔐 [KEYCHAIN] Storage failed:', error);
      return false;
    }
  }

  // Store in AsyncStorage as fallback
  private async tryAsyncStorageStorage(authData: AuthResponse): Promise<boolean> {
    try {
      const { user, tokens } = authData;

      // Handle different token formats from server
      const accessToken = tokens.access || tokens.access_token;
      const refreshToken = tokens.refresh || tokens.refresh_token;

      if (!accessToken || !refreshToken) {
        console.error('💾 [ASYNC STORAGE] Missing tokens in auth data:', tokens);
        return false;
      }

      await Promise.all([
        AsyncStorage.setItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.USER_DATA}`, JSON.stringify(user)),
        AsyncStorage.setItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.ACCESS_TOKEN}`, accessToken),
        AsyncStorage.setItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.REFRESH_TOKEN}`, refreshToken),
        AsyncStorage.setItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.AUTH_STATE}`, 'true'),
      ]);

      return true;
    } catch (error) {
      console.error('💾 [ASYNC STORAGE] Storage failed:', error);
      return false;
    }
  }

  // Get user data from the active storage method
  async getUserData(): Promise<User | null> {
    try {
      const storageMethod = await this.getStorageMethod();

      if (storageMethod === 'keychain') {
        return await this.getUserDataFromKeychain();
      } else {
        return await this.getUserDataFromAsyncStorage();
      }
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error getting user data:', error);
      return null;
    }
  }

  // Get access token from the active storage method
  async getAccessToken(): Promise<string | null> {
    try {
      const storageMethod = await this.getStorageMethod();

      if (storageMethod === 'keychain') {
        return await this.getAccessTokenFromKeychain();
      } else {
        return await this.getAccessTokenFromAsyncStorage();
      }
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error getting access token:', error);
      return null;
    }
  }

  // Get refresh token from the active storage method
  async getRefreshToken(): Promise<string | null> {
    try {
      const storageMethod = await this.getStorageMethod();

      if (storageMethod === 'keychain') {
        return await this.getRefreshTokenFromKeychain();
      } else {
        return await this.getRefreshTokenFromAsyncStorage();
      }
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error getting refresh token:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const storageMethod = await this.getStorageMethod();

      if (storageMethod === 'keychain') {
        return await this.isAuthenticatedFromKeychain();
      } else {
        return await this.isAuthenticatedFromAsyncStorage();
      }
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error checking auth state:', error);
      return false;
    }
  }

  // Clear all auth data from both storage methods
  async clearAuthData(): Promise<boolean> {
    try {
      console.log('🧹 [HYBRID STORAGE] Clearing all auth data...');

      // Clear from both methods to be safe
      await Promise.all([
        this.clearKeychainData(),
        this.clearAsyncStorageData(),
      ]);

      console.log('✅ [HYBRID STORAGE] All auth data cleared');
      return true;
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error clearing auth data:', error);
      return false;
    }
  }

  // Helper methods for Keychain operations
  private async getUserDataFromKeychain(): Promise<User | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.USER_DATA}`);
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as User;
      }
      return null;
    } catch (error) {
      console.error('🔐 [KEYCHAIN] Error getting user data:', error);
      return null;
    }
  }

  private async getAccessTokenFromKeychain(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.ACCESS_TOKEN}`);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('🔐 [KEYCHAIN] Error getting access token:', error);
      return null;
    }
  }

  private async getRefreshTokenFromKeychain(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.REFRESH_TOKEN}`);
      return credentials ? credentials.password : null;
    } catch (error) {
      console.error('🔐 [KEYCHAIN] Error getting refresh token:', error);
      return null;
    }
  }

  private async isAuthenticatedFromKeychain(): Promise<boolean> {
    try {
      const credentials = await Keychain.getInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.AUTH_STATE}`);
      return credentials ? credentials.password === 'true' : false;
    } catch (error) {
      console.error('🔐 [KEYCHAIN] Error checking auth state:', error);
      return false;
    }
  }

  private async clearKeychainData(): Promise<void> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.USER_DATA}`),
        Keychain.resetInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.ACCESS_TOKEN}`),
        Keychain.resetInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.REFRESH_TOKEN}`),
        Keychain.resetInternetCredentials(`${this.KEYCHAIN_SERVICE}_${this.KEYS.AUTH_STATE}`),
      ]);
    } catch (error) {
      console.error('🔐 [KEYCHAIN] Error clearing data:', error);
    }
  }

  // Helper methods for AsyncStorage operations
  private async getUserDataFromAsyncStorage(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.USER_DATA}`);
      return userData ? JSON.parse(userData) as User : null;
    } catch (error) {
      console.error('💾 [ASYNC STORAGE] Error getting user data:', error);
      return null;
    }
  }

  private async getAccessTokenFromAsyncStorage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.ACCESS_TOKEN}`);
    } catch (error) {
      console.error('💾 [ASYNC STORAGE] Error getting access token:', error);
      return null;
    }
  }

  private async getRefreshTokenFromAsyncStorage(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.REFRESH_TOKEN}`);
    } catch (error) {
      console.error('💾 [ASYNC STORAGE] Error getting refresh token:', error);
      return null;
    }
  }

  private async isAuthenticatedFromAsyncStorage(): Promise<boolean> {
    try {
      const authState = await AsyncStorage.getItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.AUTH_STATE}`);
      return authState === 'true';
    } catch (error) {
      console.error('💾 [ASYNC STORAGE] Error checking auth state:', error);
      return false;
    }
  }

  private async clearAsyncStorageData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.USER_DATA}`),
        AsyncStorage.removeItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.ACCESS_TOKEN}`),
        AsyncStorage.removeItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.REFRESH_TOKEN}`),
        AsyncStorage.removeItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.AUTH_STATE}`),
        AsyncStorage.removeItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.STORAGE_METHOD}`),
      ]);
    } catch (error) {
      console.error('💾 [ASYNC STORAGE] Error clearing data:', error);
    }
  }

  // Storage method tracking
  private async setStorageMethod(method: 'keychain' | 'async'): Promise<void> {
    try {
      await AsyncStorage.setItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.STORAGE_METHOD}`, method);
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error setting storage method:', error);
    }
  }

  private async getStorageMethod(): Promise<'keychain' | 'async'> {
    try {
      const method = await AsyncStorage.getItem(`${this.ASYNC_STORAGE_PREFIX}${this.KEYS.STORAGE_METHOD}`);
      return (method as 'keychain' | 'async') || 'async'; // Default to async if not set
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error getting storage method:', error);
      return 'async'; // Safe fallback
    }
  }

  // Debug method to see what's stored where
  async getStorageInfo(): Promise<{ method: string; hasData: boolean }> {
    try {
      const method = await this.getStorageMethod();
      const userData = await this.getUserData();
      const accessToken = await this.getAccessToken();

      return {
        method,
        hasData: !!(userData && accessToken)
      };
    } catch (error) {
      console.error('❌ [HYBRID STORAGE] Error getting storage info:', error);
      return { method: 'unknown', hasData: false };
    }
  }
}

export const hybridStorageService = new HybridStorageService();
export default hybridStorageService;