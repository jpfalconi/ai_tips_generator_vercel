import React, { useState } from 'react';
import { Copy, Check, Download, Loader2, Sparkles, RefreshCw, MessageSquare, Code, AlertTriangle } from 'lucide-react';
import { TeamsPost, ContentData } from '../types';
import { generateTeamsPost, generateTeamsPostFromContentData, formatTeamsMarkdown } from '../services/teamsGenerator';

interface TeamsPreviewProps {
  data: ContentData;
}

const TeamsPreview: React.FC<TeamsPreviewProps> = ({ data }) => {
  const [post, setPost] = useState<TeamsPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'markdown' | 'json'>('preview');
  const [copied, setCopied] = useState<string | null>(null);
  const [useCustom, setUseCustom] = useState(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const handleGenerate = async (fromData = true) => {
    setLoading(true);
    setError('');
    try {
      const result = fromData
        ? await generateTeamsPostFromContentData(data)
        : await generateTeamsPost(customInput);

      if (result) {
        setPost(result);
        setActiveTab('preview');
      } else {
        setError('Não foi possível gerar o post. Tente novamente.');
      }
    } catch (err: any) {
      setError(err?.message || 'Erro ao gerar post para Teams.');
    } finally {
      setLoading(false);
    }
  };

  const markdown = post ? formatTeamsMarkdown(post) : '';
  const adaptiveCardJson = post?.adaptiveCard ? JSON.stringify(post.adaptiveCard, null, 2) : '';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* Generation Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-[#464EB8]/5 to-[#464EB8]/10">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-[#464EB8] flex items-center justify-center">
              <MessageSquare size={13} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Gerar Post para Teams</h2>
          </div>
          <p className="text-sm text-gray-500">
            Gere automaticamente uma mensagem formatada para postar em um canal do Microsoft Teams.
          </p>
        </div>

        <div className="p-5 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setUseCustom(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!useCustom ? 'bg-[#464EB8] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              📋 Usar conteúdo atual do editor
            </button>
            <button
              onClick={() => setUseCustom(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${useCustom ? 'bg-[#464EB8] text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              ✏️ Descrever tópico manualmente
            </button>
          </div>

          {useCustom && (
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-[#464EB8] focus:border-[#464EB8] h-24 custom-scrollbar"
              placeholder="Ex: Dica sobre como usar o Copilot do Teams para resumir reuniões longas..."
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              disabled={loading}
            />
          )}

          {!useCustom && (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-sm text-gray-600">
              <span className="font-medium text-gray-800">Dica selecionada: </span>
              {data.headerSubtitle || data.headerTitle || 'Sem título'}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start gap-2">
              <AlertTriangle size={15} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={() => handleGenerate(!useCustom)}
            disabled={loading || (useCustom && !customInput.trim())}
            className="w-full flex items-center justify-center gap-2 bg-[#464EB8] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#3a42a0] transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Gerando post com IA...
              </>
            ) : post ? (
              <>
                <RefreshCw size={16} />
                Regenerar Post
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Gerar Post para Teams
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Area */}
      {post && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'preview' ? 'border-[#464EB8] text-[#464EB8] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <MessageSquare size={14} /> Preview Teams
            </button>
            <button
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'markdown' ? 'border-[#464EB8] text-[#464EB8] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <Copy size={14} /> Texto para Colar
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'json' ? 'border-[#464EB8] text-[#464EB8] bg-white' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <Code size={14} /> Adaptive Card JSON
            </button>
          </div>

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="p-6">
              {/* Teams UI Simulation */}
              <div className="bg-[#F5F5F5] rounded-xl p-4 border border-gray-200">
                {/* Teams Channel Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-300">
                  <div className="w-9 h-9 rounded-full bg-falconi-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    F
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Falconi Intelligence Unit</div>
                    <div className="text-xs text-gray-500">hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2 text-gray-800 text-sm leading-relaxed">
                  <p className="font-bold text-base text-gray-900">{post.headline}</p>
                  <p className="text-gray-600">{post.body}</p>

                  <div className="pt-1 space-y-1">
                    {post.bullets.map((bullet, i) => (
                      <p key={i} className="text-gray-700">
                        •{' '}
                        <span
                          dangerouslySetInnerHTML={{
                            __html: bullet.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          }}
                        />
                      </p>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-gray-300 mt-3">
                    <p className="text-[#464EB8] font-medium">💡 {post.cta}</p>
                    {post.ctaLink && (
                      <a href={post.ctaLink} className="text-[#464EB8] text-xs underline hover:opacity-80" target="_blank" rel="noreferrer">
                        {post.ctaLink}
                      </a>
                    )}
                  </div>

                  <p className="text-[#464EB8] text-xs pt-1">{post.hashtags.join(' ')}</p>
                </div>

                {/* Teams Reaction Bar */}
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-300">
                  <span className="text-xs text-gray-400 flex items-center gap-1">👍 <span>Curtir</span></span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">💬 <span>Responder</span></span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleCopy(markdown, 'preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${copied === 'preview' ? 'bg-green-100 text-green-700' : 'bg-[#464EB8] text-white hover:bg-[#3a42a0]'}`}
                >
                  {copied === 'preview' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'preview' ? 'Copiado!' : 'Copiar Mensagem'}
                </button>
              </div>
            </div>
          )}

          {/* Markdown Tab */}
          {activeTab === 'markdown' && (
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-3">
                Copie e cole diretamente na caixa de mensagem do Teams. O texto usa formatação markdown nativa do Teams.
              </p>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <pre className="p-4 text-green-400 text-sm font-mono whitespace-pre-wrap overflow-auto max-h-96 custom-scrollbar">
                  {markdown}
                </pre>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleCopy(markdown, 'md')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${copied === 'md' ? 'bg-green-100 text-green-700' : 'bg-[#464EB8] text-white hover:bg-[#3a42a0]'}`}
                >
                  {copied === 'md' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'md' ? 'Copiado!' : 'Copiar Texto Markdown'}
                </button>
              </div>
            </div>
          )}

          {/* JSON Tab */}
          {activeTab === 'json' && (
            <div className="p-6">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 text-sm text-blue-700">
                <strong>Adaptive Card:</strong> Use este JSON com um conector do Teams, Power Automate ou webhook para postar como card interativo. Cole em{' '}
                <a href="https://adaptivecards.io/designer/" target="_blank" rel="noreferrer" className="underline hover:opacity-80">
                  adaptivecards.io/designer
                </a>{' '}
                para visualizar.
              </div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                <pre className="p-4 text-green-400 text-xs font-mono whitespace-pre overflow-auto max-h-96 custom-scrollbar">
                  {adaptiveCardJson}
                </pre>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => {
                    const blob = new Blob([adaptiveCardJson], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `teams-card-${post.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold bg-falconi-secondary text-falconi-primary hover:opacity-90 transition"
                >
                  <Download size={14} /> Baixar .json
                </button>
                <button
                  onClick={() => handleCopy(adaptiveCardJson, 'json')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${copied === 'json' ? 'bg-green-100 text-green-700' : 'bg-[#464EB8] text-white hover:bg-[#3a42a0]'}`}
                >
                  {copied === 'json' ? <Check size={14} /> : <Copy size={14} />}
                  {copied === 'json' ? 'Copiado!' : 'Copiar JSON'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeamsPreview;
