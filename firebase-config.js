const firebaseConfig = {
    apiKey: "AIzaSyBeIIA97vpnYIiaORABA6oDveHgNS3Oa-U",
    authDomain: "quiz-gelatina-bariatrica.firebaseapp.com",
    projectId: "quiz-gelatina-bariatrica",
    storageBucket: "quiz-gelatina-bariatrica.firebasestorage.app",
    messagingSenderId: "531053725080",
    appId: "1:531053725080:web:fa69c69d4c68ef366a57ed"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
window.db = firebase.firestore();
