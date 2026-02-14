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
    `<ul style="margin: 0 0 10px 0; padding-left: 20px; list-style-type: disc; mso-line-height-rule: exactly;">`
  );
  formatted = formatted.replace(
    /<li>/g,
    `<li style="margin-bottom: 5px; mso-line-height-rule: exactly;">`
  );

  // Replace <p> with div or table cell friendly spacing
  formatted = formatted.replace(
    /<p>/g,
    `<p style="margin: 0 0 10px 0; mso-line-height-rule: exactly;">`
  );

  return formatted;
};

// Tags need to be a table to work reliably in Outlook if they have background colors
const renderTags = (tags?: string) => {
  if (!tags) return '';
  const tagList = tags.split(',');

  // We use a nested table for tags to ensure they stay inline-block like
  return `
    <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 10px;">
      <tr>
        ${tagList.map((tag, i) => `
          <td style="padding-right: 5px;">
            <span style="font-size:10px; font-weight:bold; text-transform:uppercase; background-color: ${i === 1 ? COLORS.secondary : COLORS.primary}; color: ${i === 1 ? COLORS.primary : COLORS.white}; padding: 4px 8px; border-radius: 2px;">
              ${tag.trim()}
            </span>
          </td>
        `).join('')}
      </tr>
    </table>
  `;
};

const renderHero = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <!-- Main Hero Card -->
    <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e5e5; border-radius: 8px; background-color: #ffffff;">
       ${section.image ? `
       <tr>
         <td align="center" style="padding: 0; margin: 0;">
            <img src="${section.image}" width="700" style="display: block; width: 100%; max-width: 700px; height: auto; border-top-left-radius: 8px; border-top-right-radius: 8px;" alt="${section.title}" />
         </td>
       </tr>
       ` : ''}
       <tr>
         <td style="padding: 30px;">
           ${renderTags(section.tags)}
           <h2 style="margin: 0 0 15px 0; color: #000000; font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; line-height: 1.2;">${section.title}</h2>
           <div style="margin: 0 0 20px 0; color: #555555; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">${formatText(section.content)}</div>
           ${section.ctaText ? `
             <table cellpadding="0" cellspacing="0">
               <tr>
                 <td bgcolor="${COLORS.primary}" style="background-color: ${COLORS.primary}; border-radius: 4px;" align="center">
                   <a href="${section.ctaLink}" style="display: inline-block; padding: 12px 24px; color: #ffffff; text-decoration: none; font-family: Arial, sans-serif; font-weight: bold; font-size: 14px;">${section.ctaText} &rarr;</a>
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

  let width = '700'; // Default large
  if (section.imageSize === 'small') width = '300';
  if (section.imageSize === 'medium') width = '500';

  return `
    <tr>
      <td align="center" style="padding-bottom: 30px;">
         <img src="${section.image}" width="${width}" style="max-width: 100%; height: auto; border-radius: 6px; display: block;" alt="${section.title}" />
         ${section.title ? `<p style="font-family: Arial, sans-serif; font-size: 13px; color: #888; font-style: italic; margin-top: 8px; margin-bottom: 0;">${section.title}</p>` : ''}
      </td>
    </tr>
    `;
};

const renderFeature = (section: Section) => `
<tr>
  <td style="padding-bottom: 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #eeeeee; border-radius: 8px;">
      <tr>
        <td width="70" valign="top" style="padding: 25px 0 25px 25px;">
           <!-- Icon fallback -->
           <div style="width: 45px; height: 45px; background-color: ${COLORS.gray}; border-radius: 4px; text-align: center; line-height: 45px; color: ${COLORS.primary}; font-weight: bold; font-family: Arial, sans-serif; font-size: 22px;">
              ★
           </div>
        </td>
        <td valign="top" style="padding: 25px;">
           <h3 style="margin: 0 0 8px 0; font-size: 18px; font-family: Arial, sans-serif; color: #000000; font-weight: bold;">${section.title}</h3>
           <div style="margin: 0 0 12px 0; font-size: 15px; font-family: Arial, sans-serif; color: #666666; line-height: 1.5;">${formatText(section.content)}</div>
           ${section.ctaText ? `<a href="${section.ctaLink}" style="color: ${COLORS.primary}; font-size: 13px; font-weight: bold; font-family: Arial, sans-serif; text-decoration: none;">${section.ctaText} &rsaquo;</a>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderBanner = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${COLORS.primary}" style="background-color: ${COLORS.primary}; border-radius: 8px;">
      <tr>
        <td width="70" valign="top" style="padding: 25px 0 25px 25px;">
           <table cellpadding="0" cellspacing="0" border="0">
             <tr>
               <td width="35" height="35" bgcolor="rgba(255,255,255,0.2)" align="center" style="background-color: rgba(255,255,255,0.2); border-radius: 4px; color: ${COLORS.secondary}; font-family: Arial, sans-serif; font-size: 20px; font-weight: bold;">
                 !
               </td>
             </tr>
           </table>
        </td>
        <td style="padding: 25px 25px 25px 25px; color: #ffffff; font-family: Arial, sans-serif;">
           <h3 style="margin: 0 0 5px 0; font-size: 18px; font-weight: bold; color: #ffffff;">${section.title}</h3>
           <div style="margin: 0; font-size: 15px; opacity: 0.9; line-height: 1.5; color: #ffffff;">${formatText(section.content)}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderStat = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${COLORS.primary}" style="background-color: ${COLORS.primary}; border-radius: 8px; color: #ffffff; text-align: center;">
      <tr>
        <td style="padding: 50px 30px;">
           <div style="font-size: 56px; font-weight: bold; line-height: 1; margin-bottom: 12px; color: ${COLORS.secondary}; font-family: Arial, sans-serif;">${section.statValue}</div>
           ${section.statLabel ? `<div style="font-size: 20px; font-weight: bold; margin-bottom: 20px; opacity: 0.9; font-family: Arial, sans-serif;">${section.statLabel}</div>` : ''}
           ${section.content ? `<div style="font-size: 15px; opacity: 0.8; max-width: 500px; margin: 0 auto; line-height: 1.5; font-family: Arial, sans-serif;">${formatText(section.content)}</div>` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderQuote = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f9f9f9" style="background-color: #f9f9f9; border-left: 5px solid ${COLORS.secondary}; border-radius: 0 8px 8px 0;">
      <tr>
        <td style="padding: 35px;">
           <div style="font-size: 36px; line-height: 1; color: #dddddd; font-family: Georgia, serif; margin-bottom: 15px;">“</div>
           <div style="font-size: 20px; font-style: italic; color: #333333; line-height: 1.6; font-family: Georgia, serif; margin-bottom: 20px;">${formatText(section.content)}</div>
           ${section.author ? `
             <table cellpadding="0" cellspacing="0">
               <tr>
                 <td width="35" style="border-top: 1px solid ${COLORS.primary};"></td>
                 <td style="padding-left: 12px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; font-family: Arial, sans-serif;">${section.author}</td>
               </tr>
             </table>
           ` : ''}
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderCode = (section: Section) => `
<tr>
  <td style="padding-bottom: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" bgcolor="#1a1a1a" style="background-color: #1a1a1a; border-radius: 8px; border: 1px solid #333333;">
      <tr>
        <td style="padding: 25px;">
           ${section.title ? `<div style="font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${COLORS.secondary}; margin-bottom: 15px; font-family: Arial, sans-serif; letter-spacing: 1px;">${section.title}</div>` : ''}
           <div style="font-family: 'Courier New', Courier, monospace; font-size: 14px; color: #cfcfcf; line-height: 1.6; white-space: pre-wrap;">${section.content}</div>
        </td>
      </tr>
    </table>
  </td>
</tr>
`;

const renderComparison = (section: Section) => {
  const pros = section.prosList ? section.prosList.split('\n') : [];
  const cons = section.consList ? section.consList.split('\n') : [];

  return `
  <tr>
    <td style="padding-bottom: 30px;">
      ${section.title ? `<h3 style="text-align: center; margin: 0 0 25px 0; font-size: 22px; font-family: Arial, sans-serif; color: #000000;">${section.title}</h3>` : ''}
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <!-- Pros -->
          <td width="330" valign="top" bgcolor="#f0fdf4" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 25px; width: 330px;">
             <div style="font-weight: bold; color: #15803d; margin-bottom: 15px; font-family: Arial, sans-serif; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #bbf7d0; padding-bottom: 8px;">
               ✔ ${section.prosLabel || 'PRÓS'}
             </div>
             <table width="100%" cellpadding="0" cellspacing="0">
                ${pros.map(item => `
                  <tr>
                    <td width="20" valign="top" style="color: #15803d; padding-bottom: 8px;">●</td>
                    <td valign="top" style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; padding-bottom: 8px;">${item}</td>
                  </tr>
                `).join('')}
             </table>
          </td>
          <!-- Spacer -->
          <td width="20" style="width: 20px;"></td>
          <!-- Cons -->
          <td width="330" valign="top" bgcolor="#fef2f2" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 25px; width: 330px;">
             <div style="font-weight: bold; color: #b91c1c; margin-bottom: 15px; font-family: Arial, sans-serif; font-size: 15px; text-transform: uppercase; border-bottom: 1px solid #fecaca; padding-bottom: 8px;">
               ✖ ${section.consLabel || 'CONTRAS'}
             </div>
             <table width="100%" cellpadding="0" cellspacing="0">
                ${cons.map(item => `
                  <tr>
                    <td width="20" valign="top" style="color: #b91c1c; padding-bottom: 8px;">●</td>
                    <td valign="top" style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; padding-bottom: 8px;">${item}</td>
                  </tr>
                `).join('')}
             </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  `;
};

const renderStep = (section: Section) => `
<tr>
  <td style="padding-bottom: 40px;">
     <!-- Header -->
     <table width="100%" cellpadding="0" cellspacing="0">
       <tr>
         <td style="border-bottom: 1px solid #eeeeee; padding-bottom: 15px; margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 22px; font-family: Arial, sans-serif; color: ${COLORS.black}; font-weight: bold;">
               ${section.title}
            </h3>
         </td>
       </tr>
     </table>
     
     ${section.image ? `
     <table width="100%" cellpadding="0" cellspacing="0">
       <tr>
         <td style="padding: 20px 0;">
            <img src="${section.image}" width="700" alt="${section.title}" style="width: 100%; max-width: 700px; height: auto; border-radius: 8px; display: block;" />
         </td>
       </tr>
     </table>
     ` : ''}

     <div style="font-family: Arial, sans-serif; font-size: 16px; color: #444444; line-height: 1.6; margin: 15px 0 25px 0;">
       ${formatText(section.content)}
     </div>

     ${section.listItems ? `
     <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 25px;">
        ${section.listItems.split('\n').map(item => `
          <tr>
            <td width="25" valign="top" style="padding-bottom: 12px;">
              <span style="color: ${COLORS.secondary}; font-size: 18px; line-height: 18px;">●</span>
            </td>
            <td valign="top" style="padding-bottom: 12px; font-family: Arial, sans-serif; font-size: 15px; color: #555555;">
              ${item}
            </td>
          </tr>
        `).join('')}
     </table>
     ` : ''}

     ${section.promptSuggestion ? `
     <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${COLORS.beige}" style="background-color: ${COLORS.beige}; border: 1px solid #f0f0f0; border-radius: 6px;">
       <tr>
         <td style="padding: 25px;">
            <p style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; text-transform: uppercase; color: ${COLORS.primary}; letter-spacing: 1px; font-family: Arial, sans-serif;">
               Sugestão de Prompt
            </p>
            <p style="margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 14px; color: #444444; line-height: 1.6;">
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
      case 'quote': return renderQuote(section);
      case 'stat': return renderStat(section);
      case 'code': return renderCode(section);
      case 'comparison': return renderComparison(section);
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
        <!-- Container width fixed at 700px -->
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="700" style="background-color: #ffffff; width: 700px; max-width: 700px;">
          
          <!-- Top Branding -->
          <tr>
            <td align="center" style="padding: 40px 20px 10px 20px;">
               <table border="0" cellpadding="0" cellspacing="0">
                 <tr>
                   <td align="center" bgcolor="${COLORS.gray}" style="background-color: ${COLORS.gray}; border-radius: 50%; width: 50px; height: 50px;">
                      <img src="https://ui-avatars.com/api/?name=Falconi&background=7A7423&color=fff&size=32" width="32" style="display:block; border-radius:50%;" />
                   </td>
                 </tr>
               </table>
               <p style="margin: 15px 0 5px 0; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; font-weight: bold;">${headerTitle}</p>
               <h1 style="margin: 0; font-size: 32px; color: #000000; letter-spacing: -1px; font-family: Arial, sans-serif;">${headerSubtitle}</h1>
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
            <td align="center" style="padding: 40px 40px 60px 40px; border-top: 1px solid #eeeeee;">
              <p style="font-size: 15px; color: #888888; font-style: italic; margin-bottom: 25px;">
                 Aplique estes princípios diariamente para elevar seu nível de excelência operacional.
              </p>
              <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.primary}; margin-bottom: 35px;">
                 ${author}
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td bgcolor="${COLORS.primary}" style="background-color: ${COLORS.primary}; border-radius: 50px;">
                    <a href="${footerCtaLink}" style="color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                      ${footerCtaText}
                    </a>
                  </td>
                </tr>
              </table>
              
              <!-- Creator Signature -->
              <p style="margin-top: 45px; font-size: 11px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px;">
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