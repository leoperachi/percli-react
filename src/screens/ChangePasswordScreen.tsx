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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../contexts/AppContext';

export function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { changePassword, loading } = useAppContext();

  const handleChangePassword = async () => {
    if (!isFormValid) {
      return;
    }

    const success = await changePassword(
      formData.currentPassword,
      formData.newPassword
    );

    if (success) {
      Alert.alert(
        'Senha alterada!',
        'Sua senha foi alterada com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const isFormValid =
    formData.currentPassword.length > 0 &&
    formData.newPassword.length >= 6 &&
    formData.newPassword === formData.confirmPassword &&
    formData.currentPassword !== formData.newPassword;

  const getPasswordStrength = () => {
    const { newPassword } = formData;
    if (newPassword.length === 0) return { strength: 0, text: '', color: '#E5E7EB' };
    if (newPassword.length < 6) return { strength: 1, text: 'Fraca', color: '#EF4444' };
    if (newPassword.length < 8) return { strength: 2, text: 'Média', color: '#F59E0B' };
    if (newPassword.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      return { strength: 3, text: 'Forte', color: '#10B981' };
    }
    return { strength: 2, text: 'Boa', color: '#3B82F6' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.container}
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
              <Text style={styles.iconText}>🔒</Text>
            </View>
          </View>
          <Text style={styles.title}>Alterar senha</Text>
          <Text style={styles.subtitle}>
            Digite sua senha atual e escolha uma nova senha
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          {/* Current Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha atual</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha atual"
                placeholderTextColor="#9CA3AF"
                value={formData.currentPassword}
                onChangeText={(value) => updateFormData('currentPassword', value)}
                secureTextEntry={!showPasswords.current}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => togglePasswordVisibility('current')}
              >
                <Text style={styles.passwordToggleText}>
                  {showPasswords.current ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {formData.currentPassword.length > 0 && formData.currentPassword.length < 6 && (
              <Text style={styles.errorText}>Senha atual é obrigatória</Text>
            )}
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nova senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Digite sua nova senha"
                placeholderTextColor="#9CA3AF"
                value={formData.newPassword}
                onChangeText={(value) => updateFormData('newPassword', value)}
                secureTextEntry={!showPasswords.new}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => togglePasswordVisibility('new')}
              >
                <Text style={styles.passwordToggleText}>
                  {showPasswords.new ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Password Strength Indicator */}
            {formData.newPassword.length > 0 && (
              <View style={styles.passwordStrengthContainer}>
                <View style={styles.passwordStrengthBar}>
                  <View
                    style={[
                      styles.passwordStrengthFill,
                      {
                        width: `${(passwordStrength.strength / 3) * 100}%`,
                        backgroundColor: passwordStrength.color
                      }
                    ]}
                  />
                </View>
                <Text style={[styles.passwordStrengthText, { color: passwordStrength.color }]}>
                  {passwordStrength.text}
                </Text>
              </View>
            )}

            {formData.newPassword.length > 0 && formData.newPassword.length < 6 && (
              <Text style={styles.errorText}>Nova senha deve ter pelo menos 6 caracteres</Text>
            )}

            {formData.currentPassword.length > 0 && formData.newPassword.length > 0 &&
             formData.currentPassword === formData.newPassword && (
              <Text style={styles.errorText}>A nova senha deve ser diferente da atual</Text>
            )}
          </View>

          {/* Confirm New Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar nova senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirme sua nova senha"
                placeholderTextColor="#9CA3AF"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                secureTextEntry={!showPasswords.confirm}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => togglePasswordVisibility('confirm')}
              >
                <Text style={styles.passwordToggleText}>
                  {showPasswords.confirm ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
            {formData.confirmPassword.length > 0 && formData.newPassword !== formData.confirmPassword && (
              <Text style={styles.errorText}>As senhas não coincidem</Text>
            )}
          </View>

          {/* Security Tips */}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Dicas de segurança:</Text>
            <Text style={styles.tipText}>• Use pelo menos 8 caracteres</Text>
            <Text style={styles.tipText}>• Combine letras maiúsculas e minúsculas</Text>
            <Text style={styles.tipText}>• Inclua números e símbolos</Text>
            <Text style={styles.tipText}>• Evite informações pessoais</Text>
          </View>

          {/* Change Password Button */}
          <TouchableOpacity
            style={[
              styles.changePasswordButton,
              (!isFormValid || loading.isLoading) && styles.changePasswordButtonDisabled,
            ]}
            onPress={handleChangePassword}
            disabled={!isFormValid || loading.isLoading}
          >
            <Text style={styles.changePasswordButtonText}>
              {loading.isLoading ? 'Alterando senha...' : 'Alterar senha'}
            </Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={loading.isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F59E0B',
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
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
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
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
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
  tipsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 18,
    marginBottom: 2,
  },
  changePasswordButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 16,
  },
  changePasswordButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
    elevation: 0,
  },
  changePasswordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
  },
});