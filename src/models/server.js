const express = require('express');
const cors = require('cors');
const dbConnection = require('../db/db');
const logger = require('morgan');
const cookieParser = require('cookie-parser');


class Server {
    constructor() {

        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            blog: '/api/blogs',
            automation: '/api/automation',
            schedule: '/api/schedule'
        }

        this.connectDB();
        this.middlewares();
        this.routes();

    }

    async connectDB() {
        try {
            await dbConnection();
        } catch (error) {
            throw new Error(error)
        }
    }

    middlewares() {
        this.app.use(logger('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.text());
        this.app.use(cookieParser())

        // this.app.use(express.urlencoded({ extended: true }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/authRouter'))
        this.app.use(this.paths.blog, require('../routes/blogRouter'))
        this.app.use(this.paths.automation, require('../routes/automationRouter'))
        this.app.use(this.paths.schedule, require('../routes/scheduleRouter'))
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        })
    }
}

module.exports = Server;