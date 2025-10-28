import type { NavigationProp } from '@react-navigation/native';

/**
 * Navega de volta de forma segura, evitando o erro "GO_BACK was not handled"
 * Se não puder voltar, navega para a tela especificada ou Home
 */
export const safeGoBack = (
  navigation: NavigationProp<any>,
  fallbackScreen: string = 'Home'
) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
  } else {
    navigation.navigate(fallbackScreen as never);
  }
};
