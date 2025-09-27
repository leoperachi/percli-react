// Exemplo de uso do componente IconButton
import React from 'react';
import { View, Alert } from 'react-native';
import { IconButton } from './IconButton';

export const IconButtonExample: React.FC = () => {
  const handleSubmit = () => {
    Alert.alert('Submit', 'Formulário enviado!');
  };

  const handleRedirect = () => {
    Alert.alert('Redirect', 'Redirecionando...');
  };

  const handleButtonPress = () => {
    Alert.alert('Button', 'Botão pressionado!');
  };

  return (
    <View style={{ padding: 20, flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
      {/* Botão de Submit */}
      <IconButton
        iconName="check"
        iconLibrary="MaterialIcons"
        type="submit"
        onSubmit={handleSubmit}
        backgroundColor="#4CAF50"
        size={56}
      />

      {/* Botão de Redirect */}
      <IconButton
        iconName="arrow-forward"
        iconLibrary="MaterialIcons"
        type="redirect"
        onRedirect={handleRedirect}
        backgroundColor="#2196F3"
        size={56}
      />

      {/* Botão comum */}
      <IconButton
        iconName="favorite"
        iconLibrary="MaterialIcons"
        type="button"
        onPress={handleButtonPress}
        backgroundColor="#E91E63"
        size={56}
      />

      {/* Botão com ícone do FontAwesome */}
      <IconButton
        iconName="heart"
        iconLibrary="FontAwesome"
        type="button"
        onPress={handleButtonPress}
        backgroundColor="#FF5722"
        size={48}
      />

      {/* Botão com ícone do Ionicons */}
      <IconButton
        iconName="settings"
        iconLibrary="Ionicons"
        type="button"
        onPress={handleButtonPress}
        backgroundColor="#9C27B0"
        size={48}
      />

      {/* Botão desabilitado */}
      <IconButton
        iconName="block"
        iconLibrary="MaterialIcons"
        type="button"
        onPress={handleButtonPress}
        disabled={true}
        size={48}
      />

      {/* Botão pequeno */}
      <IconButton
        iconName="add"
        iconLibrary="MaterialIcons"
        type="button"
        onPress={handleButtonPress}
        backgroundColor="#009688"
        size={32}
      />

      {/* Botão grande */}
      <IconButton
        iconName="delete"
        iconLibrary="MaterialIcons"
        type="button"
        onPress={handleButtonPress}
        backgroundColor="#F44336"
        size={64}
      />
    </View>
  );
};