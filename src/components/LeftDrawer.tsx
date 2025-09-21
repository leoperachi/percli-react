import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

interface LeftDrawerProps {
  onClose: () => void;
}

export function LeftDrawer({ onClose }: LeftDrawerProps) {
  const { user, logout } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation();

  const handleProfilePress = () => {
    onClose();
    navigation.navigate('EditProfile' as never);
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
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeIcon, { color: theme.colors.secondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Menu</Text>
      </View>

      <View style={styles.content}>
        {/* User Info Section */}
        <TouchableOpacity
          style={[
            styles.userSection,
            { borderBottomColor: theme.colors.border },
          ]}
          onPress={handleProfilePress}
        >
          <View style={styles.userAvatar}>
            <Text style={styles.userInitial}>
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || 'Administrador'}
            </Text>
            <Text
              style={[styles.userEmail, { color: theme.colors.textSecondary }]}
            >
              {user?.email || 'admin@percli.com'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Menu Items - Scrollable Section */}
        <View style={styles.menuSection}>
          <ScrollView
            style={styles.menuScrollView}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🏠</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>👤</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Analytics
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📝</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Reports
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>⚙️</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Settings
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>💬</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Support
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Help
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📈</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📋</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Tasks
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📅</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Calendar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📧</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Messages
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📂</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Documents
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>💰</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Finance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🎯</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Goals
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🔍</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Search
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>📊</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Charts
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>🗂️</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Projects
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>👥</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Team
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Bottom Section */}
        <View
          style={[
            styles.bottomSection,
            { borderTopColor: theme.colors.border },
          ]}
        >
          <View
            style={[
              styles.menuItem,
              styles.settingItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={theme.isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.menuItem,
              styles.logoutItem,
              {
                backgroundColor: theme.isDark
                  ? theme.colors.surface
                  : '#FEF2F2',
              },
            ]}
            onPress={logout}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
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
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 34, // Compensate for close button
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    marginBottom: 20,
    flexShrink: 0, // Não encolhe
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  menuSection: {
    flex: 1, // Usa todo o espaço disponível
    marginVertical: 10,
  },
  menuScrollView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bottomSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    marginBottom: 20,
    flexShrink: 0, // Não encolhe
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#DC2626',
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
});
