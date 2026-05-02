export type SectionType = 'hero' | 'feature' | 'step' | 'banner' | 'image' | 'code' | 'quote' | 'stat' | 'comparison';

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
  cardSize?: 'small' | 'medium' | 'large'; // For Feature type

  // Fields for Advanced Types
  codeLanguage?: string; // For Code type
  author?: string; // For Quote type
  statValue?: string; // For Stat type (e.g. "40%")
  statLabel?: string; // For Stat type (e.g. "Time Reduction")
  prosList?: string; // Newline separated for Comparison
  consList?: string; // Newline separated for Comparison
  prosLabel?: string; // Optional label for Pros
  consLabel?: string; // Optional label for Cons
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

export type ViewMode = 'edit' | 'web-preview' | 'email-preview' | 'sharepoint' | 'export' | 'teams';

export interface TeamsPost {
  headline: string;
  body: string;
  bullets: string[];
  cta: string;
  ctaLink?: string;
  hashtags: string[];
  topic: string;
  adaptiveCard?: AdaptiveCard;
}

export interface AdaptiveCard {
  type: 'AdaptiveCard';
  version: string;
  body: AdaptiveCardElement[];
  actions?: AdaptiveCardAction[];
}

export interface AdaptiveCardElement {
  type: string;
  text?: string;
  size?: string;
  weight?: string;
  color?: string;
  wrap?: boolean;
  spacing?: string;
  items?: AdaptiveCardElement[];
  facts?: { title: string; value: string }[];
}

export interface AdaptiveCardAction {
  type: string;
  title: string;
  url?: string;
}