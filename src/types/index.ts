export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  emailVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  [key: string]: any;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface MessageState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  visible: boolean;
}

export interface AppContextType {
  user: User | null;
  loading: LoadingState;
  message: MessageState;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setLoading: (loading: LoadingState) => void;
  showMessage: (type: MessageState['type'], message: string) => void;
  hideMessage: () => void;
  loginWithGoogle: () => Promise<boolean>;
}
