/**
 * Exemplos de uso do Logger Service
 *
 * Este arquivo demonstra como usar o sistema de logging do PerCLI
 * em diferentes situações do aplicativo.
 */

import { logger } from './loggerService';

// ============================================================================
// 1. USO BÁSICO - Console normal (automaticamente interceptado)
// ============================================================================

export function basicLoggingExample() {
  // Todos esses logs serão automaticamente salvos
  console.log('Aplicativo iniciado');
  console.info('Versão: 1.0.0');
  console.warn('Modo de desenvolvimento ativo');
  console.error('Erro simulado para teste');
  console.debug('Debug info: timestamp', new Date().toISOString());

  // Objetos são automaticamente formatados
  const user = { id: 1, name: 'João', email: 'joao@example.com' };
  console.log('Dados do usuário:', user);

  // Arrays também funcionam
  const items = [1, 2, 3, 4, 5];
  console.log('Items:', items);
}

// ============================================================================
// 2. TRACKING DE NAVEGAÇÃO
// ============================================================================

export function trackNavigation(screenName: string, params?: any) {
  console.log(`[Navigation] Navegou para ${screenName}`, params || {});
}

// Exemplo de uso:
// trackNavigation('HomeScreen');
// trackNavigation('ProfileScreen', { userId: 123 });

// ============================================================================
// 3. LOGGING DE REQUISIÇÕES HTTP
// ============================================================================

export async function exampleApiCall() {
  const endpoint = '/api/users';

  console.log(`[API] Fazendo requisição: GET ${endpoint}`);

  try {
    // Simula uma chamada de API
    const startTime = Date.now();
    const response = await fetch(endpoint);
    const duration = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      console.info(`[API] Sucesso: GET ${endpoint} (${duration}ms)`, {
        status: response.status,
        dataSize: JSON.stringify(data).length,
      });
    } else {
      console.warn(`[API] Erro: GET ${endpoint}`, {
        status: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error) {
    console.error(`[API] Falha: GET ${endpoint}`, {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// ============================================================================
// 4. TRATAMENTO DE ERROS
// ============================================================================

export function exampleErrorHandling() {
  try {
    // Código que pode gerar erro
    throw new Error('Erro simulado');
  } catch (error) {
    if (error instanceof Error) {
      console.error('[Error Handler] Erro capturado:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

// ============================================================================
// 5. LOGGING DE EVENTOS DO USUÁRIO
// ============================================================================

export class UserActivityLogger {
  static trackLogin(userId: string, method: 'email' | 'google') {
    console.log('[User Activity] Login realizado', {
      userId,
      method,
      timestamp: new Date().toISOString(),
    });
  }

  static trackLogout(userId: string) {
    console.log('[User Activity] Logout realizado', {
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  static trackButtonClick(buttonName: string, screenName: string) {
    console.debug('[User Activity] Botão clicado', {
      button: buttonName,
      screen: screenName,
      timestamp: new Date().toISOString(),
    });
  }

  static trackFormSubmit(formName: string, success: boolean) {
    const level = success ? 'info' : 'warn';
    if (success) {
      console.info('[User Activity] Formulário enviado', {
        form: formName,
        success,
      });
    } else {
      console.warn('[User Activity] Falha ao enviar formulário', {
        form: formName,
        success,
      });
    }
  }
}

// ============================================================================
// 6. USAR O LOGGER DIRETAMENTE (funções avançadas)
// ============================================================================

export async function advancedLoggerUsage() {
  // Obter todos os logs
  const allLogs = await logger.getLogs();
  console.log(`Total de logs: ${allLogs.length}`);

  // Obter apenas erros
  const errors = await logger.getLogsByLevel('error');
  console.log(`Total de erros: ${errors.length}`);

  // Obter logs dos últimos 30 minutos
  const recentLogs = await logger.getRecentLogs(30);
  console.log(`Logs recentes (30min): ${recentLogs.length}`);

  // Exportar logs como string
  const logsText = await logger.exportLogs();
  console.log('Logs exportados:', logsText.length + ' caracteres');

  // Limpar todos os logs (use com cuidado!)
  // await logger.clearLogs();
}

// ============================================================================
// 7. USAR CONSOLE ORIGINAL SEM SALVAR (quando necessário)
// ============================================================================

export function exampleOriginalConsole() {
  // Esses logs NÃO serão salvos
  const originalConsole = logger.useOriginalConsole();
  originalConsole.log('Este log não será salvo no storage');
  originalConsole.debug('Debug info que não precisa ser persistido');

  // Mas isso ainda é salvo normalmente
  console.log('Este log será salvo normalmente');
}

// ============================================================================
// 8. LOGGING EM COMPONENTES REACT
// ============================================================================

export function ComponentLoggingExample() {
  // useEffect para logging de lifecycle
  // useEffect(() => {
  //   console.log('[Component] MyComponent montado');
  //
  //   return () => {
  //     console.log('[Component] MyComponent desmontado');
  //   };
  // }, []);

  // Logging de eventos
  const handleButtonPress = () => {
    console.log('[Event] Botão pressionado em MyComponent');
  };

  // Logging de estados
  // useEffect(() => {
  //   console.debug('[State] Estado atualizado:', { myState });
  // }, [myState]);
}

// ============================================================================
// 9. DEBUGGING DE PERFORMANCE
// ============================================================================

export class PerformanceLogger {
  private static timers: Map<string, number> = new Map();

  static startTimer(label: string) {
    this.timers.set(label, Date.now());
    console.debug(`[Performance] Timer iniciado: ${label}`);
  }

  static endTimer(label: string) {
    const startTime = this.timers.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.info(`[Performance] ${label}: ${duration}ms`);
      this.timers.delete(label);
    } else {
      console.warn(`[Performance] Timer não encontrado: ${label}`);
    }
  }
}

// Exemplo de uso:
// PerformanceLogger.startTimer('carregarDados');
// await carregarDados();
// PerformanceLogger.endTimer('carregarDados');

// ============================================================================
// 10. LOGGING CONDICIONAL (só em dev)
// ============================================================================

export function devLog(...args: any[]) {
  if (__DEV__) {
    console.debug('[DEV]', ...args);
  }
}

export function prodLog(...args: any[]) {
  if (!__DEV__) {
    console.log('[PROD]', ...args);
  }
}

// ============================================================================
// EXPORTANDO TUDO PARA USO
// ============================================================================

export const LoggingExamples = {
  basicLoggingExample,
  trackNavigation,
  exampleApiCall,
  exampleErrorHandling,
  UserActivityLogger,
  advancedLoggerUsage,
  exampleOriginalConsole,
  ComponentLoggingExample,
  PerformanceLogger,
  devLog,
  prodLog,
};

// ============================================================================
// COMO USAR ESTE ARQUIVO
// ============================================================================

// Importe as funções que você precisa:
// import { trackNavigation, UserActivityLogger } from './logger.example';
//
// E use no seu código:
// trackNavigation('HomeScreen');
// UserActivityLogger.trackLogin('user123', 'email');
