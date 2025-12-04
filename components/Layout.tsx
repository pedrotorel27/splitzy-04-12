import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, FlaskConical, BookOpen, HardDrive } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-brand-purple/20 text-brand-purple" : "text-zinc-400 hover:text-white hover:bg-zinc-800";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-200 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-zinc-900 bg-[#0a0a0a] flex flex-col">
        <div className="p-6 border-b border-zinc-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
               <FlaskConical className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Splitzy</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive('/')}`}>
                <LayoutDashboard className="w-5 h-5" />
                Dashboard
            </Link>
            <Link to="/create" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive('/create')}`}>
                <PlusCircle className="w-5 h-5" />
                Novo Teste A/B
            </Link>
            <Link to="/instructions" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${isActive('/instructions')}`}>
                <BookOpen className="w-5 h-5" />
                Instruções
            </Link>
        </nav>

        <div className="p-4 border-t border-zinc-900">
            <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 space-y-4">
                <div>
                    <p className="text-xs text-zinc-500 mb-2">Status da API</p>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span className="text-sm text-zinc-300 font-medium">Sistema Online</span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 mb-2">Ambiente</p>
                    <div className="flex items-center gap-2">
                        <HardDrive className="w-3 h-3 text-blue-400" />
                        <span className="text-sm text-zinc-300 font-medium">Teste Grátis</span>
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-1 pl-5">Dados salvos no navegador</p>
                </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
         <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto p-6 md:p-12 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};