const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

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

    $('p, h1, h2, h3, h4, h5, h6').each((index, element) => {
        const $element = $(element);
        const tag = $element.prop("tagName").toLowerCase();
        const paragraphsText = extractTextWithTags($(element).html());
        paragraphs.push({ tag, text: paragraphsText });
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

async function allLinksTags(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url)
        const html = await page.content();

        const $ = cheerio.load(html);

        const links = [];

        $('a').each((index, element) => {
            const href = $(element).attr('href');
            if (href && href.startsWith('https://')) {
                links.push({ tag: 'a', href });
            }
        });
        return links;
    } catch (error) {
        console.error(error);
    }
}

const runScraping = async () => {
    const content = await scraping(url);
    const linkds = await allLinksTags(content);
};

module.exports = { scraping, formatContent, allLinksTags };