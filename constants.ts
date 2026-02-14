import { ContentData } from './types';

export const COLORS = {
  primary: '#7A7423', // Olive
  secondary: '#A7E82B', // Lime
  black: '#000000',
  gray: '#EAEBE9', // Light Gray
  darkGray: '#333333',
  white: '#FFFFFF',
  beige: '#F9F9F7', // For prompt boxes
};

export const DEFAULT_DATA: ContentData = {
  headerTitle: "Briefing | Tópico ou Ferramenta",
  headerSubtitle: "Dicas de IA: Excelência Operacional",
  author: "Falconi Intelligence Unit",
  readTime: "3 min",
  sections: [
    {
      id: '1',
      type: 'hero',
      title: "Engenharia de Prompt",
      content: "Domine a arte de estruturar comandos para obter resultados precisos. A qualidade da resposta da IA é diretamente proporcional à clareza do seu comando inicial.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      tags: "ESTRATÉGIA, DESTAQUE",
      ctaText: "Ler Dica Prática",
      ctaLink: "https://falconi.com"
    },
    {
      id: '2',
      type: 'feature',
      title: "Produtividade com IA",
      content: "Automatize tarefas repetitivas integrando LLMs aos seus fluxos de trabalho diários. Reduza em até 40% o tempo gasto em triagem.",
      icon: "Zap",
      ctaText: "Ver Automação",
      ctaLink: "#"
    },
    {
      id: '3',
      type: 'feature',
      title: "Insights de Dados",
      content: "Utilize modelos de linguagem para interpretar grandes volumes de informação qualitativa e transformá-los em decisões.",
      icon: "BarChart",
      ctaText: "Explorar Insights",
      ctaLink: "#"
    },
    {
      id: '4',
      type: 'banner',
      title: "Lembrete de Governança",
      content: "Nunca insira dados sensíveis ou confidenciais de clientes em modelos públicos sem anonimização prévia.",
      icon: "Shield"
    },
    {
      id: '5',
      type: 'step',
      title: "1. Automação de Workflows",
      content: "Elimine tarefas repetitivas e foque no que é estratégico para o negócio.",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
      listItems: "Mapeie gargalos operacionais críticos\nIntegre APIs de LLM em fluxos existentes\nReduza o tempo de resposta em até 40%",
      promptSuggestion: "\"Analise o seguinte fluxo de processo [DESCREVER FLUXO] e identifique 3 pontos de automação usando IA para reduzir o tempo manual de execução.\""
    },
    {
      id: '6',
      type: 'step',
      title: "2. Análise de Dados",
      content: "Transforme dados brutos em decisões inteligentes com suporte de modelos avançados.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      listItems: "Identifique tendências via processamento de linguagem natural\nSintetize grandes volumes de relatórios em segundos",
      promptSuggestion: "\"Atue como um analista de dados sênior. Resuma os principais outliers deste dataset [COLAR DADOS] e sugira 2 ações corretivas imediatas baseadas no método PDCA.\""
    }
  ],
  footerCtaText: "Acessar Guia Completo",
  footerCtaLink: "https://falconi.com"
};

export const ICONS_MAP: Record<string, string> = {
  Zap: 'Energia / Rapidez',
  BarChart: 'Gráfico / Dados',
  Shield: 'Segurança / Proteção',
  Bot: 'Robô / IA',
  Settings: 'Configuração',
  FileText: 'Documento / Texto',
  Database: 'Banco de Dados',
  Cpu: 'Processamento / Tech',
  Lightbulb: 'Ideia / Inovação',
  Target: 'Meta / Foco',
  Rocket: 'Aceleração / Startup',
  Users: 'Equipe / Pessoas',
  Clock: 'Tempo / Prazo',
  CheckCircle: 'Sucesso / Concluído',
  AlertTriangle: 'Alerta / Atenção',
  Brain: 'Inteligência / Cérebro',
  TrendingUp: 'Crescimento / Alta',
  Globe: 'Global / Mundo'
};

export const ICONS_LIST = Object.keys(ICONS_MAP);