# Guia de Diagnóstico: Socket get_recent_conversations

## 🔍 Problema Identificado

Você não está conseguindo chamar o `get_recent_conversations` no socket. Implementei logs detalhados para diagnosticar o problema.

## ✅ O que foi feito

### 1. **Logs adicionados no `socketService.ts`**

- ✅ Log quando tenta conectar
- ✅ Log quando conecta com sucesso
- ✅ Log de erros de conexão
- ✅ Log quando desconecta
- ✅ Log quando emite eventos
- ✅ Log quando recebe `recent_conversations`
- ✅ Log específico ao chamar `getRecentConversations()`

### 2. **Melhorias no `RightDrawer.tsx`**

- ✅ Aguarda conexão antes de solicitar conversas
- ✅ Verifica se socket já está conectado antes de solicitar
- ✅ Logs detalhados de cada etapa
- ✅ Tratamento de erros do socket

## 🔎 Como Diagnosticar o Problema

### Passo 1: Abra o App e os Logs

1. Abra o app
2. Abra o menu lateral **esquerdo** (Left Drawer)
3. Clique em **"Logs do App"** 🐛
4. Filtre por **"Todos"** para ver todos os logs

### Passo 2: Abra o Right Drawer

1. Volte para a tela principal
2. Abra o menu lateral **direito** (Right Drawer)
3. Observe os logs que aparecem

### Passo 3: Analise os Logs

Procure por estes logs (em ordem):

#### ✅ **Logs Esperados (Sucesso)**

```
[SocketService] Iniciando conexão do socket
[SocketService] Token obtido, conectando ao servidor: <URL>
[SocketService] ✅ Socket conectado com sucesso! ID: <socket_id>
[RightDrawer] Iniciando configuração do socket
[RightDrawer] Socket já está conectado
[RightDrawer] Socket obtido, configurando listeners
[RightDrawer] Socket já conectado, solicitando conversas imediatamente
[SocketService] 🔄 Solicitando conversas recentes...
[SocketService] 📤 Emitindo evento: get_recent_conversations (sem dados)
[SocketService] 📬 Recebeu evento recent_conversations: <dados>
[RightDrawer] Recebeu recent_conversations: <dados>
```

#### ❌ **Possíveis Problemas**

##### **Problema 1: Socket não conecta**

```
[SocketService] Iniciando conexão do socket
[SocketService] ❌ Erro ao conectar socket: <erro>
```

**Solução:**

- Verifique se o backend está rodando
- Verifique a URL do servidor em `ENV.API_BASE_URL`
- Verifique se há conexão com a internet

##### **Problema 2: Token não encontrado**

```
[SocketService] Token não fornecido, buscando no storage
[SocketService] ❌ Token não encontrado, não é possível conectar
```

**Solução:**

- Faça logout e login novamente
- Verifique se o token está sendo salvo corretamente

##### **Problema 3: Erro de autenticação**

```
[SocketService] ❌ Erro ao conectar socket: <auth error>
[SocketService] Erro de autenticação, desconectando
```

**Solução:**

- O token pode estar expirado
- Faça logout e login novamente
- Verifique a configuração de autenticação no backend

##### **Problema 4: Socket conecta mas não emite**

```
[SocketService] ✅ Socket conectado com sucesso!
[RightDrawer] Socket já conectado, solicitando conversas imediatamente
[SocketService] ⚠️ Tentativa de emitir evento sem socket conectado: get_recent_conversations
```

**Solução:**

- O socket pode ter desconectado logo após conectar
- Verifique os logs de desconexão
- Pode ser um problema no backend

##### **Problema 5: Emite mas não recebe resposta**

```
[SocketService] 📤 Emitindo evento: get_recent_conversations
(Não aparece o log de "Recebeu evento recent_conversations")
```

**Solução:**

- O backend não está respondendo ao evento
- Verifique se o backend está escutando o evento `get_recent_conversations`
- Verifique se o backend está emitindo `recent_conversations` de volta

## 🛠️ Checklist de Diagnóstico

Use este checklist para diagnosticar:

- [ ] Backend está rodando?
- [ ] App está conectado à internet?
- [ ] Usuário está logado?
- [ ] Token existe no storage?
- [ ] Socket conecta com sucesso?
- [ ] Evento é emitido?
- [ ] Backend responde com `recent_conversations`?

## 📊 Exportar Logs para Análise

Se precisar enviar os logs para alguém analisar:

1. Abra a tela "Logs do App"
2. Clique no botão **"Exportar"**
3. Compartilhe os logs via email, WhatsApp, etc.

## 🔧 Verificações no Backend

### Verificar se o evento está sendo recebido no backend

No backend, adicione um log:

```javascript
socket.on('get_recent_conversations', () => {
  console.log('Recebeu get_recent_conversations do cliente:', socket.id);

  // Seu código aqui
  // ...

  socket.emit('recent_conversations', { conversations: [...] });
});
```

### Verificar se o usuário está autenticado

```javascript
io.use((socket, next) => {
  console.log('Autenticando socket:', socket.id);
  console.log('Token:', socket.handshake.auth.token);

  // Sua lógica de autenticação
  // ...

  next();
});
```

## 🐛 Forçar Reconexão

Se o socket não conectar, você pode forçar uma reconexão:

1. Adicione um botão no `RightDrawer`:

```typescript
<TouchableOpacity
  onPress={() => {
    console.log('Forçando reconexão...');
    socketService.disconnect();
    setTimeout(() => {
      socketService.connect().then(() => {
        socketService.getRecentConversations();
      });
    }, 1000);
  }}
>
  <Text>🔄 Reconectar</Text>
</TouchableOpacity>
```

## 📱 Testar com Logs

Para testar se os logs estão funcionando, você pode executar manualmente:

1. Abra o console do React Native
2. Execute:

```javascript
import { socketService } from './src/services/socketService';

// Testar conexão
socketService.connect();

// Testar get_recent_conversations
socketService.getRecentConversations();

// Verificar se está conectado
console.log('Conectado?', socketService.isConnected());
```

## ✅ Próximos Passos

1. **Rode o app e abra os logs**
2. **Abra o Right Drawer**
3. **Veja qual erro aparece nos logs**
4. **Use este guia para diagnosticar**
5. **Se necessário, exporte os logs e compartilhe**

## 💡 Dicas Extras

- Os logs são salvos automaticamente no AsyncStorage
- Você pode limpar os logs antigos clicando em "Limpar Logs"
- Os logs são limpos automaticamente quando o app reinicia
- Use os filtros para focar em erros ou avisos

---

**Agora você tem visibilidade completa do que está acontecendo com o socket!** 🎉
