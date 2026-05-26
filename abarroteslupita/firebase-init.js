// Firebase initialization for Abarrotes LUPITA
const firebaseConfig = {
    apiKey: "AIzaSyAc6JMWZPn-59SdCtI0i3T_agcBXHanvG0",
    authDomain: "abarrotes-lupita-920d9.firebaseapp.com",
    projectId: "abarrotes-lupita-920d9",
    storageBucket: "abarrotes-lupita-920d9.firebasestorage.app",
    messagingSenderId: "50661671074",
    appId: "1:50661671074:web:e4dd8d4dc2975ac42257fb",
    measurementId: "G-D8KJ74REXR"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const FIRESTORE_ENABLED = !!(db && typeof db.collection === 'function');
if (FIRESTORE_ENABLED) {
    console.log('Firebase Firestore conectado');
} else {
    console.warn('Firebase no pudo inicializarse correctamente. Revisa firebase-init.js');
}
