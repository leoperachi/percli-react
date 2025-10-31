import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { TypingUser } from '../../types';

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  currentChatId?: string;
}

export function TypingIndicator({ typingUsers, currentChatId }: TypingIndicatorProps) {
  const { theme } = useTheme();

  // Filter typing users for current chat
  const chatTypingUsers = typingUsers.filter(
    user => !currentChatId || user.chatId === currentChatId
  );

  // Animation values for the dots
  const dot1Animation = useRef(new Animated.Value(0)).current;
  const dot2Animation = useRef(new Animated.Value(0)).current;
  const dot3Animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (chatTypingUsers.length > 0) {
      // Create staggered bounce animation for dots
      const createBounceAnimation = (animValue: Animated.Value, delay: number) => {
        return Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(animValue, {
              toValue: -8,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(animValue, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        );
      };

      // Start animations with staggered delays
      const animation1 = createBounceAnimation(dot1Animation, 0);
      const animation2 = createBounceAnimation(dot2Animation, 133);
      const animation3 = createBounceAnimation(dot3Animation, 266);

      animation1.start();
      animation2.start();
      animation3.start();

      return () => {
        animation1.stop();
        animation2.stop();
        animation3.stop();
        dot1Animation.setValue(0);
        dot2Animation.setValue(0);
        dot3Animation.setValue(0);
      };
    }
  }, [chatTypingUsers.length, dot1Animation, dot2Animation, dot3Animation]);

  if (chatTypingUsers.length === 0) {
    return null;
  }

  // Get names of typing users
  const typingNames = chatTypingUsers.map(u => u.userName).join(', ');
  const typingText = chatTypingUsers.length === 1
    ? `${typingNames} está digitando`
    : `${typingNames} estão digitando`;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.isDark ? '#2A2A2A' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.dotsContainer}>
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: theme.isDark ? '#FFFFFF' : '#6B7280',
                transform: [{ translateY: dot1Animation }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: theme.isDark ? '#FFFFFF' : '#6B7280',
                transform: [{ translateY: dot2Animation }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: theme.isDark ? '#FFFFFF' : '#6B7280',
                transform: [{ translateY: dot3Animation }],
              },
            ]}
          />
        </View>
      </View>
      <Text
        style={[
          styles.typingText,
          { color: theme.colors.textSecondary },
        ]}
      >
        {typingText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: 12,
    marginLeft: 8,
    fontStyle: 'italic',
  },
});
