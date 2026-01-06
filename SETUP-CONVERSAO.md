# 🚀 CONFIGURAÇÃO FINAL - Sistema de Conversão Real

## ✅ O QUE JÁ FOI IMPLEMENTADO:

1. ✅ Step 12 atualizado com campos de **Nome e Email**
2. ✅ API `/api/save-lead.js` (salva leads no Firebase)
3. ✅ API `/api/hotmart-webhook.js` (recebe notificações de venda)
4. ✅ Validação de email e nome
5. ✅ Feedback visual de erros

---

## 📋 PRÓXIMOS PASSOS (VOCÊ PRECISA FAZER):

### **1️⃣ OBTER CREDENCIAIS DO FIREBASE**

1. Acesse: https://console.firebase.google.com/
2. Selecione: **quiz-gelatina-bariatrica**
3. Clique na engrenagem ⚙️ → **Project Settings** → **Service Accounts**
4. Clique em **"Generate New Private Key"**
5. Download do arquivo JSON

---

### **2️⃣ ADICIONAR VARIÁVEIS NO VERCEL**

1. Acesse: https://vercel.com/dashboard
2. Entre no projeto: **quiz-gelatina-bariatrica**
3. **Settings** → **Environment Variables**
4. Adicione estas 3 variáveis:

```
FIREBASE_PROJECT_ID
quiz-gelatina-bariatrica

FIREBASE_CLIENT_EMAIL
firebase-adminsdk-xxxxx@quiz-gelatina-bariatrica.iam.gserviceaccount.com

FIREBASE_PRIVATE_KEY
-----BEGIN PRIVATE KEY-----
(cole a chave completa do JSON aqui)
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANTE:** 
- Cole a chave **COM** as quebras de linha `\n`
- Mantenha as aspas se tiver espaços

5. Clique em **Save**

---

### **3️⃣ FAZER REDEPLOY NO VERCEL**

1. Vá em **Deployments**
2. Clique nos **3 pontinhos** do último deploy
3. **Redeploy**
4. Aguarde ~1 minuto

---

### **4️⃣ TESTAR O SALVAMENTO DE LEADS**

1. Acesse: https://quiz-gelatina-bariatrica.vercel.app/
2. Complete o quiz até o **Step 12**
3. Preencha:
   - Nome: Seu nome
   - Email: seu@email.com
4. Clique em **"CALCULAR PERFIL"**
5. Veja no console (F12):
   ```
   ✅ Lead salvo com sucesso
   ```

---

### **5️⃣ VERIFICAR NO FIREBASE**

1. Firebase Console → **Firestore Database** → **Data**
2. Deve aparecer coleção: **`quiz_leads`**
3. Verifique se tem seu registro com:
   - session_id
   - name
   - email
   - timestamp

---

### **6️⃣ CONFIGURAR WEBHOOK NO HOTMART**

1. Acesse: https://app.hotmart.com/
2. **Minha Conta** → **Ferramentas** → **Hot Connect** → **Webhooks**
3. Clique em **"Novo Webhook"**
4. Preencha:

```
URL do Webhook:
https://quiz-gelatina-bariatrica.vercel.app/api/hotmart-webhook

Eventos:
☑️ PURCHASE_APPROVED
☑️ PURCHASE_COMPLETE
```

5. Clique em **"Salvar"**

---

### **7️⃣ TESTAR WEBHOOK (SANDBOX)**

1. No Hotmart, clique em **"Testar Webhook"**
2. Escolha evento: **PURCHASE_APPROVED**
3. Use o mesmo email que você cadastrou no quiz
4. Clique em **"Enviar Teste"**

---

### **8️⃣ VERIFICAR CONVERSÃO NO FIREBASE**

1. Firebase Console → **Firestore Database**
2. Nova coleção: **`conversoes`**
3. Deve ter:
   - session_id (do quiz)
   - email
   - transaction_id
   - value
   - timestamp

---

### **9️⃣ VERIFICAR NO DASHBOARD**

1. Acesse: https://quiz-gelatina-bariatrica.vercel.app/dashboard.html
2. O KPI **"📺 Visualizações do VSL"** ainda existe
3. **Mas agora você pode adicionar um novo KPI de conversões reais**

---

## 🎯 RESUMO DO FLUXO:

```
1. Usuário faz quiz
2. Step 12: Insere nome + email
3. API salva em: quiz_leads (converted=false)
4. Usuário assiste VSL
5. Usuário compra no Hotmart
6. Hotmart envia webhook → /api/hotmart-webhook
7. API busca lead pelo email
8. API cria registro em: conversoes
9. API marca lead como: converted=true
10. Dashboard mostra conversão real
```

---

## 🚨 PROBLEMAS COMUNS:

### **"Internal server error" ao enviar formulário**
→ Variáveis de ambiente não configuradas no Vercel

### **"Lead not found" no webhook**
→ Email do Hotmart diferente do email do quiz

### **Webhook não chegou**
→ URL errada ou Hotmart bloqueou

---

## 🆘 PRECISA DE AJUDA?

Me chame e te ajudo a:
- Configurar as variáveis no Vercel
- Testar o webhook
- Ver logs de erro
- Debugar qualquer problema

---

**Sistema de conversão 100% pronto! Só falta configurar! 🚀**
