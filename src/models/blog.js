const { DataTypes } = require("sequelize");
const { db } = require("../db/connection");

const Blog = db.define('blogs', {
    iaTitle: {
        type: DataTypes.STRING
    },
    title: {
        type: DataTypes.STRING
    },
    reference: {
        type: DataTypes.STRING
    },
    content: {
        type: DataTypes.JSON
    },
    status: {
        type: DataTypes.ENUM('draft', 'published', 'deleted')
    },
    category: {
        type: DataTypes.ENUM('blog', 'news', 'facebook', 'linkedIn', 'twitter')
    },
    userId: {
        type: DataTypes.BIGINT
    },
    createdByIa: {
        type: DataTypes.TINYINT
    }
});


module.exports = Blog;