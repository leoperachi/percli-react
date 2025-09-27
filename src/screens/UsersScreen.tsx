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
import { ProfilePhoto } from '../components/profilePhoto';

interface User {
  id: string;
  name: string;
  email: string;
  role: {
    name: string;
  };
  isActive: boolean;
  profilePhoto?: string;
  createdAt: string;
}

export function UsersScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Simulated data - replace with actual API call
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'Administrador',
          email: 'admin@percli.com',
          role: { name: 'admin' },
          isActive: true,
          createdAt: '2025-09-23T21:29:40.020Z',
        },
        {
          id: '2',
          name: 'João Silva',
          email: 'joao@example.com',
          role: { name: 'user' },
          isActive: true,
          createdAt: '2025-09-24T10:15:30.020Z',
        },
        {
          id: '3',
          name: 'Maria Santos',
          email: 'maria@example.com',
          role: { name: 'user' },
          isActive: false,
          createdAt: '2025-09-22T14:30:15.020Z',
        },
      ];

      // Simulate API delay
      setTimeout(() => {
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
      Alert.alert('Erro', 'Não foi possível carregar os usuários');
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleUserPress = (user: User) => {
    Alert.alert(
      'Usuário',
      `Nome: ${user.name}\nEmail: ${user.email}\nRole: ${user.role.name}\nStatus: ${user.isActive ? 'Ativo' : 'Inativo'}`
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <MainLayout title="Usuários" leftIcon="back" onLeftPress={handleBackPress}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Carregando usuários...
          </Text>
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Usuários" leftIcon="back" onLeftPress={handleBackPress}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Gerenciar Usuários
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {users.length} usuário{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <View style={styles.usersList}>
          {users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userCard,
                { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }
              ]}
              onPress={() => handleUserPress(user)}
            >
              <View style={styles.userInfo}>
                <ProfilePhoto
                  imageBase64={user.profilePhoto}
                  userName={user.name}
                  size={48}
                />
                <View style={styles.userDetails}>
                  <Text style={[styles.userName, { color: theme.colors.text }]}>
                    {user.name}
                  </Text>
                  <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                    {user.email}
                  </Text>
                  <Text style={[styles.userRole, { color: theme.colors.textSecondary }]}>
                    Role: {user.role.name}
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
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
                <Text style={[styles.userDate, { color: theme.colors.textSecondary }]}>
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