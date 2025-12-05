import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY,
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: (import.meta as any).env.VITE_FIREBASE_DATABASE_URL,
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "splitzy-41e46.firebasestorage.app",
  messagingSenderId: "871745699782",
  appId: "1:871745699782:web:3162131828d5595a66bcc7",
  measurementId: "G-75YTBK4R0R"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const TEST_STORAGE_PATH = '/ab_tests';