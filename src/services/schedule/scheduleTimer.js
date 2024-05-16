const Schedule = require("../../models/schedule");
const { updateSchedule } = require("./scheduleUtils");


const schedulesTimeChecker = async () => {
    const currentDate = new Date();

    const schedules = await Schedule.findAll();

    schedules.map((schedule) => {
        if ((currentDate >= schedule.scheduledTime) && schedule.status === 'active') {
            updateSchedule(schedule.id)
        }
    })

}

const scheduleTimerActivator = () => {
    setInterval(schedulesTimeChecker, 900000); // 15 minutes = 900000
}

module.exports = { scheduleTimerActivator }