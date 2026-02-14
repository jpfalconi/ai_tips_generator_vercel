import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ContentData } from "../types";

// Schema definition remains the same
const contentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    headerTitle: { type: Type.STRING, description: "Small category header, e.g., 'Estratégia | IA'" },
    headerSubtitle: { type: Type.STRING, description: "Main title of the newsletter" },
    author: { type: Type.STRING },
    readTime: { type: Type.STRING },
    footerCtaText: { type: Type.STRING },
    footerCtaLink: { type: Type.STRING },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { type: Type.STRING, enum: ["hero", "feature", "step", "banner", "image"] },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          image: { type: Type.STRING, nullable: true },
          tags: { type: Type.STRING, nullable: true },
          icon: { type: Type.STRING, nullable: true },
          ctaText: { type: Type.STRING, nullable: true },
          ctaLink: { type: Type.STRING, nullable: true },
          promptSuggestion: { type: Type.STRING, nullable: true },
          listItems: { type: Type.STRING, nullable: true, description: "Newline separated list items" },
          imageSize: { type: Type.STRING, enum: ["small", "medium", "large"], nullable: true }
        },
        required: ["id", "type", "title", "content"]
      }
    }
  },
  required: ["headerTitle", "headerSubtitle", "sections"]
};

// Function now uses process.env.API_KEY
export const generateBriefingFromText = async (rawText: string): Promise<ContentData | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key configuration missing. Please ensure process.env.API_KEY is set.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
        You are a content strategist for Falconi, a leading consulting firm.
        Analyze the following raw text and structure it into a JSON format suitable for a corporate newsletter/landing page.
        
        Rules:
        1. Identify the main topic and use it for 'headerSubtitle'.
        2. Create a 'hero' section for the main introduction/highlight. Use 'Falconi AI' tags if relevant.
        3. If there are lists of benefits, create 'feature' sections. Choose appropriate icons from this list: Zap, BarChart, Shield, Bot, Settings, FileText, Database, Cpu, Lightbulb, Target, Rocket, Users, Clock, CheckCircle, AlertTriangle, Brain, TrendingUp, Globe.
        4. If there are instructions or "how-to", use 'step' sections. If a prompt is mentioned, put it in 'promptSuggestion'.
        5. If there are warnings or important notes, use a 'banner' section.
        6. Keep the tone professional, concise, and action-oriented (Falconi style).
        7. Use placeholders for images if not specified, but try to use high-quality Unsplash URLs if the context allows estimation.
        8. Default 'author' to "Falconi Intelligence Unit".
        9. Default 'readTime' based on content length.
        
        Raw Text:
        ${rawText}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: contentSchema,
        temperature: 0.4,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as ContentData;
      // Ensure unique IDs
      parsed.sections = parsed.sections.map((s, i) => ({
        ...s,
        id: Date.now().toString() + i
      }));
      return parsed;
    }
    return null;

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};