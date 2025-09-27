import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TouchableOpacityProps,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../contexts/ThemeContext';

// Available icon libraries
type IconLibrary =
  | 'MaterialIcons'
  | 'MaterialCommunityIcons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Ionicons'
  | 'Feather'
  | 'AntDesign'
  | 'Entypo';

type ButtonType = 'submit' | 'redirect' | 'button';

interface IconButtonProps extends Omit<TouchableOpacityProps, 'onPress'> {
  iconName: string;
  iconLibrary?: IconLibrary;
  iconSize?: number;
  iconColor?: string;
  backgroundColor?: string;
  size?: number;
  type?: ButtonType;
  onPress?: (event: GestureResponderEvent) => void;
  onSubmit?: () => void;
  onRedirect?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  iconName,
  iconLibrary = 'MaterialIcons',
  iconSize,
  iconColor,
  backgroundColor,
  size = 48,
  type = 'button',
  onPress,
  onSubmit,
  onRedirect,
  style,
  disabled = false,
  ...touchableProps
}) => {
  const { theme } = useTheme();

  // Dynamic icon import based on library
  const getIconComponent = () => {
    switch (iconLibrary) {
      case 'MaterialIcons':
        return require('react-native-vector-icons/MaterialIcons').default;
      case 'MaterialCommunityIcons':
        return require('react-native-vector-icons/MaterialCommunityIcons').default;
      case 'FontAwesome':
        return require('react-native-vector-icons/FontAwesome').default;
      case 'FontAwesome5':
        return require('react-native-vector-icons/FontAwesome5').default;
      case 'Ionicons':
        return require('react-native-vector-icons/Ionicons').default;
      case 'Feather':
        return require('react-native-vector-icons/Feather').default;
      case 'AntDesign':
        return require('react-native-vector-icons/AntDesign').default;
      case 'Entypo':
        return require('react-native-vector-icons/Entypo').default;
      default:
        return require('react-native-vector-icons/MaterialIcons').default;
    }
  };

  const IconComponent = getIconComponent();

  // Handle press based on button type
  const handlePress = (event: GestureResponderEvent) => {
    if (disabled) return;

    switch (type) {
      case 'submit':
        onSubmit?.();
        break;
      case 'redirect':
        onRedirect?.();
        break;
      case 'button':
      default:
        onPress?.(event);
        break;
    }
  };

  // Default values based on theme and props
  const finalIconSize = iconSize || size * 0.5;
  const finalIconColor = iconColor || (disabled ? theme.colors.textSecondary : '#FFFFFF');
  const finalBackgroundColor = backgroundColor || (disabled ? theme.colors.border : theme.colors.primary);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: finalBackgroundColor,
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      {...touchableProps}
    >
      <IconComponent
        name={iconName}
        size={finalIconSize}
        color={finalIconColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});