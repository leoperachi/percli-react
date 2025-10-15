import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import apiService from '../services/apiService';

interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  lastMessageTime?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface UsersContextType {
  users: User[];
  onlineUsers: User[];
  loading: boolean;
  error: string | null;
  refreshUsers: () => void;
  getUserById: (userId: string) => User | undefined;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onlineUsers = users.filter(user => user.isOnline);

  const refreshUsers = useCallback(async () => {
    console.log('🔄 [UsersContext] Refreshing users...');
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getUsersList();

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to load users');
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  useEffect(() => {
    console.log('👥 [UsersContext] Loading initial users...');
    refreshUsers();
  }, [refreshUsers]);

  const value: UsersContextType = {
    users,
    onlineUsers,
    loading,
    error,
    refreshUsers,
    getUserById,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export function useUsers(): UsersContextType {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UsersProvider');
  }
  return context;
}
