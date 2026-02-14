import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Loader2, AlertTriangle } from 'lucide-react';
import { generateBriefingFromText } from '../services/aiService';
import { ContentData } from '../types';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (data: ContentData) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, onGenerate }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError('');

    try {
      const generatedData = await generateBriefingFromText(inputText);
      if (generatedData) {
        onGenerate(generatedData);
        onClose();
      } else {
        setError('Não foi possível estruturar o conteúdo. Tente detalhar mais o texto.');
      }
    } catch (err: any) {
      console.error(err);
      
      let msg = 'Erro desconhecido';
      
      // Try to extract readable message from different error structures
      if (err?.message) {
         try {
            // Check if message is a JSON string
            const parsed = JSON.parse(err.message);
            if (parsed.error?.message) msg = parsed.error.message;
            else msg = err.message;
         } catch {
            msg = err.message;
         }
      } else if (err?.error?.message) {
         msg = err.error.message;
      } else {
         msg = JSON.stringify(err);
      }

      msg = msg.replace(/\[.*?\]\s*/, '').trim();
      setError(`Erro na API (gemini-2.0-flash): ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl border border-white/20 overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="bg-falconi-primary p-6 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="text-falconi-secondary" fill="currentColor" />
              <h2 className="text-xl font-bold">Assistente de Conteúdo IA</h2>
            </div>
            <p className="text-white/80 text-sm">
              Cole um rascunho, uma ideia ou um texto bruto e deixe a IA estruturar o template Falconi para você.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 flex flex-col min-h-0 bg-gray-50">
          <textarea
            className="w-full flex-1 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-falconi-primary focus:border-falconi-primary resize-none text-gray-700 text-sm leading-relaxed mb-4 shadow-inner custom-scrollbar"
            placeholder="Ex: Crie uma dica sobre o uso do Microsoft Copilot no Excel. Comece falando que ele aumenta a produtividade em 30%. Depois liste 3 benefícios: análise rápida, geração de fórmulas e gráficos automáticos. Por fim, dê um passo a passo de como ativar a aba Dados e digitar o prompt..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            maxLength={50000}
          />
          <div className="text-right text-xs text-gray-400 mb-2">
            {inputText.length} / 50000 caracteres
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm flex items-start gap-2 max-h-32 overflow-y-auto">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <span className="break-words font-medium">{error}</span>
            </div>
          )}

          <div className="flex justify-end items-center gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg text-gray-600 font-bold hover:bg-gray-200 transition text-sm"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className="bg-falconi-primary text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-opacity-90 hover:scale-[1.02] active:scale-95 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Gerando Estrutura...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Gerar Template
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;