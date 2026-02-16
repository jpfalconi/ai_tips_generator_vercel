
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import { createPool } from '@vercel/postgres';
import { fileURLToPath } from 'url';

// --- Configuration ---
dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Content Types (matching application types) ---
// We need to infer these from the HTML structure
const DEFAULT_AUTHOR = "Time de Automação & IA";
const DEFAULT_READ_TIME = "5 min";

async function importAspx(filePath) {
    console.error(`\n📄 Lendo arquivo: ${filePath}`);

    if (!fs.existsSync(filePath)) {
        console.error(`❌ Arquivo não encontrado: ${filePath}`);
        process.exit(1);
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(html);
    console.error('✅ HTML carregado. Iniciando extração...');

    // --- Extract ContentData ---
    const contentData = {
        headerTitle: "Briefing | Tópico", // Default, hard to infer specific header title if not explicit
        headerSubtitle: "",
        author: DEFAULT_AUTHOR,
        readTime: DEFAULT_READ_TIME,
        footerCtaText: "",
        footerCtaLink: "",
        sections: []
    };

    // 1. Header Information
    // Looking for <p ...>Copilot na Prática | Reuniões Produtivas</p>
    const headerP = $('div[style*="text-align: center"] p').first();
    if (headerP.length) contentData.headerTitle = headerP.text().trim();

    // Looking for <h1 ...>Série #1:...</h1>
    const headerH1 = $('div[style*="text-align: center"] h1').first();
    if (headerH1.length) contentData.headerSubtitle = headerH1.text().trim();

    // 2. Footer Information
    // Looking for footer CTA
    const footerA = $('div[style*="margin-top: 40px"] a').first();
    if (footerA.length) {
        contentData.footerCtaText = footerA.text().trim();
        contentData.footerCtaLink = footerA.attr('href') || "";
    }

    // 3. Sections Extraction
    // This is the tricky part. We need to iterate over the main container's children.
    // The structure seems to be flat <div>s inside the main container.

    // Finding the main container. It has max-width: 800px.
    const mainContainer = $('div[style*="max-width: 800px"]');

    // We'll iterate through the direct children of the content div (which is after the header)
    // The header is the first child of mainContainer.
    // The content sections follow.

    // Strategy: Identify section blocks based on their style or content.

    // A generic wrapper for sections usually has border: 1px solid #e5e5e5;
    const standardSections = mainContainer.find('> div'); // Direct children

    let sectionIdCounter = Date.now();

    standardSections.each((i, el) => {
        const pStyle = $(el).attr('style') || '';

        // Skip Header (it has text-align: center and is first)
        if (i === 0 && pStyle.includes('text-align: center')) return;

        // Skip Footer (it has margin-top: 40px)
        if (pStyle.includes('margin-top: 40px')) return;

        const section = {
            id: (sectionIdCounter++).toString(),
            type: 'step', // Default
            title: '',
            content: '',
            image: null
        };

        // --- Hero Section Detection ---
        // Has a background-image div inside
        const bgImageDiv = $(el).find('div[style*="background-image"]');
        if (bgImageDiv.length) {
            section.type = 'hero';
            const bgStyle = bgImageDiv.attr('style');
            const urlMatch = bgStyle.match(/url\(['"]?(.*?)['"]?\)/);
            if (urlMatch) section.image = urlMatch[1];

            section.title = $(el).find('h2').text().trim();
            section.content = $(el).find('div[style*="font-size: 16px"]').first().html()?.trim() || '';

            // Tags
            const tags = [];
            $(el).find('span[style*="background-color"]').each((j, span) => {
                tags.push($(span).text().trim());
            });
            section.tags = tags.join(', ');

            contentData.sections.push(section);
            return;
        }

        // --- Image Section Detection (Simple Centered Image) ---
        // Wrapper has text-align: center and contains an img
        if (pStyle.includes('text-align: center')) {
            const img = $(el).find('img');
            if (img.length) {
                section.type = 'image';
                section.image = img.attr('src');
                section.title = $(el).find('div[style*="font-style: italic"]').text().trim(); // Caption

                contentData.sections.push(section);
                return;
            }
        }

        // --- Bonus/Warning Banner Detection ---
        // Has background-color: #7A7423 (or similar) and a star/icon
        if (pStyle.includes('background-color: #7A7423') || pStyle.includes('background-color: #f9f9f9')) {
            section.type = 'banner';
            // If it's the quote style (border-left)
            if (pStyle.includes('border-left')) {
                section.type = 'quote';
                section.content = $(el).find('div[style*="font-style: italic"]').text().trim();
                contentData.sections.push(section);
                return;
            }

            section.title = $(el).find('h3').text().trim();
            section.content = $(el).find('div[style*="opacity: 0.95"]').html()?.trim() || '';
            contentData.sections.push(section);
            return;
        }

        // --- Step/Standard Section Detection ---
        // Has a header with background color #EAEBE940
        const stepHeader = $(el).find('div[style*="background-color: #EAEBE940"]');
        if (stepHeader.length) {
            section.type = 'step';
            section.title = stepHeader.find('h2').text().trim();

            const contentDiv = $(el).children().last(); // The content part
            section.content = contentDiv.find('> div[style*="font-size: 16px"]').html()?.trim() || '';

            // Detect list items
            const listItems = [];
            $(el).find('li').each((k, li) => {
                listItems.push($(li).find('span').last().text().trim());
            });
            if (listItems.length) section.listItems = listItems.join('\n');

            // Detect Prompt
            const promptDiv = $(el).find('div[style*="background-color: #F9F9F7"]');
            if (promptDiv.length) {
                section.promptSuggestion = promptDiv.find('p[style*="monospace"]').text().trim();
            }

            contentData.sections.push(section);
            return;
        }

        // --- Comparison Section (Grid) ---
        // The previous loop might misinterpret the grid container.
        // However, if the grid is direct child of main container?
        // In the file provided, the grid seems to be: <div style="display: grid; ...">
        if (pStyle.includes('display: grid')) {
            section.type = 'comparison';
            section.title = "Comparativo"; // Default title for grid

            // Pros
            const prosDiv = $(el).find('div[style*="background-color: #f0fdf4"]');
            if (prosDiv.length) {
                const prosList = [];
                prosDiv.find('li').each((k, li) => prosList.push($(li).text().replace('●', '').trim()));
                section.prosList = prosList.join('\n');
                section.prosLabel = prosDiv.find('div[style*="font-weight: bold"]').text().replace('✔', '').trim();
            }

            // Cons
            const consDiv = $(el).find('div[style*="background-color: #fef2f2"]');
            if (consDiv.length) {
                const consList = [];
                consDiv.find('li').each((k, li) => consList.push($(li).text().replace('●', '').trim()));
                section.consList = consList.join('\n');
                section.consLabel = consDiv.find('div[style*="font-weight: bold"]').text().replace('✖', '').trim();
            }

            // Feature Cards (Grid of cards)
            // If it's a grid of white boxes with icons...
            if ($(el).find('svg').length > 0 && !prosDiv.length) {
                // It's likely a Feature Grid.
                // We should split this into multiple 'feature' sections or a single 'feature' section?
                // The editor supports single sections.
                // Parsing this as one section might be complex if the model doesn't support "Grid".
                // Let's import as a single "step" or "feature" for now.
                section.type = 'feature';
                const card = $(el).find('> div').first(); // Take first card
                section.title = card.find('h3').text().trim();
                section.content = card.find('div[style*="color: #666"]').text().trim();
                section.ctaText = card.find('a').text().trim();
                section.ctaLink = card.find('a').attr('href');
            }

            contentData.sections.push(section);
            return;
        }

        // Fallback for generic text blocks
        if (pStyle.includes('background-color: #ffffff') && !stepHeader.length && !bgImageDiv.length) {
            section.type = 'step';
            section.title = $(el).find('h2').text().trim();
            section.content = $(el).find('div[style*="line-height: 1.5"]').html()?.trim() || '';
            if (section.title || section.content) {
                contentData.sections.push(section);
            }
        }

    });

    // --- Save to Database ---
    try {
        const connectionString = process.env.POSTGRES_URL;
        if (!connectionString) {
            console.error('❌ POSTGRES_URL não encontrado.');
            return;
        }

        const pool = createPool({ connectionString });

        const { rows } = await pool.sql`
      INSERT INTO tips (title, content, created_at) 
      VALUES (${contentData.headerSubtitle}, ${JSON.stringify(contentData)}, NOW()) 
      RETURNING id, title;
    `;

        console.log(`\n✅ Sucesso! Dica importada.`);
        console.log(`🆔 ID: ${rows[0].id}`);
        console.log(`📌 Título: ${rows[0].title}`);

        await pool.end();

    } catch (dbError) {
        console.error('❌ Erro ao salvar no banco:', dbError);
    }
}

// Run (allow passing file via args)
const targetFile = process.argv[2] || 'Materiais/copilot.aspx';
importAspx(targetFile);
