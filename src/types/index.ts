export interface Menu {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
  uplevel: number;
  isActive: boolean;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorizationResource {
  resource: string;
  menus: Menu[];
}

export interface Authorization {
  id: number;
  father: string;
  children: AuthorizationResource[];
}

export interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  authorizations: Authorization[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role?: Role;
  roleName?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  profilePhoto?: string; // Alias para profilePicture
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  access: string;
  access_token?: string;
  refresh: string;
  refresh_token?: string;
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
  profilePhoto?: string;
  profilePicture?: string;
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
  updateUser: (userData: Partial<User>) => void;
  setLoading: (loading: LoadingState) => void;
  showMessage: (type: MessageState['type'], message: string) => void;
  hideMessage: () => void;
  loginWithGoogle: () => Promise<boolean>;
}

// Chat-related interfaces
export interface ChatUser {
  id: string;
  name: string;
  avatar?: string;
  profilePhoto?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  chatId: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  replyTo?: string; // Message ID this is replying to
}

export interface Chat {
  id: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  lastActivity: string;
  unreadCount: number;
  chatType: 'direct' | 'group';
  chatName?: string; // For group chats
  chatAvatar?: string; // For group chats
  createdAt: string;
  updatedAt: string;
}

export interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  loadChats: () => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (
    text: string,
    receiverId: string,
    replyTo?: string,
  ) => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  createChat: (participantId: string) => Promise<Chat | null>;
  setCurrentChat: (chat: Chat | null) => void;
  clearMessages: () => void;
}

// Auth Response interface
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
