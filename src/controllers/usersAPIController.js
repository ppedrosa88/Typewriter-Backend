const ApiKey = require("../models/apiKey");
const Blog = require("../models/blog");

const getBlogs = async (req, res) => {
    const { token } = req.params;
    if (!token) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const isAllowToken = await ApiKey.findOne({ where: { apiKey: token } });

        if (!isAllowToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blogs = await Blog.findAndCountAll();
        const { rows } = blogs

        if (rows[0].userId === isAllowToken.userId) {
            return res.send({ ok: true, status: 200, data: blogs });
        }
        return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const getBlogById = async (req, res) => {
    const { token, id } = req.params;

    if (!token) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });
    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const isAllowToken = await ApiKey.findOne({ where: { apiKey: token } });

        if (!isAllowToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);

        if (isAllowToken.userId === blog.dataValues.userId) {
            return res.send({ ok: true, status: 200, data: blog });
        }
        return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    } catch (error) {
        return res.status(500)
    }
}

const deleteBlog = async (req, res) => {
    const { token, id } = req.params;

    if (!token) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });
    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const isAllowToken = await ApiKey.findOne({ where: { apiKey: token } });

        if (!isAllowToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);

        if (isAllowToken.userId === blog.dataValues.userId) {
            blog.update({ status: 'deleted' });
            await blog.save();
            return res.send({ ok: true, status: 200, data: blog });
        }
        return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    } catch (error) {
        return res.status(500)
    }
}
const totallyDeleteBlog = async (req, res) => {
    const { token, id } = req.params;

    if (!token) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });
    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const isAllowToken = await ApiKey.findOne({ where: { apiKey: token } });

        if (!isAllowToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(id);

        if (isAllowToken.userId === blog.dataValues.userId) {
            blog.update({ status: 'inactive' });
            await blog.save();
            return res.send({ ok: true, status: 200, data: 'Blog deleted' });
        }
        return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    } catch (error) {
        return res.status(500)
    }
}

module.exports = {
    getBlogs,
    getBlogById,
    deleteBlog,
    totallyDeleteBlog
}