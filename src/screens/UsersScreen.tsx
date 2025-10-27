import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { User } from '../types';
import { MainLayout } from '../components/MainLayout';
import { ProfilePhoto } from '../components/profilePhoto';
import { useTheme } from '../contexts/ThemeContext';
import apiService from '../services/apiService';

export function UsersScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiService.getUsersList();
      console.log('[UsersScreen] API Response:', JSON.stringify(response, null, 2));

      if (response.success && response.data) {
        // Check if data is an array or an object with users property
        const usersData = Array.isArray(response.data)
          ? response.data
          : response.data.users || [];

        console.log('[UsersScreen] Users data:', usersData);
        setUsers(usersData);
      } else {
        Alert.alert('Error', response.error || 'Failed to load users');
      }
    } catch (error) {
      console.error('[UsersScreen] Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUserPress = (user: User) => {
    Alert.alert(
      'User',
      `Name: ${user.name}\nEmail: ${user.email}\nRole: ${
        user.roleName || user.role?.name || 'N/A'
      }\nStatus: ${user.isActive ? 'Active' : 'Inactive'}`,
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainLayout title="Users" leftIcon="back" onLeftPress={handleBackPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading users...
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Users" leftIcon="back" onLeftPress={handleBackPress}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Manage Users
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {users.length} user{users.length !== 1 ? 's' : ''} found
          </Text>
        </View>

        <View style={styles.usersList}>
          {users.map(user => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => handleUserPress(user)}
            >
              <View style={styles.userInfo}>
                <ProfilePhoto
                  imageBase64={user.profilePicture || user.profilePhoto}
                  userName={user.name}
                  size={48}
                />
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {user.name}
                  </Text>
                  <Text
                    style={[
                      styles.userEmail,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {user.email}
                  </Text>
                  <Text
                    style={[
                      styles.userRole,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Role: {user.roleName || user.role?.name || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.userMeta}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: user.isActive
                        ? theme.colors.success || '#10B981'
                        : theme.colors.error || '#EF4444',
                    },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.userDate,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {formatDate(user.createdAt)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  usersList: {
    gap: 12,
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  userMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  userDate: {
    fontSize: 12,
  },
});
