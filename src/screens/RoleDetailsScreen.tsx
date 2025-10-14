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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';
import apiService from '../services/apiService';
import { RootStackParamList } from '../navigation/AppNavigator';

type RoleDetailsRouteProp = RouteProp<RootStackParamList, 'RoleDetails'>;

interface Authorization {
  id: number;
  name: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
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

      const response = await apiService.getRoleDetails(roleId);

      if (response.success && response.data) {
        setRoleDetails(response.data);
      } else {
        Alert.alert('Error', response.error || 'Failed to load role details');
      }
    } catch (error) {
      console.error('Error loading role details:', error);
      Alert.alert('Error', 'Failed to load role details');
    } finally {
      setLoading(false);
    }
  }, [roleId]);

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

  const getResourceColor = (resource: string) => {
    const colors: { [key: string]: string } = {
      users: '#3B82F6',
      roles: '#10B981',
      authorizations: '#F59E0B',
      posts: '#8B5CF6',
      comments: '#EF4444',
    };
    return colors[resource.toLowerCase()] || '#6B7280';
  };

  const getActionIcon = (action: string) => {
    const icons: { [key: string]: string } = {
      create: '➕',
      read: '👁️',
      update: '✏️',
      delete: '🗑️',
    };
    return icons[action.toLowerCase()] || '🔹';
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
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text },
            ]}
          >
            Authorizations ({roleDetails.authorizations?.length || 0})
          </Text>

          {roleDetails.authorizations && roleDetails.authorizations.length > 0 ? (
            <View style={styles.authorizationsList}>
              {roleDetails.authorizations.map(auth => (
                <View
                  key={auth.id}
                  style={[
                    styles.authCard,
                    {
                      backgroundColor: theme.colors.surface,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.authHeader}>
                    <View style={styles.authTitleRow}>
                      <View
                        style={[
                          styles.resourceBadge,
                          { backgroundColor: getResourceColor(auth.resource) },
                        ]}
                      >
                        <Text style={styles.resourceText}>
                          {auth.resource}
                        </Text>
                      </View>
                      <View style={styles.actionBadge}>
                        <Text style={styles.actionIcon}>
                          {getActionIcon(auth.action)}
                        </Text>
                        <Text
                          style={[
                            styles.actionText,
                            { color: theme.colors.textSecondary },
                          ]}
                        >
                          {auth.action}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.authStatusBadge,
                        {
                          backgroundColor: auth.isActive
                            ? theme.colors.success || '#10B981'
                            : theme.colors.error || '#EF4444',
                        },
                      ]}
                    >
                      <Text style={styles.authStatusText}>
                        {auth.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.authName, { color: theme.colors.text }]}>
                    {auth.name}
                  </Text>

                  <Text
                    style={[
                      styles.authDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {auth.description}
                  </Text>
                </View>
              ))}
            </View>
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
  authorizationsList: {
    gap: 12,
  },
  authCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  authHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  authTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  resourceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  resourceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionIcon: {
    fontSize: 14,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  authStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  authStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  authName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  authDescription: {
    fontSize: 14,
    lineHeight: 20,
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
