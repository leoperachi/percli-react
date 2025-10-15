import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

export function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'success'>('email');
  const { forgotPassword, loading } = useAppContext();

  const handleForgotPassword = async () => {
    if (!isEmailValid) {
      return;
    }

    const success = await forgotPassword(email.trim());

    if (success) {
      setStep('success');
    }
  };

  const handleBackToLogin = () => {
    navigation.goBack();
  };

  const isEmailValid =
    email.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  if (step === 'success') {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <View style={styles.successIcon}>
                <Text style={styles.iconText}>✅</Text>
              </View>
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Email enviado!
            </Text>
            <Text
              style={[styles.subtitle, { color: theme.colors.textSecondary }]}
            >
              Enviamos um link de recuperação para {email}
            </Text>
          </View>

          {/* Instructions */}
          <View
            style={[
              styles.instructionsContainer,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
            ]}
          >
            <Text
              style={[styles.instructionsTitle, { color: theme.colors.text }]}
            >
              Próximos passos:
            </Text>
            <Text
              style={[
                styles.instructionText,
                { color: theme.colors.textSecondary },
              ]}
            >
              1. Verifique sua caixa de entrada
            </Text>
            <Text
              style={[
                styles.instructionText,
                { color: theme.colors.textSecondary },
              ]}
            >
              2. Clique no link de recuperação
            </Text>
            <Text
              style={[
                styles.instructionText,
                { color: theme.colors.textSecondary },
              ]}
            >
              3. Defina uma nova senha
            </Text>
            <Text
              style={[
                styles.instructionText,
                { color: theme.colors.textSecondary },
              ]}
            >
              4. Faça login com a nova senha
            </Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleBackToLogin}
            >
              <Text style={styles.primaryButtonText}>Voltar ao login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => setStep('email')}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Enviar novamente
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.icon}>
              <Text style={styles.iconText}>🔑</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Esqueceu sua senha?
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Digite seu email e enviaremos um link para redefinir sua senha
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Email
            </Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                  },
                ]}
                placeholder="Digite seu email"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoFocus
              />
            </View>
            {email.length > 0 && !isEmailValid && (
              <Text style={styles.errorText}>Digite um email válido</Text>
            )}
          </View>

          {/* Info Box */}
          <View
            style={[
              styles.infoContainer,
              {
                backgroundColor: theme.isDark
                  ? theme.colors.surface
                  : '#F0FDF4',
                borderLeftColor: theme.colors.success,
              },
            ]}
          >
            <Text style={[styles.infoTitle, { color: theme.colors.success }]}>
              💡 Dica importante
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.success }]}>
              Verifique sua caixa de spam se não receber o email em alguns
              minutos.
            </Text>
          </View>

          {/* Send Email Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!isEmailValid || loading.isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleForgotPassword}
            disabled={!isEmailValid || loading.isLoading}
          >
            <Text style={styles.sendButtonText}>
              {loading.isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
            </Text>
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={handleBackToLogin}
            disabled={loading.isLoading}
          >
            <Text
              style={[
                styles.backToLoginText,
                { color: theme.colors.textSecondary },
              ]}
            >
              Lembrou da senha?{' '}
              <Text style={styles.loginLink}>Fazer login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6366F1',
    fontWeight: '500',
  },
  iconContainer: {
    marginBottom: 24,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconText: {
    fontSize: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  infoContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 24,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  backToLoginButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToLoginText: {
    fontSize: 14,
  },
  loginLink: {
    color: '#6366F1',
    fontWeight: '600',
  },
  instructionsContainer: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
