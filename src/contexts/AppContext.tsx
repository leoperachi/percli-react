import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { AppContextType, User, LoadingState, MessageState } from '../types';
import apiService from '../services/apiService';
import googleAuthService from '../services/googleAuthService';
import { socketService } from '../services/socketService';

interface AppState {
  user: User | null;
  loading: LoadingState;
  message: MessageState;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: LoadingState }
  | { type: 'SET_MESSAGE'; payload: MessageState }
  | { type: 'HIDE_MESSAGE' }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  loading: { isLoading: false },
  message: { type: 'info', message: '', visible: false },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_MESSAGE':
      return { ...state, message: action.payload };
    case 'HIDE_MESSAGE':
      return {
        ...state,
        message: { ...state.message, visible: false }
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        loading: { isLoading: false },
        message: { type: 'info', message: '', visible: false }
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app services (but don't auto-login)
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Configure Google Sign-In
        googleAuthService.configure();

        // Clear any existing auth data to ensure clean start
        await apiService.logout();
      } catch (error) {
      }
    };

    initializeApp();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Fazendo login...' }
      });

      const response = await apiService.login(email, password);

      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: 'Login realizado com sucesso!',
            visible: true
          }
        });
        return true;
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: response.error || 'Erro ao fazer login',
            visible: true
          }
        });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro de conexão';
      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: errorMessage,
          visible: true
        }
      });
      return false;
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Criando conta...' }
      });

      const response = await apiService.register(email, password, name);

      if (response.success && response.data) {
        // Registration successful - check if backend returned user data for auto-login
        if (response.data.user) {
          // Backend returned user data, set user directly (auto-login)
          dispatch({ type: 'SET_USER', payload: response.data.user });
          dispatch({
            type: 'SET_MESSAGE',
            payload: {
              type: 'success',
              message: 'Conta criada e login realizado com sucesso!',
              visible: true
            }
          });
          return true;
        } else {
          // Backend didn't return user data, attempt manual login
          dispatch({
            type: 'SET_LOADING',
            payload: { isLoading: true, message: 'Fazendo login automático...' }
          });
          const loginResponse = await apiService.login(email, password);

          if (loginResponse.success && loginResponse.data) {
            // Auto-login successful
            dispatch({ type: 'SET_USER', payload: loginResponse.data.user });
            dispatch({
              type: 'SET_MESSAGE',
              payload: {
                type: 'success',
                message: 'Conta criada e login realizado com sucesso!',
                visible: true
              }
            });
            return true;
          } else {
            // Registration succeeded but auto-login failed
            dispatch({
              type: 'SET_MESSAGE',
              payload: {
                type: 'success',
                message: 'Conta criada com sucesso! Faça login para continuar.',
                visible: true
              }
            });
            return true; // Still return true because registration succeeded
          }
        }
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: response.error || 'Erro ao criar conta',
            visible: true
          }
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: 'Erro de conexão com o servidor',
          visible: true
        }
      });
      return false;
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Alterando senha...' }
      });

      const response = await apiService.changePassword(currentPassword, newPassword);

      if (response.success) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: 'Senha alterada com sucesso!',
            visible: true
          }
        });
        return true;
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: response.error || 'Erro ao alterar senha',
            visible: true
          }
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: 'Erro de conexão com o servidor',
          visible: true
        }
      });
      return false;
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Enviando email de recuperação...' }
      });

      const response = await apiService.forgotPassword(email);

      if (response.success) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: 'Email de recuperação enviado com sucesso!',
            visible: true
          }
        });
        return true;
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: response.error || 'Erro ao enviar email de recuperação',
            visible: true
          }
        });
        return false;
      }
    } catch (error) {
      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: 'Erro de conexão com o servidor',
          visible: true
        }
      });
      return false;
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  const logout = async () => {
    try {
      // Disconnect socket before clearing user data
      socketService.disconnect();

      // Call logout API and clear secure storage
      await apiService.logout();
      dispatch({ type: 'LOGOUT' });
      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'info',
          message: 'Logout realizado com sucesso!',
          visible: true
        }
      });
    } catch (error) {
      // Even if logout API fails, clear local data and disconnect socket
      socketService.disconnect();
      dispatch({ type: 'LOGOUT' });
      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'info',
          message: 'Logout realizado com sucesso!',
          visible: true
        }
      });
    }
  };

  const setLoading = (loading: LoadingState) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const showMessage = (type: MessageState['type'], message: string) => {
    dispatch({
      type: 'SET_MESSAGE',
      payload: { type, message, visible: true }
    });
  };

  const hideMessage = () => {
    dispatch({ type: 'HIDE_MESSAGE' });
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Fazendo login com Google...' }
      });

      // Faz o sign in com Google e obtém o authorization code
      const googleResult = await googleAuthService.signIn();
      if (googleResult.type === 'cancelled') {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'info',
            message: 'Login cancelado pelo usuário',
            visible: true
          }
        });
        return false;
      }

      if (!googleResult.serverAuthCode) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: `❌ AUTHORIZATION CODE NÃO RECEBIDO\n\nIsso é necessário para o Authorization Code Flow.\n\nPossíveis causas:\n• Web Client ID incorreto\n• Configuração OAuth mal configurada\n• offlineAccess não funcionando\n\nDetalhes do resultado:\n${JSON.stringify(googleResult, null, 2)}`,
            visible: true
          }
        });
        return false;
      }

      // Envia o authorization code para o backend
      const response = await apiService.googleAuth(googleResult.serverAuthCode);

      if (response.success && response.data) {
        dispatch({ type: 'SET_USER', payload: response.data.user });
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: 'Login com Google realizado com sucesso!',
            visible: true
          }
        });
        return true;
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: response.error || 'Erro ao fazer login com Google',
            visible: true
          }
        });
        return false;
      }
    } catch (error) {
      let errorMessage = 'Erro de conexão';
      if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
        if (error.stack) {
          errorMessage += `\n\nStack: ${error.stack.substring(0, 300)}...`;
        }
      } else {
        errorMessage = `Erro desconhecido: ${JSON.stringify(error, null, 2)}`;
      }

      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: errorMessage,
          visible: true
        }
      });
      return false;
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  // Test exact Postman request
  const testPostmanRequest = async () => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Testando requisição igual ao Postman...' }
      });

      const result = await apiService.testPostmanLogin();

      if (result.success) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: `🎯 TESTE POSTMAN SUCESSO!\n\nStatus: ${result.status}\n\nResposta:\n${JSON.stringify(result.data, null, 2)}`,
            visible: true
          }
        });
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: `🎯 TESTE POSTMAN FALHOU!\n\nErro: ${result.error}\n\nURL: ${result.url}\n\nPayload: ${JSON.stringify(result.payload, null, 2)}`,
            visible: true
          }
        });
      }
    } catch (error) {
      let errorDetails = 'ERRO NO TESTE POSTMAN:\n\n';

      if (error instanceof Error) {
        errorDetails += `Tipo: ${error.constructor.name}\n`;
        errorDetails += `Mensagem: ${error.message}\n`;
        if (error.stack) {
          errorDetails += `Stack: ${error.stack.substring(0, 500)}...\n`;
        }
      } else {
        errorDetails += `Erro: ${JSON.stringify(error, null, 2)}`;
      }

      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: errorDetails,
          visible: true
        }
      });
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  // Test connection function for debugging
  const testConnection = async () => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Executando testes de conectividade...' }
      });

      const result = await apiService.testConnection();

      if (result.success) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: `🔧 TESTE DE CONECTIVIDADE:\n\n${result.summary}\n\n=== DETALHES COMPLETOS ===\n${JSON.stringify(result.fullResults, null, 2)}`,
            visible: true
          }
        });
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: `🔧 TESTE DE CONECTIVIDADE (FALHOU):\n\n${result.summary}\n\n=== DETALHES COMPLETOS ===\n${JSON.stringify(result.fullResults, null, 2)}`,
            visible: true
          }
        });
      }
    } catch (error) {
      let errorDetails = 'ERRO CRÍTICO NO TESTE:\n\n';

      if (error instanceof Error) {
        errorDetails += `Tipo: ${error.constructor.name}\n`;
        errorDetails += `Mensagem: ${error.message}\n`;
        if (error.stack) {
          errorDetails += `Stack: ${error.stack.substring(0, 500)}...\n`;
        }
      } else {
        errorDetails += `Erro: ${JSON.stringify(error, null, 2)}`;
      }

      dispatch({
        type: 'SET_MESSAGE',
        payload: {
          type: 'error',
          message: errorDetails,
          visible: true
        }
      });
    } finally {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: false }
      });
    }
  };

  // Update user data in context
  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      dispatch({ type: 'SET_USER', payload: updatedUser });
    }
  };

  const value: AppContextType = {
    user: state.user,
    loading: state.loading,
    message: state.message,
    login,
    register,
    changePassword,
    forgotPassword,
    logout,
    updateUser,
    setLoading,
    showMessage,
    hideMessage,
    loginWithGoogle,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}