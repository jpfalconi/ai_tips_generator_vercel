import { ContentData, Section } from '../types';
import { COLORS } from '../constants';

const formatText = (text: string) => {
  if (!text) return '';
  // Text comes as HTML from the rich editor.
  // We only need to ensure list styles are inline for Outlook compatibility.
  let formatted = text;
  
  // Inject explicit styles for lists so they look good in Outlook/Gmail
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

const renderTags = (tags?: string) => {
    if (!tags) return '';
    return tags.split(',').map((tag, i) => `
        <span style="display:inline-block; font-size:10px; font-weight:bold; text-transform:uppercase; padding:4px 8px; border-radius:2px; margin-right:4px; margin-bottom: 4px; background-color: ${i === 1 ? COLORS.secondary : COLORS.primary}; color: ${i === 1 ? COLORS.primary : COLORS.white};">
            ${tag.trim()}
        </span>
    `).join('');
};

const renderHero = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
       ${section.image ? `
       <tr>
         <td height="200" style="background-image: url('${section.image}'); background-size: cover; background-position: center; height: 200px;">
            <!--[if gte mso 9]>
            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px;height:200px;">
            <v:fill type="tile" src="${section.image}" color="#7A7423" />
            <v:textbox inset="0,0,0,0">
            <![endif]-->
            <div style="height: 100%; width: 100%;"></div>
            <!--[if gte mso 9]>
            </v:textbox>
            </v:rect>
            <![endif]-->
         </td>
       </tr>
       ` : ''}
       <tr>
         <td style="padding: 25px;">
           <div style="margin-bottom: 15px;">
              ${renderTags(section.tags)}
           </div>
           <h2 style="margin: 0 0 15px 0; color: #000000; font-family: Arial, sans-serif; font-size: 24px; font-weight: bold;">${section.title}</h2>
           <div style="margin: 0 0 20px 0; color: #555555; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">${formatText(section.content)}</div>
           ${section.ctaText ? `
             <table cellpadding="0" cellspacing="0">
               <tr>
                 <td bgcolor="${COLORS.primary}" style="border-radius: 4px;">
                   <a href="${section.ctaLink}" style="display: block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">${section.ctaText} &rarr;</a>
                 </td>
               </tr>
             </table>
           ` : ''}
         </td>
       </tr>
    </table>
  </td>
</tr>
`;

const renderImageSection = (section: Section) => {
    if (!section.image) return '';
    
    let width = '600'; // Default large
    if (section.imageSize === 'small') width = '250';
    if (section.imageSize === 'medium') width = '450';

    return `
    <tr>
      <td align="center" style="padding-bottom: 30px;">
         <img src="${section.image}" width="${width}" style="max-width: 100%; height: auto; border-radius: 6px;" alt="${section.title}" />
         ${section.title ? `<div style="font-family: Arial, sans-serif; font-size: 12px; color: #888; font-style: italic; margin-top: 5px;">${section.title}</div>` : ''}
      </td>
    </tr>
    `;
};

const renderFeature = (section: Section) => `
<tr>
  <td style="padding-bottom: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px;">
      <tr>
        <td width="60" valign="top" style="padding: 20px 0 20px 20px;">
           <div style="width: 40px; height: 40px; background-color: ${COLORS.gray}; border-radius: 4px; text-align: center; line-height: 40px; color: ${COLORS.primary}; font-weight: bold; font-family: Arial, sans-serif;">
              ${section.icon ? '★' : '★'} 
           </div>
        </td>
        <td valign="top" style="padding: 20px;">
           <h3 style="margin: 0 0 5px 0; font-size: 16px; font-family: Arial, sans-serif; color: #000000;">${section.title}</h3>
           <div style="margin: 0 0 10px 0; font-size: 14px; font-family: Arial, sans-serif; color: #666666; line-height: 1.4;">${formatText(section.content)}</div>
           ${section.ctaText ? `<a href="${section.ctaLink}" style="color: ${COLORS.primary}; font-size: 12px; font-weight: bold; font-family: Arial, sans-serif; text-decoration: none;">${section.ctaText} &rsaquo;</a>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderBanner = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.primary}; border-radius: 8px;">
      <tr>
        <td width="60" valign="top" style="padding: 20px 0 20px 20px;">
           <div style="width: 30px; height: 30px; background-color: rgba(255,255,255,0.2); border-radius: 4px; text-align: center; line-height: 30px; color: ${COLORS.secondary}; font-family: Arial, sans-serif; font-size: 18px;">
             !
           </div>
        </td>
        <td style="padding: 20px 20px 20px 0; color: #ffffff; font-family: Arial, sans-serif;">
           <h3 style="margin: 0 0 5px 0; font-size: 16px;">${section.title}</h3>
           <div style="margin: 0; font-size: 14px; opacity: 0.9;">${formatText(section.content)}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderStep = (section: Section) => `
<tr>
  <td style="padding-bottom: 40px;">
     <!-- Header -->
     <table width="100%" cellpadding="0" cellspacing="0">
       <tr>
         <td style="border-bottom: 1px solid #eeeeee; padding-bottom: 15px; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 20px; font-family: Arial, sans-serif; color: ${COLORS.black}; font-weight: bold;">
               ${section.title}
            </h3>
         </td>
       </tr>
     </table>
     
     ${section.image ? `
     <div style="padding: 15px 0;">
        <img src="${section.image}" width="600" alt="${section.title}" style="width: 100%; height: auto; border-radius: 8px; display: block;" />
     </div>
     ` : ''}

     <div style="font-family: Arial, sans-serif; font-size: 16px; color: #444444; line-height: 1.6; margin: 15px 0 20px 0;">
       ${formatText(section.content)}
     </div>

     ${section.listItems ? `
     <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
        ${section.listItems.split('\n').map(item => `
          <tr>
            <td width="25" valign="top" style="padding-bottom: 10px;">
              <span style="color: ${COLORS.secondary}; font-size: 18px; line-height: 18px;">●</span>
            </td>
            <td valign="top" style="padding-bottom: 10px; font-family: Arial, sans-serif; font-size: 15px; color: #555555;">
              ${item}
            </td>
          </tr>
        `).join('')}
     </table>
     ` : ''}

     ${section.promptSuggestion ? `
     <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.beige}; border: 1px solid #f0f0f0; border-radius: 6px;">
       <tr>
         <td style="padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: bold; text-transform: uppercase; color: ${COLORS.primary}; letter-spacing: 1px; font-family: Arial, sans-serif;">
               Sugestão de Prompt
            </p>
            <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 13px; color: #444444; line-height: 1.6;">
               ${section.promptSuggestion.replace(/\n/g, '<br/>')}
            </p>
         </td>
       </tr>
     </table>
     ` : ''}
  </td>
</tr>
`;

export const generateEmailHTML = (data: ContentData): string => {
  const { headerTitle, headerSubtitle, author, footerCtaText, footerCtaLink, sections } = data;

  const sectionsHtml = sections.map(section => {
    switch (section.type) {
      case 'hero': return renderHero(section);
      case 'feature': return renderFeature(section);
      case 'banner': return renderBanner(section);
      case 'step': return renderStep(section);
      case 'image': return renderImageSection(section);
      default: return '';
    }
  }).join('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${headerSubtitle}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.gray}; font-family: Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td style="padding: 40px 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; width: 600px; max-width: 600px;">
          
          <!-- Top Branding -->
          <tr>
            <td align="center" style="padding: 40px 20px 10px 20px;">
               <table border="0" cellpadding="0" cellspacing="0">
                 <tr>
                   <td align="center" style="background-color: ${COLORS.gray}; border-radius: 50%; width: 50px; height: 50px;">
                      <img src="https://ui-avatars.com/api/?name=Falconi&background=7A7423&color=fff&size=32" width="32" style="display:block; border-radius:50%;" />
                   </td>
                 </tr>
               </table>
               <p style="margin: 15px 0 5px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; font-weight: bold;">${headerTitle}</p>
               <h1 style="margin: 0; font-size: 28px; color: #000000;">${headerSubtitle}</h1>
            </td>
          </tr>

          <!-- Spacer -->
          <tr><td height="40" style="font-size:0; line-height:0;">&nbsp;</td></tr>

          <!-- Sections -->
          <tr>
             <td style="padding: 0 40px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                   ${sectionsHtml}
                </table>
             </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 30px 40px 50px 40px; border-top: 1px solid #eeeeee;">
              <p style="font-size: 14px; color: #888888; font-style: italic; margin-bottom: 20px;">
                 Aplique estes princípios diariamente para elevar seu nível de excelência operacional.
              </p>
              <p style="font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; margin-bottom: 30px;">
                 ${author}
              </p>
              <a href="${footerCtaLink}" style="background-color: ${COLORS.primary}; color: #ffffff; padding: 14px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                ${footerCtaText}
              </a>
              
              <!-- Creator Signature -->
              <p style="margin-top: 40px; font-size: 10px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px;">
                 Criado pelo Time de Automação & IA
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Generates an EML file compatible with Outlook.
 * Includes X-Unsent header to open as a Draft.
 */
export const generateEML = (data: ContentData): string => {
  const html = generateEmailHTML(data);
  
  // The 'X-Unsent: 1' header tells Outlook to open this as a Draft (Compose mode)
  // instead of a received message.
  return `To: 
Subject: ${data.headerSubtitle}
X-Unsent: 1
Content-Type: text/html; charset="utf-8"

${html}`;
};