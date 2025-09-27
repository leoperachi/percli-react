/** biome-ignore-all assist/source/organizeImports: explanation */
import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

interface ProfilePhotoProps {
  imageBase64?: string | null;
  userName?: string;
  size?: number;
  style?: object;
  showDefaultImage?: boolean;
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  imageBase64,
  userName = 'User',
  size = 40,
  style,
  showDefaultImage = true,
}) => {

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Priority 1: Base64 image from backend
  if (imageBase64) {
    return (
      <Image
        source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
        resizeMode="cover"
      />
    );
  }

  // Priority 2: Default user.png image
  if (showDefaultImage) {
    return (
      <Image
        source={require('../assets/images/illustrations/user.png')}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
          style,
        ]}
        resizeMode="cover"
      />
    );
  }

  // Priority 3: Fallback to initials with fixed background color
  return (
    <View
      style={[
        styles.defaultContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#6366F1', // Fixed color instead of theme.colors.primary
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.initials,
          {
            fontSize: size * 0.4,
            color: '#FFFFFF',
          },
        ]}
      >
        {getInitials(userName)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
  defaultContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
