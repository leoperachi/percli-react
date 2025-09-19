import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppContextType, User, LoadingState, MessageState } from '../types';

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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Fazendo login...' }
      });

      // Simulate API call
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch({ type: 'SET_USER', payload: data.data.user });
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
            message: data.message || 'Erro ao fazer login',
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

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      dispatch({
        type: 'SET_LOADING',
        payload: { isLoading: true, message: 'Criando conta...' }
      });

      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'success',
            message: 'Conta criada com sucesso! Faça login para continuar.',
            visible: true
          }
        });
        return true;
      } else {
        dispatch({
          type: 'SET_MESSAGE',
          payload: {
            type: 'error',
            message: data.message || 'Erro ao criar conta',
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

      const response = await fetch('http://localhost:3000/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: In a real app, you'd include the auth token here
          // 'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          // In a real app, you'd include user identification
          userId: state.user?.id
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
            message: data.message || 'Erro ao alterar senha',
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

      const response = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
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
            message: data.message || 'Erro ao enviar email de recuperação',
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

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    dispatch({
      type: 'SET_MESSAGE',
      payload: {
        type: 'info',
        message: 'Logout realizado com sucesso!',
        visible: true
      }
    });
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

  const value: AppContextType = {
    user: state.user,
    loading: state.loading,
    message: state.message,
    login,
    register,
    changePassword,
    forgotPassword,
    logout,
    setLoading,
    showMessage,
    hideMessage,
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