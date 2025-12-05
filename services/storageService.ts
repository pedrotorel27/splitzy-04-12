import { db, TEST_STORAGE_PATH } from './firebaseService';
import { ref, set, onValue, remove, runTransaction } from 'firebase/database';
import { ABTest } from '../types';

let localTests: ABTest[] = [];

// Initialize Realtime Listener
export const initializeStorageListener = (callback?: (tests: ABTest[]) => void) => {
  const testsRef = ref(db, TEST_STORAGE_PATH);
  
  onValue(testsRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      // Convert object { id: test } to array [test, test]
      localTests = Object.values(data);
    } else {
      localTests = [];
    }
    if (callback) callback(localTests);
  });
};

export const getTests = (): ABTest[] => {
  return localTests;
};

export const getTestById = (id: string): ABTest | undefined => {
  return localTests.find(t => t.id === id);
};

export const saveTest = (test: ABTest): void => {
  // Ensure events object exists
  if (!test.events) test.events = {};
  
  // Generate Mock Funnel Data for demonstration if it's a new test
  if (Object.keys(test.events).length === 0) {
      test.events = {
          'quiz_start': { A: 0, B: 0 },
          'question_1': { A: 0, B: 0 },
          'question_2': { A: 0, B: 0 },
          'lead_captured': { A: 0, B: 0 }
      };
  }
  
  const testRef = ref(db, `${TEST_STORAGE_PATH}/${test.id}`);
  set(testRef, test);
};

export const updateTest = (updatedTest: ABTest): void => {
  const testRef = ref(db, `${TEST_STORAGE_PATH}/${updatedTest.id}`);
  set(testRef, updatedTest);
};

export const deleteTest = (id: string): void => {
  const testRef = ref(db, `${TEST_STORAGE_PATH}/${id}`);
  remove(testRef);
};

// Simulation of tracking updates using Transactions for Atomic consistency
export const recordVisit = (testId: string, variant: 'A' | 'B'): void => {
  const testRef = ref(db, `${TEST_STORAGE_PATH}/${testId}`);

  runTransaction(testRef, (test) => {
    if (test && test.status === 'active') {
      if (variant === 'A') {
        test.visitsA = (test.visitsA || 0) + 1;
      } else {
        test.visitsB = (test.visitsB || 0) + 1;
      }
      return test;
    }
    return test;
  }).then(() => {
     // Trigger Mock Funnel Event (Fire and forget)
     if (Math.random() > 0.1) recordEvent(testId, variant, 'quiz_start');
  });
};

export const recordConversion = (testId: string, variant: 'A' | 'B'): void => {
  const testRef = ref(db, `${TEST_STORAGE_PATH}/${testId}`);

  runTransaction(testRef, (test) => {
    if (test && test.status === 'active') {
       if (variant === 'A') {
        test.conversionsA = (test.conversionsA || 0) + 1;
      } else {
        test.conversionsB = (test.conversionsB || 0) + 1;
      }
      return test;
    }
    return test;
  });
};

export const recordEvent = (testId: string, variant: 'A' | 'B', eventName: string): void => {
    // We target the specific event path to avoid rewriting the whole test object excessively
    const eventRef = ref(db, `${TEST_STORAGE_PATH}/${testId}/events/${eventName}/${variant}`);

    runTransaction(eventRef, (currentValue) => {
        return (currentValue || 0) + 1;
    }).then(() => {
        // Mock Chained Events logic for Demo
        // Note: In a real app, these would be separate calls from the client
        if (eventName === 'quiz_start' && Math.random() > 0.3) recordEvent(testId, variant, 'question_1');
        if (eventName === 'question_1' && Math.random() > 0.4) recordEvent(testId, variant, 'question_2');
        if (eventName === 'question_2' && Math.random() > 0.5) recordEvent(testId, variant, 'lead_captured');
    });
};