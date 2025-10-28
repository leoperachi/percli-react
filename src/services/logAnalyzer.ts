/**
 * Analisador de Logs
 * Funções auxiliares para analisar e extrair informações dos logs
 */

import { logger } from './loggerService';

interface LogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string;
  data?: any;
}

export class LogAnalyzer {
  /**
   * Retorna apenas os erros dos logs
   */
  static async getErrors(): Promise<LogEntry[]> {
    const logs = await logger.getLogs();
    return logs.filter(log => log.level === 'error');
  }

  /**
   * Retorna apenas os avisos dos logs
   */
  static async getWarnings(): Promise<LogEntry[]> {
    const logs = await logger.getLogs();
    return logs.filter(log => log.level === 'warn');
  }

  /**
   * Retorna erros e avisos combinados
   */
  static async getProblems(): Promise<LogEntry[]> {
    const logs = await logger.getLogs();
    return logs.filter(log => log.level === 'error' || log.level === 'warn');
  }

  /**
   * Exporta apenas erros como texto formatado
   */
  static async exportErrors(): Promise<string> {
    const errors = await this.getErrors();

    if (errors.length === 0) {
      return '✅ Nenhum erro encontrado nos logs!';
    }

    let output = `❌ ERROS ENCONTRADOS (${errors.length})\n`;
    output += '='.repeat(50) + '\n\n';

    errors.forEach((error, index) => {
      const date = new Date(error.timestamp).toLocaleString('pt-BR');
      output += `Erro #${index + 1}\n`;
      output += `Data: ${date}\n`;
      output += `Mensagem: ${error.message}\n`;
      if (error.data) {
        output += `Dados:\n${JSON.stringify(error.data, null, 2)}\n`;
      }
      output += '-'.repeat(50) + '\n\n';
    });

    return output;
  }

  /**
   * Exporta problemas (erros + avisos) como texto formatado
   */
  static async exportProblems(): Promise<string> {
    const problems = await this.getProblems();

    if (problems.length === 0) {
      return '✅ Nenhum problema encontrado nos logs!';
    }

    let output = `⚠️ PROBLEMAS ENCONTRADOS (${problems.length})\n`;
    output += '='.repeat(50) + '\n\n';

    problems.forEach((problem, index) => {
      const date = new Date(problem.timestamp).toLocaleString('pt-BR');
      const icon = problem.level === 'error' ? '❌' : '⚠️';
      const label = problem.level === 'error' ? 'ERRO' : 'AVISO';

      output += `${icon} ${label} #${index + 1}\n`;
      output += `Data: ${date}\n`;
      output += `Mensagem: ${problem.message}\n`;
      if (problem.data) {
        output += `Dados:\n${JSON.stringify(problem.data, null, 2)}\n`;
      }
      output += '-'.repeat(50) + '\n\n';
    });

    return output;
  }

  /**
   * Analisa os logs e retorna um resumo
   */
  static async getSummary(): Promise<string> {
    const logs = await logger.getLogs();

    const summary = {
      total: logs.length,
      errors: logs.filter(l => l.level === 'error').length,
      warnings: logs.filter(l => l.level === 'warn').length,
      info: logs.filter(l => l.level === 'info').length,
      debug: logs.filter(l => l.level === 'debug').length,
      log: logs.filter(l => l.level === 'log').length,
    };

    let output = '📊 RESUMO DOS LOGS\n';
    output += '='.repeat(50) + '\n\n';
    output += `Total de logs: ${summary.total}\n\n`;
    output += `❌ Erros: ${summary.errors}\n`;
    output += `⚠️ Avisos: ${summary.warnings}\n`;
    output += `ℹ️ Info: ${summary.info}\n`;
    output += `🔍 Debug: ${summary.debug}\n`;
    output += `📝 Log: ${summary.log}\n`;

    if (summary.errors > 0 || summary.warnings > 0) {
      output += '\n⚠️ Atenção: Há problemas nos logs!\n';
      output += 'Use LogAnalyzer.exportProblems() para ver detalhes.\n';
    } else {
      output += '\n✅ Nenhum problema encontrado!\n';
    }

    return output;
  }

  /**
   * Busca logs por texto
   */
  static async searchLogs(searchText: string): Promise<LogEntry[]> {
    const logs = await logger.getLogs();
    const searchLower = searchText.toLowerCase();

    return logs.filter(log => log.message.toLowerCase().includes(searchLower));
  }

  /**
   * Busca logs por padrão (ex: "[SocketService]", "[API]")
   */
  static async searchByPattern(pattern: string): Promise<LogEntry[]> {
    const logs = await logger.getLogs();

    return logs.filter(log => log.message.includes(pattern));
  }

  /**
   * Retorna logs de um período específico (últimos N minutos)
   */
  static async getRecentLogs(minutes: number): Promise<LogEntry[]> {
    return await logger.getRecentLogs(minutes);
  }

  /**
   * Agrupa erros por tipo/mensagem
   */
  static async groupErrors(): Promise<Map<string, LogEntry[]>> {
    const errors = await this.getErrors();
    const grouped = new Map<string, LogEntry[]>();

    errors.forEach(error => {
      // Extrai a primeira linha da mensagem como chave
      const key = error.message.split('\n')[0];

      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(error);
    });

    return grouped;
  }

  /**
   * Exporta erros agrupados
   */
  static async exportGroupedErrors(): Promise<string> {
    const grouped = await this.groupErrors();

    if (grouped.size === 0) {
      return '✅ Nenhum erro encontrado nos logs!';
    }

    let output = `❌ ERROS AGRUPADOS (${grouped.size} tipos diferentes)\n`;
    output += '='.repeat(50) + '\n\n';

    Array.from(grouped.entries()).forEach(([errorType, errors], index) => {
      output += `Erro #${index + 1}: ${errorType}\n`;
      output += `Ocorrências: ${errors.length}x\n`;
      output += `Primeira vez: ${new Date(errors[0].timestamp).toLocaleString(
        'pt-BR',
      )}\n`;
      output += `Última vez: ${new Date(
        errors[errors.length - 1].timestamp,
      ).toLocaleString('pt-BR')}\n`;
      output += '-'.repeat(50) + '\n\n';
    });

    return output;
  }

  /**
   * Imprime resumo no console
   */
  static async printSummary(): Promise<void> {
    const summary = await this.getSummary();
    console.log(summary);
  }

  /**
   * Imprime erros no console
   */
  static async printErrors(): Promise<void> {
    const errors = await this.exportErrors();
    console.log(errors);
  }

  /**
   * Imprime problemas no console
   */
  static async printProblems(): Promise<void> {
    const problems = await this.exportProblems();
    console.log(problems);
  }
}

export default LogAnalyzer;
