// ============================================================================
// SISTEMA DE TRACKING - Quiz Gelatina Bariátrica (CORRIGIDO PARA FIREBASE 8.x)
// ============================================================================
// Rastreia eventos de navegação do usuário e envia para Firebase Firestore
// ============================================================================

(function () {
    'use strict';

    // Variáveis globais
    var sessionId = null;

    // ========================================================================
    // FUNÇÃO: Inicializar Tracking
    // ========================================================================
    function initTracking() {
        // Gerar ou recuperar session_id
        sessionId = localStorage.getItem('funnel_session_id');

        if (!sessionId) {
            // Gerar novo session_id: sess_XXXXXXXX (8 caracteres aleatórios)
            var randomStr = Math.random().toString(36).substring(2, 10);
            sessionId = 'sess_' + randomStr;
            localStorage.setItem('funnel_session_id', sessionId);
        }

        // Verificar se Firebase está pronto
        if (typeof window.db !== 'undefined' && window.db !== null) {
            console.log('✅ Tracking inicializado');
            console.log('📍 Session ID:', sessionId);
            console.log('📍 Firebase: Conectado');
        } else {
            console.warn('⚠️ Tracking inicializado (Firebase offline)');
            console.log('📍 Session ID:', sessionId);
        }

        return sessionId;
    }

    // ========================================================================
    // FUNÇÃO: Detectar Tipo de Dispositivo
    // ========================================================================
    function getDeviceType() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Detectar tablet
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
            return 'tablet';
        }

        // Detectar mobile
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
            return 'mobile';
        }

        // Desktop
        return 'desktop';
    }

    // ========================================================================
    // FUNÇÃO: Rastrear Step
    // ========================================================================
    function trackStep(stepNumber) {
        // Criar objeto de evento
        var event = {
            etapa_id: stepNumber,
            session_id: sessionId || 'unknown',
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            url: window.location.href,
            referrer: document.referrer || 'direct',
            dispositivo: getDeviceType(),
            resolucao: window.screen.width + 'x' + window.screen.height,
            idioma: navigator.language || navigator.userLanguage || 'unknown'
        };

        // Log no console
        console.log('📡 TRACKING EVENT:', event);

        // Enviar para Firebase
        sendEventToFirebase(event);
    }

    // ========================================================================
    // FUNÇÃO: Enviar Evento para Firebase (FIREBASE 8.x COMPAT)
    // ========================================================================
    function sendEventToFirebase(event) {
        // Verificar se Firebase está disponível
        if (typeof window.db === 'undefined' || window.db === null) {
            console.warn('⚠️ Firebase offline: evento não salvo');
            return;
        }

        // Adicionar timestamp do servidor (Firebase 8.x Compat)
        event.server_timestamp = firebase.firestore.FieldValue.serverTimestamp();

        // Enviar para Firestore usando Firebase 8.x Compat SDK
        window.db.collection('funil_gelatina_eventos')
            .add(event)
            .then(function (docRef) {
                console.log('✅ Evento salvo! ID:', docRef.id);
            })
            .catch(function (error) {
                console.error('❌ Erro ao salvar:', error.message);
            });
    }

    // ========================================================================
    // EXPORTAR FUNÇÕES GLOBALMENTE
    // ========================================================================
    window.initTracking = initTracking;
    window.trackStep = trackStep;
    window.trackFirebaseStep = trackStep; // Alias para compatibilidade
    window.sendEventToFirebase = sendEventToFirebase;
    window.getDeviceType = getDeviceType;

    // ========================================================================
    // AUTO-INICIALIZAÇÃO
    // ========================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTracking);
    } else {
        initTracking();
    }

})();
