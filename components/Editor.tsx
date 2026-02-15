import React, { useRef, useEffect } from 'react';
import { ContentData, Section, SectionType } from '../types';
import { ICONS_MAP } from '../constants';
import { Plus, Trash2, Image as ImageIcon, X, ArrowUp, ArrowDown, Bold, Italic, Link as LinkIcon, Underline, List, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { generateImagePrompt } from '../services/aiService';

interface EditorProps {
  data: ContentData;
  onChange: (data: ContentData) => void;
}

// --- Rich Text Editor Component ---
const RichTextEditor = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isFocused = useRef(false);

  // Sync external value changes to innerHTML (only if not focused to avoid cursor jumps)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML && !isFocused.current) {
      editorRef.current.innerHTML = value;
    }
    // Handle initial empty state for placeholders
    if (editorRef.current && !value) {
      editorRef.current.innerHTML = '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const addLink = () => {
    const url = prompt('Digite a URL:', 'https://');
    if (url) exec('createLink', url);
  };

  return (
    <div className="bg-white border border-gray-300 rounded focus-within:ring-2 focus-within:ring-falconi-primary focus-within:outline-none transition-shadow">
      {/* Toolbar */}
      <div className="flex gap-1 border-b border-gray-200 p-1.5 bg-gray-50 rounded-t flex-wrap items-center">
        <button onMouseDown={(e) => { e.preventDefault(); exec('bold'); }} className="p-1.5 text-gray-600 hover:text-falconi-primary hover:bg-gray-200 rounded" title="Negrito"><Bold size={15} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec('italic'); }} className="p-1.5 text-gray-600 hover:text-falconi-primary hover:bg-gray-200 rounded" title="Itálico"><Italic size={15} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec('underline'); }} className="p-1.5 text-gray-600 hover:text-falconi-primary hover:bg-gray-200 rounded" title="Sublinhado"><Underline size={15} /></button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList'); }} className="p-1.5 text-gray-600 hover:text-falconi-primary hover:bg-gray-200 rounded" title="Lista de Pontos"><List size={15} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); addLink(); }} className="p-1.5 text-gray-600 hover:text-falconi-primary hover:bg-gray-200 rounded" title="Link"><LinkIcon size={15} /></button>
        <button onMouseDown={(e) => { e.preventDefault(); exec('removeFormat'); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded ml-auto" title="Limpar Formatação"><RotateCcw size={14} /></button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => { isFocused.current = true; }}
        onBlur={() => { isFocused.current = false; }}
        className="p-3 min-h-[120px] max-h-[400px] overflow-y-auto outline-none text-sm leading-relaxed text-gray-700 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 cursor-text [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5"
        data-placeholder={placeholder || "Digite o conteúdo aqui..."}
        style={{ whiteSpace: 'pre-wrap' }} // Preserves structure
      />
    </div>
  );
};

const ImageSuggester = ({ context, onSelect }: { context: string, onSelect: (url: string) => void }) => {
  const [loading, setLoading] = React.useState(false);

  const handleSuggest = async () => {
    if (!context.trim()) {
      alert("Adicione um título ou conteúdo para gerar uma sugestão.");
      return;
    }

    setLoading(true);
    try {
      const prompt = await generateImagePrompt(context);
      // Construct Pollinations URL with the optimized prompt
      // We add a random seed to ensure freshness if clicked again
      const seed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?seed=${seed}&nologo=true`;
      onSelect(imageUrl);
    } catch (error) {
      console.error("Error generating image suggestion:", error);
      alert("Erro ao gerar sugestão. Verifique o console para mais detalhes ou tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSuggest}
      disabled={loading}
      className="flex items-center justify-center gap-2 text-xs font-bold text-white bg-falconi-primary hover:bg-falconi-primary/90 p-3 rounded shadow-sm transition-all w-full mt-2"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
      {loading ? "Criando Imagem..." : "✨ Sugerir Imagem com IA"}
    </button>
  );
};

const SectionEditor: React.FC<{
  section: Section;
  index: number;
  total: number;
  onUpdate: (id: string, field: keyof Section, value: any) => void;
  onRemove: (id: string) => void;
  onMove: (index: number, dir: 'up' | 'down') => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
}> = ({ section, index, total, onUpdate, onRemove, onMove, onImageUpload }) => {

  return (
    <div className="p-4 bg-gray-50 rounded border border-gray-200 relative">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <select
            value={section.type}
            onChange={(e) => onUpdate(section.id, 'type', e.target.value as SectionType)}
            className="text-xs font-bold uppercase tracking-wider bg-white border border-gray-300 rounded px-2 py-1 text-falconi-primary"
          >
            <option value="hero">Hero Card (Destaque)</option>
            <option value="feature">Feature (Card Pequeno)</option>
            <option value="step">Passo-a-Passo (Com Prompt)</option>
            <option value="image">Imagem (Simples)</option>
            <option value="banner">Banner Aviso</option>
            <option value="code">Código / Prompt</option>
            <option value="quote">Citação</option>
            <option value="stat">Métrica (Stat)</option>
            <option value="comparison">Comparativo (Pros/Cons)</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-falconi-primary disabled:opacity-30"><ArrowUp size={16} /></button>
          <button onClick={() => onMove(index, 'down')} disabled={index === total - 1} className="p-1 text-gray-400 hover:text-falconi-primary disabled:opacity-30"><ArrowDown size={16} /></button>
          <button onClick={() => onRemove(section.id)} className="p-1 text-gray-400 hover:text-red-500 ml-2"><Trash2 size={16} /></button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Title is used as Alt Text or Caption for Image type */}
        <input
          type="text"
          placeholder={section.type === 'image' ? "Legenda da imagem (Opcional)" : "Título da Seção"}
          value={section.title}
          onChange={(e) => onUpdate(section.id, 'title', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none font-bold"
        />

        {/* Hide Rich Editor for Image Type */}
        {section.type !== 'image' && (
          <RichTextEditor
            value={section.content}
            onChange={(val) => onUpdate(section.id, 'content', val)}
            placeholder="Conteúdo / Descrição..."
          />
        )}

        {/* Fields specific to Hero */}
        {section.type === 'hero' && (
          <>
            <input
              type="text"
              placeholder="Tags (separadas por vírgula): ESTRATÉGIA, DESTAQUE"
              value={section.tags || ''}
              onChange={(e) => onUpdate(section.id, 'tags', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Texto Botão CTA"
                value={section.ctaText || ''}
                onChange={(e) => onUpdate(section.id, 'ctaText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Link CTA"
                value={section.ctaLink || ''}
                onChange={(e) => onUpdate(section.id, 'ctaLink', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
          </>
        )}

        {/* Fields specific to Feature */}
        {section.type === 'feature' && (
          <div className="flex flex-col gap-2">
            <select
              value={section.icon || ''}
              onChange={(e) => onUpdate(section.id, 'icon', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
            >
              <option value="">Selecione um Ícone</option>
              {Object.entries(ICONS_MAP).map(([icon, label]) => (
                <option key={icon} value={icon}>{label}</option>
              ))}
            </select>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Texto Link (Opcional)"
                value={section.ctaText || ''}
                onChange={(e) => onUpdate(section.id, 'ctaText', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
              <input
                type="text"
                placeholder="URL do Link (https://...)"
                value={section.ctaLink || ''}
                onChange={(e) => onUpdate(section.id, 'ctaLink', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="p-2 bg-gray-50 rounded border border-gray-200">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tamanho do Card</label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`cardSize-${section.id}`}
                    checked={!section.cardSize || section.cardSize === 'small'}
                    onChange={() => onUpdate(section.id, 'cardSize', 'small')}
                    className="text-falconi-primary focus:ring-falconi-primary"
                  />
                  <span className="text-sm">Pequeno (1/3)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`cardSize-${section.id}`}
                    checked={section.cardSize === 'medium'}
                    onChange={() => onUpdate(section.id, 'cardSize', 'medium')}
                    className="text-falconi-primary focus:ring-falconi-primary"
                  />
                  <span className="text-sm">Médio (2/3)</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`cardSize-${section.id}`}
                    checked={section.cardSize === 'large'}
                    onChange={() => onUpdate(section.id, 'cardSize', 'large')}
                    className="text-falconi-primary focus:ring-falconi-primary"
                  />
                  <span className="text-sm">Grande (Full)</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Fields specific to Banner */}
        {section.type === 'banner' && (
          <select
            value={section.icon || ''}
            onChange={(e) => onUpdate(section.id, 'icon', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Selecione um Ícone</option>
            {Object.entries(ICONS_MAP).map(([icon, label]) => (
              <option key={icon} value={icon}>{label}</option>
            ))}
          </select>
        )}

        {/* Fields specific to Code */}
        {section.type === 'code' && (
          <div className="grid grid-cols-1 gap-2">
            <input
              type="text"
              placeholder="Linguagem (ex: python, javascript, sql)"
              value={section.codeLanguage || ''}
              onChange={(e) => onUpdate(section.id, 'codeLanguage', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm font-mono"
            />
          </div>
        )}

        {/* Fields specific to Quote */}
        {section.type === 'quote' && (
          <div className="grid grid-cols-1 gap-2">
            <input
              type="text"
              placeholder="Autor da Citação (ex: Vicente Falconi)"
              value={section.author || ''}
              onChange={(e) => onUpdate(section.id, 'author', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        )}

        {/* Fields specific to Stat */}
        {section.type === 'stat' && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Valor (ex: 40%)"
              value={section.statValue || ''}
              onChange={(e) => onUpdate(section.id, 'statValue', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm font-bold"
            />
            <input
              type="text"
              placeholder="Rótulo (ex: Redução de Tempo)"
              value={section.statLabel || ''}
              onChange={(e) => onUpdate(section.id, 'statLabel', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            />
          </div>
        )}

        {/* Fields specific to Comparison */}
        {section.type === 'comparison' && (
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Rótulo Positivo (Padrão: PRÓS)"
              value={section.prosLabel || ''}
              onChange={(e) => onUpdate(section.id, 'prosLabel', e.target.value)}
              className="w-full p-2 border border-green-200 bg-green-50 rounded text-sm text-green-800 font-bold placeholder-green-300"
            />
            <input
              type="text"
              placeholder="Rótulo Negativo (Padrão: CONTRAS)"
              value={section.consLabel || ''}
              onChange={(e) => onUpdate(section.id, 'consLabel', e.target.value)}
              className="w-full p-2 border border-red-200 bg-red-50 rounded text-sm text-red-800 font-bold placeholder-red-300"
            />
            <textarea
              placeholder="Pros (um por linha)"
              value={section.prosList || ''}
              onChange={(e) => onUpdate(section.id, 'prosList', e.target.value)}
              className="w-full p-2 border border-green-200 bg-green-50 rounded text-sm h-24 resize-none"
            />
            <textarea
              placeholder="Contras (um por linha)"
              value={section.consList || ''}
              onChange={(e) => onUpdate(section.id, 'consList', e.target.value)}
              className="w-full p-2 border border-red-200 bg-red-50 rounded text-sm h-24 resize-none"
            />
          </div>
        )}

        {/* Fields specific to Image Section */}
        {section.type === 'image' && (
          <div className="p-3 bg-gray-100 rounded border border-gray-200">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Tamanho da Imagem</label>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`size-${section.id}`}
                  checked={section.imageSize === 'small'}
                  onChange={() => onUpdate(section.id, 'imageSize', 'small')}
                  className="text-falconi-primary focus:ring-falconi-primary"
                />
                <span className="text-sm">Pequeno</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`size-${section.id}`}
                  checked={section.imageSize === 'medium'}
                  onChange={() => onUpdate(section.id, 'imageSize', 'medium')}
                  className="text-falconi-primary focus:ring-falconi-primary"
                />
                <span className="text-sm">Médio</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={`size-${section.id}`}
                  checked={!section.imageSize || section.imageSize === 'large'}
                  onChange={() => onUpdate(section.id, 'imageSize', 'large')}
                  className="text-falconi-primary focus:ring-falconi-primary"
                />
                <span className="text-sm">Grande (Full)</span>
              </label>
            </div>
          </div>
        )}

        {/* Fields for Images (Hero, Step, Image) */}
        {/* Fields for Images (Hero, Step, Image) */}
        {(section.type === 'hero' || section.type === 'step' || section.type === 'image') && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-3 bg-white p-2 border rounded">
              {section.image && (
                <div className="relative w-16 h-12 rounded overflow-hidden border">
                  <img
                    src={section.image}
                    alt="Section"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";
                      e.currentTarget.onerror = null; // Prevent infinite loop
                    }}
                  />
                  <button
                    onClick={() => onUpdate(section.id, 'image', null)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
              <label className="cursor-pointer text-falconi-primary text-xs font-bold hover:underline flex items-center">
                <ImageIcon size={14} className="mr-1" />
                {section.image ? 'Trocar Imagem' : 'Adicionar Imagem'}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => onImageUpload(e, section.id)} />
              </label>
            </div>

            <ImageSuggester
              context={`${section.title} ${section.content || ''}`}
              onSelect={(url) => onUpdate(section.id, 'image', url)}
            />
          </div>
        )}

        {/* Fields for Step */}
        {
          section.type === 'step' && (
            <>
              <textarea
                placeholder="Checklist (um item por linha - formato texto simples)..."
                value={section.listItems || ''}
                onChange={(e) => onUpdate(section.id, 'listItems', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none text-sm"
              />
              <textarea
                placeholder="Sugestão de Prompt (aparecerá na caixa de código)..."
                value={section.promptSuggestion || ''}
                onChange={(e) => onUpdate(section.id, 'promptSuggestion', e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none text-sm font-mono bg-yellow-50"
              />
            </>
          )
        }
      </div >
    </div >
  );
};

const Editor: React.FC<EditorProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof ContentData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleSectionChange = (id: string, field: keyof Section, value: any) => {
    const newSections = data.sections.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    );
    handleChange('sections', newSections);
  };

  const addSection = (index?: number) => {
    const newSection: Section = {
      id: Date.now().toString(),
      type: 'step',
      title: 'Nova Seção',
      content: '',
      image: null
    };

    if (index !== undefined) {
      const newSections = [...data.sections];
      newSections.splice(index, 0, newSection);
      handleChange('sections', newSections);
    } else {
      handleChange('sections', [...data.sections, newSection]);
    }
  };

  const removeSection = (id: string) => {
    handleChange('sections', data.sections.filter(s => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...data.sections];
    if (direction === 'up' && index > 0) {
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
    } else if (direction === 'down' && index < newSections.length - 1) {
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    }
    handleChange('sections', newSections);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      // Optimistic update with local blob for immediate feedback
      const localUrl = URL.createObjectURL(file);
      handleSectionChange(sectionId, 'image', localUrl);

      try {
        const formData = new FormData();
        formData.append('file', file); // API expects body, but we'll send raw body in fetch

        // Upload to Vercel Blob via our API route
        const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
          method: 'POST',
          body: file,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Upload failed with status:', response.status, 'Response:', errorText);
          try {
            const errorData = JSON.parse(errorText);
            throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
          } catch {
            throw new Error(`Upload failed (${response.status}): ${errorText.substring(0, 50)}...`);
          }
        }

        const newBlob = await response.json();
        // Update with the permanent public URL
        handleSectionChange(sectionId, 'image', newBlob.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
        alert(`Erro ao fazer upload da imagem: ${errorMessage}. Usando versão local (não funcionará em e-mails externos).`);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-falconi-primary mb-4 border-b pb-2">Cabeçalho Global</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cabeçalho (Ex: Briefing | Tópico)</label>
            <input
              type="text"
              value={data.headerTitle}
              onChange={(e) => handleChange('headerTitle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo Principal</label>
            <input
              type="text"
              value={data.headerSubtitle}
              onChange={(e) => handleChange('headerSubtitle', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
              <input
                type="text"
                value={data.author}
                onChange={(e) => handleChange('author', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo Leitura</label>
              <input
                type="text"
                value={data.readTime}
                onChange={(e) => handleChange('readTime', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-falconi-primary mb-4 border-b pb-2">Seções de Conteúdo</h2>

        <div className="space-y-6">
          {data.sections.map((section, index) => (
            <React.Fragment key={section.id}>
              <SectionEditor
                section={section}
                index={index}
                total={data.sections.length}
                onUpdate={handleSectionChange}
                onRemove={removeSection}
                onMove={moveSection}
                onImageUpload={handleImageUpload}
              />
              {/* Insert Button Between Sections */}
              <div className="relative group h-4 flex items-center justify-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
                onClick={() => addSection(index + 1)}
                title="Inserir Nova Seção Aqui">
                <div className="absolute w-full h-px bg-falconi-primary/50"></div>
                <div className="z-10 bg-white border border-falconi-primary text-falconi-primary rounded-full p-1 shadow-sm transform scale-75 group-hover:scale-100 transition-transform">
                  <Plus size={16} />
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => addSection()}
          className="mt-2 w-full py-3 bg-falconi-gray text-falconi-primary font-bold rounded border-2 border-dashed border-falconi-primary hover:bg-falconi-secondary hover:border-solid transition flex items-center justify-center"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Nova Seção (Final)
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-falconi-primary mb-4 border-b pb-2">Rodapé Global</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Texto Botão Rodapé</label>
            <input
              type="text"
              value={data.footerCtaText}
              onChange={(e) => handleChange('footerCtaText', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Botão Rodapé</label>
            <input
              type="text"
              value={data.footerCtaLink}
              onChange={(e) => handleChange('footerCtaLink', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-falconi-primary focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;