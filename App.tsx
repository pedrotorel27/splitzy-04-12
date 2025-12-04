import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateTest } from './pages/CreateTest';
import { TestDetails } from './pages/TestDetails';
import { RedirectHandler } from './pages/RedirectHandler';
import { SimulatedLanding } from './pages/SimulatedLanding';
import { Instructions } from './pages/Instructions';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTest />} />
        <Route path="/test/:id" element={<TestDetails />} />
        <Route path="/instructions" element={<Instructions />} />
        
        {/* The Magic Link Route */}
        <Route path="/go/:id" element={<RedirectHandler />} />
        
        {/* Simulated Landing Pages for Demo Purposes */}
        <Route path="/demo/a/:id" element={<SimulatedLanding variant="A" />} />
        <Route path="/demo/b/:id" element={<SimulatedLanding variant="B" />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;