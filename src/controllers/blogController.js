const { scraping, formatContent } = require("../services/scrapping/utils");
// const { generate } = require("../services/ia/cohere.js");

// const { createRequire } = require('module');
// const customRequire = createRequire(import.meta.url);

let generate;
import("../services/ia/cohere.mjs").then(module => {
    generate = module.generate;
}).catch(err => {
    console.error('Error importing cohere.mjs:', err);
});

const getBlog = async (req, res) => {
    const { url } = req.body;

    try {
        const blog = await scraping(url);
        const content = blog.content;
        // console.log(content)
        const formattedContent = await formatContent(content);
        console.log('formattedContent', formattedContent)

        // const { generate } = await import("../services/ia/cohere.mjs");
        // const { generate } = customRequire("../services/ia/cohere.mjs");

        const iaGenerated = formattedContent
        for (let i = 0; i < formattedContent.length; i++) {
            const iaData = await generate({ prompt: formattedContent[i].text })
            iaGenerated[i].iaData = iaData
        }

        console.log('iaGenerated', iaGenerated)
        // let strippedString = content.replace(/(<([^>]+)>)/gi, "");

        return res.send({ ok: true, status: 200, content: formattedContent });

    } catch (error) {
        res.status(500).send({ ok: false, status: 404, error: error.message });
    }
}

module.exports = { getBlog }