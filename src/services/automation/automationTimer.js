const Automation = require("../../models/automation");
const Blog = require("../../models/blog");
const { generatePostWithAI } = require("../ia/workerAi");
const { scraping, formatContent, allLinksTags } = require("../scrapping/utils");


let generateTitle;
import("../ia/cohere.mjs").then(module => {
    generateTitle = module.generateTitle;
}).catch(err => {
    console.error('Error importing cohereTitle.mjs:', err);
});


const automationTimeChecker = async () => {
    try {
        const currentDate = new Date();

        const automations = await Automation.findAll();

        for (let automation of automations) {
            let intervalToScrape;


            // Comprobamos la fecha de la última revisión
            switch (automation.review_time) {
                case 24:
                    intervalToScrape = 86400000;
                    break;
                case 7:
                    intervalToScrape = 604800000;
                    break;
                case 15:
                    intervalToScrape = 1296000000;
                    break;
                case 30:
                    intervalToScrape = 2592000000;
                    break;
            }

            if (!automation.last_review_date) {
                automation.last_review_date = automation.createdAt;
                await automation.save();
            }
            if ((currentDate - new Date(automation.last_review_date)) > intervalToScrape && automation.status === 'active') {
                const links = await allLinksTags(automation.url);

                const newLinks = searchUniqueLinks(links, automation.previous_links)
                automation.previous_links = newLinks.concat(automation.previous_links)

                await automation.save();

                for (let i = 0; i < 3; i++) {
                    const { href } = newLinks[i];
                    await scrappinNewPost(href, automation.userId, automation.contentType);
                }
            }

            automation.last_review_date = currentDate;
            await automation.save();
        }

    } catch (error) {
        console.error(error);
    }
}

const automationTimerActivator = () => {
    setInterval(automationTimeChecker, 900000); // 15 minutes = 900000
}

const searchUniqueLinks = (links, previousLinks) => {

    const linksHrefs = links.map(link => link.href);
    const previousLinksHrefs = previousLinks.map(link => link.href);

    const linksSet = new Set(linksHrefs);
    const previousLinksSet = new Set(previousLinksHrefs);

    const linksHref = links.map(link => link.href)

    const uniqueLinks = new Set([...linksSet].filter(href => !previousLinksSet.has(href)).concat([...previousLinksSet].filter(href => !linksSet.has(href))));

    const uniqueLinksArray = Array.from(uniqueLinks).map(href => ({ tag: "a", href }));

    return uniqueLinksArray;
}

const scrappinNewPost = async (url, userId, category) => {
    try {
        const data = await scraping(url);
        const { url: reference, title, image, content } = data;

        const formattedContent = await formatContent(content);

        const iaTitle = await generateTitle({ prompt: title })
        const iaGeneratedContent = formattedContent;

        for (let i = 0; i < formattedContent.length; i++) {
            if (formattedContent[i].tag === 'p') {
                const iaData = await generatePostWithAI({ prompt: formattedContent[i].text, typeContent: category })
                iaGeneratedContent[i].iaData = iaData
            }
        }

        await Blog.create({ iaTitle, imagen: image, title, reference, content: iaGeneratedContent, category, userId, createdByIa: 1 });

    } catch (error) {
        console.log('Error scrapping new post:', error);
    }
}

module.exports = { automationTimerActivator }