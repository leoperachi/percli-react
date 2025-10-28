# Integração do Chat com Backend NestJS

## Visão Geral

O sistema de chat do aplicativo React Native foi integrado com o backend NestJS (branch `mongodb`). A integração utiliza tanto HTTP REST API quanto WebSocket (Socket.IO) para comunicação em tempo real.

## Arquitetura

### Backend
- **URL Base**: Configurada em `.env` (`API_BASE_URL`)
- **Porta**: 3000 (padrão)
- **Autenticação**: JWT Bearer Token
- **WebSocket**: Socket.IO com autenticação via token

### Frontend
- **HTTP Client**: Axios (via `apiService`)
- **WebSocket Client**: Socket.IO Client (via `socketService`)
- **Estado**: React Context API (`ChatContext`)

## Configuração

### Variáveis de Ambiente

Crie ou atualize o arquivo `.env`:

```bash
API_BASE_URL=http://localhost:3000
API_TIMEOUT=10000
```

### Autenticação

O sistema usa JWT Bearer Tokens que são:
1. Armazenados localmente após login
2. Enviados automaticamente em requests HTTP via header `Authorization`
3. Enviados no handshake do WebSocket via `auth.token`

## Endpoints HTTP Disponíveis

### Gerenciamento de Chats

#### `GET /chats`
Lista todos os chats do usuário
```typescript
const response = await apiService.getUserChats(page, limit);
```

#### `POST /chats`
Cria um novo chat
```typescript
const response = await apiService.createChat({
  participantIds: ['user-id'],
  name: 'Nome do Chat',
  description: 'Descrição',
  isGroup: false
});
```

#### `GET /chats/direct/:userId`
Obtém ou cria chat direto com usuário
```typescript
const response = await apiService.getOrCreateDirectChat(userId);
```

#### `GET /chats/:chatId`
Obtém detalhes de um chat específico
```typescript
const response = await apiService.getChatById(chatId);
```

#### `PUT /chats/:chatId`
Atualiza informações do chat
```typescript
const response = await apiService.updateChat(chatId, {
  name: 'Novo Nome',
  description: 'Nova Descrição'
});
```

### Mensagens

#### `GET /chats/:chatId/messages`
Lista mensagens do chat
```typescript
const response = await apiService.getChatMessages(chatId, page, limit);
```

#### `POST /chats/:chatId/messages`
Envia uma mensagem
```typescript
const response = await apiService.sendChatMessage(chatId, {
  content: 'Olá!',
  messageType: 'text',
  replyToId: 'msg-id' // opcional
});
```

#### `PUT /chats/messages/:messageId`
Edita uma mensagem
```typescript
const response = await apiService.editMessage(messageId, 'Novo conteúdo');
```

#### `DELETE /chats/messages/:messageId`
Deleta uma mensagem
```typescript
const response = await apiService.deleteMessage(messageId);
```

#### `POST /chats/:chatId/messages/read`
Marca mensagens como lidas
```typescript
const response = await apiService.markMessagesAsRead(chatId, messageIds);
```

#### `GET /chats/:chatId/messages/unread-count`
Obtém contagem de não lidas
```typescript
const response = await apiService.getUnreadCount(chatId);
```

#### `GET /chats/messages/unread/all`
Obtém todas as mensagens não lidas
```typescript
const response = await apiService.getAllUnreadMessages();
```

#### `GET /chats/conversations/recent`
Obtém conversas recentes
```typescript
const response = await apiService.getRecentConversations();
```

## Eventos WebSocket

### Eventos do Cliente → Servidor

#### `user:join`
Conecta o usuário ao sistema (automático ao conectar)
```typescript
socketService.joinUser(userId, userName);
```

#### `chat:join`
Entra em um chat específico
```typescript
socketService.joinChat(chatId);
```

#### `chat:leave`
Sai de um chat específico
```typescript
socketService.leaveChat(chatId);
```

#### `message:send`
Envia mensagem via WebSocket
```typescript
socketService.sendMessage({
  chatId: 'chat-id',
  content: 'Olá!',
  messageType: 'text',
  replyToId: 'msg-id' // opcional
});
```

#### `message:edit`
Edita uma mensagem
```typescript
socketService.editMessage(messageId, 'Novo conteúdo', chatId);
```

#### `message:delete`
Deleta uma mensagem
```typescript
socketService.deleteMessage(messageId, chatId);
```

#### `message:mark_read`
Marca mensagens como lidas
```typescript
socketService.markMessagesRead(chatId, messageIds);
```

#### `typing:start`
Indica que está digitando
```typescript
socketService.startTyping(chatId);
```

#### `typing:stop`
Para de digitar
```typescript
socketService.stopTyping(chatId);
```

#### `get_recent_conversations`
Solicita conversas recentes
```typescript
socketService.getRecentConversations();
```

### Eventos do Servidor → Cliente

#### `message:new`
Nova mensagem recebida
```typescript
socket.on('message:new', (message) => {
  console.log('Nova mensagem:', message);
});
```

#### `message:edited`
Mensagem foi editada
```typescript
socket.on('message:edited', (message) => {
  console.log('Mensagem editada:', message);
});
```

#### `message:deleted`
Mensagem foi deletada
```typescript
socket.on('message:deleted', ({ messageId, chatId }) => {
  console.log('Mensagem deletada:', messageId);
});
```

#### `messages:read`
Mensagens foram lidas
```typescript
socket.on('messages:read', ({ chatId, userId, messageIds }) => {
  console.log('Mensagens lidas:', messageIds);
});
```

#### `user:typing`
Usuário está digitando/parou
```typescript
socket.on('user:typing', ({ chatId, user, isTyping }) => {
  console.log(`${user.name} ${isTyping ? 'está' : 'parou de'} digitar`);
});
```

#### `user:online`
Usuário ficou online
```typescript
socket.on('user:online', ({ userId, userName }) => {
  console.log(`${userName} está online`);
});
```

#### `user:offline`
Usuário ficou offline
```typescript
socket.on('user:offline', ({ userId }) => {
  console.log('Usuário offline');
});
```

#### `user:joined_chat`
Usuário entrou no chat
```typescript
socket.on('user:joined_chat', ({ chatId, user }) => {
  console.log(`${user.name} entrou no chat`);
});
```

#### `user:left_chat`
Usuário saiu do chat
```typescript
socket.on('user:left_chat', ({ chatId, user }) => {
  console.log(`${user.name} saiu do chat`);
});
```

#### `unread_messages_count`
Contagem de mensagens não lidas (enviado ao conectar)
```typescript
socket.on('unread_messages_count', ({ unreadMessages }) => {
  console.log('Mensagens não lidas:', unreadMessages);
});
```

#### `recent_conversations`
Conversas recentes (enviado ao conectar)
```typescript
socket.on('recent_conversations', ({ conversations }) => {
  console.log('Conversas recentes:', conversations);
});
```

## Fluxo de Uso

### 1. Login e Conexão
```typescript
// 1. Usuário faz login
await apiService.login(email, password);

// 2. Socket conecta automaticamente (via ChatContext)
// 3. Evento user:join é emitido automaticamente
// 4. Servidor envia unread_messages_count e recent_conversations
```

### 2. Listar Chats
```typescript
// Via ChatContext
const { chats, loadChats } = useChatContext();

useEffect(() => {
  loadChats();
}, []);
```

### 3. Abrir um Chat
```typescript
// Via ChatContext
const { setCurrentChat } = useChatContext();

// Ao abrir o chat:
// 1. Leave do chat anterior (se houver)
// 2. Join no novo chat (Socket.IO)
// 3. Carrega mensagens (HTTP)
// 4. Marca como lidas (Socket.IO + HTTP)
setCurrentChat(chat);
```

### 4. Enviar Mensagem
```typescript
// Via ChatContext
const { sendMessage } = useChatContext();

// Envia via Socket.IO e HTTP (fallback)
await sendMessage(text, receiverId, replyToId);

// Servidor broadcasta message:new para todos no chat
```

### 5. Receber Mensagens em Tempo Real
```typescript
// ChatContext já ouve eventos automaticamente
// Mensagens aparecem no state.messages automaticamente
```

## Estrutura de Dados

### Chat
```typescript
interface Chat {
  id: string;
  chatName?: string;
  chatType: 'direct' | 'group';
  participants: Participant[];
  lastMessage?: ChatMessage;
  lastActivity: string;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}
```

### Message
```typescript
interface ChatMessage {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  chatId: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
  replyTo?: string;
  fileUrl?: string;
  fileName?: string;
}
```

## Tratamento de Erros

### Conexão WebSocket Perdida
```typescript
// Socket reconecta automaticamente
socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
  // Socket.IO tentará reconectar automaticamente
});

socket.on('connect', () => {
  console.log('Reconectado!');
  // user:join é emitido automaticamente
});
```

### Mensagem Não Entregue
```typescript
// Sistema usa HTTP como fallback
// Se WebSocket falhar, HTTP garante entrega
await apiService.sendChatMessage(chatId, data);
```

## Boas Práticas

1. **Use Socket.IO para tempo real**: Mensagens, typing indicators, etc.
2. **Use HTTP para dados históricos**: Listar chats, carregar mensagens antigas
3. **Implemente fallback**: HTTP como backup do WebSocket
4. **Otimize atualizações**: Use WebSocket events para atualizar UI sem polling
5. **Gerencie estado corretamente**: ChatContext centraliza todo o estado

## Debugging

### Ativar logs do Socket.IO
```typescript
// Em socketService.ts, todos os eventos já têm console.log
// Verifique o console do React Native para ver:
// - [SocketService] eventos
// - [ChatContext] processamento de mensagens
```

### Verificar conexão
```typescript
const isConnected = socketService.isConnected();
console.log('Socket conectado?', isConnected);
```

### Ver mensagens não lidas
```typescript
const response = await apiService.getAllUnreadMessages();
console.log('Não lidas:', response.data);
```

## Troubleshooting

### Socket não conecta
1. Verifique se `API_BASE_URL` está correto no `.env`
2. Verifique se token JWT é válido
3. Verifique logs do backend NestJS
4. Verifique se CORS está configurado corretamente

### Mensagens não aparecem
1. Verifique se `chat:join` foi chamado
2. Verifique listeners do Socket.IO no ChatContext
3. Verifique transformação de dados (backend → frontend)
4. Verifique console para erros

### Mensagens duplicadas
1. Verifique se está usando HTTP E Socket.IO para enviar
2. Socket.IO deve ser usado apenas para envio, HTTP para fallback
3. Backend broadcasta para todos, cliente não deve adicionar localmente

## Próximos Passos

- [ ] Implementar upload de imagens/arquivos
- [ ] Adicionar indicador de "digitando..."
- [ ] Implementar notificações push
- [ ] Adicionar suporte a grupos
- [ ] Implementar chamadas de voz/vídeo
- [ ] Adicionar criptografia end-to-end

## Referências

- Backend NestJS: https://github.com/leoperachi/percli-nestjs.git (branch mongodb)
- Socket.IO Client: https://socket.io/docs/v4/client-api/
- React Context API: https://react.dev/reference/react/useContext
