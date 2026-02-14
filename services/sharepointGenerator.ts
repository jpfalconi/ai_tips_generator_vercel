import { ContentData, Section } from '../types';
import { COLORS } from '../constants';

const ICONS: Record<string, string> = {
  Zap: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  BarChart: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
  Shield: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
  Bot: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>',
  Settings: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
  FileText: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>',
  Database: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>',
  Cpu: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>',
  Lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .5 2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>',
  Target: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
  Rocket: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 2a20 20 0 0 0-7.83 2.55 20 20 0 0 0 2.55 7.83"></path><path d="M12 22a20 20 0 0 0 7.83-2.55 20 20 0 0 0-2.55-7.83"></path></svg>',
  Users: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  Clock: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  CheckCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  AlertTriangle: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  Brain: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path></svg>',
  TrendingUp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>',
  Globe: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>'
};

const formatText = (text: string) => {
  if (!text) return '';
  // The rich editor returns HTML. We don't need to replace newlines.
  // We just ensure lists have inline styles for SharePoint/Email compatibility.
  let formatted = text;

  formatted = formatted.replace(
    /<ul>/g,
    `<ul style="margin: 0 0 10px 0; padding-left: 20px; list-style-type: disc;">`
  );
  formatted = formatted.replace(
    /<li>/g,
    `<li style="margin-bottom: 5px;">`
  );

  return formatted;
};

const getIcon = (name?: string, color: string = 'currentColor') => {
  if (!name || !ICONS[name]) return '★';
  // Inject color into the SVG string
  return ICONS[name].replace('stroke="currentColor"', `stroke="${color}"`);
};

const renderTags = (tags?: string) => {
  if (!tags) return '';
  return tags.split(',').map((tag, i) => `
        <span style="display:inline-block; font-size:11px; font-weight:bold; text-transform:uppercase; padding:4px 8px; border-radius:2px; margin-right:4px; margin-bottom: 4px; background-color: ${i === 1 ? COLORS.secondary : COLORS.primary}; color: ${i === 1 ? COLORS.primary : COLORS.white};">
            ${tag.trim()}
        </span>
    `).join('');
};

const renderHero = (section: Section) => `
<div style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; margin-bottom: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
   ${section.image ? `
   <div style="width: 100%; height: 200px; background-image: url('${section.image}'); background-size: cover; background-position: center;"></div>
   ` : ''}
   <div style="padding: 24px;">
       <div style="margin-bottom: 12px;">
          ${renderTags(section.tags)}
       </div>
       <h2 style="margin: 0 0 12px 0; color: #333333; font-family: 'Segoe UI Semibold', 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 24px;">${section.title}</h2>
       <div style="margin: 0 0 20px 0; color: #4a4a4a; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.5;">${formatText(section.content)}</div>
       ${section.ctaText ? `
         <a href="${section.ctaLink}" target="_blank" style="display: inline-block; background-color: ${COLORS.primary}; color: #ffffff; padding: 10px 20px; border-radius: 2px; text-decoration: none; font-family: 'Segoe UI Semibold', sans-serif; font-size: 14px;">
            ${section.ctaText} &rarr;
         </a>
       ` : ''}
   </div>
</div>
`;

const renderImageSection = (section: Section) => {
  if (!section.image) return '';

  let maxWidth = '100%';
  if (section.imageSize === 'small') maxWidth = '300px';
  if (section.imageSize === 'medium') maxWidth = '500px';

  return `
    <div style="text-align: center; margin-bottom: 30px;">
       <img src="${section.image}" style="max-width: ${maxWidth}; width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 5px rgba(0,0,0,0.05);" alt="${section.title}" />
       ${section.title ? `<div style="font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #888; font-style: italic; margin-top: 5px;">${section.title}</div>` : ''}
    </div>
    `;
};

const renderFeature = (section: Section) => `
<div style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 4px; padding: 20px; box-sizing: border-box; height: 100%;">
    <div style="width: 40px; height: 40px; background-color: ${COLORS.gray}; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: ${COLORS.primary}; margin-bottom: 16px;">
        ${getIcon(section.icon, COLORS.primary)}
    </div>
    <h3 style="margin: 0 0 8px 0; font-size: 18px; font-family: 'Segoe UI Semibold', sans-serif; color: #333; font-weight: 600;">${section.title}</h3>
    <div style="margin: 0 0 12px 0; font-size: 14px; font-family: 'Segoe UI', sans-serif; color: #666; line-height: 1.4;">${formatText(section.content)}</div>
    ${section.ctaText ? `
      <a href="${section.ctaLink}" target="_blank" style="color: ${COLORS.primary}; font-size: 13px; font-weight: 600; font-family: 'Segoe UI', sans-serif; text-decoration: none;">
         ${section.ctaText} &rsaquo;
      </a>
    ` : ''}
</div>
`;

const renderBanner = (section: Section) => `
<div style="background-color: ${COLORS.primary}; border-radius: 4px; padding: 20px; color: #ffffff; margin-bottom: 24px; display: flex; gap: 16px; align-items: flex-start;">
    <div style="background-color: rgba(255,255,255,0.2); width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${COLORS.secondary};">
       ${getIcon(section.icon, COLORS.secondary)}
    </div>
    <div>
       <h3 style="margin: 0 0 4px 0; font-size: 16px; font-family: 'Segoe UI Semibold', sans-serif; font-weight: 600;">${section.title}</h3>
       <div style="margin: 0; font-size: 14px; opacity: 0.95; font-family: 'Segoe UI', sans-serif; line-height: 1.5;">${formatText(section.content)}</div>
    </div>
</div>
`;

const renderStep = (section: Section) => `
<div style="background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 4px; overflow: hidden; margin-bottom: 24px;">
     <div style="background-color: ${COLORS.gray}40; padding: 16px 20px; border-bottom: 1px solid #eeeeee;">
        <h2 style="margin: 0; font-size: 20px; font-family: 'Segoe UI Semibold', sans-serif; color: #333; font-weight: 600;">
           ${section.title}
        </h2>
     </div>
     
     ${section.image ? `
     <div style="width: 100%; height: 250px; background-image: url('${section.image}'); background-size: cover; background-position: center;"></div>
     ` : ''}

     <div style="padding: 20px;">
         <div style="font-family: 'Segoe UI', sans-serif; font-size: 16px; color: #444; line-height: 1.6; margin: 0 0 20px 0;">
           ${formatText(section.content)}
         </div>

         ${section.listItems ? `
         <ul style="list-style: none; padding: 0; margin: 0 0 20px 0;">
            ${section.listItems.split('\n').map(item => `
              <li style="display: flex; gap: 12px; margin-bottom: 10px; align-items: flex-start;">
                <span style="color: ${COLORS.primary}; font-weight:bold;">✓</span>
                <span style="font-family: 'Segoe UI', sans-serif; font-size: 15px; color: #555;">${item}</span>
              </li>
            `).join('')}
         </ul>
         ` : ''}

         ${section.promptSuggestion ? `
         <div style="background-color: ${COLORS.beige}; border: 1px solid #f0f0f0; border-radius: 4px; padding: 16px;">
            <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${COLORS.primary}; letter-spacing: 0.5px; font-family: 'Segoe UI', sans-serif;">
               Sugestão de Prompt
            </p>
            <p style="margin: 0; font-family: Consolas, Monaco, 'Courier New', monospace; font-size: 13px; color: #333; line-height: 1.5; white-space: pre-wrap;">${section.promptSuggestion}</p>
         </div>
         ` : ''}
     </div>
</div>
`;

const renderQuote = (section: Section) => `
<div style="background-color: #f9f9f9; border-left: 5px solid ${COLORS.secondary}; padding: 24px; margin-bottom: 24px; border-radius: 0 4px 4px 0;">
    <div style="font-size: 32px; line-height: 1; color: #dddddd; font-family: Georgia, serif; margin-bottom: 8px;">“</div>
    <div style="font-size: 18px; font-style: italic; color: #333333; line-height: 1.6; font-family: Georgia, serif; margin-bottom: 16px;">${formatText(section.content)}</div>
    ${section.author ? `
      <div style="display: flex; align-items: center; gap: 12px;">
         <div style="height: 1px; width: 30px; background-color: ${COLORS.primary};"></div>
         <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; font-family: 'Segoe UI', sans-serif;">${section.author}</div>
      </div>
    ` : ''}
</div>
`;

const renderStat = (section: Section) => `
<div style="background-color: ${COLORS.primary}; color: #ffffff; padding: 32px; border-radius: 4px; text-align: center; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
    <div style="font-size: 56px; font-weight: bold; line-height: 1; margin-bottom: 8px; color: ${COLORS.secondary}; font-family: 'Segoe UI', sans-serif;">${section.statValue}</div>
    ${section.statLabel ? `<div style="font-size: 18px; font-weight: 600; margin-bottom: 16px; opacity: 0.95; font-family: 'Segoe UI', sans-serif;">${section.statLabel}</div>` : ''}
    ${section.content ? `<div style="font-size: 14px; opacity: 0.85; max-width: 500px; margin: 0 auto; line-height: 1.5; font-family: 'Segoe UI', sans-serif;">${formatText(section.content)}</div>` : ''}
</div>
`;

const renderCode = (section: Section) => `
<div style="background-color: #1e1e1e; border-radius: 4px; padding: 20px; margin-bottom: 24px; border: 1px solid #333;">
    ${section.title ? `<div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${COLORS.secondary}; margin-bottom: 10px; font-family: 'Segoe UI', sans-serif; letter-spacing: 0.5px; border-bottom: 1px solid #333; padding-bottom: 8px;">${section.title}</div>` : ''}
    <div style="font-family: Consolas, 'Courier New', monospace; font-size: 13px; color: #d4d4d4; line-height: 1.6; white-space: pre-wrap; overflow-x: auto;">${section.content}</div>
</div>
`;

const renderComparison = (section: Section) => {
  const pros = section.prosList ? section.prosList.split('\n') : [];
  const cons = section.consList ? section.consList.split('\n') : [];

  return `
  <div style="margin-bottom: 24px;">
    ${section.title ? `<h3 style="text-align: center; margin: 0 0 20px 0; font-size: 20px; font-family: 'Segoe UI Semibold', sans-serif; color: #333;">${section.title}</h3>` : ''}
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      
      <!-- Pros -->
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 20px;">
         <div style="font-weight: bold; color: #15803d; margin-bottom: 12px; font-family: 'Segoe UI', sans-serif; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #bbf7d0; padding-bottom: 8px; display: flex; align-items: center; gap: 6px;">
           <span>✔</span> ${section.prosLabel || 'PRÓS'}
         </div>
         <ul style="list-style: none; padding: 0; margin: 0;">
            ${pros.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; color: #333; font-size: 13px; font-family: 'Segoe UI', sans-serif;">
                <span style="color: #15803d;">●</span> ${item}
              </li>
            `).join('')}
         </ul>
      </div>

      <!-- Cons -->
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; padding: 20px;">
         <div style="font-weight: bold; color: #b91c1c; margin-bottom: 12px; font-family: 'Segoe UI', sans-serif; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #fecaca; padding-bottom: 8px; display: flex; align-items: center; gap: 6px;">
           <span>✖</span> ${section.consLabel || 'CONTRAS'}
         </div>
         <ul style="list-style: none; padding: 0; margin: 0;">
            ${cons.map(item => `
              <li style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 8px; color: #333; font-size: 13px; font-family: 'Segoe UI', sans-serif;">
                <span style="color: #b91c1c;">●</span> ${item}
              </li>
            `).join('')}
         </ul>
      </div>

    </div>
  </div>
  `;
};

export const generateSharePointHTML = (data: ContentData): string => {
  const { headerTitle, headerSubtitle, author, footerCtaText, footerCtaLink, sections } = data;

  let contentHtml = '';

  let featuresBuffer: Section[] = [];

  const flushFeatures = () => {
    if (featuresBuffer.length > 0) {
      contentHtml += `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; margin-bottom: 24px;">`;
      featuresBuffer.forEach(f => {
        contentHtml += renderFeature(f);
      });
      contentHtml += `</div>`;
      featuresBuffer = [];
    }
  };

  sections.forEach(section => {
    if (section.type === 'feature') {
      featuresBuffer.push(section);
    } else {
      flushFeatures();
      if (section.type === 'hero') contentHtml += renderHero(section);
      if (section.type === 'step') contentHtml += renderStep(section);
      if (section.type === 'image') contentHtml += renderImageSection(section);
      if (section.type === 'banner') contentHtml += renderBanner(section);
      if (section.type === 'quote') contentHtml += renderQuote(section);
      if (section.type === 'stat') contentHtml += renderStat(section);
      if (section.type === 'code') contentHtml += renderCode(section);
      if (section.type === 'comparison') contentHtml += renderComparison(section);
    }
  });
  flushFeatures();

  const innerBodyContent = `
    <div style="font-family: 'Segoe UI', 'Roboto', Helvetica, Arial, sans-serif; color: #333; max-width: 800px; margin: 0 auto; background-color: transparent;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px; padding-top: 10px;">
        <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; font-weight: 700;">${headerTitle}</p>
        <h1 style="margin: 0; font-size: 32px; color: #1a1a1a; font-family: 'Segoe UI Light', 'Segoe UI', sans-serif; font-weight: 300;">${headerSubtitle}</h1>
        <div style="width: 40px; height: 3px; background-color: ${COLORS.secondary}; margin: 16px auto;"></div>
      </div>

      <!-- Content -->
      <div>
        ${contentHtml}
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid #eaeaea;">
          <p style="font-size: 14px; color: #666; margin-bottom: 16px; font-style: italic;">
            Aplique estes princípios diariamente para elevar seu nível de excelência operacional.
          </p>
          <a href="${footerCtaLink}" target="_blank" style="display: inline-block; background-color: ${COLORS.primary}; color: #ffffff; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${footerCtaText}
          </a>
          <p style="margin-top: 30px; font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">
            Criado pelo Time de Automação & IA
          </p>
      </div>

    </div>
  `;

  // Explicitly set UTF-8 charset
  const fullHtmlDocument = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headerSubtitle}</title>
  <style>
    body { 
        margin: 0; 
        padding: 20px; 
        font-family: "Segoe UI", "Roboto", Helvetica, Arial, sans-serif; 
        background-color: #ffffff;
        box-sizing: border-box;
    }
    a { text-decoration: none; transition: opacity 0.2s; }
    a:hover { opacity: 0.8; }
  </style>
</head>
<body>
  ${innerBodyContent}
</body>
</html>
  `;

  return fullHtmlDocument.trim();
};