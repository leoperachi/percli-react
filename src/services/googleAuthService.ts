import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  GOOGLE_CONFIG,
  GoogleAuthResult,
  GoogleUser,
} from '../config/googleAuth';

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

    GoogleSignin.configure(config);

    this.isConfigured = true;
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

      // Verifica se temos as informações necessárias
      if (!userInfo) {
        throw new Error('UserInfo é null/undefined');
      }

      // A estrutura real parece ser { type, data } ao invés de { user }
      const userData = (userInfo as any).user || (userInfo as any).data;
      if (!userData) {
        throw new Error(
          `UserInfo.user/data é null/undefined. UserInfo keys: ${Object.keys(
            userInfo,
          ).join(', ')}`,
        );
      }

      const user = userData;

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
        serverAuthCode: (userInfo as any).serverAuthCode || undefined,
        idToken: (userInfo as any).idToken || undefined,
      };

      return result;
    } catch (error: any) {
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
      // Silently handle error
    }
  }

  /**
   * Revoga o acesso do usuário
   */
  async revokeAccess(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
    } catch (error) {
      // Silently handle error
    }
  }

  /**
   * Verifica se o usuário está logado
   */
  async isSignedIn(): Promise<boolean> {
    try {
      return await (GoogleSignin as any).isSignedIn();
    } catch (error) {
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

      const user = (userInfo as any).user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        familyName: user.familyName,
        givenName: user.givenName,
      };
    } catch (error) {
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

      const user = (userInfo as any).user;
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        familyName: user.familyName,
        givenName: user.givenName,
      };
    } catch (error) {
      return null;
    }
  }
}

export default new GoogleAuthService();
