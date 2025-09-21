import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

export function RegisterScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const { register, loading } = useAppContext();

  const handleRegister = async () => {
    if (!isFormValid) {
      return;
    }

    const success = await register(
      formData.email.trim(),
      formData.password,
      formData.name.trim(),
    );

    if (success) {
      // Registration successful and user is now logged in
      // Navigation will be handled automatically by the auth state change
      // No need to navigate manually as the app will detect the user is logged in
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    formData.name.trim().length >= 2 &&
    formData.email.trim().length > 0 &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0)
      return { strength: 0, text: '', color: '#E5E7EB' };
    if (password.length < 6)
      return { strength: 1, text: 'Fraca', color: '#EF4444' };
    if (password.length < 8)
      return { strength: 2, text: 'Média', color: '#F59E0B' };
    if (
      password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    ) {
      return { strength: 3, text: 'Forte', color: '#10B981' };
    }
    return { strength: 2, text: 'Boa', color: '#3B82F6' };
  };

  const passwordStrength = getPasswordStrength();

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

          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>P</Text>
            </View>
          </View>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Criar conta
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Preencha os dados para criar sua conta
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Name Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Nome completo
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
                placeholder="Digite seu nome completo"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.name}
                onChangeText={value => updateFormData('name', value)}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
            {formData.name.length > 0 && formData.name.trim().length < 2 && (
              <Text style={styles.errorText}>
                Nome deve ter pelo menos 2 caracteres
              </Text>
            )}
          </View>

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
                value={formData.email}
                onChangeText={value => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {formData.email.length > 0 &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && (
                <Text style={styles.errorText}>Digite um email válido</Text>
              )}
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Senha
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
                placeholder="Digite sua senha"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.password}
                onChangeText={value => updateFormData('password', value)}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <Text style={styles.passwordToggleText}>
                  {isPasswordVisible ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {formData.password.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  <View
                    style={[
                      styles.passwordStrengthFill,
                      {
                        width: `${(passwordStrength.strength / 3) * 100}%`,
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.passwordStrengthText,
                    { color: passwordStrength.color },
                  ]}
                >
                  {passwordStrength.text}
                </Text>
              </View>
            )}

            {formData.password.length > 0 && formData.password.length < 6 && (
              <Text style={styles.errorText}>
                Senha deve ter pelo menos 6 caracteres
              </Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Confirmar senha
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
                placeholder="Confirme sua senha"
                placeholderTextColor={theme.colors.textSecondary}
                value={formData.confirmPassword}
                onChangeText={value => updateFormData('confirmPassword', value)}
                secureTextEntry={!isConfirmPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() =>
                  setConfirmPasswordVisible(!isConfirmPasswordVisible)
                }
              >
                <Text style={styles.passwordToggleText}>
                  {isConfirmPasswordVisible ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {formData.confirmPassword.length > 0 &&
              formData.password !== formData.confirmPassword && (
                <Text style={styles.errorText}>Senhas não coincidem</Text>
              )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              (!isFormValid || loading.isLoading) &&
                styles.registerButtonDisabled,
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || loading.isLoading}
          >
            <Text style={styles.registerButtonText}>
              {loading.isLoading ? 'Criando conta...' : 'Criar conta'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text
              style={[styles.loginText, { color: theme.colors.textSecondary }]}
            >
              Já tem uma conta?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>
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
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
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
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  passwordToggleText: {
    fontSize: 20,
  },
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  passwordStrengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 12,
  },
  passwordStrengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  passwordStrengthText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 40,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  registerButton: {
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
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6B7280',
  },
  socialButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
    marginTop: 32,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
});
