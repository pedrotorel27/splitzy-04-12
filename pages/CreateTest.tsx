import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { saveTest } from '../services/storageService';
import { ABTest } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    urlA: '',
    urlB: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTest: ABTest = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      visitsA: 0,
      conversionsA: 0,
      visitsB: 0,
      conversionsB: 0,
      status: 'active',
      createdAt: Date.now()
    };
    saveTest(newTest);
    navigate(`/test/${newTest.id}`);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
        </Link>
        
        <div className="bg-brand-surface border border-zinc-800 rounded-2xl p-8 shadow-2xl">
            <div className="mb-8 border-b border-zinc-800 pb-6">
                <h1 className="text-2xl font-bold text-white mb-2">Criar Novo Teste A/B</h1>
                <p className="text-zinc-400">Configure suas variantes. O tráfego será dividido 50/50 automaticamente.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Nome da Campanha</label>
                    <input 
                        type="text" 
                        required
                        placeholder="Ex: Landing Page VSL vs Texto - Q1"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 border-l-4 border-l-brand-purple">
                        <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-brand-purple">Variante A</span>
                            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Original</span>
                        </div>
                        <label className="block text-xs font-medium text-zinc-500 mb-2">URL de Destino</label>
                        <input 
                            type="url" 
                            required
                            placeholder="https://seusite.com/pagina-a"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                            value={formData.urlA}
                            onChange={e => setFormData({...formData, urlA: e.target.value})}
                        />
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 border-l-4 border-l-brand-green">
                         <div className="flex items-center justify-between mb-4">
                            <span className="font-bold text-brand-green">Variante B</span>
                            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">Desafiante</span>
                        </div>
                        <label className="block text-xs font-medium text-zinc-500 mb-2">URL de Destino</label>
                        <input 
                            type="url" 
                            required
                            placeholder="https://seusite.com/pagina-b"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-green transition-all"
                            value={formData.urlB}
                            onChange={e => setFormData({...formData, urlB: e.target.value})}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                     <button type="submit" className="w-full bg-gradient-to-r from-brand-purple to-brand-purpleGlow text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-purple/20 hover:shadow-brand-purple/40 hover:scale-[1.01] transition-all flex justify-center items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Gerar Link de Teste
                     </button>
                </div>
            </form>
        </div>
      </div>
    </Layout>
  );
};
