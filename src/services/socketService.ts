import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { ENV } from '../config/environment';
import hybridStorageService from './hybridStorageService';

interface SocketService {
  connect: (token?: string) => void;
  disconnect: () => void;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string, callback?: (data: unknown) => void) => void;
  isConnected: () => boolean;
}

class SocketServiceImpl implements SocketService {
  private socket: Socket | null = null;
  private baseURL: string = ENV.API_BASE_URL;
  private isConnecting: boolean = false;

  async connect(token?: string): Promise<void> {
    if (this.socket?.connected || this.isConnecting) {
      console.log('🔌 [SocketService] Already connected or connecting');
      return;
    }

    console.log('🔌 [SocketService] Connecting to server...');
    this.isConnecting = true;

    // Get token from storage if not provided
    let authToken = token;
    if (!authToken) {
      authToken = await hybridStorageService.getAccessToken();
    }

    if (!authToken) {
      console.error('❌ [SocketService] No authentication token available');
      this.isConnecting = false;
      return;
    }

    this.socket = io(this.baseURL, {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true,
      auth: {
        token: authToken,
      },
      extraHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    this.socket.on('connect', () => {
      console.log('✅ [SocketService] Connected to server');
      this.isConnecting = false;
    });

    this.socket.on('disconnect', reason => {
      console.log('❌ [SocketService] Disconnected from server:', reason);
      this.isConnecting = false;

      // If disconnected due to authentication error, clean up
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        console.log('🔌 [SocketService] Disconnect reason indicates intentional disconnect');
      }
    });

    this.socket.on('connect_error', error => {
      console.error('❌ [SocketService] Connection error:', error);
      this.isConnecting = false;

      // Check if error is authentication related
      const errorMessage = error?.message || '';
      if (errorMessage.includes('auth') || errorMessage.includes('token') || errorMessage.includes('unauthorized')) {
        console.error('🔒 [SocketService] Authentication error - token may be expired');
        this.disconnect();
      }
    });

    // Chat event listeners
    this.socket.on('new_message', data => {
      console.log('💬 [SocketService] New message received:', data);
    });

    this.socket.on('message_edited', data => {
      console.log('✏️ [SocketService] Message edited:', data);
    });

    this.socket.on('message_deleted', data => {
      console.log('🗑️ [SocketService] Message deleted:', data);
    });

    this.socket.on('user_typing', data => {
      console.log('⌨️ [SocketService] User typing:', data);
    });

    this.socket.on('unread_messages_count', data => {
      console.log('📬 [SocketService] Unread messages count:', data);
    });

    this.socket.on('unread_count_updated', data => {
      console.log('📬 [SocketService] Unread count updated:', data);
    });

    this.socket.on('joined_chat', data => {
      console.log('🚪 [SocketService] Joined chat:', data);
    });

    this.socket.on('left_chat', data => {
      console.log('🚪 [SocketService] Left chat:', data);
    });

    this.socket.on('user_joined_chat', data => {
      console.log('👋 [SocketService] User joined chat:', data);
    });

    this.socket.on('user_left_chat', data => {
      console.log('👋 [SocketService] User left chat:', data);
    });

    this.socket.on('messages_marked_read', data => {
      console.log('✓ [SocketService] Messages marked read:', data);
    });

    // Recent conversations event (sent automatically on connect)
    this.socket.on('recent_conversations', data => {
      console.log('👥 [SocketService] Recent conversations received:', data);
    });

    this.socket.on('error', data => {
      console.error('❌ [SocketService] Socket error:', data);

      // Handle authentication errors
      if (data && typeof data === 'object' && 'message' in data) {
        const message = String(data.message).toLowerCase();
        if (message.includes('auth') || message.includes('token') || message.includes('unauthorized')) {
          console.error('🔒 [SocketService] Authentication error from server - disconnecting');
          this.disconnect();
        }
      }
    });

    // Listen for specific auth error event from server
    this.socket.on('auth_error', (data) => {
      console.error('🔒 [SocketService] Authentication error event received:', data);
      this.disconnect();
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log('🔌 [SocketService] Disconnecting from server...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      console.log(`📤 [SocketService] Emitting ${event}:`, data);
      this.socket.emit(event, data);
    } else {
      console.warn(`⚠️ [SocketService] Cannot emit ${event} - not connected`);
    }
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      console.log(`👂 [SocketService] Listening for ${event}`);
      this.socket.on(event, callback);
    } else {
      console.warn(
        `⚠️ [SocketService] Cannot listen for ${event} - socket not initialized`,
      );
    }
  }

  off(event: string, callback?: (data: unknown) => void): void {
    if (this.socket) {
      console.log(`🔇 [SocketService] Removing listener for ${event}`);
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Chat-specific methods
  joinChat(chatId: string): void {
    console.log('🚪 [SocketService] Joining chat:', chatId);
    this.emit('join_chat', { chatId });
  }

  leaveChat(chatId: string): void {
    console.log('🚪 [SocketService] Leaving chat:', chatId);
    this.emit('leave_chat', { chatId });
  }

  sendMessage(data: {
    chatId: string;
    content?: string;
    messageType: 'text' | 'image' | 'file';
    replyToId?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
  }): void {
    console.log('💬 [SocketService] Sending message:', data);
    this.emit('send_message', data);
  }

  editMessage(messageId: string, content: string): void {
    console.log('✏️ [SocketService] Editing message:', messageId);
    this.emit('edit_message', { messageId, content });
  }

  deleteMessage(messageId: string): void {
    console.log('🗑️ [SocketService] Deleting message:', messageId);
    this.emit('delete_message', { messageId });
  }

  markMessagesRead(messageIds: string[]): void {
    console.log('✓ [SocketService] Marking messages as read:', messageIds);
    this.emit('mark_messages_read', { messageIds });
  }

  startTyping(chatId: string): void {
    this.emit('typing_start', { chatId });
  }

  stopTyping(chatId: string): void {
    this.emit('typing_stop', { chatId });
  }

  // Request recent conversations (manual refresh)
  getRecentConversations(): void {
    console.log('👥 [SocketService] Requesting recent conversations...');
    this.emit('get_recent_conversations');
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Instância singleton
export const socketService = new SocketServiceImpl();
