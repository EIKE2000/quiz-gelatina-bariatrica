// ============================================================================
// CONFIGURAÇÃO DO FIREBASE - Quiz Gelatina Bariátrica
// ============================================================================
// Este arquivo inicializa o Firebase e o Firestore para tracking de analytics
// Versão: Firebase SDK 10.7.0 (via CDN)
// ============================================================================

(function () {
    'use strict';

    // Configuração do Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyBeIIA97vpnYIiaORABA6oDveHgNS3Oa-U",
        authDomain: "quiz-gelatina-bariatrica.firebaseapp.com",
        projectId: "quiz-gelatina-bariatrica",
        storageBucket: "quiz-gelatina-bariatrica.firebasestorage.app",
        messagingSenderId: "531053725080",
        appId: "1:531053725080:web:fa69c69d4c68ef366a57ed"
    };

    // Variável global para Firestore
    window.db = null;

    try {
        // Inicializar Firebase
        const app = firebase.initializeApp(firebaseConfig);
        console.log('✅ Firebase inicializado com sucesso!');
        console.log('📍 Projeto:', firebaseConfig.projectId);

        // Inicializar Firestore
        window.db = firebase.firestore();
        console.log('✅ Firestore inicializado com sucesso!');

        // Testar conexão (opcional)
        window.db.collection('_healthcheck').doc('test').set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function () {
            console.log('✅ Conexão com Firestore validada!');
        }).catch(function (error) {
            console.warn('⚠️ Aviso: Teste de conexão falhou (normal em produção):', error.message);
        });

    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase:', error);
        console.error('Detalhes:', error.message);

        // Fallback: modo offline
        window.db = null;
        console.warn('⚠️ Modo offline: Firebase não disponível');
    }

    // Exportar para uso global
    window.firebaseConfig = firebaseConfig;

})();
