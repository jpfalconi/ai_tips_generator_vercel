# AI Tips Generator

> Ferramenta institucional para geração padronizada de dicas de Inteligência Artificial, briefings e conteúdos para SharePoint e E-mail Marketing.

## 📋 Visão Geral

O **AI Tips Generator** é uma aplicação web desenvolvida para a Falconi Intelligence Unit. Seu objetivo é facilitar a criação de conteúdos sobre IA, garantindo que a formatação visual e estrutural siga rigorosamente o brandbook da empresa, seja para publicação na intranet (SharePoint) ou para campanhas de endomarketing.

## 🚀 Propósito

Centralizar e agilizar a produção de "Dicas de IA", permitindo que o time de conhecimento gere:
- **Briefings Visuais:** Para visualização rápida na web.
- **Códigos HTML/CSS:** Prontos para "copiar e colar" em Web Parts do SharePoint.
- **E-mails MKT:** Templates em HTML e arquivos `.eml` para envio via Outlook.

## ✨ Funcionalidades Principais

- **Editor em Tempo Real:** Interface intuitiva para edição de títulos, textos, imagens e tags.
- **Assistente de IA:** Integração com Google Gemini para gerar sugestões de conteúdo a partir de tópicos simples.
- **Múltiplas Visualizações:**
  - **Web:** Preview fiel ao design final.
  - **Outlook:** Simulação de como o e-mail chegará na caixa de entrada.
  - **SharePoint:** Assistente passo a passo para publicação na intranet.
- **Exportação:**
  - Baixar arquivo `.aspx` para SharePoint (com correção UTF-8).
  - Baixar arquivo `.eml` para Outlook.
  - Copiar HTML limpo.
- **Segurança:** Proteção de acesso via chave criptografada (Client-Side Hashing).

## 🛠️ Instalação e Uso

### Pré-requisitos
- Node.js instalado.
- Chave de API do Google Gemini.

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jpfalconi/ai_tips_generator_vercel.git
   cd ai_tips_generator_vercel
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env.local` na raiz e adicione sua chave API:
   ```env
   GEMINI_API_KEY=SuaChaveAqui
   ```

4. **Execute localmente:**
   ```bash
   npm run dev
   ```

5. **Acesso:**
   O sistema solicitará a chave de acesso configurada localmente ou no ambiente de produção.

---

## 📅 ChangeLog

### [2026-02-14] - v1.1.1 - Ajustes de Compatibilidade Outlook
- **Email Engine:** Refatoração completa para uso de tabelas HTML (Outlook Support).
- **Styles:** Ajustes de espaçamento em Banners e tamanho de botões.
- **Fix:** Correção de headers EML para renderização HTML adequada.

### [2026-02-14] - v1.1.0 - Implementação de Segurança
- **Segurança:** Adicionada tela de login com proteção por senha.
- **Criptografia:** Implementação de hash SHA-256 no client-side para validação de acesso.
- **UX:** Feedback visual de carregamento e erro no login.

### [2026-02-14] - v1.0.0 - Lançamento Inicial
- **Core:** Editor de conteúdo com live preview.
- **IA:** Integração com Google Gemini para geração de sugestões.
- **Exportação:** Funcionalidades de download (.eml, .aspx) e cópia de HTML.
- **UI:** Interface alinhada ao Falconi Brandbook.
- **Deploy:** Configuração inicial de deploy na Vercel e versionamento no GitHub.
