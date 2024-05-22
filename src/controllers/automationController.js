const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { allLinksTags } = require('../services/scrapping/utils');
const Automation = require('../models/automation');

const getAutomations = async (req, res) => {
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(id);

        if (!user || user.status === false || user.id !== id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const automations = await Automation.findAll({ where: { userId: id } });

        return res.send({ ok: true, status: 200, data: automations });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const getAutomationsById = async (req, res) => {
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { id } = req.params;
    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const automations = await Automation.findByPk(id);

        if (!automations) return res.status(404).send({ ok: false, status: 404, msg: 'Automation not found' });

        if (automations.userId !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        return res.send({ ok: true, status: 200, data: automations });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const createAutomation = async (req, res) => {
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { url, review_time, contentType } = req.body;

    if (!url) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(id);

        if (!user || user.status === false || user.id !== id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const links = await allLinksTags(url);

        if (!links) return res.status(400).send({ ok: false, status: 400, msg: 'Bad request' });

        const automation = await Automation.create({ url, previous_links: links, review_time, contentType, userId: id });

        return res.send({ ok: true, status: 200, automation: automation });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }

}

const updateAutomation = async (req, res) => {

    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { id } = req.params;
    const { status, review_time, contentType } = req.body;
    if (status) {
        if (status !== 'active' && status !== 'inactive') return res.status(400).send({ ok: false, status: 400, msg: 'Bad request' });
    }

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const automation = await Automation.findByPk(id);

        if (!automation) return res.status(404).send({ ok: false, status: 404, msg: 'Automation not found' });

        if (status && (status === 'inactive' || status === 'active')) {
            automation.status = status;
        }

        if (review_time) {
            automation.review_time = review_time;
        }
        if (contentType) {
            automation.contentType = contentType;
        }

        await automation.save();
        return res.send({ ok: true, status: 200, msg: 'Automation updated', data: automation });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const deleteAutomation = async (req, res) => {

    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { id } = req.params;

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const automation = await Automation.findByPk(id);

        if (!automation) return res.status(404).send({ ok: false, status: 404, msg: 'Automation not found' });

        await automation.destroy();

        return res.send({ ok: true, status: 200, msg: 'Automation deleted' });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

module.exports = { getAutomations, getAutomationsById, createAutomation, updateAutomation, deleteAutomation }