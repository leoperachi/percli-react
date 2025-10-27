/**
 * Teste rápido do Logger
 * Execute este arquivo para gerar alguns logs de exemplo
 */

export function generateTestLogs() {
  console.log('🚀 Sistema de logging inicializado com sucesso!');

  // Logs informativos
  console.info('ℹ️ Aplicativo PerCLI - Versão 1.0.0');
  console.info('ℹ️ Ambiente: ' + (__DEV__ ? 'Desenvolvimento' : 'Produção'));

  // Logs de debug
  console.debug('🔍 Debug: AsyncStorage configurado');
  console.debug('🔍 Debug: Limite de logs definido para 1000');

  // Logs com objetos
  console.log('👤 Usuário exemplo:', {
    id: 1,
    name: 'João Silva',
    email: 'joao@example.com',
    active: true,
  });

  // Array de exemplo
  console.log('📋 Lista de recursos:', ['users', 'roles', 'authorizations']);

  // Avisos
  console.warn('⚠️ Este é um aviso de exemplo');
  console.warn('⚠️ Conexão lenta detectada');

  // Erros simulados
  console.error('❌ Este é um erro de exemplo (simulado)');
  console.error('❌ Erro ao carregar dados:', {
    message: 'Network Error',
    code: 'ERR_NETWORK',
    timestamp: new Date().toISOString(),
  });

  // Mais logs variados
  console.log('🔄 Sincronização iniciada');
  console.info('✅ Sincronização completa');
  console.debug('🔍 Cache atualizado com sucesso');

  console.log(
    '✨ Logs de teste gerados! Acesse "Logs do App" no menu para visualizar.',
  );
}

// Exporta para uso em outros lugares
export default generateTestLogs;
