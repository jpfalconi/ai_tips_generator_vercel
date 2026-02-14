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
          type: { type: Type.STRING, enum: ["hero", "feature", "step", "banner", "image", "code", "quote", "stat", "comparison"] },
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          image: { type: Type.STRING, nullable: true },
          tags: { type: Type.STRING, nullable: true },
          icon: { type: Type.STRING, nullable: true },
          ctaText: { type: Type.STRING, nullable: true },
          ctaLink: { type: Type.STRING, nullable: true },
          promptSuggestion: { type: Type.STRING, nullable: true },
          listItems: { type: Type.STRING, nullable: true, description: "Newline separated list items" },
          imageSize: { type: Type.STRING, enum: ["small", "medium", "large"], nullable: true },

          // New fields for Advanced Types
          codeLanguage: { type: Type.STRING, nullable: true, description: "Language for code blocks (e.g., python, sql)" },
          author: { type: Type.STRING, nullable: true, description: "Author for quotes" },
          statValue: { type: Type.STRING, nullable: true, description: "Big number for stats (e.g. 40%)" },
          statLabel: { type: Type.STRING, nullable: true, description: "Label for stats (e.g. Efficiency Gain)" },
          prosList: { type: Type.STRING, nullable: true, description: "Newline separated pros" },
          consList: { type: Type.STRING, nullable: true, description: "Newline separated cons" }
        },
        required: ["id", "type", "title", "content"]
      }
    }
  },
  required: ["headerTitle", "headerSubtitle", "sections"]
};

// Enhanced function with "Web Search" simulation and Auto-Images
export const generateBriefingFromText = async (rawText: string): Promise<ContentData | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key configuration missing. Please ensure process.env.API_KEY is set.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // 1. Generate the Structure and Content
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
        You are an expert Content Strategist and Researcher for Falconi.
        
        GOAL: Transform the user's input (which might be just a topic) into a COMPREHENSIVE, PROFESSIONAL, and ACTIONABLE guide/newsletter.
        
        INSTRUCTIONS:
        1. **Research & Expand:** DO NOT just format the input. Validate the topic, "search" your internal knowledge base for best practices, statistics, and actionable steps related to the topic.
        2. **Structure:**
           - **Header:** Catchy, professional title.
           - **Hero Section:** Introduction that hooks the reader, explaining WHY this topic matters now.
           - **Feature Sections:** 2-3 key benefits, pillars, or statistics. Use diverse icons.
           - **Smart Sections (Use at least 1-2 of these):**
             - **Stat Highlight:** If there's a key ROI or metric (e.g. "40% Time Saved"), use 'stat' type.
             - **Quote:** If there's a relevant principle or quote, use 'quote' type.
             - **Comparison:** If comparing tools or approaches (e.g. Free vs Paid), use 'comparison' type.
             - **Code/Prompt:** If giving instructions for AI, ALWAYS provide the exact prompt in a 'code' section.
           - **Step-by-Step:** A detailed, practical "How-To" section. 
             - **CRITICAL:** You MUST populate the 'listItems' field with newline-separated steps. Do NOT put the steps in the 'content' field.
             - Example: "Open Excel\\nClick Data\\nSelect Copilot"
           - **Conclusion/Banner:** A final pro-tip or call to action.
        3. **Tone:** Falconi (Excellence, Results-Oriented, Data-Driven).
        4. **Images:** The system will generate images later, so you don't need to provide URLs, but ensure the titles/content are descriptive enough for image generation.
        
        USER INPUT:
        "${rawText}"
        
        OUTPUT FORMAT: JSON (strictly following the schema).
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: contentSchema,
        temperature: 0.7,
      },
    });

    if (response.text) {
      const parsed = JSON.parse(response.text) as ContentData;

      // 2. Post-Processing: Generate Images and Unique IDs in Parallel
      const enrichedSections = await Promise.all(parsed.sections.map(async (section, i) => {
        const uniqueId = Date.now().toString() + i;
        let imageUrl = section.image;

        // Auto-generate images for Hero, Step, or Image sections if missing
        if (['hero', 'step', 'image'].includes(section.type) && !imageUrl) {
          try {
            // Generate a specific prompt for this section
            const prompt = await generateImagePrompt(`Title: ${section.title}. Content: ${section.content || ''}`);
            // Use Pollinations with a seed to ensure stability/variety
            const seed = Math.floor(Math.random() * 10000);
            // Ensure the prompt is URL safe and not too long
            const safePrompt = encodeURIComponent(prompt.substring(0, 100));
            imageUrl = `https://image.pollinations.ai/prompt/${safePrompt}?seed=${seed}&nologo=true`;
          } catch (err) {
            console.warn(`Failed to generate image for section ${i}`, err);
            // Fallback image if generation fails
            imageUrl = `https://image.pollinations.ai/prompt/abstract%20technology?seed=${Date.now()}&nologo=true`;
          }
        }

        return {
          ...section,
          id: uniqueId,
          image: imageUrl
        };
      }));

      parsed.sections = enrichedSections;
      return parsed;
    }
    return null;

  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
};

export const generateImagePrompt = async (context: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key missing");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
        Create a vivid, descriptive, high-quality image prompt in English based on the following context.
        The prompt will be used by an AI image generator (like Midjourney/DALL-E).
        
        Context: "${context}"
        
        Requirements:
        - Output ONLY the prompt string.
        - Be specific about visual elements, lighting, and style.
        - Style: Corporate, modern, professional, photorealistic, high resolution.
        - No text overlay description.
        - Max 100 characters.
        - Avoid complex characters that break URLs.
      `,
    });

    return response.text?.trim() || "modern corporate abstract background";
  } catch (error) {
    console.error("Error generating image prompt:", error);
    return "modern corporate office technology";
  }
};