import { ABTest } from '../types';

const STORAGE_KEY = 'splitzy_tests';

export const getTests = (): ABTest[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveTest = (test: ABTest): void => {
  const tests = getTests();
  // Ensure events object exists
  if (!test.events) test.events = {};
  
  // Generate Mock Funnel Data for demonstration if it's a new test
  if (Object.keys(test.events).length === 0) {
      // Simulating a Quiz Funnel
      test.events = {
          'quiz_start': { A: 0, B: 0 },
          'question_1': { A: 0, B: 0 },
          'question_2': { A: 0, B: 0 },
          'lead_captured': { A: 0, B: 0 }
      };
  }
  
  tests.push(test);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
};

export const updateTest = (updatedTest: ABTest): void => {
  const tests = getTests();
  const index = tests.findIndex(t => t.id === updatedTest.id);
  if (index !== -1) {
    tests[index] = updatedTest;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  }
};

export const getTestById = (id: string): ABTest | undefined => {
  const tests = getTests();
  const test = tests.find(t => t.id === id);
  if (test && !test.events) {
      test.events = {}; // Migration for old tests
  }
  return test;
};

export const deleteTest = (id: string): void => {
  const tests = getTests().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
};

// Simulation of tracking updates
export const recordVisit = (testId: string, variant: 'A' | 'B'): void => {
  const test = getTestById(testId);
  if (!test || test.status !== 'active') return;

  if (variant === 'A') {
    test.visitsA += 1;
    // Mock funnel drop-off logic for demo
    if (Math.random() > 0.1) recordEvent(testId, variant, 'quiz_start');
  } else {
    test.visitsB += 1;
    if (Math.random() > 0.1) recordEvent(testId, variant, 'quiz_start');
  }
  updateTest(test);
};

export const recordConversion = (testId: string, variant: 'A' | 'B'): void => {
  const test = getTestById(testId);
  if (!test || test.status !== 'active') return;

  if (variant === 'A') {
    test.conversionsA += 1;
  } else {
    test.conversionsB += 1;
  }
  updateTest(test);
};

export const recordEvent = (testId: string, variant: 'A' | 'B', eventName: string): void => {
    const test = getTestById(testId);
    if (!test || test.status !== 'active') return;

    if (!test.events) test.events = {};
    if (!test.events[eventName]) {
        test.events[eventName] = { A: 0, B: 0 };
    }

    if (variant === 'A') {
        test.events[eventName].A += 1;
        // Cascading mock logic for demo purposes
        if (eventName === 'quiz_start' && Math.random() > 0.3) recordEvent(testId, variant, 'question_1');
        if (eventName === 'question_1' && Math.random() > 0.4) recordEvent(testId, variant, 'question_2');
        if (eventName === 'question_2' && Math.random() > 0.5) recordEvent(testId, variant, 'lead_captured');
    } else {
        test.events[eventName].B += 1;
        // B performs slightly better in this mock
        if (eventName === 'quiz_start' && Math.random() > 0.25) recordEvent(testId, variant, 'question_1');
        if (eventName === 'question_1' && Math.random() > 0.35) recordEvent(testId, variant, 'question_2');
        if (eventName === 'question_2' && Math.random() > 0.45) recordEvent(testId, variant, 'lead_captured');
    }
    
    updateTest(test);
};