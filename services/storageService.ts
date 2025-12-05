import { ref, set, onValue } from "firebase/database";

import { ABTest } from '../types';

import { db, TEST_STORAGE_PATH } from './firebaseService';



// --- Estado local sincronizado ---

// Mantemos uma cópia local dos dados para o app ler rápido,

// enquanto o Firebase atualiza tudo em segundo plano.

let currentTests: ABTest[] = [];

let listeners: ((tests: ABTest[]) => void)[] = [];



const notifyListeners = () => {

    listeners.forEach(listener => listener(currentTests));

};



// --- FUNÇÃO PRINCIPAL: Liga a conexão com a nuvem ---

export const initializeStorageListener = () => {

    const testsRef = ref(db, TEST_STORAGE_PATH);

   

    // Fica escutando: sempre que algo muda no Firebase, atualiza aqui

    onValue(testsRef, (snapshot) => {

        const data = snapshot.val();

        if (data) {

            // Transforma os dados do Firebase em uma lista que o app entende

            currentTests = Object.keys(data).map(key => data[key]);

        } else {

            currentTests = [];

        }

        notifyListeners();

    });

};



// --- Funções que o App usa (agora conectadas ao Firebase) ---



export const getTests = (): ABTest[] => {

    return currentTests;

};



export const saveTest = (test: ABTest): void => {

    // Define onde salvar: pasta 'ab_tests' -> ID do teste

    const testRef = ref(db, `${TEST_STORAGE_PATH}/${test.id}`);

   

    if (!test.events) test.events = {};

   

    // 'set' envia para a nuvem

    set(testRef, test).catch(erro => console.error("Erro ao salvar:", erro));

};



export const getTestById = (id: string): ABTest | undefined => {

    return currentTests.find(t => t.id === id);

};



export const deleteTest = (id: string): void => {

    const testRef = ref(db, `${TEST_STORAGE_PATH}/${id}`);

    // Salvar 'null' no Firebase deleta o item

    set(testRef, null);

};



// Listener para atualizar a tela automaticamente

export const addTestsListener = (listener: (tests: ABTest[]) => void) => {

    listeners.push(listener);

    listener(currentTests);

    return () => {

        listeners = listeners.filter(l => l !== listener);

    };

};



// --- Funções de Registro (Cliques e Conversões) ---



export const updateTest = (updatedTest: ABTest): void => {

    saveTest(updatedTest);

};



export const recordVisit = (testId: string, variant: 'A' | 'B'): void => {

    const test = getTestById(testId);

    if (!test || test.status !== 'active') return;



    if (variant === 'A') test.visitsA = (test.visitsA || 0) + 1;

    else test.visitsB = (test.visitsB || 0) + 1;

   

    updateTest(test);

};



export const recordConversion = (testId: string, variant: 'A' | 'B'): void => {

    const test = getTestById(testId);

    if (!test || test.status !== 'active') return;



    if (variant === 'A') test.conversionsA = (test.conversionsA || 0) + 1;

    else test.conversionsB = (test.conversionsB || 0) + 1;

   

    updateTest(test);

};
