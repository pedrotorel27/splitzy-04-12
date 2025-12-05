import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { CreateTest } from './pages/CreateTest';
import { TestDetails } from './pages/TestDetails';
import { RedirectHandler } from './pages/RedirectHandler';
import { SimulatedLanding } from './pages/SimulatedLanding';
import { Instructions } from './pages/Instructions';
// Importamos a função que liga o Firebase
import { initializeStorageListener } from './services/storageService';

const App: React.FC = () => {
  // UseEffect: Roda uma vez quando o app inicia para ligar a escuta do banco de dados
  useEffect(() => {
    initializeStorageListener();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create" element={<CreateTest />} />
        <Route path="/test/:id" element={<TestDetails />} />
        <Route path="/instructions" element={<Instructions />} />
        
        {/* Rota do Link Mágico que divide o tráfego */}
        <Route path="/go/:id" element={<RedirectHandler />} />
        
        {/* Páginas de demonstração */}
        <Route path="/demo/a/:id" element={<SimulatedLanding variant="A" />} />
        <Route path="/demo/b/:id" element={<SimulatedLanding variant="B" />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
