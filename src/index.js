const Server = require('./models/server');
const { scheduleTimerActivator } = require('./services/schedule/scheduleTimer');
require('dotenv').config();


const server = new Server();

scheduleTimerActivator();

server.listen();