/**
 * PerCLI React Native App
 * @format
 */

import React, { StrictMode, useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { UsersProvider } from './src/contexts/UsersContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingOverlay } from './src/components/LoadingOverlay';
import { MessageToast } from './src/components/MessageToast';
import { logger } from './src/services/loggerService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // Inicializa o logger quando o app inicia
  useEffect(() => {
    logger
      .initialize()
      .then(() => {
        console.log('[App] Logger inicializado com sucesso');
      })
      .catch(error => {
        console.error('Failed to initialize logger:', error);
      });
  }, []);

  return (
    <StrictMode>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="#FFFFFF"
          />
          <AppProvider>
            <UsersProvider>
              <ChatProvider>
                <AppNavigator />
                <LoadingOverlay />
                <MessageToast />
              </ChatProvider>
            </UsersProvider>
          </AppProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </StrictMode>
  );
}

export default App;
