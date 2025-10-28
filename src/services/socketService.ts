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
    if (this.socket?.connected) {
      console.log('[SocketService] Socket já está conectado');
      return;
    }

    if (this.isConnecting) {
      console.log('[SocketService] Socket já está em processo de conexão');
      return;
    }

    this.isConnecting = true;
    console.log('[SocketService] Iniciando conexão do socket');

    // Get token from storage if not provided
    let authToken = token;
    if (!authToken) {
      console.log('[SocketService] Token não fornecido, buscando no storage');
      authToken = (await hybridStorageService.getAccessToken()) ?? undefined;
    }

    if (!authToken) {
      console.error(
        '[SocketService] Token não encontrado, não é possível conectar',
      );
      this.isConnecting = false;
      return;
    }

    console.log(
      '[SocketService] Token obtido, conectando ao servidor:',
      this.baseURL,
    );

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
      console.log(
        '[SocketService] ✅ Socket conectado com sucesso! ID:',
        this.socket?.id,
      );
      this.isConnecting = false;
    });

    this.socket.on('disconnect', reason => {
      console.log('[SocketService] ❌ Socket desconectado. Razão:', reason);
      this.isConnecting = false;

      // If disconnected due to authentication error, clean up
      if (
        reason === 'io server disconnect' ||
        reason === 'io client disconnect'
      ) {
        console.log('[SocketService] Desconexão intencional');
      }
    });

    this.socket.on('connect_error', error => {
      console.error('[SocketService] ❌ Erro ao conectar socket:', error);
      this.isConnecting = false;

      // Check if error is authentication related
      const errorMessage = error?.message || '';
      if (
        errorMessage.includes('auth') ||
        errorMessage.includes('token') ||
        errorMessage.includes('unauthorized')
      ) {
        console.error('[SocketService] Erro de autenticação, desconectando');
        this.disconnect();
      }
    });

    // Note: user:join will be called from ChatContext with actual user data
    // Don't emit it here with wrong data

    // Chat event listeners (Backend events)
    this.socket.on('message:new', data => {
      console.log('[SocketService] 📩 Nova mensagem recebida:', data);
      // Handle new message
    });

    this.socket.on('message:edited', data => {
      console.log('[SocketService] ✏️ Mensagem editada:', data);
      // Handle message edit
    });

    this.socket.on('message:deleted', data => {
      console.log('[SocketService] 🗑️ Mensagem deletada:', data);
      // Handle message deletion
    });

    this.socket.on('user:typing', data => {
      console.log('[SocketService] ⌨️ Usuário digitando:', data);
      // Handle user typing
    });

    this.socket.on('unread_messages_count', data => {
      console.log('[SocketService] 📊 Contagem de não lidas:', data);
      // Handle unread count
    });

    this.socket.on('unread_count_updated', data => {
      console.log('[SocketService] 🔄 Contagem atualizada:', data);
      // Handle unread count update
    });

    this.socket.on('user:joined_chat', data => {
      console.log('[SocketService] 👋 Usuário entrou no chat:', data);
      // Handle user joined
    });

    this.socket.on('user:left_chat', data => {
      console.log('[SocketService] 👋 Usuário saiu do chat:', data);
      // Handle user left
    });

    this.socket.on('messages:read', data => {
      console.log('[SocketService] ✅ Mensagens marcadas como lidas:', data);
      // Handle messages marked read
    });

    this.socket.on('user:online', data => {
      console.log('[SocketService] 🟢 Usuário online:', data);
      // Handle user online
    });

    this.socket.on('user:offline', data => {
      console.log('[SocketService] ⚫ Usuário offline:', data);
      // Handle user offline
    });

    // Recent conversations event (sent automatically on connect)
    this.socket.on('recent_conversations', data => {
      console.log(
        '[SocketService] 📬 Recebeu evento recent_conversations:',
        data,
      );
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
      console.log('[SocketService] Desconectando socket manualmente');
      this.socket.disconnect();
      this.socket = null;
      this.isConnecting = false;
    }
  }

  emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      console.log(
        '[SocketService] 📤 Emitindo evento:',
        event,
        data ? data : '(sem dados)',
      );
      this.socket.emit(event, data);
    } else {
      console.warn(
        '[SocketService] ⚠️ Tentativa de emitir evento sem socket conectado:',
        event,
      );
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

  // Chat-specific methods (aligned with backend events)
  joinUser(userId: string, userName: string): void {
    this.emit('user:join', { userId, userName });
  }

  joinChat(chatId: string): void {
    this.emit('chat:join', { chatId });
  }

  leaveChat(chatId: string): void {
    this.emit('chat:leave', { chatId });
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
    this.emit('message:send', data);
  }

  editMessage(messageId: string, content: string, chatId: string): void {
    this.emit('message:edit', { messageId, content });
  }

  deleteMessage(messageId: string, chatId: string): void {
    this.emit('message:delete', { messageId, chatId });
  }

  markMessagesRead(chatId: string, messageIds: string[]): void {
    this.emit('message:mark_read', { chatId, messageIds });
  }

  startTyping(chatId: string): void {
    this.emit('typing:start', { chatId });
  }

  stopTyping(chatId: string): void {
    this.emit('typing:stop', { chatId });
  }

  // Request recent conversations (manual refresh)
  getRecentConversations(): void {
    console.log('[SocketService] 🔄 Solicitando conversas recentes...');
    this.emit('get_recent_conversations');
  }

  // Get socket instance (for advanced usage)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Instância singleton
export const socketService = new SocketServiceImpl();
