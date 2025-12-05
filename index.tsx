import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("🚀 TENTANDO INICIAR O APP...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("❌ ERRO CRÍTICO: Não achei a div com id 'root' no index.html");
  document.body.innerHTML = "<h1>ERRO CRÍTICO: Elemento 'root' não encontrado. Verifique o index.html</h1>";
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("✅ APP INICIADO COM SUCESSO!");
  } catch (error) {
    console.error("❌ ERRO AO RENDERIZAR:", error);
    rootElement.innerHTML = `<h1>Erro ao iniciar o App</h1><pre>${error}</pre>`;
  }
}
