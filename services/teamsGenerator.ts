import { GoogleGenAI, Type, Schema } from "@google/genai";
import { TeamsPost, AdaptiveCard, ContentData } from "../types";
import { FALCONI_SYSTEM_PROMPT, TEAMS_TONE_GUIDELINES } from "../falconiTone";

const teamsPostSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headline: {
      type: Type.STRING,
      description: "Short, impactful headline (max 10 words). No emoji. Bold-worthy."
    },
    body: {
      type: Type.STRING,
      description: "1-2 sentence hook explaining why this matters. Connect to business impact."
    },
    bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 actionable bullet points. Each starts with a bold key term. Concrete and specific."
    },
    cta: {
      type: Type.STRING,
      description: "Call to action or engagement question (max 15 words)."
    },
    ctaLink: {
      type: Type.STRING,
      nullable: true,
      description: "Optional link URL for the CTA."
    },
    hashtags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-3 hashtags in Portuguese. e.g. ['#IA', '#ExcelênciaOperacional']"
    },
    topic: {
      type: Type.STRING,
      description: "Short topic/category label, e.g. 'IA no Trabalho' or 'Produtividade'"
    }
  },
  required: ["headline", "body", "bullets", "cta", "hashtags", "topic"]
};

export const generateTeamsPost = async (input: string): Promise<TeamsPost | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key configuration missing.");

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: `
${FALCONI_SYSTEM_PROMPT}

${TEAMS_TONE_GUIDELINES}

## Task
Generate a Microsoft Teams channel post about the following topic/content.
The post must follow Falconi's brand voice and be formatted for a professional Teams channel.
It should be engaging, data-driven, and immediately actionable.

## User Input
"${input}"

## Output
Return a JSON object following the schema exactly.
All text must be in Brazilian Portuguese.
Bullets should use markdown bold for key terms: "**Termo:** descrição"
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: teamsPostSchema,
      temperature: 0.75,
    },
  });

  if (!response.text) return null;

  const post = JSON.parse(response.text) as TeamsPost;
  post.adaptiveCard = buildAdaptiveCard(post);
  return post;
};

export const generateTeamsPostFromContentData = async (data: ContentData): Promise<TeamsPost | null> => {
  const summary = `
Título: ${data.headerSubtitle}
Tópico: ${data.headerTitle}
Conteúdo principal: ${data.sections
    .filter(s => s.type === 'hero' || s.type === 'feature')
    .map(s => `${s.title}: ${s.content}`)
    .join('\n')}
  `.trim();

  return generateTeamsPost(summary);
};

export const buildAdaptiveCard = (post: TeamsPost): AdaptiveCard => {
  const bulletsFormatted = post.bullets.map(b => ({
    type: "TextBlock",
    text: `• ${b}`,
    wrap: true,
    spacing: "Small" as const,
  }));

  return {
    type: "AdaptiveCard",
    version: "1.4",
    body: [
      {
        type: "Container",
        items: [
          {
            type: "ColumnSet",
            items: [
              {
                type: "TextBlock",
                text: `🟢 ${post.topic.toUpperCase()}`,
                size: "Small",
                weight: "Bolder",
                color: "Accent",
                wrap: false,
              }
            ]
          },
          {
            type: "TextBlock",
            text: post.headline,
            size: "Large",
            weight: "Bolder",
            wrap: true,
            spacing: "Small",
          },
          {
            type: "TextBlock",
            text: post.body,
            wrap: true,
            spacing: "Small",
            color: "Default",
          },
          {
            type: "TextBlock",
            text: "─────────────────────",
            spacing: "Small",
            color: "Light",
          },
          ...bulletsFormatted,
          {
            type: "TextBlock",
            text: post.hashtags.join(" "),
            spacing: "Medium",
            size: "Small",
            color: "Accent",
            wrap: true,
          }
        ]
      }
    ],
    actions: [
      {
        type: "Action.OpenUrl",
        title: post.cta,
        url: post.ctaLink || "https://falconi.com",
      }
    ]
  };
};

export const formatTeamsMarkdown = (post: TeamsPost): string => {
  const bulletsText = post.bullets.map(b => `• ${b}`).join('\n');
  const hashtagsText = post.hashtags.join(' ');

  return `**${post.headline}**

${post.body}

${bulletsText}

---
💡 ${post.cta}${post.ctaLink ? ` → ${post.ctaLink}` : ''}

${hashtagsText}`;
};
