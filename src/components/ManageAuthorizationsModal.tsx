import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { AuthorizationTreeView } from './AuthorizationTreeView';
import type { Authorization } from '../types';
// import apiService from '../services/apiService';

interface ManageAuthorizationsModalProps {
  visible: boolean;
  onClose: () => void;
  roleId: number;
  roleName: string;
  currentAuthorizations: Authorization[];
  onAuthorizationsUpdated: (authorizations: Authorization[]) => void;
}

export const ManageAuthorizationsModal: React.FC<
  ManageAuthorizationsModalProps
> = ({
  visible,
  onClose,
  roleId,
  roleName,
  currentAuthorizations,
  onAuthorizationsUpdated,
}) => {
  const { theme } = useTheme();
  const [allAuthorizations, setAllAuthorizations] = useState<Authorization[]>(
    [],
  );
  const [selectedAuthorizations, setSelectedAuthorizations] = useState<
    Set<string>
  >(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      loadAllAuthorizations();
      loadCurrentAuthorizations();
    }
  }, [visible, loadAllAuthorizations, loadCurrentAuthorizations]);

  const loadAllAuthorizations = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockAuthorizations: Authorization[] = [
        {
          id: 10,
          father: 'Security',
          totalMenus: 8,
          createdAt: '2025-09-23T21:29:38.971Z',
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
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
                {
                  id: 7,
                  name: 'Update Roles',
                  description: 'Update role information and authorizations',
                  resource: 'roles',
                  action: 'update',
                  uplevel: 10,
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
                {
                  id: 8,
                  name: 'Delete Roles',
                  description: 'Delete role accounts',
                  resource: 'roles',
                  action: 'delete',
                  uplevel: 10,
                  isActive: true,
                  createdAt: '2025-09-23T21:29:38.971Z',
                  updatedAt: '2025-09-23T21:29:38.971Z',
                },
              ],
            },
          ],
        },
      ];

      setAllAuthorizations(mockAuthorizations);
    } catch (error) {
      console.error('Error loading authorizations:', error);
      Alert.alert('Error', 'Failed to load authorizations');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCurrentAuthorizations = useCallback(() => {
    const selected = new Set<string>();
    currentAuthorizations.forEach(auth => {
      auth.children.forEach(resource => {
        resource.menus.forEach(menu => {
          selected.add(`${menu.resource}:${menu.action}`);
        });
      });
    });
    setSelectedAuthorizations(selected);
  }, [currentAuthorizations]);

  const handleToggleAuthorization = (authorizationKey: string) => {
    const newSelected = new Set(selectedAuthorizations);
    if (newSelected.has(authorizationKey)) {
      newSelected.delete(authorizationKey);
    } else {
      newSelected.add(authorizationKey);
    }
    setSelectedAuthorizations(newSelected);
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Convert selected authorizations back to Authorization format
      const updatedAuthorizations = allAuthorizations
        .map(auth => ({
          ...auth,
          children: auth.children
            .map(resource => ({
              ...resource,
              menus: resource.menus.filter(menu =>
                selectedAuthorizations.has(`${menu.resource}:${menu.action}`),
              ),
            }))
            .filter(resource => resource.menus.length > 0),
        }))
        .filter(auth => auth.children.length > 0);

      // Here you would make the API call to update role authorizations
      // await apiService.updateRoleAuthorizations(roleId, updatedAuthorizations);

      console.log('Updated authorizations:', updatedAuthorizations);

      onAuthorizationsUpdated(updatedAuthorizations);
      Alert.alert('Success', 'Authorizations updated successfully');
      onClose();
    } catch (error) {
      console.error('Error saving authorizations:', error);
      Alert.alert('Error', 'Failed to save authorizations');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    const allKeys = new Set<string>();
    allAuthorizations.forEach(auth => {
      auth.children.forEach(resource => {
        resource.menus.forEach(menu => {
          allKeys.add(`${menu.resource}:${menu.action}`);
        });
      });
    });
    setSelectedAuthorizations(allKeys);
  };

  const handleSelectNone = () => {
    setSelectedAuthorizations(new Set());
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View
          style={[styles.header, { borderBottomColor: theme.colors.border }]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={[styles.closeText, { color: theme.colors.primary }]}>
              Cancel
            </Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Manage Authorizations
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              Role: {roleName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            style={styles.saveButton}
            disabled={loading}
          >
            <Text style={[styles.saveText, { color: theme.colors.primary }]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.controls, { borderBottomColor: theme.colors.border }]}
        >
          <TouchableOpacity
            onPress={handleSelectAll}
            style={styles.controlButton}
          >
            <Text style={[styles.controlText, { color: theme.colors.primary }]}>
              Select All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSelectNone}
            style={styles.controlButton}
          >
            <Text style={[styles.controlText, { color: theme.colors.primary }]}>
              Select None
            </Text>
          </TouchableOpacity>

          <Text style={[styles.count, { color: theme.colors.textSecondary }]}>
            {selectedAuthorizations.size} selected
          </Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <AuthorizationTreeView
            authorizations={allAuthorizations}
            selectedAuthorizations={selectedAuthorizations}
            onToggleAuthorization={handleToggleAuthorization}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  closeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  controlButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  controlText: {
    fontSize: 14,
    fontWeight: '500',
  },
  count: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
