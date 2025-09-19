export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface LoginResponse {
  user: User;
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
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: LoadingState) => void;
  showMessage: (type: MessageState['type'], message: string) => void;
  hideMessage: () => void;
}