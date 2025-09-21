import React, { useState, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { TopBar } from './TopBar';
import { LeftDrawer } from './LeftDrawer';
import { RightDrawer } from './RightDrawer';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  leftIcon?: 'menu' | 'back';
  rightIcon?: 'settings' | 'profile';
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBottomNav?: boolean;
  bottomNavContent?: ReactNode;
}

const { width: screenWidth } = Dimensions.get('window');

export function MainLayout({
  children,
  title,
  leftIcon = 'menu',
  rightIcon = 'settings',
  onLeftPress,
  onRightPress,
  showBottomNav = false,
  bottomNavContent,
}: MainLayoutProps) {
  const { theme } = useTheme();
  const [leftDrawerVisible, setLeftDrawerVisible] = useState(false);
  const [rightDrawerVisible, setRightDrawerVisible] = useState(false);

  const handleLeftPress = () => {
    if (onLeftPress) {
      onLeftPress();
    } else if (leftIcon === 'menu') {
      setLeftDrawerVisible(true);
    }
  };

  const handleRightPress = () => {
    if (onRightPress) {
      onRightPress();
    } else if (rightIcon === 'settings') {
      setRightDrawerVisible(true);
    }
  };

  const closeLeftDrawer = () => {
    setLeftDrawerVisible(false);
  };

  const closeRightDrawer = () => {
    setRightDrawerVisible(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TopBar
        title={title}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onLeftPress={handleLeftPress}
        onRightPress={handleRightPress}
      />

      <View style={styles.content}>{children}</View>

      {showBottomNav && bottomNavContent && (
        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: theme.colors.background,
              borderTopColor: theme.colors.border,
            },
          ]}
        >
          {bottomNavContent}
        </View>
      )}

      {/* Left Drawer Modal */}
      <Modal
        visible={leftDrawerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeLeftDrawer}
      >
        <View style={styles.leftDrawerOverlay}>
          <View
            style={[
              styles.drawerContainer,
              styles.leftDrawer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <LeftDrawer onClose={closeLeftDrawer} />
          </View>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeLeftDrawer}
          />
        </View>
      </Modal>

      {/* Right Drawer Modal */}
      <Modal
        visible={rightDrawerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeRightDrawer}
      >
        <View style={styles.rightDrawerOverlay}>
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={closeRightDrawer}
          />
          <View
            style={[
              styles.drawerContainer,
              styles.rightDrawer,
              { backgroundColor: theme.colors.background },
            ]}
          >
            <RightDrawer onClose={closeRightDrawer} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
  },
  // Drawer Styles
  leftDrawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  rightDrawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    width: screenWidth * 0.6, // 60% width
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    height: '100%',
  },
  leftDrawer: {
    // Left drawer already positioned correctly
  },
  rightDrawer: {
    // Right drawer already positioned correctly
  },
});
