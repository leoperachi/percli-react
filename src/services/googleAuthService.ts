import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_CONFIG, GoogleAuthResult, GoogleUser } from '../config/googleAuth';

class GoogleAuthService {
  private isConfigured = false;

  /**
   * Configura o Google Sign-In
   * Deve ser chamado na inicialização do app
   */
  configure() {
    if (this.isConfigured) return;

    const config = {
      webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
      iosClientId: GOOGLE_CONFIG.IOS_CLIENT_ID,
      scopes: GOOGLE_CONFIG.SCOPES,
      // Configurações críticas para Authorization Code Flow
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      hostedDomain: GOOGLE_CONFIG.HOSTED_DOMAIN || '',
    };

    console.log('GoogleAuthService - Configuring with:', config);

    GoogleSignin.configure(config);

    this.isConfigured = true;
    console.log('GoogleAuthService - Configuration completed');
  }

  /**
   * Inicia o processo de login com Google
   * Retorna o Authorization Code para ser enviado ao backend
   */
  async signIn(): Promise<GoogleAuthResult> {
    try {
      // Certifica que está configurado
      this.configure();

      // Verifica se o Google Play Services está disponível (Android)
      await GoogleSignin.hasPlayServices();

      // Faz o sign in
      const userInfo = await GoogleSignin.signIn();

      console.log('GoogleAuthService - userInfo received:', JSON.stringify(userInfo, null, 2));

      // Verifica se temos as informações necessárias
      if (!userInfo) {
        throw new Error('UserInfo é null/undefined');
      }

      // A estrutura real parece ser { type, data } ao invés de { user }
      const userData = userInfo.user || userInfo.data;
      if (!userData) {
        throw new Error(`UserInfo.user/data é null/undefined. UserInfo keys: ${Object.keys(userInfo).join(', ')}`);
      }

      const user = userData;
      console.log('GoogleAuthService - user object:', JSON.stringify(user, null, 2));

      // Monta o objeto de retorno usando os campos corretos do log
      const result: GoogleAuthResult = {
        type: 'success',
        user: {
          id: user.id || '',
          name: user.name || null,
          email: user.email || '',
          photo: user.photo || null,
          familyName: user.familyName || null,
          givenName: user.givenName || null,
        },
        serverAuthCode: userInfo.serverAuthCode || undefined,
        idToken: userInfo.idToken || undefined,
      };

      console.log('GoogleAuthService - result prepared:', JSON.stringify(result, null, 2));

      return result;
    } catch (error: any) {
      console.error('GoogleAuthService - Error during sign in:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        return { type: 'cancelled' };
      } else if (error.code === statusCodes.IN_PROGRESS) {
        throw new Error('Login já está em andamento');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        throw new Error('Google Play Services não disponível');
      } else {
        throw new Error(`Erro no login Google: ${error.message}`);
      }
    }
  }

  /**
   * Faz logout do usuário
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('GoogleAuthService - Error during sign out:', error);
    }
  }

  /**
   * Revoga o acesso do usuário
   */
  async revokeAccess(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      console.error('GoogleAuthService - Error during revoke access:', error);
    }
  }

  /**
   * Verifica se o usuário está logado
   */
  async isSignedIn(): Promise<boolean> {
    try {
      return await GoogleSignin.isSignedIn();
    } catch (error) {
      console.error('GoogleAuthService - Error checking sign in status:', error);
      return false;
    }
  }

  /**
   * Obtém informações do usuário atual (se logado)
   */
  async getCurrentUser(): Promise<GoogleUser | null> {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      if (!userInfo) return null;

      return {
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email,
        photo: userInfo.user.photo,
        familyName: userInfo.user.familyName,
        givenName: userInfo.user.givenName,
      };
    } catch (error) {
      console.error('GoogleAuthService - Error getting current user:', error);
      return null;
    }
  }

  /**
   * Faz sign in silencioso (se o usuário já estiver logado)
   */
  async signInSilently(): Promise<GoogleUser | null> {
    try {
      this.configure();
      const userInfo = await GoogleSignin.signInSilently();

      return {
        id: userInfo.user.id,
        name: userInfo.user.name,
        email: userInfo.user.email,
        photo: userInfo.user.photo,
        familyName: userInfo.user.familyName,
        givenName: userInfo.user.givenName,
      };
    } catch (error) {
      console.error('GoogleAuthService - Error during silent sign in:', error);
      return null;
    }
  }
}

export default new GoogleAuthService();