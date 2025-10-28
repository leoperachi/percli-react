import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_STORAGE_KEY = '@percli_app_logs';
const MAX_LOGS = 1000; // Limita o número de logs para não ocupar muito espaço

interface LogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  data?: any;
}

class LoggerService {
  private logs: LogEntry[] = [];
  private originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info,
    debug: console.debug,
  };
  private isInitialized = false;

  /**
   * Inicializa o serviço de logging
   * Limpa logs antigos e intercepta console.log
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    // Limpa logs antigos toda vez que o app inicia
    await this.clearLogs();

    // Intercepta os métodos do console
    this.interceptConsole();

    this.isInitialized = true;
    this.log('info', 'LoggerService initialized');
  }

  /**
   * Intercepta os métodos do console para salvar automaticamente
   */
  private interceptConsole(): void {
    console.log = (...args: any[]) => {
      this.originalConsole.log(...args);
      this.log('log', this.formatArgs(args));
    };

    console.warn = (...args: any[]) => {
      this.originalConsole.warn(...args);
      this.log('warn', this.formatArgs(args));
    };

    console.error = (...args: any[]) => {
      this.originalConsole.error(...args);
      this.log('error', this.formatArgs(args));
    };

    console.info = (...args: any[]) => {
      this.originalConsole.info(...args);
      this.log('info', this.formatArgs(args));
    };

    console.debug = (...args: any[]) => {
      this.originalConsole.debug(...args);
      this.log('debug', this.formatArgs(args));
    };
  }

  /**
   * Formata os argumentos do console em uma string
   */
  private formatArgs(args: any[]): string {
    return args
      .map(arg => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');
  }

  /**
   * Adiciona um log
   */
  private log(level: LogEntry['level'], message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(entry);

    // Limita o número de logs em memória
    if (this.logs.length > MAX_LOGS) {
      this.logs.shift();
    }

    // Salva de forma assíncrona (não bloqueia)
    this.saveLogs().catch(err => {
      this.originalConsole.error('Error saving logs:', err);
    });
  }

  /**
   * Salva os logs no AsyncStorage
   */
  private async saveLogs(): Promise<void> {
    try {
      await AsyncStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (error) {
      this.originalConsole.error('Failed to save logs:', error);
    }
  }

  /**
   * Recupera os logs salvos
   */
  async getLogs(): Promise<LogEntry[]> {
    try {
      this.originalConsole.log(
        '[LoggerService] Buscando logs do AsyncStorage...',
      );
      const logsJson = await AsyncStorage.getItem(LOG_STORAGE_KEY);

      if (logsJson) {
        this.logs = JSON.parse(logsJson);
        this.originalConsole.log(
          '[LoggerService] Logs encontrados:',
          this.logs.length,
        );
        return this.logs;
      }

      this.originalConsole.log(
        '[LoggerService] Nenhum log encontrado no AsyncStorage',
      );
      return [];
    } catch (error) {
      this.originalConsole.error(
        '[LoggerService] Erro ao carregar logs:',
        error,
      );
      return [];
    }
  }

  /**
   * Limpa todos os logs
   */
  async clearLogs(): Promise<void> {
    try {
      this.originalConsole.log('[LoggerService] Iniciando limpeza de logs...');
      this.originalConsole.log(
        '[LoggerService] Logs em memória antes:',
        this.logs.length,
      );

      // Limpa array em memória
      this.logs = [];

      // Remove do AsyncStorage
      await AsyncStorage.removeItem(LOG_STORAGE_KEY);

      this.originalConsole.log('[LoggerService] ✅ Logs limpos com sucesso!');
      this.originalConsole.log(
        '[LoggerService] Logs em memória agora:',
        this.logs.length,
      );
    } catch (error) {
      this.originalConsole.error(
        '[LoggerService] ❌ Erro ao limpar logs:',
        error,
      );
      throw error;
    }
  }

  /**
   * Exporta logs como string formatada
   */
  async exportLogs(): Promise<string> {
    const logs = await this.getLogs();
    return logs
      .map(log => {
        const date = new Date(log.timestamp).toLocaleString();
        return `[${date}] [${log.level.toUpperCase()}] ${log.message}${
          log.data ? `\nData: ${JSON.stringify(log.data, null, 2)}` : ''
        }`;
      })
      .join('\n\n');
  }

  /**
   * Retorna logs filtrados por nível
   */
  async getLogsByLevel(level: LogEntry['level']): Promise<LogEntry[]> {
    const logs = await this.getLogs();
    return logs.filter(log => log.level === level);
  }

  /**
   * Retorna logs dos últimos N minutos
   */
  async getRecentLogs(minutes: number): Promise<LogEntry[]> {
    const logs = await this.getLogs();
    const cutoffTime = new Date(Date.now() - minutes * 60 * 1000);
    return logs.filter(log => new Date(log.timestamp) > cutoffTime);
  }

  /**
   * Usa o console original sem salvar no log
   */
  useOriginalConsole() {
    return this.originalConsole;
  }
}

// Exporta instância singleton
export const logger = new LoggerService();
export default logger;
