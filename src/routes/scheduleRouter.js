const express = require('express');
const { createSchedule, updateSchedule, deleteSchedule, getSchedules, getScheduleById } = require('../controllers/scheduleController');

const scheduleRouter = express.Router();

scheduleRouter.get('/', getSchedules);
scheduleRouter.get('/:id', getScheduleById);
scheduleRouter.post('/', createSchedule);
scheduleRouter.patch('/:id', updateSchedule);
scheduleRouter.delete('/:id', deleteSchedule);


module.exports = scheduleRouter;