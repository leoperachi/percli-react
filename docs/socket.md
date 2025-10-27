📡 Rotas de Socket - Mensagens Não Lidas e Usuários

1. Eventos que o SERVIDOR envia ao CLIENTE:
   🔴 unread_messages_count
   Quando é enviado: Automaticamente ao conectar
   Payload:
   {
   unreadMessages: number // Total de mensagens não lidas
   }
   Código: socket_service.ts:109
   👥 recent_conversations
   Quando é enviado: Automaticamente ao conectar
   Payload:
   {
   conversations: [
   {
   userId: string,
   name: string,
   email: string,
   profilePicture?: string,
   unreadCount: number, // Mensagens não lidas deste usuário
   lastMessageAt?: Date
   }
   ]
   }
   Código: socket_service.ts:122
   🔄 unread_count_updated
   Quando é enviado: Quando alguém envia mensagem para você
   Payload:
   {
   chatId: string,
   unreadCount: number
   }
2. Eventos que o CLIENTE pode enviar:
   📥 get_recent_conversations
   Quando usar: Para solicitar atualização manual das conversas recentes
   Payload: Nenhum
   Resposta: Recebe recent_conversations
   Código: socket_service.ts:80-82
3. Fluxo de Atualização Automática:
   As conversas recentes são atualizadas automaticamente quando:
   ✅ Ao conectar (linhas 62 e 65)
   ✅ Ao enviar mensagem (linha 262)
   ✅ Ao receber mensagem (linha 256)
   ✅ Ao marcar mensagens como lidas (linha 372)
4. Exemplo de Uso no Frontend:
   import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
auth: {
token: 'SEU_JWT_TOKEN'
}
});

// Receber conversas recentes ao conectar
socket.on('recent_conversations', (data) => {
console.log('Usuários:', data.conversations);
// Atualizar UI com a lista de usuários
// Usuários com mensagens não lidas vêm primeiro
// Depois, usuários ordenados alfabeticamente
});

// Receber contagem de mensagens não lidas
socket.on('unread_messages_count', (data) => {
console.log('Total não lidas:', data.unreadMessages);
});

// Solicitar atualização manual
socket.emit('get_recent_conversations');

// Atualização quando nova mensagem chega
socket.on('new_message', (message) => {
// A lista de conversas será atualizada automaticamente
console.log('Nova mensagem:', message);
}); 5. Ordem de Exibição (Implementada):
A lista recent_conversations retorna usuários nesta ordem:
🔴 Usuários com mensagens não lidas (ordenados por quantidade - maior para menor)
⚪ Usuários sem mensagens não lidas (ordenados alfabeticamente)
📋 Se não houver mensagens: Retorna todos os usuários alfabeticamente
Resumo: O evento principal para popular a região vermelha (Recent Conversations) é recent_conversations, que é enviado automaticamente e pode ser solicitado via get_recent_conversations.
