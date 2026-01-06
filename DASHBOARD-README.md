# 📊 Dashboard Analytics - Quiz Gelatina Bariátrica

## KPIs Atuais

### ✅ Implementados
- **👥 Visitantes Únicos:** Conta sessões únicas no funil
- **📺 Visualizações do VSL:** % que chegou até o vídeo (Step 14)
- **⏱️ Tempo Médio:** Tempo médio por sessão completa
- **🔴 Maior Abandono:** Etapa com maior % de saída

### ⏳ Para Implementar: Taxa de Conversão Real

**O que é:** % de visitantes que realmente COMPRARAM o produto.

---

## 🔧 Como Implementar Conversão Real (Hotmart Webhook)

### **Passo 1: Criar Novo Campo no Firestore**

Adicione uma nova coleção: `conversoes`

```javascript
{
  session_id: "sess_abc123",
  transaction_id: "HP12345",
  email: "cliente@email.com",
  value: 97.00,
  timestamp: "2026-01-06T15:30:00Z",
  produto: "Gelatina Bariátrica"
}
```

---

### **Passo 2: Configurar Webhook no Hotmart**

1. Acesse: **Hotmart** → **Minha Conta** → **Ferramentas** → **Integração**
2. **Postback URL:**
   ```
   https://SUA_API.com/webhook/hotmart
   ```
3. Ative para eventos:
   - ✅ `PURCHASE_COMPLETE`
   - ✅ `PURCHASE_APPROVED`

---

### **Passo 3: Criar Backend (Node.js + Firebase)**

```javascript
// webhook-hotmart.js
const express = require('express');
const admin = require('firebase-admin');
const app = express();

app.use(express.json());

// Endpoint do webhook
app.post('/webhook/hotmart', async (req, res) => {
    const { event, data } = req.body;
    
    // Verificar se é compra aprovada
    if (event === 'PURCHASE_APPROVED') {
        const { transaction, buyer } = data;
        
        // Buscar session_id do email (se salvo anteriormente)
        const sessionDoc = await admin.firestore()
            .collection('funnel_users')
            .where('email', '==', buyer.email)
            .limit(1)
            .get();
        
        if (!sessionDoc.empty) {
            const sessionId = sessionDoc.docs[0].data().session_id;
            
            // Salvar conversão
            await admin.firestore()
                .collection('conversoes')
                .add({
                    session_id: sessionId,
                    transaction_id: transaction,
                    email: buyer.email,
                    value: data.purchase.price.value,
                    timestamp: new Date().toISOString(),
                    produto: data.product.name
                });
        }
    }
    
    res.status(200).send('OK');
});

app.listen(3000);
```

---

### **Passo 4: Atualizar Dashboard**

Adicione ao `dashboard.html`:

```javascript
// Buscar conversões
function loadConversions(db) {
    db.collection('conversoes')
        .onSnapshot(snapshot => {
            const conversions = [];
            snapshot.forEach(doc => conversions.push(doc.data()));
            
            // Calcular taxa real
            const totalSessions = getTotalSessions();
            const conversionRate = (conversions.length / totalSessions) * 100;
            
            document.getElementById('kpi-conversion').innerText = `${conversionRate.toFixed(1)}%`;
            document.getElementById('kpi-conversion-info').innerText = `${conversions.length} vendas`;
        });
}
```

---

### **Passo 5: Salvar Email no Quiz**

No `index.html`, na etapa de coleta de dados (Step 12):

```javascript
// Salvar email para vincular com conversão futura
function saveUserData(name, email, age) {
    const sessionId = localStorage.getItem('funnel_session_id');
    
    db.collection('funnel_users').add({
        session_id: sessionId,
        name: name,
        email: email,
        age: age,
        timestamp: new Date().toISOString()
    });
}
```

---

## 📊 Resultado Final

Com essa implementação, o dashboard mostrará:

```
🎯 Taxa de Conversão
12.5%
15 vendas de 120 visitantes
```

---

## 🚀 Alternativa Simples (Sem Backend)

Se não puder criar backend, use **Zapier**:

1. **Hotmart Webhook** → Zapier
2. **Zapier** → Firebase (via REST API)
3. Salva diretamente na coleção `conversoes`

**Custo:** ~$20/mês (plano Starter)

---

## 💡 Recomendação

Por enquanto, o KPI **"Visualizações do VSL"** é uma métrica válida que mostra quantos % chegam ao vídeo de vendas. Para taxa de conversão real, implemente o webhook do Hotmart quando tiver volume suficiente de vendas.

---

**Dúvidas?** Entre em contato! 🚀
