import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// LIGAÇÃO DIRETA: Chaves colocadas manualmente para destravar o app
const firebaseConfig = {
  apiKey: "AIzaSyA0dausZrMGYXYErhZ5VQIyp-HHrM__Q6M",
  authDomain: "splitzy-41e46.firebaseapp.com",
  databaseURL: "https://splitzy-41e46-default-rtdb.firebaseio.com",
  projectId: "splitzy-41e46",
  storageBucket: "splitzy-41e46.firebasestorage.app",
  messagingSenderId: "871745699782",
  appId: "1:871745699782:web:3162131828d5595a66bcc7",
  measurementId: "G-75YTBK4R0R"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const TEST_STORAGE_PATH = 'ab_tests';
