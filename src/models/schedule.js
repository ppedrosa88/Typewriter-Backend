const { DataTypes } = require("sequelize");
const { db } = require("../db/connection");

const Schedule = db.define('schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    blogId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    scheduledTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'fail'),
    }
});

module.exports = Schedule;