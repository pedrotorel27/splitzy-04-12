import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTestById, recordVisit } from '../services/storageService';
import { FlaskConical } from 'lucide-react';

export const RedirectHandler: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
        setError('ID do teste não fornecido.');
        return;
    }

    const test = getTestById(id);
    
    if (!test) {
        setError('Teste A/B não encontrado ou pausado.');
        return;
    }

    // Logic for Split 50/50
    const variant = Math.random() < 0.5 ? 'A' : 'B';

    // Record visit (in strict mode this might run twice, in production use a ref to prevent double count or server side)
    // For this demo, we accept the slight inaccuracy of React StrictMode dev behavior or use a simple flag in session storage
    const sessionKey = `splitzy_visited_${id}`;
    if (!sessionStorage.getItem(sessionKey)) {
        recordVisit(id, variant);
        sessionStorage.setItem(sessionKey, 'true');
    }

    // Delay slightly to show the "redirecting" UI for UX purposes, then forward
    setTimeout(() => {
        // In a real app, this would be window.location.replace(targetUrl);
        // For the demo, we redirect to our internal simulated pages
        navigate(`/demo/${variant.toLowerCase()}/${id}`);
    }, 800);

  }, [id, navigate]);

  if (error) {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="bg-zinc-900 p-8 rounded-xl border border-red-900/50 max-w-md text-center">
                <h2 className="text-xl font-bold mb-2 text-red-400">Erro no Redirecionamento</h2>
                <p className="text-zinc-400">{error}</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="relative">
             <div className="absolute inset-0 bg-brand-purple blur-2xl opacity-20 rounded-full animate-pulse"></div>
             <FlaskConical className="w-16 h-16 text-brand-purple relative z-10 animate-bounce" />
        </div>
        <h2 className="mt-8 text-2xl font-bold text-white tracking-tight">Splitzy</h2>
        <p className="text-zinc-500 mt-2 animate-pulse">Redirecionando para a melhor versão...</p>
    </div>
  );
};