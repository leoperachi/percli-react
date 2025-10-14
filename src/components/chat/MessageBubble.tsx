import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { ChatMessage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useAppContext } from '../../contexts/AppContext';

interface MessageBubbleProps {
  message: ChatMessage;
  onReply?: (message: ChatMessage) => void;
  onLongPress?: (message: ChatMessage) => void;
}

export function MessageBubble({
  message,
  onReply,
  onLongPress,
}: MessageBubbleProps) {
  const { theme } = useTheme();
  const { user } = useAppContext();

  const isOwnMessage = message.senderId === user?.id;

  // Determine colors based on message type and theme
  const getMessageColors = () => {
    if (isOwnMessage) {
      // Own messages: use specific colors for good contrast
      return {
        backgroundColor: theme.isDark ? '#0A84FF' : '#007AFF', // Different blue shades for each mode
        textColor: '#FFFFFF', // Always white on blue background
      };
    } else {
      // Other messages: use surface color for background, appropriate text color
      return {
        backgroundColor: theme.isDark ? '#2A2A2A' : '#E5E7EB',
        textColor: theme.isDark ? '#FFFFFF' : '#000000', // White on dark, black on light
      };
    }
  };

  const messageColors = getMessageColors();
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePress = () => {
    if (onReply) {
      onReply(message);
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(message);
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage
          ? styles.ownMessageContainer
          : styles.otherMessageContainer,
      ]}
    >
      <TouchableOpacity
        style={[
          styles.bubble,
          isOwnMessage
            ? [
                styles.ownBubble,
                { backgroundColor: messageColors.backgroundColor },
              ]
            : [
                styles.otherBubble,
                { backgroundColor: messageColors.backgroundColor },
              ],
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        activeOpacity={0.8}
      >
        {message.replyTo && (
          <View
            style={[
              styles.replyContainer,
              {
                backgroundColor: isOwnMessage
                  ? 'rgba(255,255,255,0.2)'
                  : theme.colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.replyIndicator,
                {
                  backgroundColor: isOwnMessage
                    ? '#FFFFFF'
                    : theme.colors.primary || '#007AFF',
                },
              ]}
            />
            <Text
              style={[
                styles.replyText,
                {
                  color: messageColors.textColor,
                },
              ]}
              numberOfLines={2}
            >
              Respondendo a mensagem anterior...
            </Text>
          </View>
        )}

        <Text
          style={[
            styles.messageText,
            {
              color: messageColors.textColor,
            },
          ]}
        >
          {message.text}
        </Text>

        <View style={styles.messageInfo}>
          <Text
            style={[
              styles.timeText,
              {
                color: isOwnMessage
                  ? 'rgba(255,255,255,0.7)'
                  : theme.isDark
                  ? 'rgba(255,255,255,0.6)'
                  : 'rgba(0,0,0,0.6)',
              },
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>

          {isOwnMessage && (
            <View style={styles.statusContainer}>
              <Text
                style={[
                  styles.statusIcon,
                  {
                    color: message.isRead ? '#34C759' : 'rgba(255,255,255,0.7)',
                  },
                ]}
              >
                {message.isRead ? '✓✓' : '✓'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 16,
  },
  ownMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    minWidth: '30%',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    padding: 6,
    borderRadius: 8,
  },
  replyIndicator: {
    width: 3,
    height: '100%',
    borderRadius: 1.5,
    marginRight: 8,
  },
  replyText: {
    fontSize: 12,
    flex: 1,
    fontStyle: 'italic',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 2,
  },
  timeText: {
    fontSize: 11,
    fontWeight: '400',
  },
  statusContainer: {
    marginLeft: 4,
  },
  statusIcon: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
