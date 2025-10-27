# Configuração do Google Authentication

Este documento descreve como configurar a autenticação Google com Authorization Code Flow no projeto.

## 1. Configuração no Google Cloud Console

### 1.1 Criar um projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API "Google+ API" ou "Google Identity Services API"

### 1.2 Configurar OAuth 2.0

1. Vá para "APIs & Services" > "Credentials"
2. Clique em "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure os seguintes tipos de aplicação:

#### Web Application (OBRIGATÓRIO para Authorization Code Flow)

- **Application Type**: Web application
- **Name**: Seu app name + " Web Client"
- **Authorized redirect URIs**:
  - `http://localhost:8085/auth/google/callback` (para desenvolvimento)
  - `https://your-domain.com/auth/google/callback` (para produção)

#### iOS Application (Opcional)

- **Application Type**: iOS
- **Name**: Seu app name + " iOS"
- **Bundle ID**: Deve corresponder ao bundle ID do seu app iOS

#### Android Application (Opcional)

- **Application Type**: Android
- **Name**: Seu app name + " Android"
- **Package name**: Deve corresponder ao package name do seu app Android
- **SHA-1 certificate fingerprint**: Obtenha usando o comando:
  ```bash
  # Para debug keystore
  keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
  ```

## 2. Configuração no React Native

### 2.1 Atualizar as configurações

Edite o arquivo `/src/config/googleAuth.ts`:

```typescript
export const GOOGLE_CONFIG = {
  // Use o Web Client ID (OBRIGATÓRIO para Authorization Code Flow)
  WEB_CLIENT_ID: 'SEU_WEB_CLIENT_ID_AQUI.apps.googleusercontent.com',

  // iOS Client ID (opcional)
  IOS_CLIENT_ID: 'SEU_IOS_CLIENT_ID_AQUI.apps.googleusercontent.com',

  // Resto da configuração permanece igual
  SCOPES: ['openid', 'profile', 'email'],
  OFFLINE_ACCESS: true,
  HOSTED_DOMAIN: '',
  FORCE_CODE_FOR_REFRESH_TOKEN: true,
};
```

### 2.2 Configuração iOS

#### Info.plist

Adicione o seguinte no arquivo `ios/perclireact/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>GOOGLE_SIGNIN</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <!-- Substitua REVERSED_CLIENT_ID pelo iOS Client ID com ordem invertida -->
      <string>com.googleusercontent.apps.SEU_IOS_CLIENT_ID_INVERTIDO</string>
    </array>
  </dict>
</array>
```

### 2.3 Configuração Android

#### android/app/build.gradle

Adicione no final do arquivo:

```gradle
apply plugin: 'com.google.gms.google-services' // Se ainda não estiver
```

#### strings.xml (Opcional)

Adicione em `android/app/src/main/res/values/strings.xml`:

```xml
<string name="server_client_id">SEU_WEB_CLIENT_ID_AQUI.apps.googleusercontent.com</string>
```

## 3. Configuração do Backend

### 3.1 Endpoint necessário

Crie um endpoint no seu backend para receber o authorization code:

```
POST /auth/google
Content-Type: application/json

{
  "code": "authorization_code_received_from_mobile",
  "grantType": "authorization_code"
}
```

### 3.2 Fluxo do Authorization Code

1. O app móvel obtém o authorization code do Google
2. O app envia esse code para o seu backend
3. O backend troca o code por access_token e refresh_token com o Google
4. O backend retorna os dados do usuário e tokens de autenticação da sua aplicação

### 3.3 Exemplo de resposta esperada do backend

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "User Name",
      "email": "user@email.com",
      "emailVerified": true,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    "tokens": {
      "access": "your_app_access_token",
      "refresh": "your_app_refresh_token",
      "expiresIn": 3600
    }
  }
}
```

## 4. Testando

### 4.1 Desenvolvimento

1. Certifique-se de que o backend está rodando na porta 8085
2. Certifique-se de que o endpoint `/auth/google` está funcionando
3. Execute o app: `npm run ios` ou `npm run android`
4. Toque no botão "📱 Continuar com Google"

### 4.2 Troubleshooting

#### Erro "DEVELOPER_ERROR"

- Verifique se o SHA-1 fingerprint está correto (Android)
- Verifique se o Bundle ID está correto (iOS)
- Verifique se as credenciais OAuth estão configuradas corretamente

#### Erro "Network request failed"

- Verifique se o backend está rodando
- Verifique se o endpoint `/auth/google` existe
- Verifique se a URL base está correta (porta 8085)

#### Authorization code não é recebido

- Verifique se `FORCE_CODE_FOR_REFRESH_TOKEN` está como `true`
- Verifique se o `WEB_CLIENT_ID` está configurado corretamente
- Certifique-se de que está usando o Web Client ID, não o iOS/Android Client ID

## 5. Segurança

### 5.1 Boas práticas

- Nunca exponha os Client IDs no código se forem sensíveis
- Use diferentes credenciais para desenvolvimento e produção
- Sempre valide os tokens no backend
- Implemente refresh token rotation se necessário

### 5.2 HTTPS

- Em produção, sempre use HTTPS
- Configure os redirect URIs com HTTPS no Google Cloud Console
