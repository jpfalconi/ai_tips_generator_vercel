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
      title: "Engenharia de Prompt AVANÇADA",
      content: "Domine a arte de estruturar comandos para obter resultados precisos. A qualidade da resposta da IA é diretamente proporcional à clareza do seu comando inicial.",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop",
      tags: "ESTRATÉGIA, DESTAQUE, IA",
      ctaText: "Ler Dica Prática",
      ctaLink: "https://falconi.com"
    },
    {
      id: '2',
      type: 'stat',
      title: "Impacto Real",
      statValue: "40%",
      statLabel: "Redução de Tempo Operacional",
      content: "Empresas que adotam IA generativa em processos de triagem relatam ganhos imediatos de eficiência."
    },
    {
      id: '3',
      type: 'feature',
      title: "Automação (Card Pequeno)",
      content: "Automatize tarefas repetitivas integrando LLMs.",
      icon: "Zap",
      cardSize: 'small'
    },
    {
      id: '4',
      type: 'feature',
      title: "Análise de Dados (Card Médio)",
      content: "Utilize modelos de linguagem para interpretar grandes volumes de informação qualitativa e transformá-los em decisões estratégicas rápidas.",
      icon: "BarChart",
      cardSize: 'medium'
    },
    {
      id: '5',
      type: 'feature',
      title: "Transformação Cultural (Card Grande)",
      content: "A IA não é apenas sobre tecnologia, é sobre pessoas. Capacite seu time para usar essas ferramentas como copilotos, não como substitutos. A cultura data-driven começa na base.",
      icon: "Users",
      cardSize: 'large'
    },
    {
      id: '6',
      type: 'quote',
      title: "Princípio de Gestão", // Added title
      content: "Não se gerencia o que não se mede, não se mede o que não se define, não se define o que não se entende, e não há sucesso no que não se gerencia.",
      author: "Vicente Falconi"
    },
    {
      id: '7',
      type: 'comparison',
      title: "ChatGPT Grátis vs Plus",
      content: "Comparativo de versões", // Added content
      prosList: "Acesso ao GPT-4o (Mais inteligente)\nAnálise de Dados Avançada\nGeração de Imagens (DALL-E 3)",
      consList: "Custo mensal em dólares\nLimite de mensagens por hora\nNecessidade de cartão internacional"
    },
    {
      id: '8',
      type: 'code',
      title: "Prompt para Resumo Executivo",
      codeLanguage: "markdown",
      content: "Atue como um consultor sênior de estratégia.\nAnalise o seguinte texto:\n[COLAR TEXTO AQUI]\n\nCrie um resumo executivo com:\n1. Principais Desafios\n2. 3 Ações Imediatas Sugeridas\n3. Riscos de Não Agir\n\nUse tom formal e direto."
    },
    {
      id: '9',
      type: 'banner',
      title: "Lembrete de Governança",
      content: "Nunca insira dados sensíveis ou confidenciais de clientes em modelos públicos sem anonimização prévia.",
      icon: "Shield"
    },
    {
      id: '10',
      type: 'step',
      title: "Guia Prático: Análise de Dados",
      content: "Transforme dados brutos em decisões inteligentes com suporte de modelos avançados.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      listItems: "Identifique tendências via processamento de linguagem natural\nSintetize grandes volumes de relatórios em segundos\nExporte os insights para o Power BI",
      promptSuggestion: "\"Atue como um analista de dados. Identifique 3 outliers neste dataset e sugira causas raízes prováveis.\""
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


export const PASSWORD_HASH = 'bf529b806490e42bd0c87ca5e97735938fd82b3e5c57bb924e41e2324984469c';