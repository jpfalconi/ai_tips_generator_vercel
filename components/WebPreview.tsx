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
           className={`${className} [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>a]:text-falconi-primary [&>a]:underline [&>a:hover]:text-falconi-secondary`}
           dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

const HeroSection: React.FC<{ section: Section }> = ({ section }) => {
  const tags = section.tags ? section.tags.split(',').map(t => t.trim()) : [];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
       {section.image && (
         <div className="h-64 w-full relative">
            <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-falconi-primary/60 to-transparent"></div>
            <div className="absolute bottom-4 left-6 text-white text-2xl font-bold uppercase tracking-wider opacity-80">
               Falconi AI
            </div>
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
           <img src={section.image} alt={section.title} className="w-full h-auto" />
        </div>
        {section.title && (
           <p className="mt-2 text-sm text-gray-500 italic">{section.title}</p>
        )}
     </div>
  );
};

const FeatureCard: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition">
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
        <div className="w-full h-64 overflow-hidden">
           <img src={section.image} alt={section.title} className="w-full h-full object-cover" />
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