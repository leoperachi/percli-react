# Sistema de Logging do PerCLI React

## 📋 O que foi implementado

Um sistema completo de logging que intercepta e salva todos os logs do aplicativo automaticamente.

## ✨ Características Principais

1. **Interceptação Automática**: Todos os `console.log`, `console.warn`, `console.error`, `console.info` e `console.debug` são automaticamente salvos
2. **Armazenamento Persistente**: Logs salvos no AsyncStorage
3. **Limpeza Automática**: Logs são limpos quando o app reinicia
4. **Interface Visual**: Tela para visualizar, filtrar e exportar logs
5. **Fácil Acesso**: Botão no menu lateral (apenas em modo dev)
6. **Limite Inteligente**: Máximo de 1000 logs para não consumir muito espaço

## 📁 Arquivos Criados

### 1. Service Principal

- **`src/services/loggerService.ts`**
  - Classe principal do logger
  - Intercepta console.log, warn, error, info, debug
  - Gerencia armazenamento no AsyncStorage
  - Fornece métodos para recuperar e filtrar logs

### 2. Tela de Visualização

- **`src/screens/LogViewerScreen.tsx`**
  - Interface completa para visualizar logs
  - Filtros por tipo (Todos, Erros, Avisos, Info)
  - Botões para limpar e exportar logs
  - Pull-to-refresh para atualizar
  - Design responsivo e moderno

### 3. Documentação

- **`src/services/LOGGER_README.md`**

  - Guia completo de uso
  - API de referência
  - Exemplos práticos
  - Troubleshooting

- **`src/services/logger.example.ts`**
  - Exemplos de código
  - Casos de uso reais
  - Boas práticas
  - Padrões de logging

## 🚀 Como Usar

### Uso Básico (Automático)

Simplesmente use o console normalmente:

```typescript
console.log('Minha mensagem');
console.error('Erro aqui');
console.warn('Aviso!');
console.info('Informação');
console.debug('Debug');
```

Todos esses logs serão automaticamente salvos!

### Acessar a Tela de Logs

1. Abra o app em modo de desenvolvimento (`__DEV__`)
2. Abra o menu lateral (drawer)
3. Clique em "Logs do App" 🐛
4. Visualize, filtre e exporte seus logs

### Uso Avançado

```typescript
import { logger } from './src/services/loggerService';

// Obter todos os logs
const logs = await logger.getLogs();

// Obter apenas erros
const errors = await logger.getLogsByLevel('error');

// Obter logs recentes (últimos 30 min)
const recent = await logger.getRecentLogs(30);

// Exportar logs
const text = await logger.exportLogs();

// Limpar logs
await logger.clearLogs();
```

## 📱 Integração no App

### Arquivos Modificados

1. **`App.tsx`**

   - Inicializa o logger quando o app inicia
   - Limpa logs automaticamente

2. **`src/navigation/AppNavigator.tsx`**

   - Adiciona a rota `LogViewer`
   - Permite navegação para a tela de logs

3. **`src/components/LeftDrawer.tsx`**

   - Adiciona botão "Logs do App" (apenas em dev)
   - Ícone de bug 🐛

4. **`src/services/index.ts`**
   - Exporta o logger para fácil importação

## 🔧 Estrutura dos Logs

Cada log possui:

```typescript
{
  timestamp: "2025-10-27T10:30:45.123Z",
  level: "log" | "warn" | "error" | "info" | "debug",
  message: "Mensagem do log",
  data: { ... } // Opcional
}
```

## 💾 Armazenamento

- **Chave**: `@percli_app_logs`
- **Local**: AsyncStorage
- **Limite**: 1000 logs
- **Limpeza**: Automática ao iniciar o app

## 🎨 Interface da Tela de Logs

### Funcionalidades:

- ✅ Lista de logs com timestamp
- ✅ Badge colorido por tipo (erro=vermelho, warn=laranja, etc)
- ✅ Filtros por tipo de log
- ✅ Contador de logs por tipo
- ✅ Pull-to-refresh
- ✅ Botão "Limpar Logs" (com confirmação)
- ✅ Botão "Exportar" (compartilha via Share Sheet)
- ✅ Design responsivo e moderno
- ✅ Suporte a tema claro/escuro

## 📊 Benefícios

1. **Debug Facilitado**: Veja todos os logs em um só lugar
2. **Histórico Completo**: Logs persistem mesmo após fechar o app
3. **Filtros Inteligentes**: Encontre rapidamente o que procura
4. **Exportação**: Compartilhe logs para análise externa
5. **Sem Overhead**: Salvamento assíncrono não bloqueia UI
6. **Produção-Ready**: Fácil desabilitar em produção

## 🔒 Segurança e Performance

- Salvamento assíncrono (não bloqueia UI)
- Limite de logs (não enche o storage)
- Apenas visível em modo dev
- Pode ser facilmente desabilitado em produção

## 🎯 Próximos Passos (Opcional)

Se quiser expandir o sistema:

1. **Upload de Logs**: Enviar logs para servidor
2. **Níveis de Log**: Configurar quais níveis salvar
3. **Filtros Avançados**: Busca por texto, data, etc
4. **Analytics**: Integrar com ferramentas de analytics
5. **Crash Reporting**: Detectar e reportar crashes
6. **Performance Monitoring**: Track de performance

## 📚 Documentação Completa

Para mais detalhes, consulte:

- `src/services/LOGGER_README.md` - Documentação completa
- `src/services/logger.example.ts` - Exemplos de código

## ✅ Checklist de Implementação

- [x] Service de logging criado
- [x] Interceptação de console
- [x] Armazenamento no AsyncStorage
- [x] Limpeza automática ao iniciar
- [x] Tela de visualização
- [x] Filtros por tipo
- [x] Exportação de logs
- [x] Integração no menu lateral
- [x] Navegação configurada
- [x] Documentação completa
- [x] Exemplos de uso
- [x] Design responsivo
- [x] Suporte a tema

## 🤝 Como Contribuir

Para adicionar novos recursos:

1. Edite `src/services/loggerService.ts` para funcionalidades do logger
2. Edite `src/screens/LogViewerScreen.tsx` para melhorias na UI
3. Adicione exemplos em `src/services/logger.example.ts`
4. Atualize a documentação em `src/services/LOGGER_README.md`

---

**Desenvolvido para o PerCLI React Native App** 🚀
