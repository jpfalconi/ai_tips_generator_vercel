export type SectionType = 'hero' | 'feature' | 'step' | 'banner' | 'image';

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  image?: string | null;
  // New fields for specific layouts
  tags?: string; // Comma separated for Hero
  icon?: string; // Icon name for Feature/Banner
  ctaText?: string; // Specific button for Hero/Feature
  ctaLink?: string; // Specific link for Hero/Feature
  promptSuggestion?: string; // For Step type
  listItems?: string; // Newline separated for Step type
  imageSize?: 'small' | 'medium' | 'large'; // For Image type
}

export interface ContentData {
  headerTitle: string; // e.g. "FALCONI BRAND IDENTITY"
  headerSubtitle: string; // e.g. "Dicas de IA: Excelência Operacional"
  
  // We keep these for email metadata but visual reliance moves to sections
  author: string;
  readTime: string;
  
  // The main content is now a flexible list of sections
  sections: Section[];
  
  // Global CTA (footer)
  footerCtaText: string;
  footerCtaLink: string;
}

export type ViewMode = 'edit' | 'web-preview' | 'email-preview' | 'sharepoint' | 'export';