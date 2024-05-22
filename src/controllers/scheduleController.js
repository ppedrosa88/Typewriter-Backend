const Schedule = require("../models/schedule");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require('jsonwebtoken');
const { isPast } = require("date-fns");


const getSchedules = async (req, res) => {

    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const schedules = await Schedule.findAll({ where: { userId } });

        return res.send({ ok: true, status: 200, data: schedules });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }

}

const getScheduleById = async (req, res) => {

    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { id } = req.params;
    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const schedules = await Schedule.findAll({ where: { userId, id } });

        return res.send({ ok: true, status: 200, data: schedules });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const createSchedule = async (req, res) => {
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { blogId, scheduledTime } = req.body;

    if (!blogId || !scheduledTime) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });
    // const offset = 2 * 3600;
    const offset = 0;
    const date = new Date((scheduledTime + offset) * 1000);
    if (isPast(date)) return res.status(400).send({ ok: false, status: 400, msg: 'Invalid date' });

    try {
        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const blog = await Blog.findByPk(blogId);

        if (!blog) return res.status(404).send({ ok: false, status: 404, msg: 'Blog not found' });

        if (blog.status === 'deleted') return res.status(400).send({ ok: false, status: 400, msg: 'Blog already deleted' });

        const schedule = await Schedule.create({ blogId, userId, scheduledTime: date });

        return res.send({ ok: true, status: 200, data: schedule, msg: 'Blog scheduled' });

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}
const updateSchedule = async (req, res) => {

    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { id } = req.params;
    const { status, scheduledTime } = req.body;

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    if (!status && !scheduledTime) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {

        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        if (!userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });


        const schedule = await Schedule.findByPk(id);
        if (!schedule) return res.status(404).send({ ok: false, status: 404, msg: 'Schedule not found' });

        if (schedule.userId !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        if (scheduledTime) {
            const offset = 0;
            const date = new Date((scheduledTime + offset) * 1000);

            if (isPast(date)) return res.status(400).send({ ok: false, status: 400, msg: 'Invalid date' });

            await schedule.update({ scheduledTime: date });

            return res.send({ ok: true, status: 200, data: schedule, msg: 'Schedule updated' });
        }

        if (status) {
            if (status === 'active' || status === 'inactive') {

                if (status === 'inactive') {
                    if (isPast(schedule.scheduledTime)) return res.send({ ok: false, status: 400, msg: 'Invalid date' });
                    await schedule.update({ status });
                }
                return res.send({ ok: true, status: 200, data: schedule, msg: 'Schedule updated' });
            }
            return res.status(400).send({ ok: false, status: 400, msg: 'Invalid status' });
        }

    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}

const deleteSchedule = async (req, res) => {
    const { authorization } = req.headers;

    const accessToken = authorization.split(' ')[1];

    if (!accessToken) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

    const { id } = req.params;

    if (!id) return res.status(400).send({ ok: false, status: 400, msg: 'Missing data' });

    try {

        const { id: userId } = jwt.verify(accessToken, process.env.SECRET_JWT);

        if (!userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const user = await User.findByPk(userId);

        if (!user || user.status === false || user.id !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        const schedule = await Schedule.findByPk(id);
        if (!schedule) return res.status(404).send({ ok: false, status: 404, msg: 'Schedule not found' });

        if (schedule.userId !== userId) return res.status(401).send({ ok: false, status: 401, msg: 'Unauthorized' });

        await schedule.destroy();

        return res.send({ ok: true, status: 200, data: schedule, msg: 'Schedule deleted' });
    } catch (error) {
        return res.status(500).send({ ok: false, status: 500, msg: error });
    }
}


module.exports = { createSchedule, updateSchedule, deleteSchedule, getSchedules, getScheduleById }