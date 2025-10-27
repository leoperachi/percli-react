import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { Authorization, AuthorizationResource } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { ProfilePhoto } from './profilePhoto';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface LeftDrawerProps {
  onClose: () => void;
}

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function LeftDrawer({ onClose }: LeftDrawerProps) {
  const { user, logout } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [expandedAuthorizations, setExpandedAuthorizations] = useState<
    Set<string>
  >(new Set());
  const [expandedResources, setExpandedResources] = useState<Set<string>>(
    new Set(),
  );

  const handleProfilePress = () => {
    onClose();
    navigation.navigate('EditProfile' as never);
  };

  const toggleAuthorization = (authId: string) => {
    const newExpanded = new Set(expandedAuthorizations);
    if (newExpanded.has(authId)) {
      newExpanded.delete(authId);
    } else {
      newExpanded.add(authId);
    }
    setExpandedAuthorizations(newExpanded);
  };

  const toggleResource = (resourceKey: string) => {
    const newExpanded = new Set(expandedResources);
    if (newExpanded.has(resourceKey)) {
      newExpanded.delete(resourceKey);
    } else {
      newExpanded.add(resourceKey);
    }
    setExpandedResources(newExpanded);
  };

  // Remove renderMenuItem since we won't render the individual menus

  const getScreenNameFromResource = (
    resource: string,
  ): keyof RootStackParamList | null => {
    const resourceScreenMap: { [key: string]: keyof RootStackParamList } = {
      users: 'Users',
      roles: 'Roles',
      authorizations: 'Authorizations',
    };
    return resourceScreenMap[resource.toLowerCase()] || null;
  };

  const getResourceIcon = (resource: AuthorizationResource): string => {
    // Map database icon names to valid MaterialIcons names
    const iconMapping: { [key: string]: string } = {
      // User related icons
      user: 'account-circle',
      users: 'account-circle',
      people: 'account-circle',
      person: 'account-circle',

      // Role/Security related icons
      role: 'admin-panel-settings',
      roles: 'admin-panel-settings',
      shield: 'admin-panel-settings',
      security: 'admin-panel-settings',

      // Authorization/Key related icons
      authorization: 'lock',
      authorizations: 'lock',
      key: 'lock',
      'vpn-key': 'lock',

      // Other icons
      settings: 'settings',
      reports: 'assessment',
      dashboard: 'dashboard',
      chat: 'chat',
      notifications: 'notifications',
      menu: 'menu',
    };

    // Check if any menu in this resource has an icon
    const menuWithIcon = resource.menus.find(menu => menu.icon);
    if (menuWithIcon?.icon) {
      const dbIcon = menuWithIcon.icon.toLowerCase().trim();
      console.log(
        `[LeftDrawer] Icon from DB for ${resource.resource}:`,
        menuWithIcon.icon,
      );

      // Try to map the database icon to a valid MaterialIcon
      const mappedIcon = iconMapping[dbIcon];
      if (mappedIcon) {
        console.log(`[LeftDrawer] Mapped "${dbIcon}" to "${mappedIcon}"`);
        return mappedIcon;
      }

      // If no mapping found, log warning and use fallback
      console.warn(
        `[LeftDrawer] No mapping found for icon "${dbIcon}", using fallback`,
      );
    }

    // Fallback to default MaterialIcons based on resource name
    const resourceName = resource.resource.toLowerCase();
    const fallbackIcon = iconMapping[resourceName] || 'menu';
    console.log(
      `[LeftDrawer] Using fallback for ${resource.resource}: ${fallbackIcon}`,
    );
    return fallbackIcon;
  };

  const handleResourcePress = (resource: AuthorizationResource) => {
    const screenName = getScreenNameFromResource(resource.resource);
    if (screenName) {
      onClose(); // Close drawer first
      navigation.navigate(screenName as any);
    }
  };

  const renderResourceItem = (
    resource: AuthorizationResource,
    authId: number,
  ) => {
    const resourceKey = `${authId}-${resource.resource}`;
    const canNavigate = getScreenNameFromResource(resource.resource) !== null;

    return (
      <View key={resourceKey} style={styles.authorizationContainer}>
        <TouchableOpacity
          style={[
            styles.resourceItem,
            { backgroundColor: theme.colors.surface },
            canNavigate && styles.resourceItemClickable,
          ]}
          onPress={() => handleResourcePress(resource)}
          disabled={!canNavigate}
        >
          <View style={styles.resourceIconContainer}>
            <Icon
              name={getResourceIcon(resource)}
              size={24}
              color={theme.colors.text}
            />
          </View>
          <Text style={[styles.resourceText, { color: theme.colors.text }]}>
            {resource.resource.charAt(0).toUpperCase() +
              resource.resource.slice(1)}
          </Text>
          {canNavigate && (
            <Icon
              name="chevron-right"
              size={20}
              color={theme.colors.textSecondary}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderAuthorizationItem = (auth: Authorization) => {
    const authKey = auth.id.toString();
    const isExpanded = expandedAuthorizations.has(authKey);
    const hasChildren = auth.children && auth.children.length > 0;

    return (
      <View key={auth.id} style={styles.authorizationContainer}>
        <TouchableOpacity
          style={[
            styles.authorizationItem,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={() => hasChildren && toggleAuthorization(authKey)}
          disabled={!hasChildren}
        >
          <Text
            style={[styles.authorizationText, { color: theme.colors.text }]}
          >
            {auth.father}
          </Text>
          {hasChildren && (
            <Animated.View
              style={[
                styles.arrowIcon,
                {
                  transform: [{ rotate: isExpanded ? '90deg' : '0deg' }],
                },
              ]}
            >
              <Text
                style={[
                  styles.arrowIconText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ▶
              </Text>
            </Animated.View>
          )}
        </TouchableOpacity>
        {hasChildren &&
          isExpanded &&
          auth.children.map(resource => renderResourceItem(resource, auth.id))}
      </View>
    );
  };

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
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={[styles.closeIcon, { color: theme.colors.secondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Menu</Text>
      </View>

      <View style={styles.content}>
        {/* User Info Section */}
        <TouchableOpacity
          style={[
            styles.userSection,
            { borderBottomColor: theme.colors.border },
          ]}
          onPress={handleProfilePress}
        >
          <ProfilePhoto
            imageBase64={user?.profilePicture}
            userName={user?.name || 'Administrador'}
            size={40}
            style={{ marginRight: 12 }}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user?.name || 'Administrador'}
            </Text>
            <Text
              style={[styles.userEmail, { color: theme.colors.textSecondary }]}
            >
              {user?.email || 'admin@percli.com'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Menu Items - Scrollable Section */}
        <View style={styles.menuSection}>
          <ScrollView
            style={styles.menuScrollView}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={{ paddingBottom: 10 }}
          >
            {/* Authorizations Section */}
            {user?.role?.authorizations &&
              user.role.authorizations.length > 0 && (
                <View style={styles.authorizationsSection}>
                  {user.role.authorizations.map(auth =>
                    renderAuthorizationItem(auth),
                  )}
                </View>
              )}
          </ScrollView>
        </View>

        {/* Bottom Section */}
        <View
          style={[
            styles.bottomSection,
            { borderTopColor: theme.colors.border },
          ]}
        >
          {/* Debug: Logs Viewer */}
          {__DEV__ && (
            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.settingItem,
                { borderBottomColor: theme.colors.border },
              ]}
              onPress={() => {
                onClose();
                navigation.navigate('LogViewer' as never);
              }}
            >
              <View style={styles.settingInfo}>
                <Icon
                  name="bug-report"
                  size={20}
                  color={theme.colors.text}
                  style={styles.menuIconMaterial}
                />
                <Text style={[styles.menuText, { color: theme.colors.text }]}>
                  Logs do App
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          )}

          <View
            style={[
              styles.menuItem,
              styles.settingItem,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.settingInfo}>
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={[styles.menuText, { color: theme.colors.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme.isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.accent,
              }}
              thumbColor={theme.isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.menuItem,
              styles.logoutItem,
              {
                backgroundColor: theme.isDark
                  ? theme.colors.surface
                  : '#FEF2F2',
              },
            ]}
            onPress={logout}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginRight: 34, // Compensate for close button
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 12,
    flexShrink: 0, // Não encolhe
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
  },
  menuSection: {
    flex: 1, // Usa todo o espaço disponível
    marginVertical: 6,
  },
  menuScrollView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 3,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
    width: 22,
    textAlign: 'center',
  },
  menuIconMaterial: {
    marginRight: 12,
    width: 22,
  },
  resourceIconContainer: {
    marginRight: 12,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 15,
    fontWeight: '500',
  },
  bottomSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    marginBottom: 10,
    flexShrink: 0, // Não encolhe
  },
  logoutItem: {
    marginTop: 8,
  },
  logoutText: {
    color: '#DC2626',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemsSection: {
    marginVertical: 8,
  },
  authorizationsSection: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  authorizationContainer: {
    marginBottom: 2,
  },
  authorizationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  authorizationText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  resourceItemClickable: {
    opacity: 0.8,
  },
  resourceText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  navigationIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  arrowIcon: {
    marginLeft: 8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIconText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
