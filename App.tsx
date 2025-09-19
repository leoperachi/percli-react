/**
 * PerCLI React Native App
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingOverlay } from './src/components/LoadingOverlay';
import { MessageToast } from './src/components/MessageToast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#FFFFFF"
      />
      <AppProvider>
        <AppNavigator />
        <LoadingOverlay />
        <MessageToast />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
