import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  ReactNode,
  useEffect,
} from 'react';
import type { Chat, ChatMessage, ChatContextType, TypingUser } from '../types';
import { useAppContext } from './AppContext';
import apiService from '../services/apiService';
import { socketService } from '../services/socketService';

// Helper function to remove 'user_' prefix from IDs
const cleanUserId = (id: string | undefined | null): string => {
  if (!id) return '';
  return id.replace(/^user_/, '');
};

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: ChatMessage[];
  typingUsers: TypingUser[];
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
  | { type: 'ADD_TYPING_USER'; payload: TypingUser }
  | { type: 'REMOVE_TYPING_USER'; payload: string }
  | { type: 'CLEAR_MESSAGES' };

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  typingUsers: [],
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
    case 'ADD_TYPING_USER':
      // Only add if not already in list
      if (
        state.typingUsers.some(
          u =>
            u.userId === action.payload.userId &&
            u.chatId === action.payload.chatId,
        )
      ) {
        return state;
      }
      return {
        ...state,
        typingUsers: [...state.typingUsers, action.payload],
      };
    case 'REMOVE_TYPING_USER':
      return {
        ...state,
        typingUsers: state.typingUsers.filter(u => u.userId !== action.payload),
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
      socketService.connect();

      // Listen for new messages
      const socket = socketService.getSocket();
      if (socket) {
        const handleNewMessage = (message: any) => {
          console.log('[ChatContext] Nova mensagem recebida:', message);
          // Transform backend message to ChatMessage format
          const chatMessage: ChatMessage = {
            id: message.id || message._id,
            text: message.content || '',
            senderId: cleanUserId(message.senderId || message.sender?.id),
            receiverId: cleanUserId(message.receiverId || message.receiver?.id),
            chatId: message.chatId,
            timestamp: message.createdAt || message.timestamp,
            isRead: message.isRead || false,
            messageType: message.messageType || 'text',
            replyTo: message.replyToId,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            isEdited: message.isEdited || false,
            isDeleted: message.isDeleted || false,
            readBy: message.readBy || [],
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          };
          dispatch({ type: 'ADD_MESSAGE', payload: chatMessage });
        };

        const handleMessageEdited = (message: any) => {
          console.log('[ChatContext] Mensagem editada:', message);
          const chatMessage: ChatMessage = {
            id: message.id || message._id,
            text: message.content || '',
            senderId: cleanUserId(message.senderId || message.sender?.id),
            receiverId: cleanUserId(message.receiverId || message.receiver?.id),
            chatId: message.chatId,
            timestamp: message.createdAt || message.timestamp,
            isRead: message.isRead || false,
            messageType: message.messageType || 'text',
            replyTo: message.replyToId,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            isEdited: true,
            isDeleted: message.isDeleted || false,
            readBy: message.readBy || [],
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          };
          dispatch({ type: 'UPDATE_MESSAGE', payload: chatMessage });
        };

        const handleMessageDeleted = (data: {
          messageId: string;
          chatId: string;
        }) => {
          console.log('[ChatContext] Mensagem deletada:', data);
          dispatch({ type: 'DELETE_MESSAGE', payload: data.messageId });
        };

        const handleUnreadCount = (data: { unreadMessages: any[] }) => {
          console.log('[ChatContext] Contagem de não lidas:', data);
          // Update unread counts for chats
        };

        const handleRecentConversations = (data: { conversations: any[] }) => {
          console.log('[ChatContext] Conversas recentes:', data);
          // Could update chats list here
        };

        const handleUserTyping = (data: {
          userId: string;
          userName: string;
          chatId: string;
          isTyping: boolean;
        }) => {
          console.log('[ChatContext] Usuário digitando:', data);
          const cleanedUserId = cleanUserId(data.userId);

          if (data.isTyping) {
            dispatch({
              type: 'ADD_TYPING_USER',
              payload: {
                userId: cleanedUserId,
                userName: data.userName,
                chatId: data.chatId,
              },
            });

            // Auto-remove after 3 seconds
            setTimeout(() => {
              dispatch({ type: 'REMOVE_TYPING_USER', payload: cleanedUserId });
            }, 3000);
          } else {
            dispatch({ type: 'REMOVE_TYPING_USER', payload: cleanedUserId });
          }
        };

        // Listen to backend events (with correct event names)
        socket.on('message:new', handleNewMessage);
        socket.on('message:edited', handleMessageEdited);
        socket.on('message:deleted', handleMessageDeleted);
        socket.on('unread_messages_count', handleUnreadCount);
        socket.on('recent_conversations', handleRecentConversations);
        socket.on('user:typing', handleUserTyping);

        // Join user room when connected (or immediately if already connected)
        const joinUserRoom = () => {
          console.log(
            '[ChatContext] Entrando no room do usuário:',
            user.id,
            user.name,
          );
          socketService.joinUser(user.id, user.name);
        };

        if (socket.connected) {
          // If already connected, join immediately
          joinUserRoom();
        } else {
          // Wait for connection
          socket.once('connect', joinUserRoom);
        }

        // Cleanup listeners on unmount, but don't disconnect socket
        return () => {
          socket.off('message:new', handleNewMessage);
          socket.off('message:edited', handleMessageEdited);
          socket.off('message:deleted', handleMessageDeleted);
          socket.off('unread_messages_count', handleUnreadCount);
          socket.off('recent_conversations', handleRecentConversations);
          socket.off('user:typing', handleUserTyping);
          socket.off('connect', joinUserRoom);
        };
      }
    } else if (!user) {
      // Only disconnect when user logs out
      socketService.disconnect();
    }
  }, [user]); // Only depend on user, not state.messages

  const loadChats = useCallback(async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      const response = await apiService.getUserChats(1, 20);

      console.log(
        '[ChatContext] Resposta completa da API:',
        JSON.stringify(response, null, 2),
      );

      if (response.success && response.data) {
        console.log(
          '[ChatContext] Dados recebidos:',
          JSON.stringify(response.data, null, 2),
        );

        // Try multiple possible response structures
        let chatsArray = [];
        if (Array.isArray(response.data)) {
          // Direct array response
          chatsArray = response.data;
          console.log(
            '[ChatContext] Array direto encontrado, tamanho:',
            chatsArray.length,
          );
        } else if (response.data.chats) {
          // Object with chats property
          chatsArray = response.data.chats;
          console.log(
            '[ChatContext] Propriedade chats encontrada, tamanho:',
            chatsArray.length,
          );
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Nested data property
          chatsArray = response.data.data;
          console.log(
            '[ChatContext] Propriedade data.data encontrada, tamanho:',
            chatsArray.length,
          );
        } else {
          console.warn('[ChatContext] Formato de resposta não reconhecido');
        }

        // Validate and filter chats to ensure they have required fields
        console.log(
          '[ChatContext] Total de chats recebidos:',
          chatsArray.length,
        );

        // Log first chat to see structure
        if (chatsArray.length > 0) {
          console.log(
            '[ChatContext] Estrutura do primeiro chat:',
            JSON.stringify(chatsArray[0], null, 2),
          );
        }

        const validChats = chatsArray
          .filter((chat: any) => {
            // Only require ID - we'll handle participants separately
            const isValid = chat && chat.id;

            if (!isValid) {
              console.warn('[ChatContext] Chat inválido (sem id):', {
                chat: chat,
              });
            } else {
              console.log('[ChatContext] Chat com ID válido:', {
                id: chat.id,
                hasParticipants: Array.isArray(chat.participants),
                participantsCount: chat.participants?.length,
                hasParticipantIds: !!chat.participantIds,
                participantIdsCount: chat.participantIds?.length,
                chatType: chat.chatType || chat.isGroup,
              });
            }

            return isValid;
          })
          .map((chat: any) => {
            // Handle different participant structures
            let participants = [];

            if (
              Array.isArray(chat.participants) &&
              chat.participants.length > 0
            ) {
              // Participants are already populated
              participants = chat.participants;
            } else if (
              Array.isArray(chat.participantIds) &&
              chat.participantIds.length > 0
            ) {
              // Only IDs available - create minimal participant objects
              participants = chat.participantIds.map((id: string) => ({
                id: cleanUserId(id),
                name: 'Usuário',
                isOnline: false,
              }));
            } else {
              // No participants at all - create a dummy one to prevent crashes
              console.warn(
                '[ChatContext] Chat sem participantes, criando dummy:',
                chat.id,
              );
              participants = [
                {
                  id: 'unknown',
                  name: 'Usuário',
                  isOnline: false,
                },
              ];
            }

            console.log('[ChatContext] Processando chat:', {
              id: chat.id,
              name: chat.name || chat.chatName,
              participantsCount: participants.length,
            });

            return {
              ...chat,
              chatName:
                chat.chatName || chat.name || participants[0]?.name || 'Chat',
              participants: participants.map((participant: any) => ({
                ...participant,
                id: cleanUserId(participant.id || participant._id || 'unknown'),
                name: participant.name || participant.username || 'Usuário',
              })),
              chatType: chat.chatType || (chat.isGroup ? 'group' : 'direct'),
              lastActivity:
                chat.lastActivity || chat.updatedAt || new Date().toISOString(),
              unreadCount: chat.unreadCount || 0,
            };
          });

        console.log(
          '[ChatContext] Total de chats válidos após validação:',
          validChats.length,
        );

        if (validChats.length > 0) {
          console.log(
            '[ChatContext] Primeiro chat processado:',
            JSON.stringify(validChats[0], null, 2),
          );
        }

        dispatch({ type: 'SET_CHATS', payload: validChats });
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: response.error || 'Failed to load chats',
        });
        dispatch({ type: 'SET_CHATS', payload: [] });
      }
    } catch (error) {
      console.error('[ChatContext] Erro ao carregar chats:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load chats' });
      dispatch({ type: 'SET_CHATS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const loadMessages = useCallback(
    async (chatId: string, retryCount: number = 0): Promise<void> => {
      const MAX_RETRIES = 2;

      try {
        console.log(
          `[ChatContext] Carregando mensagens para chat ${chatId}, tentativa ${
            retryCount + 1
          }`,
        );
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });

        const response = await apiService.getChatMessages(chatId, 1, 50);

        if (response.success && response.data) {
          console.log(
            '[ChatContext] Resposta da API recebida:',
            JSON.stringify(response.data).substring(0, 200),
          );

          // Handle different response formats
          let messagesArray = [];
          if (Array.isArray(response.data)) {
            messagesArray = response.data;
          } else if (
            response.data.messages &&
            Array.isArray(response.data.messages)
          ) {
            messagesArray = response.data.messages;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            messagesArray = response.data.data;
          }

          console.log(
            `[ChatContext] Total de mensagens encontradas: ${messagesArray.length}`,
          );

          // Transform API messages to ChatMessage format
          const transformedMessages = messagesArray.map((message: any) => ({
            id: message.id || message._id,
            text: message.content || message.text || '',
            senderId: cleanUserId(
              message.senderId || message.sender?.id || message.sender,
            ),
            receiverId: cleanUserId(
              message.receiverId || message.receiver?.id || message.receiver,
            ),
            chatId: message.chatId || chatId,
            timestamp:
              message.createdAt ||
              message.timestamp ||
              new Date().toISOString(),
            isRead: message.isRead || false,
            messageType: message.messageType || 'text',
            replyTo: message.replyToId || message.replyTo,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
            fileSize: message.fileSize,
            isEdited: message.isEdited || false,
            isDeleted: message.isDeleted || false,
            readBy: message.readBy || [],
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          }));

          console.log(
            '[ChatContext] Mensagens transformadas:',
            transformedMessages.length,
          );
          dispatch({
            type: 'SET_MESSAGES',
            payload: transformedMessages,
          });
        } else {
          const errorMessage = response.error || 'Falha ao carregar mensagens';
          console.error('[ChatContext] Erro na resposta:', errorMessage);

          // Retry on error if retries available
          if (retryCount < MAX_RETRIES) {
            console.log(
              `[ChatContext] Tentando novamente (${
                retryCount + 1
              }/${MAX_RETRIES})...`,
            );
            setTimeout(() => {
              loadMessages(chatId, retryCount + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff
            return;
          }

          dispatch({
            type: 'SET_ERROR',
            payload: errorMessage,
          });
          dispatch({ type: 'SET_MESSAGES', payload: [] });
        }
      } catch (error) {
        console.error('[ChatContext] Exceção ao carregar mensagens:', error);

        // Retry on exception if retries available
        if (retryCount < MAX_RETRIES) {
          console.log(
            `[ChatContext] Tentando novamente após exceção (${
              retryCount + 1
            }/${MAX_RETRIES})...`,
          );
          setTimeout(() => {
            loadMessages(chatId, retryCount + 1);
          }, 1000 * (retryCount + 1)); // Exponential backoff
          return;
        }

        dispatch({
          type: 'SET_ERROR',
          payload: 'Erro ao carregar mensagens. Tente novamente.',
        });
        dispatch({ type: 'SET_MESSAGES', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [],
  );

  const sendMessage = useCallback(
    async (
      text: string,
      receiverId: string,
      replyTo?: string,
    ): Promise<void> => {
      try {
        if (!user || !state.currentChat) return;

        // Send via Socket.IO for real-time delivery
        socketService.sendMessage({
          chatId: state.currentChat.id,
          content: text,
          messageType: 'text',
          replyToId: replyTo,
        });

        // Also send via HTTP as fallback
        await apiService.sendChatMessage(state.currentChat.id, {
          content: text,
          messageType: 'text',
          replyToId: replyTo,
        });
      } catch (error) {
        console.error('[ChatContext] Erro ao enviar mensagem:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao enviar mensagem' });
      }
    },
    [user, state.currentChat],
  );

  const markAsRead = useCallback(
    async (chatId: string): Promise<void> => {
      try {
        // Get unread message IDs for this chat
        const unreadMessageIds = state.messages
          .filter(m => m.chatId === chatId && !m.isRead)
          .map(m => m.id);

        if (unreadMessageIds.length > 0) {
          // Mark as read via Socket.IO
          socketService.markMessagesRead(chatId, unreadMessageIds);

          // Also mark via HTTP
          await apiService.markMessagesAsRead(chatId, unreadMessageIds);
        }

        dispatch({ type: 'MARK_MESSAGES_AS_READ', payload: chatId });
      } catch (error) {
        console.error('[ChatContext] Erro ao marcar como lida:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao marcar como lida' });
      }
    },
    [state.messages],
  );

  const createChat = useCallback(
    async (participantId: string): Promise<Chat | null> => {
      try {
        // Call API to get or create direct chat
        const response = await apiService.getOrCreateDirectChat(participantId);

        if (response.success && response.data) {
          const rawChat = response.data.chat || response.data;

          // Clean participant IDs
          const chat = {
            ...rawChat,
            participants: (rawChat.participants || []).map(
              (participant: any) => ({
                ...participant,
                id: cleanUserId(participant.id),
              }),
            ),
          };

          // Check if chat already exists in state
          const existingChatIndex = state.chats.findIndex(
            c => c.id === chat.id,
          );

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
          dispatch({
            type: 'SET_ERROR',
            payload: response.error || 'Erro ao criar chat',
          });
          return null;
        }
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao criar chat' });
        return null;
      }
    },
    [state.chats],
  );

  const setCurrentChat = useCallback(
    async (chat: Chat | null) => {
      console.log('[ChatContext] Setando currentChat:', chat);
      // Prevent setting the same chat again
      if (state.currentChat?.id === chat?.id) {
        console.log('[ChatContext] Chat já está selecionado, ignorando');
        return;
      }

      // Leave previous chat room
      if (state.currentChat) {
        console.log('[ChatContext] Saindo do chat:', state.currentChat.id);
        socketService.leaveChat(state.currentChat.id);
      }

      // Clear messages before switching
      dispatch({ type: 'CLEAR_MESSAGES' });
      dispatch({ type: 'SET_CURRENT_CHAT', payload: chat });

      if (chat) {
        console.log('[ChatContext] Entrando no chat:', chat.id);
        console.log('[ChatContext] Detalhes do chat:', {
          id: chat.id,
          chatName: chat.chatName,
          participants: chat.participants?.length,
          chatType: chat.chatType,
        });

        // Join new chat room via Socket.IO
        socketService.joinChat(chat.id);

        // Load messages first, then mark as read
        console.log(
          '[ChatContext] Iniciando carregamento de mensagens para chat:',
          chat.id,
        );
        try {
          await loadMessages(chat.id);
          console.log(
            '[ChatContext] Mensagens carregadas com sucesso para chat:',
            chat.id,
          );
          await markAsRead(chat.id);
        } catch (error) {
          console.error('[ChatContext] Erro ao configurar chat:', error);
        }
      }
    },
    [state.currentChat, loadMessages, markAsRead],
  );

  const editMessage = useCallback(
    async (messageId: string, newText: string): Promise<void> => {
      try {
        if (!state.currentChat) return;

        // Optimistic update
        const updatedMessage = state.messages.find(m => m.id === messageId);
        if (updatedMessage) {
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
              ...updatedMessage,
              text: newText,
              isEdited: true,
              updatedAt: new Date().toISOString(),
            },
          });
        }

        // Send via Socket.IO
        socketService.editMessage(messageId, newText, state.currentChat.id);

        // Also send via HTTP as fallback
        await apiService.editMessage(messageId, newText);
      } catch (error) {
        console.error('[ChatContext] Erro ao editar mensagem:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao editar mensagem' });
      }
    },
    [state.currentChat, state.messages],
  );

  const deleteMessage = useCallback(
    async (messageId: string): Promise<void> => {
      try {
        if (!state.currentChat) return;

        // Optimistic update
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          dispatch({
            type: 'UPDATE_MESSAGE',
            payload: {
              ...message,
              text: 'Mensagem deletada',
              isDeleted: true,
              updatedAt: new Date().toISOString(),
            },
          });
        }

        // Send via Socket.IO
        socketService.deleteMessage(messageId, state.currentChat.id);

        // Also send via HTTP as fallback
        await apiService.deleteMessage(messageId);
      } catch (error) {
        console.error('[ChatContext] Erro ao deletar mensagem:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Erro ao deletar mensagem' });
      }
    },
    [state.currentChat, state.messages],
  );

  const startTyping = useCallback(() => {
    if (state.currentChat && user) {
      socketService.startTyping(state.currentChat.id, user.name);
    }
  }, [state.currentChat, user]);

  const stopTyping = useCallback(() => {
    if (state.currentChat && user) {
      socketService.stopTyping(state.currentChat.id, user.name);
    }
  }, [state.currentChat, user]);

  const clearMessages = useCallback(() => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  }, []);

  const value: ChatContextType = {
    chats: state.chats,
    currentChat: state.currentChat,
    messages: state.messages,
    typingUsers: state.typingUsers,
    loading: state.loading,
    error: state.error,
    loadChats,
    loadMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    markAsRead,
    createChat,
    setCurrentChat,
    clearMessages,
    startTyping,
    stopTyping,
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
