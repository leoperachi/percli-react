import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { socketService } from '../services/socketService';
import { ProfilePhoto } from './profilePhoto';

interface RecentConversation {
  userId: string;
  name: string;
  email: string;
  profilePicture?: string;
  unreadCount: number;
  lastMessageAt?: Date;
}

interface RightDrawerProps {
  onClose: () => void;
}

export function RightDrawer({ onClose }: RightDrawerProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [conversations, setConversations] = useState<RecentConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Listen for socket events
  useEffect(() => {
    // Connect socket if not connected
    if (!socketService.isConnected()) {
      socketService.connect();
    }

    const socket = socketService.getSocket();
    if (socket) {
      // Listen for recent conversations
      const handleRecentConversations = (data: {
        conversations: RecentConversation[];
      }) => {
        setConversations(data.conversations || []);
        setLoading(false);
      };

      socket.on('recent_conversations', handleRecentConversations);

      // Request conversations manually
      socketService.getRecentConversations();

      // Cleanup
      return () => {
        socket.off('recent_conversations', handleRecentConversations);
      };
    } else {
      setLoading(false);
    }
  }, []);

  const handleConversationPress = (conversation: RecentConversation) => {
    onClose();

    try {
      (navigation as any).navigate('Chat', {
        chatId: `user_${conversation.userId}`,
        chatName: conversation.name,
        userId: conversation.userId,
      });
    } catch (error) {
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';

    const messageDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - messageDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) {
      return 'now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Settings
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeIcon, { color: theme.colors.secondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Recent Conversations Section - Takes full height */}
        <View style={styles.conversationsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Conversations
          </Text>

          {/* Scrollable Recent Conversations List */}
          <View style={styles.conversationsContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text
                  style={[
                    styles.loadingText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Loading conversations...
                </Text>
              </View>
            ) : conversations.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text
                  style={[
                    styles.emptyText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  💬 No recent conversations
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.conversationsList}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              >
                {conversations.map(conversation => {
                  return (
                    <View
                      key={conversation.userId}
                      style={[
                        styles.conversationItem,
                        { borderBottomColor: theme.colors.border },
                      ]}
                    >
                      <View style={styles.conversationAvatar}>
                        <ProfilePhoto
                          imageBase64={conversation.profilePicture}
                          userName={conversation.name}
                          size={40}
                        />
                        {conversation.unreadCount > 0 && (
                          <View
                            style={[
                              styles.unreadBadge,
                              {
                                backgroundColor:
                                  theme.colors.primary || '#007AFF',
                              },
                            ]}
                          >
                            <Text style={styles.unreadText}>
                              {conversation.unreadCount > 9
                                ? '9+'
                                : conversation.unreadCount}
                            </Text>
                          </View>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.conversationContent}
                        onPress={() => handleConversationPress(conversation)}
                      >
                        <Text
                          style={[
                            styles.conversationName,
                            { color: theme.colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {conversation.name}
                        </Text>
                        <Text
                          style={[
                            styles.conversationEmail,
                            { color: theme.colors.textSecondary },
                          ]}
                          numberOfLines={1}
                        >
                          {conversation.email}
                        </Text>
                        {conversation.lastMessageAt && (
                          <Text
                            style={[
                              styles.conversationTime,
                              { color: theme.colors.textSecondary },
                            ]}
                          >
                            {formatTime(conversation.lastMessageAt)}
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Push Notifications */}
          <View
            style={[
              styles.notificationItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.notificationInfo}>
              <Text
                style={[styles.notificationTitle, { color: theme.colors.text }]}
              >
                Push Notifications
              </Text>
              <Text
                style={[
                  styles.notificationSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Receive app notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={notificationsEnabled ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>
        </View>

        {/* Bottom Sections - Fixed at bottom */}
        <View style={styles.bottomSections}>
          {/* Quick Settings */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Quick Settings
            </Text>

            <View
              style={[
                styles.settingItem,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingIcon}>🔊</Text>
                <Text
                  style={[styles.settingText, { color: theme.colors.text }]}
                >
                  Sound Effects
                </Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.accent,
                }}
                thumbColor={soundEnabled ? '#FFFFFF' : '#FFFFFF'}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.settingItem,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingIcon}>🔐</Text>
                <Text
                  style={[styles.settingText, { color: theme.colors.text }]}
                >
                  Privacy Settings
                </Text>
              </View>
              <Text
                style={[
                  styles.settingArrow,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ›
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.settingItem,
                { borderBottomColor: theme.colors.border },
              ]}
            >
              <View style={styles.settingInfo}>
                <Text style={styles.settingIcon}>🌍</Text>
                <Text
                  style={[styles.settingText, { color: theme.colors.text }]}
                >
                  Language
                </Text>
              </View>
              <View style={styles.languageInfo}>
                <Text
                  style={[
                    styles.languageText,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  English
                </Text>
                <Text
                  style={[
                    styles.settingArrow,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  ›
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  conversationsSection: {
    flex: 1,
    marginTop: 20,
  },
  bottomSections: {
    marginTop: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 20,
    borderBottomWidth: 1,
  },
  notificationBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  badgeGreen: {
    backgroundColor: '#10B981',
  },
  badgeOrange: {
    backgroundColor: '#F59E0B',
  },
  badgeIcon: {
    fontSize: 16,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 12,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 11,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 25,
    textAlign: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 18,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 14,
    marginRight: 8,
  },
  // Recent Conversations Styles
  conversationsContainer: {
    flex: 1, // Take all available space
    marginTop: 10,
  },
  conversationsList: {
    flex: 1, // Take all available space in container
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
  },
  conversationAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  conversationContent: {
    flex: 1,
  },
  conversationName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  conversationEmail: {
    fontSize: 12,
    marginBottom: 2,
  },
  conversationTime: {
    fontSize: 11,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
