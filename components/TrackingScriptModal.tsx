import React from 'react';
import { X, Copy, Check } from 'lucide-react';

interface Props {
  testId: string;
  onClose: () => void;
}

export const TrackingScriptModal: React.FC<Props> = ({ testId, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const scriptCode = `
<!-- Splitzy Tracking Script -->
<script>
  (function(w,d,s,l,i){
    w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});
    // Splitzy Initialization
    w.Splitzy = w.Splitzy || {};
    w.Splitzy.testId = "${testId}";
    
    // Auto-detect UTM params and preserve them
    const params = new URLSearchParams(window.location.search);
    
    // Function to track conversion
    w.Splitzy.track = function(eventName) {
        console.log("Splitzy Event:", eventName, "TestID:", "${testId}");
        // In production, this would send a beacon to the server
        // fetch('https://api.splitzy.com/track', { method: 'POST', body: ... });
    };
  })(window,document,'script','dataLayer','${testId}');
  
  // Attach to all buttons with data-ab-track attribute
  document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-ab-track]').forEach(btn => {
          const eventName = btn.getAttribute('data-ab-track');
          btn.addEventListener('click', () => {
              window.Splitzy.track(eventName);
          });
      });
  });
</script>
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-surface border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <h3 className="text-xl font-bold text-white">Instalar Script de Rastreamento</h3>
            <p className="text-zinc-400 text-sm mt-1">Copie este código e cole no {`<head>`} das suas páginas A e B.</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <p className="text-blue-400 text-sm">
                    <strong>Nota Importante:</strong> Este script suporta eventos personalizados (Funil).
                </p>
            </div>

            <div className="relative group">
                <div className="absolute top-3 right-3">
                    <button 
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-xs font-medium transition-all"
                    >
                        {copied ? <><Check className="w-3 h-3 text-green-400"/> Copiado</> : <><Copy className="w-3 h-3"/> Copiar</>}
                    </button>
                </div>
                <pre className="bg-[#0d0d10] p-4 rounded-xl border border-zinc-800 overflow-x-auto text-xs text-zinc-400 font-mono leading-relaxed">
                    {scriptCode}
                </pre>
            </div>
            
            <div className="space-y-4">
                 <h4 className="text-zinc-300 text-sm font-medium border-b border-zinc-800 pb-2">Como rastrear eventos?</h4>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2">Opção 1: Botão de Conversão (Padrão)</p>
                        <code className="block bg-black p-2 rounded text-xs text-green-400 font-mono">
                            &lt;button data-ab-track="conversion"&gt;...
                        </code>
                     </div>
                     
                     <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                        <p className="text-xs text-zinc-500 mb-2">Opção 2: Passos do Quiz (Funil)</p>
                        <code className="block bg-black p-2 rounded text-xs text-brand-purpleGlow font-mono mb-1">
                            &lt;button data-ab-track="pergunta_1"&gt;...
                        </code>
                        <code className="block bg-black p-2 rounded text-xs text-brand-purpleGlow font-mono">
                             window.Splitzy.track('quiz_start');
                        </code>
                     </div>
                 </div>
            </div>
        </div>

        <div className="p-6 border-t border-zinc-800 flex justify-end">
            <button onClick={onClose} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors">
                Fechar
            </button>
        </div>
      </div>
    </div>
  );
};