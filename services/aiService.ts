import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ContentData } from "../types";
import { FALCONI_SYSTEM_PROMPT } from "../falconiTone";

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
${FALCONI_SYSTEM_PROMPT}

## Task
Transform the user's input into a COMPREHENSIVE, PROFESSIONAL, and ACTIONABLE newsletter/guide.
All content must be in Brazilian Portuguese and strictly follow the Falconi brand voice defined above.

## Content Structure Instructions
1. **Research & Expand:** DO NOT just format the input. Enrich with best practices, statistics, and actionable steps.
2. **Structure:**
   - **Header:** Catchy, professional title reflecting Falconi's excellence standards.
   - **Hero Section:** Hook the reader with WHY this matters for business performance.
   - **Feature Sections:** 2-3 key benefits or pillars tied to measurable outcomes. Use diverse icons.
   - **Smart Sections (Use at least 1-2 of these):**
     - **Stat Highlight:** Key ROI or metric (e.g. "40% Ganho de Eficiência"), use 'stat' type.
     - **Quote:** Relevant management principle or best practice insight, use 'quote' type.
     - **Comparison:** Comparing tools or approaches (e.g. Free vs Paid), use 'comparison' type.
     - **Code/Prompt:** If AI instructions are relevant, ALWAYS provide the exact prompt in a 'code' section.
   - **Step-by-Step:** Practical "Como Fazer" section.
     - **CRITICAL:** Populate 'listItems' with newline-separated steps. Do NOT put steps in 'content'.
     - Example: "Abra o Excel\\nClique em Dados\\nSelecione Copilot"
   - **Conclusion/Banner:** A final pro-tip or governance reminder.
3. **Images:** The system generates images separately — ensure titles/content are descriptive enough.

## User Input
"${rawText}"

## Output Format
JSON strictly following the schema. All text in Brazilian Portuguese.
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