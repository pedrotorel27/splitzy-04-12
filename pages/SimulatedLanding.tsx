import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { recordConversion } from '../services/storageService';
import { ArrowLeft, CheckCircle } from 'lucide-react';

interface Props {
  variant: 'A' | 'B';
}

export const SimulatedLanding: React.FC<Props> = ({ variant }) => {
  const { id } = useParams<{ id: string }>();
  const [converted, setConverted] = React.useState(false);

  const handleConversion = () => {
    if (id && !converted) {
        recordConversion(id, variant);
        setConverted(true);
    }
  };

  const isA = variant === 'A';

  // Different styles for A and B to visualize the test
  const bgClass = isA ? 'bg-zinc-950' : 'bg-black';
  const accentClass = isA ? 'text-brand-purple' : 'text-brand-green';
  const btnClass = isA 
    ? 'bg-brand-purple hover:bg-brand-purple/90 shadow-brand-purple/20' 
    : 'bg-brand-green hover:bg-brand-green/90 text-black shadow-brand-green/20';

  return (
    <div className={`min-h-screen flex flex-col ${bgClass} text-white font-sans transition-colors duration-500`}>
      {/* Simulation Banner */}
      <div className="bg-stripes bg-zinc-900 text-zinc-500 text-xs py-2 text-center border-b border-zinc-800">
        MODO DE SIMULAÇÃO: Esta é a <strong>Variante {variant}</strong>. O clique no botão abaixo contará como conversão.
      </div>

      <nav className="p-6 flex justify-between items-center max-w-6xl mx-auto w-full">
         <div className="font-bold text-xl tracking-tighter">Product<span className={accentClass}>X</span></div>
         <div className="text-sm text-zinc-400">Demo Page</div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-4xl mx-auto">
         {isA ? (
             // Layout A: Standard
             <>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    A Melhor Solução para <br/> <span className={accentClass}>Seus Problemas.</span>
                </h1>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl">
                    A versão original foca em clareza e solidez. Teste esta headline para ver se converte melhor.
                </p>
             </>
         ) : (
             // Layout B: Bold/Aggressive
             <>
                 <div className="bg-zinc-900 text-brand-green px-4 py-1 rounded-full text-sm font-bold mb-6 border border-brand-green/20">
                    NOVA OFERTA DISPONÍVEL
                 </div>
                 <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                    EXPLODA SEUS RESULTADOS <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-emerald-600">AGORA MESMO.</span>
                </h1>
                <p className="text-xl text-zinc-300 mb-10 max-w-2xl font-medium">
                    A variante B usa gatilhos de urgência e cores mais agressivas para tentar aumentar o CTR.
                </p>
             </>
         )}

         {converted ? (
             <div className="bg-zinc-900 border border-green-500/30 text-green-400 px-8 py-6 rounded-2xl flex items-center gap-4 animate-in fade-in zoom-in duration-300">
                <CheckCircle className="w-8 h-8" />
                <div className="text-left">
                    <p className="font-bold text-lg">Conversão Registrada!</p>
                    <p className="text-sm text-zinc-400">Confira o Dashboard para ver os dados atualizados.</p>
                </div>
                <Link to={`/test/${id}`} className="ml-4 px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700">
                    Ver Dashboard
                </Link>
             </div>
         ) : (
             <button 
                onClick={handleConversion}
                className={`px-8 py-5 rounded-full text-xl font-bold transition-all transform hover:scale-105 shadow-xl ${btnClass}`}
             >
                {isA ? 'Começar Agora Gratuitamente' : 'QUERO ACESSAR IMEDIATAMENTE >>'}
             </button>
         )}

         <p className="mt-8 text-zinc-600 text-sm">
             *Este é um ambiente simulado. Nenhuma cobrança será feita.
         </p>
      </main>

      <footer className="p-8 text-center text-zinc-600 text-sm">
          Splitzy Simulation Environment
      </footer>
    </div>
  );
};