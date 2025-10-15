import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { Authorization, AuthorizationResource, Menu } from '../types';

interface AuthorizationTreeViewProps {
  authorizations: Authorization[];
  selectedAuthorizations: Set<string>;
  onToggleAuthorization: (authorizationKey: string) => void;
  onAddAuthorization?: (resource: string) => void;
  onRemoveAuthorization?: (authorizationKey: string) => void;
  readonly?: boolean;
}

interface TreeNodeProps {
  authorization: Authorization;
  onAddAuthorization?: (resource: string) => void;
  onRemoveAuthorization?: (authorizationKey: string) => void;
  readonly?: boolean;
}

interface ResourceNodeProps {
  resource: AuthorizationResource;
  onAddAuthorization?: (resource: string) => void;
  onRemoveAuthorization?: (authorizationKey: string) => void;
  readonly?: boolean;
}

interface MenuNodeProps {
  menu: Menu;
  onRemoveAuthorization?: (authorizationKey: string) => void;
  readonly?: boolean;
}

const MenuNode: React.FC<MenuNodeProps> = ({
  menu,
  onRemoveAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();
  const authorizationKey = `${menu.resource}:${menu.action}`;

  const handleRemove = () => {
    if (onRemoveAuthorization) {
      onRemoveAuthorization(authorizationKey);
    }
  };

  return (
    <View style={[styles.menuNode, { borderLeftColor: theme.colors.border }]}>
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
        {!readonly && onRemoveAuthorization && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={handleRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text
              style={[
                styles.removeIcon,
                { color: theme.colors.error || '#EF4444' },
              ]}
            >
              🗑️
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const ResourceNode: React.FC<ResourceNodeProps> = ({
  resource,
  onAddAuthorization,
  onRemoveAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleAdd = () => {
    if (onAddAuthorization) {
      onAddAuthorization(resource.resource);
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
        activeOpacity={0.7}
      >
        <Text style={[styles.resourceName, { color: theme.colors.text }]}>
          {resource.resource}
        </Text>
        <View style={styles.resourceActions}>
          {!readonly && onAddAuthorization && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAdd}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text
                style={[
                  styles.addIcon,
                  { color: theme.colors.primary || '#007AFF' },
                ]}
              >
                +
              </Text>
            </TouchableOpacity>
          )}
          <Text
            style={[styles.expandIcon, { color: theme.colors.textSecondary }]}
          >
            {expanded ? '▼' : '▶'}
          </Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.menusContainer}>
          {resource.menus.map(menu => (
            <MenuNode
              key={menu.id}
              menu={menu}
              onRemoveAuthorization={onRemoveAuthorization}
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
  onAddAuthorization,
  onRemoveAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.treeNode}>
      <TouchableOpacity
        style={[
          styles.authHeader,
          { borderLeftColor: theme.colors.primary || '#007AFF' },
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.authInfo}>
          <Text style={[styles.authName, { color: theme.colors.text }]}>
            {authorization.father}
          </Text>
          <Text
            style={[styles.authCount, { color: theme.colors.textSecondary }]}
          >
            {authorization.children.reduce(
              (total, resource) => total + resource.menus.length,
              0,
            )}{' '}
            menus
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
              onAddAuthorization={onAddAuthorization}
              onRemoveAuthorization={onRemoveAuthorization}
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
  onAddAuthorization,
  onRemoveAuthorization,
  readonly = false,
}) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {authorizations.map(authorization => (
        <TreeNode
          key={authorization.id}
          authorization={authorization}
          onAddAuthorization={onAddAuthorization}
          onRemoveAuthorization={onRemoveAuthorization}
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
  removeButton: {
    padding: 4,
  },
  removeIcon: {
    fontSize: 16,
  },
  resourceActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    padding: 4,
  },
  addIcon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
