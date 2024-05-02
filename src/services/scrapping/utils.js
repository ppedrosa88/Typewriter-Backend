const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function scraping(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url)
        const html = await page.content();

        const { extract } = await import('@extractus/article-extractor');
        const article = await extract(html);
        return article;
    } catch (error) {
        console.error('Error importing module:', error);
        throw error;
    } finally {
        await browser.close();
    }
}

async function formatContent(content) {
    const $ = cheerio.load(content);

    const paragraphs = [];

    $('p').each((index, element) => {
        const paragraphsText = extractTextWithTags($(element).html());
        paragraphs.push({ tag: 'p', text: paragraphsText });
    });

    return paragraphs;
}

function extractTextWithTags(html) {
    const $ = cheerio.load(html);
    const texto = [];

    function extractText(element) {
        $(element).contents().each((index, el) => {
            if (el.nodeType === 3) {
                texto.push($(el).text());
            } else {
                extractText(el);
            }
        });
    }

    extractText('body');

    return texto.join(' ');
}

module.exports = { scraping, formatContent };