import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';
import { useChatContext } from '../contexts/ChatContext';
import { Chat } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';
import { ProfilePhoto } from '../components/profilePhoto';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface ChatItemProps {
  chat: Chat;
  onPress: (chat: Chat) => void;
}

function ChatItem({ chat, onPress }: ChatItemProps) {
  const { theme } = useTheme();

  const participant = chat.participants[0];
  const displayName = chat.chatName || participant?.name || 'Usuário Desconhecido';

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.chatItem,
        { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }
      ]}
      onPress={() => onPress(chat)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <ProfilePhoto
          imageBase64={participant?.profilePhoto || participant?.avatar}
          userName={displayName}
          size={48}
        />
        {participant?.isOnline && (
          <View style={[styles.onlineIndicator, { borderColor: theme.colors.surface }]} />
        )}
      </View>

      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={[styles.chatName, { color: theme.colors.text }]} numberOfLines={1}>
            {displayName}
          </Text>
          {chat.lastMessage && (
            <Text style={[styles.timestamp, { color: theme.colors.textSecondary }]}>
              {formatTime(chat.lastActivity)}
            </Text>
          )}
        </View>

        <View style={styles.chatFooter}>
          <Text
            style={[
              styles.lastMessage,
              { color: theme.colors.textSecondary },
              chat.unreadCount > 0 && { fontWeight: '600', color: theme.colors.text }
            ]}
            numberOfLines={1}
          >
            {chat.lastMessage?.text || 'Nenhuma mensagem'}
          </Text>

          {chat.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary || '#007AFF' }]}>
              <Text style={styles.unreadText}>
                {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ChatListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { chats, loadChats, loading, error, setCurrentChat } = useChatContext();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleChatPress = (chat: Chat) => {
    setCurrentChat(chat);
    navigation.navigate('Chat');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadChats();
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewChat = () => {
    Alert.alert(
      'Nova Conversa',
      'Esta funcionalidade será implementada em breve',
      [{ text: 'OK' }]
    );
  };

  const renderChatItem = ({ item }: { item: Chat }) => (
    <ChatItem chat={item} onPress={handleChatPress} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        💬
      </Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Nenhuma conversa
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        Suas conversas aparecerão aqui
      </Text>
      <TouchableOpacity
        style={[styles.newChatButton, { backgroundColor: theme.colors.primary || '#007AFF' }]}
        onPress={handleNewChat}
      >
        <Text style={styles.newChatButtonText}>
          Iniciar Nova Conversa
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && chats.length === 0) {
    return (
      <MainLayout title="Conversas" leftIcon="back" onLeftPress={handleBackPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Carregando conversas...
          </Text>
        </View>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title="Conversas" leftIcon="back" onLeftPress={handleBackPress}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error || '#FF3B30' }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary || '#007AFF' }]}
            onPress={loadChats}
          >
            <Text style={styles.retryButtonText}>
              Tentar Novamente
            </Text>
          </TouchableOpacity>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Conversas"
      leftIcon="back"
      onLeftPress={handleBackPress}
      rightIcon="+"
      onRightPress={handleNewChat}
    >
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        contentContainerStyle={chats.length === 0 ? styles.emptyContainer : undefined}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary || '#007AFF']}
            tintColor={theme.colors.primary || '#007AFF'}
          />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  chatList: {
    flex: 1,
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
  emptyTitle: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  newChatButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newChatButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#34C759',
    borderWidth: 2,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});