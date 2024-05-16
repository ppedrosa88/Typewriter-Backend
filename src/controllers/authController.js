const md5 = require('md5');
const jwt = require('jsonwebtoken');
const User = require("../models/user");
const { isPast } = require("date-fns");


const createUser = async (req, res) => {

    let { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    password = md5(password);

    try {
        const existUser = await User.findOne({ where: { email } });
        if (existUser) {
            if (existUser && existUser.status === false) {
                await existUser.update({ status: true, ...req.body });
                return res.send({ ok: true, status: 200, data: existUser })
            } else if (existUser) return res.status(400).send({ ok: false, status: 400, msg: 'Error. Can not create user' });
        }

        const user = new User({ name, surname, email, password });
        await user.save();
        delete user.dataValues.password;
        return res.status(201).send({ ok: true, status: 201, data: user })
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).send({ ok: false, status: 404, msg: `User with id ${id} not found` });

        delete user.dataValues.password;

        return res.send({ ok: true, status: 200, data: user })
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        for (let user of users) {
            delete user.dataValues.password;
        }
        return res.send({ ok: true, status: 200, users: users });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const updateUser = async (req, res) => {

    const { id } = req.params
    const { body } = req;


    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).send({ ok: false, status: 404, msg: 'Error. Can not update user' });

        await user.update(body);

        delete user.dataValues.password;

        return res.send({ ok: true, status: 200, data: user })
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const deleteUser = async (req, res) => {

    const { id } = req.params
    try {

        const user = await User.findByPk(id);
        if (!user) return res.status(404).send({ ok: false, status: 404, msg: 'Error. Can not delete user' });

        await user.update({ status: false });
        return res.send({ ok: true, status: 200, msg: 'User deleted' })
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const loginUser = async (req, res) => {

    let { email, password } = req.body;

    if (!email || !password) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    password = md5(password);

    try {
        const user = await User.findOne({ where: { email, password } });
        if (!user) return res.status(404).send({ ok: false, status: 404, msg: 'Email or password incorrect' });
        if (user.status === false) return res.status(404).send({ ok: false, status: 404, msg: 'Error. Can not login user' });

        const token = jwt.sign({ page: "typewriter", id: user.id, email: user.email }, process.env.SECRET_JWT, { expiresIn: '24h' });
        const refreshToken = jwt.sign({ page: "typewriter", id: user.id, email: user.email }, process.env.SECRET_JWT, { expiresIn: '2h' });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'none' });
        return res.send({ ok: true, status: 200, data: { ok: true, accessToken: token, refreshToken } });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const refreshToken = async (req, res) => {

    const { refreshToken, accessToken } = req.body;
    if (!refreshToken) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    const { email, id, exp } = jwt.verify(refreshToken, process.env.SECRET_JWT);

    try {
        if (!isPast(exp * 1000)) return res.send({ ok: true, status: 200, data: { accessToken } })

        const newAccessToken = jwt.sign({ page: "typewriter", id, email }, process.env.SECRET_JWT, { expiresIn: '20min' })
        return res.send({ ok: true, status: 200, data: { accessToken: newAccessToken } })
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

module.exports = { createUser, loginUser, deleteUser, updateUser, getUser, getAllUsers, refreshToken }