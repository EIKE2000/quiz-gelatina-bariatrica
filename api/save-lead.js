// ============================================================================
// VERCEL SERVERLESS FUNCTION - Salvar Lead
// ============================================================================
// Esta função recebe os dados do formulário do quiz e salva no Firebase

const admin = require('firebase-admin');

// Inicializar Firebase Admin (apenas uma vez)
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
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only POST allowed
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { session_id, name, email, age } = req.body;

    // Validação
    if (!session_id || !email) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['session_id', 'email']
        });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        // Verificar se já existe
        const existingLead = await db.collection('quiz_leads')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!existingLead.empty) {
            // Atualizar session_id se for novo
            await existingLead.docs[0].ref.update({
                last_session_id: session_id,
                last_visit: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({
                success: true,
                message: 'Lead updated'
            });
        }

        // Salvar novo lead
        const leadData = {
            session_id,
            name: name || '',
            email,
            age: age || null,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            converted: false,
            source: 'quiz'
        };

        await db.collection('quiz_leads').add(leadData);

        console.log('✅ Lead saved:', email);

        return res.status(200).json({
            success: true,
            message: 'Lead saved successfully'
        });

    } catch (error) {
        console.error('❌ Error saving lead:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
