import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
} from 'react';
import { Chat, ChatMessage, ChatContextType, ChatUser } from '../types';
import { useAppContext } from './AppContext';

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

  // Mock data for development - replace with real API calls
  const generateMockChats = (): Chat[] => {
    const mockUsers: ChatUser[] = [
      {
        id: '2',
        name: 'João Silva',
        avatar: undefined,
        isOnline: true,
        lastSeen: undefined,
      },
      {
        id: '3',
        name: 'Maria Santos',
        avatar: undefined,
        isOnline: false,
        lastSeen: '2025-09-25T19:30:00Z',
      },
      {
        id: '4',
        name: 'Pedro Costa',
        avatar: undefined,
        isOnline: true,
        lastSeen: undefined,
      },
    ];

    return [
      {
        id: 'chat1',
        participants: [mockUsers[0]],
        lastMessage: {
          id: 'msg1',
          text: 'Olá! Como você está?',
          senderId: '2',
          receiverId: user?.id || '1',
          chatId: 'chat1',
          timestamp: '2025-09-25T19:45:00Z',
          isRead: false,
          messageType: 'text',
        },
        lastActivity: '2025-09-25T19:45:00Z',
        unreadCount: 2,
        chatType: 'direct',
        createdAt: '2025-09-24T10:00:00Z',
        updatedAt: '2025-09-25T19:45:00Z',
      },
      {
        id: 'chat2',
        participants: [mockUsers[1]],
        lastMessage: {
          id: 'msg2',
          text: 'Perfeito! Vou enviar os documentos.',
          senderId: user?.id || '1',
          receiverId: '3',
          chatId: 'chat2',
          timestamp: '2025-09-25T18:20:00Z',
          isRead: true,
          messageType: 'text',
        },
        lastActivity: '2025-09-25T18:20:00Z',
        unreadCount: 0,
        chatType: 'direct',
        createdAt: '2025-09-23T14:30:00Z',
        updatedAt: '2025-09-25T18:20:00Z',
      },
      {
        id: 'chat3',
        participants: [mockUsers[2]],
        lastActivity: '2025-09-25T16:15:00Z',
        unreadCount: 0,
        chatType: 'direct',
        createdAt: '2025-09-25T16:00:00Z',
        updatedAt: '2025-09-25T16:15:00Z',
      },
    ];
  };

  const generateMockMessages = (chatId: string): ChatMessage[] => {
    const messages: { [key: string]: ChatMessage[] } = {
      chat1: [
        {
          id: 'msg1-1',
          text: 'Oi! Tudo bem?',
          senderId: user?.id || '1',
          receiverId: '2',
          chatId: 'chat1',
          timestamp: '2025-09-25T19:40:00Z',
          isRead: true,
          messageType: 'text',
        },
        {
          id: 'msg1-2',
          text: 'Olá! Como você está?',
          senderId: '2',
          receiverId: user?.id || '1',
          chatId: 'chat1',
          timestamp: '2025-09-25T19:42:00Z',
          isRead: false,
          messageType: 'text',
        },
        {
          id: 'msg1-3',
          text: 'Precisa da ajuda com alguma coisa?',
          senderId: '2',
          receiverId: user?.id || '1',
          chatId: 'chat1',
          timestamp: '2025-09-25T19:45:00Z',
          isRead: false,
          messageType: 'text',
        },
      ],
      chat2: [
        {
          id: 'msg2-1',
          text: 'Você poderia me enviar os documentos do projeto?',
          senderId: '3',
          receiverId: user?.id || '1',
          chatId: 'chat2',
          timestamp: '2025-09-25T18:15:00Z',
          isRead: true,
          messageType: 'text',
        },
        {
          id: 'msg2-2',
          text: 'Perfeito! Vou enviar os documentos.',
          senderId: user?.id || '1',
          receiverId: '3',
          chatId: 'chat2',
          timestamp: '2025-09-25T18:20:00Z',
          isRead: true,
          messageType: 'text',
        },
      ],
      chat3: [],
    };

    return messages[chatId] || [];
  };

  const loadChats = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const chats = generateMockChats();
      dispatch({ type: 'SET_CHATS', payload: chats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar chats' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadMessages = async (chatId: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const messages = generateMockMessages(chatId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar mensagens' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const sendMessage = async (
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
  };

  const markAsRead = async (chatId: string): Promise<void> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));

      dispatch({ type: 'MARK_MESSAGES_AS_READ', payload: chatId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao marcar como lida' });
    }
  };

  const createChat = async (participantId: string): Promise<Chat | null> => {
    try {
      // Check if chat already exists
      const existingChat = state.chats.find(chat =>
        chat.participants.some(p => p.id === participantId),
      );

      if (existingChat) {
        return existingChat;
      }

      // Create new chat
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        participants: [
          {
            id: participantId,
            name: 'Novo Usuário',
            isOnline: false,
          },
        ],
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
        chatType: 'direct',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'SET_CHATS', payload: [...state.chats, newChat] });
      return newChat;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar chat' });
      return null;
    }
  };

  const setCurrentChat = (chat: Chat | null) => {
    dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });
    if (chat) {
      loadMessages(chat.id);
      markAsRead(chat.id);
    }
  };

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
