import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';
import { AuthorizationTreeView } from '../components/AuthorizationTreeView';
import type { RootStackParamList } from '../navigation/AppNavigator';

type RoleDetailsRouteProp = RouteProp<RootStackParamList, 'RoleDetails'>;

interface Menu {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
  uplevel: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Resource {
  resource: string;
  menus: Menu[];
}

interface Authorization {
  id: number;
  father: string;
  children: Resource[];
}

interface RoleDetails {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usersCount: number;
  authorizations: Authorization[];
}

export function RoleDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RoleDetailsRouteProp>();
  const { theme } = useTheme();
  const { roleId, roleName } = route.params;

  const [roleDetails, setRoleDetails] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const loadRoleDetails = useCallback(async () => {
    try {
      setLoading(true);

      // Mock data with hierarchical structure
      const mockRoleDetails: RoleDetails = {
        id: roleId,
        name: roleName,
        description: `${roleName} role with specific permissions`,
        isActive: true,
        createdAt: '2025-09-23T21:29:38.971Z',
        updatedAt: '2025-09-23T21:29:38.971Z',
        usersCount: 1,
        authorizations: [
          {
            id: 10,
            father: 'Security',
            children: [
              {
                resource: 'users',
                menus: [
                  {
                    id: 1,
                    name: 'Read Users',
                    description: 'View user information and lists',
                    resource: 'users',
                    action: 'read',
                    uplevel: 10,
                    isActive: true,
                    createdAt: '2025-09-23T21:29:38.971Z',
                    updatedAt: '2025-09-23T21:29:38.971Z',
                  },
                  {
                    id: 2,
                    name: 'Create Users',
                    description: 'Create new users',
                    resource: 'users',
                    action: 'create',
                    uplevel: 10,
                    isActive: true,
                    createdAt: '2025-09-23T21:29:38.971Z',
                    updatedAt: '2025-09-23T21:29:38.971Z',
                  },
                  {
                    id: 3,
                    name: 'Update Users',
                    description: 'Update user information',
                    resource: 'users',
                    action: 'update',
                    uplevel: 10,
                    isActive: true,
                    createdAt: '2025-09-23T21:29:38.971Z',
                    updatedAt: '2025-09-23T21:29:38.971Z',
                  },
                  {
                    id: 4,
                    name: 'Delete Users',
                    description: 'Delete user accounts',
                    resource: 'users',
                    action: 'delete',
                    uplevel: 10,
                    isActive: true,
                    createdAt: '2025-09-23T21:29:38.971Z',
                    updatedAt: '2025-09-23T21:29:38.971Z',
                  },
                ],
              },
              {
                resource: 'roles',
                menus: [
                  {
                    id: 5,
                    name: 'Read Roles',
                    description: 'View role information and lists',
                    resource: 'roles',
                    action: 'read',
                    uplevel: 10,
                    isActive: true,
                    createdAt: '2025-09-23T21:29:38.971Z',
                    updatedAt: '2025-09-23T21:29:38.971Z',
                  },
                  {
                    id: 6,
                    name: 'Create Roles',
                    description: 'Create new roles',
                    resource: 'roles',
                    action: 'create',
                    uplevel: 10,
                    isActive: false,
                    createdAt: '2025-09-23T21:29:38.971Z',
                    updatedAt: '2025-09-23T21:29:38.971Z',
                  },
                ],
              },
            ],
          },
        ],
      };

      setRoleDetails(mockRoleDetails);
    } catch (error) {
      Alert.alert('Error', 'Failed to load role details');
    } finally {
      setLoading(false);
    }
  }, [roleId, roleName]);

  useEffect(() => {
    loadRoleDetails();
  }, [loadRoleDetails]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <MainLayout
        title={roleName}
        leftIcon="back"
        onLeftPress={handleBackPress}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading role details...
          </Text>
        </View>
      </MainLayout>
    );
  }

  if (!roleDetails) {
    return (
      <MainLayout
        title={roleName}
        leftIcon="back"
        onLeftPress={handleBackPress}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>
            Role not found
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={roleName} leftIcon="back" onLeftPress={handleBackPress}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Role Information Card */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <View style={styles.infoHeader}>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              Role Information
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: roleDetails.isActive
                    ? theme.colors.success || '#10B981'
                    : theme.colors.error || '#EF4444',
                },
              ]}
            >
              <Text style={styles.statusText}>
                {roleDetails.isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
            >
              Name:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {roleDetails.name}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
            >
              Description:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {roleDetails.description}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
            >
              Users:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {roleDetails.usersCount} user
              {roleDetails.usersCount !== 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
            >
              Created:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {formatDate(roleDetails.createdAt)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text
              style={[styles.infoLabel, { color: theme.colors.textSecondary }]}
            >
              Updated:
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {formatDate(roleDetails.updatedAt)}
            </Text>
          </View>
        </View>

        {/* Authorizations Section */}
        <View style={styles.authorizationsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Authorizations
          </Text>

          {roleDetails.authorizations &&
          roleDetails.authorizations.length > 0 ? (
            <AuthorizationTreeView
              authorizations={roleDetails.authorizations}
              onAddAuthorization={resource => {
                Alert.alert(
                  'Add Authorization',
                  `Add new authorization for ${resource} resource`,
                );
              }}
              onRemoveAuthorization={authorizationKey => {
                Alert.alert(
                  'Remove Authorization',
                  `Remove authorization: ${authorizationKey}`,
                );
              }}
              readonly={false}
              selectedAuthorizations={new Set()}
              onToggleAuthorization={(_authorizationKey: string): void => {
                throw new Error('Function not implemented.');
              }}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text
                style={[
                  styles.emptyStateText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No authorizations assigned to this role
              </Text>
            </View>
          )}
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoCard: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  authorizationsSection: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
