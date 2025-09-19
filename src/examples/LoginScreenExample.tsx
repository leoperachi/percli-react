import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { authService, networkService } from '../services';
import { LoginRequest } from '../types';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Monitorar conectividade de rede
    const unsubscribe = networkService.subscribeToNetworkChanges(connected => {
      setIsConnected(connected);
      if (!connected) {
        Alert.alert(
          'Sem Conexão',
          'Verifique sua conexão com a internet e tente novamente.',
        );
      }
    });

    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isConnected) {
      Alert.alert('Erro', 'Sem conexão com a internet.');
      return;
    }

    setLoading(true);

    try {
      const loginData: LoginRequest = {
        email: email.trim(),
        password: password.trim(),
      };

      const response = await authService.login(loginData);

      Alert.alert('Sucesso', `Bem-vindo, ${response.user.name}!`, [
        {
          text: 'OK',
          onPress: () => {
            // Navegar para a tela principal
            // navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Erro no Login',
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (!isConnected) {
      Alert.alert('Erro', 'Sem conexão com a internet.');
      return;
    }

    setLoading(true);

    try {
      const registerData = {
        email: email.trim(),
        password: password.trim(),
        name: 'Usuário', // Você pode adicionar um campo de nome
      };

      const response = await authService.register(registerData);

      Alert.alert(
        'Sucesso',
        `Conta criada com sucesso! Bem-vindo, ${response.user.name}!`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navegar para a tela principal
              // navigation.navigate('Home');
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        'Erro no Registro',
        error instanceof Error ? error.message : 'Erro desconhecido',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Indicador de conectividade */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: isConnected ? '#4CAF50' : '#F44336' },
        ]}
      >
        <Text style={styles.statusText}>
          {isConnected ? 'Conectado' : 'Sem Conexão'}
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading || !isConnected}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading || !isConnected}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Criar Conta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  statusBar: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 20,
  },
  statusText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
});

export default LoginScreen;
