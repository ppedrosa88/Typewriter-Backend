const { DataTypes } = require("sequelize");
const { db } = require("../db/connection");

const Automation = db.define('Automation', {
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    previous_links: {
        type: DataTypes.JSON,
    },
    review_time: {
        type: DataTypes.INTEGER,
    },
    last_review_date: {
        type: DataTypes.DATE,
    },
    status: {
        type: DataTypes.ENUM('active', 'inactive', 'under_review'),
        defaultValue: 'active',
    },
    userId: {
        type: DataTypes.BIGINT
    },
    contentType: {
        type: DataTypes.ENUM('blog', 'news', 'facebook', 'linkedIn', 'twitter')
    }
});

module.exports = Automation;