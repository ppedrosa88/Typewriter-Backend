const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const ApiKey = require('../models/apiKey');

const createApiKey = async (req, res) => {
    const { authorization } = req.headers;
    const { name } = req.body;
    if (!name) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);
        console.log(id)
        if (!id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const apiKey = uuidv4();

        const key = await ApiKey.create({ apiKey, userId: id, name });
        console.log(key)

        return res.send({ ok: true, status: 200, data: key });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });

    }
}
const getApiKeys = async (req, res) => {
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id } = jwt.verify(accessToken, process.env.SECRET_JWT);
        if (!id) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const keys = await ApiKey.findAll({ where: { userId: id } });


        const modifiedKeys = keys.map((key) => ({
            id: key.id,
            userId: key.userId,
            name: key.name,
            apiKey: key.apiKey.replace(/.(?=.{4})/g, '*'), // Reemplazar todos los caracteres excepto los últimos 4 con asteriscos
            createdAt: key.createdAt,
            updatedAt: key.updatedAt
        }));

        return res.send({ ok: true, status: 200, data: modifiedKeys });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const deleteApiKey = async (req, res) => {
    const { id } = req.params;

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);
        if (!userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const apiKey = await ApiKey.findByPk(id);
        if (!apiKey) return res.status(404).send({ ok: false, status: 404, msg: 'ApiKey not found' });

        if (apiKey.userId !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        await apiKey.destroy();

        return res.send({ ok: true, status: 200, msg: 'ApiKey deleted' });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

module.exports = { createApiKey, getApiKeys, deleteApiKey }