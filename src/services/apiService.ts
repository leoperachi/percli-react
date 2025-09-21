import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_CONFIG, buildUrl, ApiResponse, AuthResponse } from '../config/api';
import { ENV, log, logError } from '../config/environment';
import hybridStorageService from './hybridStorageService';

class ApiService {
  private baseURL: string;
  private timeout: number;
  private axiosInstance;

  constructor() {
    this.baseURL = ENV.API_BASE_URL;
    this.timeout = ENV.API_TIMEOUT;

    // Configure Axios instance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Interceptors simplificados para evitar crash
    this.axiosInstance.interceptors.request.use(
      config => config,
      error => Promise.reject(error),
    );

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => Promise.reject(error),
    );
  }

  // Get stored access token
  private async getAccessToken(): Promise<string | null> {
    return await hybridStorageService.getAccessToken();
  }

  // Get stored refresh token
  private async getRefreshToken(): Promise<string | null> {
    return await hybridStorageService.getRefreshToken();
  }

  // Store tokens (not used in hybrid - tokens stored as part of auth data)
  private async storeTokens(
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      // Note: In hybrid storage, tokens are stored as part of setAuthData
      // This method kept for compatibility but not actively used
      console.log('⚠️ [API SERVICE] storeTokens called - tokens should be stored via setAuthData');
    } catch (error) {
      logError('Error storing tokens:', error);
    }
  }

  // Clear all stored data
  private async clearStorage(): Promise<void> {
    try {
      await hybridStorageService.clearAuthData();
    } catch (error) {
      logError('Error clearing storage:', error);
    }
  }

  // Build headers with authentication
  private async buildHeaders(
    includeAuth: boolean = true,
  ): Promise<HeadersInit> {
    const headers: HeadersInit = {
      ...API_CONFIG.HEADERS,
    };

    if (includeAuth) {
      const token = await this.getAccessToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Generic HTTP request method using Axios
  private async request<T>(
    endpoint: string,
    options: any = {},
    includeAuth: boolean = true,
    params?: Record<string, string | number>,
  ): Promise<ApiResponse<T>> {
    console.log(
      '================== API SERVICE REQUEST START ==================',
    );
    console.log(`🔥 [API SERVICE] Endpoint: ${endpoint}`);
    console.log(`🔥 [API SERVICE] Options:`, JSON.stringify(options, null, 2));
    console.log(`🔥 [API SERVICE] Include Auth: ${includeAuth}`);
    console.log(`🔥 [API SERVICE] Params:`, params);
    console.log(`🔥 [API SERVICE] Base URL: ${this.baseURL}`);
    console.log(`🔥 [API SERVICE] Timeout: ${this.timeout}ms`);

    try {
      console.log('🔥 [API SERVICE] STEP 1: Getting auth token...');
      // Add auth header if needed
      const headers: any = { ...options.headers };
      if (includeAuth) {
        const token = await this.getAccessToken();
        console.log(
          `🔥 [API SERVICE] Token retrieved: ${token ? 'YES' : 'NO'}`,
        );
        if (token) {
          headers.Authorization = `Bearer ${token}`;
          console.log(`🔥 [API SERVICE] Authorization header added`);
        }
      } else {
        console.log(`🔥 [API SERVICE] Skipping auth (includeAuth=false)`);
      }

      console.log('🔥 [API SERVICE] STEP 2: Preparing Axios config...');
      // Prepare Axios config
      const axiosConfig: any = {
        url: endpoint,
        method: options.method || 'GET',
        headers,
        timeout: this.timeout,
      };

      // Add body data if present
      if (options.body) {
        console.log('🔥 [API SERVICE] STEP 3: Processing body data...');
        console.log('🔥 [API SERVICE] Original body:', options.body);
        console.log('🔥 [API SERVICE] Body type:', typeof options.body);

        if (typeof options.body === 'string') {
          try {
            axiosConfig.data = JSON.parse(options.body);
            console.log(
              '🔥 [API SERVICE] Body parsed from string:',
              axiosConfig.data,
            );
          } catch (e) {
            console.error('🔥 [API SERVICE] ERROR parsing body JSON:', e);
            axiosConfig.data = options.body;
          }
        } else {
          axiosConfig.data = options.body;
          console.log('🔥 [API SERVICE] Body used as-is:', axiosConfig.data);
        }
      }

      // Add URL params if present
      if (params) {
        axiosConfig.params = params;
        console.log('🔥 [API SERVICE] URL params added:', params);
      }

      console.log('🔥 [API SERVICE] STEP 4: Final Axios config:');
      console.log(JSON.stringify(axiosConfig, null, 2));

      console.log('🔥 [API SERVICE] STEP 5: Making Axios request...');
      const fullUrl = `${this.baseURL}${endpoint}`;
      console.log(`🔥 [API SERVICE] Full URL: ${fullUrl}`);

      const response: AxiosResponse = await this.axiosInstance.request(
        axiosConfig,
      );

      console.log('🔥 [API SERVICE] STEP 6: Request successful!');
      console.log('🔥 [API SERVICE] Raw response data:', response.data);
      console.log('🔥 [API SERVICE] Response status:', response.status);

      // Handle server response format - convert to ApiResponse format
      const serverData = response.data;

      // Check if server returned success (status 200-299)
      const isSuccess = response.status >= 200 && response.status < 300;

      let apiResponse: ApiResponse<T>;

      if (isSuccess) {
        // Server returned success - format as ApiResponse
        if (serverData.status_code && serverData.data) {
          // Server format: { status_code: 201, message: "...", data: {...} }
          apiResponse = {
            success: true,
            data: serverData.data,
            message: serverData.message
          };
        } else if (serverData.success !== undefined) {
          // Already in ApiResponse format
          apiResponse = serverData;
        } else {
          // Direct data response
          apiResponse = {
            success: true,
            data: serverData
          };
        }
      } else {
        // Server returned error
        apiResponse = {
          success: false,
          error: serverData.message || serverData.error || 'Server error'
        };
      }

      console.log('🔥 [API SERVICE] Formatted API response:', JSON.stringify(apiResponse, null, 2));
      console.log(
        '================== API SERVICE REQUEST SUCCESS ==================',
      );

      return apiResponse;
    } catch (error) {
      console.log(
        '================== API SERVICE REQUEST ERROR ==================',
      );

      if (axios.isAxiosError(error)) {
        console.log('[API SERVICE] This is an Axios error');
        const axiosError = error as AxiosError;

        // Handle 401 with token refresh only for authenticated requests
        if (axiosError.response?.status === 401) {
          if (includeAuth) {
            console.log(
              '🔄 [API SERVICE] 401 detected on authenticated request, attempting token refresh...',
            );
            const refreshed = await this.refreshToken();
            if (refreshed) {
              console.log(
                '✅ [API SERVICE] Token refreshed successfully, retrying request...',
              );
              return this.request(endpoint, options, includeAuth, params);
            } else {
              console.log(
                '[API SERVICE] Token refresh failed, clearing storage...',
              );
              await this.clearStorage();
              return {
                success: false,
                error: '🔐 SESSÃO EXPIRADA: Faça login novamente.',
              };
            }
          } else {
            console.log(
              '🚫 [API SERVICE] 401 detected on non-authenticated request (register/login/etc)',
            );
            // For non-authenticated requests (like register), treat 401 as a normal error
            let errorMessage = this.getAxiosErrorMessage(axiosError, endpoint);
            return {
              success: false,
              error: errorMessage,
            };
          }
        }

        let errorMessage = this.getAxiosErrorMessage(axiosError, endpoint);
        console.log('[API SERVICE] Final error message:', errorMessage);

        console.log(
          '================== API SERVICE REQUEST ERROR END ==================',
        );
        return {
          success: false,
          error: errorMessage,
        };
      } else {
        console.log('[API SERVICE] This is NOT an Axios error');
        console.error('[API SERVICE] Non-Axios error details:', error);

        const errorMessage = `❓ ERRO INESPERADO: ${
          error instanceof Error ? error.message : 'Erro desconhecido'
        }`;
        console.log('[API SERVICE] Non-Axios error message:', errorMessage);

        console.log(
          '================== API SERVICE REQUEST ERROR END ==================',
        );
        return {
          success: false,
          error: errorMessage,
        };
      }
    }
  }

  // Helper method to get specific error messages from Axios errors
  private getAxiosErrorMessage(error: AxiosError, endpoint: string): string {
    const url = `${this.baseURL}${endpoint}`;

    // Build detailed technical error message
    let technicalDetails = `\n\n=== DETALHES TÉCNICOS ===\n`;
    technicalDetails += `Código: ${error.code || 'N/A'}\n`;
    technicalDetails += `Mensagem: ${error.message}\n`;
    technicalDetails += `URL: ${url}\n`;
    technicalDetails += `Method: ${
      error.config?.method?.toUpperCase() || 'N/A'
    }\n`;

    if (error.response) {
      technicalDetails += `Status: ${error.response.status} ${error.response.statusText}\n`;
      technicalDetails += `Response Headers: ${JSON.stringify(
        error.response.headers,
        null,
        2,
      )}\n`;
      technicalDetails += `Response Data: ${JSON.stringify(
        error.response.data,
        null,
        2,
      )}\n`;
    }

    if (error.request) {
      technicalDetails += `Request: ${JSON.stringify(
        error.request,
        null,
        2,
      ).substring(0, 200)}...\n`;
    }

    technicalDetails += `Stack: ${
      error.stack?.substring(0, 300) || 'N/A'
    }...\n`;
    technicalDetails += `=========================`;

    // User-friendly message + technical details
    let userMessage = '';

    if (error.code === 'ECONNABORTED') {
      userMessage = `⏰ TIMEOUT: Servidor não respondeu em ${
        this.timeout / 1000
      }s`;
    } else if (error.code === 'ECONNREFUSED') {
      userMessage = `🚪 CONEXÃO RECUSADA: Servidor não está rodando em 192.168.0.101:3000`;
    } else if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
      userMessage = `🔍 DNS: Não foi possível resolver 192.168.0.101`;
    } else if (error.code === 'ENETUNREACH' || error.code === 'ENETDOWN') {
      userMessage = `🌐 REDE: Falha na conexão de rede`;
    } else if (error.response) {
      const status = error.response.status;
      const data = error.response.data as any;

      if (status === 404) {
        userMessage = `🔍 ENDPOINT NÃO ENCONTRADO: ${url} não existe`;
      } else if (status === 400) {
        userMessage = `📝 DADOS INVÁLIDOS: ${
          data?.message || 'Requisição mal formada'
        }`;
      } else if (status === 403) {
        userMessage = `🚫 ACESSO NEGADO: Sem permissão`;
      } else if (status === 500) {
        userMessage = `💥 ERRO DO SERVIDOR: ${data?.message || 'Erro interno'}`;
      } else {
        userMessage = `🚨 HTTP ${status}: ${
          data?.message || data?.error || 'Erro do servidor'
        }`;
      }
    } else if (error.request) {
      userMessage = `📡 SEM RESPOSTA: Servidor não respondeu`;
    } else {
      userMessage = ` ERRO GERAL: ${error.message}`;
    }

    return userMessage + technicalDetails;
  }

  // Refresh access token
  private async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        log('🔄 [REFRESH] No refresh token available');
        return false;
      }

      log('🔄 [REFRESH] Attempting to refresh token...');

      const response = await this.axiosInstance.post(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refreshToken },
      );

      const data: ApiResponse<AuthResponse> = response.data;
      if (data.success && data.data) {
        // Store the full auth data using hybrid storage
        await hybridStorageService.setAuthData(data.data);
        log('✅ [REFRESH] Token refreshed successfully');
        return true;
      }

      log('[REFRESH] Invalid response from refresh endpoint');
      return false;
    } catch (error) {
      logError('[REFRESH] Token refresh failed:', error);
      return false;
    }
  }

  // Login ULTRA SIMPLES - sem Keychain (pode estar causando crash)
  async login(
    email: string,
    password: string,
  ): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${ENV.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await response.text();

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}` };
      }

      const data = JSON.parse(text);

      if (data.data?.user) {
        // Store auth data if login response contains tokens
        if (data.data.tokens) {
          console.log('🔥 [LOGIN] Login successful with tokens, storing auth data...');
          const stored = await hybridStorageService.setAuthData(data.data);
          console.log('🔥 [LOGIN] Auth data storage result:', stored);
        } else {
          console.log('🔥 [LOGIN] Login successful but no tokens in response');
        }

        return { success: true, data: data.data };
      }

      return { success: false, error: 'Login inválido' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede',
      };
    }
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<ApiResponse<AuthResponse>> {
    console.log('🔥 [REGISTER] Starting registration process...');

    const response = await this.request<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.REGISTER,
      {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      },
      false, // Don't include auth header for registration
    );

    console.log('🔥 [REGISTER] Response received:', JSON.stringify(response, null, 2));

    // Store auth data if registration successful and data contains tokens
    if (response.success && response.data && response.data.tokens) {
      console.log('🔥 [REGISTER] Registration successful with tokens, storing auth data...');
      const stored = await hybridStorageService.setAuthData(response.data);
      console.log('🔥 [REGISTER] Auth data storage result:', stored);
    } else {
      console.log('🔥 [REGISTER] Registration response:', JSON.stringify(response, null, 2));
      console.log('🔥 [REGISTER] Not storing auth data - no tokens in response');
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
      method: 'POST',
    });

    // Clear storage regardless of response
    await this.clearStorage();

    return response;
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse> {
    return this.request(
      API_CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD,
      {
        method: 'POST',
        body: JSON.stringify({ email }),
      },
      false, // Don't include auth header
    );
  }

  // User methods
  async getUserProfile(): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.USER.PROFILE);
  }

  async updateUserProfile(userData: any): Promise<ApiResponse> {
    return this.request(API_CONFIG.ENDPOINTS.USER.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Helper method to get stored user data
  async getStoredUserData(): Promise<any | null> {
    return await hybridStorageService.getUserData();
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    return await hybridStorageService.isAuthenticated();
  }

  // Google Authentication - Authorization Code Flow
  async googleAuth(authorizationCode: string): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await fetch(`${ENV.API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authorizationCode,
          grantType: 'authorization_code'
        }),
      });

      const text = await response.text();

      if (!response.ok) {
        return { success: false, error: `HTTP ${response.status}: ${text}` };
      }

      const data = JSON.parse(text);

      if (data.data?.user) {
        return { success: true, data: data.data };
      }

      return { success: false, error: 'Resposta inválida do servidor' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro de rede',
      };
    }
  }

  // Test method that replicates EXACT Postman request
  async testPostmanLogin(): Promise<any> {
    console.log(
      '================== POSTMAN REPLICA TEST START ==================',
    );

    try {
      // Exact same request as Postman
      const url = `${ENV.API_BASE_URL}/auth/login`;
      const payload = {
        email: 'admin@percli.com',
        password: 'admin123',
      };

      console.log('🎯 [POSTMAN REPLICA] URL:', url);
      console.log(
        '🎯 [POSTMAN REPLICA] Payload:',
        JSON.stringify(payload, null, 2),
      );

      // Method 1: Using fetch (like Postman)
      console.log('🎯 [POSTMAN REPLICA] Testing with FETCH...');

      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log(
        '🎯 [POSTMAN REPLICA] Fetch Response Status:',
        fetchResponse.status,
      );
      console.log('🎯 [POSTMAN REPLICA] Fetch Response OK:', fetchResponse.ok);

      const fetchText = await fetchResponse.text();
      console.log('🎯 [POSTMAN REPLICA] Fetch Response Text:', fetchText);

      let fetchData;
      try {
        fetchData = JSON.parse(fetchText);
        console.log('🎯 [POSTMAN REPLICA] Fetch Response JSON:', fetchData);
      } catch (e) {
        console.log('🎯 [POSTMAN REPLICA] Fetch Response NOT JSON:', e);
      }

      return {
        success: fetchResponse.ok,
        method: 'fetch',
        status: fetchResponse.status,
        data: fetchData || fetchText,
        url,
        payload,
      };
    } catch (error) {
      console.error('🎯 [POSTMAN REPLICA] ERROR:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: `${ENV.API_BASE_URL}/auth/login`,
        payload: { email: 'admin@percli.com', password: 'admin123' },
      };
    }
  }

  // Test method for debugging connectivity using Axios
  async testConnection(): Promise<any> {
    const testResults = {
      timestamp: new Date().toISOString(),
      baseURL: this.baseURL,
      axiosVersion: axios.VERSION || 'N/A',
      tests: [] as any[],
    };

    // Test 1: Basic connectivity
    try {
      log('🔧 [TEST 1] Testando conectividade básica com Axios...');

      const basicResponse = await this.axiosInstance.get('/', {
        timeout: 5000,
      });

      testResults.tests.push({
        name: 'Conectividade Básica (Axios)',
        url: this.baseURL,
        status: basicResponse.status,
        result: `✅ Conectou! Status: ${basicResponse.status}`,
      });

      log('✅ Teste 1 passou - Conectividade OK');
    } catch (error) {
      const errorMsg = axios.isAxiosError(error)
        ? this.getAxiosErrorMessage(error, '/')
        : error instanceof Error
        ? error.message
        : 'Erro desconhecido';

      testResults.tests.push({
        name: 'Conectividade Básica (Axios)',
        url: this.baseURL,
        error: errorMsg,
        result: ` Falhou: ${errorMsg}`,
      });
      log('Teste 1 falhou:', errorMsg);
    }

    // Test 2: Login endpoint with Axios
    try {
      log('🔧 [TEST 2] Testando endpoint de login com Axios...');

      const loginResponse = await this.axiosInstance.post(
        '/auth/login',
        { test: true },
        { timeout: 5000 },
      );

      testResults.tests.push({
        name: 'Endpoint Login (Axios)',
        url: `${this.baseURL}/auth/login`,
        status: loginResponse.status,
        responseData: JSON.stringify(loginResponse.data).substring(0, 200),
        result: `✅ Endpoint respondeu! Status: ${loginResponse.status}`,
      });

      log('✅ Teste 2 concluído - Status:', loginResponse.status);
    } catch (error) {
      const errorMsg = axios.isAxiosError(error)
        ? this.getAxiosErrorMessage(error, '/api/auth/login')
        : error instanceof Error
        ? error.message
        : 'Erro desconhecido';

      testResults.tests.push({
        name: 'Endpoint Login (Axios)',
        url: `${this.baseURL}/auth/login`,
        error: errorMsg,
        result: ` Falhou: ${errorMsg}`,
      });
      log('Teste 2 falhou:', errorMsg);
    }

    // Test 3: Network and environment info
    try {
      log('🔧 [TEST 3] Coletando informações do ambiente...');
      const envInfo = {
        isDev: __DEV__,
        baseURL: this.baseURL,
        timeout: this.timeout,
        platform: 'React Native',
        axiosVersion: axios.VERSION || 'N/A',
      };

      testResults.tests.push({
        name: 'Informações do Ambiente',
        envInfo,
        result: `📱 RN App, Axios ${envInfo.axiosVersion}, Timeout: ${envInfo.timeout}ms`,
      });

      log('✅ Teste 3 concluído');
    } catch (error) {
      log('⚠️ Teste 3 parcialmente falhou:', error);
    }

    logError('📋 RESUMO COMPLETO DOS TESTES:', testResults);

    // Retorna resumo simplificado
    const summary = testResults.tests.map(t => t.result).join('\n');
    return {
      success: testResults.tests.some(t => !t.error),
      summary,
      fullResults: testResults,
    };
  }
}

export default new ApiService();
