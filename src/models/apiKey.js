const { DataTypes } = require("sequelize");
const { db } = require("../db/connection");

const ApiKey = db.define('api_Keys', {
    userId: {
        type: DataTypes.BIGINT
    },
    apiKey: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    }
});

module.exports = ApiKey;