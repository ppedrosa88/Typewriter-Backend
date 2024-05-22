const Blog = require("../models/blog");
const User = require("../models/user");
const { scraping, formatContent } = require("../services/scrapping/utils");
const jwt = require('jsonwebtoken');
const { prompts, typeOfPrompt } = require("../services/ia/prompt");
const { generatePostWithAI } = require("../services/ia/workerAi");
const { isColString } = require("sequelize/lib/utils");

let generate;
import("../services/ia/cohere.mjs").then(module => {
    generate = module.generate;
}).catch(err => {
    console.error('Error importing cohere.mjs:', err);
});

let generateTitle;
import("../services/ia/cohere.mjs").then(module => {
    generateTitle = module.generateTitle;
}).catch(err => {
    console.error('Error importing cohereTitle.mjs:', err);
});


const getBlogs = async (req, res) => {
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(id);

        if (!user || user.status === false || user.id !== id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blogs = await Blog.findAndCountAll();
        return res.send({ ok: true, status: 200, data: blogs });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const getBlogById = async (req, res) => {
    const { authorization } = req.headers;
    const { id } = req.params;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);
        return res.send({ ok: true, status: 200, data: blog });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const postBlog = async (req, res) => {
    const { authorization } = req.headers;
    const { title, reference, content, category } = req.body;

    if (!title || !content || !category) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(id);

        if (!user || user.status === false || user.id !== id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });
        const postContent = {
            title,
            content,
            category
        }

        if (content) {
            content.reference = reference
        }

        const blog = await Blog.create({ ...postContent, userId: id });
        blog.save();
        return res.send({ ok: true, status: 200, data: blog, msg: 'Blog created' });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }

}
const updateBlog = async (req, res) => {

    const { authorization } = req.headers;
    const { title, reference, content, category, status } = req.body;
    const { id } = req.params

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    if (!title || !reference || !content || !category) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);
        await blog.update({ title, reference, content, category, status });
        await blog.save();
        return res.send({ ok: true, status: 200, data: blog, msg: 'Blog updated' });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }

}
const deleteBlog = async (req, res) => {

    const { authorization } = req.headers;
    const { id } = req.params;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);

        if (!blog) return res.status(404).send({ ok: false, status: 404, msg: 'Blog not found' });
        if (blog.status === 'deleted') return res.status(400).send({ ok: false, status: 400, msg: 'Blog already deleted' });

        await blog.update({ status: 'deleted' });
        await blog.save();
        return res.send({ ok: true, status: 200, data: blog, msg: 'Blog deleted' });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });

    }
}

const totallyDeleteBlog = async (req, res) => {

    const { authorization } = req.headers;
    const { id } = req.params;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);

        if (!blog) return res.status(404).send({ ok: false, status: 404, msg: 'Blog not found' });


        if (blog.status === 'deleted') {
            await blog.update({ status: 'inactive' });
            return res.send({ ok: true, status: 200, data: blog, msg: 'Blog deleted' });
        }

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });

    }
}

const iaBlog = async (req, res) => {
    const { url, category } = req.body;
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    if (!url) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });
    if (!category) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });
    try {
        const data = await scraping(url);
        const { url: reference, title, content } = data;
        const formattedContent = await formatContent(content);

        const iaTitle = await generateTitle({ prompt: title })
        const iaGeneratedContent = formattedContent;

        const type = typeOfPrompt(category)
        if (!type) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

        for (let i = 0; i < formattedContent.length; i++) {
            if (formattedContent[i].tag === 'p') {
                const iaData = await generatePostWithAI({ prompt: formattedContent[i].text, typeContent: category })
                iaGeneratedContent[i].iaData = iaData
            }
        }

        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);
        const user = await User.findByPk(id);

        if (!user || user.status === false || user.id !== id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.create({ iaTitle, title, reference, content: iaGeneratedContent, category, userId: id, createdByIa: 1 });
        return res.send({ ok: true, status: 200, content: blog });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

module.exports = { getBlogs, getBlogById, iaBlog, postBlog, updateBlog, deleteBlog, totallyDeleteBlog }

