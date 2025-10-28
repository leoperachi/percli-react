# 🔍 Como Ver os Erros nos Logs

## 🎯 Opções para Ver os Erros

Criei várias formas de você ver os erros facilmente:

---

## 📱 **Opção 1: Na Tela do App (Mais Fácil)**

### Passo a Passo:

```
1. Abra o app
2. Menu lateral ESQUERDO
3. Clique em "Logs do App" 🐛
4. Clique no filtro "Erros"
```

Pronto! Você verá **apenas os erros** na lista.

---

## 💻 **Opção 2: No Console (Modo Desenvolvedor)**

Se você tem acesso ao console do React Native:

### Ver Resumo Rápido:

```javascript
import LogAnalyzer from './src/services/logAnalyzer';

// Imprime resumo geral
await LogAnalyzer.printSummary();
```

**Resultado:**

```
📊 RESUMO DOS LOGS
==================================================

Total de logs: 150

❌ Erros: 5
⚠️ Avisos: 12
ℹ️ Info: 45
🔍 Debug: 88
📝 Log: 0

⚠️ Atenção: Há problemas nos logs!
```

### Ver Apenas Erros:

```javascript
// Imprime todos os erros
await LogAnalyzer.printErrors();
```

### Ver Erros + Avisos:

```javascript
// Imprime erros e avisos
await LogAnalyzer.printProblems();
```

### Ver Erros Agrupados:

```javascript
// Agrupa erros do mesmo tipo
const grouped = await LogAnalyzer.exportGroupedErrors();
console.log(grouped);
```

---

## 📤 **Opção 3: Exportar e Compartilhar**

### Exportar Apenas Erros:

1. **Via Tela do App:**

   ```
   1. Abra "Logs do App"
   2. Filtre por "Erros"
   3. Clique em "Exportar"
   4. Compartilhe via WhatsApp/Email
   ```

2. **Via Console:**

   ```javascript
   import LogAnalyzer from './src/services/logAnalyzer';

   // Exporta apenas erros
   const errors = await LogAnalyzer.exportErrors();
   console.log(errors);

   // Ou copia e cola
   copy(errors); // Se disponível no console
   ```

---

## 🛠️ **Opção 4: Análise Avançada (Para Você)**

Criei funções específicas para análise:

### Ver Erros Específicos do Socket:

```javascript
import LogAnalyzer from './src/services/logAnalyzer';

// Busca erros relacionados ao socket
const socketErrors = await LogAnalyzer.searchByPattern('[SocketService]');
console.log(
  'Erros do Socket:',
  socketErrors.filter(l => l.level === 'error'),
);
```

### Ver Erros Recentes (Últimos 30 min):

```javascript
const recent = await LogAnalyzer.getRecentLogs(30);
const recentErrors = recent.filter(l => l.level === 'error');
console.log('Erros recentes:', recentErrors);
```

### Buscar Erro Específico:

```javascript
// Busca por texto
const searchResults = await LogAnalyzer.searchLogs('Token não encontrado');
console.log('Resultados:', searchResults);
```

---

## 🚀 **Modo Rápido: Me Envie os Erros**

### Para me enviar os erros para análise:

**Método 1: Via App**

```
1. Abra "Logs do App"
2. Filtre por "Erros"
3. Clique "Exportar"
4. Envie o texto para mim
```

**Método 2: Via Console**

```javascript
import LogAnalyzer from './src/services/logAnalyzer';

// Gera relatório completo
const summary = await LogAnalyzer.getSummary();
const problems = await LogAnalyzer.exportProblems();

console.log(summary);
console.log('\n\n');
console.log(problems);

// Copie e cole todo o texto e me envie
```

---

## 📊 **Exemplo de Saída**

Quando você rodar `LogAnalyzer.exportProblems()`, verá algo assim:

```
⚠️ PROBLEMAS ENCONTRADOS (7)
==================================================

❌ ERRO #1
Data: 27/10/2025 14:35:22
Mensagem: [SocketService] ❌ Erro ao conectar socket:
Dados:
{
  "message": "connect ECONNREFUSED 127.0.0.1:3000",
  "code": "ECONNREFUSED"
}
--------------------------------------------------

⚠️ AVISO #2
Data: 27/10/2025 14:36:10
Mensagem: [SocketService] ⚠️ Tentativa de emitir evento sem socket conectado: get_recent_conversations
--------------------------------------------------

❌ ERRO #3
Data: 27/10/2025 14:37:45
Mensagem: [SocketService] Token não encontrado, não é possível conectar
--------------------------------------------------
```

---

## 🎯 **Checklist: O Que Fazer Agora**

- [ ] Abra a tela "Logs do App"
- [ ] Filtre por "Erros"
- [ ] Veja quantos erros existem
- [ ] Se houver erros, clique "Exportar"
- [ ] Me envie o texto exportado
- [ ] **OU** rode os comandos do console e me envie a saída

---

## 🔥 **Atalho Super Rápido**

Cole isso no console do React Native e me envie a saída:

```javascript
import LogAnalyzer from './src/services/logAnalyzer';

(async () => {
  console.log('=== ANÁLISE DE LOGS ===\n');

  const summary = await LogAnalyzer.getSummary();
  console.log(summary);

  const problems = await LogAnalyzer.exportProblems();
  console.log('\n\n');
  console.log(problems);

  const grouped = await LogAnalyzer.exportGroupedErrors();
  console.log('\n\n');
  console.log(grouped);
})();
```

**Copie TODA a saída e me envie!**

---

## 💡 **Dicas**

1. **Filtre primeiro**: Use o filtro "Erros" na tela antes de exportar
2. **Limpe logs antigos**: Se houver muitos logs, limpe os antigos primeiro
3. **Reproduza o problema**: Limpe logs → Use o app → Veja novos erros
4. **Console é mais completo**: O console mostra stack traces completas

---

## ❓ **Perguntas Frequentes**

### "Não vejo erros na tela"

✅ Pode ser que não haja erros! Use o filtro "Avisos" também.

### "Quero ver erros específicos do socket"

✅ Use: `await LogAnalyzer.searchByPattern('[SocketService]')`

### "Tenho muitos logs, demora para exportar"

✅ Filtre por "Erros" antes de exportar, ou limpe logs antigos primeiro.

### "Como exporto pelo console?"

✅ Use `await LogAnalyzer.exportProblems()` e copie a saída.

---

## 🎯 **Resultado Final**

Depois de seguir estes passos, você terá:

- ✅ Lista de todos os erros
- ✅ Texto formatado para compartilhar
- ✅ Análise agrupada por tipo
- ✅ Resumo geral dos problemas

**Me envie qualquer uma dessas saídas e poderei te ajudar!** 🚀
