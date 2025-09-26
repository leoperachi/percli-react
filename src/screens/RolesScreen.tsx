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

interface Role {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  userCount: number;
}

export function RolesScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      const mockRoles: Role[] = [
        {
          id: 1,
          name: 'admin',
          description: 'Administrator role with full access',
          isActive: true,
          createdAt: '2025-09-23T21:29:38.967Z',
          updatedAt: '2025-09-23T21:29:38.967Z',
          userCount: 2,
        },
        {
          id: 2,
          name: 'user',
          description: 'Standard user role with limited access',
          isActive: true,
          createdAt: '2025-09-23T21:30:15.123Z',
          updatedAt: '2025-09-24T10:15:30.456Z',
          userCount: 15,
        },
        {
          id: 3,
          name: 'moderator',
          description: 'Moderator role with content management permissions',
          isActive: true,
          createdAt: '2025-09-24T08:45:22.789Z',
          updatedAt: '2025-09-24T08:45:22.789Z',
          userCount: 3,
        },
        {
          id: 4,
          name: 'viewer',
          description: 'Read-only access role',
          isActive: false,
          createdAt: '2025-09-22T16:20:10.111Z',
          updatedAt: '2025-09-23T14:30:45.222Z',
          userCount: 0,
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setRoles(mockRoles);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading roles:', error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível carregar as roles');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleRolePress = (role: Role) => {
    Alert.alert(
      'Role Details',
      `Nome: ${role.name}\nDescrição: ${role.description}\nStatus: ${role.isActive ? 'Ativo' : 'Inativo'}\nUsuários: ${role.userCount}`
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
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
            Carregando roles...
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
            Gerenciar Roles
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {roles.length} role{roles.length !== 1 ? 's' : ''} configurada{roles.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.rolesList}>
          {roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={[
                styles.roleCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
              ]}
              onPress={() => handleRolePress(role)}
            >
              <View style={styles.roleHeader}>
                <View style={styles.roleInfo}>
                  <View
                    style={[
                      styles.roleIcon,
                      { backgroundColor: getRoleColor(role.name) }
                    ]}
                  >
                    <Text style={styles.roleInitial}>
                      {role.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.roleDetails}>
                    <Text style={[styles.roleName, { color: theme.colors.text }]}>
                      {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                    </Text>
                    <Text style={[styles.roleDescription, { color: theme.colors.textSecondary }]}>
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
                      {role.isActive ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.roleFooter}>
                <View style={styles.roleStats}>
                  <Text style={[styles.userCount, { color: theme.colors.textSecondary }]}>
                    👥 {role.userCount} usuário{role.userCount !== 1 ? 's' : ''}
                  </Text>
                </View>
                <Text style={[styles.roleDate, { color: theme.colors.textSecondary }]}>
                  Criado em {formatDate(role.createdAt)}
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
  userCount: {
    fontSize: 12,
    fontWeight: '500',
  },
  roleDate: {
    fontSize: 12,
  },
});