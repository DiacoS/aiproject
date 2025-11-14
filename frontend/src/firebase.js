import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase konfiguration
// VIGTIGT: Brug SAMME værdier som i backend/.env
// Frontend bruger VITE_ prefix (Vite krav), backend bruger uden prefix
// Men værdierne skal være identiske!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Valider at konfigurationen er sat
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Firebase konfiguration mangler! Tjek at .env filen i frontend/ indeholder VITE_FIREBASE_* variabler');
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Authentication
export const auth = getAuth(app);

// Initialiser Firestore
export const db = getFirestore(app);

export default app;

