import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface TopBarProps {
  title: string;
  onLeftPress: () => void;
  onRightPress: () => void;
  leftIcon?: 'menu' | 'back';
  rightIcon?: 'settings' | 'profile';
}

export function TopBar({
  title,
  onLeftPress,
  onRightPress,
  leftIcon = 'menu',
  rightIcon = 'settings',
}: TopBarProps) {
  const { theme } = useTheme();

  const renderLeftIcon = () => {
    if (leftIcon === 'back') {
      return (
        <Text style={[styles.backIcon, { color: theme.colors.secondary }]}>
          ←
        </Text>
      );
    }

    // Menu icon (hamburger)
    return (
      <View style={styles.menuIconContainer}>
        <View
          style={[styles.menuLine, { backgroundColor: theme.colors.secondary }]}
        />
        <View
          style={[styles.menuLine, { backgroundColor: theme.colors.secondary }]}
        />
        <View
          style={[styles.menuLine, { backgroundColor: theme.colors.secondary }]}
        />
      </View>
    );
  };

  const renderRightIcon = () => {
    if (rightIcon === 'profile') {
      return <Text style={styles.profileIcon}>👤</Text>;
    }

    // Settings icon (gear)
    return <Text style={styles.settingsIcon}>⚙️</Text>;
  };

  return (
    <>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <TouchableOpacity style={styles.leftButton} onPress={onLeftPress}>
          {renderLeftIcon()}
        </TouchableOpacity>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>

        <TouchableOpacity style={styles.rightButton} onPress={onRightPress}>
          {renderRightIcon()}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  leftButton: {
    padding: 8,
  },
  rightButton: {
    padding: 8,
  },
  menuIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLine: {
    width: 20,
    height: 2,
    marginVertical: 2,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingsIcon: {
    fontSize: 20,
  },
  profileIcon: {
    fontSize: 20,
  },
});
