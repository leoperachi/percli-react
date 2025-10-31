// biome-ignore assist/source/organizeImports: explanation
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { useChatContext } from '../contexts/ChatContext';
import { MessageBubble } from '../components/chat/MessageBubble';
import { MessageInput } from '../components/chat/MessageInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import type { ChatMessage } from '../types';
import { useAppContext } from '../contexts/AppContext';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ProfilePhoto } from '../components/profilePhoto';
import { safeGoBack } from '../utils/navigationHelpers';
import { formatFullDate, formatDateTime, isSameDay } from '../utils/dateHelpers';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function ChatScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { theme } = useTheme();
  const { user } = useAppContext();
  const {
    currentChat,
    messages,
    typingUsers,
    loading,
    error,
    loadMessages,
    setCurrentChat,
    editMessage,
    deleteMessage,
  } = useChatContext();
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Get route parameters
  const params = route.params as
    | { chatId: string; chatName: string; userId: string }
    | undefined;

  // Create chat from route parameters and load messages
  useEffect(() => {
    if (params && (!currentChat || currentChat.id !== params.chatId)) {
      console.log('[ChatScreen] Criando novo chat a partir de params:', {
        chatId: params.chatId,
        chatName: params.chatName,
        userId: params.userId
      });

      const newChat = {
        id: params.chatId,
        chatName: params.chatName,
        chatType: 'direct' as const,
        participants: [
          {
            id: params.userId,
            name: params.chatName,
            isOnline: true,
          },
        ],
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log('[ChatScreen] Setando currentChat:', newChat.id);
      setCurrentChat(newChat);
    } else if (params) {
      console.log('[ChatScreen] Chat já está selecionado:', currentChat?.id);
    }
  }, [params, currentChat, setCurrentChat]);

  // Validate current chat exists
  useEffect(() => {
    if (!currentChat) {
      // Se não tem chat atual, volta para ChatList
      console.log('[ChatScreen] Nenhum chat selecionado, voltando para lista');
      safeGoBack(navigation, 'ChatList');
    }
  }, [currentChat, navigation]);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleBackPress = () => {
    safeGoBack(navigation, 'ChatList');
  };

  const handleReply = (message: ChatMessage) => {
    setReplyingTo(message);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleEdit = (message: ChatMessage) => {
    setEditingMessage(message);
  };

  const handleDelete = async (message: ChatMessage) => {
    Alert.alert(
      'Deletar Mensagem',
      'Tem certeza que deseja deletar esta mensagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMessage(message.id);
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar a mensagem');
            }
          },
        },
      ]
    );
  };

  const handleMessageLongPress = (message: ChatMessage) => {
    // Don't show menu for deleted messages
    if (message.isDeleted) {
      return;
    }

    const isOwnMessage = message.senderId === user?.id;

    const options: any[] = [
      { text: 'Responder', onPress: () => handleReply(message) },
      { text: 'Copiar', onPress: () => {} },
    ];

    // Only show edit/delete for own messages
    if (isOwnMessage) {
      options.push(
        { text: 'Editar', onPress: () => handleEdit(message) },
        { text: 'Deletar', onPress: () => handleDelete(message), style: 'destructive' }
      );
    }

    options.push({ text: 'Cancelar', style: 'cancel' });

    Alert.alert('Opções da mensagem', message.text, options);
  };

  const handleChatInfo = () => {
    const participant = currentChat?.participants[0];
    const displayName =
      currentChat?.chatName || participant?.name || 'Usuário Desconhecido';

    Alert.alert(
      'Informações do Chat',
      `Nome: ${displayName}\nTipo: ${
        currentChat?.chatType === 'direct' ? 'Conversa Direta' : 'Grupo'
      }\nStatus: ${participant?.isOnline ? 'Online' : 'Offline'}`,
      [{ text: 'OK' }],
    );
  };

  const renderMessage = ({
    item,
    index,
  }: {
    item: ChatMessage;
    index: number;
  }) => {
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showDateSeparator =
      !previousMessage ||
      !isSameDay(item.timestamp, previousMessage.timestamp);

    return (
      <View>
        {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <Text
              style={[styles.dateText, { color: theme.colors.textSecondary }]}
            >
              {formatFullDate(item.timestamp)}
            </Text>
          </View>
        )}
        <MessageBubble
          message={item}
          onReply={handleReply}
          onLongPress={handleMessageLongPress}
        />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyIcon, { color: theme.colors.textSecondary }]}>
        💬
      </Text>
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        Ainda não há mensagens nesta conversa
      </Text>
      <Text
        style={[styles.emptySubText, { color: theme.colors.textSecondary }]}
      >
        Envie uma mensagem para iniciar a conversa
      </Text>
    </View>
  );

  if (!currentChat) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text
            style={[
              styles.errorText,
              { color: theme.colors.error || '#FF3B30' },
            ]}
          >
            Chat não encontrado
          </Text>
          <TouchableOpacity
            style={[
              styles.retryButton,
              { backgroundColor: theme.colors.primary || '#007AFF' },
            ]}
            onPress={handleBackPress}
          >
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const participant = currentChat.participants[0];
  const displayName =
    currentChat.chatName || participant?.name || 'Usuário Desconhecido';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        backgroundColor={theme.colors.background}
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Text
            style={[
              styles.backIcon,
              { color: theme.colors.primary || '#007AFF' },
            ]}
          >
            ←
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.chatInfo} onPress={handleChatInfo}>
          <View style={styles.headerContent}>
            <ProfilePhoto
              imageBase64={participant?.profilePhoto || participant?.avatar}
              userName={displayName}
              size={32}
            />
            <View style={styles.headerText}>
              <Text
                style={[styles.headerName, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {displayName}
              </Text>
              <Text
                style={[
                  styles.headerStatus,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {participant?.isOnline
                  ? 'Online'
                  : participant?.lastSeen
                  ? `Visto por último ${formatDateTime(participant.lastSeen)}`
                  : 'Offline'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton} onPress={handleChatInfo}>
          <Text
            style={[styles.moreIcon, { color: theme.colors.textSecondary }]}
          >
            ⋯
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <View style={styles.messagesContainer}>
        {loading && messages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
              Carregando mensagens...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text
              style={[
                styles.errorText,
                { color: theme.colors.error || '#FF3B30' },
              ]}
            >
              {error}
            </Text>
            <TouchableOpacity
              style={[
                styles.retryButton,
                { backgroundColor: theme.colors.primary || '#007AFF' },
              ]}
              onPress={() => currentChat && loadMessages(currentChat.id)}
            >
              <Text style={styles.retryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={
              messages.length === 0
                ? styles.emptyContainer
                : styles.messagesContent
            }
            ListEmptyComponent={renderEmptyState}
            ListFooterComponent={() => (
              <TypingIndicator
                typingUsers={typingUsers}
                currentChatId={currentChat?.id}
              />
            )}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}
      </View>

      {/* Message Input */}
      <MessageInput
        replyingTo={replyingTo}
        editingMessage={editingMessage}
        onCancelReply={handleCancelReply}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatInfo: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  headerStatus: {
    fontSize: 12,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  moreIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
});
