import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Users, MousePointer2, Percent, Plus, ExternalLink, Activity } from 'lucide-react';
import { ABTest } from '../types';
import { getTests, deleteTest } from '../services/storageService';
import { Layout } from '../components/Layout';
import { StatCard } from '../components/StatCard';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const Dashboard: React.FC = () => {
  const [tests, setTests] = useState<ABTest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for effect
    setTimeout(() => {
        setTests(getTests().reverse());
        setLoading(false);
    }, 500);
  }, []);

  const totalVisits = tests.reduce((acc, t) => acc + t.visitsA + t.visitsB, 0);
  const totalConversions = tests.reduce((acc, t) => acc + t.conversionsA + t.conversionsB, 0);
  const avgConversionRate = totalVisits > 0 ? (totalConversions / totalVisits) * 100 : 0;

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if(window.confirm('Tem certeza que deseja excluir este teste?')) {
        deleteTest(id);
        setTests(getTests().reverse());
    }
  };

  if (loading) {
      return (
          <Layout>
              <div className="flex h-[50vh] items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
              </div>
          </Layout>
      );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-zinc-400">Visão geral dos seus testes de otimização.</p>
        </div>
        <Link to="/create" className="bg-brand-purple hover:bg-brand-purple/90 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
            <Plus className="w-5 h-5" />
            Criar Novo Teste
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
            title="Total de Visitas" 
            value={totalVisits.toLocaleString()} 
            icon={<Users />} 
            color="blue"
            trend="up"
            subValue="+12% vs. semana passada"
        />
        <StatCard 
            title="Conversões Totais" 
            value={totalConversions.toLocaleString()} 
            icon={<MousePointer2 />} 
            color="green"
            trend="up"
            subValue="+5.4% de eficiência"
        />
        <StatCard 
            title="Taxa de Conversão Média" 
            value={`${avgConversionRate.toFixed(2)}%`} 
            icon={<Percent />} 
            color="purple"
            trend="neutral"
            subValue="Estável"
        />
      </div>

      {/* Active Tests List */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-brand-purple" />
        Testes Ativos
      </h2>
      
      {tests.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-zinc-600" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Nenhum teste encontrado</h3>
              <p className="text-zinc-500 mb-6">Comece criando seu primeiro teste A/B para otimizar suas conversões.</p>
              <Link to="/create" className="text-brand-purple hover:text-brand-purpleGlow font-medium">
                  Criar meu primeiro teste &rarr;
              </Link>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-4">
            {tests.map((test) => {
                const totalTestVisits = test.visitsA + test.visitsB;
                const totalTestConv = test.conversionsA + test.conversionsB;
                const crA = test.visitsA > 0 ? (test.conversionsA / test.visitsA) * 100 : 0;
                const crB = test.visitsB > 0 ? (test.conversionsB / test.visitsB) * 100 : 0;
                
                // Chart data
                const chartData = [
                    { name: 'A', cr: crA },
                    { name: 'B', cr: crB }
                ];

                return (
                    <Link to={`/test/${test.id}`} key={test.id} className="group block bg-brand-surface border border-zinc-800 rounded-xl p-6 hover:border-brand-purple/40 transition-all hover:bg-zinc-900/80">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-white group-hover:text-brand-purpleGlow transition-colors">{test.name}</h3>
                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${test.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-zinc-800 text-zinc-400'}`}>
                                        {test.status}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-zinc-400">
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {totalTestVisits} Visitas</span>
                                    <span className="flex items-center gap-1"><MousePointer2 className="w-3 h-3" /> {totalTestConv} Conversões</span>
                                    <span className="text-zinc-600">|</span>
                                    <span className="text-xs font-mono truncate max-w-[200px]">{test.urlA} vs {test.urlB}</span>
                                </div>
                            </div>
                            
                            {/* Mini Chart */}
                            <div className="h-16 w-32 hidden md:block">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <Tooltip cursor={{fill: 'transparent'}} content={() => null} />
                                        <Bar dataKey="cr" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#8b5cf6' : '#10b981'} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-zinc-500">Taxa Geral</p>
                                    <p className="text-xl font-bold text-white">
                                        {(totalTestVisits > 0 ? (totalTestConv / totalTestVisits) * 100 : 0).toFixed(1)}%
                                    </p>
                                </div>
                                <button 
                                    onClick={(e) => handleDelete(test.id, e)}
                                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <ExternalLink className="w-4 h-4 rotate-45" /> {/* Simulating delete icon simply */}
                                </button>
                            </div>
                        </div>
                    </Link>
                );
            })}
          </div>
      )}
    </Layout>
  );
};
