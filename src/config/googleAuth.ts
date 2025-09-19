// Google Authentication Configuration
export const GOOGLE_CONFIG = {
  // Você deve configurar estes valores no Google Cloud Console
  // Para desenvolvimento, use o Web Client ID
  WEB_CLIENT_ID:
    '674016886269-5nfi6q09tqf53abs82s17jmdt7m46ith.apps.googleusercontent.com',

  // Para iOS, use o iOS Client ID (opcional se usar apenas web client id)
  IOS_CLIENT_ID:
    '674016886269-0umag0tlt1pegve9jeq7grdpv7s5ukp2.apps.googleusercontent.com',

  // Scopes que queremos solicitar do usuário
  SCOPES: ['openid', 'profile', 'email'],

  // Configurações adicionais
  OFFLINE_ACCESS: true, // Para obter refresh token
  HOSTED_DOMAIN: '', // Deixe vazio para permitir qualquer domínio
  FORCE_CODE_FOR_REFRESH_TOKEN: true, // Importante para Authorization Code Flow
};

// Tipos para as respostas do Google
export interface GoogleUser {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

export interface GoogleAuthResult {
  type: 'success' | 'cancelled';
  user?: GoogleUser;
  serverAuthCode?: string; // Este é o Authorization Code que enviaremos para o backend
  idToken?: string;
  accessToken?: string;
}
