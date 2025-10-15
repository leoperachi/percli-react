import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ChatMessage } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useChatContext } from '../../contexts/ChatContext';

interface MessageInputProps {
  replyingTo?: ChatMessage | null;
  onCancelReply?: () => void;
}

export function MessageInput({ replyingTo, onCancelReply }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const { theme } = useTheme();
  const { sendMessage, currentChat } = useChatContext();

  const handleSend = async () => {
    if (!message.trim() || !currentChat || isSending) return;

    const receiverId = currentChat.participants[0]?.id;
    if (!receiverId) {
      Alert.alert('Erro', 'Não foi possível identificar o destinatário');
      return;
    }

    try {
      setIsSending(true);
      await sendMessage(message.trim(), receiverId, replyingTo?.id);
      setMessage('');
      if (onCancelReply) {
        onCancelReply();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar a mensagem');
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachment = () => {
    Alert.alert('Anexar arquivo', 'Escolha uma opção', [
      { text: 'Câmera', onPress: () => {} },
      { text: 'Galeria', onPress: () => {} },
      { text: 'Documento', onPress: () => {} },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const canSend = message.trim().length > 0 && !isSending;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        {replyingTo && (
          <View
            style={[
              styles.replyContainer,
              {
                backgroundColor: theme.colors.surface,
                borderLeftColor: theme.colors.primary || '#007AFF',
              },
            ]}
          >
            <View style={styles.replyContent}>
              <Text
                style={[
                  styles.replyTitle,
                  { color: theme.colors.primary || '#007AFF' },
                ]}
              >
                Respondendo
              </Text>
              <Text
                style={[
                  styles.replyText,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={2}
              >
                {replyingTo.text}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.cancelReplyButton}
              onPress={onCancelReply}
            >
              <Text
                style={[
                  styles.cancelReplyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                ✕
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={[
              styles.attachButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={handleAttachment}
          >
            <Text
              style={[styles.attachIcon, { color: theme.colors.textSecondary }]}
            >
              📎
            </Text>
          </TouchableOpacity>

          <View
            style={[
              styles.textInputContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <TextInput
              ref={textInputRef}
              style={[styles.textInput, { color: theme.colors.text }]}
              value={message}
              onChangeText={setMessage}
              placeholder="Digite sua mensagem..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              maxLength={1000}
              scrollEnabled
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: canSend
                  ? theme.colors.primary || '#007AFF'
                  : theme.colors.border,
              },
            ]}
            onPress={handleSend}
            disabled={!canSend}
          >
            <Text
              style={[
                styles.sendIcon,
                { color: canSend ? '#FFFFFF' : theme.colors.textSecondary },
              ]}
            >
              {isSending ? '⏳' : '➤'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? -26 : -18,
  },
  replyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  replyContent: {
    flex: 1,
  },
  replyTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 14,
    lineHeight: 18,
  },
  cancelReplyButton: {
    padding: 4,
    marginLeft: 8,
  },
  cancelReplyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  attachIcon: {
    fontSize: 16,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 90,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    minHeight: 10,
    maxHeight: 70,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
