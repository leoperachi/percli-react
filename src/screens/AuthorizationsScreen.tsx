import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../contexts/ThemeContext';
import { MainLayout } from '../components/MainLayout';

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

interface AuthorizationResource {
  resource: string;
  menus: Menu[];
}

interface Authorization {
  id: number;
  father: string;
  children: AuthorizationResource[];
  createdAt: string;
  totalMenus: number;
}

export function AuthorizationsScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [authorizations, setAuthorizations] = useState<Authorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAuth, setExpandedAuth] = useState<number | null>(null);

  useEffect(() => {
    loadAuthorizations();
  }, []);

  const loadAuthorizations = async () => {
    try {
      setLoading(true);
      // Simulated data based on the API response structure
      const mockAuthorizations: Authorization[] = [
        {
          id: 10,
          father: 'Security',
          createdAt: '2025-09-23T21:29:38.971Z',
          totalMenus: 8,
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
                  description: 'Delete users',
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
                  description: 'View roles and permissions',
                  resource: 'roles',
                  action: 'read',
                  uplevel: 10,
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
                {
                  id: 6,
                  name: 'Manage Roles',
                  description: 'Create, update, delete roles and manage permissions',
                  resource: 'roles',
                  action: 'manage',
                  uplevel: 10,
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
              ],
            },
            {
              resource: 'authorizations',
              menus: [
                {
                  id: 7,
                  name: 'Read Authorizations',
                  description: 'View authorizations',
                  resource: 'authorizations',
                  action: 'read',
                  uplevel: 10,
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
                {
                  id: 8,
                  name: 'Manage Authorizations',
                  description: 'Create, update, delete authorizations',
                  resource: 'authorizations',
                  action: 'manage',
                  uplevel: 10,
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
              ],
            },
          ],
        },
        {
          id: 11,
          father: 'Content Management',
          createdAt: '2025-09-24T09:15:20.123Z',
          totalMenus: 6,
          children: [
            {
              resource: 'posts',
              menus: [
                {
                  id: 9,
                  name: 'Create Posts',
                  description: 'Create new posts',
                  resource: 'posts',
                  action: 'create',
                  uplevel: 11,
                  isActive: true,
                  createdAt: '2025-09-24T09:15:20.123Z',
                  updatedAt: '2025-09-24T09:15:20.123Z',
                },
                {
                  id: 10,
                  name: 'Edit Posts',
                  description: 'Edit existing posts',
                  resource: 'posts',
                  action: 'update',
                  uplevel: 11,
                  isActive: true,
                  createdAt: '2025-09-24T09:15:20.123Z',
                  updatedAt: '2025-09-24T09:15:20.123Z',
                },
              ],
            },
            {
              resource: 'comments',
              menus: [
                {
                  id: 11,
                  name: 'Moderate Comments',
                  description: 'Moderate user comments',
                  resource: 'comments',
                  action: 'moderate',
                  uplevel: 11,
                  isActive: true,
                  createdAt: '2025-09-24T09:15:20.123Z',
                  updatedAt: '2025-09-24T09:15:20.123Z',
                },
              ],
            },
          ],
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setAuthorizations(mockAuthorizations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading authorizations:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to load authorizations');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAuthorizationPress = (authId: number) => {
    setExpandedAuth(expandedAuth === authId ? null : authId);
  };

  const handleMenuPress = (menu: Menu) => {
    Alert.alert(
      'Menu Permission',
      `Name: ${menu.name}\nDescription: ${menu.description}\nResource: ${menu.resource}\nAction: ${menu.action}\nStatus: ${menu.isActive ? 'Active' : 'Inactive'}`
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  if (loading) {
    return (
      <MainLayout title="Authorizations" leftIcon="back" onLeftPress={handleBackPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading authorizations...
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Authorizations" leftIcon="back" onLeftPress={handleBackPress}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Manage Authorizations
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {authorizations.length} authorization group{authorizations.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.authorizationsList}>
          {authorizations.map((auth) => (
            <View key={auth.id}>
              <TouchableOpacity
                style={[
                  styles.authorizationCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                ]}
                onPress={() => handleAuthorizationPress(auth.id)}
              >
                <View style={styles.authHeader}>
                  <View style={styles.authInfo}>
                    <Text style={[styles.authName, { color: theme.colors.text }]}>
                      {auth.father}
                    </Text>
                    <Text style={[styles.authStats, { color: theme.colors.textSecondary }]}>
                      {auth.children.length} recurso{auth.children.length !== 1 ? 's' : ''} • {auth.totalMenus} permissõe{auth.totalMenus !== 1 ? 's' : ''}
                    </Text>
                    <Text style={[styles.authDate, { color: theme.colors.textSecondary }]}>
                      Criado em {formatDate(auth.createdAt)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.expandIcon,
                      {
                        color: theme.colors.textSecondary,
                        transform: [{ rotate: expandedAuth === auth.id ? '90deg' : '0deg' }]
                      }
                    ]}
                  >
                    ▶
                  </Text>
                </View>
              </TouchableOpacity>

              {expandedAuth === auth.id && (
                <View style={[styles.resourcesList, { backgroundColor: theme.colors.background }]}>
                  {auth.children.map((resource) => (
                    <View key={resource.resource} style={styles.resourceGroup}>
                      <View style={styles.resourceHeader}>
                        <View
                          style={[
                            styles.resourceIcon,
                            { backgroundColor: getResourceColor(resource.resource) }
                          ]}
                        >
                          <Text style={styles.resourceInitial}>
                            {resource.resource.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <Text style={[styles.resourceName, { color: theme.colors.text }]}>
                          {resource.resource.charAt(0).toUpperCase() + resource.resource.slice(1)}
                        </Text>
                        <Text style={[styles.menuCount, { color: theme.colors.textSecondary }]}>
                          {resource.menus.length} menu{resource.menus.length !== 1 ? 's' : ''}
                        </Text>
                      </View>

                      <View style={styles.menusList}>
                        {resource.menus.map((menu) => (
                          <TouchableOpacity
                            key={menu.id}
                            style={[
                              styles.menuItem,
                              { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
                            ]}
                            onPress={() => handleMenuPress(menu)}
                          >
                            <View style={styles.menuInfo}>
                              <Text style={[styles.menuName, { color: theme.colors.text }]}>
                                {menu.name}
                              </Text>
                              <Text style={[styles.menuDescription, { color: theme.colors.textSecondary }]}>
                                {menu.description}
                              </Text>
                              <Text style={[styles.menuAction, { color: theme.colors.textSecondary }]}>
                                Ação: {menu.action}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.menuStatus,
                                {
                                  backgroundColor: menu.isActive
                                    ? theme.colors.success || '#10B981'
                                    : theme.colors.error || '#EF4444',
                                },
                              ]}
                            >
                              <Text style={styles.menuStatusText}>
                                {menu.isActive ? '✓' : '✗'}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
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
  authorizationsList: {
    gap: 16,
    paddingBottom: 20,
  },
  authorizationCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authInfo: {
    flex: 1,
  },
  authName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  authStats: {
    fontSize: 14,
    marginBottom: 2,
  },
  authDate: {
    fontSize: 12,
  },
  expandIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  resourcesList: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
  },
  resourceGroup: {
    marginBottom: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resourceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  resourceInitial: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resourceName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  menuCount: {
    fontSize: 12,
  },
  menusList: {
    gap: 8,
    marginLeft: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    marginBottom: 2,
  },
  menuAction: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  menuStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  menuStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});