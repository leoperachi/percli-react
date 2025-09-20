import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Colors {
  // Background colors
  background: string;
  surface: string;
  card: string;

  // Text colors
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;

  // UI colors
  border: string;
  shadow: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Special colors
  accent: string;
  highlight: string;
}

export interface Theme {
  colors: Colors;
  isDark: boolean;
}

const lightTheme: Theme = {
  isDark: false,
  colors: {
    // Background colors
    background: '#FFFFFF',
    surface: '#F9FAFB',
    card: '#FFFFFF',

    // Text colors
    primary: '#333333',
    secondary: '#666666',
    text: '#333333',
    textSecondary: '#666666',

    // UI colors
    border: '#F3F4F6',
    shadow: 'rgba(0, 0, 0, 0.1)',

    // Status colors
    success: '#059669',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#3B82F6',

    // Special colors
    accent: '#6B46C1',
    highlight: '#EC4899',
  },
};

const darkTheme: Theme = {
  isDark: true,
  colors: {
    // Background colors
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2A2A2A',

    // Text colors
    primary: '#FFFFFF',
    secondary: '#B3B3B3',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3',

    // UI colors
    border: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',

    // Status colors
    success: '#10B981',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#60A5FA',

    // Special colors
    accent: '#8B5CF6',
    highlight: '#F472B6',
  },
};

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(darkMode));
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveThemePreference(newTheme);
  };

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode);
    saveThemePreference(darkMode);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
