// ============================================================================
// VERCEL SERVERLESS FUNCTION - Hotmart Webhook
// ============================================================================
// Recebe notificações de venda do Hotmart e registra conversões

const admin = require('firebase-admin');

// Inicializar Firebase Admin
if (!admin.apps.length) {
    try {
        let credential;

        // Método 1: Usando variável JSON completa (FIREBASE_SERVICE_ACCOUNT)
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            credential = admin.credential.cert(serviceAccount);
        }
        // Método 2: Usando variáveis separadas
        else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
            credential = admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            });
        }
        else {
            throw new Error('Firebase credentials not configured. Add FIREBASE_SERVICE_ACCOUNT or individual vars.');
        }

        admin.initializeApp({ credential });
        console.log('✅ Firebase Admin initialized');
    } catch (error) {
        console.error('❌ Error initializing Firebase Admin:', error);
        throw error;
    }
}

const db = admin.firestore();

export default async function handler(req, res) {
    // Apenas POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { event, data } = req.body;

    console.log('📬 Hotmart Webhook received:', event);
    console.log('Data:', JSON.stringify(data, null, 2));

    // Processar apenas vendas aprovadas
    if (event === 'PURCHASE_APPROVED' || event === 'PURCHASE_COMPLETE') {
        const buyer = data?.buyer;
        const purchase = data?.purchase;
        const transaction = data?.transaction;

        if (!buyer || !buyer.email) {
            console.log('⚠️ Missing buyer email');
            return res.status(400).json({ error: 'Missing buyer email' });
        }

        try {
            // 1. Buscar lead pelo email (query simplificada - sem índice necessário)
            const leadSnapshot = await db.collection('quiz_leads')
                .where('email', '==', buyer.email)
                .where('converted', '==', false)
                .limit(1)
                .get();

            let sessionId = null;

            if (!leadSnapshot.empty) {
                const leadDoc = leadSnapshot.docs[0];
                const leadData = leadDoc.data();
                sessionId = leadData.session_id;

                // Marcar como convertido
                await leadDoc.ref.update({
                    converted: true,
                    conversion_date: admin.firestore.FieldValue.serverTimestamp(),
                    transaction_id: transaction
                });

                console.log('✅ Lead marked as converted:', buyer.email);
            } else {
                console.log('⚠️ Lead not found for:', buyer.email);
                console.log('Creating conversion without session_id');
            }

            // 2. Salvar conversão
            const conversionData = {
                session_id: sessionId || 'unknown',
                transaction_id: transaction || 'unknown',
                email: buyer.email,
                name: buyer.name || '',
                value: purchase?.price?.value || 0,
                currency: purchase?.price?.currency_code || 'BRL',
                product: purchase?.product?.name || 'Unknown Product',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                event_type: event,
                hotmart_data: {
                    buyer: buyer,
                    purchase: purchase,
                    transaction: transaction
                }
            };

            await db.collection('conversoes').add(conversionData);

            console.log('✅ Conversion saved!');
            console.log('   Email:', buyer.email);
            console.log('   Value:', conversionData.value);
            console.log('   Session:', sessionId || 'not found');

            return res.status(200).json({
                success: true,
                message: 'Conversion processed',
                session_found: !!sessionId
            });

        } catch (error) {
            console.error('❌ Error processing webhook:', error);
            return res.status(500).json({
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    // Outros eventos são ignorados
    console.log('ℹ️ Event ignored:', event);
    return res.status(200).json({ message: 'Event ignored' });
}
