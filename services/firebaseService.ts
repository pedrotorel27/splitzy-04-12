import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// CONFIGURAÇÃO CORRIGIDA: Usa os nomes exatos que estão no Vercel
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: "splitzy-41e46.firebasestorage.app",
  messagingSenderId: "871745699782",
  appId: "1:871745699782:web:3162131828d5595a66bcc7",
  measurementId: "G-75YTBK4R0R"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const TEST_STORAGE_PATH = 'ab_tests';
