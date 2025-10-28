# Sistema de Logging do PerCLI

## Visão Geral

O `loggerService` é um sistema de logging customizado que intercepta e salva todos os logs do aplicativo automaticamente. Os logs são salvos no AsyncStorage e são limpos toda vez que o app reinicia.

## Características

- ✅ Intercepta automaticamente `console.log`, `console.warn`, `console.error`, `console.info`, e `console.debug`
- ✅ Salva logs persistentemente no AsyncStorage
- ✅ Limpa logs automaticamente quando o app reinicia
- ✅ Interface para visualizar, filtrar e exportar logs
- ✅ Limite de 1000 logs em memória para não consumir muito espaço
- ✅ Formatação automática de objetos JSON
- ✅ Timestamps em todos os logs

## Instalação

O logger já está configurado e será inicializado automaticamente quando o app iniciar através do `App.tsx`.

## Uso Básico

### Usando console.log normalmente

Você não precisa fazer nada diferente! Continue usando o console normalmente:

```typescript
// Todos esses logs serão interceptados e salvos automaticamente
console.log('Informação importante');
console.warn('Aviso!');
console.error('Erro crítico!');
console.info('Info útil');
console.debug('Debug info');

// Objetos são automaticamente formatados
console.log('Dados do usuário:', { id: 1, name: 'João' });
```

### Importando o logger diretamente

Se você precisar usar funcionalidades extras:

```typescript
import { logger } from '../services/loggerService';

// Obter todos os logs
const logs = await logger.getLogs();

// Obter logs dos últimos 30 minutos
const recentLogs = await logger.getRecentLogs(30);

// Obter apenas erros
const errors = await logger.getLogsByLevel('error');

// Exportar logs como string
const logsText = await logger.exportLogs();

// Limpar todos os logs
await logger.clearLogs();

// Usar console original sem salvar
logger.useOriginalConsole().log('Isso não será salvo');
```

## Tela de Visualização de Logs

Uma tela foi criada para visualizar os logs: `LogViewerScreen`.

### Funcionalidades da Tela:

- **Visualizar logs**: Lista todos os logs com timestamp e nível
- **Filtros**: Filtrar por nível (Todos, Erros, Avisos, Info)
- **Atualizar**: Pull-to-refresh para recarregar logs
- **Limpar**: Botão para limpar todos os logs
- **Exportar**: Compartilhar logs via share sheet

### Como adicionar ao navegador:

Adicione ao seu `AppNavigator.tsx`:

```typescript
import { LogViewerScreen } from '../screens/LogViewerScreen';

// Em alguma stack ou drawer:
<Stack.Screen
  name="LogViewer"
  component={LogViewerScreen}
  options={{ title: 'Logs do App' }}
/>;
```

## Estrutura dos Logs

Cada log possui a seguinte estrutura:

```typescript
interface LogEntry {
  timestamp: string; // ISO 8601 timestamp
  level: 'log' | 'warn' | 'error' | 'info' | 'debug';
  message: string; // Mensagem formatada
  data?: any; // Dados adicionais (opcional)
}
```

## Armazenamento

- **Chave no AsyncStorage**: `@percli_app_logs`
- **Limite de logs**: 1000 (os mais antigos são removidos)
- **Limpeza**: Automática ao iniciar o app
- **Local de armazenamento**: AsyncStorage (fácil acesso via dev tools)

## Exemplos de Uso Prático

### Debug de API

```typescript
async function fetchUserData(userId: string) {
  console.log('Buscando dados do usuário:', userId);

  try {
    const response = await api.get(`/users/${userId}`);
    console.info('Dados recebidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw error;
  }
}
```

### Tracking de eventos

```typescript
function onUserLogin(user: User) {
  console.log('Login realizado:', {
    userId: user.id,
    email: user.email,
    timestamp: new Date().toISOString(),
  });
}

function onScreenView(screenName: string) {
  console.debug('Screen view:', screenName);
}
```

### Debug de erros

```typescript
try {
  // código que pode falhar
} catch (error) {
  console.error('Erro capturado:', {
    message: error.message,
    stack: error.stack,
    context: 'Função XYZ',
  });
}
```

## Acessando Logs via AsyncStorage

Você pode acessar os logs diretamente via React Native Debugger ou Flipper:

1. Abra o React Native Debugger
2. Vá para a aba "AsyncStorage"
3. Procure pela chave `@percli_app_logs`
4. Visualize os logs em formato JSON

## Performance

- ✅ Salvamento assíncrono (não bloqueia a UI)
- ✅ Limite de logs para não consumir muita memória
- ✅ Formatação eficiente de objetos
- ✅ Limpeza automática de logs antigos

## Dicas

1. **Em produção**: Você pode desabilitar o logger ou ajustar o nível de logs em produção
2. **Debug remoto**: Use a função `exportLogs()` para obter logs de usuários em produção
3. **Filtros**: Use `getLogsByLevel()` para focar em tipos específicos de logs
4. **Logs recentes**: Use `getRecentLogs(30)` para ver apenas os últimos 30 minutos

## Troubleshooting

### Os logs não estão sendo salvos

Verifique se o logger foi inicializado no `App.tsx`:

```typescript
useEffect(() => {
  logger.initialize();
}, []);
```

### AsyncStorage está cheio

O logger limita automaticamente a 1000 logs. Se ainda assim tiver problemas, reduza o valor de `MAX_LOGS` em `loggerService.ts`.

### Quero desabilitar em produção

```typescript
if (__DEV__) {
  logger.initialize();
}
```

## API Completa

| Método                   | Descrição                                     |
| ------------------------ | --------------------------------------------- |
| `initialize()`           | Inicializa o logger (chamado automaticamente) |
| `getLogs()`              | Retorna todos os logs                         |
| `getLogsByLevel(level)`  | Retorna logs de um nível específico           |
| `getRecentLogs(minutes)` | Retorna logs dos últimos N minutos            |
| `exportLogs()`           | Exporta logs como string formatada            |
| `clearLogs()`            | Limpa todos os logs                           |
| `useOriginalConsole()`   | Retorna console original (sem salvar)         |

## Contribuindo

Para adicionar novos recursos ao logger, edite o arquivo:
`src/services/loggerService.ts`
