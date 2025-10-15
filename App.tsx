/**
 * PerCLI React Native App
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { ChatProvider } from './src/contexts/ChatContext';
import { UsersProvider } from './src/contexts/UsersContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { LoadingOverlay } from './src/components/LoadingOverlay';
import { MessageToast } from './src/components/MessageToast';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
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
  );
}

export default App;
