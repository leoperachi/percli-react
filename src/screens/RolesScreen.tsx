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
import type { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';
import apiService from '../services/apiService';
import type { RootStackParamList } from '../navigation/AppNavigator';

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usersCount: number;
}

export function RolesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);

      const response = await apiService.getRolesList();

      if (response.success && response.data) {
        setRoles(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load roles');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load roles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRolePress = (role: Role) => {
    navigation.navigate('RoleDetails', {
      roleId: role.id,
      roleName: role.name,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      admin: '#EF4444',
      user: '#3B82F6',
      moderator: '#F59E0B',
      viewer: '#6B7280',
    };
    return colors[roleName.toLowerCase()] || '#6366F1';
  };

  if (loading) {
    return (
      <MainLayout title="Roles" leftIcon="back" onLeftPress={handleBackPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading roles...
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Roles" leftIcon="back" onLeftPress={handleBackPress}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Manage Roles
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            {roles.length} role{roles.length !== 1 ? 's' : ''} configured
          </Text>
        </View>

        <View style={styles.rolesList}>
          {roles.map(role => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => handleRolePress(role)}
            >
              <View style={styles.roleHeader}>
                <View style={styles.roleInfo}>
                  <View
                    style={[
                      styles.roleIcon,
                      { backgroundColor: getRoleColor(role.name) },
                    ]}
                  >
                    <Text style={styles.roleInitial}>
                      {role.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.roleDetails}>
                    <Text
                      style={[styles.roleName, { color: theme.colors.text }]}
                    >
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </Text>
                    <Text
                      style={[
                        styles.roleDescription,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {role.description}
                    </Text>
                  </View>
                </View>
                <View style={styles.roleMeta}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: role.isActive
                          ? theme.colors.success || '#10B981'
                          : theme.colors.error || '#EF4444',
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {role.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.roleFooter}>
                <View style={styles.roleStats}>
                  <Text
                    style={[
                      styles.usersCount,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    👥 {role.usersCount} user{role.usersCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.roleDate,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  Created on {formatDate(role.createdAt)}
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
  rolesList: {
    gap: 16,
    paddingBottom: 20,
  },
  roleCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roleInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleDetails: {
    flex: 1,
  },
  roleName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  roleMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  roleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  roleStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  roleDate: {
    fontSize: 12,
  },
});
