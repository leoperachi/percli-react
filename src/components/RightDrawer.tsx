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
import { useTheme } from '../contexts/ThemeContext';

interface RightDrawerProps {
  onClose: () => void;
}

export function RightDrawer({ onClose }: RightDrawerProps) {
  const { theme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

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

      <ScrollView style={styles.content}>
        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Notifications
          </Text>

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

          <TouchableOpacity
            style={[
              styles.notificationItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeIcon}>🔔</Text>
            </View>
            <View style={styles.notificationContent}>
              <Text
                style={[styles.notificationTitle, { color: theme.colors.text }]}
              >
                Daily Reminder
              </Text>
              <Text
                style={[
                  styles.notificationSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Complete your daily tasks
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  { color: theme.colors.textSecondary },
                ]}
              >
                2 hours ago
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.notificationItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={[styles.notificationBadge, styles.badgeGreen]}>
              <Text style={styles.badgeIcon}>✨</Text>
            </View>
            <View style={styles.notificationContent}>
              <Text
                style={[styles.notificationTitle, { color: theme.colors.text }]}
              >
                Progress Update
              </Text>
              <Text
                style={[
                  styles.notificationSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                You've reached 60% progress!
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  { color: theme.colors.textSecondary },
                ]}
              >
                1 day ago
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.notificationItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={[styles.notificationBadge, styles.badgeOrange]}>
              <Text style={styles.badgeIcon}>📊</Text>
            </View>
            <View style={styles.notificationContent}>
              <Text
                style={[styles.notificationTitle, { color: theme.colors.text }]}
              >
                Weekly Report
              </Text>
              <Text
                style={[
                  styles.notificationSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Your weekly report is ready
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  { color: theme.colors.textSecondary },
                ]}
              >
                3 days ago
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
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
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
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
              <Text style={styles.settingIcon}>📱</Text>
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
                App Preferences
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
              <Text style={[styles.settingText, { color: theme.colors.text }]}>
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

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Export Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.actionIcon}>🔄</Text>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Sync Data
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              Clear Cache
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
