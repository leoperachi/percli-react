import React, { useState, useEffect, useCallback } from 'react';
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

interface RightDrawerProps {
  onClose: () => void;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
}

export function RightDrawer({ onClose }: RightDrawerProps) {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Load recent users (for now, we'll load all users as mock recent conversations)
  const loadRecentUsers = useCallback(async () => {
    console.log('🔥 [RightDrawer] Loading recent users...');
    setLoadingUsers(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // For now, we'll use mock data. In a real app, this would be recent chat participants
      const mockUsers: RecentUser[] = [
        {
          id: '2',
          name: 'João Silva',
          email: 'joao@example.com',
          lastMessageTime: '2 min ago',
          isOnline: true,
        },
        {
          id: '3',
          name: 'Maria Santos',
          email: 'maria@example.com',
          lastMessageTime: '1 hour ago',
          isOnline: false,
        },
        {
          id: '4',
          name: 'Pedro Costa',
          email: 'pedro@example.com',
          lastMessageTime: '3 hours ago',
          isOnline: true,
        },
        {
          id: '5',
          name: 'Ana Oliveira',
          email: 'ana@example.com',
          lastMessageTime: '1 day ago',
          isOnline: false,
        },
        {
          id: '6',
          name: 'Carlos Ferreira',
          email: 'carlos@example.com',
          lastMessageTime: '2 days ago',
          isOnline: true,
        },
      ];

      console.log('🔥 [RightDrawer] Mock users created:', mockUsers);
      console.log('🔥 [RightDrawer] Setting users to state...');
      setRecentUsers(mockUsers);
      console.log('🔥 [RightDrawer] Users set to state');
    } catch (error) {
      console.error('❌ [RightDrawer] Error loading recent users:', error);
    } finally {
      setLoadingUsers(false);
      console.log(
        '🔥 [RightDrawer] Loading finished, loadingUsers set to false',
      );
    }
  }, []);

  useEffect(() => {
    loadRecentUsers();
  }, [loadRecentUsers]);

  // Debug log to check state
  useEffect(() => {
    console.log(
      '🔥 [RightDrawer] State update - loadingUsers:',
      loadingUsers,
      'recentUsers count:',
      recentUsers.length,
    );
  }, [loadingUsers, recentUsers]);

  const handleUserPress = (user: RecentUser) => {
    // Navigate to chat with this user
    console.log('Opening chat with user:', user.name);
    onClose(); // Close the drawer

    // Navigate directly to ChatScreen with user data
    try {
      navigation.navigate(
        'Chat' as never,
        {
          chatId: `user_${user.id}`,
          chatName: user.name,
          userId: user.id,
        } as never,
      );
    } catch (error) {
      console.log('Navigation error:', error);
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
            {loadingUsers ? (
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
            ) : recentUsers.length === 0 ? (
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
                {recentUsers.map(user => {
                  console.log('🔥 [RightDrawer] Rendering user:', user.name);
                  return (
                    <View
                      key={user.id}
                      style={[
                        styles.conversationItem,
                        { borderBottomColor: theme.colors.border },
                      ]}
                    >
                      <View style={styles.conversationAvatar}>
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: '#6366F1',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: 'white', fontSize: 16 }}>
                            {user.name.charAt(0)}
                          </Text>
                        </View>
                        {user.isOnline && (
                          <View style={styles.onlineIndicator} />
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.conversationContent}
                        onPress={() => handleUserPress(user)}
                      >
                        <Text
                          style={[
                            styles.conversationName,
                            { color: theme.colors.text },
                          ]}
                          numberOfLines={1}
                        >
                          {user.name}
                        </Text>
                        <Text
                          style={[
                            styles.conversationEmail,
                            { color: theme.colors.textSecondary },
                          ]}
                          numberOfLines={1}
                        >
                          {user.email}
                        </Text>
                        {user.lastMessageTime && (
                          <Text
                            style={[
                              styles.conversationTime,
                              { color: theme.colors.textSecondary },
                            ]}
                          >
                            {user.lastMessageTime}
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
