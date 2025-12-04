import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getTestById } from '../services/storageService';
import { analyzeTestResults } from '../services/geminiService';
import { ABTest, TestStats } from '../types';
import { TrackingScriptModal } from '../components/TrackingScriptModal';
import { ArrowLeft, Copy, ExternalLink, RefreshCw, AlertTriangle, Play, Sparkles, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

export const TestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [test, setTest] = useState<ABTest | null>(null);
  const [showScript, setShowScript] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (id) {
        const found = getTestById(id);
        if (found) setTest(found);
    }
  }, [id]);

  if (!test) return <div className="text-white p-10">Teste não encontrado.</div>;

  const calculateStats = (): TestStats => {
    const crA = test.visitsA > 0 ? (test.conversionsA / test.visitsA) * 100 : 0;
    const crB = test.visitsB > 0 ? (test.conversionsB / test.visitsB) * 100 : 0;
    
    let winner: 'A' | 'B' | 'Tie' | 'Inconclusive' = 'Inconclusive';
    const totalVisits = test.visitsA + test.visitsB;
    
    if (totalVisits > 20) { 
        if (crA > crB * 1.05) winner = 'A';
        else if (crB > crA * 1.05) winner = 'B';
        else winner = 'Tie';
    }

    return {
        conversionRateA: crA,
        conversionRateB: crB,
        totalVisits: totalVisits,
        totalConversions: test.conversionsA + test.conversionsB,
        uplift: crA > 0 ? ((crB - crA) / crA) * 100 : 0,
        winner
    };
  };

  const stats = calculateStats();
  
  const handleAnalyze = async () => {
      setAnalyzing(true);
      const result = await analyzeTestResults(test, stats);
      setAiAnalysis(result);
      setAnalyzing(false);
  };

  const campaignLink = `${window.location.origin}/#/go/${test.id}`;

  const barData = [
    { name: 'Taxa de Conversão (%)', A: stats.conversionRateA.toFixed(2), B: stats.conversionRateB.toFixed(2) }
  ];

  // Prepare Funnel Data
  // We sort events by the total number of occurrences (Total A + Total B) descending to guess the funnel order
  const funnelEvents = test.events ? Object.entries(test.events).map(([name, data]) => {
      const d = data as { A: number; B: number };
      const total = d.A + d.B;
      return { name, A: d.A, B: d.B, total };
  }).sort((a, b) => b.total - a.total) : [];

  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                {test.name}
                <span className="text-sm font-normal bg-zinc-800 text-zinc-400 px-2 py-1 rounded-full border border-zinc-700">ID: {test.id}</span>
            </h1>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setShowScript(true)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors border border-zinc-700">
                &lt;/&gt; Instalar Script
            </button>
            <button onClick={() => window.location.reload()} className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors border border-zinc-700">
                <RefreshCw className="w-5 h-5" />
            </button>
        </div>
      </div>

      {/* Campaign Link Section */}
      <div className="bg-zinc-900/50 border border-brand-purple/30 p-6 rounded-2xl mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <ExternalLink className="w-24 h-24 text-brand-purple" />
          </div>
          <h3 className="text-zinc-400 text-sm font-medium mb-2 uppercase tracking-wide">Seu Link de Campanha (Split URL)</h3>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <code className="flex-1 bg-black/50 p-4 rounded-xl border border-brand-purple/20 text-brand-purpleGlow font-mono text-sm w-full break-all">
                {campaignLink}
            </code>
            <button 
                onClick={() => navigator.clipboard.writeText(campaignLink)}
                className="flex items-center gap-2 px-6 py-3.5 bg-brand-purple hover:bg-brand-purple/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-brand-purple/20 whitespace-nowrap"
            >
                <Copy className="w-4 h-4" /> Copiar Link
            </button>
          </div>
          <div className="mt-4 flex gap-4 text-xs text-zinc-500">
             <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-yellow-500" /> Use este link nos seus anúncios.</span>
             <Link to={`/demo/a/${test.id}`} target="_blank" className="hover:text-white underline">Testar A</Link>
             <Link to={`/demo/b/${test.id}`} target="_blank" className="hover:text-white underline">Testar B</Link>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Variant A Card */}
               <div className="bg-brand-surface border border-brand-purple/30 p-6 rounded-xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple"></div>
                   <div className="flex justify-between items-start mb-4">
                       <h3 className="text-lg font-bold text-white">Variante A (Original)</h3>
                       <div className="text-brand-purple bg-brand-purple/10 px-2 py-1 rounded text-xs font-bold">50% Tráfego</div>
                   </div>
                   <div className="space-y-4">
                       <div>
                           <p className="text-zinc-500 text-xs">Visitas</p>
                           <p className="text-2xl font-bold text-white">{test.visitsA}</p>
                       </div>
                       <div>
                           <p className="text-zinc-500 text-xs">Conversões</p>
                           <p className="text-2xl font-bold text-brand-purpleGlow">{test.conversionsA}</p>
                       </div>
                       <div>
                           <p className="text-zinc-500 text-xs">Taxa de Conversão</p>
                           <p className="text-3xl font-bold text-white">{stats.conversionRateA.toFixed(2)}%</p>
                       </div>
                   </div>
               </div>

               {/* Variant B Card */}
               <div className="bg-brand-surface border border-brand-green/30 p-6 rounded-xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-brand-green"></div>
                   <div className="flex justify-between items-start mb-4">
                       <h3 className="text-lg font-bold text-white">Variante B (Desafiante)</h3>
                       <div className="text-brand-green bg-brand-green/10 px-2 py-1 rounded text-xs font-bold">50% Tráfego</div>
                   </div>
                   <div className="space-y-4">
                       <div>
                           <p className="text-zinc-500 text-xs">Visitas</p>
                           <p className="text-2xl font-bold text-white">{test.visitsB}</p>
                       </div>
                       <div>
                           <p className="text-zinc-500 text-xs">Conversões</p>
                           <p className="text-2xl font-bold text-brand-greenGlow">{test.conversionsB}</p>
                       </div>
                       <div>
                           <p className="text-zinc-500 text-xs">Taxa de Conversão</p>
                           <p className="text-3xl font-bold text-white">{stats.conversionRateB.toFixed(2)}%</p>
                       </div>
                   </div>
               </div>
          </div>

          {/* Winner Card */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex flex-col justify-center items-center text-center">
              <h3 className="text-zinc-400 font-medium mb-4">Performance Relativa</h3>
              <div className="mb-4">
                {stats.winner === 'B' ? (
                    <div className="w-20 h-20 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green border-2 border-brand-green">
                        <span className="text-2xl font-bold">B</span>
                    </div>
                ) : stats.winner === 'A' ? (
                    <div className="w-20 h-20 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple border-2 border-brand-purple">
                        <span className="text-2xl font-bold">A</span>
                    </div>
                ) : (
                    <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 border-2 border-zinc-700">
                        <span className="text-2xl font-bold">-</span>
                    </div>
                )}
              </div>
              
              {stats.winner === 'B' && (
                  <p className="text-green-400 font-bold mb-2">Variante B está vencendo!</p>
              )}
               {stats.winner === 'A' && (
                  <p className="text-purple-400 font-bold mb-2">Original ainda é melhor.</p>
              )}
               {stats.uplift !== 0 && (
                  <p className={`text-sm ${stats.uplift > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stats.uplift > 0 ? '+' : ''}{stats.uplift.toFixed(1)}% de Uplift
                  </p>
              )}
          </div>
      </div>

      {/* Funnel Analysis Section */}
      {funnelEvents.length > 0 && (
          <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-purple" />
                  Análise de Funil (Quiz Steps)
              </h3>
              <div className="bg-brand-surface border border-zinc-800 rounded-xl p-6 overflow-hidden">
                  <div className="space-y-6">
                      {funnelEvents.map((event, idx) => {
                          const percentA = test.visitsA > 0 ? (event.A / test.visitsA) * 100 : 0;
                          const percentB = test.visitsB > 0 ? (event.B / test.visitsB) * 100 : 0;
                          
                          return (
                              <div key={idx} className="relative">
                                  <div className="flex justify-between items-end mb-2">
                                      <span className="text-sm font-medium text-white uppercase tracking-wider">{event.name.replace(/_/g, ' ')}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Bar A */}
                                      <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 relative group hover:border-brand-purple/50 transition-colors">
                                           <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                               <span>Variante A</span>
                                               <span>{percentA.toFixed(1)}% ({event.A})</span>
                                           </div>
                                           <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                                               <div className="h-full bg-brand-purple transition-all duration-1000" style={{width: `${percentA}%`}}></div>
                                           </div>
                                      </div>

                                      {/* Bar B */}
                                      <div className="bg-zinc-900 rounded-lg p-3 border border-zinc-800 relative group hover:border-brand-green/50 transition-colors">
                                           <div className="flex justify-between text-xs text-zinc-400 mb-1">
                                               <span>Variante B</span>
                                               <span className={percentB > percentA ? "text-brand-green" : ""}>{percentB.toFixed(1)}% ({event.B})</span>
                                           </div>
                                           <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
                                               <div className="h-full bg-brand-green transition-all duration-1000" style={{width: `${percentB}%`}}></div>
                                           </div>
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>
          </div>
      )}

      {/* Charts & AI Analysis Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Charts */}
        <div className="bg-brand-surface border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Comparativo de Conversão Final</h3>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#71717a" />
                        <YAxis dataKey="name" type="category" stroke="#71717a" width={100} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }} 
                            cursor={{fill: '#27272a', opacity: 0.4}}
                        />
                        <Legend />
                        <Bar dataKey="A" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Original (A)" />
                        <Bar dataKey="B" fill="#10b981" radius={[0, 4, 4, 0]} name="Desafiante (B)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Gemini AI Analysis */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    Análise Inteligente
                </h3>
                {!aiAnalysis && (
                    <button 
                        onClick={handleAnalyze} 
                        disabled={analyzing}
                        className="text-xs bg-white text-black px-3 py-1.5 rounded-md font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
                    >
                        {analyzing ? 'Analisando...' : 'Gerar Insights com IA'}
                    </button>
                )}
            </div>

            <div className="h-64 overflow-y-auto pr-2 text-zinc-300 text-sm leading-relaxed">
                {analyzing ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
                         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                         <p>Processando dados de funil e conversão...</p>
                    </div>
                ) : aiAnalysis ? (
                    <div className="whitespace-pre-line">
                        {aiAnalysis}
                        <button onClick={() => setAiAnalysis("")} className="block mt-4 text-xs text-zinc-500 underline">Gerar novamente</button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-600 border border-dashed border-zinc-800 rounded-lg bg-black/20">
                        <p>Clique para obter uma análise estratégica de retenção e CRO.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {showScript && <TrackingScriptModal testId={test.id} onClose={() => setShowScript(false)} />}
    </Layout>
  );
};
