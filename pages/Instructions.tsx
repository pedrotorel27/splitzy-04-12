import React from 'react';
import { Layout } from '../components/Layout';
import { PlusCircle, FileCode, MousePointer2, Play, ChevronRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Instructions: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Como usar o Splitzy</h1>
        <p className="text-zinc-400 mb-8">Guia rápido para configurar seus testes A/B e aumentar suas conversões.</p>

        <div className="space-y-8">
            {/* Step 1 */}
            <div className="bg-brand-surface border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center text-brand-purple font-bold text-lg border border-brand-purple/30">1</div>
                    <h2 className="text-xl font-bold text-white">Criar o Teste</h2>
                </div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                     <div className="flex-1 space-y-4 text-zinc-300">
                        <p>No painel do Splitzy, clique em <strong className="text-white">Novo Teste A/B</strong>. Você precisará fornecer as URLs de duas páginas diferentes:</p>
                        <ul className="space-y-2 text-sm ml-4">
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-purple"></div><strong>Variante A (Original):</strong> Sua página atual.</li>
                            <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div><strong>Variante B (Desafiante):</strong> A nova página com as alterações que você quer testar (nova headline, cores, oferta, etc).</li>
                        </ul>
                     </div>
                     <div className="bg-black/50 p-4 rounded-xl border border-zinc-800 min-w-[200px] flex flex-col items-center justify-center text-zinc-500">
                        <PlusCircle className="w-10 h-10 mb-2 text-brand-purple" />
                        <span className="text-xs">Dashboard &gt; Criar</span>
                     </div>
                </div>
            </div>

            {/* Step 2 */}
            <div className="bg-brand-surface border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-lg border border-blue-500/30">2</div>
                    <h2 className="text-xl font-bold text-white">Instalar o Script</h2>
                </div>
                <div className="p-6 md:p-8">
                     <p className="text-zinc-300 mb-6">Após criar o teste, você receberá um <strong>Script de Rastreamento</strong>. Este script é fundamental para que o Splitzy saiba quando uma conversão ocorre.</p>
                     
                     <div className="bg-zinc-950 p-6 rounded-xl border border-zinc-800 font-mono text-sm text-zinc-400 mb-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-50"><FileCode className="w-5 h-5" /></div>
                        <p className="text-blue-400 mb-2">&lt;!-- Exemplo no head das suas páginas --&gt;</p>
                        <p>&lt;head&gt;</p>
                        <p className="pl-4 text-zinc-500">...</p>
                        <p className="pl-4 text-green-400">&lt;script&gt; ... window.Splitzy.testId = "123" ... &lt;/script&gt;</p>
                        <p>&lt;/head&gt;</p>
                     </div>

                     <div className="flex items-start gap-3 bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 text-sm text-blue-300">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <p>Você deve instalar este script <strong>nas duas páginas</strong> (A e B). Sem ele, não conseguiremos contar as conversões.</p>
                     </div>
                </div>
            </div>

             {/* Step 3 */}
             <div className="bg-brand-surface border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green font-bold text-lg border border-brand-green/30">3</div>
                    <h2 className="text-xl font-bold text-white">Configurar o Botão de Compra</h2>
                </div>
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
                     <div className="flex-1 space-y-4 text-zinc-300">
                        <p>Para rastrear quem clicou no botão "Comprar" ou "Cadastrar", você precisa adicionar um pequeno atributo HTML ao seu botão.</p>
                        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 font-mono text-sm inline-block">
                             data-ab-track="conversion"
                        </div>
                        <p className="text-sm text-zinc-400">Isso funciona com qualquer construtor de páginas (Elementor, ClickFunnels, HTML puro) que permita editar atributos ou IDs.</p>
                     </div>
                     <div className="bg-black/50 p-6 rounded-xl border border-zinc-800 flex flex-col items-center">
                         <button className="bg-brand-green text-black font-bold py-2 px-6 rounded-lg mb-2 cursor-default shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                             Comprar Agora
                         </button>
                         <div className="flex items-center gap-2 text-xs text-zinc-500">
                             <MousePointer2 className="w-3 h-3" />
                             <span>Clique rastreado automaticamente</span>
                         </div>
                     </div>
                </div>
            </div>

             {/* Step 4 */}
             <div className="bg-brand-surface border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="bg-zinc-900/50 p-6 border-b border-zinc-800 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-lg border border-orange-500/30">4</div>
                    <h2 className="text-xl font-bold text-white">Lançar a Campanha</h2>
                </div>
                <div className="p-6 md:p-8">
                     <p className="text-zinc-300 mb-6">O Splitzy gerará um <strong>Link de Campanha</strong> único (ex: <code>splitzy.app/#/go/abc-123</code>). Use este link nos seus anúncios do Facebook ou Google.</p>
                     
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                            <span className="text-xs text-zinc-500 block mb-2">Usuário clica no anúncio</span>
                            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-zinc-600 w-full"></div>
                            </div>
                        </div>
                         <div className="flex flex-col items-center justify-center text-brand-purple">
                             <Play className="w-6 h-6 mb-1" />
                             <span className="text-xs font-bold">Splitzy divide 50/50</span>
                         </div>
                         <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-2 justify-center">
                            <div className="w-8 h-10 bg-brand-purple/20 border border-brand-purple/40 rounded flex items-center justify-center text-xs font-bold text-brand-purple">A</div>
                            <div className="w-8 h-10 bg-brand-green/20 border border-brand-green/40 rounded flex items-center justify-center text-xs font-bold text-brand-green">B</div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
        
        <div className="mt-12 text-center pb-8">
            <Link to="/create" className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-purple/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-brand-purple/20 transition-all hover:scale-105">
                Começar meu primeiro teste <ChevronRight className="w-5 h-5" />
            </Link>
        </div>
      </div>
    </Layout>
  );
};