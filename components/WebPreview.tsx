import React from 'react';
import { ContentData, Section } from '../types';
import * as Icons from 'lucide-react';

interface WebPreviewProps {
  data: ContentData;
}

const DynamicIcon: React.FC<{ name?: string; className?: string }> = ({ name, className }) => {
  if (!name) return null;
  // @ts-ignore
  const IconComponent = Icons[name];
  return IconComponent ? <IconComponent className={className} /> : null;
};

const RichTextContent: React.FC<{ content: string, className?: string }> = ({ content, className }) => {
  return (
    <div
      className={`${className} [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul>li]:mb-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-falconi-primary [&_a]:underline [&_a:hover]:text-falconi-secondary`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

const HeroSection: React.FC<{ section: Section }> = ({ section }) => {
  const tags = section.tags ? section.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      {section.image && (
        <div className="w-full relative">
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-auto block"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";
              e.currentTarget.onerror = null;
            }}
          />

        </div>
      )}
      <div className="p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <span key={i} className={`text-xs font-bold uppercase px-3 py-1 rounded-sm ${i === 1 ? 'bg-falconi-secondary text-falconi-primary' : 'bg-falconi-primary text-white'}`}>
              {tag}
            </span>
          ))}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
        <RichTextContent
          content={section.content}
          className="text-gray-600 text-lg leading-relaxed mb-6"
        />
        {section.ctaText && (
          <a href={section.ctaLink || '#'} className="inline-flex items-center gap-2 bg-falconi-primary text-white font-bold py-3 px-6 rounded hover:bg-opacity-90 transition">
            {section.ctaText} <Icons.ArrowRight size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

const ImageSection: React.FC<{ section: Section }> = ({ section }) => {
  if (!section.image) return null;

  let containerClass = "w-full";
  if (section.imageSize === 'small') containerClass = "max-w-xs mx-auto";
  else if (section.imageSize === 'medium') containerClass = "max-w-xl mx-auto";

  return (
    <div className="mb-8 text-center">
      <div className={`${containerClass} overflow-hidden rounded-lg shadow-sm`}>
        <img
          src={section.image}
          alt={section.title}
          className="w-full h-auto"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";
            e.currentTarget.onerror = null;
          }}
        />
      </div>
      {section.title && (
        <p className="mt-2 text-sm text-gray-500 italic">{section.title}</p>
      )}
    </div>
  );
};

const FeatureCard: React.FC<{ section: Section }> = ({ section }) => {
  let colSpan = 'col-span-1';
  if (section.cardSize === 'medium') colSpan = 'md:col-span-2';
  if (section.cardSize === 'large') colSpan = 'md:col-span-2 lg:col-span-3';

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition ${colSpan}`}>
      <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded bg-falconi-gray text-falconi-primary">
        <DynamicIcon name={section.icon} className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{section.title}</h3>
      <div className="flex-grow text-gray-600 text-sm mb-4">
        <RichTextContent content={section.content} />
      </div>
      {section.ctaText && (
        <a href={section.ctaLink || '#'} className="text-falconi-primary text-sm font-bold flex items-center gap-1 hover:underline">
          {section.ctaText} <Icons.ChevronRight size={14} />
        </a>
      )}
    </div>
  );
};

const StepSection: React.FC<{ section: Section }> = ({ section }) => {
  const items = section.listItems ? section.listItems.split('\n') : [];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
      {/* Title Header */}
      <div className="bg-falconi-gray/30 p-6 border-b border-gray-100 flex items-center gap-4">
        <div className="bg-falconi-gray p-2 rounded text-falconi-primary">
          <Icons.Settings size={24} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
      </div>

      {section.image && (
        <div className="w-full overflow-hidden border-b border-gray-100">
          <img
            src={section.image}
            alt={section.title}
            className="w-full h-auto block"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop";
              e.currentTarget.onerror = null;
            }}
          />
        </div>
      )}

      <div className="p-6 md:p-8">
        <RichTextContent
          content={section.content}
          className="text-gray-700 mb-6 text-lg"
        />

        {items.length > 0 && (
          <ul className="space-y-3 mb-8">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-falconi-secondary flex items-center justify-center text-falconi-primary">
                  <Icons.Check size={12} strokeWidth={4} />
                </span>
                <span className="text-gray-600">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {section.promptSuggestion && (
          <div className="bg-orange-50/50 rounded-lg p-6 border border-orange-100 relative">
            <div className="absolute top-4 right-4 text-falconi-primary opacity-50">
              <Icons.Copy size={16} />
            </div>
            <div className="text-xs font-bold text-falconi-primary uppercase mb-2 tracking-wider flex items-center gap-1">
              <Icons.MessageSquare size={12} /> Sugestão de Prompt
            </div>
            <p className="font-mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {section.promptSuggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const BannerSection: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <div className="bg-falconi-primary rounded-lg p-6 text-white flex gap-4 items-start shadow-md mb-8">
      <div className="flex-shrink-0 bg-white/20 p-2 rounded">
        <DynamicIcon name={section.icon || 'Shield'} className="w-6 h-6 text-falconi-secondary" />
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{section.title}</h3>
        <RichTextContent
          content={section.content}
          className="text-white/90 text-sm leading-relaxed [&>a]:text-white [&>a]:underline"
        />
      </div>
    </div>
  );
};

const CodeSection: React.FC<{ section: Section }> = ({ section }) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(section.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 mb-8 shadow-md relative group">
      <div className="absolute top-4 right-4 flex gap-2">
        {section.codeLanguage && (
          <span className="text-xs text-gray-400 font-mono uppercase py-1 px-2 border border-gray-700 rounded">
            {section.codeLanguage}
          </span>
        )}
        <button onClick={handleCopy} className="text-gray-400 hover:text-white transition" title="Copiar">
          {copied ? <Icons.Check size={16} /> : <Icons.Copy size={16} />}
        </button>
      </div>
      {section.title && <h3 className="text-falconi-secondary font-bold mb-3 text-sm uppercase tracking-wider">{section.title}</h3>}
      <pre className="font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap">
        {section.content}
      </pre>
    </div>
  );
};

const QuoteSection: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <div className="border-l-4 border-falconi-secondary bg-gray-50 p-8 rounded-r-lg mb-8 shadow-sm">
      <Icons.Quote className="text-falconi-primary/20 mb-4" size={40} />
      <p className="text-xl md:text-2xl font-serif text-gray-800 italic mb-4 leading-relaxed">
        "{section.content}"
      </p>
      {section.author && (
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-falconi-primary"></div>
          <span className="text-sm font-bold text-falconi-primary uppercase tracking-widest">{section.author}</span>
        </div>
      )}
    </div>
  );
};

const StatSection: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <div className="bg-falconi-primary text-white p-8 rounded-lg mb-8 text-center shadow-lg relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-10 group-hover:opacity-20 transition">
        <Icons.TrendingUp size={150} />
      </div>
      <div className="relative z-10">
        <div className="text-5xl md:text-7xl font-bold mb-2 tracking-tighter text-falconi-secondary">
          {section.statValue}
        </div>
        {section.statLabel && (
          <div className="text-xl font-medium opacity-90">{section.statLabel}</div>
        )}
        {section.content && (
          <p className="mt-4 text-sm opacity-75 max-w-lg mx-auto">{section.content}</p>
        )}
      </div>
    </div>
  );
};

const ComparisonSection: React.FC<{ section: Section }> = ({ section }) => {
  const pros = section.prosList ? section.prosList.split('\n') : [];
  const cons = section.consList ? section.consList.split('\n') : [];

  return (
    <div className="mb-8">
      {section.title && <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">{section.title}</h2>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
          <div className="flex items-center gap-2 mb-4 text-green-700 font-bold uppercase tracking-wider text-sm border-b border-green-200 pb-2">
            <Icons.ThumbsUp size={18} /> Prós (Vantagens)
          </div>
          <ul className="space-y-3">
            {pros.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                <Icons.CheckCircle className="text-green-600 mt-0.5" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="bg-red-50 rounded-lg p-6 border border-red-100">
          <div className="flex items-center gap-2 mb-4 text-red-700 font-bold uppercase tracking-wider text-sm border-b border-red-200 pb-2">
            <Icons.ThumbsDown size={18} /> Contras (Pontos de Atenção)
          </div>
          <ul className="space-y-3">
            {cons.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                <Icons.XCircle className="text-red-600 mt-0.5" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const WebPreview: React.FC<WebPreviewProps> = ({ data }) => {
  // Logic to group 'feature' sections into a grid
  const renderSections = () => {
    const nodes: React.ReactNode[] = [];
    let featureBuffer: Section[] = [];

    const flushFeatures = () => {
      if (featureBuffer.length > 0) {
        nodes.push(
          <div key={`grid-${featureBuffer[0].id}`} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featureBuffer.map(f => <FeatureCard key={f.id} section={f} />)}
          </div>
        );
        featureBuffer = [];
      }
    };

    data.sections.forEach(section => {
      if (section.type === 'feature') {
        featureBuffer.push(section);
      } else {
        flushFeatures();
        if (section.type === 'hero') {
          nodes.push(<HeroSection key={section.id} section={section} />);
        } else if (section.type === 'step') {
          nodes.push(<StepSection key={section.id} section={section} />);
        } else if (section.type === 'image') {
          nodes.push(<ImageSection key={section.id} section={section} />);
        } else if (section.type === 'banner') {
          nodes.push(<BannerSection key={section.id} section={section} />);
        } else if (section.type === 'code') {
          nodes.push(<CodeSection key={section.id} section={section} />);
        } else if (section.type === 'quote') {
          nodes.push(<QuoteSection key={section.id} section={section} />);
        } else if (section.type === 'stat') {
          nodes.push(<StatSection key={section.id} section={section} />);
        } else if (section.type === 'comparison') {
          nodes.push(<ComparisonSection key={section.id} section={section} />);
        }
      }
    });
    flushFeatures();
    return nodes;
  };

  return (
    <div className="bg-white min-h-screen w-full font-sans text-falconi-black selection:bg-falconi-secondary selection:text-falconi-primary pb-12">
      <div className="max-w-3xl mx-auto pt-12 pb-8 text-center px-4">
        <div className="inline-block bg-falconi-gray p-3 rounded-full mb-4">
          <Icons.BrainCircuit className="text-falconi-primary" size={32} />
        </div>
        <h4 className="text-falconi-primary font-bold text-xs tracking-widest uppercase mb-2">
          {data.headerTitle}
        </h4>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {data.headerSubtitle}
        </h1>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        {renderSections()}

        {/* Footer CTA */}
        <div className="mt-12 text-center border-t border-gray-100 pt-12">
          <p className="text-sm text-gray-500 mb-4 italic">Aplique estes princípios diariamente para elevar seu nível de excelência operacional.</p>
          <p className="text-xs font-bold text-falconi-primary uppercase tracking-widest mb-6">{data.author}</p>
          <a href={data.footerCtaLink} className="inline-block bg-falconi-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition shadow-lg hover:-translate-y-1">
            {data.footerCtaText}
          </a>

          <p className="mt-12 text-[10px] text-gray-400 uppercase tracking-widest">
            Criado pelo Time de Automação & IA
          </p>
        </div>
      </main>
    </div>
  );
};

export default WebPreview;