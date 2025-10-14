import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { Authorization, AuthorizationResource, Menu } from '../types';

interface AuthorizationTreeViewProps {
  authorizations: Authorization[];
  selectedAuthorizations: Set<string>;
  onToggleAuthorization: (authorizationKey: string) => void;
  readonly?: boolean;
}

interface TreeNodeProps {
  authorization: Authorization;
  selectedAuthorizations: Set<string>;
  onToggleAuthorization: (authorizationKey: string) => void;
  readonly?: boolean;
}

interface ResourceNodeProps {
  resource: AuthorizationResource;
  selectedAuthorizations: Set<string>;
  onToggleAuthorization: (authorizationKey: string) => void;
  readonly?: boolean;
}

interface MenuNodeProps {
  menu: Menu;
  selectedAuthorizations: Set<string>;
  onToggleAuthorization: (authorizationKey: string) => void;
  readonly?: boolean;
}

const MenuNode: React.FC<MenuNodeProps> = ({
  menu,
  selectedAuthorizations,
  onToggleAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();
  const authorizationKey = `${menu.resource}:${menu.action}`;
  const isSelected = selectedAuthorizations.has(authorizationKey);

  const handleToggle = () => {
    if (!readonly) {
      onToggleAuthorization(authorizationKey);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.menuNode, { borderLeftColor: theme.colors.border }]}
      onPress={handleToggle}
      disabled={readonly}
      activeOpacity={readonly ? 1 : 0.7}
    >
      <View style={styles.menuContent}>
        <View style={styles.menuInfo}>
          <Text style={[styles.menuName, { color: theme.colors.text }]}>
            {menu.name}
          </Text>
          <Text
            style={[
              styles.menuDescription,
              { color: theme.colors.textSecondary },
            ]}
          >
            {menu.description}
          </Text>
          <Text
            style={[styles.menuAction, { color: theme.colors.textSecondary }]}
          >
            {menu.resource} • {menu.action}
          </Text>
        </View>
        {!readonly && (
          <View
            style={[
              styles.checkbox,
              isSelected && {
                backgroundColor: theme.colors.primary || '#007AFF',
              },
            ]}
          >
            {isSelected && <Text style={styles.checkmark}>✓</Text>}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const ResourceNode: React.FC<ResourceNodeProps> = ({
  resource,
  selectedAuthorizations,
  onToggleAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    if (!readonly) {
      setExpanded(!expanded);
    }
  };

  return (
    <View style={styles.resourceNode}>
      <TouchableOpacity
        style={[
          styles.resourceHeader,
          { borderLeftColor: theme.colors.border },
        ]}
        onPress={handleToggle}
        disabled={readonly}
        activeOpacity={readonly ? 1 : 0.7}
      >
        <Text style={[styles.resourceName, { color: theme.colors.text }]}>
          {resource.resource}
        </Text>
        <Text
          style={[styles.expandIcon, { color: theme.colors.textSecondary }]}
        >
          {expanded ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.menusContainer}>
          {resource.menus.map(menu => (
            <MenuNode
              key={menu.id}
              menu={menu}
              selectedAuthorizations={selectedAuthorizations}
              onToggleAuthorization={onToggleAuthorization}
              readonly={readonly}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const TreeNode: React.FC<TreeNodeProps> = ({
  authorization,
  selectedAuthorizations,
  onToggleAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    if (!readonly) {
      setExpanded(!expanded);
    }
  };

  return (
    <View style={styles.treeNode}>
      <TouchableOpacity
        style={[
          styles.authHeader,
          { borderLeftColor: theme.colors.primary || '#007AFF' },
        ]}
        onPress={handleToggle}
        disabled={readonly}
        activeOpacity={readonly ? 1 : 0.7}
      >
        <View style={styles.authInfo}>
          <Text style={[styles.authName, { color: theme.colors.text }]}>
            {authorization.father}
          </Text>
          <Text
            style={[styles.authCount, { color: theme.colors.textSecondary }]}
          >
            {authorization.totalMenus} menus
          </Text>
        </View>
        <Text
          style={[styles.expandIcon, { color: theme.colors.textSecondary }]}
        >
          {expanded ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.resourcesContainer}>
          {authorization.children.map((resource, index) => (
            <ResourceNode
              key={`${authorization.id}-${index}`}
              resource={resource}
              selectedAuthorizations={selectedAuthorizations}
              onToggleAuthorization={onToggleAuthorization}
              readonly={readonly}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export const AuthorizationTreeView: React.FC<AuthorizationTreeViewProps> = ({
  authorizations,
  selectedAuthorizations,
  onToggleAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {authorizations.map(authorization => (
        <TreeNode
          key={authorization.id}
          authorization={authorization}
          selectedAuthorizations={selectedAuthorizations}
          onToggleAuthorization={onToggleAuthorization}
          readonly={readonly}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  treeNode: {
    marginBottom: 8,
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  authInfo: {
    flex: 1,
  },
  authName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  authCount: {
    fontSize: 12,
  },
  expandIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  resourcesContainer: {
    marginLeft: 16,
    marginTop: 8,
  },
  resourceNode: {
    marginBottom: 4,
  },
  resourceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },
  resourceName: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  menusContainer: {
    marginLeft: 12,
    marginTop: 4,
  },
  menuNode: {
    borderLeftWidth: 2,
    marginBottom: 2,
  },
  menuContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
  },
  menuInfo: {
    flex: 1,
  },
  menuName: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 11,
    marginBottom: 1,
  },
  menuAction: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
