import * as Keychain from 'react-native-keychain';
import { User, AuthResponse } from '../types';

interface SecureStorageOptions {
  accessGroup?: string;
  accessControl?: Keychain.ACCESS_CONTROL;
  authenticationType?: Keychain.AUTHENTICATION_TYPE;
  service?: string;
}

class SecureStorageService {
  private readonly defaultOptions = {
    service: 'percli_app',
    accessGroup: undefined,
  };

  private readonly KEYS = {
    USER_DATA: 'percli_user_data',
    ACCESS_TOKEN: 'percli_access_token',
    REFRESH_TOKEN: 'percli_refresh_token',
    AUTH_STATE: 'percli_auth_state',
  };

  // Store user credentials and tokens
  async setAuthData(
    authData: AuthResponse,
    options?: SecureStorageOptions,
  ): Promise<boolean> {
    try {

      const { user, tokens } = authData;

      // Store user data
      const userResult = await this.setUserData(user, options);

      // Store tokens
      const accessResult = await this.setAccessToken(tokens.access, options);

      const refreshResult = await this.setRefreshToken(tokens.refresh, options);

      // Mark as authenticated
      const authResult = await this.setAuthState(true, options);

      const success = userResult && accessResult && refreshResult && authResult;

      return success;
    } catch (error) {

      // Don't throw, just return false to prevent app crash
      return false;
    }
  }

  // Store user data
  async setUserData(
    user: User,
    options?: SecureStorageOptions,
  ): Promise<boolean> {
    try {
      const userData = JSON.stringify(user);
      const storeOptions = { ...this.defaultOptions, ...options };

      await Keychain.setInternetCredentials(
        this.KEYS.USER_DATA,
        user.email,
        userData,
        storeOptions,
      );
      return true;
    } catch (error) {

      // Try with even simpler options if the default fails
      try {

        await Keychain.setInternetCredentials(
          this.KEYS.USER_DATA,
          user.email,
          JSON.stringify(user),
          { service: 'percli_app' },
        );

        return true;
      } catch (fallbackError) {

        return false;
      }
    }
  }

  // Get user data
  async getUserData(): Promise<User | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(
        this.KEYS.USER_DATA,
      );
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password) as User;
      }
      return null;
    } catch (error) {

      return null;
    }
  }

  // Store access token
  async setAccessToken(
    token: string,
    options?: SecureStorageOptions,
  ): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        this.KEYS.ACCESS_TOKEN,
        'access_token',
        token,
        { ...this.defaultOptions, ...options },
      );
      return true;
    } catch (error) {

      // Try with basic options
      try {
        await Keychain.setInternetCredentials(
          this.KEYS.ACCESS_TOKEN,
          'access_token',
          token,
          { service: 'percli_app' },
        );
        return true;
      } catch (fallbackError) {

        return false;
      }
    }
  }

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(
        this.KEYS.ACCESS_TOKEN,
      );
      return credentials ? credentials.password : null;
    } catch (error) {

      return null;
    }
  }

  // Store refresh token
  async setRefreshToken(
    token: string,
    options?: SecureStorageOptions,
  ): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        this.KEYS.REFRESH_TOKEN,
        'refresh_token',
        token,
        { ...this.defaultOptions, ...options },
      );
      return true;
    } catch (error) {

      // Try with basic options
      try {
        await Keychain.setInternetCredentials(
          this.KEYS.REFRESH_TOKEN,
          'refresh_token',
          token,
          { service: 'percli_app' },
        );
        return true;
      } catch (fallbackError) {

        return false;
      }
    }
  }

  // Get refresh token
  async getRefreshToken(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(
        this.KEYS.REFRESH_TOKEN,
      );
      return credentials ? credentials.password : null;
    } catch (error) {

      return null;
    }
  }

  // Set authentication state
  async setAuthState(
    isAuthenticated: boolean,
    options?: SecureStorageOptions,
  ): Promise<boolean> {
    try {
      await Keychain.setInternetCredentials(
        this.KEYS.AUTH_STATE,
        'auth_state',
        String(isAuthenticated),
        { ...this.defaultOptions, ...options },
      );
      return true;
    } catch (error) {

      // Try with basic options
      try {
        await Keychain.setInternetCredentials(
          this.KEYS.AUTH_STATE,
          'auth_state',
          String(isAuthenticated),
          { service: 'percli_app' },
        );
        return true;
      } catch (fallbackError) {

        return false;
      }
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const credentials = await Keychain.getInternetCredentials(
        this.KEYS.AUTH_STATE,
      );
      if (credentials && credentials.password) {
        return credentials.password === 'true';
      }
      return false;
    } catch (error) {

      return false;
    }
  }

  // Update user data (for profile updates)
  async updateUserData(updates: Partial<User>): Promise<boolean> {
    try {
      const currentUser = await this.getUserData();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        return await this.setUserData(updatedUser);
      }
      return false;
    } catch (error) {

      return false;
    }
  }

  // Clear all authentication data
  async clearAuthData(): Promise<boolean> {
    try {
      await Promise.all([
        Keychain.resetInternetCredentials({
          server: this.KEYS.USER_DATA,
        } as any),
        Keychain.resetInternetCredentials({
          server: this.KEYS.ACCESS_TOKEN,
        } as any),
        Keychain.resetInternetCredentials({
          server: this.KEYS.REFRESH_TOKEN,
        } as any),
        Keychain.resetInternetCredentials({
          server: this.KEYS.AUTH_STATE,
        } as any),
      ]);
      return true;
    } catch (error) {

      return false;
    }
  }

  // Clear specific item
  async clearItem(key: keyof typeof this.KEYS): Promise<boolean> {
    try {
      await Keychain.resetInternetCredentials({
        server: this.KEYS[key],
      } as any);
      return true;
    } catch (error) {

      return false;
    }
  }

  // Check if keychain is available
  async isKeychainAvailable(): Promise<boolean> {
    try {
      const result = await Keychain.getSupportedBiometryType();
      return result !== null;
    } catch (error) {

      return false;
    }
  }

  // Get supported biometry type
  async getSupportedBiometryType(): Promise<Keychain.BIOMETRY_TYPE | null> {
    try {
      return await Keychain.getSupportedBiometryType();
    } catch (error) {

      return null;
    }
  }

  // Check if any auth data exists
  async hasAuthData(): Promise<boolean> {
    try {
      const [userData, accessToken, authState] = await Promise.all([
        this.getUserData(),
        this.getAccessToken(),
        this.isAuthenticated(),
      ]);

      return !!(userData && accessToken && authState);
    } catch (error) {

      return false;
    }
  }

  // Get all stored items (for debugging - use carefully)
  async getAllStoredItems(): Promise<Record<string, any>> {
    try {
      const [userData, accessToken, refreshToken, authState] =
        await Promise.all([
          this.getUserData(),
          this.getAccessToken(),
          this.getRefreshToken(),
          this.isAuthenticated(),
        ]);

      return {
        userData,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        authState,
      };
    } catch (error) {

      return {};
    }
  }

  // Validate stored tokens (check if they exist and are not empty)
  async validateStoredTokens(): Promise<{
    accessToken: boolean;
    refreshToken: boolean;
  }> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken(),
        this.getRefreshToken(),
      ]);

      return {
        accessToken: !!(accessToken && accessToken.length > 0),
        refreshToken: !!(refreshToken && refreshToken.length > 0),
      };
    } catch (error) {

      return { accessToken: false, refreshToken: false };
    }
  }
}

export const secureStorageService = new SecureStorageService();
export default secureStorageService;
