import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import type { Chat, ChatMessage, ChatContextType } from '../types';
import { useAppContext } from './AppContext';
import apiService from '../services/apiService';
import { socketService } from '../services/socketService';

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHATS'; payload: Chat[] }
  | { type: 'SET_CURRENT_CHAT'; payload: Chat | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'UPDATE_MESSAGE'; payload: ChatMessage }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'UPDATE_CHAT'; payload: Chat }
  | { type: 'MARK_MESSAGES_AS_READ'; payload: string }
  | { type: 'CLEAR_MESSAGES' };

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CHATS':
      return { ...state, chats: action.payload };
    case 'SET_CURRENT_CHAT':
      return { ...state, currentChat: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        chats: state.chats.map(chat =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                lastMessage: action.payload,
                lastActivity: action.payload.timestamp,
                unreadCount:
                  action.payload.senderId !== state.currentChat?.id
                    ? chat.unreadCount + 1
                    : chat.unreadCount,
              }
            : chat,
        ),
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.payload.id ? action.payload : m,
        ),
      };
    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(m => m.id !== action.payload),
      };
    case 'UPDATE_CHAT':
      return {
        ...state,
        chats: state.chats.map(chat =>
          chat.id === action.payload.id ? action.payload : chat,
        ),
      };
    case 'MARK_MESSAGES_AS_READ':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.chatId === action.payload
            ? { ...message, isRead: true }
            : message,
        ),
        chats: state.chats.map(chat =>
          chat.id === action.payload ? { ...chat, unreadCount: 0 } : chat,
        ),
      };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAppContext();

  // Initialize socket connection - only connect/disconnect when user changes
  useEffect(() => {
    if (user) {
      console.log('🔌 [ChatContext] User authenticated, connecting to socket...');
      socketService.connect();

      // Listen for new messages
      const socket = socketService.getSocket();
      if (socket) {
        const handleNewMessage = (message: ChatMessage) => {
          console.log('💬 [ChatContext] New message received:', message);
          dispatch({ type: 'ADD_MESSAGE', payload: message });
        };

        const handleMessageEdited = (message: ChatMessage) => {
          console.log('✏️ [ChatContext] Message edited:', message);
          dispatch({ type: 'UPDATE_MESSAGE', payload: message });
        };

        const handleMessageDeleted = (data: { messageId: string }) => {
          console.log('🗑️ [ChatContext] Message deleted:', data.messageId);
          dispatch({ type: 'DELETE_MESSAGE', payload: data.messageId });
        };

        const handleUnreadCount = (data: { unreadMessages: any }) => {
          console.log('📬 [ChatContext] Unread messages count:', data);
        };

        socket.on('new_message', handleNewMessage);
        socket.on('message_edited', handleMessageEdited);
        socket.on('message_deleted', handleMessageDeleted);
        socket.on('unread_messages_count', handleUnreadCount);

        // Cleanup listeners on unmount, but don't disconnect socket
        return () => {
          console.log('🔇 [ChatContext] Cleaning up socket listeners...');
          socket.off('new_message', handleNewMessage);
          socket.off('message_edited', handleMessageEdited);
          socket.off('message_deleted', handleMessageDeleted);
          socket.off('unread_messages_count', handleUnreadCount);
        };
      }
    } else if (!user) {
      // Only disconnect when user logs out
      console.log('🔌 [ChatContext] User logged out, disconnecting socket...');
      socketService.disconnect();
    }
  }, [user]); // Only depend on user, not state.messages

  const loadChats = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      console.log('📡 [ChatContext] Loading chats from API...');
      const response = await apiService.getUserChats(1, 20);

      if (response.success && response.data) {
        console.log('✅ [ChatContext] Chats loaded:', response.data.chats?.length || 0);
        dispatch({ type: 'SET_CHATS', payload: response.data.chats || [] });
      } else {
        console.error('❌ [ChatContext] Failed to load chats:', response.error);
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load chats' });
        dispatch({ type: 'SET_CHATS', payload: [] });
      }
    } catch (error) {
      console.error('❌ [ChatContext] Error loading chats:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load chats' });
      dispatch({ type: 'SET_CHATS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadMessages = useCallback(
    async (chatId: string): Promise<void> => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        console.log('📡 [ChatContext] Loading messages for chat:', chatId);
        const response = await apiService.getChatMessages(chatId, 1, 50);

        if (response.success && response.data) {
          console.log('✅ [ChatContext] Messages loaded:', response.data.messages?.length || 0);
          dispatch({ type: 'SET_MESSAGES', payload: response.data.messages || [] });
        } else {
          console.error('❌ [ChatContext] Failed to load messages:', response.error);
          dispatch({ type: 'SET_ERROR', payload: response.error || 'Failed to load messages' });
          dispatch({ type: 'SET_MESSAGES', payload: [] });
        }
      } catch (error) {
        console.error('❌ [ChatContext] Error loading messages:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' });
        dispatch({ type: 'SET_MESSAGES', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [],
  );

  const sendMessage = useCallback(async (
    text: string,
    receiverId: string,
    replyTo?: string,
  ): Promise<void> => {
    try {
      if (!user || !state.currentChat) return;

      const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        text,
        senderId: user.id,
        receiverId,
        chatId: state.currentChat.id,
        timestamp: new Date().toISOString(),
        isRead: false,
        messageType: 'text',
        replyTo,
      };

      // Optimistically add message
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao enviar mensagem' });
    }
  }, [user, state.currentChat]);

  const markAsRead = useCallback(async (chatId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      dispatch({ type: 'MARK_MESSAGES_AS_READ', payload: chatId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao marcar como lida' });
    }
  }, []);

  const createChat = useCallback(async (participantId: string): Promise<Chat | null> => {
    try {
      console.log('📡 [ChatContext] Getting or creating direct chat with user:', participantId);

      // Call API to get or create direct chat
      const response = await apiService.getOrCreateDirectChat(participantId);

      if (response.success && response.data) {
        console.log('✅ [ChatContext] Direct chat obtained:', response.data);
        const chat = response.data.chat || response.data;

        // Check if chat already exists in state
        const existingChatIndex = state.chats.findIndex(c => c.id === chat.id);

        if (existingChatIndex >= 0) {
          // Update existing chat
          const updatedChats = [...state.chats];
          updatedChats[existingChatIndex] = chat;
          dispatch({ type: 'SET_CHATS', payload: updatedChats });
        } else {
          // Add new chat to state
          dispatch({ type: 'SET_CHATS', payload: [...state.chats, chat] });
        }

        return chat;
      } else {
        console.error('❌ [ChatContext] Failed to get/create chat:', response.error);
        dispatch({ type: 'SET_ERROR', payload: response.error || 'Erro ao criar chat' });
        return null;
      }
    } catch (error) {
      console.error('❌ [ChatContext] Error creating chat:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar chat' });
      return null;
    }
  }, [state.chats]);

  const setCurrentChat = useCallback((chat: Chat | null) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });
    if (chat) {
      loadMessages(chat.id);
      markAsRead(chat.id);
    }
  }, [loadMessages, markAsRead]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const value: ChatContextType = {
    chats: state.chats,
    currentChat: state.currentChat,
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    loadChats,
    loadMessages,
    sendMessage,
    markAsRead,
    createChat,
    setCurrentChat,
    clearMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextType {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
