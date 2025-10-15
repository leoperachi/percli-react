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
      return;
    }

    this.isConnecting = true;

    // Get token from storage if not provided
    let authToken = token;
    if (!authToken) {
      authToken = (await hybridStorageService.getAccessToken()) ?? undefined;
    }

    if (!authToken) {
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
      this.isConnecting = false;
    });

    this.socket.on('disconnect', reason => {
      this.isConnecting = false;

      // If disconnected due to authentication error, clean up
      if (
        reason === 'io server disconnect' ||
        reason === 'io client disconnect'
      ) {
        // Intentional disconnect
      }
    });

    this.socket.on('connect_error', error => {
      this.isConnecting = false;

      // Check if error is authentication related
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('auth') ||
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized')
      ) {
        this.disconnect();
      }
    });

    // Chat event listeners
    this.socket.on('new_message', data => {
      // Handle new message
    });

    this.socket.on('message_edited', data => {
      // Handle message edit
    });

    this.socket.on('message_deleted', data => {
      // Handle message deletion
    });

    this.socket.on('user_typing', data => {
      // Handle user typing
    });

    this.socket.on('unread_messages_count', data => {
      // Handle unread count
    });

    this.socket.on('unread_count_updated', data => {
      // Handle unread count update
    });

    this.socket.on('joined_chat', data => {
      // Handle joined chat
    });

    this.socket.on('left_chat', data => {
      // Handle left chat
    });

    this.socket.on('user_joined_chat', data => {
      // Handle user joined
    });

    this.socket.on('user_left_chat', data => {
      // Handle user left
    });

    this.socket.on('messages_marked_read', data => {
      // Handle messages marked read
    });

    // Recent conversations event (sent automatically on connect)
    this.socket.on('recent_conversations', data => {
      // Handle recent conversations
    });

    this.socket.on('error', data => {
      // Handle authentication errors
      if (data && typeof data === 'object' && 'message' in data) {
        const message = String(data.message).toLowerCase();
        if (
          message.includes('auth') ||
          message.includes('token') ||
          message.includes('unauthorized')
        ) {
          this.disconnect();
        }
      }
    });

    // Listen for specific auth error event from server
    this.socket.on('auth_error', data => {
      this.disconnect();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Chat-specific methods
  joinChat(chatId: string): void {
    this.emit('join_chat', { chatId });
  }

  leaveChat(chatId: string): void {
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
    this.emit('send_message', data);
  }

  editMessage(messageId: string, content: string): void {
    this.emit('edit_message', { messageId, content });
  }

  deleteMessage(messageId: string): void {
    this.emit('delete_message', { messageId });
  }

  markMessagesRead(messageIds: string[]): void {
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
    this.emit('get_recent_conversations');
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Instância singleton
export const socketService = new SocketServiceImpl();
